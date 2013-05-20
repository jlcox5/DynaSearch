<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");


function formatQuestResults( $qDOM, $type )
{
   $qStr = '';
   foreach ( $qDOM->childNodes as $node ) {
      $tag = $node->nodeName;

      switch ( $type )
      {
      case 'txt' :

         $qStr .= '\n';
         break;

      case 'csv' :
         break;

      case 'excel'  :
         break;

      default :
         echo 'ERROR : Unknown file type [' . $type . ']';
         break;
      }

   }
   return $qStr; 
}


   // Download Data
   if( isset($_POST["download"]) )
   {
      if( isset($_POST["fileType"]) )
      {
         $fileType = $_POST["fileType"];
      }
      else
      {
         $fileType = "txt"; 
      }

      $filename = $_POST['pId'] . '_' . $_POST['expId'];

      if($_POST["resultType"] == "quest")
      {
         $filename .= "_quest";
         $rawData   = $_POST['questResults'];
      }
      else
      {
         $filename .= "_click";
         $rawData = $_POST['clickResults'];
      }

      // Format data based on file type
      switch ($fileType)
      {
         case "txt":
            $data = str_replace("&", "\n\n", $rawData);
            $data = str_replace(array(":", ","), "\n", $data);
            $filename .= ".txt";
            break;

         case "csv":
            $data = $rawData;
            $filename .= ".csv";
            break;

          case "excel":
            $data = $rawData;
            $filename .= ".xls";
            break;

      }

      // Begin Download
      header("Content-Disposition: attachment; filename=\"" . $filename . "\"");
      header("Content-Type: application/force-download");
      header("Content-Length: " . strlen($data));
      print $data;
      //header("Connection: close");
      exit;
   }

   $page_title = "Participant Results";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css", "mBoxCore.css", "mBoxModal.css", "mBoxNotice.css", "userOutput.css");
   $template_script_array = array("ajax-core.js", "mBox.All.min.js", "userOutput.js");
   

   // View Mode
   if( isset($_POST['viewMode']) )
   {
      $viewMode = $_POST['viewMode'];
   }
   else
   {
      $viewMode = "participant";
   }

   // Load Admin's Participants
   $adminUsers = getAdminParticipants( $username );

   // Load Admin's Experiments
   $adminExps = getAdminExps( $username );



   if( isset($_POST['pId']) )
   {
      $pId = $_POST['pId'];
   }
   else
   {
      reset($adminUsers);
      $pId = key($adminUsers);
      $pName = $adminUsers[ $pId ];
   }


   if ( isset($_POST['pId']) and isset($_POST['expId']) )
   {
      $pId   = $_POST['pId'];
      $expId = $_POST['expId'];

      $query = "SELECT * FROM t_user_output WHERE User_ID='$pId' AND Experiment_ID='$expId';";
      $result = mysql_query($query);
      if ( $row = mysql_fetch_array($result, MYSQL_BOTH) )
      {
         $rId          = $row['ID'];
         $questResults = $row['QuestOutput'];
         $clickResults = $row['ClickOutput'];
      }
      else
      {
         $rId          = -1;
         $questResults = '';
         $clickResults = '';
      }
   }

   $questResults = '<questResults>' . $questResults . '</questResults>';
   

   include('assets/php/standard.php');
?>

