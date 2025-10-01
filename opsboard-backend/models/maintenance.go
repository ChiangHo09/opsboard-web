/**
 * @file models/maintenance.go
 * @description 定义了 MaintenanceTask 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：为 `MaintenanceTask` 结构体添加了 `TableName() string` 方法。
 *   - [原因]：此修改解决了因 GORM 的默认命名策略（将 `MaintenanceTask` 映射到 `maintenance_tasks`）与数据库实际表名 (`maintenance`) 不匹配而导致的查询失败问题。通过显式指定表名，我们确保了 GORM 能够生成正确的 SQL 语句。
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
	ExecutionTime    sql.NullTime   `db:"execution_time" json:"executionTime"`
	LogOutput        sql.NullString `db:"log_output" json:"logOutput"`
	CreatedAt        time.Time      `db:"created_at" json:"createdAt"`
	TargetServerName sql.NullString `db:"target_server_name" json:"target"`
}

// TableName 方法覆盖 GORM 的默认表名猜测。
// 它告诉 GORM，MaintenanceTask 结构体应映射到 `maintenance` 表。
func (MaintenanceTask) TableName() string {
	return "maintenance"
}
