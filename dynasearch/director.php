<?php
require_once('assets/php/std_api.php');
require_once('assets/php/db_util.php');
require_once('assets/php/config.php');

mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
mysql_select_db($DB_NAME) or die("Unable to select database.");

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

if(isset($_SESSION['logged_in'])) {
   if($_SESSION['logged_in'] == 'true') {
      $username = $_SESSION['username'];

      // Get our current page.
      $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
      $row = mysql_fetch_array($result, MYSQL_BOTH);
      $current_position = (int)$row['current_position'];
      
      //echo 'current before update: '. $current_position .'<br/>';

      // Are we supposed to go to the next page?
      if(isset($_SESSION['advance_next'])) {
         //echo 'updating<br/>';
         unset($_SESSION['advance_next']);
         $current_position = (int)$current_position + 1;
         query_db('update t_user set current_position='. $current_position .' where User_ID=\''. $username .'\'');
         redirect('director.php');
      }
      
      if((int)$current_position == 0)
      { 
         if(isset($_POST['setSize']))
         {
            if(isset($_POST['scaleW']) && isset($_POST['scaleH']))
            {
               $_SESSION['scaleW'] = $_POST['scaleW'];
               $_SESSION['scaleH'] = $_POST['scaleH'];
               $username = $_SESSION['username'];
               $width = $_SESSION['scaleW'];
               $height = $_SESSION['scaleH'];
             
             // Crazy values?
      //      if((int)$width < 1) { $width = (string)1; }
      //      if((int)$height < 1) { $height = (string)1; }
             
               query_db("UPDATE t_user SET scaleW='$width', scaleH='$height' WHERE User_ID='$username';");
                redirect("advance.php");
               unset($_POST['scaleW']); unset($_POST['scaleH']);
            }
         }
         else
         {
            // If User desires dynamic sizing, then go to resize


            redirect('sizeReg.php'); 
         }

      }
      
      //echo 'current after update: '. $current_position .'<br/>';
//      exit();
//      exit();            
      //echo 'User "' . $username  .'" is going to page '. $current_position .' and has experiment ID of "'. $row['experiment'] .'"<br/>';


      // Find out where we should go now.
      $result = query_db('select * from t_experiments where ExperimentShortName=\''. $row['experiment'] .'\'');
      $row = mysql_fetch_array($result, MYSQL_BOTH);
      //echo '<br/>';
      
      $expstr = $row['ExperimentString'];

      $exparr = explode('$',$expstr);
      for($i=0; $i<count($exparr);$i++)
      {
         $properties = explode('&', $exparr[$i]);
         
         for($j=0;$j < count($properties);$j++)
         {
            $item = explode('=',$properties[$j]);
            //echo $item[0].' == '. $item[1].'<br/>';
            
            // Match up with the page we should be on.
            if($item[0] == 'page')
            {
               $pagenum = $i;
               //echo ((int)$pagenum)+1 .' ' . (int)$current_position .'<br/>';
               if( ((int)$pagenum)+1 == (int)$current_position)
               {
               //exit();
                  for($k=0;$k<count($properties);$k++)
                  {
                     $item2 = explode('=',$properties[$k]);
                     
                     if($item2[0] == 'type')
                     {
                        $item2[1] = hexToStr($item2[1]);//
                        //echo 'Headed to ... ';
                        if($item2[1] == 'Information Page')
                        { $_SESSION['page_sig'] = 'instructions.php'; redirect('instructions.php'); }
                        if($item2[1] == 'Survey Page')
                        { $_SESSION['page_sig'] = 'question.php'; redirect('question.php'); }
                        if($item2[1] == 'Training Screen')
                        { $_SESSION['page_sig'] = 'dynaview.php'; 
                          $item3 = explode('=',$properties[4]);
                          $_SESSION['advNum'] = hexToStr($item3[1]);
                          //echo $_SESSION['advNum'];
                          redirect('dynasearch.php'); 
                        }
                     }
                  }
               }            
            }
         }
      }
      //if((int)$current_position > count($properties)+1){
                if((int)$current_position > count($exparr)){
         //$_SESSION['logged_in'] = 'false';
         redirect('logOut.php');
      }
   } // Logged in
}
else
{
   redirect('login.php');
}

?>
