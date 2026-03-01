package domain

import "time"

type Profile struct {
	ID          string    `json:"id"`
	DisplayName string    `json:"display_name"`
	Allergies   []string  `json:"allergies"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
