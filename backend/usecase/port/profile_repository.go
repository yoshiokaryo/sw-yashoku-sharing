package port

import (
	"context"

	"example.com/backend/domain"
)

type ProfileRepository interface {
	GetByUserID(ctx context.Context, userID string) (*domain.Profile, error)
}
