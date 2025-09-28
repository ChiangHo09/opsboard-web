/**
 * @file main.go
 * @description 应用主入口文件，负责初始化、路由注册和服务器启动。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [业务接口]：新增并注册了 `GET /tasks/list` 业务接口，并将其明确地放置在受 `AuthMiddleware` 保护的路由组之下。
 *   - [原因]：此修改扩展了应用的业务功能，为新的巡检备份模块提供了后端数据支持，并确保了其接口受到严格的认证保护。
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

		// [核心修改] 在受保护的组下注册我们新的巡检备份任务接口
		tasks := api.Group("/tasks")
		tasks.Use(middleware.AuthMiddleware())
		{
			tasks.GET("/list", handlers.GetTaskList)
		}
	}

	log.Printf("服务器正在端口 %s 上运行", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
