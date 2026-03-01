package repository

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"

	"example.com/backend/domain"
	"example.com/backend/usecase/port"
)

var ErrProfileNotFound = errors.New("profile not found")

type ProfileRepository struct {
	db *pgxpool.Pool
}

func NewProfileRepository(db *pgxpool.Pool) *ProfileRepository {
	return &ProfileRepository{db: db}
}

// Compile-time check that ProfileRepository implements port.ProfileRepository.
var _ port.ProfileRepository = (*ProfileRepository)(nil)

func (r *ProfileRepository) GetByUserID(ctx context.Context, userID string) (*domain.Profile, error) {
	var p domain.Profile
	var createdAt, updatedAt time.Time
	var allergies pgtype.Array[string]
	err := r.db.QueryRow(ctx,
		`SELECT id, display_name, allergies, created_at, updated_at FROM public.profiles WHERE id = $1`,
		userID,
	).Scan(&p.ID, &p.DisplayName, &allergies, &createdAt, &updatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrProfileNotFound
		}
		return nil, err
	}
	if allergies.Valid {
		p.Allergies = allergies.Elements
	}
	if p.Allergies == nil {
		p.Allergies = []string{}
	}
	p.CreatedAt = createdAt
	p.UpdatedAt = updatedAt
	return &p, nil
}
