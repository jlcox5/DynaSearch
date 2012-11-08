<?php

session_start();
require_once('config.php');
require_once('std_api.php');

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
	
	$result = mysql_query("SELECT * FROM t_user 
           WHERE User_ID='$username' AND UPassword='$password';");
	$test = mysql_fetch_array($result);
	
	if( $test['User_ID'] == $username && $test['UPassword'] == $password )
	{
		$_SESSION['logged_in'] = 'true';
		$_SESSION['username'] = $username;
		$_SESSION['full_name'] = $test['Name'];
		$_SESSION['scaleW'] = $test['scaleW'];
		$_SESSION['scaleH'] = $test['scaleH'];
		return 'true';
	}
	else { return 'false'; }
}

if(isset($_GET['logout'])) {
	session_destroy();
	redirect('../../login.php');
}

if(isset($_POST['user_action'])) // Are we performing a user action?
{
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
		      if($row['User_Type'] == 'A'){
               redirect('../../admin.php');
            }
            else{
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
