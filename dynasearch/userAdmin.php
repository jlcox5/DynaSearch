<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');
   include('assets/php/PasswordHash.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Participants";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css", "userAdmin.css", "mBoxCore.css", "mBoxModal.css", "mBoxNotice.css");
   $template_script_array = array("ajax-core.js", "mBox.All.min.js", "userAdmin.js");
   include('assets/php/standard.php');   

   if( isset($_POST['op']) )
   {
      $op = $_POST['op'];
   }
   else
   {
      $op = '';
   }

   if( isset($_POST['pId']) )
   {
      $pId = $_POST['pId'];

     if( isset($_POST["add"]) )
      {

         // Add participant
         $pId = "";

         $pName     = "";
         $pEmail = "";
         $pExpId = -1;
         $pProgress = 0;
      }
      else
      {

         $query  = "SELECT * FROM t_user WHERE User_ID='$pId';";
         $result = mysql_query($query);
         $row    = mysql_fetch_array($result, MYSQL_BOTH);

         $pName     = $row["Name"];
         $pEmail = $row["Email"];
         $pExpId = $row["Current_Experiment_ID"];
         $pProgress = $row["current_position"];
      }

   }
   else
   {
      $pId = null;
   }

   $emailStr = "";


   switch( $op )
   {
   case 'resetProgress' : // Reset Progress
      $query = "UPDATE t_user " .
               "SET current_position=0 " .
               "WHERE User_ID='$pId';" ;
      mysql_query($query);
      break;

   case 'resetPassword' : // Reset Password
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
      break;

   case 'Save' : // Save

      $pName  = $_POST['pName'];
      $pExpId = $_POST['pExp'];

      if( isset($_POST['pEmail']) )
      {
         $pEmail = $_POST['pEmail'];
      }

      // Check if participant exists
      $query  = "SELECT * FROM t_user WHERE User_ID='$pId' LIMIT 1;";
      $result = mysql_query($query);
      if( mysql_fetch_array($result) !== false )
      {
         // Participant Exists - Update
         $query = "UPDATE t_user " .
                  "SET Name='$pName', Email='$pEmail', Current_Experiment_ID=$pExpId " .
                  "WHERE User_ID='$pId'; ";
      }
      else
      {

         // Create initial password reset link
         $resetToken = randString();
         $tokenExpiration = date('m/d/Y h:i:s a', time() + (60 * 60));
         $resetUrl = '/reset.php?token=' . $resetToken;

         // New Participant - Add
         $query = "INSERT INTO t_user " .
                  "(User_ID, Admin_ID, Name, Email, User_Type, Current_Experiment_ID, ResetToken, TokenExpiration) " .
                  "VALUES " .
                  "('$pId', '$username', '$pName', '$pEmail', 'U', $pExp, '$resetToken', '$tokenExpiration');";

         $emailStr .= "An account has been created for you!\n" .
                      "\nLogin ID : $pId\n\n" . 
                      "Please follow this link to set up a password:\n" .
                      "$resetUrl\n" .
                      "\n" .
                      "";
      }
//echo $query;
      mysql_query($query);
      break;

   default :
      break;
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
   


         <h1>My Participants</h1><br/>
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

            <input class="button" type="submit" name="load" value="Load"/>
            <input class="button" type="submit" name="add" value="Add"/>
         </form>
         <br/>
         <br/>


         <!-- User Data -->
   <?php
      if( is_string($pId) )
      {

         echo '<form class="form-user" action="userAdmin.php" method="post">';

         echo '<table>';

         // Login
         echo '<tr>' .
                 '<td class="label">Login :</td>' . 
                 '<td colspan="2"><input id="pId" type="text" name="pId" value="' .$pId . '" required="required" onchange="checkAvailability();" ';
         if( isset($_POST["add"]) )
         {
            echo '/>' .
                 '<span id="availabilityTag"></span>';
         }
         else
         {
            echo 'hidden="hidden" />' .
                 '<span>' . $pId . '</span>';
         }
         echo    '</td>' . 
              '</tr>' ;


         // Name
         echo '<tr>' .
                 '<td class="label">Name :</td>' . 
                 '<td colspan="2"><input type="text" name="pName" value="' .$pName . '" required="required" /></td>' .
              '</tr>' ;


         // Email
         echo '<tr>' .
                 '<td class="label">E-mail :</td>' . 
                 '<td colspan="2"><input type="text" name="pEmail" value="' . $pEmail . '" /></td>' .
              '</tr>' ;


         // Change Password
         if( !isset($_POST["add"]) )
         {
            echo '<tr>' .
                    '<td class="label">Password :</td>' .
                    '<td colspan="2">' .
                       '<button data-confirm-action="resetPassword(\'' . $pId . '\');" ' .
                               'data-confirm="Are you sure you wish to reset the user\'s password?<br/>' . 
                                             '(This will generate a reset link that will expire in 1 hour)">' .
                          'Reset' .
                       '</button>' .
                    '</td>' .
                 '</tr>' ;
         }


         // Current Experiment
         echo '<tr>' .
                 '<td class="label">Current Experiment :</td>' .
                 '<td>' .
                    '<input id="pExp" name="pExp" required="required" value="' . $pExpId . '" hidden="hidden" />' . 
                    '<span id="expDisplay">' . 
                        ( ($pExpId == '-1') ? ('Unassigned ') : ($pExpName . ' (' . $pExpId . ')') ) . 
                    '</span> ' .
                 '</td>' .
                 '<td>' .
                    '<input type="button" value="Change" onclick="changeExp();"/>' .
                 '</td>' .
              '</tr>';


         // Experiment Progress
         if( !isset($_POST["add"]) )
         {
            echo '<tr>' .
                    '<td class="label">Experiment Progress :</td>';
            if( $pProgress < 1 )
            {
               echo '<td colspan="2">' .
                       'Not Started' .
                    '</td>';
            }
            else
            {
               echo '<td>' .
                       'Page ' . $pProgress .
                    '</td>' .
                    '<td>' .
                       '<button data-confirm-action="resetProgress(\'' . $pId . '\');" ' .
                               'data-confirm="Are you sure you wish to reset the user to the beginning of the experiment?<br/>' . 
                                             '(This action cannot be undone)">' .
                          'Reset' .
                       '</button>' .
                    '</td>';
            }
            echo '</tr>';
         }

         echo '</table>' .
              '<br>';

         // Buttons
         echo '<input id="saveButton" type="submit" name="op" value="Save" /> ' .
              '<input type="reset" name="reset" value="Discard" onclick="resetExpInfo();"/>';

         echo '</form>';
      }
   ?>

      </div>
   </div>
   
</body>
</html>
