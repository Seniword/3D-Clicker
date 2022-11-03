-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 03, 2022 at 01:53 PM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `3dclicker`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements_list`
--

DROP TABLE IF EXISTS `achievements_list`;
CREATE TABLE IF NOT EXISTS `achievements_list` (
  `achievement_id` int(11) NOT NULL AUTO_INCREMENT,
  `achievement_name` varchar(255) NOT NULL,
  PRIMARY KEY (`achievement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `bestiary`
--

DROP TABLE IF EXISTS `bestiary`;
CREATE TABLE IF NOT EXISTS `bestiary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `monster_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `monster_id` (`monster_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `monster_stats`
--

DROP TABLE IF EXISTS `monster_stats`;
CREATE TABLE IF NOT EXISTS `monster_stats` (
  `monster_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `health` int(11) NOT NULL,
  `physical_defense` int(11) NOT NULL,
  `magical_defense` int(11) NOT NULL,
  `gold_factor` int(11) NOT NULL,
  `xp_factor` int(11) NOT NULL,
  PRIMARY KEY (`monster_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `monster_stats`
--

INSERT INTO `monster_stats` (`monster_id`, `name`, `level`, `health`, `physical_defense`, `magical_defense`, `gold_factor`, `xp_factor`) VALUES
(1, 'Soldier', 1, 100, 0, 0, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `username`, `password`) VALUES
(1, 'test@test.com', 'testname', '$2b$10$z929WmEI74UxfXaaBI7GFeR.iVWlv3CBANHpbtjjDTYL8gAR.wejG'),
(2, 'a@adjk.fr', 'blabliblo', '$2b$10$e42vcmg9ch57qj0VQ9haOOXuf3ulWogGAHaFGCndR.AJQYM/r4wyC'),
(10, 'a@abjk.fr', 'blahliblo', '$2b$10$lf.zZx0wjfX9mToQhNCVhOR1tZqwopb/RwtzxHowuod7DrHaTsp9e'),
(11, 'fghkjl@gmail.com', 'jjfkdlsjflksd', '$2b$10$RZX1JmVm3XBxgy7RZV25Yu8827z6FJOktEpVNbTZ/xKe4JBeD5qU6'),
(13, 'hfisufs@gmail.com', 'jgdfhgkpdgjlie', '$2b$10$DlLpXQ1n4tpRtsV5WHYaS.Whr1mounK.jfFWEG.yk95zrWXYneijm'),
(15, 'zertyu@gmail.com', 'fnhoshgezib', '$2b$10$d.x0HzF9c3mPAmSIQscvY.Qf0O6Ks8TtiXBox/LKcDcJEpkPssd46'),
(16, 'zaer@gjk.com', 'thsrjighlkrshfkl', '$2b$10$Ymq91UzrwSxw/2EjWmiRhum6H2wW3rN0UX4BS5F8Jbcv9TAj10RFy'),
(17, 'ezrertyj@gkl.com', 'gberjkhgjerjl', '$2b$10$KlaQXW438HZR57SVvyOEzumUCd5uG7Tn9exA5yC92xGVtV1q/iEXq'),
(18, 'fezf@fezf.com', 'Seniword', '$2b$10$QVnRJ6psDKTKY6el62eBqevpx/WJcHrMHnWaxV4LuZDIArfXclT8u'),
(19, 'test@test.com', 'testtesttest', '$2b$10$z929WmEI74UxfXaaBI7GFeR.iVWlv3CBANHpbtjjDTYL8gAR.wejG'),
(20, 'ghsog@gjfl.com', 'usernamee', '$2b$10$oAUFfPJLCeZX85T4qpEvl.yTQH0BSIlTZHOWM5lNdOtiHVx/gaKPO'),
(21, 'imawarrior@gmail.com', 'MeAttackBIG', '$2b$10$XFs/DlsaFLaWcfHzKU.te.j9BTNfG.gJHosUqImFCYn0O8kyXgXaW');

-- --------------------------------------------------------

--
-- Table structure for table `user_achievements`
--

DROP TABLE IF EXISTS `user_achievements`;
CREATE TABLE IF NOT EXISTS `user_achievements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `achievement_id` (`achievement_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_stats`
--

DROP TABLE IF EXISTS `user_stats`;
CREATE TABLE IF NOT EXISTS `user_stats` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `money` int(13) NOT NULL,
  `class` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_stats`
--

INSERT INTO `user_stats` (`user_id`, `money`, `class`) VALUES
(2, 0, 'Warrior'),
(18, 385, 'Archer'),
(21, 0, 'Warrior');

-- --------------------------------------------------------

--
-- Table structure for table `user_weapons`
--

DROP TABLE IF EXISTS `user_weapons`;
CREATE TABLE IF NOT EXISTS `user_weapons` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `weapon_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `weapon_id` (`weapon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_weapons`
--

INSERT INTO `user_weapons` (`id`, `user_id`, `weapon_id`, `quantity`) VALUES
(1, 18, 1, 48),
(3, 18, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `weapons_list`
--

DROP TABLE IF EXISTS `weapons_list`;
CREATE TABLE IF NOT EXISTS `weapons_list` (
  `weapon_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `dps` int(11) NOT NULL,
  `dpc` int(11) NOT NULL,
  PRIMARY KEY (`weapon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `weapons_list`
--

INSERT INTO `weapons_list` (`weapon_id`, `name`, `price`, `dps`, `dpc`) VALUES
(1, 'Broken sword', 10, 0, 1),
(2, 'Broken staff', 10, 2, 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bestiary`
--
ALTER TABLE `bestiary`
  ADD CONSTRAINT `bestiary_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `bestiary_ibfk_2` FOREIGN KEY (`monster_id`) REFERENCES `monster_stats` (`monster_id`);

--
-- Constraints for table `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements_list` (`achievement_id`);

--
-- Constraints for table `user_stats`
--
ALTER TABLE `user_stats`
  ADD CONSTRAINT `user_stats_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_weapons`
--
ALTER TABLE `user_weapons`
  ADD CONSTRAINT `user_weapons_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `user_weapons_ibfk_2` FOREIGN KEY (`weapon_id`) REFERENCES `weapons_list` (`weapon_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
