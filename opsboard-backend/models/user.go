/**
 * @file user.go
 * @description 定义 User 模型，与数据库中的 USERS 表对应。
 * @modification
 *   - [UUID Migration]: 将 `UserID` 字段的类型从 `int64` 修改为 `uuid.UUID`，以匹配数据库 schema 的变更。
 *   - [UUID Migration]: 在 `json:"id"` 标签后添加了 `example:"..."`，以便在 API 文档中提供一个有效的 UUID 示例。
 */
package models

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	UserID    uuid.UUID `json:"id" example:"a8b4b3e6-e3d2-4d1b-b8e1-7a2a3f4c5d6e"`
	Username  string    `json:"username"`
	Password  string    `json:"-"`
	Nickname  string    `json:"nickname"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
