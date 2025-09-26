/**
 * @file opsboard-backend/handlers/auth_handler.go
 * @description 处理认证相关的 HTTP 请求，例如登录。
 * @modification
 *   - [Auditing]: 在用户成功登录后，调用 `services.CreateLog` 来异步记录登录成功事件。
 *   - [Auditing]: 日志详情中记录了用户的 IP 地址和 User-Agent，为安全审计提供了重要的上下文信息。
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

	token, err := utils.GenerateToken(user.UserID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成 token 失败"})
		return
	}

	// --- [核心修改] 集成日志记录 ---
	// 在成功响应之前，异步记录登录成功事件
	logDetails := services.LogDetails{
		"ip_address": c.ClientIP(),
		"user_agent": c.Request.UserAgent(),
	}
	services.CreateLog(user.UserID.String(), string(services.UserLoginSuccess), logDetails)
	// ---------------------------

	c.JSON(http.StatusOK, gin.H{"token": token})
}
