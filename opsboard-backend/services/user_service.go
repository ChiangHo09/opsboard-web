// File: opsboard-backend/services/user_service.go
/**
 * @file user_service.go
 * @description 封装与用户相关的数据库操作。
 * @modification
 *   - [New File]: 创建此文件以实现仓库模式，将数据库查询逻辑与 HTTP 处理器分离。
 */
package services

import (
	"database/sql"
	"opsboard-backend/database"
	"opsboard-backend/models"
)

// GetUserByUsername 通过用户名从数据库中查询用户
func GetUserByUsername(username string) (*models.User, error) {
	query := `SELECT USER_ID, USERNAME, PASSWORD, NICKNAME, ROLE, CREATED_AT, UPDATED_AT FROM USERS WHERE USERNAME = :1`
	row := database.DB.QueryRow(query, username)

	var user models.User
	var updatedAt sql.NullTime // Oracle 时间戳可能为 NULL

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
	query := `SELECT USER_ID, USERNAME, PASSWORD, NICKNAME, ROLE, CREATED_AT, UPDATED_AT FROM USERS WHERE USER_ID = :1`
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
