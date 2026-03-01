package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

var ErrOrderNotFound = errors.New("order not found")

type OrderRepository struct {
	db *pgxpool.Pool
}

func NewOrderRepository(db *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{db: db}
}

// Compile-time check that OrderRepository implements port.OrderRepository.
var _ port.OrderRepository = (*OrderRepository)(nil)

func (r *OrderRepository) CreateOrder(ctx context.Context, order *domain.Order) (*domain.Order, error) {
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var orderID string
	err = tx.QueryRow(ctx,
		`INSERT INTO public.orders (user_id, status, created_at) VALUES ($1, $2, now()) RETURNING id, created_at`,
		order.UserID, "pending",
	).Scan(&orderID, &order.CreatedAt)
	if err != nil {
		return nil, err
	}

	order.ID = orderID
	order.Status = "pending"

	for i := range order.Items {
		var itemID string
		err = tx.QueryRow(ctx,
			`INSERT INTO public.order_items (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id`,
			orderID, order.Items[i].ProductID, order.Items[i].Quantity,
		).Scan(&itemID)
		if err != nil {
			return nil, err
		}
		order.Items[i].ID = itemID
		order.Items[i].OrderID = orderID
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}
	return order, nil
}

func (r *OrderRepository) GetOrderByID(ctx context.Context, id string) (*domain.Order, error) {
	var o domain.Order
	var createdAt time.Time
	err := r.db.QueryRow(ctx,
		`SELECT id, user_id, status, created_at FROM public.orders WHERE id = $1`,
		id,
	).Scan(&o.ID, &o.UserID, &o.Status, &createdAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrOrderNotFound
		}
		return nil, err
	}
	o.CreatedAt = createdAt

	rows, err := r.db.Query(ctx,
		`SELECT id, order_id, product_id, quantity FROM public.order_items WHERE order_id = $1 ORDER BY id`,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var item domain.OrderItem
		err := rows.Scan(&item.ID, &item.OrderID, &item.ProductID, &item.Quantity)
		if err != nil {
			return nil, err
		}
		o.Items = append(o.Items, item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return &o, nil
}

func (r *OrderRepository) ListOrdersByUser(ctx context.Context, userID string) ([]*domain.Order, error) {
	rows, err := r.db.Query(ctx,
		`SELECT id, user_id, status, created_at FROM public.orders WHERE user_id = $1 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []*domain.Order
	for rows.Next() {
		var o domain.Order
		var createdAt time.Time
		if err := rows.Scan(&o.ID, &o.UserID, &o.Status, &createdAt); err != nil {
			return nil, err
		}
		o.CreatedAt = createdAt
		orders = append(orders, &o)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	// Optionally load items for each order (simplified: items not loaded in list)
	for _, o := range orders {
		itemRows, err := r.db.Query(ctx, `SELECT id, order_id, product_id, quantity FROM public.order_items WHERE order_id = $1`, o.ID)
		if err != nil {
			return nil, err
		}
		for itemRows.Next() {
			var item domain.OrderItem
			_ = itemRows.Scan(&item.ID, &item.OrderID, &item.ProductID, &item.Quantity)
			o.Items = append(o.Items, item)
		}
		itemRows.Close()
	}
	return orders, nil
}
