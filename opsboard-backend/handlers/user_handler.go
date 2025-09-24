// File: opsboard-backend/handlers/user_handler.go
/**
 * @file user_handler.go
 * @description 处理用户相关的 HTTP 请求，例如获取当前用户信息。
 * @modification
 *   - [New File]: 创建此文件以处理 /api/users 路由。
 */
package handlers

import (
	"net/http"
	"opsboard-backend/services"

	"github.com/gin-gonic/gin"
)

// GetMe 获取当前已认证用户的信息
func GetMe(c *gin.Context) {
	// 从中间件设置的 context 中获取用户 ID
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "无效的认证凭证"})
		return
	}

	// 类型断言
	id, ok := userID.(int64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "用户 ID 格式错误"})
		return
	}

	user, err := services.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "用户不存在"})
		return
	}

	// models.User struct 已经处理了密码字段的 JSON 序列化
	c.JSON(http.StatusOK, user)
}
