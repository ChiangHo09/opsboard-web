// File: opsboard-backend/main.go
/**
 * @file main.go
 * @description 应用主入口文件。
 * @modification
 *   - [New File]: 创建此文件以作为后端服务的启动点。
 *   - [Functionality]: 负责加载配置、初始化数据库连接、设置 Gin 路由和中间件，并启动 HTTP 服务器。
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

	// 2. 初始化数据库连接
	if err := database.InitDB(cfg.DBConnectionString); err != nil {
		log.Fatalf("无法连接到数据库: %v", err)
	}
	defer database.CloseDB()

	// 3. 设置 Gin 路由器
	r := gin.Default()

	// 4. 设置 CORS 中间件
	// 允许来自前端开发服务器的请求
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:5173"} // 请根据您的前端地址修改
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	r.Use(cors.New(corsConfig))

	// 5. 设置路由
	api := r.Group("/api")
	{
		auth := api.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
		}

		users := api.Group("/users")
		// 对 /users 组下的所有路由应用认证中间件
		users.Use(middleware.AuthMiddleware())
		{
			users.GET("/me", handlers.GetMe)
		}
	}

	// 6. 启动服务器
	log.Printf("服务器正在端口 %s 上运行", cfg.ServerPort)
	if err := r.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("无法启动服务器: %v", err)
	}
}
