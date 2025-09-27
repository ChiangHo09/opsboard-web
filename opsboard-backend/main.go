// File: opsboard-backend/main.go
/**
 * @file main.go
 * @description 应用主入口文件，负责初始化、路由注册和服务器启动。
 * @modification 本次提交中所做的具体修改摘要。
 *   - [新增路由]：在 `/api/auth` 路由组下，为新的 `RefreshToken` 处理器新增了 `POST /refresh` 路由。
 *   - [原因]：此路由是实现行业标准 JWT 刷新令牌机制的核心部分，允许前端在访问令牌过期后，通过此接口获取新的访问令牌，以实现无缝的会话延续。
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
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			// [核心修改] 添加刷新令牌的路由
			auth.POST("/refresh", handlers.RefreshToken)
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
