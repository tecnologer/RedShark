CREATE DATABASE RedShark;
USE DATABASE RedShark;

CREATE TABLE Artistas(
	id_Artista int PRIMARY KEY not null,
	nb_artista varchar(250) not null
);

CREATE TABLE Albums(
	id_artista int not null,
	id_album int not null,
	nb_album varchar(250) not null,
	FOREIGN KEY (id_artista) REFERENCES Artistas (id_artista),
	PRIMARY KEY (id_artista,id_album)
);

CREATE TABLE Canciones (
    id_artista int,
    id_album int,
    id_cancion int,
    nb_cancion varchar(250),
    de_archivo varchar(500),
    FOREIGN KEY (id_artista,id_album) REFERENCES Albums (id_artista,id_album),
    PRIMARY KEY (id_artista,id_album,id_cancion)
);