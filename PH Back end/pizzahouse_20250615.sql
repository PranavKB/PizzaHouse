-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.22


--
-- Create schema pizzahouse
--

CREATE DATABASE IF NOT EXISTS pizzahouse;
USE pizzahouse;

--
-- Definition of table `items`
--

DROP TABLE IF EXISTS `items`;
-- pizzahouse.items definition

CREATE TABLE `items` (
  `item_id` int unsigned NOT NULL AUTO_INCREMENT,
  `item_name` varchar(255) DEFAULT NULL,
  `item_price` int unsigned NOT NULL,
  `item_type_id` int unsigned NOT NULL,
  `is_veg` int unsigned NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `offers`;

CREATE TABLE offers (
  offer_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  offer_text VARCHAR(100) NOT NULL COMMENT 'e.g., 20% OFF or ₹120 OFF',
  discount_type ENUM('flat', 'percentage', 'bogo') NOT NULL,
  discount_value DECIMAL(10,2) DEFAULT NULL COMMENT 'e.g., 120 for ₹120 or 50 for 50%',
  valid_from DATETIME DEFAULT NULL,
  valid_to DATETIME DEFAULT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (offer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO offers (offer_text, discount_type, discount_value, valid_from, valid_to, is_active)
VALUES 
  ('50% OFF', 'percentage', 50.00, '2025-08-01 00:00:00', '2025-08-31 23:59:59', TRUE),
  ('₹120 OFF', 'flat', 120.00, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 30 DAY), TRUE),
  ('20% OFF (5-6PM)', 'percentage', 20.00, 
    CONCAT(DATE(UTC_TIMESTAMP()), ' 17:00:00'), 
    CONCAT(DATE(UTC_TIMESTAMP()), ' 18:00:00'), 
    TRUE
  ),
  ('Buy One Get One Free', 'bogo', NULL, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 7 DAY), TRUE);


--
-- Dumping data for table `items`
--

/*!40000 ALTER TABLE `items` DISABLE KEYS */;
INSERT INTO `items` (`item_id`,`item_name`,`item_price`,`item_type_id`,`is_veg`,`description`,`image_url`) VALUES 
 (1,'Margherita',250,1,1,'A hugely popular margherita, with a deliciously tangy single cheese topping','src/assets/images/pizza/veg/Margherita.jpg'),
 (2,'Farmhouse',300,1,1,'Farmhouse is a pizza that goes ballistic on veggies!','src/assets/images/pizza/veg/Farmhouse.jpg'),
 (3,'Peppy Paneer',350,1,1,'Chunky paneer with crisp capsicum and spicy red pepper - quite a mouthful!','src/assets/images/pizza/veg/Peppy_Paneer.jpg'),
 (4,'Chicken Fiesta',350,1,0,'Chewy pizza crust topped with tender strips of taco-seasoned chicken, Colby Jack cheese and salsa','src/assets/images/pizza/nonveg/Chicken_Fiesta.jpg'),
 (5,'Chicken Golden Delight',400,1,0,'Barbeque chicken with a topping of golden corn loaded with extra cheese','src/assets/images/pizza/nonveg/Chicken_Golden_Delight.jpg'),
 (6,'Non Veg Supreme',450,1,0,'Bite into supreme delight of Black Olives, Onions, Grilled Mushrooms, Pepper BBQ Chicken, Peri-Peri Chicken, Grilled Chicken Rashers','src/assets/images/pizza/nonveg/Non_Veg_Supreme.jpg'),
 (7,'Garlic Bread',100,2,1,'Bread topped with garlic and olive oil or butter and include additional herbs, such as oregano or chives','src/assets/images/sides/Garlic_Bread.jpg'),
 (8,'Stuffed Garlic Bread',150,2,1,'Bursting with flavour, this Stuffed Garlic Bread can be served with soup or enjoyed as a snack by itself','src/assets/images/sides/Stuffed_Garlic_Break.jpg'),
 (9,'White Pasta',100,3,1,'White sauce pasta is a creamy, delicious and cheesy pasta tossed in white sauce or bechamel sauce and loaded with veggies','src/assets/images/pasta/White_Pasta.jpg'),
 (10,'Non Veg Pasta',150,3,0,'A basic tomato spaghetti recipe made with chicken','src/assets/images/pasta/Non_Veg_Pasta.jpg'),
 (11,'Mousse Cake',50,4,1,'Chocolate Mousse Cake with three layers of moist chocolate cake and two layers of smooth & creamy chocolate mousse','src/assets/images/desserts/Mousse_Cake.jpg');
/*!40000 ALTER TABLE `items` ENABLE KEYS */;

-- ALTER TABLE items
-- ADD COLUMN offer_id INT UNSIGNED DEFAULT NULL,
-- ADD CONSTRAINT fk_offer_id FOREIGN KEY (offer_id)
-- REFERENCES offers(offer_id)
-- ON DELETE SET NULL
-- ON UPDATE CASCADE;

DROP TABLE IF EXISTS `item_offers`;


CREATE TABLE item_offers (
  item_id INT UNSIGNED NOT NULL,
  offer_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (item_id, offer_id),
  CONSTRAINT fk_item
    FOREIGN KEY (item_id) REFERENCES items(item_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_offer
    FOREIGN KEY (offer_id) REFERENCES offers(offer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



--
-- Definition of table `itemtype`
--

DROP TABLE IF EXISTS `item_type`;
CREATE TABLE `item_type` (
  `item_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `item_type_name` varchar(45) NOT NULL,
  `Item_type_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `itemtype`
--

/*!40000 ALTER TABLE `itemtype` DISABLE KEYS */;
INSERT INTO `item_type` (`item_type_id`,`item_type_name`,`Item_type_description`) VALUES 
 (1,'pizza',NULL),
 (2,'sides',NULL),
 (3,'pasta',NULL),
 (4,'dessert',NULL),
 (5,'beverages',NULL);
/*!40000 ALTER TABLE `itemtype` ENABLE KEYS */;


--
-- Definition of table `order`
--

DROP TABLE IF EXISTS `orders`;


CREATE TABLE `orders` (
  `order_id` INT NOT NULL AUTO_INCREMENT,
  `customer_name` VARCHAR(255) DEFAULT NULL,
  `order_address` VARCHAR(255) DEFAULT NULL,
  `order_email_id` VARCHAR(255) DEFAULT NULL,
  `order_mobile_no` VARCHAR(20) DEFAULT NULL,
  `order_pin_code` VARCHAR(20) DEFAULT NULL,
  `order_status_id` INT(10) UNSIGNED NOT NULL DEFAULT 1,
  `order_time_stamp` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `order_total` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`order_id`),
  
  -- Foreign key to order_status table
  CONSTRAINT `fk_order_status`
    FOREIGN KEY (`order_status_id`) 
    REFERENCES `order_status` (`order_status_id`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB 
  AUTO_INCREMENT=23 
  DEFAULT CHARSET=utf8mb4 
  COLLATE=utf8mb4_0900_ai_ci;


--
-- Dumping data for table `order`
--

/*!40000 ALTER TABLE `order` DISABLE KEYS */;
-- INSERT INTO `orders` (`order_id`,`order_email_id`,`order_address`,`order_name`,`order_pincode`,`order_mobile_no`,`order_total`,`order_ts`,`payment_id`,`order_status`,`order_paid`) VALUES 
--  (1,'pizza@pizza','pizzahouse','pizza','000000','999666333',1850,'2024-08-19 19:36:17',1,1,0),
--  (2,'tommy@gmail.com','Laburnum Park','Tom','789456','77445588',800,'2024-08-21 10:16:49',1,1,0);
/*!40000 ALTER TABLE `order` ENABLE KEYS */;


--
-- Definition of table `orderitem`
--

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE order_items (
  order_item_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  item_id INT UNSIGNED NOT NULL,
  item_name VARCHAR(255) DEFAULT NULL,
  price INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  sub_total INT UNSIGNED NOT NULL,
  order_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (order_item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- CREATE TABLE `order_items` (
--   `order_item_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `item_id` int(10) unsigned NOT NULL,
--   `item_name` varchar(45) NOT null,
--   `quantity` int(10) unsigned NOT NULL,
--   `price` int(10) unsigned NOT NULL,
--   `order_id` int(10) unsigned NOT NULL,
--   `sub_total` int(10) unsigned NOT NULL,
--   PRIMARY KEY (`order_item_id`)
-- ) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orderitem`
--

/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
-- INSERT INTO `order_items` (`order_item_id`,`item_id`,`quantity`,`order_id`,`subtotal`) VALUES 
--  (1,4,3,1,1050),
--  (27,2,1,2,300);
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;

DROP TABLE IF EXISTS `order_item_offers`;

CREATE TABLE order_item_offers (
  order_item_id INT UNSIGNED NOT NULL,
  offer_id BIGINT NOT NULL,
  discount_amount INT UNSIGNED NOT NULL,
  PRIMARY KEY (order_item_id, offer_id),
  FOREIGN KEY (order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (offer_id) REFERENCES offers(offer_id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;











--
-- Definition of table `orderstatus`
--

DROP TABLE IF EXISTS `order_status`;
CREATE TABLE `order_status` (
  `order_status_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_status_name` varchar(45) NOT NULL,
  PRIMARY KEY (`order_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `orderstatus`
--

/*!40000 ALTER TABLE `orderstatus` DISABLE KEYS */;
INSERT INTO `order_status` (`order_status_id`,`order_status_name`) VALUES 
 (1,'In Cart'),
 (2,'Payment Pending'),
 (3,'Payment Recieved'),
 (4,'Order Accepted'),
 (5,'Order Preparing'),
 (6,'Order Dispatched'),
 (7,'Out for Delivery'),
 (8,'Delivered'),
 (9,'Cancelled');
/*!40000 ALTER TABLE `orderstatus` ENABLE KEYS */;




--
-- Definition of table `payment`
--

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `payment_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `payment_mode` INT(10) UNSIGNED NOT NULL,
  `payment_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_status` INT(10) UNSIGNED NOT NULL DEFAULT '4',
  PRIMARY KEY (`payment_id`),
  
  -- Foreign key to orders table
  CONSTRAINT `fk_payment_order`
    FOREIGN KEY (`order_id`)
    REFERENCES `orders` (`order_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB 
  DEFAULT CHARSET=latin1;


--
-- Dumping data for table `payment`
--

/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;


--
-- Definition of table `paymentmode`
--

DROP TABLE IF EXISTS `payment_mode`;
CREATE TABLE `payment_mode` (
  `payment_mode_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `payment_mode_name` varchar(45) NOT NULL,
  `payment_mode_description` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`payment_mode_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `paymentmode`
--

/*!40000 ALTER TABLE `paymentmode` DISABLE KEYS */;
INSERT INTO `payment_mode` (`payment_mode_id`,`payment_mode_name`,`payment_mode_description`) VALUES 
 (1,'Cash or Card or Wallet On Delivery',NULL),
 (2,'Net Banking',NULL),
 (3,'Online Credit or Debit Card',NULL),
 (4,' PayTM Wallet',NULL),
 (5,'GPay',NULL),
 (6,'UPI Payment',NULL);
/*!40000 ALTER TABLE `paymentmode` ENABLE KEYS */;


--
-- Definition of table `paymentstatus`
--

DROP TABLE IF EXISTS `payment_status`;
CREATE TABLE `payment_status` (
  `payment_status_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `payment_status_name` varchar(45) NOT NULL,
  PRIMARY KEY (`payment_status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `paymentstatus`
--

/*!40000 ALTER TABLE `paymentstatus` DISABLE KEYS */;
INSERT INTO `payment_status` (`payment_status_id`,`payment_status_name`) VALUES 
 (1,'Payment Not Initiated'),
 (2,'Payment Initiated'),
 (3,'Payment Pending'),
 (4,'Payment Done');
/*!40000 ALTER TABLE `paymentstatus` ENABLE KEYS */;


--
-- Definition of table `user`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `mobile_num` varchar(255) DEFAULT NULL,
  `user_type` int unsigned NOT NULL DEFAULT '3',
  `address` varchar(255) NOT NULL,
  `pincode` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `users` (`user_id`,`email`,`password`,`mobile_num`,`user_type`,`address`,`pincode`,`user_name`) VALUES 
 (1,'dummy@gmail.com','010a5bf4bd8303cfb3b2ab867288144d','987654321',3,'Pizzawale','789456','Dummy'),
 (2,'tommy@gmail.com','e358efa489f58062f10dd7316b65649e','77445588',3,'Laburnum Park','789456','Tom'),
 (3,'dummy@pizzawale.com','010a5bf4bd8303cfb3b2ab867288144d','987654321',1,'Pizzawale','789456','Dummy'),
 (4,'admin@pizzawale.com','21232f297a57a5a743894a0e4a801fc3','987654321',1,'Pizzawale','789456','Admin'),
 (5,'employee@pizzahouse.com','ac8be4aee61f5f6e21b8c5afffb52939','987654321',2,'Pizzahouse','789456','Employee');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;


--
-- Definition of table `usertype`
--

DROP TABLE IF EXISTS `user_type`;
CREATE TABLE `user_type` (
  `user_type_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_type_name` varchar(45) NOT NULL,
  `user_type_description` varchar(45) NOT NULL,
  PRIMARY KEY (`user_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `usertype`
--

/*!40000 ALTER TABLE `usertype` DISABLE KEYS */;
INSERT INTO `user_type` (`user_type_id`,`user_type_name`,`user_type_description`) VALUES 
 (1,'Admin','The Administrators'),
 (2,'Employee','The Employees'),
 (3,'Customer','The Customers'),
 (4,'Guest','Guests');
/*!40000 ALTER TABLE `usertype` ENABLE KEYS */;

DROP TABLE IF EXISTS `order_status_history`;

CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,                      
    order_id INT NOT NULL,                     
    status_id INT NOT NULL,                     
    changed_at TIMESTAMP DEFAULT NOW(),         
    changed_by INT,                             
    note TEXT
    )

