<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');
   include('assets/php/PasswordHash.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Participants";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css");
   $template_script_array = array("ajax-core.js", "userAdmin.js");
   
   if( isset($_POST['participantId']) )
   {
      $pId = $_POST['participantId'];
   }
   else
   {
      $pId = "";
   }

   // Save
   if( isset($_POST['save']) )
   {

      if( isset($_POST['participantName']) )
      {
         $pName = $_POST['participantName'];
      }

      $pPassword = $_POST['pPassword'];
      if( !empty($pPassword) )
      {
         $passwordHash = create_hash( $pPassword );
      }
      else
      {
         $query = "SELECT PasswordHash FROM t_user WHERE User_ID='$pId';";
         $result = mysql_query($query);
         $passwordHash = mysql_result($result, 0);
      }
      $passwordHashStr = mysql_escape_string( $passwordHash );

         $pEmail = $_POST['pEmail'];

      if( isset($_POST['participantExp']) )
      {
         $pCurrExp = $_POST['participantExp'];
      }

      if( isset($_POST['resetProgress']) )
      {

         $pProgress = 0;
      }
      else
      {
         $pProgress = $_POST['participantProgress'];
         
      }

      $query = "INSERT INTO t_user " .
               "(User_ID, Admin_ID, Name, PasswordHash, Email, User_Type, Current_Experiment_ID, current_position) " .
               "VALUES " .
               "('$pId', '$username', '$pName', '$passwordHashStr', '$pEmail', 'U', $pCurrExp, $pProgress) " .
               "ON DUPLICATE KEY UPDATE " .
               "Name=Values(Name), PasswordHash=Values(PasswordHash), Email=Values(Email), Current_Experiment_ID=Values(Current_Experiment_ID), current_position=Values(current_position)"  . 
               ";";

      mysql_query($query);
      $_POST['load'] = '';
   }

   include('assets/php/standard.php');
?>

<body id="body">
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Manage Participants</h1><br/>
         <br/>

         <!-- User Select -->
         <form action="userAdmin.php" method="post">
            <select name="participantId">
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
      if( isset($_POST["add"]) || isset($_POST["load"]) )
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
                 '<input id="pId" type="text" name="participantId" value="' .$pId . '" required="required" onchange="checkAvailability();" ';
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
         echo '<h2>New Password : ' . 
                 '<input type="password" name="pPassword" ';
        if( isset($_POST["add"]) )
         {
            echo 'required="required" />';
         }
         else
         {
            echo '/>';
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
         echo '<h2>Experiment Progress : ' . 
                 ( ($pProgress < 1) ? ('Not Started') : ('Page ' . $pProgress) ) .
              '</h2>' .
              '<input id="pProgress" type="number" name="participantProgress" value="' . $pProgress . '" hidden="hidden" />' .
              '<input type="checkbox" name="resetProgress">Reset Progress</input>';

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
