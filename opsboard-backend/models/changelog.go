/**
 * @file models/changelog.go
 * @description 定义了 Changelog 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以定义核心业务实体“更新日志”。
 *   - [字段定义]：包含了更新日志的关键属性，与 `changelogs` 表的列完全匹配，并添加了 `json` 和 `db` 标签。
 *   - [关联字段]：额外添加了 `CustomerName` 字段，用于存储从 `customers` 表关联查询出的客户名称。
 */
package models

import (
	"time"
)

// Changelog 结构体定义了更新日志的核心属性，与数据库的 `changelogs` 表一一对应。
type Changelog struct {
	LogID         uint      `db:"log_id" json:"id"`
	CustomerID    uint      `db:"customer_id" json:"customerId"`
	UserID        string    `db:"user_id" json:"userId"` // UUID as string
	UpdateTime    time.Time `db:"update_time" json:"updateTime"`
	UpdateType    string    `db:"update_type" json:"updateType"`
	UpdateContent string    `db:"update_content" json:"updateContent"`
	CreatedAt     time.Time `db:"created_at" json:"createdAt"`

	// 用于从关联查询中获取客户名称，以满足前端的数据需求
	CustomerName string `db:"customer_name" json:"customerName"`
}
