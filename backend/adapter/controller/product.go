package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"example.com/backend/usecase"
)

type ProductController struct {
	uc *usecase.ProductUseCase
}

func NewProductController(uc *usecase.ProductUseCase) *ProductController {
	return &ProductController{uc: uc}
}

func (c *ProductController) ListProducts(ctx *gin.Context) {
	products, err := c.uc.ListProducts(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"products": products})
}

func (c *ProductController) GetProduct(ctx *gin.Context) {
	id := ctx.Param("id")
	product, err := c.uc.GetProduct(ctx.Request.Context(), id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, product)
}

func (c *ProductController) ListStores(ctx *gin.Context) {
	stores, err := c.uc.ListStores(ctx.Request.Context())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"stores": stores})
}
