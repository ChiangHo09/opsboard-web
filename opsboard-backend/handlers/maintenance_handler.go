/**
 * @file handlers/maintenance_handler.go
 * @description 处理与维护任务相关的 HTTP 请求，支持分页查询和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `DeleteMaintenanceTask` 处理器，用于处理 `DELETE /maintenance/:id` 请求。
 *   - [实现]：该处理器从 URL 路径中获取 `id` 参数，调用服务层的 `DeleteMaintenanceTaskByID` 函数执行删除操作，并返回相应的 HTTP 状态码。
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

// DeleteMaintenanceTask 处理删除维护任务的请求
func DeleteMaintenanceTask(c *gin.Context) {
	taskID := c.Param("id")
	if taskID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "任务 ID 不能为空"})
		return
	}

	err := services.DeleteMaintenanceTaskByID(taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "删除任务失败"})
		return
	}

	c.Status(http.StatusNoContent)
}
