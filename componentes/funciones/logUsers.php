<?php

	$ip = $_SERVER['REMOTE_ADDR'];

	echo 'Tu ip: '.$ip;
	echo '<br>';
	// echo 'Tu pc: '.gethostname();
	echo getenv('COMPUTERNAME');

?>