/**
 * @file models/server.go
 * @description 定义了 Server 数据模型，用于与数据库和 JSON 响应进行交互。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：将 `ServerID` 和 `CustomerID` 的类型从 `uuid.UUID` 更改为 `uint`。
 *   - [原因]：此修改是为了解决因 Go 结构体类型与数据库列类型不匹配而导致的 `rows.Scan` 失败问题。通过确保模型与 `int unsigned` 的数据库主键/外键类型一致，我们修复了获取服务器列表失败的根本原因。
 */

package models

import (
	"database/sql"
	"time"
)

// Server 结构体定义了服务器的核心属性，与数据库的 `servers` 表一一对应。
type Server struct {
	// [核心修复] 将类型更改为 uint 以匹配数据库的 int unsigned
	ServerID   uint `db:"server_id" json:"id"`
	CustomerID uint `db:"customer_id" json:"customerId"`

	ServerName     string         `db:"server_name" json:"serverName"`
	IPAddress      string         `db:"ip_address" json:"ip"`
	Role           sql.NullString `db:"role" json:"role"`
	DeploymentType sql.NullString `db:"deployment_type" json:"dep"`
	CustomerNote   sql.NullString `db:"customer_note" json:"custNote"`
	UsageNote      sql.NullString `db:"usage_note" json:"note"`
	CreatedAt      time.Time      `db:"created_at" json:"createdAt"`
	UpdatedAt      sql.NullTime   `db:"updated_at" json:"updatedAt"`

	CustomerName string `db:"customer_name" json:"customerName"`
}
