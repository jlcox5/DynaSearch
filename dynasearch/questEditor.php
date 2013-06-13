<?php
   $no_login_required = 'yay';
   $errorMsg = "";
    
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   $con = mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");
	
   $username = $_SESSION['username'];
	
   $page_title = "Questionnaire Editor";
   $style_file = "style.css";
    
   $template_style_array  = array($style_file, "questEditor.css", "accordian.css", "mBoxCore.css", "mBoxModal.css", "mBoxNotice.css");
   $template_script_array = array("accordian.js", "mBox.All.min.js","questionnaire.js", "questEditor.js");
	
   
   if( isset($_POST['op']) )
   {
      $op = $_POST['op'];
   }
   else
   {
      $op = '';
   }

   $qId   = ifSetElse( $_REQUEST['qId'], -1 );
   $qName = ifSetElse( $_REQUEST['qName'] );
   $qData = ifSetElse( $_REQUEST['qData'] );

   $op = ifSetElse( $_REQUEST['op'] );   
   switch( $op )
   {
   case 'save' : // Save
      $sqlName = mysql_real_escape_string( $qName );
      $sqlData = mysql_real_escape_string( $qData );

      if( $qId > 0 )
      {
         $query = "UPDATE sur_question " .
                  "SET Admin_ID='$username', Name='$sqlName', Value='$sqlData' " .
                  "WHERE id=$qId;";
         mysql_query($query);
      }
      else
      {
         $query = "INSERT INTO sur_question " .
                  "(Admin_ID, Name, Value) " .
                  "VALUES ('$username', '$sqlName', '$sqlData');";
         mysql_query($query);
         $qId = mysql_insert_id();
         redirect( 'questEditor.php?op=load&qId=' . $qId );
      }
      break;

   case 'load' : // Load
      $query = "SELECT * FROM sur_question " .
               "WHERE id=$qId;";

      $res = mysql_query( $query );
      $row = mysql_fetch_array($res, MYSQL_BOTH);
				
      if( !$row ) 
      {  
         if( $DEBUG ) { echo "Op ERROR : LOAD --- Questionnaire not found in database<br/>"; }
      }
      else 
      {
          // Load the Questionnaire
          $qName = $row['Name'];
          $qData = $row['Value'];
      }
      break;

   case 'delete' : // Delete

      $query = "DELETE FROM sur_question " .
               "WHERE id=$qId;";

      $res = mysql_query( $query );
	/*			
      if( is_string($res) ) 
      {  
         if( $DEBUG ) { echo "Op ERROR : DELETE --- Questionnaire not deleted<br/>"; }
      }
      else 
      {

      }*/
      $qId = -1;
      break;

   default :
      break;
   }

   include('assets/php/standard.php');

?>

