<?php

include("config.php");
include("std_api.php");
mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
mysql_select_db($DB_NAME) or die("Unable to select database.");

include('db_util.php');

$name = $_POST['name'];
$file = $_POST['file_path'];

$return = mysql_query("SELECT Value FROM sur_question WHERE Name='$name';");
$choice = mysql_fetch_array($return);
$data = $choice['Value'];

//echo('alert('.$name.');');
//echo('alert('.$file.');');
//echo('alert('.$data.');');

$fh = fopen('../../' . $file, 'w');
fwrite($fh, $data);
fclose($fh);

?>