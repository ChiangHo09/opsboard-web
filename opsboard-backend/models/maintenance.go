/**
 * @file models/maintenance.go
 * @description 定义了 MaintenanceTask 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：将 `ExecutionTime` 重命名为 `CompletionTime`，并新增 `PublicationTime` 字段，以匹配新的数据库表结构。
 */

package models

import (
	"database/sql"
	"time"
)

// MaintenanceTask 结构体定义了维护任务的核心属性。
type MaintenanceTask struct {
	TaskID           uint           `db:"task_id" json:"id"`
	TaskName         string         `db:"task_name" json:"taskName"`
	TaskType         string         `db:"task_type" json:"type"`
	TargetServerID   sql.NullInt64  `db:"target_server_id" json:"targetServerId"`
	Status           string         `db:"status" json:"status"`
	PublicationTime  time.Time      `db:"publication_time" json:"publicationTime"`
	CompletionTime   sql.NullTime   `db:"completion_time" json:"completionTime"`
	LogOutput        sql.NullString `db:"log_output" json:"logOutput"`
	CreatedAt        time.Time      `db:"created_at" json:"createdAt"`
	TargetServerName sql.NullString `db:"target_server_name" json:"target"`
}

// TableName 方法覆盖 GORM 的默认表名猜测。
func (MaintenanceTask) TableName() string {
	return "maintenance"
}
