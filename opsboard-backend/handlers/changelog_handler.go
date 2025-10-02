/**
 * @file handlers/changelog_handler.go
 * @description 处理与更新日志相关的 HTTP 请求，支持分页查询、删除和状态变更操作。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：将 `CompleteChangelog` 和 `UncompleteChangelog` 处理器成功时的响应状态码从 `200 OK` (带有隐式的空响应体) 更改为 `204 No Content`。
 *   - [原因]：此修改解决了因前端尝试解析空响应体而导致的 "Unexpected end of JSON input" 错误。`204 No Content` 是一个明确的信号，告知客户端操作已成功且无需解析任何响应内容，从而修复了状态变更功能的根本问题。
 */

package handlers

import (
	"net/http"
	"opsboard-backend/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetChangelogList ... (保持不变)
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

// DeleteChangelog ... (保持不变)
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

// CompleteChangelog 处理将日志标记为“完成”的请求
func CompleteChangelog(c *gin.Context) {
	logID := c.Param("id")
	if err := services.MarkChangelogAsCompleted(logID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "标记为完成失败"})
		return
	}
	// [核心修复] 返回 204 No Content
	c.Status(http.StatusNoContent)
}

// UncompleteChangelog 处理将日志标记为“挂起”的请求
func UncompleteChangelog(c *gin.Context) {
	logID := c.Param("id")
	if err := services.MarkChangelogAsPending(logID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "取消完成失败"})
		return
	}
	// [核心修复] 返回 204 No Content
	c.Status(http.StatusNoContent)
}
