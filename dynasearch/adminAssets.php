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

      if( $_FILES["assetFile"]["error"] > 0 )
      {
        if( $DEBUG )
         {
            echo "Error: " . $_FILES["assetFile"]["error"] . "<br>";
         }
      }
      else
      {


         //if (file_exists())
         $assetType = $_POST['assetType'];
		 // Modified by Jon 21JAN13
         //$assetFilepath = $assetDirs[$assetType] . "/" . $_FILES["assetFile"]["name"];
		 $assetFilepath =  $assetBaseDir . $assetType . "/" . $_FILES["assetFile"]["name"];

         move_uploaded_file($_FILES["assetFile"]["tmp_name"],
                            $assetFilepath);

         if( $DEBUG )
         {
            echo "Upload: " . $_FILES["assetFile"]["name"] . "<br>";
            echo "Type: " . $_FILES["assetFile"]["type"] . "<br>";
            echo "Size: " . ($_FILES["assetFile"]["size"] / 1024) . " kB<br>";
            echo "Temp file: " . $_FILES["assetFile"]["tmp_name"] . "<br>";
            echo "Stored in: " . $assetFilepath . "<br>";
         }

      }

      if( ! $DEBUG )
      {
         // Added so assets automatically show in list after uploaded.  Need to comment out for debugging. - Jon 22JAN13
         redirect('adminAssets.php');
      }
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
<?php
echo '<script type="text/javascript">assetDir = "' . $assetBaseDir . '";</script>';
?>
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <h1>Manage Assets</h1><br/>
         <br/>

         <!-- Asset Viewer -->
   <?php 
      echo '<div id="accordion">';
      // I added the minus 1 because training pages should never be uploaded, always created through the editor.  If this ever changes,
	  // then it can be removed.  - Jon 22JAN13
      for($i = 0; $i < count($assets)-1; $i++)
      {
         $currAsset = &$assets[$i];

         echo '<h2>' . $currAsset["Name"] . '</h2>' .
              '<div class="content">'. 
                 '<form class="asset-panel" action="adminAssets.php" method="post">';


         $assetOptions = &$currAsset["Options"];
         $assetOptionCount = count($assetOptions);
         if ( $assetOptionCount > 0)
         {


            echo '<div class="asset-manager">';

            echo '<div class="control-pane">';
            echo '<select class="asset-list" id="' . $currAsset["Tag"] .'Select" ' .
                         'name="asset" size="'.($assetOptionCount + 1).'" >';
            for ($j = 0; $j < $assetOptionCount; $j++)
            {
               echo $assetOptions[$j];
            }
            echo '</select>';

            echo '<br/>';



            // File Info
            echo '<h3>File Size : <span id="' . $currAsset["Tag"] . 'FileSize"></span></h3>';

            // Control Buttons
            echo '<input type="button" value="Preview" onclick="previewAsset(\'' . $currAsset["Tag"] . '\');"> ';
            echo '<input type="submit" name="delete" value="Delete" onclick="return confirmDelete();">';

            if($currAsset["Tag"] != 'images') {

               echo '<br/>' .
                    '<input type="button" value="New" ' .
                           'onclick="newAsset(\'' . $currAsset["Tag"] . '\');" /> ' .
                    '<input type="button" id="' . $currAsset["Tag"] . 'SaveBtn" value="Save" ' .
                           'onclick="saveAsset(\'' . $currAsset["Tag"] . '\');" disabled="disabled" /> ';
               echo '<input type="button" id="' . $currAsset["Tag"] . 'SaveAsBtn"value="Save As.." ' .
                           'onclick="saveAssetAs(\'' . $currAsset["Tag"] . '\');" disabled="disabled">';
            }


echo '</div>';


echo '<div class="preview-pane">';
echo '<input type="text" id="' . $currAsset["Tag"] . 'SelectedAsset" name="selectedAsset" style="display:none;"/>';

if($currAsset["Tag"] == 'images') {
echo '<img id="' . $currAsset["Tag"] . 'Preview" class="img-preview"></img>';
}
else
{
echo '<textarea id="' . $currAsset["Tag"] . 'Preview" class="text-preview" disabled="disabled"></textarea>';
}
echo '</div>';

echo '</div>';

         }
         else
         {
            echo 'No Assets Uploaded';
         }

         echo    '</form>' .
              '</div>';
      }

      echo '</div>';
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

         <!-- Capacity Info-->
         <div class="allocation-info">
   <?php 
      $adminMaxSize = 1048576;

      echo '<h3>My Allocation</h3>';

      echo fileSizeStr($adminDirSize) . ' of ' . fileSizeStr($adminMaxSize) . '<br/>' .
           ' (' . fileSizeStr($adminMaxSize - $adminDirSize) . ' remaining) <br/>';

      $percentUsed = $adminDirSize / $adminMaxSize * 100.0;

      echo '<div class="capacity-bar">' .
              '<div class="capacity-full" style="width:' . $percentUsed . '%;"></div>' .
           '</div>';

      echo number_format($percentUsed, 1) . '% Used ';

   ?>
         </div>

      </div>
   </div>
   
</body>
</html>
