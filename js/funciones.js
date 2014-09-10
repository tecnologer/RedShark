// Cantidad de canciones
var $totalSongs=20;

var $fotosPorSesion=30;
var $isMark=false;
var $photos=new Array();
var $audios=[];
var $playList=[];
var $actualSong=-1;
var $actualSongShuffle=0;
var $repeat=0;
//arreglo de canciones que han sido reproducidas random
var $shuffleSong=[];

var $timer="";

/*Author: REY DAVID DOMINGUEZ
	Constructor
*/
function __init__()
{
	//asigna acciones a los botones de interfaz
	$( "#id_play" ).bind( "click", function() {playSong();});
	$( "#id_back" ).bind( "click", function() {backSong();});
	$( "#id_next" ).bind( "click", function() {nextSong();});
	$( "#div_shuffle" ).bind( "click", function() {shuffle();});
	$( "#id_repeat" ).bind( "click", function() {repeat();});
	$('.reload').bind( "click", function() {getSongs();});
	$( "#chkAll" ).bind( "click", function() {selectAll();});
	
	//obtenemos la lista de canciones
	getSongs();

	
	//verificamos si la cancion ha terminado
	$('#tag_audio').bind('ended', function(){

		//si no se repetira la lista
    	if($repeat==0)
    	{
    		//si el shuffle esta encendido y si el total de canciones reproducidas en random es menor al total de canciones, 
    		//o si la cancion actual no es la ultima, avanza a la siguiente cancion
    		if( ($("#div_shuffle").attr("class")=='shuffle_on' && $shuffleSong.length<$audios.length) ||
    			(($actualSong+1)<$audios.length))
    			nextSong();
    		//si no, se pausa la reproduccion y se limpian las etiquetas
    		else
    		{
    			$( "#id_play" ).attr("class","play" );
    			$('#nb_cancion').html("");
				$('#nb_artista').html("");
				$('#nb_album').html("");
    		}
    	}
    	//si se repetira la lista
    	else if($repeat==1)
    		nextSong();
    	//si se repetira la cancion actual
    	else if($repeat==2)
    		playSong(true);
	});

		//hotkeys
		$(document).bind('keyup', function(e) {

		   //accesos directos que solo se permiten cuando ningun elemento tiene el focus
		   if (!$("input").is(":focus")) 
		    {
			  	//console.log(e.keyCode);
			  	// console.log(e.which);

			  	switch(e.keyCode)
			  	{
			  		case 32: //tecla espacio 
			  		case 179://tecla play (Teclado Vorago KB500)
			  			//play-pausa
			  			playSong();
			  		break;
			  		case 66://tecla B (back)
			  			backSong();
			  		break;
			  		case 78: //tecla N (next)
			  			nextSong();
			  		break;
			  		case 82://tecla R (repetir off-lista-cancion)
			  			repeat();
			  		break;
			  		case 83://tecla S (encender-apagar shuffle)
			  			shuffle();
			  		break;
			  		default:
			  			console.log(e.keyCode);
			  		break;
			  	}
			}

			//accesos directos que pueden funcionar en cualquier parte de la pagina, tenga o no tenga algun elemento el focus
			switch(e.keyCode)
		  	{
		  		case 113://tecla F2 (refrescar lista)
		  			/*solo se refrescara la lista cuando el div reload tenga la clase "reload",
		  			  esto para evitar demasiados llamados al server*/
		  			if($('#div_reload').attr("class")=='reload')
		  				getSongs();
		  		break;
		  		default:
		  			console.log(e.keyCode);
		  		break;
		  	}
		});


	var $totalChecked=$('input:checkbox[id^="chk_"]:checked').size();
	var $totalCheckBox=$('input:checkbox[id^="chk_"]').size();
	
	if($totalChecked==$totalCheckBox)
		$('#chkAll').prop('checked', true);

}	

/*Author: REY DAVID DOMINGUEZ
	Muestra la lista de reproduccion
*/
function getSongs()
{
	waitScreen();

	$playList=$audios;

	$('#div_reload').attr("class",'reloadOff');
	$('#li_rep').attr("class",'noRepetir');

	$.ajax({
        data: {},
        url:   'componentes/funciones/ObtenerCanciones.php',
        type:  'post',
        success:  function (data) {                
            $audios=$.parseJSON(data);
            
            //si la lista de reproduccion actual tiene diferente numero de canciones
            //refrescamos la lista en el DOM
            if($playList.length!=$audios.length)
            {
            	persistenciaLista();
            	showList();
            }

            waitScreen();

            var $timer=setInterval(function(){
            	clearInterval($timer);
            	$('#div_reload').attr("class",'reload');
            	$('#li_rep').attr("class",'');
            },5000);
        }
	});
}

