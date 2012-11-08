<?php
//session_start();
require_once('config.php');

function query_db($query)
{
	global $DB_HOST;
	global $DB_NAME;
	global $DB_USER;
	global $DB_PASS;

	mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
	mysql_select_db($DB_NAME) or die("Unable to select database.");
	
	//$query = mysql_escape_string($query);
	$result = mysql_query($query);
	
	// Did we get a real result?
	if(is_bool($result))  // Any kind of bool (false) is not what we wanted.
	{ 
		return "False"; 
	}
	
	return $result;
}

?>