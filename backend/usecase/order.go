package usecase

import (
	"context"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

type OrderUseCase struct {
	repo port.OrderRepository
}

func NewOrderUseCase(repo port.OrderRepository) *OrderUseCase {
	return &OrderUseCase{repo: repo}
}

func (u *OrderUseCase) CreateOrder(ctx context.Context, order *domain.Order) (*domain.Order, error) {
	return u.repo.CreateOrder(ctx, order)
}

func (u *OrderUseCase) ListOrdersByUser(ctx context.Context, userID string) ([]*domain.Order, error) {
	return u.repo.ListOrdersByUser(ctx, userID)
}