<body>

   <!-- Save As Questionnaire Popup -->
   <div id="save-as-quest"  style="display:none;">
      <input id="qName" name="qName" value="<?php echo $qName; ?>" onchange="$('qNameDisplay').set('html',this.value);"/>
      <input id="qId"   name="qId"   value="<?php echo $qId; ?>"   style="display:none;" />
      <input id="qData" name="qData" value="<?php echo $qData; ?>" style="display:none;" />
   </div>


   <!-- Load / Append Questionnaire Popup -->
   <div id="load-quest"  style="display:none;">
      My Questionnaires
   <?php
      $adminQuests = getAdminQuests($username);
      echo '<select id="aQuests" >';
      foreach($adminQuests as $key => $value)
      {
         if ($key == $qId)
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

   <!-- Section Editor Popup -->
   <div id="section-editor" style="display:none;">
      Please enter a title for the section<br/>
      <input id="section-name" type="text" />
   </div>

   <!-- Radio Button Question Prototype -->
   <div id="radio-answer-proto" style="display:none;">
      <input type="text" />
      <a href="#" onClick="remove_radio_answer(this);">
         <img src="assets/images/delete.png" style="margin: auto 0px auto 10px; border-width:0px;" />
      </a>
   </div>

   <!-- Radio Button Question Editor Popup -->
   <div id="radio-editor" style="display:none;">
      Please enter the question<br/>
      <input id="radio-question" type="text" /><br/>
      Please enter the possible answers<br/>
      <div id="radio-answers" style="max-height:136px; overflow-x:hidden; overflow-y:scroll;"></div>
      <a href="#" onClick="add_radio_answer();">
         <img src="assets/images/add.png" style="margin: auto 0px auto 10px; border-width:0px;">
         Add Answer
      </a>
   </div>

   <!-- Text Question Editor Popup -->
   <div id="text-editor" style="display:none;">
      Please enter the question<br/>
      <input id="text-question" type="text" /><br/>
      Please enter the maximum character count for the answer (leave blank for unbounded answers)<br/>
      <input id="text-limit" type="number" />
   </div>

   <!-- Text Line Editor Popup -->
   <div id="textline-editor" style="display:none;">
      Please enter a line of text<br/>
      <input id="textline-text" type="text" />
   </div>


   <div id="maincontainer">
      <center><h1>Questionnaire Editor</h1></center>
      <table id="two_column_opening"> <!-- Begin main page columns  -->
         <td width="50%">
            From this screen you can create questionnaires that can be used in surveys created from the Experiment Editor.

            <br/>
            <br/>

            <!-- Buttons -->
            <button data-confirm-action="new_quest();"
                    data-confirm="Are you sure you wish to create a new questionnaire?<br/>All unsaved changes will be lost." >New</button>	
            <button id="saveBtn"   onClick="save_quest();"    <?php echo ( ($qId > 0) ? ('') : ('disabled="disabled"') ); ?>  >Save</button>
            <button id="saveAsBtn" onClick="save_quest_as();" <?php echo ( ($qId > 0) ? ('') : ('disabled="disabled"') ); ?>  >Save As...</button>
            <button id="deleteBtn" data-confirm-action="delete_quest();"
                    data-confirm="Are you sure you wish to delete this questionnaire?<br/>This action cannot be undone."
                    <?php echo ( ($qId > 0) ? ('') : ('disabled="disabled"') ); ?>                                            >Delete</button>
            <button id="loadBtn" data-confirm-action="load_quest();"
                    data-confirm="Are you sure you wish to load a questionnaire?<br/>All unsaved changes will be lost."
                    <?php echo ( (sizeof($adminQuests) > 0) ? ('') : ('disabled="disabled"') ); ?>                            >Load...</button>	
            <button id="appendBtn" onClick="append_quest();"  
                    <?php echo ( ($qId > 0) ? ('') : ('disabled="disabled"') ); ?>                            >Append...</button>	

            <br/>
            <br/>

            <div id="quest_editor" <?php echo ( ($qId > 0) ? ('') : ('style="display:none;"') ); ?>>

               <!-- To add items to the list -->
               <h2>Currently Editing: 
                  <span id="qNameDisplay"/><?php echo $qName; ?></span>
                  <!--<input type="text" id="survey_name" value="<?php echo $expName; ?>" />-->
               </h2>

               <br/>
               <a href="#" onClick="add_quest_item('section');">
                  <img src="assets/images/add.png" style="margin: auto 0px auto 10px; border-width:0px;">
                  Section
               </a>
               <a href="#" onClick="add_quest_item('radioQuest');">
                  <img src="assets/images/add.png" style="margin: auto 0px auto 10px; border-width:0px;">
                  Radio Button Question
               </a>
               <a href="#" onClick="add_quest_item('textQuest');">
                  <img src="assets/images/add.png" style="margin: auto 0px auto 10px; border-width:0px;">
                  Text Question
               </a>
               <a href="#" onClick="add_quest_item('textline');">
                  <img src="assets/images/add.png" style="margin: auto 0px auto 10px; border-width:0px;">
                  Line Of Text
               </a>

                  <!--<div id="accordion">-->
                     <div id="newQuest">
             </div>

         </td>
      </table> <!-- End main page columns  -->
   </div>
   <script type="text/javascript">
      var ADMIN_ID = <?php echo json_encode($username); ?>,
          Q_ID     = <?php echo json_encode($qId); ?>,
          Q_NAME   = <?php echo json_encode($qName); ?>,
          Q_DATA   = <?php echo json_encode($qData); ?>;
   </script>
</body>
</html>
