// File: opsboard-backend/config/config.go
/**
 * @file config.go
 * @description 负责从 .env 文件加载应用配置。
 * @modification
 *   - [New File]: 创建此文件以集中管理配置加载逻辑。
 */
package config

import (
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
	if err := godotenv.Load(); err != nil {
		// 如果 .env 文件不存在，不视为致命错误，因为环境变量可能已在系统中设置
		// log.Printf("警告: 无法加载 .env 文件: %v", err)
	}

	cfg := &Config{
		ServerPort:         os.Getenv("SERVER_PORT"),
		DBConnectionString: os.Getenv("DB_CONNECTION_STRING"),
		JWTSecret:          os.Getenv("JWT_SECRET"),
	}

	return cfg, nil
}
