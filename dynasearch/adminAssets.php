<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Assets";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css", "adminAssets.css");
   $template_script_array = array("ajax-core.js", "adminAssets.js");

   include('assets/php/admin_dir.php');
   
   // Set Directory - Added by Jon 21JAN13
   //$assetBaseDir = "./admins/" . $username . "/assets/"; // Shouldn't need to redeclare?

   // Upload
   if( isset($_POST['upload']) )
   {

      if($_FILES["assetFile"]["error"] > 0)
      {
         //echo "Error: " . $_FILES["assetFile"]["error"] . "<br>";
      }
      else
      {
         //echo "Upload: " . $_FILES["assetFile"]["name"] . "<br>";
         //echo "Type: " . $_FILES["assetFile"]["type"] . "<br>";
         //echo "Size: " . ($_FILES["assetFile"]["size"] / 1024) . " kB<br>";
         //echo "Temp file: " . $_FILES["assetFile"]["tmp_name"] . "<br>";

         //if (file_exists())
         $assetType = $_POST['assetType'];
		 // Modified by Jon 21JAN13
         //$assetFilepath = $assetDirs[$assetType] . "/" . $_FILES["assetFile"]["name"];
		 $assetFilepath =  $assetBaseDir . $assetType . "/" . $_FILES["assetFile"]["name"];

         move_uploaded_file($_FILES["assetFile"]["tmp_name"],
                            $assetFilepath);
         //echo "Stored in: " . $assetFilepath . "<br>";

      }
	  // Added so assets automatically show in list after uploaded.  Need to comment out for debugging. - Jon 22JAN13
	  redirect('adminAssets.php');
   }
   
   // Delete Asset
   if( isset($_POST['delete']) && isset($_POST['asset']))
   {
      $assetName = $_POST['asset'];

      $assetFile = $assetBaseDir . $assetName;
      $fh = fopen($assetFile, 'w') or die("can't open file");
      fclose($fh);
      unlink($assetFile);
      redirect('adminAssets.php');
   }

   include('assets/php/standard.php');
?>

<body id="body">
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Manage Assets</h1><br/>
         <br/>

         <!-- Asset Lists -->
   <?php 
      echo '<table>';
      // I added the minus 1 because training pages should never be uploaded, always created through the editor.  If this ever changes,
	  // then it can be removed.  - Jon 22JAN13
      for($i = 0; $i < count($assets)-1; $i++)
      {
         $currAsset = &$assets[$i];

         echo '<td style="padding:10px;">' . 
                 '<form action="adminAssets.php" method="post">' .
                    '<h2>' . $currAsset["Name"] . '</h2>';

         $assetOptions = &$currAsset["Options"];
         $assetOptionCount = count($assetOptions);
         if ( $assetOptionCount > 0)
         {
            echo '<select name="asset" size="'.($assetOptionCount + 1).'">';
            for ($j = 0; $j < $assetOptionCount; $j++)
            {
               echo $assetOptions[$j];
            }
            echo '</select>';


            // Delete Button
            echo '<input type="submit" name="delete" value="Delete" onclick="return confirmDelete();">';
         }
         else
         {
            echo 'No Assets Uploaded';
         }
         echo    '</form>' .
              '</td>';
      }

      echo '</table>';
   ?>
         <br/>
         <br/>

         <!-- Upload Form --> 
         <form class="form-bordered" action="adminAssets.php" method="post" enctype="multipart/form-data">
            <span class="form-label">Upload Assets</span>
<br/>
            <label for="assetFile">Asset : </label>
            <input type="file" name="assetFile" required="required" />
            <br/>

            <label for="assetType">Asset Type : </label>
            <select name="assetType">
   <?php 
   
      // I added the minus 1 because training pages should never be uploaded, always created through the editor.  If this ever changes,
	  // then it can be removed.  - Jon 22JAN13
      for($i = 0; $i < count($assets)-1; $i++)
      {
         $currAsset = &$assets[$i];
         echo '<option value="'. $currAsset["Tag"] .'">'. $currAsset["Name"] .'</option>';
      }
   ?>
            </select>
            <br/>

            <input type="submit" name="upload" value="Upload">
         </form>
      </div>
   </div>
   
</body>
</html>
