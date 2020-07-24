-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 24, 2020 at 06:01 PM
-- Server version: 5.7.28
-- PHP Version: 7.1.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dobot`
--

-- --------------------------------------------------------

--
-- Table structure for table `bot`
--

CREATE TABLE `bot` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `last_container_poke` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT '10' COMMENT '10 -active, 9 - moderation, 11 - inactive, 0 deleted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bot_notification`
--

CREATE TABLE `bot_notification` (
  `id` int(11) NOT NULL,
  `bot_notification_template_id` int(11) DEFAULT NULL,
  `bot_user_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - sent, 9 - pending, 0 - error',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bot_notification_template`
--

CREATE TABLE `bot_notification_template` (
  `id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `type` tinyint(4) DEFAULT '10' COMMENT '10 - Рассылка. 11 - ответ на feedback',
  `ru_title` varchar(255) NOT NULL,
  `ru_description` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `en_title` varchar(255) NOT NULL,
  `en_description` text NOT NULL,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text NOT NULL,
  `start_time` datetime NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - sent to all, 9 - sending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `bot_user`
--

CREATE TABLE `bot_user` (
  `id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `tg_id` bigint(20) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `bio` text,
  `avatar` varchar(255) DEFAULT NULL,
  `language` varchar(20) NOT NULL DEFAULT 'ru',
  `last_seen` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 0 - banned',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `branch`
--

CREATE TABLE `branch` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `lat` double UNSIGNED NOT NULL,
  `lng` double UNSIGNED NOT NULL,
  `timetable` json DEFAULT NULL,
  `is_all_day` tinyint(1) DEFAULT '0',
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 9 - moderation, 11 - inactive 0 - deleted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `parent_category_id` int(11) DEFAULT '0',
  `ru_title` varchar(255) NOT NULL,
  `ru_description` text,
  `en_title` varchar(255) NOT NULL,
  `en_description` text,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `pos` int(11) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 -active, 9 - moderation, 0 - inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `category_upsell_item`
--

CREATE TABLE `category_upsell_item` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `upsell_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `bot_user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `status` tinyint(4) DEFAULT NULL COMMENT '10 - answered, 11 - pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `file`
--

CREATE TABLE `file` (
  `id` int(11) NOT NULL,
  `key` tinyint(4) NOT NULL COMMENT '1 - Notification Template, 2 - Organization Photos etc ...',
  `key_id` int(11) NOT NULL,
  `file` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `size` int(11) NOT NULL,
  `mime` varchar(255) NOT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1 - image, 2 - video, 3- - audio, 4 - document',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `ru_title` varchar(255) NOT NULL,
  `ru_description` text NOT NULL,
  `en_title` varchar(255) NOT NULL,
  `en_description` text NOT NULL,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text NOT NULL,
  `price` double NOT NULL,
  `amount` int(10) UNSIGNED DEFAULT '1',
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 9 - moderation, 0 - inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `item_upsell_item`
--

CREATE TABLE `item_upsell_item` (
  `id` int(11) NOT NULL,
  `select_item_id` int(11) NOT NULL,
  `upsell_item_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `bot_user_id` int(11) NOT NULL,
  `total_charge` double UNSIGNED NOT NULL,
  `delivery_charge` double UNSIGNED NOT NULL,
  `for_datetime` datetime DEFAULT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `address` varchar(255) NOT NULL,
  `payment_type` tinyint(3) UNSIGNED NOT NULL COMMENT '10 - cash, 0 - card',
  `phone` varchar(255) NOT NULL,
  `comment` varchar(512) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - approved, 9 - moderation, 0 - canceled, 11 - paid, 12 - delivered',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `organization`
--

CREATE TABLE `organization` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `ru_title` varchar(255) NOT NULL,
  `ru_description` text NOT NULL,
  `en_title` varchar(255) NOT NULL,
  `en_description` text NOT NULL,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `is_multilanguage` tinyint(1) DEFAULT '0',
  `min_order_charge` double DEFAULT '0',
  `free_distance` double DEFAULT '0' COMMENT '3км бесплатно',
  `fixed_delivery_price` double UNSIGNED NOT NULL,
  `per_km_deliver_price` double DEFAULT NULL,
  `delivery_time_range_start` int(11) DEFAULT NULL,
  `delivery_time_range_end` int(11) DEFAULT NULL,
  `status` tinyint(4) DEFAULT '10' COMMENT '10 - active, 9 - moderation, 11 - inactive, 0 - deleted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `promo`
--

CREATE TABLE `promo` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `min_order_charge` int(10) UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 -active, 0- inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `promocode`
--

CREATE TABLE `promocode` (
  `id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `bot_user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `coeff` double NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `left_usage` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 0 - inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plan`
--

CREATE TABLE `subscription_plan` (
  `id` int(11) NOT NULL,
  `ru_title` varchar(255) NOT NULL,
  `ru_description` text NOT NULL,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text NOT NULL,
  `en_title` varchar(255) NOT NULL,
  `en_description` text NOT NULL,
  `price` double NOT NULL,
  `year_price` double UNSIGNED DEFAULT NULL,
  `days_amount` int(10) UNSIGNED NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 0 - inactive, 9 -moderation',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `subscription_plan_user`
--

CREATE TABLE `subscription_plan_user` (
  `id` int(11) NOT NULL,
  `subscription_plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` tinyint(4) NOT NULL COMMENT '1 - usual, 2 - yearly',
  `status` tinyint(4) NOT NULL COMMENT '10 - acitve, 9 -moderation 0 - inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `last_seen` datetime DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `balance` double DEFAULT '0',
  `status` int(11) NOT NULL COMMENT '10 - active, 9 - moderation 0 - deleted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `first_name`, `last_name`, `password_hash`, `last_seen`, `password_reset_token`, `balance`, `status`, `created_at`, `updated_at`) VALUES
(1, 'email@com', 'john', 'green', '$2b$10$4VC8XDPT.rJ/x/3gRBTR7urb5pw9FSY4E89XkB3MOdrzarsFMV3Oi', NULL, NULL, 0, 10, '2020-07-24 14:41:00', '2020-07-24 14:41:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bot`
--
ALTER TABLE `bot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `bot_notification`
--
ALTER TABLE `bot_notification`
  ADD KEY `bot_notification_template` (`bot_notification_template_id`),
  ADD KEY `bot_user_id` (`bot_user_id`);

--
-- Indexes for table `bot_notification_template`
--
ALTER TABLE `bot_notification_template`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bot_id` (`bot_id`);

--
-- Indexes for table `bot_user`
--
ALTER TABLE `bot_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bot_id` (`bot_id`);

--
-- Indexes for table `branch`
--
ALTER TABLE `branch`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bot_id` (`bot_id`),
  ADD KEY `parent_category` (`parent_category_id`);

--
-- Indexes for table `category_upsell_item`
--
ALTER TABLE `category_upsell_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `upsell_item_id` (`upsell_item_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `item_upsell_item`
--
ALTER TABLE `item_upsell_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `select_item_id` (`select_item_id`),
  ADD KEY `upsell_item_id` (`upsell_item_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bot_user_id` (`bot_user_id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `organization`
--
ALTER TABLE `organization`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `promo`
--
ALTER TABLE `promo`
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `promocode`
--
ALTER TABLE `promocode`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organization_id` (`organization_id`),
  ADD KEY `promocode_ibfk_2` (`category_id`),
  ADD KEY `promocode_ibfk_3` (`item_id`),
  ADD KEY `bot_user_id` (`bot_user_id`);

--
-- Indexes for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscription_plan_user`
--
ALTER TABLE `subscription_plan_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bot`
--
ALTER TABLE `bot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bot_notification_template`
--
ALTER TABLE `bot_notification_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bot_user`
--
ALTER TABLE `bot_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `category_upsell_item`
--
ALTER TABLE `category_upsell_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `item_upsell_item`
--
ALTER TABLE `item_upsell_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organization`
--
ALTER TABLE `organization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `promocode`
--
ALTER TABLE `promocode`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plan`
--
ALTER TABLE `subscription_plan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscription_plan_user`
--
ALTER TABLE `subscription_plan_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bot`
--
ALTER TABLE `bot`
  ADD CONSTRAINT `bot_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);

--
-- Constraints for table `bot_notification`
--
ALTER TABLE `bot_notification`
  ADD CONSTRAINT `bot_notification_ibfk_1` FOREIGN KEY (`bot_notification_template_id`) REFERENCES `bot_notification_template` (`id`),
  ADD CONSTRAINT `bot_notification_ibfk_2` FOREIGN KEY (`bot_user_id`) REFERENCES `bot_user` (`id`);

--
-- Constraints for table `bot_notification_template`
--
ALTER TABLE `bot_notification_template`
  ADD CONSTRAINT `bot_notification_template_ibfk_1` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`);

--
-- Constraints for table `bot_user`
--
ALTER TABLE `bot_user`
  ADD CONSTRAINT `bot_user_ibfk_1` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`);

--
-- Constraints for table `branch`
--
ALTER TABLE `branch`
  ADD CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`),
  ADD CONSTRAINT `category_ibfk_2` FOREIGN KEY (`parent_category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;

--
-- Constraints for table `category_upsell_item`
--
ALTER TABLE `category_upsell_item`
  ADD CONSTRAINT `category_upsell_item_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `category_upsell_item_ibfk_2` FOREIGN KEY (`upsell_item_id`) REFERENCES `item` (`id`);

--
-- Constraints for table `item_upsell_item`
--
ALTER TABLE `item_upsell_item`
  ADD CONSTRAINT `item_upsell_item_ibfk_1` FOREIGN KEY (`select_item_id`) REFERENCES `item` (`id`),
  ADD CONSTRAINT `item_upsell_item_ibfk_2` FOREIGN KEY (`upsell_item_id`) REFERENCES `item` (`id`);

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `order_ibfk_1` FOREIGN KEY (`bot_user_id`) REFERENCES `bot_user` (`id`);

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`),
  ADD CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`);

--
-- Constraints for table `organization`
--
ALTER TABLE `organization`
  ADD CONSTRAINT `organization_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `promo`
--
ALTER TABLE `promo`
  ADD CONSTRAINT `promo_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`);

--
-- Constraints for table `promocode`
--
ALTER TABLE `promocode`
  ADD CONSTRAINT `promocode_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organization` (`id`),
  ADD CONSTRAINT `promocode_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `promocode_ibfk_3` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE SET NULL ON UPDATE SET NULL,
  ADD CONSTRAINT `promocode_ibfk_4` FOREIGN KEY (`bot_user_id`) REFERENCES `bot_user` (`id`) ON DELETE SET NULL ON UPDATE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
