package ai

import (
	"context"
	"fmt"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

// GeminiGateway implements port.AIGateway using Google AI Studio (Gemini).
// TODO(task-005): Implement actual Gemini API calls using github.com/google/generative-ai-go.
type GeminiGateway struct {
	apiKey string
}

func NewGeminiGateway(apiKey string) *GeminiGateway {
	return &GeminiGateway{apiKey: apiKey}
}

// Compile-time check that GeminiGateway implements port.AIGateway.
var _ port.AIGateway = (*GeminiGateway)(nil)

func (g *GeminiGateway) Suggest(ctx context.Context, req *domain.SuggestRequest, products []*domain.ProductWithInventory) ([]*domain.Suggestion, error) {
	// TODO(task-005): Build prompt from req and products, call Gemini API, parse response.
	return nil, fmt.Errorf("not implemented")
}
