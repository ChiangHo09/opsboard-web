/**
 * @file mysql.go
 * @description 负责初始化和管理 MySQL 数据库连接。
 * @modification
 *   - [DB Migration]: 创建此文件以替代 `oracle.go`。
 *   - [Driver]: 导入并使用了 `github.com/go-sql-driver/mysql` 驱动。
 *   - [Logic]: `InitDB` 函数现在使用 `"mysql"` 作为驱动名称来打开数据库连接。
 */
package database

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql" // MySQL 驱动
)

var DB *sql.DB

// InitDB 使用提供的连接字符串初始化数据库连接池
func InitDB(connStr string) error {
	var err error
	// [核心修改] 使用 "mysql" 驱动
	DB, err = sql.Open("mysql", connStr)
	if err != nil {
		return err
	}

	// 设置数据库连接池的最佳实践
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5)

	// 检查数据库连接是否成功
	if err = DB.Ping(); err != nil {
		return err
	}

	log.Println("数据库连接成功。")
	return nil
}

// CloseDB 关闭数据库连接
func CloseDB() {
	if DB != nil {
		DB.Close()
	}
}
