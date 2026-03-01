package controller

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/backend/adapter/middleware"
	"example.com/backend/adapter/repository"
	"example.com/backend/usecase"
)

type UserController struct {
	uc *usecase.UserUseCase
}

func NewUserController(uc *usecase.UserUseCase) *UserController {
	return &UserController{uc: uc}
}

func (c *UserController) GetMe(ctx *gin.Context) {
	userIDVal, ok := ctx.Get(middleware.UserIDKey)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDVal.(string)

	profile, err := c.uc.GetProfile(ctx.Request.Context(), userID)
	if err != nil {
		if errors.Is(err, repository.ErrProfileNotFound) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "profile not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, profile)
}
