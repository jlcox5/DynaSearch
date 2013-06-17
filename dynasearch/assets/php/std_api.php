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
//$username = $_SESSION['username'];

   // Global Variables to make standardization easier

   $DS_EXP_INFO_PAGE_TAG   = 'info';
   $DS_EXP_CUSTOM_PAGE_TAG = 'custom';
   $DS_EXP_QUEST_PAGE_TAG  = 'quest';
   $DS_EXP_BRANCH_TAG      = 'branch';


   /*
    * Log a status for debugging purposes
    *
    * @param int    $level   -
    * @param string $message - 
    * @param string $file    - 
    * @param int    $line    - 
    * @param mixed  $context - 
    */
   function statusLog( $level, $message, $file, $line, $context )
   {
      //echo "<b>Error:</b> [$level] $message<br>";
      $error = Array(
         'level'   => $level,
         'message' => $message,
         'file'    => $file,
         'line'    => $line
       //  'context' => $context,
      );
      $_SESSION['log'][] = $error;
   }
   /**
    * Set the default error handler to be our logging
    * mechanism
    */
   set_error_handler('statusLog');
   
   
   
   /*
    * Generates the URL to the root of the DynaSearch system.
    *
    * @return string - URL of DynaSearch root.
    */
   function genBaseUrl()
   {
      $host     = $_SERVER['HTTP_HOST'];
	   $fullpath = str_replace( '\\', '/', dirname(dirname(dirname(__FILE__))) );
      $basepath = $_SERVER['DOCUMENT_ROOT'];
      $uri      = str_replace( $basepath, '', $fullpath );
      $baseUrl  = 'http://' . $host . $uri;
      return $baseUrl;
   }

   
   /*
    * Creates a redirection header to a secified URI and terminates the calling
    * script.
    * 
    * @param  string $page - The URI relative to the DynaSearch system root.
    *
    * @return string - URL of DynaSearch root.
    */
   function redirect( $page )
   {
      $baseUrl = genBaseUrl();
	   //$host  = $_SERVER['HTTP_HOST'];
	   //$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	   header( "Location: $baseUrl/$page" );
      exit;
   }
   
   
   /*
    * Gets the base directory for and administrator ID
    * 
    * @param  string $adminId - Administrator ID
    *
    * @return string - Admin base directory URL
    */
   function getAdminBaseDir( $adminId )
   {
      $baseUrl = genBaseUrl();
      $adminBaseDir = $baseUrl . '/admins/' . $adminId . '/';
      return $adminBaseDir;
   }

   
   /*
    * Formats a given number of bytes to the appropriate size with an option to
    * specify the number of decimal points
    * 
    * @param  int $size - File size in bytes.
    * @param  int $dec  - [OPTIONAL] Number of decimal points. Default is 1.
    *
    * @return string - Formatted file size.
    */
   function fileSizeStr( $size, $dec = 1 )
   {
      $i     = -1; 
      $units = array('kB', 'MB', 'GB');
      do
      {
         $size = $size / 1024;
         ++$i;
      }
      while ($size >= 1024);

      return (number_format($size, $dec) . ' ' . $units[$i]);
   }

   
   /*
    * Converts a string to hexadecimal representation.
    * 
    * @param  string $string - String to convert.
    *
    * @return string - String in hexadecimal.
    */
   function strToHex( $string )
   {
      $hex='';
      for ($i=0; $i < strlen($string); $i++)
      {
         $hex .= dechex(ord($string[$i]));
      }
      return $hex;
   }

   
   /*
    * Decodes a string from its hexadecimal represetnation.
    * 
    * @param  string $string - Hexadecimal represetnation.
    *
    * @return string - Decoded string.
    */
   function hexToStr( $hex )
   {
      $string='';
      for ($i=0; $i < strlen($hex)-1; $i+=2)
      {
         $string .= chr( hexdec($hex[$i].$hex[$i+1]) );
      }
      return $string;
   }

   /*
    * Constructs a random string of a specific length from a specified set of
    * characters.
    * 
    * @param int    $length - [OPTIONAL] The length (in characters) of the
    *                         string to be generated. Default is 32.
    * @param string $chars  - The set of valid characters for the string.
    *                         Default is all alphanumeric characters.
    *
    * @return string - A randomized string
    */
   function randString (
      $length = 32,
      $chars  = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
   )
   {
      $size = strlen( $chars );
      $str  = '';

      for( $i = 0; $i < $length; $i++ )
      {
         $str .= $chars[ rand(0, $size - 1) ];
      }

      return $str;
   }


   function getRequestField( $field, $val = '' )
   {
      if ( isset($_REQUEST[$field]) ) {
         return $_REQUEST[$field];
      }
      else
      {
         return $val;
      }
   }
   
