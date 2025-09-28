/**
 * @file models/task.go
 * @description 定义了 Task 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以定义核心业务实体“巡检备份任务”。
 *   - [字段定义]：包含了任务的关键属性，与 `tasks` 表的列完全匹配，并添加了 `json` 和 `db` 标签。
 *   - [关联字段]：额外添加了 `TargetServerName` 字段，用于存储从 `servers` 表关联查询出的目标服务器名称。
 */

package models

import (
	"database/sql"
	"time"
)

// Task 结构体定义了巡检备份任务的核心属性，与数据库的 `tasks` 表一一对应。
type Task struct {
	TaskID         uint           `db:"task_id" json:"id"`
	TaskName       string         `db:"task_name" json:"taskName"`
	TaskType       string         `db:"task_type" json:"type"`
	TargetServerID sql.NullInt64  `db:"target_server_id" json:"targetServerId"`
	Status         string         `db:"status" json:"status"`
	ExecutionTime  sql.NullTime   `db:"execution_time" json:"executionTime"`
	LogOutput      sql.NullString `db:"log_output" json:"logOutput"`
	CreatedAt      time.Time      `db:"created_at" json:"createdAt"`

	// 用于从关联查询中获取目标服务器名称
	TargetServerName sql.NullString `db:"target_server_name" json:"target"`
}