<body id="body">

   <!-- Download Results Popup -->
   <div id="results-popup" style="display:none;">
         <table>
            <tr>
               <td>
   <?php

      echo '<select id="viewMode" name="viewMode" onchange="change_view_mode();">';
      if( $viewMode == "participant" )
      {
         echo '<option value="participant" selected="selected">Participant</option>' .
              '<option value="experiment">Experiment</option>';
      }
      else
      {
         echo '<option value="participant">Participant</option>' .
              '<option value="experiment" selected="selected">Experiment</option>';
      }
      echo '</select>';
   ?>
               </td>
               <td id="main-select"></td>
            </tr>
            <tr>
               <td id="sub-tag"></td>
               <td id="sub-select"></td>
            </tr>
         </table>
         <br/>
   </div>

   <!-- Download Results Popup -->
   <div id="download"  style="display:none;">
   <?php
      echo '<input id="questResults" hidden="hidden" value="' . htmlspecialchars($questResults) . '">';
      echo '<input id="clickResults" hidden="hidden" value="' . htmlspecialchars($clickResults) . '">';
         // Download
         echo '<br/>';
         //echo '<input type="text" name="questResults" value="' . $questResults . '" hidden="hidden" />' .
         //     '<input type="text" name="clickResults" value="' . $clickResults . '" hidden="hidden" />';

         echo 'Download: <select name="resultType">' .
                 ( empty($questResults) ? ('') : ('<option value="quest">Questionaire Results</option>') ) .
                 ( empty($clickResults) ? ('') : ('<option value="click">Click Results</option>') ) .
              '</select>';

         echo '<br/>';
         echo ' Please select a format <select name="fileType">';

         echo '<option value="' . 'txt' . '">' .
                 'Plain Text (.' . 'txt' . ')' .
              '</option>';

         echo '<option value="' . 'csv' . '">' .
                 'Comma-Seperated Values (.' . 'csv' . ')' .
              '</option>';

         echo '<option value="' . 'xls' . '">' .
                 'MS Excel (.' . 'xls' . ')' .
              '</option>';

         echo '</select>';
         echo '<br/>';
   ?>
   </div>

   <!-- Select Prototypes -->
   <div style="display:none;">
   <?php
      echo '<select id="pIdProto">';
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

      echo '<select id="expIdProto">';
      foreach($adminExps as $key => $value)
      {
         if ($key == $expId)
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
   </div>

   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Participant Results</h1><br/>
         <br/>

         <button id="displayBtn"  type="button" onClick="display_results();" >Display...</button>
         <button id="downloadBtn" type="button" onClick="download_results();"    <?php echo ( (true) ? ('') : ('disabled="disabled"') ); ?>  >Download...</button>


         <form id="outputForm" action="userOutput.php" method="post">
         <br/>

            <!-- Results -->
   <?php

         echo '<br/>';

function constructQuestResults( $qDOM )
{
   $qStr = '';
   foreach ( $qDOM->childNodes as $node ) {
      $tag = $node->nodeName;

      switch ( $tag )
      {
      case 'section' :
         $sectionName = $node->getAttribute('title');
         $qStr .= '<div class="quest-section">' .
                     '<h2>' . $sectionName . '</h2><br/>' .
                     constructQuestResults( $node ) .
                  '</div>';
         break;

      case 'radioquestion' :
      case 'textquestion'  :
         $question = $node->getAttribute('question');
         $answer   = $node->getAttribute('answer');
         $qStr .= $question . '<br/>' .
                  '<b>' . $answer . '</b>';
         break;

      default :
         echo 'ERROR : Unknown questionnaire item [tag - ' . $tag . ']';
         break;
      }
      $qStr .= '<br/>';
   }
   return $qStr; 
}

      if ( $rId > 0 )
      {

      // Results

      echo '<h2>Questionaire Results :</h2>';
      $qResultDOM = new DOMDocument();
      $qResultDOM->loadXML($questResults);
      $root = $qResultDOM->documentElement;

      if( $root->childNodes->length > 0 )
      {

         echo '<div id="quest-accordion">';
         foreach ( $root->childNodes as $node ) {
            echo '<div class="toggle">' . $node->getAttribute('page') . '</div>' .
                 '<div class="content">' .
                    constructQuestResults($node) . '<br/>' .
                 '</div>';
         }
         echo '</div>';
      }
      else
      {
         echo '<i>No Results Found</i><br/>';
      }
      echo '<br/>';


      echo '<h2>Click Results :</h2>';

      if( !empty($clickResults) )
      {

         //echo $clickResults;
         $pages = preg_split('@&@', $clickResults, NULL, PREG_SPLIT_NO_EMPTY);

         for( $i = 0; $i < count($pages); ++$i )
         {
            $pageTitle = strtok($pages[$i], ":");

            echo '<table>' . 
                    '<tr>' .
                       '<th colspan="3">' . $pageTitle . '</th>' .
                    '</tr>' .
                    '<tr>' .
                       '<th>#</th><th>Object</th><th>Duration</th>' .
                    '</tr>';

            $clickNum = 1;
            while( ($content = strtok("$")) )
            {
               $details = explode(",", $content);
               echo '<tr><td>' . $clickNum . '</td><td>' . $details[0] . '</td><td>' . $details[1] . '</td></tr>';
               ++ $clickNum;
            }
            echo '</table>';
         }
         echo '<br/>';
      }
      else
      {
         echo '<i>No Results Found</i><br/>';
      }

      }

   ?>

            <br/>

         </form>

         <div id="quest-results">
         </div>

      </div>
   </div>
   <script type="text/javascript">
      var QUEST_RESULTS = <?php echo json_encode($questResults); ?>,
          ADMIN_USERS   = <?php echo json_encode($adminUsers); ?>,
          ADMIN_EXPS    = <?php echo json_encode($adminExps); ?>;
   </script>
</body>
</html>
