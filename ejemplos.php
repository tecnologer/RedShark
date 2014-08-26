<html>
	<body>
		<form action="doajaxfileupload.php" method="POST" enctype="multipart/form-data">
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
					<td><input type="submit" value="Subir"></td>
				</tr>
			</table>
		</form>
	</body>
</html>