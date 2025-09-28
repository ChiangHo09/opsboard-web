/**
 * @file services/server_service.go
 * @description 提供与服务器相关的业务逻辑。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [健壮性修复]：在函数开头，将 `servers` 切片初始化为一个非 `nil` 的空切片 (`make([]models.Server, 0)`)，以确保在没有数据时返回 `[]` 而不是 `null`。
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

	// [核心修复] 初始化为一个非 nil 的空切片
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
