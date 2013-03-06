<?php

   session_start();
   require_once('config.php');
   require_once('std_api.php');
   include('PasswordHash.php');

   # Return "True" on success, setting session variables "username", "full_name" and "logged_in"
   # else returns "False"
   function user_signin($username, $password)
   {
      global $DB_HOST;
      global $DB_NAME;
      global $DB_USER;
      global $DB_PASS;

      // Reject an attempt with an empty username or password.
      if( strlen($username) == 0 || strlen($password) == 0) { return "False"; }

      mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
      mysql_select_db($DB_NAME) or die("Unable to select database.");
	
      $result = mysql_query("SELECT * FROM t_user WHERE User_ID='$username';");
      $test = mysql_fetch_array($result);
	
      //if( $test['User_ID'] == $username && $test['UPassword'] == $password )
      if( $test['User_ID'] == $username && validate_password($password, $test['PasswordHash']) )
      {
         $_SESSION['logged_in'] = 'true';
         $_SESSION['username'] = $username;
         $_SESSION['userAdmin'] = $test['Admin_ID'];
         $_SESSION['userExpId'] = $test['Current_Experiment_ID'];
         $_SESSION['full_name'] = $test['Name'];
         //$_SESSION['scaleW'] = $test['scaleW'];
         //$_SESSION['scaleH'] = $test['scaleH'];

         $_SESSION['scaleProfileId'] = $test['ScaleProfileID'];


         if( $test['User_Type'] == 'U')
         {
 
            $userExpId = $_SESSION['userExpId'];
            $query = "SELECT id FROM t_user_output WHERE User_ID='$username' AND Experiment_ID='$userExpId';";
            $result = mysql_query($query);
            if(mysql_num_rows($result) > 0)
            {
               // User output has been started for this experiment
            
            }
            else
            {
               // User ouput must be added to database
               $query = "INSERT INTO t_user_output (User_ID, Experiment_ID) " .
                           "VALUES ('$username', '$userExpId');";
               $result = mysql_query($query);  

            }

            // Pull experiment data from database
            $query = "SELECT * FROM t_experiments WHERE id='$userExpId';";
            $result = mysql_query($query);
            $row = mysql_fetch_array($result, MYSQL_BOTH);

            // Get Custom Scaling flag
            $_SESSION['customScaling'] = $row['CustomScaling'];

            // Get Scaling Profile
            $_SESSION['scaleProfileId'] = $row['ScaleProfileID'];

            // Get Experiment Scale
            $_SESSION['scaleW'] = $row['ScaleW'];
            $_SESSION['scaleH'] = $row['ScaleH'];

            // Pull Experiment string from experiment data
            $expstr = $row['ExperimentString'];

            // Parse experiment string and save as session variable
            $_SESSION['expData'] = parseExperimentData( $expstr );

         }
         else
         {
            $_SESSION['memMax'] = $test['MemoryAllocation'] * 1024;
         }

         return 'true';
      }
      else
      {
         return 'false';
      }
   }


   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


   // Logout
   if(isset($_GET['logout']))
   {
      session_destroy();
      redirect('../../login.php');
   }


   if(isset($_POST['user_action'])) // Are we performing a user action?
   {

      // Password Reset
      if($_POST['user_action'] == 'reset') 
      {
         if(isset($_POST['username']) && isset($_POST['password']))
         {

            $username = $_POST['username'];

            // Check for valid token
            $query = "SELECT * FROM t_user WHERE User_ID='$username';";
            $result = mysql_query( $query );
            $row = mysql_fetch_array($result);
            $validToken     = $row['ResetToken'];
            $tokenTimestamp = $row['TokenExpiration'];
            $resetToken     = $_POST['token'];
/*
echo 'reset token : ' . $resetToken . '<br/>';
echo 'valid token : ' . $validToken . '<br/>';
echo 'timestamp : ' . $tokenTimestamp . '<br/>';
echo 'current time : ' . date("Y-m-d H:i:s", time()) . '<br/>';
echo strtotime($tokenTimestamp);
exit;*/

            if( $resetToken != $validToken )
            {
               redirect('../../reset.php?error=invalid_token');
            }

            // Check if token has expired
            if( time() > strtotime($tokenTimestamp) )
            {
               redirect('../../reset.php?error=expired_token');
            }
/*
echo 'reset token : ' . $resetToken . '<br/>';
echo 'valid token : ' . $validToken . '<br/>';
echo 'timestamp : ' . $tokenTimestamp . '<br/>';
exit;*/

            $password = $_POST['password'];
            $passwordHash = create_hash( $password );

            // Securimage Captcha Validation
            include_once '../securimage/securimage.php';
            $securimage = new Securimage();
            if ($securimage->check($_POST['captcha_code']) == false) {
              // the code was incorrect
              // you should handle the error so that the form processor doesn't continue
 
              // or you can use the following code if there is no validation or you do not know how
              echo "The security code entered was incorrect.<br /><br />";
              echo "Please go <a href='javascript:history.go(-1)'>back</a> and try again.";
              exit;
            }

            $passwordHashStr = mysql_escape_string( $passwordHash );
            $query = "UPDATE t_user SET PasswordHash='$passwordHashStr' WHERE User_ID='$username';";
            $result = mysql_query( $query );

            // Continue to login
            $_POST['user_action'] = 'login';
           
         }
      }


      if($_POST['user_action'] == 'login') // Are we trying to login?
      {		
         if(isset($_POST['username']) && isset($_POST['password']))
         {
            $login = user_signin($_POST['username'], $_POST['password']);
            if( 'true' == $login)
            {
               $result = mysql_query('select User_Type from t_user where User_ID=\''.$_POST['username'].'\'');
               $row = mysql_fetch_array($result);
               $_SESSION['User_Type'] = $row['User_Type'];
               if($row['User_Type'] == 'A')
               {
                  redirect('../../admin.php');
               }
               else
               {
               //echo("user");
               
                  redirect('../../director.php');
               }
            }
            elseif( 'false' == $login )
            {
               // Otherwise
               redirect('../../login.php?error=wrong_pass');
            }
         }
      }



   }

?>
