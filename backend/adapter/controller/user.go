package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/backend/adapter/middleware"
)

type UserController struct{}

func NewUserController() *UserController {
	return &UserController{}
}

func (c *UserController) GetMe(ctx *gin.Context) {
	userID, _ := ctx.Get(middleware.UserIDKey)
	// TODO(task-004): Fetch user profile from Supabase profiles table.
	ctx.JSON(http.StatusOK, gin.H{"user_id": userID})
}
