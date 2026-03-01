package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

type ProductRepository struct {
	db *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{db: db}
}

// Compile-time check that ProductRepository implements port.ProductRepository.
var _ port.ProductRepository = (*ProductRepository)(nil)

// TODO(task-004): implement SQL queries.

func (r *ProductRepository) ListProducts(ctx context.Context) ([]*domain.ProductWithInventory, error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *ProductRepository) GetProduct(ctx context.Context, id string) (*domain.ProductWithInventory, error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *ProductRepository) ListStores(ctx context.Context) ([]*domain.Store, error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *ProductRepository) ListAvailableProducts(ctx context.Context) ([]*domain.ProductWithInventory, error) {
	return nil, fmt.Errorf("not implemented")
}
