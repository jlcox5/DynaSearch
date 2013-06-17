<?php		
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once('assets/php/db_util.php');
   
   // Create empty error log for the page
   $_SESSION['log'] = Array();

   $username = $_SESSION['username'];
   $adminId  = $_SESSION['userAdmin'];

/*
   if( $_SESSION['customScaling'] == false )
   {
      $_POST['scaleW'] = 1.0;
      $_POST['scaleH'] = 1.0;
   }
*/

   //if( $username == $adminId ) { echo "test post"; }
/*
   if( ($_SESSION['scaleW'] != -1.0) && ($_SESSION['scaleH'] != -1.0) )
   {
      $_POST['scaleW'] = $_SESSION['scaleW'];
      $_POST['scaleH'] = $_SESSION['scaleH'];
   }
*/

//echo       $_POST['scaleH'];
   if( isset($_POST['scaleW']) && isset($_POST['scaleH']) )
   {

      $width = $_SESSION['scaleW'] = $_POST['scaleW'];
      $height = $_SESSION['scaleH'] = $_POST['scaleH'];
	 
      //$query = "UPDATE t_user SET scaleW='$width', scaleH='$height' WHERE User_ID='$username';";
      //query_db($query);
      if( $username == $adminId ) {
         $profileName = $_POST['profileName'];
         $query = "INSERT INTO t_scale_profiles " .
                  "(Admin_ID, Name, ScaleW, ScaleH) VALUES " . 
                  "('$adminId', '$profileName', $width, $height);";
         if( $DEBUG ) { echo $query; }
         query_db($query);

         redirect('adminSettings.php');
         exit;
      }
      else
      {
         redirect('director.php');
         exit;
      } 
   }
   
   $page_title = "Size Registration Page";
   $template_style_array  = array("style.css", "resizeTest.css");
   $template_script_array = array("dollarBill.js");
   include('assets/php/standard.php');
?>

<body>
   <div id="maincontainer">
      <center><h1>DynaSearch Size Registration</h1></center>
      <br/>
         <table id="two_column_opening"> <!-- Begin main page columns  -->
            <td width="50%">
               Please slide the picture until it matches the size of a real life ID card (for example, a credit card or drivers license).

               <form id="configSize" name="configSize" method="post" action="sizeReg.php">
                  <table>
                     <tr><img id="resizable1" name="resizable1" class="resize" src="assets/images/card.jpg"></img></tr>
                     <tr><td id="numbers"></td></tr>
                     <tr><td><input type="hidden" id="scaleW" name="scaleW" value=55 /></td></tr>
                     <tr><td><input type="hidden" id="scaleH" name="scaleH" value=55 /></td></tr>

<?php
      if( $username == $adminId ) {
         echo '<tr><td>Profile Name : <input type="text" name="profileName" required="required" /></td></tr>';
      }
      else
      {
         //redirect('advance.php');
      }
?>

                     <tr>
                        <td>
                           <input type="submit" id="setSize" name="setSize" value="Set Size" />
                        </td>
                     </tr>
                  </table>
               </form>
               <br/> <br/>
   
            </td>
         </table> <!-- End main page columns  -->
   </div>
</body>
</html>
