/**
 * @file handlers/changelog_handler.go
 * @description 处理与更新日志相关的 HTTP 请求，支持分页查询和删除操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增功能]：添加了 `DeleteChangelog` 处理器，用于处理 `DELETE /changelogs/:id` 请求。
 *   - [实现]：该处理器从 URL 路径中获取 `id` 参数，调用服务层的 `DeleteChangelogByID` 函数执行删除操作，并返回相应的 HTTP 状态码。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetChangelogList 处理获取更新日志列表的请求（支持分页）
func GetChangelogList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))

	result, err := services.GetPaginatedChangelogs(page, pageSize)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取更新日志列表失败"})
		return
	}

	c.JSON(http.StatusOK, result)
}

// DeleteChangelog 处理删除更新日志的请求
func DeleteChangelog(c *gin.Context) {
	logID := c.Param("id")
	if logID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"message": "日志 ID 不能为空"})
		return
	}

	err := services.DeleteChangelogByID(logID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "删除更新日志失败"})
		return
	}

	c.Status(http.StatusNoContent)
}