function ifSetElse( &$var, $val = '' )
{
   if ( isset($var) ) {
      return $var;
   }
   else
   {
      return $val;
   }
}


// Reset User Password
function genExpiration( $lifetime = 360 )
{
   //$expiration = date('Y/m/d H:i:s', time() + $lifetime);
   return time() + $lifetime;
}

// Reset User Password
function genPasswordResetUrl( $userId, $expiration = null )
{
   $resetToken = randString();
   if ( !isset($expiration) )
   {
      $expiration = genExpiration();
   }
   $tokenExpiration = date('Y/m/d H:i:s', $expiration);
   $query = "UPDATE t_user " .
            "SET ResetToken='$resetToken', TokenExpiration='$tokenExpiration' " .
            "WHERE User_ID='$userId'; ";
   mysql_query($query); 
   
   $baseUrl  = genBaseUrl();
   $resetUrl = $baseUrl . '/reset.php?token=' . $resetToken;
   return $resetUrl;
}

// Securimage Captcha Validation
function validateCaptcha( $captchaCode = null )
{
   if ( !isset($captchaCode) )
   {
      $captchaCode = $_POST['captcha_code'];
   }
   include_once( '../securimage/securimage.php' );
   $securimage = new Securimage();
   $validation = $securimage->check( $captchaCode );
   return $validation;
}


   /** 
    * Resolves a participant to a specific branch of a specific
    * condition.
    *
    * The database is checked to see if the participant has already
    * been designated to specific branches.
    *
    * If the participant is not already assigned branches, the current
    * distribution for the branch is evaluated and assigned. 
    *
    * @param array $branches - branches for this condition
    *
    * @return array - the array for the designated branch
    */
   function pickBranch( $page )
   {
      $condition    = $page['condition'];
      $branches     = $page['levels'];
      $weights      = Array();
      $lowestWeight = NULL;
      
      $pId       = $_SESSION['username'];
      $expId     = $_SESSION['userExpId'];
      
      foreach ( $branches as $branch )
      {
         // Get branch info from database
         $query = 'SELECT * FROM t_branches ' .
                  'WHERE Experiment_ID=' . $expId . ' AND `Condition`="' . $condition . '" AND Level="' . $branch['title'] . '";';
         //echo 'query : ' . $query . '<br/>';
         if ( $result = mysql_query( $query ) )
         {
            // Row exists in database
            $row = mysql_fetch_array($result, MYSQL_BOTH);
            $participantList = $row['Participants'];
         
            if ( empty($participantList) )
            {
               // No participants yet in this branch
               $weights[]    = 0;
               $lowestWeight = 0;
            }
            else
            {
               // Split up list string
               $branchParticipants = preg_split('@,@', $participantList, NULL, PREG_SPLIT_NO_EMPTY);// explode(',', $participantList);
            
               // Check if participant is in this branch
               if ( in_array( $pId, $branchParticipants) )
               {
                  return $branch;
               }
            
               // Set branch weight
               $weight = count( $branchParticipants );
               if ( ($lowestWeight === NULL) or ($weight < $lowestWeight) )
               {
                  $lowestWeight = $weight;
               }
               $weights[] = $weight;
            }
         }
         else
         {
            // Row does not yet exist in database - insert it
            $query = 'INSERT INTO t_branches ' .
                     '(Experiment_ID, `Condition`, Level) ' .
                     'VALUES(' . $expId . ',"' . $condition . '","' . $branch['title'] . '");';
            //echo 'query : ' . $query . '<br/>';
            $weights[]    = 0;
            $lowestWeight = 0;
            mysql_query( $query )or die(mysql_error());
         }
      }
            
      // Select a branch based on weighting
      
      //    Create array of lowest weight
      $lowIndexes   = Array();
      for( $i = 0; $i < count($weights); $i++ )
      {
         if ( $weights[$i] <= $lowestWeight )
         {
            $lowIndexes[] = $i;
         }
      }
      //print_r($lowIndexes);
      //    Randomly select one of the lowest weighted items
      $numOptions  = count( $lowIndexes );
      $index       = rand( 0, $numOptions - 1 );
      $branchIndex = $lowIndexes[ $index ];
      $selectedBranch      = $branches[ $branchIndex ];
      //echo 'picked branch ' . $branchIndex . '<br/>';
      $selectedBranchCount = $lowestWeight;
      
      // Add participant to branch list
      //if( $selectedBranchCount > 0 )
      //{
        // $pId = ',' . $pId;
      //}
      $query = 'UPDATE t_branches ' .
               'SET Participants = IFNULL( CONCAT(Participants, "' . $pId . ',"), "' . $pId . '," )' .
               'WHERE Experiment_ID=' . $expId . ' AND `Condition`="' . $condition . '" AND Level="' . $selectedBranch['title'] . '";';
      $result = mysql_query( $query );
      
      // Add participant to branch list
      $branchStr = $condition . ':' . $selectedBranch['title'] . ',';
      $query = 'UPDATE t_user_output ' .
               'SET Branch = IFNULL( CONCAT(Branch, "' . $branchStr . '"), "' . $branchStr . '" )' .
               'WHERE Experiment_ID=' . $expId . ' AND User_ID="' . $pId . '";';
      $result = mysql_query( $query );
      
      return $selectedBranch;
   }
   
   
   /** 
    * Takes page data array and flattens it to a linear array of pages
    * representing the subjects specified branches.
    *
    * @param string $pages - and array of pages
    *
    * @return array - the pages with branches resolved
    */
   function loadExpPages( $pages )
   {
      
      $expArray = Array();
      
      foreach( $pages as $page )
      {
         $type = $page['type'];
         //echo 'type : ' . $type . '<br/>';
         
         if ( $type == 'branch' )
         {
            //$branches    = $page['levels'];
            $branch      = pickBranch( $page );
            $branchPages = loadExpPages( $branch['pages'] );
            $expArray    = array_merge( $expArray, $branchPages);
         }
         else
         {
            $expArray[] = $page;
         }
      }
	  
      return $expArray;
   }
   
   /** 
    * Parses the hex encoded experiment string into an array where each 
    * index corresponds to a page, and contains an associated array of
    * that page's values
    *
    * @param string $expdata - the hex encoded experiment string
    *
    * @return array - contains each page as an associated array
    */
   function parseExperimentData( $expData )
   {
      $exp      = json_decode( $expData, true );
      $pages    = $exp['pages'];
      $expArray = loadExpPages( $pages );
	  
      return $expArray;
   }

