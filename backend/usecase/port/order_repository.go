package port

import (
	"context"

	"example.com/backend/domain"
)

type OrderRepository interface {
	CreateOrder(ctx context.Context, order *domain.Order) (*domain.Order, error)
	GetOrderByID(ctx context.Context, id string) (*domain.Order, error)
	ListOrdersByUser(ctx context.Context, userID string) ([]*domain.Order, error)
}