/*Author: REY DAVID DOMINGUEZ
	Reproduce la cancion actual
*/
function playSong(_repeat)
{
	var $tid;
	if(_repeat)
	{
		if($('#tag_audio').attr("src")=="" || !$('#tag_audio').attr("src"))
		{	
			if($actualSong<0)
				getNumberSong(2);

			$('#tag_audio').attr("src","audio_php/"+$audios[$actualSong].archivo);
			$('#tag_audio').load();
		}

		var anterior=$actualSong;
		markSongOfList(anterior);

	 	$('#tag_audio')[0].play();
	 	showDataSong();
	}
	else if($("#id_play").attr("class")=='play')
	{
		console.log("play");

		if($('#tag_audio').attr("src")=="" || !$('#tag_audio').attr("src"))
		{
			if($actualSong<0)
				getNumberSong(2);

			$('#tag_audio').attr("src","audio_php/"+$audios[$actualSong].archivo);
			$('#tag_audio').load();
		}

		if(!isChecked($actualSong))
		{
			var anterior=$actualSong;
			markSongOfList(anterior);
			getNumberSong(2);
		}

	 	$('#tag_audio')[0].play();
	 	showDataSong();
	 	$( "#id_play" ).removeClass( "play" );
	 	$( "#id_play" ).addClass( "pause" );
		$( "#id_play" ).attr( "title","Pausar canci\u00F3n." );

		var anterior=$actualSong;
		markSongOfList(anterior);
	 	// $tid = setInterval(isPaused(), 2000);
	}
	else
	{
		console.log("pause");
		$('#tag_audio')[0].pause();
		$( "#id_play" ).removeClass( "pause" );
		$( "#id_play" ).addClass( "play" );
		$( "#id_play" ).attr( "title","Reproducir canci\u00F3n." );
		// clearInterval($tid);
	}
}

/*Author: REY DAVID DOMINGUEZ
	Verifica si la reproduccion se pauso, y si es asi, avanza a la siguiente cancion.
	Esto se utiliza cuando la cancion termina, el estado de la etiqueta Audio es paused
*/
function isPaused()
{
	if($('#tag_audio')[0].paused())
		nextSong();
}

/*Author: REY DAVID DOMINGUEZ
	Avanza a la siguiente cancion
*/
function nextSong()
{
	var anterior=$actualSong;
	getNumberSong(2);
	markSongOfList(anterior);	

	$('#tag_audio').attr("src","audio_php/"+$audios[$actualSong].archivo);
	$('#tag_audio').load();
	$('#tag_audio')[0].play();
	showDataSong();
	$( "#id_play" ).removeClass( "play" );
	$( "#id_play" ).addClass( "pause" );
}

/*Author: REY DAVID DOMINGUEZ
	Desplaza a la cancion anterior
*/
function backSong()
{
	var anterior=$actualSong;
	getNumberSong(1);
	markSongOfList(anterior);

	$('#tag_audio').attr("src","audio_php/"+$audios[$actualSong].archivo);
	$('#tag_audio').load();
	$('#tag_audio')[0].play();
	showDataSong();

	$( "#id_play" ).removeClass( "play" );
	$( "#id_play" ).addClass( "pause" );
}

