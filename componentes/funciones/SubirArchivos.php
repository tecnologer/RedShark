<?php

		$nb_cancion= $_POST['nb_cancion'];
		$nb_artista= $_POST['nb_artista'];
		$nb_album= $_POST['nb_album'];
		$file_cancion= 'fileToUpload';

		echo '<pre>';
		if (move_uploaded_file($_FILES[$file_cancion]['tmp_name'], "../../audio_php/" . $_FILES[$file_cancion]["name"])) {
		    echo "El archivo es válido y fue cargado exitosamente.\n";
		} else {
		    echo "¡Posible ataque de carga de archivos!\n";
		}

		echo 'Aquí hay más información de depurado:';
		print_r($_FILES);

		print "</pre>";

?>