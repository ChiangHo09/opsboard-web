/**
 * @file handlers/maintenance_handler.go
 * @description 处理与维护任务相关的 HTTP 请求。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码重构]：将文件名、函数名和调用的服务函数中的 `Task` 替换为 `MaintenanceTask`，以保持命名一致性。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"

	"github.com/gin-gonic/gin"
)

// GetMaintenanceTaskList 处理获取维护任务列表的请求
func GetMaintenanceTaskList(c *gin.Context) {
	tasks, err := services.GetAllMaintenanceTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取任务列表失败"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}
