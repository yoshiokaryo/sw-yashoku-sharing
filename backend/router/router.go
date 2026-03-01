package router

import (
	"github.com/gin-gonic/gin"

	"example.com/backend/adapter/controller"
	"example.com/backend/adapter/middleware"
)

// New builds and returns a Gin engine with all routes registered.
func New(
	productCtrl *controller.ProductController,
	suggestCtrl *controller.SuggestController,
	orderCtrl *controller.OrderController,
	userCtrl *controller.UserController,
) *gin.Engine {
	r := gin.Default()
	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		// Public endpoints
		api.GET("/products", productCtrl.ListProducts)
		api.GET("/products/:id", productCtrl.GetProduct)
		api.GET("/stores", productCtrl.ListStores)

		// Authenticated endpoints
		authed := api.Group("")
		authed.Use(middleware.Auth())
		{
			authed.POST("/suggest", suggestCtrl.Suggest)
			authed.POST("/orders", orderCtrl.CreateOrder)
			authed.GET("/users/me", userCtrl.GetMe)
		}
	}

	return r
}
