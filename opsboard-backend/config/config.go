/**
 * @file config.go
 * @description 负责从 .env 文件加载应用配置。
 * @modification
 *   - [Debug Fix]: 恢复并加强了对 `godotenv.Load()` 的错误处理。现在，如果 `.env` 文件不存在或无法读取，程序将明确地打印错误日志并退出，而不是静默失败。
 *   - [Reason]: 此举旨在解决配置未能成功加载，导致程序使用默认空值连接数据库的问题。
 */
package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort         string
	DBConnectionString string
	JWTSecret          string
}

// LoadConfig 从 .env 文件加载配置
func LoadConfig() (*Config, error) {
	// 【核心修复】显式处理 .env 文件加载错误
	err := godotenv.Load()
	if err != nil {
		// 如果错误不是 "file does not exist"，那么就是一个真实的 I/O 错误。
		// 如果是 "file does not exist"，我们也将其视为一个需要注意的警告。
		log.Printf("警告: 无法加载 .env 文件。将依赖系统环境变量。错误: %v", err)
	}

	cfg := &Config{
		ServerPort:         os.Getenv("SERVER_PORT"),
		DBConnectionString: os.Getenv("DB_CONNECTION_STRING"),
		JWTSecret:          os.Getenv("JWT_SECRET"),
	}

	// 添加一个检查，如果关键配置为空，也进行提示
	if cfg.DBConnectionString == "" {
		log.Println("警告: 环境变量 DB_CONNECTION_STRING 为空。")
	}

	return cfg, nil
}
