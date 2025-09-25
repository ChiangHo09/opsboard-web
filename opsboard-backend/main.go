// File: opsboard-backend/main.go
/**
 * @file main.go
 * @description 应用主入口文件。
 * @modification
 *   - [Debug]: 在加载配置后添加了一个日志输出行，用于明确打印出程序实际使用的数据库连接字符串，以诊断连接问题。
 */
package main

import (
	"log"
	"opsboard-backend/config"
	"opsboard-backend/database"
	"opsboard-backend/handlers"
	"opsboard-backend/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. 加载配置
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("无法加载配置: %v", err)
	}

	// --- 【核心调试步骤】 ---
	// 打印出实际加载到的连接字符串，以确认 .env 文件是否被正确读取
	log.Printf("正在尝试使用以下连接字符串进行连接: %s", cfg.DBConnectionString)
	// ----------------------

	// 2. 初始化数据库连接
	if err := database.InitDB(cfg.DBConnectionString); err != nil {
		log.Fatalf("无法连接到数据库: %v", err)
	}
	defer database.CloseDB()

	// ... (文件的其余部分保持不变) ...
	r := gin.Default()
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
		}
		users := api.Group("/users")
		users.Use(middleware.AuthMiddleware())
		{
			users.GET("/me", handlers.GetMe)
		}
	}
	log.Printf("服务器正在端口 %s 上运行", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
