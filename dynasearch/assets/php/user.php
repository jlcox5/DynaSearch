<?php

   session_start();
   require_once('config.php');
   require_once('std_api.php');
   require_once('msg_templates.php');
   include('PasswordHash.php');


   /**
    * Validates a user login to the database using a username and
    * password.
    *
    * @param string $username - username corresponding to the field 
    *    'User_ID' in the table 't_users'
    * @param string $password - user password
    *
    * @return boolean - False if either parameter is empty, the username
    *    is not found in the database, or password validation fails.
    *    Otherwise returbs true.
    */
   function user_signin($username, $password)
   {
      if( empty($username) or empty($password) )
      {
         // Reject an attempt with an empty username or password.
         return false;
      }

      // Connect to database
      global $DB_HOST;
      global $DB_NAME;
      global $DB_USER;
      global $DB_PASS;
      mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
      mysql_select_db($DB_NAME) or die("Unable to select database.");
	
      $sqlUsername = mysql_real_escape_string( $username );
      $result = mysql_query("SELECT * FROM t_user WHERE User_ID='$sqlUsername';");
      
      if ( !($row = mysql_fetch_array($result)) )
      {
         // User Does Not Exist
         return false;
      }
	
      if( ($row['User_ID'] == $username) && 
          ( validate_password($password, $row['PasswordHash']) ) 
        )
      {
         // Password validation success
         return true;
      }
      else
      {
         // Password validation failed
         echo 'here';
         return false;
      }
   }


   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


   // Logout
   if(isset($_GET['logout']))
   {
      session_destroy();
      redirect('login.php');
   }

   $username = ifSetElse( $_POST['username'] );
   $userAction = ifSetElse( $_POST['user_action'] );
   switch ( $userAction )
   {
      // Password Reset Request
      case 'resetRequest':
         if ( !(validateCaptcha() or $DEBUG) )
         {
            // Captcha Validation Failed
            redirect('reset.php?msg=captcha_error');
         }
         
         $sqlUsername = mysql_real_escape_string( $username );
         $query = "SELECT * FROM t_user WHERE User_ID='$sqlUsername';";
         $result = mysql_query( $query );
         if ( !($row = mysql_fetch_array($result)) )
         {
            // User Does Not Exist
            redirect('reset.php?msg=user_dne');
         }
         
         $email = ifSetElse( $_REQUEST['email'] );
         if ( $email != $row['Email'] )
         {
            // Email Does Not Match
            redirect('reset.php?msg=wrong_email');
         }
         
         // Set expiration and create token
         $expiration = genExpiration();
         $resetUrl   = genPasswordResetUrl( $username, $expiration );
         
         // Send Email
         $recipient = $email;
         $subject   = 'DynaSearch Password Reset';
         $message   = genMessage(
                     'email_reset_request',
                     array( 'name' => $row['Name'], 'url' => $resetUrl, 'exp' => $expiration ) 
                  );
         $sender    = 'jgestri@g.clemson.edu'; // TODO
         $headers   = 'From: ' . $sender . '\r\n';//. 'Reply-to: ' . $sender;
         if( mail($recipient, $subject, $message, $headers) )
         {
            // Email sent successfuly
            if ( $DEBUG )
            {
               echo 'Email:<br/>' . $message;
            }
            else
            {
               redirect('reset.php?msg=request_success');
            }
         }
         else
         {
            // Email failed to send
            redirect('reset.php?msg=request_fail');
         }
         break;
         
         
      // Password Reset
      case 'reset' :

         $resetToken = ifSetElse( $_POST['token'], 'test' );

         if ( !(validateCaptcha() or $DEBUG) )
         {
            // Captcha Validation Failed
            redirect('reset.php?msg=captcha_error&token=' . $resetToken);
         }
         
         $sqlUsername = mysql_real_escape_string( $username );
         $query = "SELECT * FROM t_user WHERE User_ID='$sqlUsername';";
         $result = mysql_query( $query );
         if ( !($row = mysql_fetch_array($result)) )
         {
            // User Does Not Exist
            redirect('reset.php?msg=user_dne&token=' . $resetToken);
         }
         
         // Get token and expiration
         $validToken     = $row['ResetToken'];
         $tokenTimestamp = $row['TokenExpiration'];

         if( $resetToken != $validToken )
         {
            // Invalid token
            redirect('reset.php?msg=invalid_token');
         }

         if( time() > strtotime($tokenTimestamp) )
         {
            // Token has expired
            redirect('reset.php?msg=expired_token');
         }

         // Hash password and insert into database
         $password = ifSetElse( $_POST['password'] );
         $passwordHash = create_hash( $password );
         $passwordHashStr = mysql_escape_string( $passwordHash );
         $query = "UPDATE t_user SET PasswordHash='$passwordHashStr' WHERE User_ID='$sqlUsername';";
         $result = mysql_query( $query );

         // Login
         $login = user_signin( $username, $password );
         if( !$login )
         {
            // Login failed
            if ( $DEBUG )
            {
               echo 'username : ' . $username . '<br/>' .
                    'password : ' . $password . '<br/>' ;
            }
            else
            {
               // TODO should not get here, its a problem
               redirect('login.php?error=wrong_pass');
            }
         }

         break;

         
      // User Login
      case 'login' :
         $password = ifSetElse( $_POST['password'] );
         $login    = user_signin( $username, $password );         
         if( !$login )
         {
            // Login failed
            if ( $DEBUG )
            {
               echo 'username : ' . $username . '<br/>' .
                    'password : ' . $password . '<br/>' ;
               exit;
            }
            else
            {
               redirect('login.php?error=wrong_pass&username=' . $username);
            }
         }
         break;
         
         
      // Mechanical Turk Login
      case 'mt_login' :
         $adminId  = $_POST['adminId'];
         $expId    = $_POST['expId'];
         $amazonId = $_POST['amazonId'];

         $query  = "SELECT * FROM t_mturk WHERE Admin_ID='$adminId' AND Amazon_ID='$amazonId' LIMIT 1;";
         $result = mysql_query($query);

         if ( $row = mysql_fetch_array($result) )
         {
            // MT user found
            $mtId = $row['MT_ID'];
         }
         else
         {
            // MT user must be created
            $query = "INSERT INTO t_mturk " .
                     "(Admin_ID, Amazon_ID) " .
                     "VALUES " .
                     "('$adminId', '$amazonId');";
            mysql_query($query);
            $mtId = mysql_insert_id();
         }

         $username = "mt_" . str_pad( $mtId, 12, '0', STR_PAD_LEFT );
         $pName    = "MT_" . $amazonId;
         $query    = "INSERT INTO t_user " .
                     "(User_ID, Admin_ID, Name, User_Type, Current_Experiment_ID) " .
                     "VALUES " .
                     "('$username', '$adminId', '$pName', 'M', $expId) " .
                     "ON DUPLICATE KEY UPDATE " .
                     "Current_Experiment_ID=Values(Current_Experiment_ID)";
         mysql_query($query);

         break;
         
      default :
         echo 'ERROR : Unknown User Action [' . $userAction . ']<br/>';
         exit;
         break;
   }
   
   
   // Set the universal session variables
   $query = "SELECT * FROM t_user WHERE User_ID='$username' LIMIT 1;";
   $result = mysql_query($query);
   $row = mysql_fetch_array($result);
         
   $_SESSION['logged_in']      = 'true';
   $_SESSION['username']       = $username;
   $_SESSION['userAdmin']      = $row['Admin_ID'];
   $_SESSION['email']          = $row['Email'];
   $_SESSION['UserType']       = $row['User_Type'];
   $_SESSION['full_name']      = $row['Name'];
   $_SESSION['scaleProfileId'] = $row['ScaleProfileID'];
   $_SESSION['userExpId']      = $row['Current_Experiment_ID'];
   
  

   $userType = $_SESSION['UserType'];
   switch ( $userType )
   {
      // President and Dictator-For-Life
      case 'S':
         redirect('backdoor.php');
         break;
         
      
      // Administrator
      case 'A':
         
         $_SESSION['memMax'] = $row['MemoryAllocation'] * 1024;
         redirect('admin.php');
         break;
         
         
      // Participant
      case 'U' :
      case 'M' :
         $expId = $_SESSION['userExpId'];

         if ( $expId <= 0 )
         {
            // Experiment unassigned
            redirect('logOut.php?error=exp_unassigned');
         }
         
         // Pull experiment data from database
         $query = "SELECT * FROM t_experiments WHERE id='$expId';";
         $result = mysql_query($query);
         if( !($row = mysql_fetch_array($result, MYSQL_BOTH)) )
         {
            redirect('logOut.php?error=exp_dne');
         }

         // Pull Experiment string from experiment data
         $expstr = $row['ExperimentString'];

         // Parse experiment string and save as session variable
         $_SESSION['expData'] = parseExperimentData( $expstr );
         //print_r($_SESSION['expData']);
         //exit;
         
         // Get Scale if set for the experiment
         $scaleProfileId = $row['ScaleProfileID'];
         $query  = "SELECT * FROM t_scale_profiles WHERE Profile_ID='$scaleProfileId' LIMIT 1;";
         $result = mysql_query( $query );
         $row    = mysql_fetch_array( $result );
         if( $row )
         {
            $_SESSION['scaleW'] = $row['ScaleW'];
            $_SESSION['scaleH'] = $row['ScaleH'];
         }

         $query = "SELECT id FROM t_user_output WHERE User_ID='$username' AND Experiment_ID='$expId' LIMIT 1;";
         $result = mysql_query($query);
         if( $row = mysql_fetch_array($result) )
         {
            // User output has been started for this experiment
            if( $userType == 'M' )
            {
               // MT Logins are One-Time Use Only
               redirect('mturk.php?error=already_run');
            }
            $_SESSION['resultId'] = $row['ID'];
         }
         else
         {
            // User ouput must be added to database
            $query = "INSERT INTO t_user_output (User_ID, Experiment_ID) " .
                     "VALUES ('$username', '$expId');";
            $result = mysql_query($query);  
            $_SESSION['resultId'] = mysql_insert_id();
         }
         redirect('director.php');
         break;
      
      default :
         echo 'ERROR : Unknown User Type [' . $userType . ']<br/>';
         exit;
         break;
   }

?>
