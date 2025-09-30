/**
 * @file handlers/server_handler.go
 * @description 处理与服务器相关的 HTTP 请求，支持分页查询和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：`GetServerList` 处理器现在支持分页。它从 URL 查询参数中解析 `page` 和 `pageSize`，并调用新的分页服务函数。
 *   - [健壮性]：增加了对查询参数的默认值处理和类型转换，确保了即使前端不提供分页参数，接口也能正常工作。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetServerList 处理获取服务器列表的请求（支持分页）
func GetServerList(c *gin.Context) {
	// 从 URL query string 中获取分页参数，并设置默认值
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	result, err := services.GetPaginatedServers(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取服务器列表失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}

// DeleteServer 处理删除服务器的请求
func DeleteServer(c *gin.Context) {
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

	c.Status(http.StatusNoContent)
}
