/**
 * @file services/server_service.go
 * @description 提供与服务器相关的业务逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `DeleteServerByID` 函数，用于根据给定的 ID 从数据库中删除服务器记录。
 *   - [实现]：该函数执行一个 `DELETE FROM servers ...` 的 SQL 语句，并返回操作是否成功。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetAllServers 从数据库中查询并返回所有服务器的列表。
func GetAllServers() ([]models.Server, error) {
	db := database.DB
	rows, err := db.Query(`
		SELECT 
			s.server_id, s.customer_id, s.server_name, s.ip_address, s.role,
			s.deployment_type, s.customer_note, s.usage_note, s.created_at, s.updated_at,
			c.customer_name 
		FROM servers s
		LEFT JOIN customers c ON s.customer_id = c.customer_id
		ORDER BY s.created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	servers := make([]models.Server, 0)
	for rows.Next() {
		var s models.Server
		if err := rows.Scan(
			&s.ServerID, &s.CustomerID, &s.ServerName, &s.IPAddress, &s.Role,
			&s.DeploymentType, &s.CustomerNote, &s.UsageNote, &s.CreatedAt, &s.UpdatedAt,
			&s.CustomerName,
		); err != nil {
			return nil, err
		}
		servers = append(servers, s)
	}

	return servers, nil
}

// DeleteServerByID 根据 ID 从数据库中删除一个服务器。
func DeleteServerByID(id string) error {
	db := database.DB
	_, err := db.Exec("DELETE FROM servers WHERE server_id = ?", id)
	return err
}
