<?php
   require_once('assets/php/std_api.php');
   require_once('assets/php/db_util.php');
   require_once('assets/php/config.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


   if( isset($_SESSION['logged_in']) && ($_SESSION['logged_in'] == 'true') )
   {
      $username = $_SESSION['username'];

      // Get our current page.
      $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
      $row = mysql_fetch_array($result, MYSQL_BOTH);
      $current_position = (int)$row['current_position'];
      
      //echo 'current before update: '. $current_position .'<br/>';

      // Are we supposed to go to the next page?
      if( isset($_SESSION['advance_next']) || ($current_position == 0) ) {
         //echo 'updating<br/>';
         unset($_SESSION['advance_next']);
         $current_position = (int)$current_position + 1;
         query_db('update t_user set current_position='. $current_position .' where User_ID=\''. $username .'\'');
         redirect('director.php');
      }

      $scaleProfileId = $_SESSION['scaleProfileId'];
      //echo 'scale: '. $scaleProfileId .'<br/>';
      //echo 'scale: '. $_SESSION['scaleW'] .'<br/>';
      if( ($scaleProfileId == -1) and !(isset($_SESSION['scaleW']) && isset($_SESSION['scaleH'])) )
      {
         redirect('sizeReg.php'); 
         exit;
      }

     /* 
      if( $current_position == 0 )
      {
         redirect('sizeReg.php'); 
      }
*/
      
      //echo 'current after update: '. $current_position .'<br/>';
//      exit();
//      exit();            
      //echo 'User "' . $username  .'" is going to page '. $current_position .' and has experiment ID of "'. $row['experiment'] .'"<br/>';



      // Find out where we should go now.
      $expData = $_SESSION['expData'];

      if( $current_position > count($expData) )
      {
         //$_SESSION['logged_in'] = 'false';
         redirect('logOut.php');
      }

      $currentPage = $expData[ $current_position - 1 ];

      switch( $currentPage['type'] )
      {
         case $DS_EXP_INFO_PAGE_TAG:
            $_SESSION['page_sig'] = 'instructions.php';
            redirect('instructions.php');
            break;
            
         case $DS_EXP_CUSTOM_PAGE_TAG:
            $_SESSION['page_sig'] = 'custom_page.php';
            //$_SESSION['advNum'] = $currentPage['advNum'];
            //if( $DEBUG ) { echo $_SESSION['advNum']; }
            redirect('custom_page.php');
            break;

         case $DS_EXP_QUEST_PAGE_TAG:
            $_SESSION['page_sig'] = 'question.php';
            redirect('question.php');
            break;

         default :
            echo 'ERROR : Unknown Page Tag - [ ' . $currentPage['type'] . ']<br/>';
      }

   }
   else
   {
      redirect('login.php');
   }

?>
