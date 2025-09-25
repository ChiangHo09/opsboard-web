/**
 * @file auth_handler.go
 * @description 处理认证相关的 HTTP 请求，例如登录。
 * @modification
 *   - [UUID Migration]: 在生成 JWT 时，将用户的 UUID (`user.UserID`) 转换为字符串 `user.UserID.String()` 后再传递给 `GenerateToken` 函数。
 */
package handlers

import (
	"database/sql"
	"net/http"
	"opsboard-backend/services"
	"opsboard-backend/utils"

	"github.com/gin-gonic/gin"
)

type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "无效的请求体"})
		return
	}

	user, err := services.GetUserByUsername(req.Username)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "用户名或密码错误"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "数据库查询失败"})
		return
	}

	if req.Password != user.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "用户名或密码错误"})
		return
	}

	// [核心修改] 将 UUID 对象转换为字符串再生成 token
	token, err := utils.GenerateToken(user.UserID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成 token 失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
