CREATE DATABASE  IF NOT EXISTS `TIDI` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `TIDI`;
-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: TIDI
-- ------------------------------------------------------
-- Server version	5.7.25-0ubuntu0.16.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` varchar(200) NOT NULL,
  `permission` enum('CUSTOMER','ADMIN') NOT NULL,
  `fullName` varchar(30) CHARACTER SET utf8 DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `gender` enum('MALE','FEMALE','OTHER','') DEFAULT NULL,
  `phone` varchar(11) CHARACTER SET utf8 DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(300) DEFAULT NULL,
  `avatar` text,
  `isVerified` enum('TRUE','FALSE') DEFAULT 'FALSE',
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  `refreshToken` varchar(90) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'tuanrr','202cb962ac59075b964b07152d234b70','ADMIN','Nguyễn minh Tuấn','1997-10-21','MALE','0123456789','tuan@gmail.com','B','','FALSE','FALSE',NULL),(2,'dat','202cb962ac59075b964b07152d234b70','ADMIN','Nguyễn minh Tuấn','1997-10-21','MALE','0123456789','dat@gmail.com','B','','FALSE','FALSE',NULL),(3,'thanh','202cb962ac59075b964b07152d234b70','ADMIN','Nguyễn minh Tuấn','1997-10-21','MALE','0123456789','thanh@gmail.com','B','','FALSE','TRUE',NULL),(22,'admin','b59c67bf196a4758191e42f76670ceba','ADMIN','Quang Nguyen','2211-02-04','MALE','033434333','naonguyennguyen@gmail.com','182 le dai hanh','','FALSE','FALSE','L0MMNrc9TRDpHDcGWzTSFXq4fE8zZOxjALPbXrVyDbreqBqmioUooeiHDY6mAIf4h19F6nBU2NZo780J'),(23,'quangnd2','b59c67bf196a4758191e42f76670ceba','ADMIN','Quang Nguyen','1997-03-28','MALE','0398242876','nguyendangquangkt@gmail.com','48/11 nguyen van cu, q5, tp HCM','','FALSE','TRUE','BFVHGxMKOr55i6ZucfmA3b6NzRFoj3fUQcqQL2t48kLXtQdUpiWECXPBU88d2grJIrTqky01CBuyStuv');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branch`
--

