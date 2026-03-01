package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const UserIDKey = "user_id"

// customClaims has "sub" for Supabase user id.
type customClaims struct {
	Sub string `json:"sub"`
	jwt.RegisteredClaims
}

// Auth returns a Gin middleware that validates Supabase JWT and sets user_id in the context.
// Set SUPABASE_JWT_SECRET (or JWT_SECRET) to verify signature. If unset, only payload is decoded (dev only).
func Auth() gin.HandlerFunc {
	secret := os.Getenv("SUPABASE_JWT_SECRET")
	if secret == "" {
		secret = os.Getenv("JWT_SECRET")
	}

	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing token"})
			return
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")

		userID, err := extractUserID(tokenStr, secret)
		if err != nil || userID == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		c.Set(UserIDKey, userID)
		c.Next()
	}
}

// extractUserID verifies (if secret is set) or decodes the JWT and returns the sub claim.
func extractUserID(tokenStr string, secret string) (string, error) {
	if secret != "" {
		token, err := jwt.ParseWithClaims(tokenStr, &customClaims{}, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return []byte(secret), nil
		})
		if err != nil {
			return "", err
		}
		claims, ok := token.Claims.(*customClaims)
		if !ok || !token.Valid {
			return "", fmt.Errorf("invalid claims")
		}
		return claims.Sub, nil
	}

	// No secret: decode payload only (dev only; do not use in production)
	token, _, err := jwt.NewParser().ParseUnverified(tokenStr, &customClaims{})
	if err != nil {
		return "", err
	}
	claims, ok := token.Claims.(*customClaims)
	if !ok {
		return "", fmt.Errorf("invalid claims")
	}
	return claims.Sub, nil
}
