<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');
   include('assets/php/PasswordHash.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Participants";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css", "userAdmin.css", "mBoxCore.css", "mBoxModal.css", "mBoxModal.css", "mBoxNotice.css");
   $template_script_array = array("ajax-core.js", "mBox.All.min.js", "userAdmin.js");
   include('assets/php/standard.php');   

   if( isset($_POST['op']) )
   {
      $op = $_POST['op'];
//echo "op set<br/>";
   }
   else
   {
//echo "op not set<br/>";
      $op = '';
   }

   if( isset($_POST['pId']) )
   {
      $pId = $_POST['pId'];

   }
   else
   {
      $pId = null;
   }

   $emailStr = "";

//echo "op : " . $op . "<br/>";

   // Reset Progress
   if( $op == 'resetProgress' )
   {
      $query = "UPDATE t_user " .
               "SET current_position=0 " .
               "WHERE User_ID='$pId';" ;
      mysql_query($query);
   }

   // Reset Password
   if( $op == 'resetPassword' )
   {
      $resetToken = randString();
      $tokenExpiration = date('Y/m/d H:i:s', time() + (60 * 60));
      $uri = 'http://'. $_SERVER['HTTP_HOST'] ;
      $resetUrl = $uri . '/reset.php?token=' . $resetToken;
//echo $tokenUrl;
//ocalhost/dynasearch/dynasearch
      $query = "UPDATE t_user " .
               "SET ResetToken='$resetToken', TokenExpiration='$tokenExpiration' " .
               "WHERE User_ID='$pId'; ";
      mysql_query($query);

      $emailStr .= "Your DynaSearch password has been reset.\n" .
                   "\nLogin ID : $pId\n\n" . 
                   "Please follow this link to set up a new password:\n" .
                   "$resetUrl\n" .
                   "\n" .
                   "This link will expire on $tokenExpiration.\n" .
                   "";
   }

   // Save
   if( isset($_POST['save']) )
   {

      if( isset($_POST['participantName']) )
      {
         $pName = $_POST['participantName'];
      }


         $pEmail = $_POST['pEmail'];

      if( isset($_POST['participantExp']) )
      {
         $pCurrExp = $_POST['participantExp'];
      }

      $query  = "SELECT * FROM t_user WHERE User_ID='$pId' LIMIT 1;";
      $result = mysql_query($query);
      if( mysql_fetch_array($result) !== false )
      {
         // Participant Exists - Update
         //$resetToken = "testtoken";
         //$tokenExpiration = date('Y/m/d H:i:s', time() + (60 * 60));
         //$uri = 'http://'. $_SERVER['HTTP_HOST'] ;
         //$tokenUrl = $uri . '/reset.php?token=' . $resetToken;
//echo $tokenUrl;
//ocalhost/dynasearch/dynasearch
         $query = "UPDATE t_user " .
                  "SET Name='$pName', Email='$pEmail', Current_Experiment_ID=$pCurrExp, " .
                  "WHERE User_ID='$pId'; ";
      }
      else
      {


         $resetToken = randString();
         $tokenExpiration = date('m/d/Y h:i:s a', time() + (60 * 60));
         $resetUrl = '/reset.php?token=' . $resetToken;

         // New Participant - Add
         $query = "INSERT INTO t_user " .
                  "(User_ID, Admin_ID, Name, Email, User_Type, Current_Experiment_ID, ResetToken, TokenExpiration) " .
                  "VALUES " .
                  "('$pId', '$username', '$pName', '$pEmail', 'U', $pCurrExp, '$resetToken', '$tokenExpiration');";

         $emailStr .= "An account has been created for you!\n" .
                      "\nLogin ID : $pId\n\n" . 
                      "Please follow this link to set up a password:\n" .
                      "$resetUrl\n" .
                      "\n" .
                      "";
      }

      mysql_query($query);
     // $_POST['load'] = '';

   }

   if( $emailStr )
   {
      $emailStr = "Hello $pName!\n\n" . $emailStr;
      echo '<script type="text/javascript">' .
           '   window.addEvent("domready",' .
           '                    function(){ showEmailPopup(); }' .
           '                  );' .
           '</script>';
   }


?>

<body id="body">

   <!-- Email Popup Box -->
   <div id="emailBox" style="display:none;">

      <table class="emailField">
         <td><label class="emailFieldCell">From</label></td>
         <td><input id="emailSender" class="email-text" type="text" value="jgestri@g.clemson.edu"></td>
      </table>

      <table class="emailField">
         <td><label class="emailFieldCell">To</label></td>
         <td><input id="emailRecipient" class="email-text" type="text" value="jgestri@g.clemson.edu"></td>
      </table>

      <table class="emailField">
         <td><label class="emailFieldCell">Subject</label></td>
         <td><input id="emailSubject" class="email-text" type="text" value=""></td>
      </table>

      <div class="messageArea">
         <textarea id="emailMessage" class="email-text"><?php echo $emailStr; ?></textarea>
      </div>
   </div>


   <!-- Experiment Select Popup Box -->
   <div id="expSelectBox" style="display:none;">

      <label>My Experiments:</label>
   <?php
      // Experiment Select
      echo '<select id="pExps" name="participantExp" required="required">';

      // Experiment Unassigned Option
      echo '<option value="-1" ' . '' . ' >' .
              'Unassigned' .
           '</option>';

      $query  = "SELECT * FROM t_experiments WHERE Admin_ID='$username';";
      $result = mysql_query($query);
      while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
      {
         $optionExpId   = $row["id"];
         $optionExpName = $row["ExperimentName"];

         if ($optionExpId == $pExpId)
         {
            $selected = 'selected="selected"';
            $pExpName = $optionExpName;
         }
         else
         {
            $selected = '';
         }

         echo '<option value="' . $optionExpId . '" ' . $selected . ' >' .
                 $optionExpName .
              '</option>';
      }
      echo '</select>';
   ?>

      <div class="warning">
         If you save this change, the participants progress will be reset.
      </div>

   </div>


   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   


         <h1>Manage Participants</h1><br/>
         <br/>

         <!-- User Select -->
         <form action="userAdmin.php" method="post">
            <select name="pId">
   <?php 
      // Retrieve Admin's users
      $query  = "SELECT * FROM t_user WHERE Admin_ID='$username';";
      $result = mysql_query($query);
      while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
      {
         $optionUserId   = $row['User_ID'];
         $optionUserName = $row['Name'];

         if ($optionUserId == $pId)
         {
            $selected = 'selected="selected"';
         }
         else
         {
            $selected = '';
         }

         echo '<option value="' . $optionUserId . '" ' . $selected . ' >' .
                 $optionUserName . ' (' . $optionUserId . ')' .
              '</option>';
      }

   ?>
            </select>

            <input type="submit" name="load" value="Load"/>
            <input type="submit" name="add" value="Add"/>
         </form>
         <br/>
         <br/>


         <!-- User Data -->
   <?php
      if( is_string($pId) )
      {

     if( isset($_POST["add"]) )
      {

         // Add participant
         $pId = "";

         $participantName     = "";
         $participantPassword = "";
         $pEmail = "";
         $pExpId = "";
         $pProgress = 0;
      }
      else
      {

         $query  = "SELECT * FROM t_user WHERE User_ID='$pId';";
         $result = mysql_query($query);
         $row    = mysql_fetch_array($result, MYSQL_BOTH);

         $participantName     = $row["Name"];
         $participantPassword = $row["UPassword"];
         $pEmail = $row["Email"];
         $pExpId = $row["Current_Experiment_ID"];
         $pProgress = $row["current_position"];
      }

         echo '<form action="userAdmin.php" method="post">';


         // Name
         echo '<h2>Name : ' . 
                 '<input type="text" name="participantName" value="' .$participantName . '" required="required" />' .
              '</h2>' ;
         echo '<br/>' ;


         // Login
         echo '<h2>Login : ' . 
                 '<input id="pId" type="text" name="pId" value="' .$pId . '" required="required" onchange="checkAvailability();" ';
         if( isset($_POST["add"]) )
         {
            echo '/>';
         }
         else
         {
            echo 'hidden="hidden" />' .
                 '<span>' . $pId . '</span>';
         }

         echo '<span id="availabilityTag"></span>' .
              '</h2>' ;
         echo '<br/>' ;


         // Email
         echo '<h2>Email : ' . 
                 '<input type="text" name="pEmail" value="' . $pEmail . '" />' .
              '</h2>' ;
         echo '<br/>' ;


         // Change Password
         echo '<h2>Password : ';
         if( isset($_POST["add"]) )
         {
            echo '<input type="password" name="pPassword" required="required" />';
         }
         else
         {
            echo '<button data-confirm-action="resetPassword(\'' . $pId . '\');" ' .
                         'data-confirm="Are you sure you wish to reset the user\'s password?<br/>' . 
                                       '(This will generate a reset link that will expire in 1 hour)">' .
                    'Reset' .
                 '</button>';
         }

         echo '</h2>' ;
         echo '<br/>' ;

         // Current Experiment
         echo '<h2>Current Experiment : ';

         // Experiment Select
         echo '<select id="pExps" name="participantExp"  required="required"' . 
              ( (isset($_POST["add"])) ? ('') : ('hidden="hidden"') ) .
              ' >';

         // Experiment Unassigned Option
         echo '<option value="-1" ' . '' . ' >' .
                 'Unassigned' .
              '</option>';

         $query  = "SELECT * FROM t_experiments WHERE Admin_ID='$username';";
         $result = mysql_query($query);
         while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
         {
            $optionExpId   = $row["id"];
            $optionExpName = $row["ExperimentName"];

            if ($optionExpId == $pExpId)
            {
               $selected = 'selected="selected"';
               $pExpName = $optionExpName;
            }
            else
            {
               $selected = '';
            }

            echo '<option value="' . $optionExpId . '" ' . $selected . ' >' .
                    $optionExpName .
                 '</option>';
         }
         echo '</select>';

         if( !isset($_POST["add"]) )
         {
            echo '<span id="expDisplay">' . 
                    ( ($pExpId == '-1') ? ('Unassigned ') : ($pExpName . ' (' . $pExpId . ')') ) . 
                    '<input type="button" value="Change" onclick="changeExp();"/>' .
                 '</span>';
         }

         // 
         //echo '<>';

         echo '</h2>';

         echo '<br/>' ;


         // Experiment Progress
         echo '<h2>Experiment Progress : ';
         if( $pProgress < 1 )
         {
            echo 'Not Started';
         }
         else
         {
            echo 'Page ' . $pProgress . ' ' .
                // '<input type="button" value="Reset" onclick="changeExp();"/>' .
                 '<button data-confirm-action="resetProgress(\'' . $pId . '\');" ' .
                         'data-confirm="Are you sure you wish to reset the user to the beginning of the experiment?<br/>' . 
                                       '(This action cannot be undone)">' .
                    'Reset' .
                 '</button>';
         }
         echo '</h2>';

              //'<input id="pProgress" type="number" name="participantProgress" value="' . $pProgress . '" hidden="hidden" />' .
             // '<input type="checkbox" name="resetProgress">Reset Progress</input>';

         echo '<br/>' ;
         echo '<br/>' ;

         // Buttons
         echo '<input id="saveButton" type="submit" name="save" value="Save" /> ' .
              '<input type="reset" name="reset" value="Discard" onclick="resetExpInfo();"/>';

         echo '</form>';
      }
   ?>

      </div>
   </div>
   
</body>
</html>
