package port

import (
	"context"

	"example.com/backend/domain"
)

type ProductRepository interface {
	ListProducts(ctx context.Context) ([]*domain.ProductWithInventory, error)
	GetProduct(ctx context.Context, id string) (*domain.ProductWithInventory, error)
	ListStores(ctx context.Context) ([]*domain.Store, error)
	// ListAvailableProducts returns products with stock > 0, ordered by expires_at asc.
	ListAvailableProducts(ctx context.Context) ([]*domain.ProductWithInventory, error)
}