DROP TABLE IF EXISTS `branch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `branch` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `industry_id` int(10) unsigned DEFAULT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`),
  KEY `industry_id` (`industry_id`),
  CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`industry_id`) REFERENCES `industry` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branch`
--

LOCK TABLES `branch` WRITE;
/*!40000 ALTER TABLE `branch` DISABLE KEYS */;
INSERT INTO `branch` VALUES (1,'Điện thoại',1,'TRUE'),(2,'Máy tính bảng',1,'TRUE'),(3,'Laptop',2,'TRUE'),(4,'Chuột',2,'TRUE'),(5,'Bàn phím',2,'TRUE'),(6,'USB',2,'TRUE'),(7,'Tivi thông minh',3,'TRUE'),(8,'Tivi thường',3,'TRUE'),(9,'Máy ảnh',4,'TRUE'),(10,'Ống kính - Lens',4,'TRUE'),(11,'Camera bảo vệ',4,'TRUE'),(12,'Thực phẩm',5,'TRUE'),(13,'Đồ uống - giải khát',5,'TRUE'),(14,'Bánh kẹo',5,'TRUE'),(15,'Thể thao',6,'TRUE'),(16,'Dã ngoại',6,'TRUE'),(17,'GYM',6,'TRUE'),(18,'Nhà tắm',7,'TRUE'),(19,'Nhà bếp',7,'TRUE'),(20,'Phòng ngủ',7,'TRUE'),(21,'Đồ chơi',8,'TRUE'),(22,'Đồ dùng cho mẹ',8,'TRUE'),(23,'Đồ dùng cho bé',8,'TRUE'),(24,'Xe máy',9,'TRUE'),(25,'Ô tô',9,'TRUE'),(26,'Xe đạp',9,'TRUE'),(27,'Văn học Việt Nam',10,'TRUE'),(28,'Văn học nước ngoài',10,'TRUE');
/*!40000 ALTER TABLE `branch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `brand` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Apple 456','FALSE'),(2,'Samsung','TRUE'),(3,'Huawei','TRUE'),(4,'Oppo','TRUE'),(5,'Xiaomi','TRUE'),(6,'Nokia','TRUE'),(7,'Dell','TRUE'),(8,'Asus','TRUE'),(9,'Lenovo','TRUE'),(10,'MacBook','TRUE'),(11,'Acer','TRUE'),(12,'HP','TRUE'),(13,'Sony','TRUE'),(14,'LG','TRUE'),(15,'Panasonic','TRUE'),(16,'Toshiba','TRUE'),(17,'Canon','TRUE'),(18,'Nikon','TRUE'),(19,'Pixel','TRUE'),(20,'Nestle','TRUE'),(21,'Meizan','TRUE'),(22,'Acecook','TRUE'),(23,'Chinsu','TRUE'),(24,'Knorr','TRUE'),(25,'Sanest','TRUE'),(26,'Bibica','TRUE'),(27,'Coca-cola','TRUE'),(28,'Miliket','TRUE'),(29,'Sunlight','TRUE'),(30,'Omo','TRUE'),(31,'Comfort','TRUE'),(32,'Bitis','TRUE'),(33,'Nike','TRUE'),(34,'Adidas','TRUE'),(35,'Converse','TRUE'),(36,'Điện Quang','TRUE'),(37,'Nippon','TRUE'),(38,'Sunhouse','TRUE'),(39,'Puppy','TRUE'),(40,'Tottosi','TRUE'),(41,'Cuckeo Kids','TRUE'),(42,'Honda','TRUE'),(43,'Yamaha','TRUE'),(44,'Vinfast','TRUE'),(45,'Toyota','TRUE'),(46,'BWM','TRUE'),(47,'Lamborgini','TRUE'),(48,'Nhà xuất bản trẻ','TRUE'),(49,'Nhà xuất bản văn học','TRUE'),(50,'Nhà xuất bản Kim Đồng','TRUE'),(51,'Nhã Nam','TRUE'),(52,'First News','TRUE'),(53,'Phương Nam','TRUE'),(54,'Fujifilm','TRUE'),(55,'Poca','TRUE'),(56,'Bento','TRUE'),(57,'quang brand','FALSE');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `campaign`
--

