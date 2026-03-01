package domain

type SuggestRequest struct {
	Mood      string   `json:"mood"`
	Allergies []string `json:"allergies"`
	Budget    int      `json:"budget"`
}

type Suggestion struct {
	ProductID          string `json:"product_id"`
	Name               string `json:"name"`
	Reason             string `json:"reason"`
	DiscountRate       int    `json:"discount_rate"`
	PriceAfterDiscount int    `json:"price_after_discount"`
}
