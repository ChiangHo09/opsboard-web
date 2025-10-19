// @file handlers/server_handler.go
// @description 处理与服务器相关的 HTTP 请求，支持分页查询、按 ID 查询和删除操作。
// @modification 本次提交中所做的具体修改摘要。
//   - [功能新增]：新增了 `GetServerByID` Gin 处理器，用于处理 `GET /api/servers/:id` 请求。
//   - [逻辑实现]：该处理器从 URL 路径中提取 ID，调用服务层的 `GetServerByID` 函数获取数据。
//   - [错误处理]：能够区分 `gorm.ErrRecordNotFound`（返回 404）和其他数据库错误（返回 500），提供了更精确的 API 错误响应。
//   - [数据转换]：在成功获取数据后，将 `models.Server` 数据库模型转换为 `models.ServerDetailResponse` API 响应模型，以匹配前端的精确需求。
//
// (此处应该保留一行空行，以避免GoLand的警告)
package handlers

import (
	"errors"
	"net/http"
	"opsboard-backend/models"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// GetServerList 处理获取服务器列表的请求（支持分页）
func GetServerList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	result, err := services.GetPaginatedServers(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取服务器列表失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}

// GetServerByID 处理根据 ID 获取单个服务器详情的请求。
func GetServerByID(c *gin.Context) {
	serverID := c.Param("id")
	if serverID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "服务器 ID 不能为空"})
		return
	}

	server, err := services.GetServerByID(serverID)
	if err != nil {
		// 检查错误是否为 GORM 的 "记录未找到" 错误
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "服务器未找到"})
		} else {
			// 对于所有其他类型的错误，返回内部服务器错误
			c.JSON(http.StatusInternalServerError, gin.H{"message": "获取服务器详情失败"})
		}
		return
	}

	// 将数据库模型 (models.Server) 转换为 API 响应模型 (models.ServerDetailResponse)
	// 这是为了确保 API 的响应结构与前端的期望完全一致
	response := models.ServerDetailResponse{
		ID:             server.ServerID,
		CustomerID:     server.CustomerID,
		CustomerName:   server.CustomerName,
		ServerName:     server.ServerName,
		IPAddress:      server.IPAddress,
		Role:           server.Role,
		DeploymentType: server.DeploymentType,
		CustomerNote:   server.CustomerNote,
		UsageNote:      server.UsageNote,
		CreatedAt:      server.CreatedAt,
		UpdatedAt:      server.UpdatedAt,
	}

	c.JSON(http.StatusOK, response)
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