DROP TABLE IF EXISTS `campaign`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaign` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_name` varchar(200) CHARACTER SET utf8 NOT NULL,
  `description` longtext,
  `start_time` datetime NOT NULL,
  `expired_time` datetime NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaign`
--

LOCK TABLES `campaign` WRITE;
/*!40000 ALTER TABLE `campaign` DISABLE KEYS */;
INSERT INTO `campaign` VALUES (1,'1','1','2018-11-22 16:16:00','2018-11-22 16:17:00','FALSE');
/*!40000 ALTER TABLE `campaign` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `accounts_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `amount` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `accounts_id` (`accounts_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`accounts_id`) REFERENCES `accounts` (`id`),
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (11,23,1,3),(12,23,8,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `branch_id` int(10) unsigned DEFAULT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`),
  KEY `branch_id` (`branch_id`),
  CONSTRAINT `category_ibfk_1` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Android',1,'TRUE'),(2,'Iphone',1,'TRUE'),(3,'Trắng đen',1,'TRUE'),(4,'Đập đá',1,'TRUE'),(5,'Ipad',2,'TRUE'),(6,'Tab',2,'TRUE'),(7,'Máy đọc sách',2,'TRUE'),(8,'Macbook',3,'TRUE'),(9,'Inspiron',3,'TRUE'),(10,'Thinkpad',3,'TRUE'),(11,'Ebooklite',3,'TRUE'),(12,'Có dây',4,'TRUE'),(13,'Không dây',4,'TRUE'),(14,'Chuột lăn',4,'TRUE'),(15,'Silent',4,'TRUE'),(16,'Bàn phím cơ',5,'TRUE'),(17,'Bàn phím mini',5,'TRUE'),(18,'Không dây',5,'TRUE'),(19,'Bàn phím số',5,'TRUE'),(20,'16GB',6,'TRUE'),(21,'32GB',6,'TRUE'),(22,'64GB',6,'TRUE'),(23,'3.0',6,'TRUE'),(24,'Internet Tivi',7,'TRUE'),(25,'Smart Tivi',7,'TRUE'),(26,'Androi Tivi',7,'TRUE'),(27,'Màn hình cong',8,'TRUE'),(28,'Màn hình phẳng',8,'TRUE'),(29,'Máy ảnh DSLR',9,'TRUE'),(30,'Máy ảnh du lịch',9,'TRUE'),(31,'Máy ảnh chụp lấy liền',9,'TRUE'),(32,'Máy ảnh Mirrorless',9,'TRUE'),(33,'Len kit',10,'TRUE'),(34,'Len Prime',10,'TRUE'),(35,'Len zoom',10,'TRUE'),(36,'Len tele',10,'TRUE'),(37,'Wifi',11,'TRUE'),(38,'Siêu nhỏ',11,'TRUE'),(39,'Dầu ăn',12,'TRUE'),(40,'Gia vị',12,'TRUE'),(41,'Đồ hộp',12,'TRUE'),(42,'Ăn liền',12,'TRUE'),(43,'Bia',13,'TRUE'),(44,'Nước ngọt',13,'TRUE'),(45,'Soda',13,'TRUE'),(46,'Sữa',13,'TRUE'),(47,'Snack',14,'TRUE'),(48,'Bánh',14,'TRUE'),(49,'Kẹo',14,'TRUE'),(50,'Socola',14,'TRUE'),(51,'Bơi lội',15,'TRUE'),(52,'Tennis',15,'TRUE'),(53,'Bóng đá',15,'TRUE'),(54,'Cầu lông',15,'TRUE'),(55,'Cờ vua',15,'TRUE'),(56,'Lều',16,'TRUE'),(57,'Túi ngủ',16,'TRUE'),(58,'Bàn ghế di động',16,'TRUE'),(59,'Máy tập chạy',17,'TRUE'),(60,'Tạ',17,'TRUE'),(61,'Xà đơn - Xà kép',17,'TRUE'),(62,'Bộ lau nhà',18,'TRUE'),(63,'Móc',18,'TRUE'),(64,'Thảm',18,'TRUE'),(65,'Tô - chén - đĩa',19,'TRUE'),(66,'Nồi - chảo',19,'TRUE'),(67,'Bàn ghế',19,'TRUE'),(68,'Chăn ga gối',20,'TRUE'),(69,'Đèn ngủ',20,'TRUE'),(70,'Trang trí',20,'TRUE'),(71,'Thú bông',21,'TRUE'),(72,'Đồ chơi gỗ',21,'TRUE'),(73,'Đồ chơi lắp ráp',21,'TRUE'),(74,'Thời trang bầu',22,'TRUE'),(75,'Phụ kiện cho mẹ',22,'TRUE'),(76,'Máy hút sữa',22,'TRUE'),(77,'Bình sữa',23,'TRUE'),(78,'Ghế ăn',23,'TRUE'),(79,'Tã',23,'TRUE'),(80,'Xe số',24,'TRUE'),(81,'Xe ga',24,'TRUE'),(82,'Xe côn tay',24,'TRUE'),(83,'Xe 50cc',24,'TRUE'),(84,'Gối - đệm - ghế',25,'TRUE'),(85,'Phụ tùng ô tô',25,'TRUE'),(86,'Xe đạp leo núi',26,'TRUE'),(87,'Xe đạp điện',26,'TRUE'),(88,'Xe đạp thông dụng',26,'TRUE'),(89,'Xe đạp trẻ em',26,'TRUE'),(90,'Thơ',27,'TRUE'),(91,'Tiểu thuyết',27,'TRUE'),(92,'Sách kỹ năng',27,'TRUE'),(93,'Sách kinh tế',27,'TRUE'),(94,'Children\'s books',28,'TRUE'),(95,'Business',28,'TRUE'),(96,'Education',28,'TRUE'),(97,'thời trang thể thao',15,'TRUE');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cou_pro`
--

DROP TABLE IF EXISTS `cou_pro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cou_pro` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `coupon_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`),
  KEY `coupon_id` (`coupon_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cou_pro_ibfk_1` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`),
  CONSTRAINT `cou_pro_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cou_pro`
