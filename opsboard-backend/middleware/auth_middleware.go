// File: opsboard-backend/middleware/auth_middleware.go
/**
 * @file auth_middleware.go
 * @description 提供 JWT 认证中间件。
 * @modification
 *   - [New File]: 创建此文件以保护需要认证的路由。
 */
package middleware

import (
	"net/http"
	"opsboard-backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware 检查请求头中的 JWT
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
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
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "无效或已过期的 Token"})
			return
		}

		// 从 claims 中提取 user_id 并将其转换为 int64
		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Token 中缺少用户信息"})
			return
		}
		userID := int64(userIDFloat)

		// 将用户 ID 存储在 context 中，以便后续的 handler 使用
		c.Set("user_id", userID)

		c.Next()
	}
}
