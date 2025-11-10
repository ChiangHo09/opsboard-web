-- USE opsboard_db;
-- 注意：我们现在需要手动提供一个 UUID
INSERT INTO users (user_id, username, password, nickname, role)
VALUES ('a8b4b3e6-e3d2-4d1b-b8e1-7a2a3f4c5d6e', 'sudo', '123qwe..', '超级管理员', 'ADMIN');