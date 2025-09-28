/**
 * @file handlers/server_handler.go
 * @description 处理与服务器相关的 HTTP 请求。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新文件]：创建此文件以暴露服务器相关的 API 端点。
 *   - [功能]：`GetServerList` 处理器调用 `ServerService` 来获取数据，并将其作为 JSON 响应返回给客户端，同时包含错误处理。
 */
package handlers

import (
	"net/http"
	"opsboard-backend/services"

	"github.com/gin-gonic/gin"
)

// GetServerList 处理获取服务器列表的请求
func GetServerList(c *gin.Context) {
	servers, err := services.GetAllServers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取服务器列表失败"})
		return
	}

	c.JSON(http.StatusOK, servers)
}
