<?php		
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once('assets/php/db_util.php');

   $username = $_SESSION['username'];
   // Check if dynamic resizing is requested
   $result = query_db('select * from t_user where User_ID=\''. $username .'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);
   $current_position = (int)$row['current_position'];
   $result = query_db('select * from t_experiments where ExperimentShortName=\''. $row['experiment'] .'\'');
   $row = mysql_fetch_array($result, MYSQL_BOTH);	
   $expstr = $row['ExperimentString'];
   $exparr = explode('$',$expstr);

   // Loop through each page
   for($i=0; $i<count($exparr);$i++)
   {
      // Loop though each page descriptor
      $properties = explode('&', $exparr[$i]);		
      for($j=0;$j < count($properties);$j++)
      {
         // Seperate descriptor and value
         $item = explode('=',$properties[$j]);
         $itemDescriptor = $item[0];
         $itemValue      = hexToStr($item[1]);		
         if(($itemDescriptor == 'type') && ($itemValue == 'dynamicSize'))
         {
            // Dynamic sizing found, read settings
            for($k=0;$k<count($properties);$k++)
            {
                  $item2 = explode('=',$properties[$k]);
               $settingDescriptor;				
               if($settingDescriptor == 'changeSize')
               {
                  $changeSize = $settingValue;
               }
               else if ($settingDescriptor == 'scaleX')
               {
                  $scaleX = $settingValue;
               }
               else if ($settingDescriptor == 'scaleY')
               {
                  $scaleY = $settingValue;
               }
            }
         // TODO : exit the loops
         }
      }
   }


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

   } else if (isset($_POST['skipStep'])) {

      $_SESSION['scaleW'] = $_POST['scaleW'] = 30;
      $_SESSION['scaleH'] = $_POST['scaleW'] = 30;
      $username = $_SESSION['username'];
      $width = $_SESSION['scaleW'];
      $height = $_SESSION['scaleH'];
      query_db("UPDATE t_user SET scaleW='$width', scaleH='$height' WHERE User_ID='$username';");
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
