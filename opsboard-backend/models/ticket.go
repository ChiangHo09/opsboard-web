/**
 * @file models/ticket.go
 * @description 定义了 Ticket 数据模型，该模型对应于数据库中的 `v_tickets` 视图。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：为 `Ticket` 结构体增加了 `PublicationTime` 和 `CompletionTime` 字段，以匹配更新后的 `v_tickets` 视图，支持更完整的时间线展示。
 */

package models

import (
	"database/sql"
	"time"
)

// Ticket 结构体定义了从 v_tickets 视图中查询出的统一工单格式。
type Ticket struct {
	ID               string `db:"id" json:"id"`
	CustomerName     string `db:"customer_name" json:"customerName"`
	Status           string `db:"status" json:"status"`
	OperationType    string `db:"operation_type" json:"operationType"`
	OperationContent string `db:"operation_content" json:"operationContent"`
	// [核心修改] 字段重命名和新增
	PublicationTime time.Time    `db:"publication_time" json:"publicationTime"`
	CompletionTime  sql.NullTime `db:"completion_time" json:"completionTime"`
}
