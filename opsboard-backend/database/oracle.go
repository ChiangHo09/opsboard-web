// File: opsboard-backend/database/oracle.go
/**
 * @file oracle.go
 * @description 负责初始化和管理 Oracle 数据库连接。
 * @modification
 *   - [New File]: 创建此文件以封装数据库连接逻辑。
 */
package database

import (
	"database/sql"
	"log"

	_ "github.com/godror/godror" // Oracle 驱动
)

var DB *sql.DB

// InitDB 使用提供的连接字符串初始化数据库连接池
func InitDB(connStr string) error {
	var err error
	DB, err = sql.Open("godror", connStr)
	if err != nil {
		return err
	}

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