/*Author: REY DAVID DOMINGUEZ
	Muestra la informacion de la cancion actual
*/
function showDataSong()
{
	$('#nb_cancion').html($audios[$actualSong].nombre);
	$('#nb_artista').html($audios[$actualSong].artista);
	
	// document.title=$audios[$actualSong].nombre;
	nSongTab();

	if($audios[$actualSong].album!='Default')
		$('#nb_album').html($audios[$actualSong].album);
	else
		$('#nb_album').html("");
}
/*Author: REY DAVID DOMINGUEZ
	Muestra la informacion de la cancion actual en el tab del navegador
*/
function nSongTab()
{
	var i=0;
	var $inter=setInterval(function(){
		var $nb_song="  "+$audios[$actualSong].nombre+' - '+$audios[$actualSong].artista;
		document.title = $nb_song.substring(i,$nb_song.length);
		
		if (i<=$nb_song.length)
			i++;
		else
		{
			clearInterval($inter);
			document.title ='RedShark';
			var $inter2=setInterval(function(){
				clearInterval($inter2);
				nSongTab();
			},1500);
			
		}

	},120);
}
/*Author: REY DAVID DOMINGUEZ
	Sube la cancion a la db
*/
function ajaxFileUpload()
{
	var $nb_cancion=$('#_nb_cancion').val();
	var $nb_artista=$('#_nb_artista').val();
	var $nb_album=$('#_nb_album').val();
	var $file=$('#fileToUpload').val();
	var $timer;

	if($file=='')
	{
		$('#fileToUpload').css("border-color","#FA0000");
		$('.td_archivo').css("color","#FF0000");
		alert("El archivo es requerido.");
		$timer=setTimeout(function() {
			$('#fileToUpload').css("border-color","");
			$('.td_archivo').css("color","");
			clearTimeout($timer);
      }, 2000);
		return;
	}

	if($nb_cancion=='')
	{
		$('#_nb_cancion').css("border-color","#FF0000");
		$('.td_cancion').css("color","#FF0000");
		alert("El nombre de la cancion es requerido.");
		$timer=setTimeout(function() {
			$('#_nb_cancion').css("border-color","");
			$('.td_cancion').css("color","");
			clearTimeout($timer);
      }, 2000);
		return;
	}

	if($nb_artista=='')
	{
		$('#_nb_artista').css("border-color","#FA0000");
		$('.td_archivo').css("color","#FF0000");
		alert("El nombre del artista es requerido.");
		$timer=setTimeout(function() {
			$('#_nb_artista').css("border-color","");
			$('.td_archivo').css("color","");
			clearTimeout($timer);
      }, 2000);
		return;
	}

	var $url= 'doajaxfileupload.php?nb_cancion='+$nb_cancion+'&nb_artista='+$nb_artista+'&nb_album='+$nb_album+'&campo=fileToUpload';
	console.log($url);

	$("#loading")
	.ajaxStart(function(){
		console.log("Inicia ajax");
		$(this).show();
	})
	.ajaxComplete(function(){
		$(this).hide();
	});

	$.ajaxFileUpload
	(
		{
			url: $url,
			secureuri:false,
			fileElementId:'fileToUpload',
			dataType: 'json',
			success:function (data)
			{
				data=$.parseJSON(data);
				console.log("terminado");
				if(typeof(data.error) != 'undefined')
				{
					if(data.error != '')
					{
						alert(data.error);
					}else
					{
						alert(data.msg);
						getSongs();
					}
				}
			},
			error: function (data, status, e)
			{
				alert(e);
			}
		}
	);

	
	$timer=setTimeout(function() {
		getSongs();
		$('#_nb_cancion').val("");
		$('#_nb_artista').val("");
		$('#_nb_album').val("");
		$('#fileToUpload').val("");
		clearTimeout($timer);
		alert("Archivo cargado");
      }, 2000);
	return false;

}

/*Author: REY DAVID DOMINGUEZ
	CAMBIA DE CLASE AL DIV SHUFFLE PARA MOSTRAR ENCENDIDO O APAGADA LA OPCION,
	ACTULIZA LA BANDERA DE SHUFFLE
*/
function shuffle()
{	console.log($("#div_shuffle").attr("class"));
	if($("#div_shuffle").attr("class")=='shuffle_off')
	{
		console.log("shuffle encendido");

	 	$( "#div_shuffle" ).attr("class","shuffle_on" );
		$( "#div_shuffle" ).attr( "title","Apagar modo aleatorio." );

	 	// $tid = setInterval(isPaused(), 2000);
	}
	else
	{
		console.log("shuffle apagado");

	 	$( "#div_shuffle" ).attr("class","shuffle_off" );
		$( "#div_shuffle" ).attr( "title","Encender modo aleatorio." );
	}
}

