/**
 * @file handlers/maintenance_handler.go
 * @description 处理与维护任务相关的 HTTP 请求，支持分页查询。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：`GetMaintenanceTaskList` 处理器现在支持分页。它从 URL 查询参数中解析 `page` 和 `pageSize`，并调用新的分页服务函数。
 *   - [健壮性]：增加了对查询参数的默认值处理和类型转换。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetMaintenanceTaskList 处理获取维护任务列表的请求（支持分页）
func GetMaintenanceTaskList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	result, err := services.GetPaginatedMaintenanceTasks(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取任务列表失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}
