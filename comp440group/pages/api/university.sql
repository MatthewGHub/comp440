-- Before execute the file, change your database name (projdb) in lines 4 - 6:
-- The database name should be the same as your database of your user table from step 1

DROP DATABASE IF EXISTS `projdb`;
CREATE DATABASE `projdb`;
USE `projdb`;  

DROP TABLE IF EXISTS `department`;
CREATE TABLE `department` (
  `dept_name` varchar(20)  NOT NULL,
  `building` varchar(15)  DEFAULT NULL,
  `budget` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`dept_name`)
);
INSERT INTO `department` VALUES ('Accounting','Saucon',441840.92),('Astronomy','Taylor',617253.94),('Athletics','Bronfman',734550.70),('Biology','Candlestick',647610.55),('Civil Eng.','Chandler',255041.46),('Comp. Sci.','Lamberton',106378.69),('Cybernetics','Mercer',794541.46),('Elec. Eng.','Main',276527.61),('English','Palmer',611042.66),('Finance','Candlestick',866831.75),('Geology','Palmer',406557.93),('History','Taylor',699140.86),('Languages','Linderman',601283.60),('Marketing','Lambeau',210627.58),('Math','Brodhead',777605.11),('Mech. Eng.','Rauch',520350.65),('Physics','Wrigley',942162.76),('Pol. Sci.','Whitman',573745.09),('Psychology','Thompson',848175.04),('Statistics','Taylor',395051.74);

DROP TABLE IF EXISTS `instructor`;
CREATE TABLE `instructor` (
  `ID` varchar(5)  NOT NULL,
  `name` varchar(20)  NOT NULL,
  `dept_name` varchar(20)  DEFAULT NULL,
  `salary` decimal(8,2) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `dept_name` (`dept_name`),
  CONSTRAINT `instructor_ibfk_1` FOREIGN KEY (`dept_name`) REFERENCES `department` (`dept_name`) ON DELETE SET NULL
);

INSERT INTO `instructor` VALUES ('14365','Lembr','Accounting',32241.56),('15347','Bawa','Athletics',72140.88),('19368','Wieland','Pol. Sci.',124651.41),('22591','DAgostino','Psychology',59706.49),('25946','Liley','Languages',90891.69),('28097','Kean','English',35023.18),('28400','Atanassov','Statistics',84982.92),('3199','Gustafsson','Elec. Eng.',82534.37),('3335','Bourrier','Comp. Sci.',80797.83),('34175','Bondi','Comp. Sci.',115469.11),('36897','Morris','Marketing',43770.36),('41930','Tung','Athletics',50482.03),('4233','Luo','English',88791.45),('42782','Vicentino','Elec. Eng.',34272.67),('43779','Romero','Astronomy',79070.08),('48507','Lent','Mech. Eng.',107978.47),('48570','Sarkar','Pol. Sci.',87549.80),('50330','Shuming','Physics',108011.81),('63287','Jaekel','Athletics',103146.87),('6569','Mingoz','Finance',105311.38),('65931','Pimenta','Cybernetics',79866.95),('73623','Sullivan','Elec. Eng.',90038.09),('74420','Voronina','Physics',121141.99),('77346','Mahmoud','Geology',99382.59),('79081','Ullman ','Accounting',47307.10),('80759','Queiroz','Biology',45538.32),('81991','Valtchev','Biology',77036.18),('90376','Bietzk','Cybernetics',117836.50),('90643','Choll','Statistics',57807.09),('95709','Sakurai','English',118143.98),('99052','Dale','Cybernetics',93348.83);