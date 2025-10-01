/**
 * @file services/maintenance_service.go
 * @description 提供与维护任务相关的业务逻辑，使用 GORM 实现分页查询。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [架构重构]：使用 GORM ORM 框架彻底重构了数据查询逻辑，取代了手写的 SQL 和 `rows.Scan`。
 *   - [后端分页]：实现了完整的后端分页功能。`GetPaginatedMaintenanceTasks` 函数现在接收 `page` 和 `pageSize` 参数，并返回包含数据列表和总记录数的结果。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// PaginatedMaintenanceTasksResult 定义了维护任务分页查询的返回结构
type PaginatedMaintenanceTasksResult struct {
	Total int64                    `json:"total"`
	Data  []models.MaintenanceTask `json:"data"`
}

// GetPaginatedMaintenanceTasks 使用 GORM 从数据库中分页查询维护任务列表。
func GetPaginatedMaintenanceTasks(page, pageSize int) (*PaginatedMaintenanceTasksResult, error) {
	db := database.GormDB
	var tasks []models.MaintenanceTask
	var total int64

	// 1. 构建基础查询链，用于计算总数
	query := db.Model(&models.MaintenanceTask{})

	// 2. 执行 COUNT 查询获取总记录数
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// 3. 计算分页所需的 offset
	offset := (page - 1) * pageSize

	// 4. 在基础查询链上继续添加分页、排序和关联查询，然后执行
	err := query.
		Joins("LEFT JOIN servers s ON maintenance.target_server_id = s.server_id").
		Select("maintenance.*, s.server_name as target_server_name").
		Offset(offset).
		Limit(pageSize).
		Order("maintenance.created_at DESC").
		Find(&tasks).Error

	if err != nil {
		return nil, err
	}

	if tasks == nil {
		tasks = make([]models.MaintenanceTask, 0)
	}

	// 5. 组装并返回结果
	result := &PaginatedMaintenanceTasksResult{
		Total: total,
		Data:  tasks,
	}

	return result, nil
}
