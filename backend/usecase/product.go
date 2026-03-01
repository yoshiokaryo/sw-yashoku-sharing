package usecase

import (
	"context"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

type ProductUseCase struct {
	repo port.ProductRepository
}

func NewProductUseCase(repo port.ProductRepository) *ProductUseCase {
	return &ProductUseCase{repo: repo}
}

func (u *ProductUseCase) ListProducts(ctx context.Context) ([]*domain.ProductWithInventory, error) {
	return u.repo.ListProducts(ctx)
}

func (u *ProductUseCase) GetProduct(ctx context.Context, id string) (*domain.ProductWithInventory, error) {
	return u.repo.GetProduct(ctx, id)
}

func (u *ProductUseCase) ListStores(ctx context.Context) ([]*domain.Store, error) {
	return u.repo.ListStores(ctx)
}
