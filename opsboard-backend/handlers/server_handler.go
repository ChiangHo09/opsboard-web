/**
 * @file handlers/server_handler.go
 * @description 处理与服务器相关的 HTTP 请求，包括获取列表和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `DeleteServer` 处理器，用于处理 `DELETE /servers/:id` 请求。
 *   - [实现]：该处理器从 URL 路径中获取 `id` 参数，调用服务层的 `DeleteServerByID` 函数执行删除操作，并根据操作结果返回相应的 HTTP 状态码。
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

// DeleteServer 处理删除服务器的请求
func DeleteServer(c *gin.Context) {
	// 从 URL 路径中获取服务器 ID
	serverID := c.Param("id")
	if serverID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "服务器 ID 不能为空"})
		return
	}

	err := services.DeleteServerByID(serverID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "删除服务器失败"})
		return
	}

	// 成功删除后，通常返回 204 No Content
	c.Status(http.StatusNoContent)
}
