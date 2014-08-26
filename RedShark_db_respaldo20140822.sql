/*
MySQL Backup
Source Server Version: 5.5.8
Source Database: redshark
Date: 22/08/2014 16:23:07
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
--  Table structure for `albums`
-- ----------------------------
DROP TABLE IF EXISTS `albums`;
CREATE TABLE `albums` (
  `id_artista` int(11) NOT NULL,
  `id_album` int(11) NOT NULL,
  `nb_album` varchar(250) NOT NULL,
  PRIMARY KEY (`id_artista`,`id_album`),
  CONSTRAINT `albums_ibfk_1` FOREIGN KEY (`id_artista`) REFERENCES `artistas` (`id_Artista`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `artistas`
-- ----------------------------
DROP TABLE IF EXISTS `artistas`;
CREATE TABLE `artistas` (
  `id_Artista` int(11) NOT NULL,
  `nb_artista` varchar(250) NOT NULL,
  PRIMARY KEY (`id_Artista`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Table structure for `canciones`
-- ----------------------------
DROP TABLE IF EXISTS `canciones`;
CREATE TABLE `canciones` (
  `id_artista` int(11) NOT NULL DEFAULT '0',
  `id_album` int(11) NOT NULL DEFAULT '0',
  `id_cancion` int(11) NOT NULL DEFAULT '0',
  `nb_cancion` varchar(250) DEFAULT NULL,
  `de_archivo` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_artista`,`id_album`,`id_cancion`),
  CONSTRAINT `canciones_ibfk_1` FOREIGN KEY (`id_artista`, `id_album`) REFERENCES `albums` (`id_artista`, `id_album`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
--  Procedure definition for `upC_albums`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upC_albums`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upC_albums`(p_id_artista int, p_id_album int, p_nb_album varchar(250))
BEGIN
	INSERT INTO albums (id_artista,id_album,nb_album) VALUES (p_id_artista,p_id_album,p_nb_album);
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upC_artistas`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upC_artistas`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upC_artistas`(`id_artista` int,`nb_artista` varchar (250))
BEGIN
	INSERT INTO artistas (id_artista,nb_artista) VALUES (id_artista,nb_artista);
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upC_canciones`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upC_canciones`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upC_canciones`(`p_id_artista` int,`p_id_album` int,`p_id_cancion` int,`p_nb_cancion` varchar(250),`p_de_archivo` varchar(250))
BEGIN
	insert INTO canciones (id_artista,id_album,nb_cancion,de_Archivo) VALUES (p_id_artista,p_id_album,p_nb_cancion,p_de_Archivo);
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upL_albumsPorNombre`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upL_albumsPorNombre`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upL_albumsPorNombre`(`p_id_artista` int,`p_nb_album` varchar(250))
BEGIN
	SELECT * FROM albums where id_artista=p_id_artista AND nb_album=IFNULL(p_nb_album,nb_album);
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upL_artistas`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upL_artistas`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upL_artistas`()
BEGIN
	SELECT * FROM artistas;

END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upL_artistasPorNombre`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upL_artistasPorNombre`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upL_artistasPorNombre`(p_nb_Artista varchar(250))
BEGIN
	SELECT * FROM artistas WHERE nb_artista=p_nb_Artista;
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upL_canciones`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upL_canciones`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upL_canciones`()
BEGIN
	SELECT
		c.*,
		al.nb_album,
		a.nb_artista,
		CONCAT(a.nb_artista,'/',al.nb_album,'/',c.de_archivo) as dir_archivo
	FROM
		canciones c,
		artistas a,
		albums al
	WHERE
		c.id_artista = al.id_artista AND 
		c.id_album = al.id_album AND
		c.id_artista=a.id_Artista;
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upL_cancionPorNombre`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upL_cancionPorNombre`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upL_cancionPorNombre`(`p_id_artista` int,`p_id_album` int,`p_nb_cancion` varchar(250))
BEGIN
	select * from canciones
	WHERE id_artista=p_id_artista AND
		    id_album=p_id_album AND
				nb_cancion=p_nb_cancion;
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upR_albumsNextId`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upR_albumsNextId`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upR_albumsNextId`(`p_id_artista` int)
BEGIN
	SELECT IFNULL(MAX(id_album),0)+1 as NextID FROM albums WHERE id_artista=p_id_artista;
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upR_artistasNextId`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upR_artistasNextId`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upR_artistasNextId`()
BEGIN
	SELECT IFNULL(MAX(id_artista),0)+1 as nextID FROM artistas;
END
;;
DELIMITER ;

-- ----------------------------
--  Procedure definition for `upR_cancionesNextId`
-- ----------------------------
DROP PROCEDURE IF EXISTS `upR_cancionesNextId`;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upR_cancionesNextId`(`p_id_artista` int,`p_id_album` int)
BEGIN
	select IFNULL(MAX(id_cancion),0)+1 as nextID FROM Canciones WHERE id_artista=p_id_artista AND id_album=p_id_album;
END
;;
DELIMITER ;

-- ----------------------------
--  Records 
-- ----------------------------
--INSERT INTO `albums` VALUES ('1','1','Voy a pasarmela bien'), ('1','2','Default'), ('2','1','Default'), ('3','1','Finisterra'), ('5','1','Bastardos Sin Gloria'), ('6','1','Bastardos Sin Gloria'), ('7','1','The Wall'), ('8','1','Willy and the Poor Boys'), ('9','1','Lichtgestalt'), ('10','1','Default'), ('11','1','Tributo a 31 minutos'), ('12','1','Default'), ('13','1','Putas Submarinas'), ('14','1','Cry Havoc'), ('15','1','Default'), ('16','1','Default'), ('17','1','No need to argue'), ('18','1','Default'), ('19','1','Default'), ('20','1','Acid Tongue'), ('20','2','Rabbit Furcoat'), ('21','1','Default'), ('22','1','True'), ('23','1','OST Sakura Card Captors'), ('24','1','OK Computer'), ('25','1','Default'), ('26','1','Default'), ('27','1','Default'), ('28','1','Default'), ('29','1','Default'), ('30','1','Default'), ('31','1','Default'), ('32','1','Default');
--INSERT INTO `artistas` VALUES ('1','Hombres G'), ('2','Liran Roll'), ('3','Mago de Oz'), ('4','Toreros muertos'), ('5','Nick Perito'), ('6','Ennio Morricone'), ('7','Pink Floyd'), ('8','Creedence Clearwater Revival'), ('9','Lacrimosa'), ('10','MUSE'), ('11','Belanova'), ('12','Rammstein'), ('13','Chumel Torres'), ('14','Destrophy'), ('15','CSS'), ('16','Love of Lesbian'), ('17','The Cranberries'), ('18','Seleno Gomez'), ('19','Coldplay'), ('20','Jenny Lewis'), ('21','Marcelo Camelo e Mallu'), ('22','Avicii'), ('23','SCC'), ('24','Radiohead'), ('25','Flume Remix'), ('26','Russian Red'), ('27','Sublime'), ('28','Conchita Wurst'), ('29','School Rumble '), ('30','Silvio Rodriguez'), ('31','Angra'), ('32','Angeles Azules');
--INSERT INTO `canciones` VALUES ('1','1','1','Dulce Belen','Dulce Belen.mp3'), ('1','2','1','El ataque de las chicas cocodrilo','El ataque de las chicas cocodrilo.mp3'), ('1','2','2','Encima de Ti','Encima de Ti.mp3'), ('1','2','3','En otro mundo','En otro mundo.mp3'), ('2','1','1','La flaca','La flaca.mp3'), ('3','1','1','Fiesta Pagana','Fiesta Pagana.mp3'), ('3','1','2','Kelpie','Kelpie.mp3'), ('5','1','1','The green leaves of summer','The green leaves of summer.mp3'), ('6','1','1','The_verdict (Dopo la condanna)','The_verdict (Dopo la condanna).mp3'), ('6','1','2','Rabbia e tarantella','Rabbia e tarantella.mp3'), ('7','1','1','The Thin Ice','The Thin Ice.mp3'), ('7','1','2','In the Flesh','In the Flesh.mp3'), ('8','1','1','Cotton Fields','Cotton Fields.mp3'), ('8','1','2','Fortunate Son','Fortunate Son.mp3'), ('8','1','3','Effigy','Effigy.mp3'), ('8','1','4','Poorboy Shuffle','Poorboy Shuffle.mp3'), ('9','1','1','Lichtgestalt','Lichtgestalt.mp3'), ('10','1','1','Supermassive Black Hole','Supermassive Black Hole.mp3'), ('11','1','1','Yo nunca vi television','Yo nunca vi television.mp3'), ('12','1','1','Sonne','Sonne.mp3'), ('13','1','1','Snowden in the Deep','Snowden in the Deep.mp3'), ('14','1','1','All my life','All my life.mp3'), ('15','1','1','Let\'s make love and listen to death from above','Let\'s make love and listen to death from above.mp3'), ('16','1','1','Club de fans de John Boy','Club de fans de John Boy.mp3'), ('17','1','1','Zombie','Zombie.mp3'), ('18','1','1','Love you like a love song ','Love you like a love song .mp3'), ('19','1','1','Atlas','Atlas.mp3'), ('20','2','1','You are what you love','You are what you love.mp3'), ('21','1','1','Janta','Janta.mp3'), ('22','1','1','Addicted to you','Addicted to you.mp3'), ('23','1','1','Arigatou','Arigatou.mp3'), ('24','1','1','Paranoid Android','Paranoid Android.mp3'), ('25','1','1','You and Me','You and Me.mp3'), ('26','1','1','Casper','Casper.mp3'), ('27','1','1','Santeria','Santeria.mp3'), ('28','1','1','Rise like a phoenix','Rise like a phoenix.mp3'), ('29','1','1','Sentimental Generation','Sentimental Generation.mp3'), ('30','1','1','La familia la propiedad privada y el amor','La familia la propiedad privada y el amor.mp3'), ('31','1','1','Millenium sun','Millenium sun.mp3'), ('32','1','1','17 anios','17 anios.mp3');
