<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   
   // Only admins allowed
   $username = $_SESSION['username'];
   $name     = $_SESSION['full_name'];

   $result = query_db('select User_Type from t_user where User_ID=\''.$username.'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);
   if($row['User_Type'] != 'A'){
      //redirect('assets/php/user.php?logout=true');
      echo("not admin!");
   }
   
   
   // Page Header Setup
   $page_title = "DynaSearch";
   $template_style_array  = array("style.css", "mBoxCore.css", "mBoxTooltip.css", 'admin.css');
   $template_script_array = array('mBox.All.min.js');
   include('assets/php/standard.php');
?>
<body>
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
         <h1>DynaSearch Home</h1>
    	   <br/>
         <h3>Hello, <?php echo $name; ?>!</h3>
    	   <br/>
         <p>
            Welcome to Dynasearch!<br/>
            From this page, you can access all of the editors to create and modify training pages,
            questionnaires , and complete experiments.
         </p>
         <br/>
         <br/>

         <div class="rounded-box">
            <table>
               <tr>
                  <td class="cell-left">Manage the building blocks for your experiment.</td>
                  <td>
                     <a href="adminAssets.php" tooltip-data="Upload, edit, and manage your images, scripts, and more!">Asset Manager</a><br/>
                     <!--<div id="test" style="display:none;">Here is one tip</div>-->
                     <a href="custom_editor.php" tooltip-data="Create Custom pages, where participant clicks will be rcorded.">Custom Page Editor</a><br/>
                     <a href="questEditor.php" tooltip-data="Create questionnaires to collect information in your experiments.">Questionnaire Editor</a><br/>
                  </td>
               </tr>
            </table>
         </div>
         
         <div class="rounded-box">
            <table>
               <tr>
                  <td class="cell-left">Create custom experiments, utilizing the elements you have uploaded and created.</td>
                  <td>
                     <a href="survey_setup.php"tooltip-data="Organize your data into experiments to be completed by your participants.">Experiment Builder</a><br/>
                  </td>
               </tr>
            </table>
         </div>
         
         <div class="rounded-box">
            <table>
               <tr>
                  <td class="cell-left">Manage your participants, assign experiments to run, and collect the results.</td>
                  <td>
                     <a href="userAdmin.php" tooltip-data="Manage the user accounts for your participants.">Participant Manager</a><br/>
                     <a href="userOutput.php" tooltip-data="View and download the results of your experiments.">View Results</a><br/>
                  </td>
               </tr>
            </table>
         </div>
      
      </div>
   </div>
   <script type="text/javascript">
      new mBox.Tooltip({
         setContent: 'tooltip-data',
         //pointer : 'top',
         position : {
            x : 'right',
            y : 'center'
         },
         attach : $$('*[tooltip-data]')
      });
   </script>
</body>


</html>
