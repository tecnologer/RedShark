<?php
	$nb_cancion=$_GET['nb_cancion'];
	$nb_artista=$_GET['nb_artista'];
	$nb_album=$_GET['nb_album'];

	if(empty($nb_album) || $nb_album=="")
	{
		$nb_album='Default';
	}
	$reemplazados = array("á", "é", "í", "ó", "ú", "Á", "É", "Í", "Ó", "Ú","\\","/");
	$reemplazantes = array("a", "e", "i", "o", "u", "A", "E", "I", "O", "U","","");

	$nb_artista=str_replace($reemplazados, $reemplazantes, $nb_artista);
	$nb_archivo=str_replace($reemplazados, $reemplazantes, $nb_cancion);
	$nb_albumDir=str_replace($reemplazados, $reemplazantes, $nb_album);
	
	
	// $jsonData = json_encode($tempArray);
	// file_put_contents('results.json', $jsonData;

	// file_put_contents('canciones_db.json', $json,FILE_APPEND);

	$error = "";
	$msg = "";
	$fileElementName = 'fileToUpload';
	$isOk=false;


	try {
		
		$cnx=mysqli_connect("127.0.0.1","root","","redshark") or die(mysql_error());

		// mysqli_query("START TRANSACTION");

		if(!empty($_FILES[$fileElementName]['error']))
		{
			switch($_FILES[$fileElementName]['error'])
			{

				case '1':
					$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
					break;
				case '2':
					$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
					break;
				case '3':
					$error = 'The uploaded file was only partially uploaded';
					break;
				case '4':
					$error = 'No file was uploaded.';
					break;

				case '6':
					$error = 'Missing a temporary folder';
					break;
				case '7':
					$error = 'Failed to write file to disk';
					break;
				case '8':
					$error = 'File upload stopped by extension';
					break;
				case '999':
				default:
					$error = 'No error code avaiable';
			}
		}elseif(empty($_FILES['fileToUpload']['tmp_name']))
		{
			$error = 'No file was uploaded..empty';
		}
		elseif($_FILES['fileToUpload']['tmp_name'] == 'none'){
			$error = 'No file was uploaded..none';
		}
		else 
		{
				// $msg .= " File Name: " . $_FILES['fileToUpload']['name'] . ", ";
				// $msg .= " File Size: " . @filesize($_FILES['fileToUpload']['tmp_name']);
				
				if (!is_dir("audio_php/".$nb_artista))
				{
					if(!mkdir("audio_php/".$nb_artista, 0777))
						$error="Error al crear directorio.";
					else
						$isOk=true;
				}
				else
					$isOk=true;

				if ($isOk && !is_dir("audio_php/".$nb_artista."/".$nb_albumDir))
				{
					if(!mkdir("audio_php/".$nb_artista."/".$nb_albumDir, 0777))
						$error="Error al crear directorio.";
					else
						$isOk=true;
				}
				else
					$isOk=true;

			
				if($isOk)
				{
					$ext = "mp3";//pathinfo($_FILES[$fileElementName]['tmp_name']['name'], PATHINFO_EXTENSION);
					move_uploaded_file($_FILES[$fileElementName]['tmp_name'], "audio_php/".$nb_artista."/".$nb_albumDir."/".$nb_archivo.".".$ext);				
					

					$result = mysqli_query($cnx,"SELECT id_artista FROM artistas WHERE nb_artista='".$nb_artista."'") or die(mysql_error());

					if(mysqli_num_rows($result)>0)
					{
						$id_artista= mysqli_fetch_array($result);
						$id_artista=$id_artista["id_artista"];
					}
					else
					{
						$result = mysqli_query($cnx,"SELECT COALESCE(MAX(id_artista),0)+1 as nextID FROM artistas") or die(mysql_error());
						$id_artista= mysqli_fetch_array($result);
						$id_artista=$id_artista["nextID"];
						$artistas=mysqli_query($cnx,"INSERT INTO Artistas (id_Artista, nb_artista) VALUES (".$id_artista.", '".$nb_artista."')") or die(mysql_error());
					}

					$result = mysqli_query($cnx,"SELECT id_album FROM albums WHERE id_artista=".$id_artista." AND nb_album='".$nb_album."'") or die(mysql_error());

					if(mysqli_num_rows($result)>0)
					{
						$id_album= mysqli_fetch_array($result);
						$id_album=$id_album["id_album"];
					}
					else
					{
						$result = mysqli_query($cnx,"SELECT COALESCE(MAX(id_album),0)+1 as nextID FROM albums WHERE id_artista=".$id_artista) or die(mysql_error());
						$id_album= mysqli_fetch_array($result);
						$id_album=$id_album["nextID"];
						$albums=mysqli_query($cnx,"INSERT INTO albums (id_Artista,id_album, nb_album) VALUES (".$id_artista.",".$id_album.",'".$nb_album."')") or die(mysql_error());
					}

					$result = mysqli_query($cnx,"SELECT id_cancion FROM canciones WHERE id_artista=".$id_artista." AND id_album=".$id_album." AND nb_cancion='".$nb_cancion."'") or die(mysql_error());

					if(mysqli_num_rows($result)==0)
					{
						$result = mysqli_query($cnx,"SELECT COALESCE(MAX(id_cancion),0)+1 as nextID FROM canciones WHERE id_artista=".$id_artista." AND id_album=".$id_album) or die(mysql_error());
						$id_cancion= mysqli_fetch_array($result);
						$id_cancion=$id_cancion["nextID"];
						$canciones=mysqli_query($cnx,"INSERT INTO canciones (id_Artista,id_album, id_cancion, nb_cancion,de_archivo) VALUES (".$id_artista.",".$id_album.",".$id_cancion.",'".$nb_cancion."','".$nb_archivo.".".$ext."')") or die(mysql_error());
					}


					// if ($artistas and $albums) {
					//     mysql_query("COMMIT");
					// } else {        
					//     mysql_query("ROLLBACK");
					// }
								

					$msg="Acci\u00f3n exitosa. Los archivos han sido cargados.";
					// mysql_query("COMMIT");
				}
			

		}

		$return='{"error":"'.$error.'","msg":"'.$msg.'"}';
		echo $return;
		// echo "{";
		// echo				"error: '" . $error . "',\n";
		// echo				"msg: '" . $msg . "'\n";
		// echo "}";
		// return;

	} catch (Exception $e) {
		mysql_query("ROLLBACK");
	    $msg='Excepción capturada: ';
	    $error=$e->getMessage();
	 	// echo "{";
		// echo				"error: '" . $error . "',\n";
		// echo				"msg: '" . $msg . "'\n";
		// echo "}";
		$return='{"error":"'.$error.'","msg":"'.$msg.'"}';
		echo $return;
		// return;
	}
?>