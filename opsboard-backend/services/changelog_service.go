/**
 * @file services/changelog_service.go
 * @description 提供与更新日志相关的业务逻辑，使用 GORM 实现分页查询、删除和状态变更操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `MarkChangelogAsCompleted` 和 `MarkChangelogAsPending` 两个函数，用于更新日志的状态和完成时间。
 *   - [SQL 更新]：`GetPaginatedChangelogs` 的查询语句现在也包含了新的 `status` 和 `completion_time` 字段。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
	"time"
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
		// [核心修改] 确保查询包含了新字段
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
	result := db.Delete(&models.Changelog{}, id)
	return result.Error
}

// MarkChangelogAsCompleted 将指定ID的更新日志标记为“完成”。
func MarkChangelogAsCompleted(id string) error {
	db := database.GormDB
	result := db.Model(&models.Changelog{}).Where("log_id = ?", id).Updates(map[string]interface{}{
		"status":          "完成",
		"completion_time": time.Now(),
	})
	return result.Error
}

// MarkChangelogAsPending 将指定ID的更新日志标记为“挂起”。
func MarkChangelogAsPending(id string) error {
	db := database.GormDB
	result := db.Model(&models.Changelog{}).Where("log_id = ?", id).Updates(map[string]interface{}{
		"status":          "挂起",
		"completion_time": nil,
	})
	return result.Error
}
