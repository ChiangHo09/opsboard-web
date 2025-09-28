/**
 * @file user_service.go
 * @description 封装与用户相关的数据库操作。
 * @modification
 *   - [UUID Migration]: 导入了 `github.com/google/uuid` 包。
 *   - [UUID Migration]: `GetUserByID` 函数的参数类型从 `int64` 修改为 `uuid.UUID`，以接受 UUID 类型的用户 ID。
 */

package services

import (
	"database/sql"
	"opsboard-backend/database"
	"opsboard-backend/models"

	"github.com/google/uuid"
)

// GetUserByUsername 通过用户名从数据库中查询用户 (逻辑保持不变)
func GetUserByUsername(username string) (*models.User, error) {
	query := `SELECT user_id, username, password, nickname, role, created_at, updated_at FROM users WHERE username = ?`
	row := database.DB.QueryRow(query, username)

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

// GetUserByID 通过用户 ID 从数据库中查询用户
func GetUserByID(userID uuid.UUID) (*models.User, error) { // [核心修改] 参数类型变为 uuid.UUID
	query := `SELECT user_id, username, password, nickname, role, created_at, updated_at FROM users WHERE user_id = ?`
	row := database.DB.QueryRow(query, userID.String()) // 查询时将 UUID 转为字符串

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
