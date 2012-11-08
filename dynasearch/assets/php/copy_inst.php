<?php

include("config.php");
include("std_api.php");
mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
mysql_select_db($DB_NAME) or die("Unable to select database.");

include('db_util.php');

$fileName = $_POST['fileName'];
$expName = $_POST['expName'];

$fullToCopy = "";
$fullDest = '../../hurricane_data/'.$expName.'/'.$fileName;


$fullToCopy = '../../expResources/instructPages/'.$fileName;

if (!copy($fullToCopy, $fullDest)){
   echo('Failed to copy '.$fullToCopy.' to '.$fullDest);
}

//exec('cp '.$fullToCopy.' '.$fullDest, $out);
?>