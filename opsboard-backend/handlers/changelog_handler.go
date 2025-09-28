/**
 * @file handlers/changelog_handler.go
 * @description 处理与更新日志相关的 HTTP 请求。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码规范]：将文件顶部的块注释修改为符合 GoDoc 规范的单行包注释。
 *   - [原因]：此修改是为了解决 Go linter 报告的“软件包注释应采用 'Package handlers ...' 的形式”的警告，确保了代码风格与 Go 社区的最佳实践保持一致。
 */

// Package handlers 包含了处理 HTTP 请求的逻辑。
package handlers

import (
	"net/http"
	"opsboard-backend/services"

	"github.com/gin-gonic/gin"
)

// GetChangelogList 处理获取更新日志列表的请求
func GetChangelogList(c *gin.Context) {
	changelogs, err := services.GetAllChangelogs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "获取更新日志列表失败"})
		return
	}

	c.JSON(http.StatusOK, changelogs)
}
