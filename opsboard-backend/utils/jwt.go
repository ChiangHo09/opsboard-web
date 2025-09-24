// File: opsboard-backend/utils/jwt.go
/**
 * @file jwt.go
 * @description 提供 JWT 的生成和验证功能。
 * @modification
 *   - [New File]: 创建此文件以封装 JWT 认证逻辑。
 */
package utils

import (
	"fmt"
	"opsboard-backend/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateToken 为指定用户 ID 生成一个 JWT
func GenerateToken(userID int64) (string, error) {
	cfg, _ := config.LoadConfig()
	secretKey := []byte(cfg.JWTSecret)

	// 创建 JWT 的 claims
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(), // Token 有效期 24 小时
		"iat":     time.Now().Unix(),
	}

	// 创建 token 对象
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// 使用密钥签名 token
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken 验证 JWT 并返回 claims
func ValidateToken(tokenString string) (jwt.MapClaims, error) {
	cfg, _ := config.LoadConfig()
	secretKey := []byte(cfg.JWTSecret)

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// 确保签名算法是我们期望的
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
