/**
 * @file models/maintenance.go
 * @description 定义了 MaintenanceTask 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码重构]：将文件名从 `task.go` 重命名为 `maintenance.go`，结构体从 `Task` 重命名为 `MaintenanceTask`，以提高命名的业务清晰度。
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
