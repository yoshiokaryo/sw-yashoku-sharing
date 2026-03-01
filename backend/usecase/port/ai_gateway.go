package port

import (
	"context"

	"example.com/backend/domain"
)

type AIGateway interface {
	Suggest(ctx context.Context, req *domain.SuggestRequest, products []*domain.ProductWithInventory) ([]*domain.Suggestion, error)
}
