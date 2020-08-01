-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 01, 2020 at 12:57 PM
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

--
-- Dumping data for table `bot`
--

INSERT INTO `bot` (`id`, `organization_id`, `token`, `title`, `last_container_poke`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '123', NULL, NULL, 10, '2020-07-24 16:37:37', '2020-07-24 16:37:37'),
(2, 2, '123', NULL, NULL, 10, '2020-07-24 16:40:51', '2020-07-24 16:40:51'),
(3, 3, '123', NULL, NULL, 10, '2020-07-24 16:58:59', '2020-07-24 16:58:59'),
(4, 4, '123', NULL, NULL, 10, '2020-07-24 20:35:07', '2020-07-24 20:35:07'),
(5, 5, '1359519562:AAEC_4x3DSWuDZQClGJ12F6S0rVOf2s7ZBw', NULL, NULL, 10, '2020-07-28 15:05:10', '2020-07-28 15:05:10'),
(6, 6, 'asd', NULL, NULL, 10, '2020-07-28 15:26:47', '2020-07-28 15:26:47'),
(7, 7, '123', NULL, NULL, 10, '2020-07-31 11:28:39', '2020-07-31 11:28:39'),
(8, 8, '123', NULL, NULL, 10, '2020-07-31 11:29:03', '2020-07-31 11:29:03'),
(9, 9, '123', NULL, NULL, 10, '2020-07-31 11:29:46', '2020-07-31 11:29:46'),
(10, 10, '123', NULL, NULL, 10, '2020-07-31 11:30:43', '2020-07-31 11:30:43');

-- --------------------------------------------------------

--
-- Table structure for table `bot_notification`
--

