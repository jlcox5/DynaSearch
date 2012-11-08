<?php		
   include("assets/php/config.php");
   include("assets/php/std_api.php");
	require_once('assets/php/db_util.php');

   if(isset($_POST['setSize'])){
	  if(isset($_POST['scaleW']) && isset($_POST['scaleH'])){
	     $_SESSION['scaleW'] = $_POST['scaleW'];
	     $_SESSION['scaleH'] = $_POST['scaleH'];
	     $username = $_SESSION['username'];
	     $width = $_SESSION['scaleW'];
	     $height = $_SESSION['scaleH'];
		 
		 // Crazy values?
//		if((int)$width < 1) { $width = (string)1; }
//		if((int)$height < 1) { $height = (string)1; }
		 
	     query_db("UPDATE t_user SET scaleW='$width', scaleH='$height' WHERE User_ID='$username';");
	  }
	  /* Redirect to a different page in the current directory that was requested */
	  redirect("advance.php");
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

               <form id="configSize" name="configSize" method="post" action="director.php">
                  <table>
                     <tr><img id="resizable1" name="resizable1" class="resize" src="assets/images/card.jpg"></></tr>
                     <tr><td id="numbers">55</td></tr>
                     <tr><td><input type="hidden" id="scaleW" name="scaleW" value=55 /></td></tr>
                     <tr><td><input type="hidden" id="scaleH" name="scaleH" value=55 /></td></tr>
                     <tr><td><input type="submit" id="setSize" name="setSize" value="Set Size" /></td></tr>
                  </table>
               </form>
               <br/> <br/>
   
            </td>
         </table> <!-- End main page columns  -->
   </div>
</body>
</html>
