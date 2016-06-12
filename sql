CREATE TABLE `t_proxy_cookie` (
  `id` CHAR(32) NOT NULL,
  `uid` CHAR(32) NULL,
  `host` VARCHAR(45) NULL,
  `cookie` VARCHAR(255) NULL,
  `site` VARCHAR(45) NULL,
  `state` TINYINT NULL,
  PRIMARY KEY (`id`));