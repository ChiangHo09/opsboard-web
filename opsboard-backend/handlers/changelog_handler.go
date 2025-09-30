/**
 * @file handlers/changelog_handler.go
 * @description 处理与更新日志相关的 HTTP 请求，支持分页查询。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [功能增强]：`GetChangelogList` 处理器现在支持分页。它从 URL 查询参数中解析 `page` 和 `pageSize`，并调用新的分页服务函数。
 *   - [健robustness]：增加了对查询参数的默认值处理和类型转换。
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
