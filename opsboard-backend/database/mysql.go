/**
 * @file database/mysql.go
 * @description 负责初始化和管理数据库连接。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [ORM 集成]：引入了 GORM 框架，并修改了 `InitDB` 函数以创建一个 GORM 的数据库连接实例 (`gorm.DB`)。
 *   - [连接池管理]：将原生的 `sql.DB` 和 GORM 的 `gorm.DB` 实例都作为全局变量导出，以便项目中的不同部分可以根据需要选择使用。
 */

package database

import (
	"database/sql"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var (
	DB     *sql.DB  // 保留原生的 DB 连接，以备不时之需
	GormDB *gorm.DB // 导出 GORM 的 DB 实例
)

// InitDB 使用给定的连接字符串初始化数据库连接。
func InitDB(dataSourceName string) error {
	var err error
	// 初始化 GORM 连接
	GormDB, err = gorm.Open(mysql.Open(dataSourceName), &gorm.Config{})
	if err != nil {
		return err
	}

	// 从 GORM 连接中获取底层的 sql.DB 连接
	DB, err = GormDB.DB()
	if err != nil {
		return err
	}

	// 配置连接池
	DB.SetMaxIdleConns(10)
	DB.SetMaxOpenConns(100)

	return DB.Ping()
}

// CloseDB 关闭数据库连接。
func CloseDB() {
	if DB != nil {
		sqlDB, err := GormDB.DB()
		if err == nil {
			sqlDB.Close()
		}
	}
}
