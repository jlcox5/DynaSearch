<?php
	require_once('assets/php/std_api.php');
	require_once('assets/php/config.php');
	//require_once('assets/php/checkPage.php');

	if(!isset($no_login_required))
	{
		// Check to see if they're logged in.
		if(isset($_SESSION['logged_in']))
		{
			if($_SESSION['logged_in'] != 'true'){
				redirect('login.php');
			}
		}
		else
		{
		    redirect('login.php');
		}
	}
		
		
	echo '
	<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
	"http://www.w3.org/TR/html4/loose.dtd">
	<html>
	<head>';
	
	// Input every templated CSS file
	if(isset($template_style_array))
		foreach($template_style_array as $style)
			echo '<link href="assets/style/'. $style  .'" rel="stylesheet" type="text/css">';
	
	echo '<link href="assets/style/style.css" rel="stylesheet" type="text/css">';
	
	// Everyone gets mootools. It's awesome like that.
	echo'
    <script type="text/javascript" src="assets/scripts/mootools-1.2.2-core.js"></script>
	<script type="text/javascript" src="assets/scripts/mootools-1.2.2.2-more.js"></script>

   <script>
      function handleExit(){ 
         switch("'.$page_title.'"){
            case "Editor":
               if(confirm("Would you like to save your changes?"))
                  save_all();
               break;
         }
      }

      function closeHelpFrame(){
         helpframe = document.getElementById("help_frame");
         helpframe.setAttribute("class","help_frame_invisible");
      }
      function openHelpFrame(){
         helpframe = document.getElementById("help_frame");
         helpframe.setAttribute("class","help_frame_visible");
      }
      function alertPlaceHolder(){
         alert("Sorry, not implemented yet.");
      }
   </script>
   
   ';
	
	if(isset($_SESSION['logged_in'])) {
	if($_SESSION['logged_in'] == 'true') {

	//echo'

      /*
	<script type="text/javascript">
	window.addEvent(\'domready\', function(){
		var user_bar = new Element("div");
		user_bar.setAttribute("class","user_bar_div");
		user_bar.innerHTML = \'<a href="assets/php/user.php?logout=1" style="color:#fff;">You are currently logged in as '. $_SESSION['full_name'] .'. Click Here to Logout...</a>\';
		document.body.adopt(user_bar);
	});
   */
   $useradmin_str;
   if( $_SESSION['User_Type'] == 'A' ){
      $useradmin_str = '<li>[Admin]<ul><li><a href="admin.php" onclick="handleExit();">Admin Page</a></li>'
                     .                '<li><a href="editor.php" onclick="handleExit();">--Training Page Editor</a></li>'
                     .                '<li><a href="questEditor.php" onclick="handleExit();">--Questionaire Editor</a></li>'
                     .                '<li><a href="randQuestEditor.php" onclick="handleExit();">--Questionaire Catalog</a></li>'
                     .                '<li><a href="questDisplay.php" onclick="handleExit();">--Questionaire Viewer</a></li>'
                     .                '<li><a href="survey_setup.php" onclick="handleExit();">--Experiment Editor</a></li>'
                     .           '</ul></li>';
   }else{
      $useradmin_str = '<li>[User]<ul><li><a href="" onclick="openHelpFrame();return false;">Help</a></li></ul></li>';
   }
   $logout_str = '<li>' . $_SESSION['username'] . '<ul><li><a href="assets/php/user.php?logout=1" onclick="handleExit();">Logout</a></li></ul></li>';

   $help_frame_html = '<div><a id="help_frame_exit_button" href="" onclick="closeHelpFrame();return false;">[close]</img><iframe id="help_frame_inner" src="UserManual.pdf"/></div>';
	echo'
	<script type="text/javascript">
   window.addEvent(\'domready\',function(){
      var user_nav = new Element("div");
      user_nav.setAttribute("class","user_nav_div");
      user_nav.innerHTML = \'<ul>' . $useradmin_str . $logout_str . '</ul>\';
		document.body.adopt(user_nav);

      var help_frame = new Element("div");
      help_frame.setAttribute("class","help_frame_invisible");
      help_frame.setAttribute("id","help_frame");
      help_frame.innerHTML = \''.$help_frame_html.'\';
      document.body.adopt(help_frame);
   });
	</script>
	';
   //OLD: user_nav.innerHTML = \'<ul> <li>foo<ul><li><a>foo1</a></li><li><a>foo2</a></li><li><a>foo3</a></li></ul></li> <li>bar<ul><li><a>bar1</a></li><li><a>bar2</a></li></ul></li> </ul>\';
	}}
	
	// Input every templated javascript file
	if(isset($template_script_array))
		foreach($template_script_array as $script)
			echo '<script type="text/javascript" src="assets/scripts/' . $script . '"></script>';
	
	echo '<title>'. $page_title .'</title>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

	</head>
	';
	
?>
