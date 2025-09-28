/**
 * @file user_handler.go
 * @description 处理用户相关的 HTTP 请求，例如获取当前用户信息。
 * @modification
 *   - [UUID Migration]: 导入了 `github.com/google/uuid` 包。
 *   - [UUID Migration]: 从 Gin 上下文中获取 `user_id` 后，将其解析为 `uuid.UUID` 类型，然后再传递给 `services.GetUserByID` 函数。
 *   - [Error Handling]: 添加了对 UUID 解析失败的错误处理。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// GetMe 获取当前已认证用户的信息
func GetMe(c *gin.Context) {
	// 从中间件设置的 context 中获取用户 ID 字符串
	userIDStr, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "无效的认证凭证"})
		return
	}

	// [核心修改] 将字符串解析为 UUID
	id, err := uuid.Parse(userIDStr.(string))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "认证凭证中的用户 ID 格式错误"})
		return
	}

	user, err := services.GetUserByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "用户不存在"})
		return
	}

	c.JSON(http.StatusOK, user)
}