/*Author: REY DAVID DOMINGUEZ
	CAMBIA DE CLASE AL DIV REPEAT, PARA INDICAR SI LA LISTA O LA CANCION SE REPETIRA
*/
function repeat()
{	
	//si esta apagado
	if($("#id_repeat").attr("class")=='repeat_off')
	{	
		//cambiamos para mostrar que se reproducira la lista de nuevo
	 	$( "#id_repeat" ).attr("class","repeat_all" );
		$( "#id_repeat" ).attr( "title","Repetir toda la lista." );
		$repeat=1;
	}
	//si tiene la clase repetir todo
	else if($("#id_repeat").attr("class")=='repeat_all')
	{
		//cambiamos para mostrar que se repetira la cancion actual
	 	$( "#id_repeat" ).attr("class","repeat_one" );
		$( "#id_repeat" ).attr( "title","Repetir cancion actual." );
		$repeat=2;
	}
	//si ninguna de las anteriores
	else
	{
		//apagamos la repeticion de canciones y/o lista
	 	$( "#id_repeat" ).attr("class","repeat_off" );
		$( "#id_repeat" ).attr( "title","No repetir." );
		$repeat=0;
	}
}

/*Author: REY DAVID DOMINGUEZ
  Date: 26/08/2014
	Calcula la cancion siguiente, si tiene shuffle encendido genera un random
*/
function getNumberSong(opcion)
{
	if($("#div_shuffle").attr("class")=='shuffle_on')
	{
		//si ya se reproducieron todas las canciones en random, reproduccimos la primera cancion de la lista random
		if($shuffleSong.length==$audios.length)
		{	
			//si el numero de la cancion de reproduccion en random es la ultima de la reproduccion de la lista random
			//la reiniciamos a 0
			if($actualSongShuffle==$shuffleSong.length)
				$actualSongShuffle=0;

			//asignamos la primera cancion de la lista random a la reproduccion actual
			$actualSong=$shuffleSong[$actualSongShuffle];
			//aumentamamos a la siguiente cancion random
			$actualSongShuffle++;

			return;
		}

		var MIN=0;
		var MAX=$audios.length-1;

		var RAN=Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;

		//si el numero random calculado ya existe en el array
		while($shuffleSong.indexOf(RAN)!=-1)
		{
			RAN=Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
		}

		$shuffleSong.push(RAN);
		$actualSong=RAN;
	}
	else
	{
		//back - cancion anterior
		if(opcion==1)
		{
			if($actualSong==0)
				$actualSong=$audios.length-1;
			else
				$actualSong--;
		}
		//next - cancion siguiente
		else if(opcion==2)
		{
			if($actualSong==$audios.length-1)
				$actualSong=0;
			else
				$actualSong++;
		}

		//limpiamos la lista de canciones que fueron reproducidas en random
		$shuffleSong=[];
	}

	if(!isChecked($actualSong))
		getNumberSong(opcion);
}

/*Author: REY DAVID DOMINGUEZ
  Date: 27/08/2014
	Muestra la lista de reproduccion
*/
function showList()
{
	// $('#listaCanciones').html("");
	$('#tbody').html("");
	var $table='<table width="100%">';
	for(var $i=0;$i<$audios.length;$i++)
	{
		var clase="divCancion";
		if(($i%2)==0)
			clase="divCancionAlt";
		var $check='<input type="checkbox" id="chk_'+$i+'" name="chk_'+$i+'" checked>';
		var $hdn='<input type="hidden" id="idArtista_'+$i+'" value="'+$audios[$i].id_artista+'">';
			$hdn+='<input type="hidden" id="idAlbum_'+$i+'" value="'+$audios[$i].id_album+'">';
			$hdn+='<input type="hidden" id="idCancion_'+$i+'" value="'+$audios[$i].id_cancion+'">';

		// var $divCancion='<div id="cancion_'+$i+'" draggable="true" class="'+clase+'">'+$audios[$i].nombre+' - '+$audios[$i].artista+$check+'</div>';
		var $tr='<tr id="cancion_'+$i+'" draggable="true" class="'+clase+'">'
					+'<td>'+$hdn+$audios[$i].nombre+'</td>'
					+'<td>'+$audios[$i].artista+'</td>'
					+'<td align="center">'+$check+'</td>'
				+'</tr>';
		// $('#listaCanciones').append($divCancion);
		$('#tbody').append($tr);

		// $('#cancion_'+$i).addEventListener('dragstart', handleDragStart, false);
	}

	markSongOfList();

	$('tr[id^="cancion_"]').dblclick(function() {


		var anterior=$actualSong;
		$actualSong=parseInt((this.id).split("_")[1]);		
		markSongOfList(anterior);


		$('#chk_'+$actualSong).prop('checked',true);

		$('#tag_audio').attr("src","audio_php/"+$audios[$actualSong].archivo);
		$('#tag_audio').load();
		$('#tag_audio')[0].play();
		showDataSong();
		$( "#id_play" ).attr( "class","pause" );
	});
	$('input:checkbox[id^="chk_"]').bind('click',function(){unCheckAll(this);});
}

