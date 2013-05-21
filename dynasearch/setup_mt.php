<?php

   include("assets/php/config.php");
   include("assets/php/std_api.php");
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Survey Page Layout Editor";

   $template_style_array  = array("style.css", "mBoxCore.css", "mBoxModal.css", "mBoxNotice.css", "survey_setup.css");
   $template_script_array = array("ajax-core.js", "mBox.All.min.js", "survey_setup_js.js");

   include('assets/php/db_util.php');
   include('assets/php/admin_dir.php');

   $username       = $_SESSION['username'];
   //$expId          = ifSetElse( $_REQUEST['expId'], -1 );
   //$expName        = ifSetElse( $_REQUEST['expName'] );
   //$expString      = ifSetElse( $_REQUEST['expData'] );
   //$scaleProfileId = ifSetElse( $_REQUEST['scaleProfileId'], -1 );

   $op = ifSetElse( $_REQUEST['fileop'] );   
   switch ( $op )
   {
      case 'delete' :
         if( $expId > 0 )
         {
            $query = "DELETE FROM t_experiments " .
                     "WHERE id=$expId;";
            if( $DEBUG ) { echo $query; }
            query_db($query);
            $expId = -1;
         }
         else
         {
            if( $DEBUG ) { echo "FileOp ERROR : DELETE --- ExpId not set<br/>"; }
         }
       break;

      case 'save' :
      
         $sqlName = mysql_real_escape_string( $expName );
         $sqlData = mysql_real_escape_string( $expString );
      
         if( $expId > 0 )
         {
            $query = "UPDATE t_experiments " .
                     "SET Admin_ID='$username', ExperimentName='$sqlName', " .
                         "ScaleProfileID=$scaleProfileId, ExperimentString='$sqlData' " .
                     "WHERE id=$expId;";
            query_db($query);

         }
         else
         {
            $query = "INSERT INTO t_experiments " .
                     "(Admin_ID, ExperimentName, ScaleProfileID, ExperimentString) " .
                     "VALUES ('$username', '$sqlName', $scaleProfileId, '$sqlData');";
            query_db($query);
            $expId = mysql_insert_id();
            redirect( 'survey_setup.php?fileop=load&expId=' . $expId );
            exit;
         }

         if( $DEBUG ) { echo $query; }
        break;

      case 'load' :
         $query = "SELECT * FROM t_experiments WHERE id='$expId';";
         $res = query_db( $query );
            
         if( is_string($res) ) 
         {  
            if( $DEBUG ) { echo "FileOp ERROR : LOAD --- Exp not found in database<br/>"; }
         }
         else 
         {
             // Load the Experiment
             $res = mysql_fetch_array($res, MYSQL_BOTH);
               
             $expName        = $res['ExperimentName'];
             $expString      = $res['ExperimentString'];
             $scaleProfileId = $res['ScaleProfileID'];
          }		

        break;

      default :
        break;
   }

   include('assets/php/standard.php');

?>

