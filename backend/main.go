package main

import (
	"context"
	"log"
	"os"

	"example.com/backend/adapter/ai"
	"example.com/backend/adapter/controller"
	"example.com/backend/adapter/repository"
	dbinfra "example.com/backend/infrastructure/db"
	"example.com/backend/router"
	"example.com/backend/usecase"
)

func main() {
	ctx := context.Background()

	// Infrastructure: DB connection pool
	pool, err := dbinfra.NewPool(ctx)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	// Adapter: repositories and AI gateway
	productRepo := repository.NewProductRepository(pool)
	orderRepo := repository.NewOrderRepository(pool)
	profileRepo := repository.NewProfileRepository(pool)
	gemini := ai.NewGeminiGateway(os.Getenv("GEMINI_API_KEY"))

	// Use cases
	productUC := usecase.NewProductUseCase(productRepo)
	orderUC := usecase.NewOrderUseCase(orderRepo)
	suggestUC := usecase.NewSuggestUseCase(productRepo, gemini)
	userUC := usecase.NewUserUseCase(profileRepo)

	// Controllers
	productCtrl := controller.NewProductController(productUC)
	suggestCtrl := controller.NewSuggestController(suggestUC)
	orderCtrl := controller.NewOrderController(orderUC)
	userCtrl := controller.NewUserController(userUC)

	// Router
	r := router.New(productCtrl, suggestCtrl, orderCtrl, userCtrl)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("starting server on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
