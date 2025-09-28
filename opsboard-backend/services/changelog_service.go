/**
 * @file services/changelog_service.go
 * @description 提供与更新日志相关的业务逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以封装获取更新日志数据的业务逻辑。
 *   - [功能]：`GetAllChangelogs` 函数执行真实的数据库查询，通过 `LEFT JOIN` 从 `customers` 表获取客户名称，并按更新时间倒序返回所有日志。
 */
package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetAllChangelogs 从数据库中查询并返回所有更新日志的列表。
func GetAllChangelogs() ([]models.Changelog, error) {
	db := database.DB
	rows, err := db.Query(`
		SELECT 
			cl.log_id, cl.customer_id, cl.user_id, cl.update_time, 
			cl.update_type, cl.update_content, cl.created_at,
			c.customer_name
		FROM changelogs cl
		LEFT JOIN customers c ON cl.customer_id = c.customer_id
		ORDER BY cl.update_time DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var changelogs []models.Changelog
	for rows.Next() {
		var cl models.Changelog
		if err := rows.Scan(
			&cl.LogID, &cl.CustomerID, &cl.UserID, &cl.UpdateTime,
			&cl.UpdateType, &cl.UpdateContent, &cl.CreatedAt,
			&cl.CustomerName,
		); err != nil {
			return nil, err
		}
		changelogs = append(changelogs, cl)
	}

	return changelogs, nil
}
