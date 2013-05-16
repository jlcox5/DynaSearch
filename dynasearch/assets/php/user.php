<?php

   session_start();
   require_once('config.php');
   require_once('std_api.php');
   include('PasswordHash.php');

   function load_user_session( $username, $array )
   {
      //$_SESSION['logged_in'] = 'true';
      $_SESSION['username']  = $username;
      $_SESSION['userAdmin'] = $array['Admin_ID'];
      $_SESSION['UserType']  = $array['User_Type'];
      $_SESSION['userExpId'] = $array['Current_Experiment_ID'];
      $_SESSION['full_name'] = $array['Name'];

      //$_SESSION['scaleProfileId'] = $array['ScaleProfileID'];

      if( ($array['User_Type'] == 'U') || ($array['User_Type'] == 'M') )
      {

         $expId = $_SESSION['userExpId'];

         if ( $expId > 0 )
         {

            // Pull experiment data from database
            $query = "SELECT * FROM t_experiments WHERE id='$expId';";
            $result = mysql_query($query);
            if( ($row = mysql_fetch_array($result, MYSQL_BOTH)) === false)
            {
               redirect('../../logOut.php?error=exp_dne');
               exit;
            }

            // Get Custom Scaling flag
            //$_SESSION['customScaling'] = $row['CustomScaling'];

            // Get Scaling Profile
            $_SESSION['scaleProfileId'] = $row['ScaleProfileID'];

            // Get Experiment Scale
            //$_SESSION['scaleW'] = //$row['ScaleW'];
            //$_SESSION['scaleH'] = //$row['ScaleH'];

            // Pull Experiment string from experiment data
            $expstr = $row['ExperimentString'];

            // Parse experiment string and save as session variable
            $_SESSION['expData'] = parseExperimentData( $expstr );

            $query = "SELECT id FROM t_user_output WHERE User_ID='$username' AND Experiment_ID='$expId' LIMIT 1;";
            $result = mysql_query($query);
            if( mysql_fetch_array($result) !== false )
            {

               // User output has been started for this experiment
               if( $array['User_Type'] == 'M' )
               {
                  // MT Logins are One-Time Use Only
                  redirect('../../mturk.php?error=already_run');
                  exit;
               }
            
            }
            else
            {
              // User ouput must be added to database
               $query = "INSERT INTO t_user_output (User_ID, Experiment_ID) " .
                           "VALUES ('$username', '$expId');";
               $result = mysql_query($query);  

            }

         }
         else
         {

            redirect('../../logOut.php?error=exp_unassigned');
            exit;
         }

      }
      else
      {
         $_SESSION['memMax'] = $array['MemoryAllocation'] * 1024;
      }

   }


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
      $row    = mysql_fetch_array($result);
	
      if( ($row['User_ID'] == $username) && 
          ( validate_password($password, $row['PasswordHash']) ) 
        )
      {
         $_SESSION['logged_in'] = 'true';
         load_user_session($username, $row);
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


            if( $resetToken != $validToken )
            {
               redirect('../../reset.php?error=invalid_token');
            }

            // Check if token has expired
            if( time() > strtotime($tokenTimestamp) )
            {
               redirect('../../reset.php?error=expired_token');
            }

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

      // User Login
      if($_POST['user_action'] == 'login')
      {		
         if(isset($_POST['username']) && isset($_POST['password']))
         {
            $login = user_signin($_POST['username'], $_POST['password']);
            if( 'true' == $login)
            {
               if($_SESSION['UserType'] == 'A')
               {
                  redirect('../../admin.php');
                  exit;
               }
               else
               {
               //echo("user");
               
                  redirect('../../director.php');
                  exit;
               }
            }
            else if( 'false' == $login )
            {
               // Otherwise
               redirect('../../login.php?error=wrong_pass');
               exit;
//echo 'username : ' . $_POST['username'] . '<br/>' .
  //   'password : ' . $_POST['password'] . '<br/>' ;
            }
         }
      }

/*
      // Mechanical Turk Login
      if($_POST['user_action'] == 'mt_login')
      {		

         $adminId  = $_POST['adminId'];
         $expId    = $_POST['expId'];
         $amazonId = $_POST['amazonId'];

         //$query  = "SELECT * FROM t_user WHERE User_ID='$pId' AND Admin_ID='$adminId' LIMIT 1;";
         $query  = "SELECT * FROM t_mturk WHERE Admin_ID='$adminId' AND Amazon_ID='$amazonId' LIMIT 1;";
         $result = mysql_query($query);

         if( ($row = mysql_fetch_array($result)) === false )
         {
            // MT Participant must be created
            $query = "INSERT INTO t_mturk " .
                     "(Admin_ID, Amazon_ID) " .
                     "VALUES " .
                     "('$adminId', '$amazonId');";
            mysql_query($query);
            $mtId = mysql_insert_id();

         }
         else
         {
            $mtId = $row['MT_ID'];
         }

         $pId   = "mt_" . str_pad( $mtId, 12, '0', STR_PAD_LEFT );
         $pName = "MT_" . $amazonId;
         $query = "INSERT INTO t_user " .
                  "(User_ID, Admin_ID, Name, User_Type, Current_Experiment_ID) " .
                  "VALUES " .
                  "('$pId', '$adminId', '$pName', 'M', $expId) " .
                  "ON DUPLICATE KEY UPDATE " .
                  "Current_Experiment_ID=Values(Current_Experiment_ID)";
         mysql_query($query);

         $query = "SELECT * FROM t_user WHERE User_ID='$pId' LIMIT 1;";
         $result = mysql_query($query);
         $row = mysql_fetch_array($result);

         // Load & Log In MT Participant
         load_user( $pId, $row );
         $_SESSION['logged_in'] = 'true';
         redirect('../../director.php');

      }

*/
   }

?>
