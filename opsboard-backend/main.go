// @file main.go
// @description 应用主入口文件，负责初始化、路由注册和服务器启动。
// @modification 本次提交中所做的具体修改摘要。
//   - [路由新增]：在受保护的 `/api/servers` 路由组下，新增了 `GET "/:id"` 路由。
//   - [功能对接]：将新路由指向了新创建的 `handlers.GetServerByID` 处理器，从而使获取单个服务器详情的 API 端点能够正常工作，解决了前端的 404 错误。

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
			// [核心新增] 注册获取单个服务器详情的路由
			servers.GET("/:id", handlers.GetServerByID)
			servers.DELETE("/:id", handlers.DeleteServer)
		}

		changelogs := api.Group("/changelogs")
		changelogs.Use(middleware.AuthMiddleware())
		{
			changelogs.GET("/list", handlers.GetChangelogList)
			changelogs.DELETE("/:id", handlers.DeleteChangelog)
			changelogs.PUT("/:id/complete", handlers.CompleteChangelog)
			changelogs.PUT("/:id/uncomplete", handlers.UncompleteChangelog)
		}

		maintenance := api.Group("/maintenance")
		maintenance.Use(middleware.AuthMiddleware())
		{
			maintenance.GET("/list", handlers.GetMaintenanceTaskList)
			maintenance.DELETE("/:id", handlers.DeleteMaintenanceTask)
			maintenance.PUT("/:id/complete", handlers.CompleteMaintenanceTask)
			maintenance.PUT("/:id/uncomplete", handlers.UncompleteMaintenanceTask)
		}

		tickets := api.Group("/tickets")
		tickets.Use(middleware.AuthMiddleware())
		{
			tickets.GET("/list", handlers.GetTicketList)
		}
	}

	log.Printf("服务器正在端口 %s 上运行", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
