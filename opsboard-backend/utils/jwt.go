/**
 * @file jwt.go
 * @description 提供 JWT 的生成和验证功能，支持访问令牌和刷新令牌。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [架构重构]：将原有的 `GenerateToken` 函数重命名为 `GenerateAccessToken`，并显著缩短其有效期（例如15分钟），以提高安全性。
 *   - [新增功能]：新增了 `GenerateRefreshToken` 函数，用于生成一个长生命周期的刷新令牌（例如7天）。
 *   - [职责明确]：现在此文件明确支持两种令牌的生成，为实现标准的刷新令牌（Refresh Token）认证流程提供了基础。
 */
package utils

import (
	"fmt"
	"opsboard-backend/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateAccessToken 为指定用户 ID (UUID 字符串) 生成一个短生命周期的访问令牌
func GenerateAccessToken(userID string) (string, error) {
	cfg, _ := config.LoadConfig()
	secretKey := []byte(cfg.JWTSecret)

	claims := jwt.MapClaims{
		"user_id": userID,
		// [核心修改] 将有效期缩短为15分钟
		"exp": time.Now().Add(time.Minute * 15).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// GenerateRefreshToken 为指定用户 ID (UUID 字符串) 生成一个长生命周期的刷新令牌
func GenerateRefreshToken(userID string) (string, error) {
	cfg, _ := config.LoadConfig()
	secretKey := []byte(cfg.JWTSecret) // 在生产环境中，刷新令牌应该使用不同的密钥

	claims := jwt.MapClaims{
		"user_id": userID,
		// [核心修改] 将有效期延长为7天
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(),
		"iat": time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken 验证 JWT 并返回 claims (逻辑保持不变)
func ValidateToken(tokenString string) (jwt.MapClaims, error) {
	cfg, _ := config.LoadConfig()
	secretKey := []byte(cfg.JWTSecret)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("非预期的签名算法: %v", token.Header["alg"])
		}
		return secretKey, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("无效的 token")
}
