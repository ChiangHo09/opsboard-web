/**
 * @file services/server_service.go
 * @description 提供与服务器相关的业务逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以封装获取服务器数据的业务逻辑。
 *   - [真实数据]：实现了 `GetAllServers` 函数，该函数执行真实的数据库查询，通过 LEFT JOIN 从 `customers` 表获取客户名称，并返回服务器列表。
 */
package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetAllServers 从数据库中查询并返回所有服务器的列表。
func GetAllServers() ([]models.Server, error) {
	db := database.DB
	// 确保您的 customers 表中有名为 customer_name 的列
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

	var servers []models.Server
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
