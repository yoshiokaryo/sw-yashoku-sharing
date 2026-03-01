package domain

import "time"

type Store struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Floor     string    `json:"floor"`
	Section   string    `json:"section"`
	CreatedAt time.Time `json:"created_at"`
}

type Product struct {
	ID        string    `json:"id"`
	StoreID   string    `json:"store_id"`
	Name      string    `json:"name"`
	Category  string    `json:"category"`
	Price     int       `json:"price"`
	ImageURL  string    `json:"image_url"`
	CreatedAt time.Time `json:"created_at"`
}

type Inventory struct {
	ID           string    `json:"id"`
	ProductID    string    `json:"product_id"`
	Stock        int       `json:"stock"`
	DiscountRate int       `json:"discount_rate"`
	ExpiresAt    time.Time `json:"expires_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ProductWithInventory struct {
	Product   Product
	Store     Store
	Inventory Inventory
}
