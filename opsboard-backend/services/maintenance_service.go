/**
 * @file services/maintenance_service.go
 * @description 提供与维护任务相关的业务逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：修正了 SQL 查询语句中的表别名错误（将 `t` 全部更正为 `m`），以与 `FROM maintenance m` 子句保持一致。
 *   - [原因]：此修改解决了因 SQL 语法错误（引用了不存在的表别名）而导致的 `500 Internal Server Error`，修复了获取维护任务列表失败的根本原因。
 */
package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetAllMaintenanceTasks 从数据库中查询并返回所有维护任务的列表。
func GetAllMaintenanceTasks() ([]models.MaintenanceTask, error) {
	db := database.DB
	rows, err := db.Query(`
		SELECT 
			m.task_id, m.task_name, m.task_type, m.target_server_id,
			m.status, m.execution_time, m.log_output, m.created_at,
			s.server_name as target_server_name
		FROM maintenance m
		LEFT JOIN servers s ON m.target_server_id = s.server_id -- [核心修复] t -> m
		ORDER BY m.created_at DESC                             -- [核心修复] t -> m
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tasks := make([]models.MaintenanceTask, 0)
	for rows.Next() {
		var t models.MaintenanceTask
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
