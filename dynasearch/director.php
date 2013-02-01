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
      if(isset($_SESSION['advance_next'])) {
         //echo 'updating<br/>';
         unset($_SESSION['advance_next']);
         $current_position = (int)$current_position + 1;
         query_db('update t_user set current_position='. $current_position .' where User_ID=\''. $username .'\'');
         redirect('director.php');
      }
      
      if( $current_position == 0 )
      {
         redirect('sizeReg.php'); 
      }
      
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
         case 'Information Page':
            $_SESSION['page_sig'] = 'instructions.php';
            redirect('instructions.php');
            break;

         case 'Survey Page':
            $_SESSION['page_sig'] = 'question.php';
            redirect('question.php');
            break;

         case 'Training Screen':
            $_SESSION['page_sig'] = 'dynaview.php';
            $_SESSION['advNum'] = $currentPage['advNum'];
            if( $DEBUG ) { echo $_SESSION['advNum']; }
            redirect('dynasearch.php');
            break;
      }

   }
   else
   {
      redirect('login.php');
   }

?>
