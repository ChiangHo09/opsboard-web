/**
 * @file jwt.go
 * @description 提供 JWT 的生成和验证功能。
 * @modification
 *   - [UUID Migration]: `GenerateToken` 函数的参数类型从 `int64` 修改为 `string`，以直接接受 UUID 字符串。
 *   - [UUID Migration]: JWT 的 `user_id` claim 现在存储的是 UUID 字符串，而不是数字 ID。
 */
package utils

import (
	"fmt"
	"opsboard-backend/config"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// GenerateToken 为指定用户 ID (UUID 字符串) 生成一个 JWT
func GenerateToken(userID string) (string, error) { // [核心修改] 参数类型变为 string
	cfg, _ := config.LoadConfig()
	secretKey := []byte(cfg.JWTSecret)

	claims := jwt.MapClaims{
		"user_id": userID, // [核心修改] 直接存储 UUID 字符串
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
		"iat":     time.Now().Unix(),
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
