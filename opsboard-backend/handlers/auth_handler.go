/**
 * @file opsboard-backend/handlers/auth_handler.go
 * @description 处理认证相关的 HTTP 请求，例如登录和刷新令牌。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：将响应结构体 `LoginResponse` 和 `RefreshTokenResponse` 的字段名改为首字母大写（例如 `AccessToken`）。
 *   - [原因]：此修改是解决“登录响应无效”问题的决定性方案。在 Go 中，只有导出的（首字母大写）结构体字段才能被 `encoding/json` 包序列化。通过将字段导出，并保留 `json:"..."` 标签，我们确保了后端能够生成包含正确 `accessToken` 和 `refreshToken` 字段的 JSON 响应，从而彻底修复了整个认证流程。
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

// [核心修复] 结构体字段名必须首字母大写才能被导出并序列化
type LoginResponse struct {
	AccessToken  string `json:"accessToken"`
	RefreshToken string `json:"refreshToken"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refreshToken" binding:"required"`
}

// [核心修复] 结构体字段名必须首字母大写
type RefreshTokenResponse struct {
	AccessToken string `json:"accessToken"`
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

	accessToken, err := utils.GenerateAccessToken(user.UserID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成访问令牌失败"})
		return
	}

	refreshToken, err := utils.GenerateRefreshToken(user.UserID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成刷新令牌失败"})
		return
	}

	logDetails := services.LogDetails{
		"ip_address": c.ClientIP(),
		"user_agent": c.Request.UserAgent(),
	}
	services.CreateLog(user.UserID.String(), string(services.UserLoginSuccess), logDetails)

	c.JSON(http.StatusOK, LoginResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	})
}

func RefreshToken(c *gin.Context) {
	var req RefreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "无效的请求体"})
		return
	}

	claims, err := utils.ValidateToken(req.RefreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "无效或已过期的刷新令牌"})
		return
	}

	userID, ok := claims["user_id"].(string)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "刷新令牌中缺少用户信息"})
		return
	}

	newAccessToken, err := utils.GenerateAccessToken(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "生成新的访问令牌失败"})
		return
	}

	c.JSON(http.StatusOK, RefreshTokenResponse{AccessToken: newAccessToken})
}
