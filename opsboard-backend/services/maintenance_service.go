/**
 * @file services/maintenance_service.go
 * @description 提供与维护任务相关的业务逻辑，使用 GORM 实现分页查询和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `DeleteMaintenanceTaskByID` 函数，用于根据给定的 ID 从数据库中删除维护任务记录。
 *   - [ORM 实现]：该函数使用 GORM 来执行删除操作，以保持技术栈的一致性。
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

	query := db.Model(&models.MaintenanceTask{})

	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	offset := (page - 1) * pageSize

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

	result := &PaginatedMaintenanceTasksResult{
		Total: total,
		Data:  tasks,
	}

	return result, nil
}

// DeleteMaintenanceTaskByID 使用 GORM 根据 ID 从数据库中删除一个维护任务。
func DeleteMaintenanceTaskByID(id string) error {
	db := database.GormDB
	result := db.Delete(&models.MaintenanceTask{}, id)
	return result.Error
}
