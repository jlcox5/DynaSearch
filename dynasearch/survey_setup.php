<?php

   include("assets/php/config.php");
   include("assets/php/std_api.php");
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Survey Page Layout Editor";

   $template_style_array  = array("style.css", "survey_setup.css");
   $template_script_array = array("ajax-core.js", "survey_setup_js.js");

   include('assets/php/db_util.php');
/*
// Everyone is always running a session. 
// TODO: IS THIS A BAD IDEA?
if(!isset($_SESSION)) {	session_start(); }

function redirect($page_name)
{
	$host  = $_SERVER['HTTP_HOST'];
	$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
	header("Location: http://$host$uri/$page_name");	
}
*/
//require_once('assets/php/std_api.php');
   include('assets/php/admin_dir.php');

   $username = $_SESSION['username'];
   $expId = -1;
   $expName = 'New Experiment';

   if( isset($_POST['fileop']) )
   {

      if( $_POST['fileop'] == 'delete' )
      {
         $id = $_POST['expId'];

         if( $id > 0 )
         {
            $query = "DELETE FROM t_experiments " .
                     "WHERE id=$id;";
            if( $DEBUG ) { echo $query; }
            query_db($query);
         }
         else
         {
            if( $DEBUG ) { echo "FileOp ERROR : DELETE --- ExpId not set<br/>"; }
         }

      }// End Save


      if( $_POST['fileop'] == 'save' )
      {
         $id = $_POST['expId'];
         $short = $_POST['shortname'];
         $name = $_POST['fullname'];
         //$customScaling = $_POST['customScaling'];
         $scaleProfileId = $_POST['scaleProfile'];
         $experiment_string = $_POST['data'];

         if( $id > 0 )
         {
            $query = "UPDATE t_experiments " .
                     "SET ExperimentShortName='$short', Admin_ID='$username', ExperimentName='$name', " .
                        "ScaleProfileID=$scaleProfileId, ExperimentString='$experiment_string' " .
                     "WHERE id=$id;";
         $_POST['fileop'] = 'load';
         }
         else
         {
            $query = "INSERT INTO t_experiments " .
                     "(ExperimentShortName, Admin_ID, ExperimentName, ScaleProfileID, ExperimentString) " .
                     "VALUES ('$short', '$username', '$name', $scaleProfileId, '$experiment_string');";
         }

         if( $DEBUG ) { echo $query; }
//echo $query;
         query_db($query);

         //redirect('survey_setup.php?fileop=load');
      }// End Save

      if($_POST['fileop'] == 'load')
      {
         if( isset($_POST['expId']))
         {
            $expId = $_POST['expId'];
         }
         else
         {
            if( $DEBUG ) { echo "FileOp ERROR : LOAD --- ExpId not set<br/>"; }
         }

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
             $expShortName   = $res['ExperimentShortName'];
             $expString      = $res['ExperimentString'];
             //$expCustomScaling = $res['CustomScaling'];
             $scaleProfileId = $res['ScaleProfileID'];
					
          }		

      }// End Load
   }

   include('assets/php/standard.php');

?>

<body id="body">
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
	
         <h1>Experiment Editor</h1><br/>

         <br/>

         <h1 style="display:none;" id="exp_short_name"><?php echo $expShortName; ?></h1>
	
         <!-- Buttons -->
         <button onClick="prompt_new_experiment();">New</button>	
         <button onClick="save_experiment();" <?php echo ( ($expId > 0) ? ('') : ('disabled="disabled"') ); ?> >Save</button>
         <button onClick="save_experiment_as();">Save As...</button>
         <button onClick="delete_experiment();" <?php echo ( ($expId > 0) ? ('') : ('disabled="disabled"') ); ?> >Delete</button>
         <br/>
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

         <!--<select id="load_select_list">
         <?php
             
            $query = "SELECT * FROM t_experiments where Admin_ID='$username'";

            $exps = query_db($query);
            while($row = mysql_fetch_array($exps, MYSQL_BOTH))
            {
               //var_dump($row);
               echo '<option value="'. $row['ExperimentShortName'] .'">'. $row['ExperimentName'] .'</option>';
            }
         ?>
         </select>-->

         <button onClick="if(confirm('Are you sure you would like to discard all changes since the last save and load a new file?')){load_file();}">Load</button>
         <br/>
         <br/>


         <h2>Currently Editing: 
            <span id="survey_name"/><?php echo $expName; ?></span>
            <!--<input type="text" id="survey_name" value="<?php echo $expName; ?>" />-->
            <input id="exp_id" value="<?php echo $expId; ?>"  style="display:none;" />
         </h2>

         <!-- Scale Profile -->
         <!--<input type="checkbox" id="customScaling" <?php echo $expCustomScaling ? 'checked="checked"' : ''; ?> />-->
         Scale Profile : 

   <?php
      $admSizeProfiles = getAdminSizeProfiles( $username );
      echo '<select id="scaleProfile">';

      // Custom Scaling Option - always available
      echo    '<option value="-1" ' . ($scaleProfileId == '-1' ? 'selected="selected"' : '') . '>Custom Scaling</option>';

      foreach($admSizeProfiles as $key => $value)
      {
         echo '<option value="' . $key . '" ' . ($scaleProfileId == $key ? 'selected="selected"' : '') . '>' . $value . '</option>';
      }

      echo '</select>';
   ?>


         <!-- To add items to the list -->
         <br/><br/>
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
	
   <?php
      echo '<script type="text/javascript">
            ADMIN_ID = "' . $username . '";
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
