<?php
   /*
    * This file can be called by a Mootools or AJAX request
    * and will submit a bug report for storage in the database.
    *
    * The bug report will be linked to the user submitting it,
    * timestamped, and will include the recorded JavaScript and
    * PHP logs that were generated on the user's current page.
    */
   session_start();
   require_once('config.php');
   require_once('std_api.php');

   // Connect to database
   global $DB_HOST;
   global $DB_NAME;
   global $DB_USER;
   global $DB_PASS;
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");
   
   // Get Bug report variables
   $username    = $_SESSION['username'];
   $reportType  = ifSetElse( $_POST['reportType']     );
   $description = ifSetElse( $_POST['description']    );
   $jsErrorLog  = ifSetElse( $_POST['jsErrorLog']     );
   $phpErrorLog = ifSetElse( $_SESSION['log'],     Array() );
   
   // Encode Array into JSON
   $phpErrorLog    = json_encode( $phpErrorLog );
   
   // Prevent SQL Injection
   $sqlUserId      = mysql_real_escape_string( $username    );
   $sqlDescription = mysql_real_escape_string( $description );
   $sqlJsLog       = mysql_real_escape_string( $jsErrorLog  );
   $sqlPhpLog      = mysql_real_escape_string( $phpErrorLog );
   
   
   // Store bug report in database
   $query = "INSERT INTO bugs " .
               "( `User_ID`, `Type`, `Description`, `JsLog`, `PhpLog` ) " .
            "VALUES ( '$username', '$reportType', '$description', '$sqlJsLog', '$sqlPhpLog');";
   $result = mysql_query( $query );
   
   // Return result of query
   echo $result;
?>
