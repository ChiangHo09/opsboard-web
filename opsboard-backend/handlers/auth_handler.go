/**
 * @file auth_handler.go
 * @description 处理认证相关的 HTTP 请求，例如登录。
 * @modification
 *   - [Temp Change]: 根据测试要求，将密码验证逻辑从 `utils.CheckPasswordHash` 更改为直接的明文比较。
 *   - [Security Warning]: 明确指出这是一个临时性的、不安全的改动，仅用于测试目的。
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

// Login 处理用户登录请求
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

	// --- [核心修改] 密码验证逻辑 ---
	// 警告：这是一个临时的、不安全的明文密码比较，仅用于简化测试。
	// 在生产环境中，必须使用哈希密码验证。
	if req.Password != user.Password {
		// 原始的安全代码: if !utils.CheckPasswordHash(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "用户名或密码错误"})
		return
	}

	token, err := utils.GenerateToken(user.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成 token 失败"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
