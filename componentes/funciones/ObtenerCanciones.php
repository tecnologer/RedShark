<?php
	$con=mysqli_connect("127.0.0.1","root","","redshark");
	
	$result = mysqli_query($con,"CALL upL_canciones;");
	

	$json="[";
	$i=1;
	if($result)
	{
		/*$resultado=mysqli_fetch_array($result);
		foreach ($resultado as $rowNumber) 
		{
			$cancion='{
				"nombre": "'.$rowNumber[3].'",
			    "artista": "'.$rowNumber[6].'",
			    "archivo":"'.$rowNumber[4].'"
			}';

			$json.='pista_'.$i.':'.$cancion;
			$i++;
			if($i>1 && $i<mysqli_num_rows($result))
				$json.=',';
		}*/
		while($row = mysqli_fetch_array($result)){
			$cancion='{
				"id_cancion":'.$row[2].',
				"nombre": "'.$row[3].'",
				"id_artista":'.$row[0].',
			    "artista": "'.$row[6].'",
			    "archivo":"'.$row[7].'",
			    "id_album":'.$row[1].',
			    "album":"'.$row[5].'",
			    "isCheck":true
			}';

			$json.=$cancion;
			$i++;
			if($i>1 && $i<=mysqli_num_rows($result))
				$json.=',';
		}

		
	}
	$json.="]";
	mysqli_close($con);
	echo $json;
?>