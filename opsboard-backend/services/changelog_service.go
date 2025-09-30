/**
 * @file services/changelog_service.go
 * @description 提供与更新日志相关的业务逻辑，使用 GORM 实现分页查询。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [架构重构]：使用 GORM ORM 框架彻底重构了数据查询逻辑，取代了手写的 SQL 和 `rows.Scan`。
 *   - [后端分页]：实现了完整的后端分页功能。`GetPaginatedChangelogs` 函数现在接收 `page` 和 `pageSize` 参数，并返回包含数据列表和总记录数的结果。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// PaginatedChangelogsResult 定义了更新日志分页查询的返回结构
type PaginatedChangelogsResult struct {
	Total int64              `json:"total"`
	Data  []models.Changelog `json:"data"`
}

// GetPaginatedChangelogs 使用 GORM 从数据库中分页查询更新日志列表。
func GetPaginatedChangelogs(page, pageSize int) (*PaginatedChangelogsResult, error) {
	db := database.GormDB
	var changelogs []models.Changelog
	var total int64

	// 1. 构建基础查询链，用于计算总数
	query := db.Model(&models.Changelog{})

	// 2. 执行 COUNT 查询获取总记录数
	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	// 3. 计算分页所需的 offset
	offset := (page - 1) * pageSize

	// 4. 在基础查询链上继续添加分页、排序和关联查询，然后执行
	err := query.
		Joins("LEFT JOIN customers c ON changelogs.customer_id = c.customer_id").
		Select("changelogs.*, c.customer_name").
		Offset(offset).
		Limit(pageSize).
		Order("changelogs.update_time DESC").
		Find(&changelogs).Error

	if err != nil {
		return nil, err
	}

	if changelogs == nil {
		changelogs = make([]models.Changelog, 0)
	}

	// 5. 组装并返回结果
	result := &PaginatedChangelogsResult{
		Total: total,
		Data:  changelogs,
	}

	return result, nil
}
