-- 地区表
INSERT INTO regions (region_id, region_code, region_name, parent_id, region_level, description)
VALUES (1, '110000', '北京市', NULL, 1, '省直辖市'),
       (2, '110100', '北京市市辖区', 1, 2, '市辖区'),
       (3, '310000', '上海市', NULL, 1, '省直辖市'),
       (4, '310100', '上海市市辖区', 3, 2, '市辖区'),
       (5, '440000', '广东省', NULL, 1, '省'),
       (6, '440100', '广州市', 5, 2, '省会城市'),
       (7, '440300', '深圳市', 5, 2, '经济特区'),
       (8, '440400', '珠海市', 5, 2, '经济特区');

-- 客户表
-- INSERT INTO customers (customer_id, region_id, customer_name, contact_person, contact_phone, created_at)
-- VALUES (1, 2, '北京网云科技有限公司', '张三', '13800138000', NOW()),
--        (2, 4, '上海正程信息有限公司', '李四', '13900139000', NOW()),
--        (3, 6, '广州新启点信息', '王五', '13300133000', NOW()),
--        (4, 7, '深圳高新技术公司', '赵六', '13500135000', NOW()),
--        (5, 8, '珠海优创电子', '周七', '13700137000', NOW());

-- 用户表（模拟 UUID 和多角色用户）
-- INSERT INTO users (user_id, username, password, nickname, role, created_at)
-- VALUES ('a1111111-1111-1111-1111-111111111111', 'admin01', 'password_hash_1', '超级管理员', 'ADMIN', NOW()),
--        ('b2222222-2222-2222-2222-222222222222', 'user01', 'password_hash_2', '张三', 'USER', NOW()),
--        ('c3333333-3333-3333-3333-333333333333', 'engineer01', 'password_hash_3', '技术工程师', 'USER', NOW()),
--        ('d4444444-4444-4444-4444-444444444444', 'user02', 'password_hash_4', '李四', 'USER', NOW()),
--        ('e5555555-5555-5555-5555-555555555555', 'guest01', 'password_hash_5', '访客', 'USER', NOW());

-- 服务器表
INSERT INTO servers (server_id, customer_id, server_name, ip_address, role, deployment_type, customer_note, usage_note,
                     created_at, updated_at)
VALUES (1, 1, 'beijing-web01', '192.168.1.11', 'web', '线上生产', '主服务，承载流量高', '正常运行无异常', NOW(), NOW()),
       (2, 2, 'shanghai-db01', '192.168.2.21', 'db', '灾备', '备份服务器，可容灾', '定期巡检，已做多次备份', NOW(),
        NOW()),
       (3, 3, 'gz-app01', '10.0.1.1', 'app', '测试', '', '正在开发环境运行', NOW(), NOW()),
       (4, 4, 'sz-cache01', '10.0.2.2', 'cache', '生产', '', '已上线，负责缓存服务', NOW(), NOW()),
       (5, 5, 'zh-file01', '10.0.3.3', 'file', '本地', '', '文件服务器，偶尔用作备份', NOW(), NOW());

-- 维护任务表
INSERT INTO maintenance (task_id, task_name, task_type, target_server_id, status, execution_time, log_output,
                         created_at)
VALUES (1, '北京Web服务器日常巡检', '巡检', 1, '已完成', NOW(), '{"step":"硬件检查","result":"全部正常"}', NOW()),
       (2, '上海数据库备份', '备份', 2, '待执行', NULL, NULL, NOW()),
       (3, '广州应用部署测试', '巡检', 3, '已完成', NOW(), '{"step":"部署检查","result":"无告警"}', NOW()),
       (4, '深圳缓存参数调整', '巡检', 4, '处理中', NULL, '{"step":"参数修改","progress":"25%"}', NOW()),
       (5, '珠海文件服务器同步', '备份', 5, '待执行', NULL, NULL, NOW());

-- 更新日志表
INSERT INTO changelogs (log_id, customer_id, user_id, update_time, update_type, update_content, created_at)
VALUES (1, 1, 'a1111111-1111-1111-1111-111111111111', NOW(), '服务部署', '部署上线，服务可用', NOW()),
       (2, 2, 'b2222222-2222-2222-2222-222222222222', NOW(), '日常维护', '数据库周期性巡检', NOW()),
       (3, 3, 'c3333333-3333-3333-3333-333333333333', NOW(), '应用变更', '发布测试版，增加新接口', NOW()),
       (4, 4, 'd4444444-4444-4444-4444-444444444444', NOW(), '缓存策略更新', '优化分片算法', NOW()),
       (5, 5, 'e5555555-5555-5555-5555-555555555555', NOW(), '文件同步', '完成跨节点同步测试', NOW());

-- 系统操作日志表
INSERT INTO audit_logs (log_id, user_id, action, target_entity, target_id, details, created_at)
VALUES (1, 'a1111111-1111-1111-1111-111111111111', 'USER_LOGIN_SUCCESS', 'users',
        'a1111111-1111-1111-1111-111111111111', '{"ip":"127.0.0.1"}', NOW()),
       (2, 'b2222222-2222-2222-2222-222222222222', 'TICKET_CREATED', 'tickets', '1',
        '{"request_ip":"127.0.0.2","params":"工单内容"}', NOW()),
       (3, 'c3333333-3333-3333-3333-333333333333', 'SERVER_ADDED', 'servers', '3', '{"desc":"新建应用服务器"}', NOW()),
       (4, 'd4444444-4444-4444-4444-444444444444', 'MAINTENANCE_EXECUTED', 'maintenance', '4',
        '{"result":"参数修改中"}', NOW()),
       (5, 'e5555555-5555-5555-5555-555555555555', 'SERVER_UPDATED', 'servers', '5', '{"desc":"更新服务器配置"}',
        NOW());

-- 工单表
-- INSERT INTO tickets (ticket_id, customer_id, submitter_id, assignee_id, status, operation_type, operation_content,
--                      created_at, updated_at)
-- VALUES (1, 1, 'b2222222-2222-2222-2222-222222222222', 'c3333333-3333-3333-3333-333333333333', '处理中', '巡检申请',
--         '北京Web服务器出现性能波动，请排查', NOW(), NOW()),
--        (2, 2, 'c3333333-3333-3333-3333-333333333333', NULL, '待处理', '备份', '上海数据库需要做灾备同步', NOW(), NULL),
--        (3, 3, 'd4444444-4444-4444-4444-444444444444', 'e5555555-5555-5555-5555-555555555555', '已完成', '应用变更',
--         '广州应用服务器需新增API', NOW(), NOW()),
--        (4, 4, 'e5555555-5555-5555-5555-555555555555', 'a1111111-1111-1111-1111-111111111111', '待处理', '缓存优化',
--         '深圳缓存服务内存泄漏需修复', NOW(), NULL),
--        (5, 5, 'a1111111-1111-1111-1111-111111111111', NULL, '待处理', '文件同步', '珠海文件服务器同步任务失败', NOW(),
--         NULL);