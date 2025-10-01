/**
 * @file services/changelog_service.go
 * @description 提供与更新日志相关的业务逻辑，使用 GORM 实现分页查询和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `DeleteChangelogByID` 函数，用于根据给定的 ID 从数据库中删除更新日志记录。
 *   - [ORM 实现]：该函数使用 GORM 来执行删除操作，以保持技术栈的一致性。
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

	query := db.Model(&models.Changelog{})

	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	offset := (page - 1) * pageSize

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

	result := &PaginatedChangelogsResult{
		Total: total,
		Data:  changelogs,
	}

	return result, nil
}

// DeleteChangelogByID 使用 GORM 根据 ID 从数据库中删除一个更新日志。
func DeleteChangelogByID(id string) error {
	db := database.GormDB
	// GORM 的 Delete 方法会根据主键删除记录
	result := db.Delete(&models.Changelog{}, id)
	return result.Error
}