<body id="body">

   <!-- Save As Experiment Popup -->
   <div id="save-as-popup"  style="display:none;">
      <input id="expSaveName" value="<?php echo $expName; ?>" />
   </div>
   
   <!-- Load Experiment Popup -->
   <div id="load-exp"  style="display:none;">
      My Experiments
   <?php
      $adminExps = getAdminExps($username);
      echo '<select id="expId" >';
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
<!--
      <div class="warning">
         <b>If you load another questionnaire,<br/>
         all current unsaved changes will be lost.</b>
      </div>-->
   </div>

   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Experiment Editor</h1>
         <br/>
         <br/>
   
         <!-- Buttons -->
         <button onClick="new_experiment();">New</button>	
         <button id="saveBtn"   onClick="save_experiment();"
                 <?php echo ( ($expId > 0) ? ('') : ('disabled="disabled"') ); ?> >Save</button>
         <button id="saveAsBtn" onClick="save_experiment_as();"
                 <?php echo ( ($expId > 0) ? ('') : ('disabled="disabled"') ); ?> >Save As...</button>
         <button id="deleteBtn" data-confirm-action="delete_experiment();"
                 data-confirm="Are you sure you wish to delete this experiment?<br/>This action cannot be undone."
                 <?php echo ( ($expId > 0) ? ('') : ('disabled="disabled"') ); ?> >Delete</button>
         <button data-confirm-action="load_experiment();"
                 data-confirm="Are you sure you wish to load an experiment?<br/>All unsaved changes will be lost."
                 <?php echo ( (sizeof($adminExps) > 0) ? ('') : ('disabled="disabled"') ); ?> >Load...</button>	
         <br/>

         <br/>

         <div id="exp_editor" <?php echo ( ($expId > 0) ? ('') : ('style="display:none;"') ); ?>>

            <h2>Currently Editing: 
               <span id="expName"/><?php echo $expName; ?></span>
            </h2>
            <br/>
            
            Scale Profile : 
   <?php
      $admSizeProfiles = getAdminSizeProfiles( $username );
      echo '<select id="scaleProfileId">';

      // Custom Scaling Option - always available
      echo    '<option value="-1" ' . ($scaleProfileId == '-1' ? 'selected="selected"' : '') . '>Custom Scaling</option>';

      foreach($admSizeProfiles as $key => $value)
      {
         echo '<option value="' . $key . '" ' . ($scaleProfileId == $key ? 'selected="selected"' : '') . '>' . $value . '</option>';
      }

      echo '</select>';
   ?>


            <!-- To add items to the list -->
            <br/>
            <br/>
            <a href="#" onClick="add_info_page('','');">
               <img src="assets/images/add.png"/ style="margin:auto 0; border-width:0px;">
               Add Information Page
            </a>
            <a href="#" onClick="add_training_page('','');">
               <img src="assets/images/add.png"/ style="margin:auto 0; border-width:0px;">
               Add Training Screen
            </a>
            <a href="#" onClick="add_survey_page('','','');">
               <img src="assets/images/add.png"/ style="margin:auto 0; border-width:0px;">
               Add Survey Screen
            </a>
            <p></p>


         <!-- Invisible selects. These are cloned to create drop downs for each list item-->
         <?php
            // List all active Questionnaires
            $adminQuests = getAdminQuests($username);
            //$_SESSION['SurveyList'] = '<select name="qChoice" id="qChoice" style="display:none;">';
            $aQuests = '<select name="aQuests" id="aQuests" style="display:none;">';
            foreach($adminQuests as $key => $value)
            {
               $aQuests .= '<option value="' . $key . '">' .
                              $value . ' (' . $key . ')' .
                           '</option>';
               //$_SESSION['SurveyList'] = $_SESSION['SurveyList'].'<option value="'.$toPrint.'">'.$toPrint.'</option>';
            }
            //$_SESSION['SurveyList'] = $_SESSION['SurveyList'].'</select>';
            $aQuests .= '</select>';

            // Added by Jon - List all instruction pages
            $instFiles = '<select name="instChoice" id="instChoice" style="display:none;">';
            if($handle = opendir("./admins/" . $username . "/assets/instructions/"))
            {
               while(false !== ($file = readdir($handle)))
               {
                  if($file !== '.' && $file !== '..')
                  {
                     $instFiles = $instFiles.'<option value="'.$file.'">'.$file.'</option>';
                  }
               }
            }
            $instFiles = $instFiles.'</select>';

            // Added by Jon - List all advisory pages
            $advFiles = '<select name="advChoice" id="advChoice" style="display:none;">';
            if($handle = opendir("./admins/" . $username . "/assets/training/"))
            {
               while(false !== ($file = readdir($handle)))
               {
                  if($file !== '.' && $file !== '..')
                  {
                     $advFiles = $advFiles.'<option value="'.$file.'">'.$file.'</option>';
                  }
               }
            }
            $advFiles = $advFiles.'</select>';
         ?>

         <p><?php echo($aQuests); echo($instFiles); echo($advFiles); ?> </p>



         <!--- Our Sortables List --->
         <div id="page_list"></div>
   
         </div>
      </div>
   </div>
   
   <?php
      echo '<script type="text/javascript">
            var ADMIN_ID = "' . $username . '",
                EXP_ID   = "' . $expId . '",
                EXP_NAME = "' . $expName . '";
            window.addEvent(\'domready\', function(){
            ';

     $expData = parseExperimentData( $expString );
      for( $i = 0; $i < count($expData); ++$i )
      {
         $expPageData = $expData[ $i ];

         $pageSource = $expPageData['src'];
         $pageTitle  = $expPageData['title'];

         switch( $expPageData['type'] )
         {
            case 'Information Page' :
               echo 'add_info_page("'. $pageTitle .'","'. $pageSource .'");';
               break;

            case 'Training Screen' :
               echo 'add_training_page("'. $pageTitle .'","'. $pageSource .'");';
               break;

            case 'Survey Page' :
               $survName = '';
               if($survName == '')
               {
                  $survName = 'undefined';
               }
               echo 'add_survey_page("'. $pageTitle .'","'. $pageSource .'");';
               break;
         }
      }



      echo '});</script>';
   ?>
   
</body>
</html>