// Get Admin's Experiments
function getAdminExps( $username )
{
   $adminExps = array();
   $query = "SELECT * FROM t_experiments WHERE Admin_ID='$username';";
   $result = mysql_query($query);
   while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $optionExpId   = $row['id'];
      $optionExpName = $row['ExperimentName'];

      $adminExps[$optionExpId] = $optionExpName;
   }
   return $adminExps;
}

// Get Admin's Participants
function getAdminParticipants( $username )
{
   $adminParticipants = array();
   $query = "SELECT * FROM t_user WHERE Admin_ID='$username' AND User_Type='U';";
   $result = mysql_query($query);
   while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $optionUserId   = $row['User_ID'];
      $optionUserName = $row['Name'];

      $adminParticipants[$optionUserId] = $optionUserName;
   }
   return $adminParticipants;
}

// Get Admin's Questionnaires
function getAdminQuests( $username )
{
   $adminQuests = array();
   $query = "SELECT * FROM sur_question WHERE Admin_ID='$username';";
   $result = mysql_query($query);
   while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $optionQuestId   = $row['id'];
      $optionQuestName = $row['Name'];

      $adminQuests[$optionQuestId] = $optionQuestName;
   }
   return $adminQuests;
}

// Get Admin's Custom Pages
function getAdminCustomPages( $username )
{
   $adminCustomPages = array();
   $query = "SELECT * FROM t_custom_pages WHERE Admin_ID='$username';";
   $result = mysql_query($query);
   while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $key   = $row['ID'];
      $value = $row['Name'];

      $adminCustomPages[$key] = $value;
   }
   return $adminCustomPages;
}


// Get Admin's Size Profiles
function getAdminSizeProfiles( $username )
{
   $adminSizeProfiles = array();
   $query = "SELECT * FROM t_scale_profiles WHERE Admin_ID='$username';";
   $result = mysql_query($query);
   if( $result )
   {
      while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
      {
         $profileName = $row['Name'];
         $profileID   = $row['Profile_ID'];
         //$profileScaleW   = $row['ScaleW'];
         //$profileScaleH   = $row['ScaleW'];

         $adminSizeProfiles[$profileID] = $profileName;
      }
   }
   return $adminSizeProfiles;
}


// TODO : the following should be worked out
/*
function getExpPageArray($index) {
   $username = $_SESSION['username'];
   // Pull user data from database
   $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);

   // Pull experiment data from database
   $result = query_db('select * from t_experiments where id=\''. $_SESSION['userExpId'] .'\'');
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

function getExpPageProperties($index)
{

   $properties = getExpPageArray($index);

   $ret = array();

   // Go through each property for the page
   for($i = 0; $i < count($properties); $i++)
   {
      // Pull out key and value from property
      $item = explode('=',$properties[$i]);

      $key   = $item[0];
      $value = ( ($key == "page") ? ($item[1]) : (hexToStr($item[1])) );

      $ret[$key] = $value;			
   }

   // If key was not found, return null
   return $ret;
}*/



?>
