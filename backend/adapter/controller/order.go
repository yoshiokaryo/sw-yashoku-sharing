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

func (c *OrderController) CreateOrder(ctx *gin.Context) {
	userID, _ := ctx.Get(middleware.UserIDKey)

	var req domain.Order
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.UserID = userID.(string)

	order, err := c.uc.CreateOrder(ctx.Request.Context(), &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusCreated, order)
}