/*Author: REY DAVID DOMINGUEZ
  Date: 27/08/2014
	En la lista de reproduccion, marca la cancion que se esta reproduciendo
*/
function markSongOfList(anterior)
{
	if(!isNaN(anterior))
	{
		//clase para cancion normal
		var clase="divCancion";
		var cFondo='';

		//si es un numero par, cambiamos de clase para que se marque de diferente color
		if((anterior%2)==0)
			clase='divCancionAlt';

		//si la cancion actual es par, le ponemos fondo diferente junto con el color
		if(($actualSong%2)==0)
			cFondo='#E1EEf4';

		//quitamos el color diferente de cancion actual a la cancion que se estaba reproduciendo
		$('#cancion_'+anterior).attr('class',clase);

		//marcamos con color diferente la cancion que se reproducira actualmente
		$('#cancion_'+$actualSong).attr("class","divCancionPlay");
		$('#cancion_'+$actualSong).css("background",cFondo);
		$('#cancion_'+$actualSong).focus();

		// console.log($('#cancion_'+$actualSong).position().top);
		$('#listaCanciones').stop().animate({ scrollTop: $('#cancion_'+$actualSong).position().top }, 800);
	}
}

function handleDragStart(){
	console.log("Viene, viene");
}
/*Author: REY DAVID DOMINGUEZ
  Date: 10/09/2014
	Muestra un pantalla de espera
*/
function waitScreen(){
	$('#divBloqueo').toggle();
}
/*Author: REY DAVID DOMINGUEZ
  Date: 10/09/2014
	verifica si la cancion (num) esta seleccionada
*/
function isChecked(num){
	return $('#chk_'+num).is(':checked');
}
/*Author: REY DAVID DOMINGUEZ
  Date: 10/09/2014
	Al precionar el checkbox del header, selecciona todos los checkbox de la columna
*/
function selectAll()
{
	if($('#chkAll').is(':checked'))
		$('input:checkbox[id^="chk_"]').prop('checked',true);
	else
		$('input:checkbox[id^="chk_"]').prop('checked',false);
}
/*Author: REY DAVID DOMINGUEZ
  Date: 10/09/2014
  Cuando se da click en un check indenpendiente (los de las canciones), 
  verifica si es necesario seleccionar el check general
*/
function unCheckAll(checkbox)
{
	if(!$(checkbox).is(':checked'))
		$( "#chkAll" ).prop('checked',false);
	else
	{
		var $totalChecked=$('input:checkbox[id^="chk_"]:checked').size();
		var $totalCheckBox=$('input:checkbox[id^="chk_"]').size();
		
		if($totalChecked==$totalCheckBox)
			$('#chkAll').prop('checked', true);
		else
			$('#chkAll').prop('checked', false);
	}
}
/*Author: REY DAVID DOMINGUEZ
  Date: 10/09/2014
  Busca cambios en la lista de reproduccion, conservando el estado de las canciones seleccionadas
  al actualizar la lista
*/
function persistenciaLista()
{
	for(var $i=0;$i<$audios.length;$i++)
	{
		var $posPL=indexOfCanciones($playList,$audios[$i].id_artista, $audios[$i].id_album, $audios[$i].id_album);
		if($posPL!=-1)
			$audios[$i].isCheck=$playList[$posPL].isCheck;

	}
}
/*Author: REY DAVID DOMINGUEZ
  Date: 10/09/2014
  Busca el indice de la cancion, filtrando por:
  	artista(idArt),  
  	album (idAlb),
  	cancion (idCan).
  Si no lo encuentra regresa un -1.
*/
function indexOfCanciones(canciones,idArt, idAlb, idCan)
{
	for(var $i=0;$i<canciones.length;$i++)
	{
		if(canciones[$i].id_artista==idArt && canciones[$i].id_album==idAlb && canciones[$i].id_cancion==idCan)
			return $i;
	}

	return -1;
}