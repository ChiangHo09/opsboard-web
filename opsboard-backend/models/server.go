// @file models/server.go
// @description 定义了 Server 数据模型以及用于特定 API 响应的数据传输对象 (DTO)。
// @modification 本次提交中所做的具体修改摘要。
//   - [模型新增]：新增了 `ServerDetailResponse` 结构体。此结构体的 JSON 标签与前端详情页组件期望的字段名（如 `ipAddress`, `deploymentType`）完全匹配，确保了 API 合约的准确性，同时避免了修改现有 `Server` 模型可能带来的副作用。
//
// (此处应该保留一行空行，以避免GoLand的警告)
package models

import (
	"database/sql"
	"time"
)

// Server 结构体定义了服务器的核心属性，与数据库的 `servers` 表一一对应。
// GORM 使用此模型进行数据库操作。
type Server struct {
	ServerID       uint           `gorm:"primaryKey;column:server_id" json:"id"`
	CustomerID     uint           `gorm:"column:customer_id" json:"customerId"`
	ServerName     string         `gorm:"column:server_name" json:"serverName"`
	IPAddress      string         `gorm:"column:ip_address" json:"ip"`
	Role           sql.NullString `gorm:"column:role" json:"role"`
	DeploymentType sql.NullString `gorm:"column:deployment_type" json:"dep"`
	CustomerNote   sql.NullString `gorm:"column:customer_note" json:"custNote"`
	UsageNote      sql.NullString `gorm:"column:usage_note" json:"note"`
	CreatedAt      time.Time      `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt      sql.NullTime   `gorm:"column:updated_at" json:"updatedAt"`
	CustomerName   string         `gorm:"-" json:"customerName"` // GORM 忽略此字段，由 JOIN 手动填充
}

// TableName 明确指定 Server 模型对应的数据库表名。
func (Server) TableName() string {
	return "servers"
}

// ServerDetailResponse 定义了获取单个服务器详情时，返回给前端的 API 响应结构。
// 它的 JSON 标签与前端 TypeScript 类型 `ServerDetail` 完全对应。
type ServerDetailResponse struct {
	ID             uint           `json:"id"`
	CustomerID     uint           `json:"customerId"`
	CustomerName   string         `json:"customerName"`
	ServerName     string         `json:"serverName"`
	IPAddress      string         `json:"ipAddress"`
	Role           sql.NullString `json:"role"`
	DeploymentType sql.NullString `json:"deploymentType"`
	CustomerNote   sql.NullString `json:"customerNote"`
	UsageNote      sql.NullString `json:"usageNote"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      sql.NullTime   `json:"updatedAt"`
}
