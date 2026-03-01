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

var ErrNotFound = errors.New("product not found")

type ProductRepository struct {
	db *pgxpool.Pool
}

func NewProductRepository(db *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{db: db}
}

// Compile-time check that ProductRepository implements port.ProductRepository.
var _ port.ProductRepository = (*ProductRepository)(nil)

const listProductsQuery = `
SELECT
  s.id, s.name, s.floor, s.section, s.created_at,
  p.id, p.store_id, p.name, p.category, p.price, p.image_url, p.created_at,
  i.id, i.product_id, i.stock, i.discount_rate, i.expires_at, i.updated_at
FROM public.stores s
JOIN public.products p ON p.store_id = s.id
JOIN public.inventory i ON i.product_id = p.id
WHERE i.stock > 0
ORDER BY i.expires_at ASC NULLS LAST, p.created_at ASC
`

func (r *ProductRepository) ListProducts(ctx context.Context) ([]*domain.ProductWithInventory, error) {
	rows, err := r.db.Query(ctx, listProductsQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []*domain.ProductWithInventory
	for rows.Next() {
		row, err := scanProductWithInventory(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}

const getProductQuery = `
SELECT
  s.id, s.name, s.floor, s.section, s.created_at,
  p.id, p.store_id, p.name, p.category, p.price, p.image_url, p.created_at,
  i.id, i.product_id, i.stock, i.discount_rate, i.expires_at, i.updated_at
FROM public.stores s
JOIN public.products p ON p.store_id = s.id
JOIN public.inventory i ON i.product_id = p.id
WHERE p.id = $1
`

func (r *ProductRepository) GetProduct(ctx context.Context, id string) (*domain.ProductWithInventory, error) {
	row := r.db.QueryRow(ctx, getProductQuery, id)
	out, err := scanProductWithInventoryRow(row)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, err
	}
	return out, nil
}

const listStoresQuery = `
SELECT id, name, floor, section, created_at
FROM public.stores
ORDER BY name ASC
`

func (r *ProductRepository) ListStores(ctx context.Context) ([]*domain.Store, error) {
	rows, err := r.db.Query(ctx, listStoresQuery)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var out []*domain.Store
	for rows.Next() {
		var s domain.Store
		var createdAt time.Time
		err := rows.Scan(&s.ID, &s.Name, &s.Floor, &s.Section, &createdAt)
		if err != nil {
			return nil, err
		}
		s.CreatedAt = createdAt
		out = append(out, &s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return out, nil
}

// ListAvailableProducts returns products with stock > 0, ordered by expires_at asc (for suggest use case).
func (r *ProductRepository) ListAvailableProducts(ctx context.Context) ([]*domain.ProductWithInventory, error) {
	return r.ListProducts(ctx)
}

// scanProductWithInventory scans one row from a multi-row result (rows.Scan).
func scanProductWithInventory(rows interface {
	Scan(dest ...any) error
}) (*domain.ProductWithInventory, error) {
	var (
		sID, sName, sFloor, sSection     string
		sCreatedAt                        time.Time
		pID, pStoreID, pName, pCategory  string
		pPrice                            int
		pImageURL                         string
		pCreatedAt                        time.Time
		iID, iProductID                   string
		iStock, iDiscountRate             int
		iExpiresAt                        *time.Time
		iUpdatedAt                        time.Time
	)
	err := rows.Scan(
		&sID, &sName, &sFloor, &sSection, &sCreatedAt,
		&pID, &pStoreID, &pName, &pCategory, &pPrice, &pImageURL, &pCreatedAt,
		&iID, &iProductID, &iStock, &iDiscountRate, &iExpiresAt, &iUpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	expiresAt := time.Time{}
	if iExpiresAt != nil {
		expiresAt = *iExpiresAt
	}
	return &domain.ProductWithInventory{
		Store: domain.Store{
			ID: sID, Name: sName, Floor: sFloor, Section: sSection, CreatedAt: sCreatedAt,
		},
		Product: domain.Product{
			ID: pID, StoreID: pStoreID, Name: pName, Category: pCategory,
			Price: pPrice, ImageURL: pImageURL, CreatedAt: pCreatedAt,
		},
		Inventory: domain.Inventory{
			ID: iID, ProductID: iProductID, Stock: iStock, DiscountRate: iDiscountRate,
			ExpiresAt: expiresAt, UpdatedAt: iUpdatedAt,
		},
	}, nil
}

// scanProductWithInventoryRow scans one row from QueryRow.
func scanProductWithInventoryRow(row interface {
	Scan(dest ...any) error
}) (*domain.ProductWithInventory, error) {
	var (
		sID, sName, sFloor, sSection     string
		sCreatedAt                        time.Time
		pID, pStoreID, pName, pCategory  string
		pPrice                            int
		pImageURL                         string
		pCreatedAt                        time.Time
		iID, iProductID                   string
		iStock, iDiscountRate             int
		iExpiresAt                        *time.Time
		iUpdatedAt                        time.Time
	)
	err := row.Scan(
		&sID, &sName, &sFloor, &sSection, &sCreatedAt,
		&pID, &pStoreID, &pName, &pCategory, &pPrice, &pImageURL, &pCreatedAt,
		&iID, &iProductID, &iStock, &iDiscountRate, &iExpiresAt, &iUpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	expiresAt := time.Time{}
	if iExpiresAt != nil {
		expiresAt = *iExpiresAt
	}
	return &domain.ProductWithInventory{
		Store: domain.Store{
			ID: sID, Name: sName, Floor: sFloor, Section: sSection, CreatedAt: sCreatedAt,
		},
		Product: domain.Product{
			ID: pID, StoreID: pStoreID, Name: pName, Category: pCategory,
			Price: pPrice, ImageURL: pImageURL, CreatedAt: pCreatedAt,
		},
		Inventory: domain.Inventory{
			ID: iID, ProductID: iProductID, Stock: iStock, DiscountRate: iDiscountRate,
			ExpiresAt: expiresAt, UpdatedAt: iUpdatedAt,
		},
	}, nil
}
