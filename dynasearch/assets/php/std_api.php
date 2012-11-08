<?php

// Everyone is always running a session. 
// TODO: IS THIS A BAD IDEA?
if(!isset($_SESSION)) {	session_start(); $_SESSION['start'] = time(); }

// set timeout period in seconds
$inactive = 600;

// check to see if $_SESSION['timeout'] is set
if(isset($_SESSION['timeout']) ) {
	$session_life = time() - $_SESSION['start'];
	if($session_life > $inactive)
        { session_destroy(); header("Location: login.php"); }
}
$_SESSION['timeout'] = time();

function redirect($page_name)
{
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	header("Location: http://$host$uri/$page_name");	
}

?>
