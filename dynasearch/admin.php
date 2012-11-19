<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   
   function strToHex($string)
   {
      $hex='';
      for ($i=0; $i < strlen($string); $i++)
      {
         $hex .= dechex(ord($string[$i]));
      }
      return $hex;
   }

   function hexToStr($hex)
   {
      $string='';
      for ($i=0; $i < strlen($hex)-1; $i+=2)
      {
         $string .= chr( hexdec($hex[$i].$hex[$i+1]) );
      }
	   return $string;
   }
   
   // Only admins allowed
   $username = $_SESSION['username'];
   $result = query_db('select User_Type from t_user where User_ID=\''.$username.'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);
   if($row['User_Type'] != 'A'){
      //redirect('assets/php/user.php?logout=true');
      echo("not admin!");
   }
   
   
   $page_title = "Dynaview";
   $style_file = "style.css";

   $template_style_array  = array($style_file);
   $template_script_array = array();
 
   include('assets/php/standard.php');
   
   
?>


<body>
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
         <h1>Admin Page</h1>
    	 <br/>
    	 <br/>
         <p>From this page, you can access all of the editors to create and modify training pages,
            questionnaires , and complete experiments. You can also access the Official's Guide for 
            Hurricane Evacuation Decision Making.
         </p>
         <br/>
         <br/>
         <a href="assets/officials_guide.pdf" target="_blank">Official’s Guide for Hurricane Evacuation Decision Making</a>
         <br/>
         <br/>

         <div id="shade"></div>
         <p>Editor Links</p>
         <p>
            <li><a href="editor.php">Training Page Editor</a></li>
            <li><a href="questEditor.php">Questionnaire Editor</a></li>
            <li><a href="survey_setup.php">Experiment Editor</a></li>
         </p>       
      </div>
   </div>
</body>
</html>
