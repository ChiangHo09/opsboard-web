/**
 * @file user_service.go
 * @description 封装与用户相关的数据库操作。
 * @modification
 *   - [DB Migration]: 将所有 SQL 查询中的 Oracle 参数占位符 `:1` 替换为 MySQL 的 `?`。
 *   - [DB Migration]: 移除了对 `sql.NullTime` 的处理，因为 MySQL 的 `TIMESTAMP` 和 `DATETIME` 在 `parseTime=True` 的情况下可以被 Go 的 `time.Time` 正确处理（即使为 NULL，会是零值）。
 *   - [Temp Change]: 暂时移除了 `utils.CheckPasswordHash` 的调用，以进行明文密码测试。
 */
package services

import (
	"database/sql"
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetUserByUsername 通过用户名从数据库中查询用户
func GetUserByUsername(username string) (*models.User, error) {
	// [核心修改] 使用 MySQL 兼容的 SQL 语法
	query := `SELECT user_id, username, password, nickname, role, created_at, updated_at FROM users WHERE username = ?`
	row := database.DB.QueryRow(query, username)

	var user models.User
	// [核心修改] MySQL 驱动在 parseTime=True 时可以很好地处理 NULL 时间，可以直接扫描到 *time.Time
	var updatedAt sql.NullTime

	err := row.Scan(
		&user.UserID,
		&user.Username,
		&user.Password,
		&user.Nickname,
		&user.Role,
		&user.CreatedAt,
		&updatedAt,
	)

	if err != nil {
		return nil, err
	}

	if updatedAt.Valid {
		user.UpdatedAt = updatedAt.Time
	}

	return &user, nil
}

// GetUserByID 通过用户 ID 从数据库中查询用户
func GetUserByID(userID int64) (*models.User, error) {
	// [核心修改] 使用 MySQL 兼容的 SQL 语法
	query := `SELECT user_id, username, password, nickname, role, created_at, updated_at FROM users WHERE user_id = ?`
	row := database.DB.QueryRow(query, userID)

	var user models.User
	var updatedAt sql.NullTime

	err := row.Scan(
		&user.UserID,
		&user.Username,
		&user.Password,
		&user.Nickname,
		&user.Role,
		&user.CreatedAt,
		&updatedAt,
	)

	if err != nil {
		return nil, err
	}

	if updatedAt.Valid {
		user.UpdatedAt = updatedAt.Time
	}

	return &user, nil
}
