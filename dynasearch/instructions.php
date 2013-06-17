<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   
   // Create empty error log for the page
   $_SESSION['log'] = Array();
   
   // Are we supposed to be here?
   if(isset($_SESSION['page_sig'])) {
   	if($_SESSION['page_sig'] != 'instructions.php') {
		redirect('assets/php/user.php?logout=true');
	}
   }
   else
   {
   	redirect('assets/php/user.php?logout=true');
   }
   
	// Main Variables
	$username = $_SESSION['username'];
   $admin    = $_SESSION['userAdmin'];
	
	// Get our current page.
	$result = query_db('select * from t_user where User_ID=\''. $username .'\'');
	$row = mysql_fetch_array($result, MYSQL_BOTH);
	$current_position = $row['current_position'];
   
   // Get Experiment Data
   $expData     = $_SESSION['expData'];
   $expPageData = $expData[ $current_position - 1 ];
   $pageSource  = $expPageData['source'];
   $pageTitle   = $expPageData['title'];
   //$pageContent = '';
   
   // Load Instruction File
   $adminAssetDir = getAdminBaseDir($admin) . 'assets/';
   $filename      = $adminAssetDir . $pageSource;
   // '@' character supresses warnings if source not found
   $pageContent   = @file_get_contents( $filename );
   
   $page_title = "DynaSearch";

   $template_style_array  = array("style.css");
   $template_script_array = array();
 
   include('assets/php/standard.php');
   
   
?>


<body>
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
         <!-- Title -->
         <h1><?php echo $pageTitle; ?></h1>
    	   <br/>
         
         <!-- Content -->
         <?php
            if ( $pageContent )
            {
               echo $pageContent;
            }
            else
            {
               echo 'Uh oh! There seems to have been a problem... (Source file not found)<br/>' .
                    'Try <a onclick="location.reload()">reloading</a> the page.<br/>' .
                    'If the problem persists, please contact your experiment administrator.<br/>';
               exit;
            }
         ?>
    	   <br/>
         
         <!-- Content -->
		   <form action="advance.php" method="post" >
		      <input name="advance" style="visibility:hidden;" value="true"/>
		      <button type="submit">Continue</button>
		   </form>
      </div>
       
   </div>
</body>
</html>
