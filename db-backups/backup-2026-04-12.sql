-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com    Database: test
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v7.5.6-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `test`
--

CREATE DATABASE IF NOT EXISTS `test` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `test`;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `added_by` varchar(255) DEFAULT NULL,
  `amount` decimal(38,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `expense_date` date DEFAULT NULL,
  `paid_to` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expenses`
--

LOCK TABLES `expenses` WRITE;
/*!40000 ALTER TABLE `expenses` DISABLE KEYS */;
/*!40000 ALTER TABLE `expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fee_records`
--

DROP TABLE IF EXISTS `fee_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee_records` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(38,2) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `fee_type` varchar(255) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_mode` enum('ONLINE','OFFLINE') NOT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `screenshot_path` varchar(255) DEFAULT NULL,
  `status` enum('PENDING','VERIFIED','REJECTED') NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `verified_at` datetime(6) DEFAULT NULL,
  `verified_by` varchar(255) DEFAULT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKpa7aak9gybhyk0gr2vldtvrrb` (`student_id`),
  CONSTRAINT `FKpa7aak9gybhyk0gr2vldtvrrb` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee_records`
--

LOCK TABLES `fee_records` WRITE;
/*!40000 ALTER TABLE `fee_records` DISABLE KEYS */;
INSERT INTO `fee_records` VALUES (1,1000.00,'2026-04-03 15:52:41.532476','Tuition','2026-04-03 15:52:41.532503','OFFLINE','Testing ',NULL,'VERIFIED',NULL,'2026-04-03 15:52:41.527315','Administrator',1);
/*!40000 ALTER TABLE `fee_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notices` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `posted_by` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_config`
--

DROP TABLE IF EXISTS `payment_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_config` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_holder_name` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `upi_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_config`
--

LOCK TABLES `payment_config` WRITE;
/*!40000 ALTER TABLE `payment_config` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_history`
--

DROP TABLE IF EXISTS `stock_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `issued_to` varchar(255) DEFAULT NULL,
  `performed_by` varchar(255) DEFAULT NULL,
  `quantity_after` int DEFAULT NULL,
  `quantity_before` int DEFAULT NULL,
  `quantity_changed` int DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `stock_item_id` bigint NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK28g3qyyl8hma4xnnta8fm5710` (`stock_item_id`),
  CONSTRAINT `FK28g3qyyl8hma4xnnta8fm5710` FOREIGN KEY (`stock_item_id`) REFERENCES `stock_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_history`
--

LOCK TABLES `stock_history` WRITE;
/*!40000 ALTER TABLE `stock_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_items`
--

DROP TABLE IF EXISTS `stock_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `size` varchar(255) DEFAULT NULL,
  `sub_type` varchar(255) DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_items`
--

LOCK TABLES `stock_items` WRITE;
/*!40000 ALTER TABLE `stock_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `aadhaar_or_samagra_id` varchar(255) DEFAULT NULL,
  `academic_year` varchar(255) DEFAULT NULL,
  `admission_type` varchar(255) DEFAULT NULL,
  `birth_certificate_path` varchar(255) DEFAULT NULL,
  `blood_group` varchar(255) DEFAULT NULL,
  `board` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `class_for_admission` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `emergency_contact` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `known_allergies` varchar(255) DEFAULT NULL,
  `language_preferences` varchar(255) DEFAULT NULL,
  `last_school_attended` varchar(255) DEFAULT NULL,
  `marks_obtained` varchar(255) DEFAULT NULL,
  `medical_conditions` varchar(255) DEFAULT NULL,
  `mother_tongue` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `parent_address` varchar(255) DEFAULT NULL,
  `parent_email` varchar(255) DEFAULT NULL,
  `parent_mobile` varchar(255) DEFAULT NULL,
  `parent_name` varchar(255) DEFAULT NULL,
  `parent_occupation` varchar(255) DEFAULT NULL,
  `photograph_path` varchar(255) DEFAULT NULL,
  `previous_grade` varchar(255) DEFAULT NULL,
  `proof_of_residence_path` varchar(255) DEFAULT NULL,
  `report_card_path` varchar(255) DEFAULT NULL,
  `siblings_in_school` varchar(255) DEFAULT NULL,
  `student_id` varchar(255) DEFAULT NULL,
  `transfer_certificate_path` varchar(255) DEFAULT NULL,
  `transport_required` bit(1) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_5mbus2m1tm2acucrp6t627jmx` (`student_id`),
  UNIQUE KEY `UK_g4fwvutq09fjdlb4bb0byp7t` (`user_id`),
  CONSTRAINT `FKdt1cjx5ve5bdabmuuf3ibrwaq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=30001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'1234689867885','2025-2026','New',NULL,'','','','Nursery','2026-03-24 14:22:20.689383','2024-06-06','','Rahul','Male','','','','','','','Indian','Korra','','9335678999','Raj ','',NULL,'',NULL,NULL,'','VPS-20260324-0001',NULL,_binary '\0','2026-03-24 14:22:20.689412',30001),(2,'2328879783','2025-2026','New',NULL,'','','','Nursery','2026-03-24 14:23:05.066810',NULL,'','Rahul','','','','','','','','Indian','','','','','',NULL,'',NULL,NULL,'','VPS-20260324-0002',NULL,_binary '\0','2026-03-24 14:23:05.066838',30002);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `username` varchar(255) NOT NULL,
  `photograph_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK_r43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=60001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-03-24 09:24:23.101788','Administrator','$2a$10$NAsctVOzwX5gzl.6bSjDu.nRI44Nfh31NTRUROLjIomD5NbRKriSe','ADMIN','admin','https://res.cloudinary.com/dwy1kxuyt/image/upload/v1774444400/vps/photos/x4uxvvh1zmrvegje0xj6.jpg'),(2,'2026-03-24 09:24:26.124911','System Administrator','$2a$10$JFbbOpCxr3yo4UsHbyk0/uBJSiOu5GanJkd19YnjmP8ZaKQw5z.NG','SYSTEM_ADMIN','SYS_Account_ravi_Pd',NULL),(30001,'2026-03-24 14:22:19.993927','Rahul','$2a$10$oxZ0pj16IeGGhvCs/2x7vehZ6g.0nQrs.ZNnriN/5J2wgMPO347Uu','STUDENT','1234689867885',NULL),(30002,'2026-03-24 14:23:04.896298','Rahul','$2a$10$PFBBmecgj4KOrX1GGswOFemvDXFJAkPRGHPYggqSkX6jXh0nc8Hyu','STUDENT','2328879783',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-12  3:27:58
