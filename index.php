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
						<div id="id_repeat" class="repeat_all" title="Repetir toda la lista."></div>
						<div id="div_shuffle" class="shuffle_off" title="Encender modo aleatorio."></div>
						<div id="div_reload" class="reload" title="Actualizar lista de reproduccion"></div>

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
				<div id="hotKey" class="hotkey">				
					Accesos directos del teclado
					<ul>
						<li type="disc"><b>Espacio:</b> Play/Pause</li>
						<li type="disc" id="li_rep"><b>F2:</b> Refrescar lista</li>
						<li type="disc"><b>N:</b> Canci&oacute;n siguiente</li>
						<li type="disc"><b>B:</b> Canci&oacute;n anterior</li>
						<li type="disc"><b>R:</b> Repetir lista o canci&oacute;n</li>
						<li type="disc"><b>S:</b> Shuffle</li>
					</ul>
				</div>
				<div id="listaCanciones" class="songList">
					<table width="100%">
						<thead>
							<tr>
								<th>Canci&oacute;n</th>
								<th>Artista</th>
								<th>Reproducir<br> <input type="checkbox" id="chkAll"></th>
							</tr>
						</thead>
						<tbody id="tbody">
						</tbody>
					</table>
				</div>
			</div>
			<br>
			<div style="float:none;">
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
			</div>

			<div id="footer">
				<span style="float:left;width:250px;"><b>Author:</b> Rey David Dominguez<br></span><br>
				<span style="float:right;width:150px;"><b>Version:</a>&nbsp;0.0.3</span>
				<span style="float:none;width:280px;"><b>&nbsp;&nbsp;Email:</b> <a href="mailto:rdominguez@tecnologer.net">rdominguez@tecnologer.net</a></span>
			</div>
		</form>
		<!-- BLOQUEO DE PANTALLA -->
    <div id="divBloqueo" style="display:none;text-align:center; position:absolute; top:0px; left:0px; width:100%; height:100%; z-index:999; background-image:  url(images/ui-bg_flat_0_aaaaaa_40x100.png) 50% 50% repeat-x;background:rgba(170,170,170, 0.5)">
      <div id="subDivBloqueo" style="margin-top:200px;opacity:1;text-align:center;background: none;width:400px;margin-left:auto;margin-right:auto;">
        <font color="#0000CC" face="Verdana" size="5"><span id="lb_mensajeEspera"></span></font><br>  
        <img class="imgEspera" src="img/espera.gif" alt="Cargando, favor de esperar"  height="150px" width="150px"/>
      </div>
    </div>
	</body>
</html>
<script type="text/javascript">
	$(document).ready(function(){
		//alert("Esta es una versio Alpha, puede incendiar su computadora, uselo bajo su propio riesgo.");
		//console.log(navigator);

	});
</script>