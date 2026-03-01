package middleware

import (
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

// CORS returns a Gin middleware that sets CORS headers.
// Allowed origins are read from the FRONTEND_URL environment variable (comma-separated).
// http://localhost:3000 is always allowed for local development.
func CORS() gin.HandlerFunc {
	frontendURL := os.Getenv("FRONTEND_URL")
	allowed := map[string]bool{
		"http://localhost:3000": true,
	}
	for _, u := range strings.Split(frontendURL, ",") {
		u = strings.TrimSpace(u)
		if u != "" {
			allowed[u] = true
		}
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if allowed[origin] {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization")
			c.Header("Access-Control-Allow-Credentials", "true")
		}
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
