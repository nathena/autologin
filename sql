CREATE TABLE `t_proxy_cookie` (
  `id` CHAR(32) NOT NULL,
  `uid` CHAR(32) NULL,
  `host` VARCHAR(45) NULL,
  `cookie` VARCHAR(255) NULL,
  `site` VARCHAR(45) NULL,
  `state` TINYINT NULL,
  `cookiejar` VARCHAR(255) NULL,
  `host_full` VARCHAR(255) NULL,
  PRIMARY KEY (`id`));

 #SELECT group_concat(cookie separator "; "),`host` FROM `t_proxy_cookie` where uid = :uid group by `host`;