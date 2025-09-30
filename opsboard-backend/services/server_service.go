/**
 * @file services/server_service.go
 * @description 提供与服务器相关的业务逻辑，使用 GORM 实现分页查询和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [架构重构]：使用 GORM ORM 框架彻底重构了数据查询逻辑，取代了手写的 SQL 和 `rows.Scan`。
 *   - [后端分页]：实现了完整的后端分页功能。`GetPaginatedServers` 函数现在接收 `page` 和 `pageSize` 参数，并返回包含数据列表和总记录数的结果。
 *   - [删除逻辑]：`DeleteServerByID` 函数现在也使用 GORM 来执行删除操作，以保持技术栈的一致性。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// PaginatedServersResult 定义了分页查询的返回结构
type PaginatedServersResult struct {
	Total int64           `json:"total"`
	Data  []models.Server `json:"data"`
}

// GetPaginatedServers 使用 GORM 从数据库中分页查询服务器列表。
func GetPaginatedServers(page, pageSize int) (*PaginatedServersResult, error) {
	db := database.GormDB
	var servers []models.Server
	var total int64

	// 1. 构建基础查询链，用于计算总数
	// GORM 会自动处理 `servers` 表名
	query := db.Model(&models.Server{})

	// 2. 执行 COUNT 查询获取总记录数
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// 3. 计算分页所需的 offset
	offset := (page - 1) * pageSize

	// 4. 在基础查询链上继续添加分页、排序和关联查询，然后执行
	err := query.
		Joins("LEFT JOIN customers c ON servers.customer_id = c.customer_id").
		Select("servers.*, c.customer_name").
		Offset(offset).
		Limit(pageSize).
		Order("servers.created_at DESC").
		Find(&servers).Error

	if err != nil {
		return nil, err
	}

	// 如果没有查询到数据，确保返回一个空数组而不是 nil
	if servers == nil {
		servers = make([]models.Server, 0)
	}

	// 5. 组装并返回结果
	result := &PaginatedServersResult{
		Total: total,
		Data:  servers,
	}

	return result, nil
}

// DeleteServerByID 使用 GORM 根据 ID 从数据库中删除一个服务器。
func DeleteServerByID(id string) error {
	db := database.GormDB
	// GORM 的 Delete 方法会返回一个 result 对象，我们可以检查其错误
	result := db.Delete(&models.Server{}, id)
	return result.Error
}
