package usecase

import (
	"context"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

type UserUseCase struct {
	profileRepo port.ProfileRepository
}

func NewUserUseCase(profileRepo port.ProfileRepository) *UserUseCase {
	return &UserUseCase{profileRepo: profileRepo}
}

func (u *UserUseCase) GetProfile(ctx context.Context, userID string) (*domain.Profile, error) {
	return u.profileRepo.GetByUserID(ctx, userID)
}
