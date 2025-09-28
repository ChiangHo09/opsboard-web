/**
 * @file main.go
 * @description 应用主入口文件，负责初始化、路由注册和服务器启动。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [最终修复]：修正了受保护路由组的注册方式，将 `api.Group("/")` 更改为直接在 `api` 组下注册业务路由。
 *   - [原因]：此修改解决了因路由路径拼接不当（产生 `/api//servers/list`）而导致的 `404 Not Found` 错误。通过确保后端注册的 URL (`/api/servers/list`) 与前端请求的 URL 完全一致，我们修复了业务接口无法访问的根本问题。
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
		// [核心修复] 将所有受保护的路由直接注册在 `api` 组下，并应用中间件

		users := api.Group("/users")
		users.Use(middleware.AuthMiddleware()) // 对 /users 组应用中间件
		{
			users.GET("/me", handlers.GetMe)
		}

		servers := api.Group("/servers")
		servers.Use(middleware.AuthMiddleware()) // 对 /servers 组应用中间件
		{
			servers.GET("/list", handlers.GetServerList)
		}

		// 未来所有新的业务路由组都应采用这种模式
		// tickets := api.Group("/tickets")
		// tickets.Use(middleware.AuthMiddleware())
		// {
		//     // ... tickets 相关的路由
		// }
	}

	log.Printf("服务器正在端口 %s 上运行", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
