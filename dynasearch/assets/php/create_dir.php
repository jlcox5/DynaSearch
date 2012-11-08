<?php

include("config.php");
include("std_api.php");
mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
mysql_select_db($DB_NAME) or die("Unable to select database.");

include('db_util.php');

$name = $_POST['name'];

mkdir('../../hurricane_data/'.$name, 0755);

?>