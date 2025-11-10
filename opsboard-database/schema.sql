create or replace table regions
(
    region_id    int unsigned auto_increment comment '地区唯一标识符 (代理主键)'
        primary key,
    region_code  varchar(12)  not null comment '行政区划代码',
    region_name  varchar(100) not null comment '地区名称',
    parent_id    int unsigned null comment '父级地区ID，自关联',
    region_level tinyint(2)   not null comment '地区层级',
    description  varchar(500) null comment '地区备注',
    constraint uk_regions_code
        unique (region_code),
    constraint fk_regions_parent
        foreign key (parent_id) references regions (region_id)
            on delete set null
)
    comment '地区表';

create or replace table customers
(
    customer_id    int unsigned auto_increment comment '客户唯一标识符 (主键)'
        primary key,
    region_id      int unsigned                             null comment '外键，关联到地区表',
    customer_name  varchar(200)                             not null comment '客户的正式名称',
    contact_person varchar(100)                             null comment '主要联系人姓名',
    contact_phone  varchar(50)                              null comment '联系电话',
    created_at     datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    constraint uk_customers_name
        unique (customer_name),
    constraint fk_customers_region
        foreign key (region_id) references regions (region_id)
            on delete set null
)
    comment '客户表';

create or replace table servers
(
    server_id       int unsigned auto_increment comment '服务器唯一标识符 (主键)'
        primary key,
    customer_id     int unsigned                             not null comment '外键，关联到客户表',
    server_name     varchar(100)                             not null comment '服务器名称',
    ip_address      varchar(50)                              not null comment '服务器 IP 地址',
    role            varchar(50)                              null comment '服务器角色',
    deployment_type varchar(100)                             null comment '部署类型',
    customer_note   varchar(500)                             null comment '客户相关的备注',
    usage_note      varchar(1000)                            null comment '使用备注',
    created_at      datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    updated_at      datetime(6)                              null on update current_timestamp(6) comment '记录最后更新时间',
    constraint fk_servers_customer
        foreign key (customer_id) references customers (customer_id)
            on delete cascade
)
    comment '服务器信息表';

create or replace table maintenance
(
    task_id          int unsigned auto_increment comment '任务唯一标识符 (主键)'
        primary key,
    task_name        varchar(200)                             not null comment '任务的描述性名称',
    task_type        varchar(20)                              not null comment '任务类型 (巡检, 备份)',
    target_server_id int unsigned                             null comment '外键，任务目标服务器',
    status           varchar(50)                              not null comment '任务执行状态',
    execution_time   datetime(6)                              null comment '任务实际执行的时间',
    log_output       longtext                                 null comment '任务执行的详细日志输出',
    created_at       datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    constraint fk_maintenance_server
        foreign key (target_server_id) references servers (server_id)
            on delete cascade
)
    comment '维护任务表 (巡检, 备份等)';

create or replace table users
(
    user_id    char(36)                                 not null comment '用户唯一标识符 (UUID)'
        primary key,
    username   varchar(50)                              not null comment '用户登录名',
    password   varchar(255)                             not null comment '密码',
    nickname   varchar(100)                             null comment '用户昵称',
    role       varchar(20)                              not null comment '用户角色 (例如 ADMIN, USER)',
    created_at datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    updated_at datetime(6)                              null on update current_timestamp(6) comment '记录最后更新时间',
    constraint uk_users_username
        unique (username)
)
    comment '用户表';

create or replace table audit_logs
(
    log_id        bigint unsigned auto_increment comment '日志唯一标识符 (主键)'
        primary key,
    user_id       char(36)                                 not null comment '执行操作的用户ID (外键)',
    action        varchar(100)                             not null comment '操作类型 (例如: USER_LOGIN_SUCCESS, TICKET_CREATED)',
    target_entity varchar(50)                              null comment '被操作的实体类型 (例如: users, tickets)',
    target_id     varchar(255)                             null comment '被操作的实体ID',
    details       longtext collate utf8mb4_bin             null comment '包含操作细节的JSON对象 (例如: 请求IP, 参数)'
        check (json_valid(`details`)),
    created_at    datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    constraint fk_audit_logs_user
        foreign key (user_id) references users (user_id)
            on delete cascade
)
    comment '系统操作日志表';

create or replace index idx_audit_logs_action
    on audit_logs (action);

create or replace index idx_audit_logs_user_id
    on audit_logs (user_id);

create or replace table changelogs
(
    log_id         int unsigned auto_increment comment '日志唯一标识符 (主键)'
        primary key,
    customer_id    int unsigned                             not null comment '外键，关联到客户表',
    user_id        char(36)                                 not null comment '外键，记录操作人，关联用户表 (UUID)',
    update_time    datetime(6)                              not null comment '更新发生的具体时间',
    update_type    varchar(100)                             not null comment '更新类型',
    update_content text                                     not null comment '详细的更新内容描述',
    created_at     datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    constraint fk_changelogs_customer
        foreign key (customer_id) references customers (customer_id)
            on delete cascade,
    constraint fk_changelogs_user
        foreign key (user_id) references users (user_id)
            on delete cascade
)
    comment '更新日志表';

create or replace table tickets
(
    ticket_id         int unsigned auto_increment comment '工单唯一标识符 (主键)'
        primary key,
    customer_id       int unsigned                             not null comment '外键，关联到客户表',
    submitter_id      char(36)                                 not null comment '外键，工单提交人，关联用户表 (UUID)',
    assignee_id       char(36)                                 null comment '外键，被指派的处理人，关联用户表 (UUID)',
    status            varchar(50)                              not null comment '工单状态',
    operation_type    varchar(100)                             null comment '操作类别',
    operation_content text                                     not null comment '工单的核心内容描述',
    created_at        datetime(6) default current_timestamp(6) not null comment '记录创建时间',
    updated_at        datetime(6)                              null on update current_timestamp(6) comment '记录最后更新时间',
    constraint fk_tickets_assignee
        foreign key (assignee_id) references users (user_id)
            on delete set null,
    constraint fk_tickets_customer
        foreign key (customer_id) references customers (customer_id)
            on delete cascade,
    constraint fk_tickets_submitter
        foreign key (submitter_id) references users (user_id)
            on delete cascade
)
    comment '工单表';

