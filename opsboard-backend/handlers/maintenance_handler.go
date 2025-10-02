/**
 * @file handlers/maintenance_handler.go
 * @description 处理与维护任务相关的 HTTP 请求，支持分页查询、删除和状态变更操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `CompleteMaintenanceTask` 和 `UncompleteMaintenanceTask` 两个处理器，分别用于处理将任务标记为“完成”和“挂起”的 `PUT` 请求。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetMaintenanceTaskList ... (保持不变)
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

// DeleteMaintenanceTask ... (保持不变)
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

// CompleteMaintenanceTask 处理将任务标记为“完成”的请求
func CompleteMaintenanceTask(c *gin.Context) {
	taskID := c.Param("id")
	if err := services.MarkTaskAsCompleted(taskID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "标记为完成失败"})
		return
	}
	c.Status(http.StatusNoContent)
}

// UncompleteMaintenanceTask 处理将任务标记为“挂起”的请求
func UncompleteMaintenanceTask(c *gin.Context) {
	taskID := c.Param("id")
	if err := services.MarkTaskAsPending(taskID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "取消完成失败"})
		return
	}
	c.Status(http.StatusNoContent)
}
