package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/backend/adapter/middleware"
	"example.com/backend/domain"
	"example.com/backend/usecase"
)

type OrderController struct {
	uc *usecase.OrderUseCase
}

func NewOrderController(uc *usecase.OrderUseCase) *OrderController {
	return &OrderController{uc: uc}
}

// CreateOrderRequest is the body for POST /api/orders (items only; user_id from auth).
type CreateOrderRequest struct {
	Items []domain.OrderItem `json:"items"`
}

func (c *OrderController) CreateOrder(ctx *gin.Context) {
	userIDVal, ok := ctx.Get(middleware.UserIDKey)
	if !ok {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}
	userID := userIDVal.(string)

	var req CreateOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if len(req.Items) == 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "items required"})
		return
	}

	order := &domain.Order{UserID: userID, Status: "pending", Items: req.Items}
	order, err := c.uc.CreateOrder(ctx.Request.Context(), order)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, order)
}
