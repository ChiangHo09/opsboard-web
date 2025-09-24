// File: opsboard-backend/utils/password.go
/**
 * @file password.go
 * @description 提供密码哈希和验证的工具函数。
 * @modification
 *   - [New File]: 创建此文件以封装密码处理逻辑。
 *   - [Security]: 使用 bcrypt 算法，这是当前密码哈希的标准实践。
 */
package utils

import "golang.org/x/crypto/bcrypt"

// HashPassword 使用 bcrypt 对密码进行哈希处理
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

// CheckPasswordHash 将提供的密码与哈希值进行比较
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
