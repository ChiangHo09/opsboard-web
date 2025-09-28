/**
 * @file auth_middleware.go
 * @description 提供 JWT 认证中间件。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：确保了在任何认证失败的情况下（无论是缺少头、格式错误还是令牌无效），中间件都一致地返回 `401 Unauthorized`。
 *   - [原因]：此修改解决了当请求未携带认证头时，路由可能返回 `404` 而不是 `401` 的问题，为前端提供了更可靠、更一致的错误信号。
 */

package middleware

import (
	"errors"
	"net/http"
	"opsboard-backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			// [核心修复] 即使没有头，也应该返回 401
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "请求未包含认证信息"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "认证信息格式错误"})
			return
		}

		tokenString := parts[1]
		claims, err := utils.ValidateToken(tokenString)
		if err != nil {
			if errors.Is(err, jwt.ErrTokenExpired) {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "访问令牌已过期"})
			} else {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "无效的访问令牌"})
			}
			return
		}

		userIDStr, ok := claims["user_id"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "令牌中缺少或格式错误的用户信息"})
			return
		}

		c.Set("user_id", userIDStr)
		c.Next()
	}
}
