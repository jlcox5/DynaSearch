<?php
$data = $_POST['data_string'];
$file = $_POST['file_path'];

//echo('alert("Pay attention now!");');
//echo('alert("'.$file.'");');

$fh = fopen('../../' . $file, 'w');
fwrite($fh, $data);
fclose($fh);
?>