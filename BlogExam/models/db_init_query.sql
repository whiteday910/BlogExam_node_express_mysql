CREATE DATABASE IF NOT EXISTS blog_jhkim DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE blog_jhkim;

CREATE TABLE IF NOT EXISTS tbl_post (
    num int(11) NOT NULL AUTO_INCREMENT,
    id varchar(50) NOT NULL,
    title varchar(255) NOT NULL,
    content longtext NOT NULL,
  	imgurl VARCHAR(255) NULL DEFAULT NULL,
    hits int(11) NOT NULL DEFAULT 0,
    date_create timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modify timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='블로그의 포스트 테이블입니다.';

CREATE TABLE IF NOT EXISTS tbl_users (
    num int(11) NOT NULL AUTO_INCREMENT,
    id varchar(50) NOT NULL,
    pw varchar(50) NOT NULL,
    name varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    date_join timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modifiy timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (num)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='사용자 테이블입니다.';