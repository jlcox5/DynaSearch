<?php
   require_once('assets/php/std_api.php');
   require_once('assets/php/config.php');
   require_once('assets/php/db_util.php');
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
   

   // Fonts
   echo "<link href='http://fonts.googleapis.com/css?family=Josefin+Sans:300,400,700' rel='stylesheet' type='text/css'>";

   // Input every templated CSS file
   if(isset($template_style_array))
   {
      foreach($template_style_array as $style)
      {
         echo '<link href="assets/style/'. $style  .'" rel="stylesheet" type="text/css">';
      }
   }

   echo '<link href="assets/style/style.css" rel="stylesheet" type="text/css">';
   

   // Everyone gets mootools. It's awesome like that.
   echo '<script type="text/javascript" src="assets/scripts/mootools-1.4.5-core.js"></script>
         <script type="text/javascript" src="assets/scripts/mootools-more-1.4.0.1.js"></script>

         <script>
            function handleExit(){ 
               switch("'.$page_title.'"){
                  case "Editor":
                     //if(confirm("Would you like to save your changes?"))
                        //save_all();
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
          </script>';
   
   if(isset($_SESSION['logged_in']))
   {
      if($_SESSION['logged_in'] == 'true')
      {

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
         $expuserpage_str = '';
         $logout_str = '<li>' . $_SESSION['full_name'] . '<ul>';

         if( $_SESSION['UserType'] == 'A' ){
            $useradmin_str = '<li>My Account'
                           .    '<ul>'
                           .       '<li><a href="admin.php" onclick="handleExit();">Home</a></li>'
                           .       '<li><a href="custom_editor.php" onclick="handleExit();">Custom Page Editor</a></li>'
                           .       '<li><a href="questEditor.php" onclick="handleExit();">Questionaire Editor</a></li>'
                           .       '<li><a href="survey_setup.php" onclick="handleExit();">Experiment Builder</a></li>'
                           .       '<li><a href="adminAssets.php" onclick="handleExit();">My Assets</a></li>'
                           .       '<li><a href="userAdmin.php" onclick="handleExit();">My Participants</a></li>'
                           .       '<li><a href="userOutput.php" onclick="handleExit();">Participant Results</a></li>'
                           .    '</ul>'
                           . '</li>';

            $logout_str .= '<li><a href="adminSettings.php" onclick="handleExit();">Settings</a></li>';
         }
         else
         {
            $useradmin_str = '<li>[User]<ul><li><a href="" onclick="openHelpFrame();return false;">Help</a></li></ul></li>';

            //$expuserpage_str = '<li>[Page]'
             //                . '   <ul>';

      /*$pagename = hexToStr( getExpPageProperty(0,'type') );
      $expuserpage_str = $expuserpage_str
                       . '      <li><a href="' . '" onclick="handleExit();">' . $pagename . '</a></li>';

      $expuserpage_str = $expuserpage_str
                       . '   </ul>'
                       . '</li>';*/

   }
   $logout_str .= '<li><a href="assets/php/user.php?logout=1" onclick="handleExit();">Logout</a></li></ul></li>';

   $help_frame_html = '<div><a id="help_frame_exit_button" href="" onclick="closeHelpFrame();return false;">[close]</img><iframe id="help_frame_inner" src="UserManual.pdf"/></div>';
   echo'
   <script type="text/javascript">
   window.addEvent(\'domready\',function(){
      var user_nav = new Element("div");
      user_nav.setAttribute("class","user_nav_div");
      user_nav.innerHTML = \'<ul>' . $expuserpage_str . $useradmin_str . $logout_str . '</ul>\';
      document.body.adopt(user_nav);

      var help_frame = new Element("div");
      help_frame.setAttribute("class","help_frame_invisible");
      help_frame.setAttribute("id","help_frame");
      help_frame.innerHTML = \''.$help_frame_html.'\';
      document.body.adopt(help_frame);
   });
   </script>
   ';
   }}
   
   // Input every templated javascript file
   if(isset($template_script_array))
      foreach($template_script_array as $script)
         echo '<script type="text/javascript" src="assets/scripts/' . $script . '"></script>';
   
   echo '<title>'. $page_title .'</title>
   <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">

   </head>
   ';
   
  /* function addDomAttributes( $dom, $el, $attrs )
   {
      foreach ( $attrs as $key => $value )
      {
         $attribute = $dom->createAttribute( $key );
         $attribute->value = $value;
         $el->appendChild( $attribute );
      }
   }
   
   $dom = new DOMDocument( '1.0' );
   //echo "<link href='http://fonts.googleapis.com/css?family=Josefin+Sans:300,400,700' rel='stylesheet' type='text/css'>";

   $head = $dom->createElement('head');
   
   $font = $dom->createElement('link');
   addDomAttributes( $dom, $font, Array( 'href' => 'http://fonts.googleapis.com/css?family=Josefin+Sans:300,400,700', 'rel' => 'stylesheet', 'type' => 'text/css') );
   
   // Input every templated CSS file
   if ( isset($template_style_array) )
   {
      foreach($template_style_array as $file)
      {
         $style = $dom->createElement('link');
         addDomAttributes(
            $dom,
            $style,
            Array(
               'href' => 'assets/style/' . $file, 
               'rel'  => 'stylesheet',
               'type' => 'text/css'
            )
         );
      }
   }
   
   $dom->appendChild( $head );*/
   //echo $dom->saveHTML();
   
?>
