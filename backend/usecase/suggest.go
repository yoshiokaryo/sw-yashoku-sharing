package usecase

import (
	"context"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

type SuggestUseCase struct {
	productRepo port.ProductRepository
	ai          port.AIGateway
}

func NewSuggestUseCase(productRepo port.ProductRepository, ai port.AIGateway) *SuggestUseCase {
	return &SuggestUseCase{productRepo: productRepo, ai: ai}
}

const maxProductsForSuggest = 20

func (u *SuggestUseCase) Suggest(ctx context.Context, req *domain.SuggestRequest) ([]*domain.Suggestion, error) {
	products, err := u.productRepo.ListAvailableProducts(ctx)
	if err != nil {
		return nil, err
	}
	if len(products) > maxProductsForSuggest {
		products = products[:maxProductsForSuggest]
	}
	return u.ai.Suggest(ctx, req, products)
}
