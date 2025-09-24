// File: opsboard-backend/models/user.go
/**
 * @file user.go
 * @description 定义 User 模型，与数据库中的 USERS 表对应。
 * @modification
 *   - [New File]: 创建此文件以定义核心数据结构。
 *   - [Security]: 在 Password 字段上使用 `json:"-"` 标签，确保密码哈希值永远不会通过 API 响应泄露。
 */
package models

import "time"

type User struct {
	UserID    int64     `json:"id"`
	Username  string    `json:"username"`
	Password  string    `json:"-"` // 关键：从不将密码发送到客户端
	Nickname  string    `json:"nickname"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