CREATE TABLE `bot_notification` (
  `id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `bot_notification_template_id` int(11) DEFAULT NULL,
  `after_date_time` datetime NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - sent, 9 - pending, 0 - error',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bot_notification`
--

INSERT INTO `bot_notification` (`id`, `bot_id`, `bot_notification_template_id`, `after_date_time`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '1970-01-01 00:00:00', 9, '2020-07-31 18:54:55', '2020-07-31 18:54:55'),
(2, 1, 1, '1970-01-01 00:00:00', 9, '2020-07-31 18:55:23', '2020-07-31 18:55:23'),
(3, 1, 1, '1970-01-01 00:00:00', 9, '2020-07-31 18:57:33', '2020-07-31 18:57:33'),
(4, 1, 1, '1970-01-01 00:00:00', 9, '2020-07-31 18:59:20', '2020-07-31 18:59:20');

-- --------------------------------------------------------

--
-- Table structure for table `bot_notification_bot_user`
--

CREATE TABLE `bot_notification_bot_user` (
  `id` int(11) NOT NULL,
  `bot_notification_id` int(11) NOT NULL,
  `bot_user_id` int(11) NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '9' COMMENT '10 - sent, 9 - pending, 0 - error',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bot_notification_bot_user`
--

INSERT INTO `bot_notification_bot_user` (`id`, `bot_notification_id`, `bot_user_id`, `status`, `created_at`, `updated_at`) VALUES
(3, 3, 1, 9, '2020-07-31 18:57:33', '2020-07-31 18:57:33'),
(4, 4, 1, 9, '2020-07-31 18:59:20', '2020-07-31 18:59:20');

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
  `en_title` varchar(255) NOT NULL,
  `en_description` text NOT NULL,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '10' COMMENT '10 - active, 0 - deleted',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bot_notification_template`
--

INSERT INTO `bot_notification_template` (`id`, `bot_id`, `type`, `ru_title`, `ru_description`, `en_title`, `en_description`, `uz_title`, `uz_description`, `thumbnail`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 10, '123', '123', '123', '123', '123', '123', 'doctor-1468.jpg', 10, '2020-07-31 18:38:57', '2020-07-31 18:38:57');

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
  `comment` text,
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 0 - banned',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `bot_user`
--

INSERT INTO `bot_user` (`id`, `bot_id`, `tg_id`, `first_name`, `last_name`, `phone_number`, `username`, `bio`, `avatar`, `language`, `last_seen`, `comment`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'John', NULL, NULL, NULL, NULL, NULL, 'ru', '2020-07-31 18:52:46', NULL, 10, NULL, NULL);

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

--
-- Dumping data for table `branch`
--

INSERT INTO `branch` (`id`, `organization_id`, `title`, `lat`, `lng`, `timetable`, `is_all_day`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'asd', 123, 321, NULL, 0, 10, '2020-07-24 16:37:37', '2020-07-24 20:26:39'),
(2, 2, '123', 123, 321, NULL, 0, 10, '2020-07-24 16:40:51', '2020-07-24 16:40:51'),
(3, 3, '123', 123, 321, NULL, 0, 10, '2020-07-24 16:58:59', '2020-07-24 16:58:59'),
(4, 1, 'asd', 123, 321, NULL, 0, 10, '2020-07-24 20:25:51', '2020-07-24 20:25:51'),
(5, 1, 'asd', 123, 321, NULL, 0, 10, '2020-07-24 20:26:26', '2020-07-24 20:26:26'),
(6, 1, 'asd', 123, 321, NULL, 0, 10, '2020-07-24 20:26:49', '2020-07-24 20:26:49'),
(7, 4, '123', 123, 321, NULL, 0, 10, '2020-07-24 20:35:07', '2020-07-24 20:35:07');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `bot_id` int(11) NOT NULL,
  `parent_category_id` int(11) DEFAULT NULL,
  `ru_title` varchar(255) NOT NULL,
  `ru_description` text,
  `en_title` varchar(255) NOT NULL,
  `en_description` text,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text,
  `thumbnail` varchar(255) DEFAULT NULL,
  `pos` int(11) DEFAULT '0',
  `status` tinyint(4) NOT NULL COMMENT '10 -active, 9 - moderation, 0 - inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `bot_id`, `parent_category_id`, `ru_title`, `ru_description`, `en_title`, `en_description`, `uz_title`, `uz_description`, `thumbnail`, `pos`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Dag', 'Cat', 'Cat', 'Cat', 'Cat', 'Cat', NULL, 0, 0, '2020-07-24 19:09:25', '2020-07-24 19:25:53'),
(8, 5, NULL, '1111', 'placeholder', '1111', 'placeholder', '1111', 'placeholder', NULL, 0, 10, '2020-08-01 10:38:29', '2020-08-01 10:38:29'),
(9, 5, NULL, '11111', 'placeholder', '11111', 'placeholder', '11111', 'placeholder', NULL, 0, 10, '2020-08-01 10:39:35', '2020-08-01 10:39:35'),
(10, 5, NULL, '123123', 'placeholder', '123123', 'placeholder', '123123', 'placeholder', NULL, 0, 10, '2020-08-01 10:39:49', '2020-08-01 10:39:49');

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

--
-- Dumping data for table `file`
--

INSERT INTO `file` (`id`, `key`, `key_id`, `file`, `original_name`, `size`, `mime`, `type`, `created_at`, `updated_at`) VALUES
(1, 4, 16, 'comarch_diagram-c2b5.png', 'comarch_diagram.png', 20537, 'image/png', 1, '2020-07-31 17:07:39', '2020-07-31 17:07:39'),
(2, 4, 16, 'comarch_interface-678a.png', 'comarch_interface.png', 61066, 'image/png', 1, '2020-07-31 17:07:39', '2020-07-31 17:07:39'),
(3, 4, 16, 'dash_sign-744b.png', 'dash_sign.png', 12951, 'image/png', 1, '2020-07-31 17:07:39', '2020-07-31 17:07:39'),
(4, 4, 16, 'dash_index-ac61.png', 'dash_index.png', 100200, 'image/png', 1, '2020-07-31 17:07:39', '2020-07-31 17:07:39'),
(5, 5, 1, 'dep_med_org-1c1f.png', 'dep_med_org.png', 20503, 'image/png', 1, '2020-07-31 18:38:57', '2020-07-31 18:38:57');

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `ru_title` varchar(255) DEFAULT NULL,
  `ru_description` text,
  `en_title` varchar(255) NOT NULL,
  `en_description` text,
  `uz_title` varchar(255) NOT NULL,
  `uz_description` text,
  `price` double NOT NULL,
  `amount` int(10) UNSIGNED DEFAULT '1',
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` tinyint(4) NOT NULL COMMENT '10 - active, 9 - moderation, 0 - inactive',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `category_id`, `ru_title`, `ru_description`, `en_title`, `en_description`, `uz_title`, `uz_description`, `price`, `amount`, `thumbnail`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Dag', 'Cat', 'Cat', 'Cat', 'Cat', 'Cat', 123, 321, NULL, 0, '2020-07-24 19:59:42', '2020-07-24 20:09:11'),
(2, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:25:33', '2020-07-31 16:25:33'),
(3, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:25:52', '2020-07-31 16:25:52'),
(4, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-e372.jpg', 10, '2020-07-31 16:30:24', '2020-07-31 16:30:24'),
(5, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:40:32', '2020-07-31 16:40:32'),
(6, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:41:23', '2020-07-31 16:41:23'),
(7, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:47:55', '2020-07-31 16:47:55'),
(8, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:49:46', '2020-07-31 16:49:46'),
(9, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:50:45', '2020-07-31 16:50:45'),
(10, 1, '123', '123', '321', '123', '123', '123', 123, 1, NULL, 10, '2020-07-31 16:50:57', '2020-07-31 16:50:57'),
(11, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-0a64.jpg', 10, '2020-07-31 16:52:55', '2020-07-31 16:52:55'),
(12, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-c69f.jpg', 10, '2020-07-31 17:00:49', '2020-07-31 17:00:49'),
(13, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-1041f.jpg', 10, '2020-07-31 17:05:22', '2020-07-31 17:05:22'),
(14, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-13dc.jpg', 10, '2020-07-31 17:06:10', '2020-07-31 17:06:10'),
(15, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-b33d.jpg', 10, '2020-07-31 17:06:58', '2020-07-31 17:06:58'),
(16, 1, '123', '123', '321', '123', '123', '123', 123, 1, 'doctor-b2f2.jpg', 10, '2020-07-31 17:07:39', '2020-07-31 17:07:39');

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

--
-- Dumping data for table `organization`
--

INSERT INTO `organization` (`id`, `user_id`, `ru_title`, `ru_description`, `en_title`, `en_description`, `uz_title`, `uz_description`, `thumbnail`, `is_multilanguage`, `min_order_charge`, `free_distance`, `fixed_delivery_price`, `per_km_deliver_price`, `delivery_time_range_start`, `delivery_time_range_end`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-24 16:37:37', '2020-07-24 16:37:37'),
(2, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-24 16:40:51', '2020-07-24 16:40:51'),
(3, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-24 16:58:59', '2020-07-24 16:58:59'),
(4, 1, '123', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-24 20:35:07', '2020-07-24 20:36:31'),
(5, 3, 'Tashkent', 'Tashkent Moyo Zavedenies', 'Tashkent', 'Tashkent Moyo Zavedenies', 'Tashkent', 'Tashkent Moyo Zavedenies', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-28 15:05:10', '2020-07-28 15:05:10'),
(6, 3, 'asdsadsad', 'asdasdsad', 'asdsadsad', 'asdasdsad', 'asdsadsad', 'asdasdsad', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-28 15:26:47', '2020-07-28 15:26:47'),
(7, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-31 11:28:39', '2020-07-31 11:28:39'),
(8, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-31 11:29:03', '2020-07-31 11:29:03'),
(9, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-31 11:29:46', '2020-07-31 11:29:46'),
(10, 1, 'Org', 'Org', 'Org', 'Org', 'Org', 'Org', NULL, 0, 0, 0, 1, NULL, NULL, NULL, 10, '2020-07-31 11:30:43', '2020-07-31 11:30:43');

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
(1, '123@mail.com', '123', '312', '$2b$10$4VC8XDPT.rJ/x/3gRBTR7urb5pw9FSY4E89XkB3MOdrzarsFMV3Oi', '2020-07-31 20:19:31', NULL, 0, 10, '2020-07-24 14:41:00', '2020-07-31 20:19:31'),
(2, 'asd@mail.com', 'John', 'Green', '$2b$10$yO/IUP4S5zi8uEBPAvcq/OpwDw3M.FbVyQAczQKwJhVBD3mzOah2q', NULL, NULL, 0, 10, '2020-07-24 17:02:04', '2020-07-24 17:02:04'),
(3, 'asdd@mail.com', 'John', 'Green', '$2b$10$FlWXDdjruZNWr4fZd39Qqep9QDQsXD8RYSIY8RDM.Q.n/yuc757xu', '2020-08-01 10:39:49', NULL, 0, 10, '2020-07-28 15:04:25', '2020-08-01 10:39:49');

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `bot_notification_template` (`bot_notification_template_id`),
  ADD KEY `bot_id` (`bot_id`);

--
-- Indexes for table `bot_notification_bot_user`
--
ALTER TABLE `bot_notification_bot_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bot_notification_id` (`bot_notification_id`),
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
-- Indexes for table `file`
--
ALTER TABLE `file`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bot_notification`
--
ALTER TABLE `bot_notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bot_notification_bot_user`
--
ALTER TABLE `bot_notification_bot_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bot_notification_template`
--
ALTER TABLE `bot_notification_template`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bot_user`
--
ALTER TABLE `bot_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `branch`
--
ALTER TABLE `branch`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
-- AUTO_INCREMENT for table `file`
--
ALTER TABLE `file`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `bot_notification_ibfk_3` FOREIGN KEY (`bot_id`) REFERENCES `bot` (`id`);

--
-- Constraints for table `bot_notification_bot_user`
--
ALTER TABLE `bot_notification_bot_user`
  ADD CONSTRAINT `bot_notification_bot_user_ibfk_1` FOREIGN KEY (`bot_notification_id`) REFERENCES `bot_notification` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `bot_notification_bot_user_ibfk_2` FOREIGN KEY (`bot_user_id`) REFERENCES `bot_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
