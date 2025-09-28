/**
 * @file handlers/task_handler.go
 * @description 处理与巡检备份任务相关的 HTTP 请求。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以暴露任务相关的 API 端点。
 *   - [功能]：`GetTaskList` 处理器调用 `TaskService` 来获取数据，并将其作为 JSON 响应返回给客户端。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"

	"github.com/gin-gonic/gin"
)

// GetTaskList 处理获取巡检备份任务列表的请求
func GetTaskList(c *gin.Context) {
	tasks, err := services.GetAllTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取任务列表失败"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}