--

LOCK TABLES `cou_pro` WRITE;
/*!40000 ALTER TABLE `cou_pro` DISABLE KEYS */;
INSERT INTO `cou_pro` VALUES (1,1,1,'TRUE');
/*!40000 ALTER TABLE `cou_pro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(10) unsigned DEFAULT NULL,
  `coupon_code` varchar(20) CHARACTER SET utf8 NOT NULL,
  `percent` float unsigned DEFAULT '0',
  `money` int(10) unsigned DEFAULT '0',
  `threshold` int(10) unsigned DEFAULT '0',
  `all_product` enum('TRUE','FALSE') DEFAULT NULL,
  `amount` int(11) DEFAULT '0',
  `active` enum('TRUE','FALSE') DEFAULT 'FALSE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupon_code` (`coupon_code`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `coupon_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaign` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1,1,'0',0.1,0,0,'TRUE',-1,'FALSE');
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discount` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` int(10) unsigned NOT NULL,
  `percent` float unsigned NOT NULL,
  `start_time` datetime NOT NULL,
  `expired_time` datetime NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `discount_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount`
--

LOCK TABLES `discount` WRITE;
/*!40000 ALTER TABLE `discount` DISABLE KEYS */;
INSERT INTO `discount` VALUES (1,1,0.99,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(2,2,0.88,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(3,3,0.77,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(4,4,0.66,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(5,5,0.55,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(6,6,0.44,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(7,7,0.33,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(8,8,0.22,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(9,9,0.11,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(10,10,0.01,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(11,11,0.29,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(12,12,0.79,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(13,13,0.01,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(14,14,0.29,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE'),(15,15,0.79,'2019-03-05 16:14:04','2019-03-06 16:14:04','TRUE');
/*!40000 ALTER TABLE `discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `industry`
--

DROP TABLE IF EXISTS `industry`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `industry` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `industry_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `industry`
--

LOCK TABLES `industry` WRITE;
/*!40000 ALTER TABLE `industry` DISABLE KEYS */;
INSERT INTO `industry` VALUES (1,'Điện thoại - máy tính bảng','TRUE'),(2,'Laptop - Thiết bị IT','TRUE'),(3,'Tivi','TRUE'),(4,'Máy ảnh - quay phim','TRUE'),(5,'Hàng tiêu dùng - thực phẩm','TRUE'),(6,'Thể thao dã ngoại','TRUE'),(7,'Nhà cửa đời sống','TRUE'),(8,'Mẹ và bé','TRUE'),(9,'Xe máy - Ô tô - Xe đạp','TRUE'),(10,'Sách','TRUE');
/*!40000 ALTER TABLE `industry` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `accounts_id` int(10) unsigned NOT NULL,
  `fullname` varchar(50) CHARACTER SET utf8 NOT NULL,
  `phone` varchar(11) CHARACTER SET utf8 NOT NULL,
  `email` varchar(50) NOT NULL,
  `address` varchar(300) NOT NULL,
  `total` int(10) unsigned NOT NULL,
  `coupon_id` int(10) unsigned NOT NULL,
  `status` enum('CHECKED','PACKING','SHIPPING','CANCELED','SUCCESSFUL','PENDING','') NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `zalopay_token` text,
  `zptransid` mediumtext,
  `apptransid` varchar(20) DEFAULT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `accounts_id` (`accounts_id`),
  KEY `coupon_id` (`coupon_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`accounts_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (19,22,'Quang Nguyen','033434333','naonguyennguyen@gmail.com','182 le dai hanh',58560000,0,'PACKING','',NULL,NULL,NULL,'TRUE','2019-04-07 11:35:38');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_history`
--

DROP TABLE IF EXISTS `orders_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orders_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orders_id` int(10) unsigned NOT NULL,
  `status` enum('CHECKED','PACKING','SHIPPING','CANCELED','SUCCESSFUL','PENDING','') NOT NULL,
  `date_time` datetime NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`),
  KEY `orders_id` (`orders_id`),
  CONSTRAINT `orders_history_ibfk_1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_history`
--

LOCK TABLES `orders_history` WRITE;
/*!40000 ALTER TABLE `orders_history` DISABLE KEYS */;
INSERT INTO `orders_history` VALUES (2,19,'CHECKED','2019-04-07 11:35:38','TRUE'),(3,19,'PACKING','2019-04-07 11:50:54','TRUE');
/*!40000 ALTER TABLE `orders_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordersdetail`
--

DROP TABLE IF EXISTS `ordersdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ordersdetail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orders_id` int(10) unsigned NOT NULL,
  `product_id` int(10) unsigned NOT NULL,
  `amount` int(10) unsigned NOT NULL,
  `original_price` int(10) unsigned NOT NULL,
  `final_price` int(10) unsigned NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `orders_id` (`orders_id`),
  CONSTRAINT `ordersdetail_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `ordersdetail_ibfk_2` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordersdetail`
--

LOCK TABLES `ordersdetail` WRITE;
/*!40000 ALTER TABLE `ordersdetail` DISABLE KEYS */;
INSERT INTO `ordersdetail` VALUES (40,19,1,1,23490000,23490000,'TRUE'),(41,19,2,1,26080000,26080000,'TRUE'),(42,19,3,1,8990000,8990000,'TRUE');
/*!40000 ALTER TABLE `ordersdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `price` int(10) unsigned NOT NULL,
  `amount` int(10) unsigned NOT NULL,
  `category_id` int(10) unsigned DEFAULT NULL,
  `branch_id` int(10) unsigned DEFAULT NULL,
  `industry_id` int(10) unsigned DEFAULT NULL,
  `brand_id` int(10) unsigned DEFAULT NULL,
  `description` varchar(1000) CHARACTER SET utf8 DEFAULT NULL,
  `long_description` longtext,
  `images` text,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  `discPercent` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `brand_id` (`brand_id`),
  KEY `branch_id` (`branch_id`),
  KEY `category_id` (`category_id`),
  KEY `industry_id` (`industry_id`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `product_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branch` (`id`),
  CONSTRAINT `product_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `product_ibfk_4` FOREIGN KEY (`industry_id`) REFERENCES `industry` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Điện Thoại iPhone X 64GB VN/A - Hàng Chính Hãng',23490000,10011,6,1,2,1,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/1a/f0/a2/0978d091d83849160e6d31945ce9ae08.jpg\",\"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(2,'Điện Thoại Samsung Galaxy Note 9 (512GB/8GB)',26080000,100,1,1,1,2,'Mang lại sự cải tiến đặc biệt trong cây bút S-Pen, siêu phẩm Samsung Galaxy Note 9 còn sở hữu dung lượng pin khủng lên tới 4.000 mAh cùng hiệu năng mạnh mẽ vượt bậc, xứng đáng là một trong những chiếc điện thoại cao cấp nhất của Samsung.','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/99/b8/b2/af43806dd7a682ce11870eed4af3c30d.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(3,'iPad Wifi Cellular 32GB New 2017',8990000,100,5,2,1,1,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/4/_/4.u2769.d20170624.t083902.754667.jpg\",\"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(4,'Máy Tính Bảng Samsung Galaxy Tab A6 7.0 (SM-T285)',3130000,100,6,2,1,2,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/ca/8c/8b/5b84d915aae910c3317efbf5ade0d9b7.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(5,'Điện Thoại iPhone 6 32GB VN/A (Vàng Đồng)',6490000,100,2,1,1,1,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/a1/7f/84/b6b4d9f9c19642795ff73969f8ff485d.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(6,'Apple iPhone 7 128GB',12990000,100,2,1,1,1,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/1/_/1.u2769.d20170403.t142544.139039.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(7,'Điện Thoại Samsung Galaxy J8 (32GB/3GB)',5190000,100,1,1,1,2,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/73/53/ae/b1ae1c4079cea44d3342aadfdd055690.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(8,'MacBook Pro Touch Bar 2018 Core i7/512GB (15 inch)',64990000,100,8,3,2,1,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/bb/05/0d/eb1de7935771377583d308855628b424.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(9,'MacBook Pro Touch Bar 2018 Core i7/256GB (15 inch)',54990000,100,8,3,2,1,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/c4/c0/19/38481d69ece4140665378d13895ac89b.jpg\", \"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(10,'Smart Tivi Samsung 88 inch QLED QA88Q9FAMKXXV',429000000,100,25,7,3,2,'','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/0/_/0.u2769.d20170602.t171814.558377.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/2/_/2.u2769.d20170602.t171814.629388.jpg\"]','TRUE',0),(11,'Android Tivi Sony 4K 75 inch KD-75X9000E',94900000,100,26,7,3,13,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/0/_/0.u5488.d20170728.t134942.646437.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/4/_/4.u5488.d20170728.t134942.880520.jpg\"]','TRUE',0),(12,'Smart Tivi Cong 4K Samsung 65 inch UA65KS9000',94900000,100,25,7,3,2,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/s/a/samsung%2065%20inch%20ua65ks9000_1.u2470.d20160523.t144119.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/s/a/samsung%2065%20inch%20ua65ks9000_1_3.u2470.d20160523.t144119.jpg\"]','TRUE',0),(13,'Máy Ảnh Sony RX100 IV',22990000,100,30,9,4,13,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/s/o/sony_dsc_rx100_mark_4_digital_1436371587000_1159879.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/1/4/1436371239000_img_503621.jpg\"]','TRUE',0),(14,'Máy Ảnh Canon IXUS 190',4400000,100,30,9,4,13,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/x/ixus-190-den-0.u2751.d20170327.t114232.381508.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/i/x/ixus-190-den-3.u2751.d20170327.t114232.485998.jpg\"]','TRUE',0),(15,'Máy Ảnh Lấy Liền Fujifilm Instax SQUARE SQ10 (Trắng)',6990000,100,31,9,4,54,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/5b/34/6f/a8921996626695c3b61fd5f045eb84ed.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/62/3d/69/fbd16ec9a20072dc615e13667a49013b.jpg\"]','TRUE',0),(16,'Máy Ảnh Selfie Lấy Liền Fujifilm Instax Mini 9',1900000,100,31,9,4,54,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/m/i/mini9_ice-blue_01_md.u5168.d20170608.t122753.944199.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/m/i/mini9_ice-blue_10_md.u5168.d20170608.t122754.257180.jpg\"]','TRUE',0),(17,'Snack Poca Khoai Tây Wavy Vị Bò Bít Tết Manhattan',21000,100,47,14,5,55,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/e4/c4/5e/a3d37bf2558e648d9913152696bb0a63.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/2/_/2.u2409.d20171016.t105532.912044.jpg\"]','TRUE',0),(18,'Snack Mực Tẩm Gia Vị Thái Bento (24g)',25000,100,47,14,5,56,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/1/_/1.u2409.d20171016.t173952.35134.jpg\",\"https://salt.tikicdn.com/media/catalog/product/2/_/2.u2409.d20171016.t173952.78556.jpg\"]','TRUE',0),(19,'Socola Viên Milo Nuggets (30g)',14000,100,50,14,5,20,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/c9/c0/9c/8b518597b17a1d230da6a8ea2f1815da.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/31/c6/f3/9653f62a642eaefd02b920b5cd8474d7.jpg\"]','TRUE',0),(20,'Lốc 6 Chai Nước Giải Khát Coca-Cola Vị Cà Phê (390ml / Chai)',50000,100,44,13,5,27,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/b0/f5/04/cf88b34bfc70c9daf3de37a1d49091a6.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/b0/83/00/3cae54c83c742267118cb1cc0a6f94c0.jpg\"]','TRUE',0),(21,'Thùng 24 Lon Nước Giải Khát Coca-Cola Vị Cà Phê (330ml / Lon)',232000,100,44,13,5,27,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/3e/a1/f2/eda2c02035b527a6a490bf8f46efaa44.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/21/65/02/31fb5e549bd028889f7fd184ba1ca84a.jpg\"]','FALSE',0),(22,'Tương Cà Chin-Su (250g)',12000,100,40,12,5,23,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/b1/85/e6/7ff47967a85f7d77e2d80baaf63b5f0b.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/91/f4/5c/5caad978dd8f2b35b5d9bbe02e05891e.jpg\"]','TRUE',0),(23,'Nước Tương Chin-Su (250ml)',12000,100,40,12,5,23,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/2e/4a/2d/84a6ecd3170886fd7885e57ef038e916.jpg\",\"http://bpoc.com/wp-content/uploads/2016/08/Tidi-Products-Logo.jpg\"]','TRUE',0),(24,'Knorr Gia Vị Hoàn Chỉnh Thịt Kho (28g)',6000,100,40,12,5,24,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/ed/cb/4a/8db35486417dd3f532ccf0bbd458b841.jpg\",\"https://salt.tikicdn.com/cache/w1200/media/catalog/product/1/4/1460766.jpg\"]','TRUE',0),(25,'Combo 6 Gói Knorr Gia Vị Hoàn Chỉnh Thịt Kho (28g)',36000,100,40,12,5,24,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/75/d0/46/cc0a987b911c67f32e1267d2053ac1da.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/54/51/ae/d64740cf890cc5dfac1fa9518d8a3a48.jpg\"]','TRUE',0),(26,'Giày Chạy Bộ Nữ Nike Air Relentless 6 MSL 843883-001 - Đen',1700000,100,97,15,6,33,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/72/b3/60/00553d7851799a32eb50f675d0588836.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/c2/ca/3e/f4edd019ea38413d705333c384714de0.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/7a/75/ed/0d9c26535bf74e6d1919cf4c24d54565.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/02/ce/c9/088b33cedd6bca730bbc177f312b303f.jpg\"]','FALSE',0),(27,'Giày Thể Thao Nam Nike CK Racer 916780-403 - Xanh Đen',2120000,100,97,15,6,33,'1\n2\n3','','[\"https://salt.tikicdn.com/cache/w1200/ts/product/7c/55/10/98e221562e3c4b80ddc1cd9613ae7d23.jpg\",\"https://salt.tikicdn.com/cache/w1200/ts/product/74/01/93/36c5953cb65015bacc3ea5f03c0d32f5.jpg\"]','TRUE',0),(28,'mot hai ba',11,1111,30,10,4,1,'wwwwwwwwwwwwwwwwwwwww',NULL,'[\"https://www.twsf.com.tw/taipei/images/default.jpg\"]','TRUE',0),(29,'12345',1212,1212121,1,1,2,1,'qqqqqqqqqqq',NULL,'[\"https://www.twsf.com.tw/taipei/images/default.jpg\"]','TRUE',0),(30,'update dang quang',1212,1121,1,22,8,3,'ddddddddddddddddd',NULL,'[\"https://www.twsf.com.tw/taipei/images/default.jpg\"]','TRUE',0);
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `verification` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `accounts_id` int(10) unsigned NOT NULL,
  `vcode` varchar(20) NOT NULL,
  `active` enum('TRUE','FALSE') DEFAULT 'TRUE',
  `veri_type` enum('PASSWORD','EMAIL','NEWPASSWORD') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `verification`
--

LOCK TABLES `verification` WRITE;
/*!40000 ALTER TABLE `verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'TIDI'
--

--
-- Dumping routines for database 'TIDI'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-08 11:26:06
