<?php
$data = $_POST['data_string'];
$file = $_POST['file_path'];

//echo('alert("Pay attention now!");');
//echo('alert("'.$file.'");');
//echo($file);
//echo '<script language="javascript">alert('.$file.')</script>';

$fh = fopen('../../' . $file, 'w');
//$fh = fopen($file, 'w');
fwrite($fh, $data);
fclose($fh);
?>
