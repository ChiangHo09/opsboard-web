/**
 * @file models/changelog.go
 * @description 定义了 Changelog 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：为 `Changelog` 结构体增加了 `Status` 和 `CompletionTime` 字段，以匹配新的数据库表结构，支持状态管理功能。
 */

package models

import (
	"database/sql"
	"time"
)

// Changelog 结构体定义了更新日志的核心属性。
type Changelog struct {
	LogID          uint         `db:"log_id" json:"id"`
	CustomerID     uint         `db:"customer_id" json:"customerId"`
	UserID         string       `db:"user_id" json:"userId"`
	UpdateTime     time.Time    `db:"update_time" json:"updateTime"`
	UpdateType     string       `db:"update_type" json:"updateType"`
	UpdateContent  string       `db:"update_content" json:"updateContent"`
	Status         string       `db:"status" json:"status"`
	CompletionTime sql.NullTime `db:"completion_time" json:"completionTime"`
	CreatedAt      time.Time    `db:"created_at" json:"createdAt"`
	CustomerName   string       `db:"customer_name" json:"customerName"`
}
