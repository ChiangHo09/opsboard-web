/**
 * @file services/task_service.go
 * @description 提供与巡检备份任务相关的业务逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：在函数开头，将 `tasks` 切片初始化为一个非 `nil` 的空切片 (`make([]models.Task, 0)`)。
 *   - [原因]：此修改解决了当数据库中没有任务数据时，后端会返回 JSON `null` 而不是空数组 `[]` 的问题。通过确保函数在任何情况下都返回一个有效的切片，我们修复了导致前端出现 "Cannot read properties of null (reading 'map')" 错误的根本原因。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetAllTasks 从数据库中查询并返回所有巡检备份任务的列表。
func GetAllTasks() ([]models.Task, error) {
	db := database.DB
	rows, err := db.Query(`
		SELECT 
			t.task_id, t.task_name, t.task_type, t.target_server_id,
			t.status, t.execution_time, t.log_output, t.created_at,
			s.server_name as target_server_name
		FROM tasks t
		LEFT JOIN servers s ON t.target_server_id = s.server_id
		ORDER BY t.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// [核心修复] 初始化为一个非 nil 的空切片
	tasks := make([]models.Task, 0)

	for rows.Next() {
		var t models.Task
		if err := rows.Scan(
			&t.TaskID, &t.TaskName, &t.TaskType, &t.TargetServerID,
			&t.Status, &t.ExecutionTime, &t.LogOutput, &t.CreatedAt,
			&t.TargetServerName,
		); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}

	return tasks, nil
}
