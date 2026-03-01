package repository

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

type OrderRepository struct {
	db *pgxpool.Pool
}

func NewOrderRepository(db *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{db: db}
}

// Compile-time check that OrderRepository implements port.OrderRepository.
var _ port.OrderRepository = (*OrderRepository)(nil)

// TODO(task-005): implement SQL queries.

func (r *OrderRepository) CreateOrder(ctx context.Context, order *domain.Order) (*domain.Order, error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *OrderRepository) GetOrderByID(ctx context.Context, id string) (*domain.Order, error) {
	return nil, fmt.Errorf("not implemented")
}

func (r *OrderRepository) ListOrdersByUser(ctx context.Context, userID string) ([]*domain.Order, error) {
	return nil, fmt.Errorf("not implemented")
}
