package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/backend/domain"
	"example.com/backend/usecase"
)

type SuggestController struct {
	uc *usecase.SuggestUseCase
}

func NewSuggestController(uc *usecase.SuggestUseCase) *SuggestController {
	return &SuggestController{uc: uc}
}

func (c *SuggestController) Suggest(ctx *gin.Context) {
	var req domain.SuggestRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	suggestions, err := c.uc.Suggest(ctx.Request.Context(), &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"suggestions": suggestions})
}
