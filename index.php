<!DOCTYPE html>
<html>
	<head>
		<title>RedShark</title>
		<link rel="shortcut icon" href="img/red_shark_icon_64px.ico" />
		<script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
		<script type="text/javascript" src="js/ajaxfileupload.js"></script>
		<script type="text/javascript" src="js/funciones.js"></script>
		<link rel="stylesheet" type="text/css" href="css/style.css" media="screen" />

		<script type="text/javascript">			
			$.ajaxPrefilter( "json script js", function( options ) {
			  options.crossDomain = true;
			});
		</script>
	</head>
	<body onload ="__init__();">
		<form name="form">
			<table id="audio" class="canciones">
				<tr>
					<td>
						<audio id="tag_audio" controls></audio>

						<div id="id_back" class="back" title="Canci&oacute;n anterior."></div>
						<div id="id_play" class="play" title="Reproducion canci&oacute;n."></div>
						<div id="id_next" class="next" title="Canci&oacute;n siguiente."></div>
						<div id="id_repeat" class="repeat_off" title="Repetir toda la lista."></div>
						<div id="div_shuffle" class="shuffle_off" title="Encender modo aleatorio." onclick="shuffle();"></div>
						<div id="div_reload" title="Actualizar lista de reproduccion" onclick="getSongs();"></div>

						<div style="float:none;">
							<span style="color:#FDFD96;" id="nb_cancion"></span><br>
							<span style="color:#FFFFFF;font-style:italic;" id="nb_artista"></span><br>
							<span style="color:#60000F;font-style:italic;" id="nb_album"></span>
						</div>
					<td>
				<tr>
			</table>
			<br>
			<br>
			<div>				
				Accesos directos del teclado
				<ul>
					<li type="disc"><b>Espacio:</b> Play/Pause</li>
					<li type="disc"><b>F2:</b> Refrescar lista</li>
					<li type="disc"><b>N:</b> Canci&oacute;n siguiente</li>
					<li type="disc"><b>B:</b> Canci&oacute;n anterior</li>
				</ul>
			</div>
			<br>
			<table>
				<tr  class="td_archivo">
					<td>Archivo:</td>
					<td>
						<div id="loading" style="display:none;">
							<img src="img/loading.gif" >
						</div>
						<input type="file"
							   id="fileToUpload"
							   name="fileToUpload"
							   style="width:200px;">*
					</td>
				</tr>
				<tr class="td_cancion">
					<td>Nombre canci&oacute;n:</td>
					<td>
						<input type="text"
							   id="_nb_cancion"
							   style="width:200px;">*
					</td>
				</tr>
				<tr class="td_artista">
					<td>Artista:</td>
					<td>
						<input type="text"
							   id="_nb_artista"
							   style="width:200px;">*
					</td>
				</tr>
				<tr>
					<td>Album:</td>
					<td>
						<input type="text"
							   id="_nb_album"
							   style="width:200px;">
					</td>
				</tr>
				<tr>
					<td>
					* Campos requeridos
					</td>
				</tr>
				<tr>
					<td><input type="button" value="Subir" onclick="ajaxFileUpload();"></td>
				</tr>
			</table>

			<div id="footer">
				<span style="float:left;width:250px;"><b>Author:</b> Rey David Dominguez<br></span>
				<span style="float:right;width:280px;"><b>&nbsp;&nbsp;Email:</b> <a href="mailto:rdominguez@tecnologer.net">rdominguez@tecnologer.net</a></span>
				<br><span style="float:none;width:280px;"><b>Version:</a>&nbsp;0.0.1</span>
			</div>
		</form>
	</body>
</html>