/**
 * @file services/ticket_service.go
 * @description 提供与工单相关的业务逻辑，使用 GORM 从 `v_tickets` 视图中进行分页查询。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [排序修正]：将 `ORDER BY` 子句的目标字段从 `created_at` 修正为 `publication_time`，以确保工单列表按照其“发布时间”进行正确的倒序排列。
 */

package services

import (
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// PaginatedTicketsResult 定义了工单分页查询的返回结构
type PaginatedTicketsResult struct {
	Total int64           `json:"total"`
	Data  []models.Ticket `json:"data"`
}

// GetPaginatedTickets 使用 GORM 从 v_tickets 视图中分页查询工单列表。
func GetPaginatedTickets(page, pageSize int) (*PaginatedTicketsResult, error) {
	db := database.GormDB
	var tickets []models.Ticket
	var total int64

	query := db.Table("v_tickets")

	if err := query.Count(&total).Error; err != nil {
		return nil, err
	}

	offset := (page - 1) * pageSize

	// [核心修改] 更新排序字段
	err := query.
		Offset(offset).
		Limit(pageSize).
		Order("publication_time DESC").
		Find(&tickets).Error

	if err != nil {
		return nil, err
	}

	if tickets == nil {
		tickets = make([]models.Ticket, 0)
	}

	result := &PaginatedTicketsResult{
		Total: total,
		Data:  tickets,
	}

	return result, nil
}
