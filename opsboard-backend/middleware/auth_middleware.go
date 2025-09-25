/**
 * @file auth_middleware.go
 * @description 提供 JWT 认证中间件。
 * @modification
 *   - [UUID Migration]: 从 JWT claims 中提取 `user_id` 后，将其作为字符串直接存储到 Gin 的上下文中，不再转换为 `int64`。
 */
package middleware

import (
	"net/http"
	"opsboard-backend/utils"
	"strings"

	"github.com/gin-gonic/gin"
)

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

		// [核心修改] 从 claims 中提取 user_id 字符串
		userIDStr, ok := claims["user_id"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Token 中缺少或格式错误的用户信息"})
			return
		}

		// 将用户 ID 字符串存储在 context 中
		c.Set("user_id", userIDStr)

		c.Next()
	}
}
