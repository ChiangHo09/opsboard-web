/**
 * @file main.go
 * @description 应用主入口文件，负责初始化、路由注册和服务器启动。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [代码重构]：将与任务相关的路由从 `/api/tasks` 更新为 `/api/maintenance`，并调用新的 `GetMaintenanceTaskList` 处理器，以提高命名的业务清晰度。
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
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("无法加载配置: %v", err)
	}
	log.Printf("正在尝试使用以下连接字符串进行连接: %s", cfg.DBConnectionString)

	if err := database.InitDB(cfg.DBConnectionString); err != nil {
		log.Fatalf("无法连接到数据库: %v", err)
	}
	defer database.CloseDB()

	r := gin.Default()
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	api := r.Group("/api")
	{
		// --- 公开路由组 (Public Routes) ---
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			auth.POST("/refresh", handlers.RefreshToken)
		}

		// --- 受保护的路由组 (Protected Routes) ---
		users := api.Group("/users")
		users.Use(middleware.AuthMiddleware())
		{
			users.GET("/me", handlers.GetMe)
		}

		servers := api.Group("/servers")
		servers.Use(middleware.AuthMiddleware())
		{
			servers.GET("/list", handlers.GetServerList)
		}

		changelogs := api.Group("/changelogs")
		changelogs.Use(middleware.AuthMiddleware())
		{
			changelogs.GET("/list", handlers.GetChangelogList)
		}

		// [核心修改] 更新路由和处理器调用
		maintenance := api.Group("/maintenance")
		maintenance.Use(middleware.AuthMiddleware())
		{
			maintenance.GET("/list", handlers.GetMaintenanceTaskList)
		}
	}

	log.Printf("服务器正在端口 %s 上运行", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
