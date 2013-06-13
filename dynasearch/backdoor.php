<?php

   include("assets/php/config.php");
   include("assets/php/std_api.php");
   
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "backdoor";

   $template_style_array  = array("style.css");
   $template_script_array = array("ajax-core.js");


   /*$username       = $_SESSION['username'];
   $expId          = ifSetElse( $_REQUEST['expId'], -1 );
   $expName        = ifSetElse( $_REQUEST['expName'] );
   $expString      = ifSetElse( $_REQUEST['expData'] );
   $scaleProfileId = ifSetElse( $_REQUEST['scaleProfileId'], -1 );*/

   $op = ifSetElse( $_REQUEST['fileop'] );   
   switch ( $op )
   {
      case 'operation' :

       break;

      default :
        break;
   }

   include('assets/php/standard.php');

?>

<body id="body">
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>the backdoor</h1>
         <br/>
         <br/>
         
         <!-- Create Administrator 
         <form>
            <input type="text" name="email" placeholder="Email">
            <input type="text" name="email" placeholder="Email">
            <input type="text" name="op" placeholder="add admin">
         </form>-->
         <br/>
         
         <div class="accordion" id="accordion">

            <!-- Bug List -->
            <div class="toggle">bugs</div>
            <div class="content">
            
               <ol>
                  <li>1st Bug</li>
                  <li>2nd Bug</li>
               </ol>

            </div>
         </div>

      </div>
   </div>
</body>
   <script type="text/javascript">
      window.addEvent(
         'domready',
         function() {

            var myAccordion = new Fx.Accordion($('accordion'), '.toggle', '.content', {
               alwaysHide : true,
		         opacity: false,
		         onActive: function(toggler, element){
			         //toggler.setStyle('color', '#1464DE');
		         },
		         onBackground: function(toggler, element){
			         //toggler.setStyle('color', '#28CE0A');
		         }
	         });
         }
      );
   </script>
</html>
