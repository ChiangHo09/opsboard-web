/**
 * @file opsboard-backend/services/audit_service.go
 * @description 封装与系统操作日志相关的数据库操作。
 * @modification
 *   - [New File]: 创建此文件以提供一个中心化的日志记录服务。
 *   - [Functionality]: 提供了 `CreateLog` 函数，用于向 `audit_logs` 表中插入一条新的日志记录。
 *   - [Performance]: 日志的数据库插入操作在一个新的 goroutine 中异步执行，这可以防止日志记录阻塞主业务流程（如登录响应），从而提升 API 性能。
 */

package services

import (
	"encoding/json"
	"log"
	"opsboard-backend/database"
	"time"
)

// LogAction 定义了可被记录的操作类型常量
type LogAction string

const (
	UserLoginSuccess LogAction = "USER_LOGIN_SUCCESS"
	UserLoginFailure LogAction = "USER_LOGIN_FAILURE"
	// 未来可以添加更多操作类型...
	// TicketCreated    LogAction = "TICKET_CREATED"
	// ServerUpdated    LogAction = "SERVER_UPDATED"
)

// LogDetails 定义了可以被序列化为 JSON 的日志详情结构
type LogDetails map[string]interface{}

// CreateLog 创建一条新的审计日志记录。
// 它在一个新的 goroutine 中运行，以避免阻塞调用者。
func CreateLog(userID, action string, details LogDetails) {
	go func() {
		// 将详情 map 转换为 JSON 字符串
		detailsJSON, err := json.Marshal(details)
		if err != nil {
			log.Printf("错误: 无法将日志详情序列化为 JSON: %v", err)
			return
		}

		query := `
            INSERT INTO audit_logs (user_id, action, details, created_at)
            VALUES (?, ?, ?, ?)
        `
		_, err = database.DB.Exec(query, userID, action, string(detailsJSON), time.Now())
		if err != nil {
			// 在生产环境中，这里应该使用一个更健壮的日志库
			log.Printf("错误: 无法插入审计日志: %v", err)
		}
	}()
}
