<?php
    $no_login_required = 'yay';
    $errorMsg = "";
    
    include("assets/php/config.php");
    include("assets/php/std_api.php");
    $con = mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
    mysql_select_db($DB_NAME) or die("Unable to select database.");
	
    //if(isset($_POST['doneWithPage'])){
    //   redirect("logOut.php");
    //}
	
    $page_title = "Questionnaire";
    $style_file = "style.css";
    
    $template_style_array  = array($style_file, "questEditor.css", "accordian.css");
    $template_script_array = array("accordian.js", "questEditor.js");
	
    include("assets/php/standard.php");

    /*
    // Questionaire should be saved
    if(isset($_POST['save'])){
	    if(isset($_POST['title']) && isset($_POST['toSave'])){
          $title = $_POST['title'];
          $text = $_POST['toSave'];
          $return = mysql_query("SELECT Name FROM sur_question WHERE Name='$title';");
          $testTitle = mysql_fetch_array($return);
          if($testTitle['Name'] == $title){
             $errorMsg = "A questionnaire with the name already exists.";
          }
          else{
	          $sql = mysql_query("INSERT INTO sur_question SET Name='$title', Value='$text';");
             //if (!mysql_query($sql,$con))
             //{
             //   die('Error: ' . mysql_error());
             //}
             redirect("questEditor.php");
          }
       }
       else{
          redirect("login.php");
	    }
    }
*/	
    include('assets/php/standard.php');

?>

<body onLoad="constructQuestion()">

<?php

   $currentQuest = "";

   if(isset($_POST['saveQuest']) && isset($_POST['questName'])){
      //
      $text  = $_POST['saveQuest'];
      $title = $_POST['questName'];

      // SQL Injection Protection
      $sqltext  = mysql_real_escape_string($text);
      $sqltitle = mysql_real_escape_string($title);
      $response = mysql_query("SELECT id FROM sur_question WHERE Name='".mysql_real_escape_string($sqltitle)."';");
      $assoc = mysql_fetch_array($response);
      if(isset($assoc['id'])){
         $sql   = mysql_query("UPDATE sur_question SET Value='".$sqltext."' WHERE Name='".$sqltitle."';");
      }else{
         $sql   = mysql_query("INSERT INTO sur_question SET Name='".$sqltitle."', Value='".$sqltext."';");
      }

      // Reload Saved Questionnaire
      $currentQuest = $text;

   } else if(isset($_POST['loadQuest'])){

      // Current Questionaire
      $currentQuest = $_POST['currentQuest'];

      // Questions to load (append)
      $query = "SELECT Value FROM sur_question WHERE Name='".mysql_real_escape_string($_POST['loadQuest'])."'";
      $result  = mysql_query($query);
      if($result){
         $assoc = mysql_fetch_assoc($result);
         $loadQuest  = $assoc['Value'];
      }

   }
?>

   <!-- Form to load Questionairre -->
   <form id="To_Load">
      <input type="hidden" name="currentQuestStr" value="<?php echo $currentQuest?>" />
      <input type="hidden" name="questStr" value="<?php echo $loadQuest?>" />
   </form>

   <!-- Fetch Loadable Questionaires -->
   <datalist id="loadable">
      <?php
         $response = mysql_query("SELECT Name FROM sur_question;");
         while($row = mysql_fetch_assoc($response)){
            echo "   <option value='".$row['Name']."'>".$row['Name']."</option>";
         }
      ?>
   </datalist>



   <form id="POST_save" method="post">
      <input type="hidden" name="saveQuest" value="">
      <input type="hidden" name="questName" value="">
   </form>

   <div id="drag_cont">
      <div id="maincontainer">
         <center><h1>DynaView</h1></center>
         <br/>
         <table id="two_column_opening"> <!-- Begin main page columns  -->
            <td width="50%">
               From this screen you can create questionnaires that can be used in surveys created from the Experiment Editor.

               <form action="questEditor.php" id="question_editor" name="question_editor" method="post">
                  <div id="accordion">
                     <div id="newQuest">

<!-- 
      </div>php
      <div id="randQuestList">
         <?php
            $return = mysql_query("SELECT * FROM sur_randquestion;");
            echo "<select name='randQL' onmouseup='insertRandom(value)'>";
            while ( $set = mysql_fetch_array($return) ){
	           echo "<option value='".$set['Value']."'>".$set['Designator']."</option>";
            }
            echo '</select>';
            echo $set['Value'];
            #echo "<p><input type='button' id='insertRand' name='insertRand' value='Insert Question' onclick='insertRandom(".$set['Value'].")'/></p>";
         ?>
      </div>
   </div>
-->
               </form>
            </td>
         </table> <!-- End main page columns  -->
      </div>
      <div id="drag_me">
         <div id="drag_me_handle"><span>Question Constructor</span></div>
            <div id="questInfo"></div>
         </div>
      </div>
   </div>
</body>
</html>
