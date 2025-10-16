// @file services/server_service.go
// @description 提供与服务器相关的业务逻辑，使用 GORM 实现分页查询、删除和按 ID 查询操作。
// @modification 本次提交中所做的具体修改摘要。
//   - [功能新增]：新增了 `GetServerByID` 函数，用于根据 ID 从数据库中检索单个服务器的详细信息。
//   - [关联查询]：该函数通过 `Joins` 和 `Select` 明确地从 `customers` 表中获取客户名称，确保了响应数据的完整性。
//   - [错误处理]：实现了对 `gorm.ErrRecordNotFound` 的精确捕获，当数据库中不存在请求的记录时，函数会返回此特定错误，使上层 handler 能够据此返回 404 Not Found 响应。

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

	query := db.Model(&models.Server{})

	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	offset := (page - 1) * pageSize

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

	if servers == nil {
		servers = make([]models.Server, 0)
	}

	result := &PaginatedServersResult{
		Total: total,
		Data:  servers,
	}

	return result, nil
}

// GetServerByID 使用 GORM 根据 ID 从数据库中查找一个服务器的详细信息。
func GetServerByID(id string) (*models.Server, error) {
	db := database.GormDB
	var server models.Server

	// 使用 Joins 和 Select 来获取服务器数据以及关联的客户名称
	// First 方法会在找到第一条匹配记录后停止，并将其填充到 server 变量中
	// 如果没有找到记录，它将返回 gorm.ErrRecordNotFound 错误
	err := db.Model(&models.Server{}).
		Joins("LEFT JOIN customers c ON servers.customer_id = c.customer_id").
		Select("servers.*, c.customer_name").
		First(&server, "servers.server_id = ?", id).Error

	if err != nil {
		// 直接返回错误，让 handler 层去判断是 gorm.ErrRecordNotFound 还是其他错误
		return nil, err
	}

	return &server, nil
}

// DeleteServerByID 使用 GORM 根据 ID 从数据库中删除一个服务器。
func DeleteServerByID(id string) error {
	db := database.GormDB
	result := db.Delete(&models.Server{}, id)
	return result.Error
}
