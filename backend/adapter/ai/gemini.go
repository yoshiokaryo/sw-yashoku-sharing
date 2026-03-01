package ai

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"regexp"
	"strings"

	"google.golang.org/genai"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

const suggestLimit = 20

// GeminiGateway implements port.AIGateway using Google AI Studio (Gemini).
type GeminiGateway struct {
	apiKey string
}

func NewGeminiGateway(apiKey string) *GeminiGateway {
	return &GeminiGateway{apiKey: apiKey}
}

// Compile-time check that GeminiGateway implements port.AIGateway.
var _ port.AIGateway = (*GeminiGateway)(nil)

func (g *GeminiGateway) Suggest(ctx context.Context, req *domain.SuggestRequest, products []*domain.ProductWithInventory) ([]*domain.Suggestion, error) {
	if g.apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY is not set")
	}
	if len(products) == 0 {
		return []*domain.Suggestion{}, nil
	}

	if len(products) > suggestLimit {
		products = products[:suggestLimit]
	}

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey:  g.apiKey,
		Backend: genai.BackendGeminiAPI,
	})
	if err != nil {
		return nil, fmt.Errorf("genai client: %w", err)
	}

	prompt := g.buildPrompt(req, products)
	model := "gemini-2.0-flash"
	if m := os.Getenv("GEMINI_MODEL"); m != "" {
		model = strings.TrimSpace(m)
	}

	resp, err := client.Models.GenerateContent(ctx, model, []*genai.Content{
		{Parts: []*genai.Part{{Text: prompt}}},
	}, nil)
	if err != nil {
		return nil, fmt.Errorf("generate content: %w", err)
	}

	text := g.extractText(resp)
	if text == "" {
		return []*domain.Suggestion{}, nil
	}

	return g.parseSuggestions(text, products)
}

func (g *GeminiGateway) buildPrompt(req *domain.SuggestRequest, products []*domain.ProductWithInventory) string {
	var b strings.Builder
	b.WriteString("あなたは学食・カフェのメニューを提案するアシスタントです。\n\n")
	b.WriteString("【ユーザーのリクエスト】\n")
	b.WriteString("気分: " + req.Mood + "\n")
	if len(req.Allergies) > 0 {
		b.WriteString("避けたい食材・アレルギー: " + strings.Join(req.Allergies, ", ") + "\n")
	}
	if req.Budget > 0 {
		b.WriteString("予算(円): " + fmt.Sprint(req.Budget) + "\n")
	}
	b.WriteString("\n【メニュー一覧（この中から選んで提案すること）】\n")
	for i, p := range products {
		priceAfter := p.Product.Price * (100 - p.Inventory.DiscountRate) / 100
		b.WriteString(fmt.Sprintf("%d. product_id=%s | 名前=%s | カテゴリ=%s | 定価=%d円 | 割引率=%d%% | 割引後=%d円\n",
			i+1, p.Product.ID, p.Product.Name, p.Product.Category, p.Product.Price, p.Inventory.DiscountRate, priceAfter))
	}
	b.WriteString("\n上記メニューから、ユーザーのリクエストに合うものを最大5つ選び、理由とともに提案してください。\n")
	b.WriteString("回答は次のJSON配列のみを出力してください。それ以外の文字は含めないこと。\n")
	b.WriteString("[{\"product_id\": \"(選んだ商品のID)\", \"name\": \"(商品名)\", \"reason\": \"(提案理由)\", \"discount_rate\": (割引率の数値), \"price_after_discount\": (割引後価格の数値)}]\n")
	return b.String()
}

func (g *GeminiGateway) extractText(resp *genai.GenerateContentResponse) string {
	if resp == nil || len(resp.Candidates) == 0 {
		return ""
	}
	cand := resp.Candidates[0]
	if cand.Content == nil || len(cand.Content.Parts) == 0 {
		return ""
	}
	for _, p := range cand.Content.Parts {
		if p.Text != "" {
			return p.Text
		}
	}
	return ""
}

var jsonArrayRE = regexp.MustCompile(`\[[\s\S]*\]`)

func (g *GeminiGateway) parseSuggestions(text string, products []*domain.ProductWithInventory) ([]*domain.Suggestion, error) {
	text = strings.TrimSpace(text)
	// Strip markdown code block if present
	if strings.HasPrefix(text, "```") {
		lines := strings.SplitN(text, "\n", 2)
		if len(lines) > 1 {
			text = lines[1]
		}
		text = strings.TrimSuffix(text, "```")
		text = strings.TrimSpace(text)
	}
	// Extract JSON array
	if m := jsonArrayRE.FindString(text); m != "" {
		text = m
	}

	var raw []struct {
		ProductID          string `json:"product_id"`
		Name               string `json:"name"`
		Reason             string `json:"reason"`
		DiscountRate       int    `json:"discount_rate"`
		PriceAfterDiscount int    `json:"price_after_discount"`
	}
	if err := json.Unmarshal([]byte(text), &raw); err != nil {
		return nil, fmt.Errorf("parse suggestions JSON: %w", err)
	}

	productByID := make(map[string]*domain.ProductWithInventory)
	for _, p := range products {
		productByID[p.Product.ID] = p
	}

	out := make([]*domain.Suggestion, 0, len(raw))
	for _, r := range raw {
		if r.ProductID == "" {
			continue
		}
		s := domain.Suggestion{
			ProductID:          r.ProductID,
			Name:               r.Name,
			Reason:             r.Reason,
			DiscountRate:       r.DiscountRate,
			PriceAfterDiscount: r.PriceAfterDiscount,
		}
		if p, ok := productByID[r.ProductID]; ok {
			if s.Name == "" {
				s.Name = p.Product.Name
			}
			if s.DiscountRate == 0 && s.PriceAfterDiscount == 0 {
				s.DiscountRate = p.Inventory.DiscountRate
				s.PriceAfterDiscount = p.Product.Price * (100 - p.Inventory.DiscountRate) / 100
			}
		}
		out = append(out, &s)
	}
	return out, nil
}
