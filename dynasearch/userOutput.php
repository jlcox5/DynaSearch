<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Participants";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css");
   $template_script_array = array("ajax-core.js", "userOutput.js");
   

   // Load Admin's Participants
   $adminUsers = array();
   $query = "SELECT * FROM t_user WHERE Admin_ID='$username';";
   $result = mysql_query($query);
   while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $optionUserId   = $row['User_ID'];
      $optionUserName = $row['Name'];

      $adminUsers[$optionUserId] = $optionUserName;
   }

   // Load Admin's Experiments
   $adminExps = array();
   $query = "SELECT * FROM t_experiments WHERE Admin_ID='$username';";
   $result = mysql_query($query);
   while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $optionExpId   = $row['id'];
      $optionExpName = $row['ExperimentName'];

      $adminExps[$optionExpId] = $optionExpName;
   }

   // View Mode
   if( isset($_POST['viewMode']) )
   {
      $viewMode = $_POST['viewMode'];
   }


   if( isset($_POST['pId']) )
   {
      $pId = $_POST['pId'];
      $query = "SELECT * FROM t_user WHERE User_ID='$pId';";
      $result = mysql_query($query);
      $row = mysql_fetch_array($result, MYSQL_BOTH);

      $pName = $row['Name'];
   }


   if( isset($_POST['expId']) )
   {
      $expId = $_POST['expId'];
      $query = "SELECT * FROM t_experiments WHERE id='$expId';";
      $result = mysql_query($query);
      $row = mysql_fetch_array($result, MYSQL_BOTH);

      $expName = $row['ExperimentName'];
   }

   if( isset($_POST['pId']) && isset($_POST['expId']) )
   {
      $query = "SELECT * FROM t_user_output WHERE User_ID='$pId' AND Experiment_ID='$expId';";
      $result = mysql_query($query);
      $row = mysql_fetch_array($result, MYSQL_BOTH);

      $questResults = $row['QuestOutput'];
      $clickResults = $row['ClickOutput'];
   }



   include('assets/php/standard.php');
?>

<body id="body">
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Participant Results</h1><br/>
         <br/>

         <form action="userOutput.php" method="post">
            <!-- View Mode -->
            <label for="viewMode">View by : </label>
            <select id="viewMode" name="viewMode" onchange="changeViewMode();">
               <option value="participant">Participant</option>
               <option value="experiment">Experiment</option>
            </select>

            <!-- Participant Select-->
   <?php
      if( $viewMode == "participant" )
      {
         echo '<select id="userSelect" name="pId">';
      }
      else
      {
         echo '<select id="userSelect" name="pId"  disabled="disabled" style="display:none;">';
      }

      foreach($adminUsers as $key => $value)
      {
         if ($key == $pId)
         {
            $selected = 'selected="selected"';
         }
         else
         {
            $selected = '';
         }

         echo '<option value="' . $key . '" ' . $selected . '>' .
                 $value . ' (' . $key . ')' .
              '</option>';
      }
      echo '</select>';
   ?>

            <!-- Experiment Select-->
   <?php
      if( $viewMode == "experiment" )
      {
         echo '<select id="expSelect" name="expId">';
      }
      else
      {
         echo '<select id="expSelect" name="expId"  disabled="disabled" style="display:none;">';
      }

      foreach($adminExps as $key => $value)
      {
         if ($key == $pId)
         {
            $selected = 'selected="selected"';
         }
         else
         {
            $selected = '';
         }

         echo '<option value="' . $key . '" ' . $selected . '>' .
                 $value . ' (' . $key . ')' .
              '</option>';
      }
      echo '</select>';
   ?>

            <br/>
            <br/>


            <!-- Info -->
   <?php

      if( isset($_POST["load"]) )
      {

         // Info
         if( $viewMode == "participant")
         {
            echo '<h2>Participant Name : ' . $pName . '</h2>' .
                 '<br/>';

            echo '<h2>Participant Experiments : ' .
                    '<select name="expId">';

            $query = "SELECT * FROM t_user_output WHERE User_ID='$pId';";
            $result = mysql_query($query);
            while( $row = mysql_fetch_array($result, MYSQL_BOTH) )
            {
               $optionExpId = $row['Experiment_ID'];
               $optionExpName = $adminExps[$optionExpId];

               echo '<option value="' . $optionExpId . '">' .
                       $optionExpName . ' (' . $optionExpId . ')' .
                    '</option>';
            }

            echo    '</select>' . 
                 '</h2>';

         }
         else
         {
            echo '<h2>Experiment Name : </h2>' .
                 '<br/>';

            echo '<h2>Experiment Participants : ' .
                    '<select name="pId">' . 
                    '</select>' . 
                 '</h2>';
         }

         echo '<br/>';

         // Results
         echo '<h2>Questionaire Results :</h2>';
         echo $questResults;
         $pages = explode("&", $questResults);

         for( $i = 0; $i < count($pages); ++$i )
         {
            $pageTitle = strtok($pages[$i], ":");

            echo '<table>' . 
                    '<tr>' .
                       '<th>' . $pageTitle . '</th>' .
                    '</tr>';

            $questNum = 0;
            while( ($content = strtok(",")) )
            {
               echo '<tr><td>' . $questNum . '</td><td>' . $content . '</td></tr>';
               ++ $questNum;
            }
            echo '</table>';
         }

         echo '<br/>';

         echo '<h2>Click Results :</h2>';
         echo $clickResults;
      }

   ?>

            <br/>
            <input type="submit" name="load" value="Load">

         </form>

      </div>
   </div>
   
</body>
</html>
