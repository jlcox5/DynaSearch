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
$username = $_SESSION['username'];


function redirect($page_name)
{
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	header("Location: http://$host$uri/$page_name");	
}

   function strToHex($string)
   {
      $hex='';
      for ($i=0; $i < strlen($string); $i++)
      {
         $hex .= dechex(ord($string[$i]));
      }
      return $hex;
   }

   function hexToStr($hex)
   {
      $string='';
      for ($i=0; $i < strlen($hex)-1; $i+=2)
      {
         $string .= chr( hexdec($hex[$i].$hex[$i+1]) );
      }
	   return $string;
   }

function getExpPageArray($index) {
   $username = $_SESSION['username'];
   // Pull user data from database
   $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);

   // Pull experiment data from database
   $result = query_db('select * from t_experiments where ExperimentShortName=\''. $row['experiment'] .'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);
   
   // Pull Experiment string from experiment data
   $expstr = $row['ExperimentString'];

   // Split experiment string up by page
   $exparr = explode('$',$expstr);
   for($i=0; $i<count($exparr);$i++)
   {
      // Split page into page's properties
      $properties = explode('&', $exparr[$i]);
        
      for($j=0;$j < count($properties);$j++)
      {
         // Split property into key and value
         $items = explode('=',$properties[$j]);

         if(($items[0] == 'page') && ($items[1] == $index))
         {
            // This is the desired page, return its string
            return $properties;          
         }
      }
   }

   // If page was not found, return empty array
   return array();
}


function getExpPageProperty($index, $key)
{

   $properties = getExpPageArray($index);

//return $properties[1];
   // Go through each property for the page
   for($i = 0; $i < count($properties); $i++)
   {
      // Pull out key and value from property
      $item = explode('=',$properties[$i]);

      if ($item[0] == $key)
      {
         // Found key, return value
         return $item[1];
      }				
   }

   // If key was not found, return null
   return 'uh oh';
}

?>
