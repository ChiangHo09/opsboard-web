/**
 * @file handlers/ticket_handler.go
 * @description 处理与工单相关的 HTTP 请求，支持分页查询。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以暴露工单相关的 API 端点。
 *   - [功能]：`GetTicketList` 处理器支持分页，调用 `TicketService` 获取聚合后的工单数据，并将其作为 JSON 响应返回。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetTicketList 处理获取工单列表的请求（支持分页）
func GetTicketList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	result, err := services.GetPaginatedTickets(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取工单列表失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}
