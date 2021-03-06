<?php
   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');
   
   // Create empty error log for the page
   $_SESSION['log'] = Array();

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Assets";
   $username = $_SESSION['username'];

   $template_style_array  = array("themes/mBoxTooltip-Black.css", "themes/mBoxTooltip-BlackGradient.css", "admin_assets.css");
   $template_script_array = array(/*"ajax-core.js",*/ "mBox.All.min.js", "admin_assets.js");

   include('assets/php/admin_dir.php');

   if( isset($_GET['assetType']) )
   {
      $assetType = $_GET['assetType'];
   }
   else
   {
      $assetType = '';
   }

   // Set Directory - Added by Jon 21JAN13
   //$assetBaseDir = "./admins/" . $username . "/assets/"; // Shouldn't need to redeclare?
   // Upload
   if( isset($_POST['upload']) )
   {
//echo "here";
      if( $_FILES["assetFile"]["error"] > 0 )
      {
      echo 'hello';
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
         
         echo 'Admin Dir Size : ' . $adminDirSize . '<br/>' .
              'File Size      : ' . ($_FILES["assetFile"]["size"]) . '<br/>' .
              'Admin Max Size : ' . $adminMaxSize . '<br/>';
         
         if ( ($adminDirSize + $_FILES["assetFile"]["size"]) <= $adminMaxSize) {
            move_uploaded_file($_FILES["assetFile"]["tmp_name"],
                            $assetFilepath);
         } else {
            echo 'over cap';
         }
       
         

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
         redirect('admin_assets.php#' . $assetType);
      }
   }
   
   // Delete Asset
   if( isset($_POST['delete']) && isset($_POST['asset']))
   {
      $assetName = $_POST['asset'];
      $assetType = $_POST['assetType'];
/**/
      $assetFile = $assetBaseDir . $assetName;
      $fh = fopen($assetFile, 'w') or die("can't open file");
      fclose($fh);
      unlink($assetFile);
      redirect('admin_assets.php#' . $assetType);
   }

   include('assets/php/standard.php');
?>

<body id="body">
<?php
//echo '<script type="text/javascript">assetDir = "' . $assetBaseDir . '";</script>';
?>
   <div id="maincontainer">
      <div id="wrapper" style="width:70%; margin: auto auto;">
   
         <!-- Capacity Info-->
         <div class="rounded-box allocation-info">
   <?php 
      //$adminMaxSize = 1048576;

      //echo '<h3>My Allocation</h3>';

      echo fileSizeStr($adminDirSize) . ' of ' . fileSizeStr($adminMaxSize) . '<br/>' .
           ' (' . fileSizeStr($adminMaxSize - $adminDirSize) . ' remaining) <br/>';

      $percentUsed = $adminDirSize / $adminMaxSize * 100.0;

      echo '<div class="capacity-bar">' .
              '<div class="capacity-full" style="width:' . $percentUsed . '%;"></div>' .
           '</div>';

      echo number_format($percentUsed, 1) . '% Used ';

   ?>
         </div>

         <h1>My Assets</h1>
         <div style="clear:both;"></div>

         <!-- Asset Viewer -->
   <?php 
      echo '<div id="accordion">';

      $currentSlice = -1;

      // I added the minus 1 because training pages should never be uploaded, always created through the editor.  If this ever changes,
	  // then it can be removed.  - Jon 22JAN13
      for($i = 0; $i < count($assets); $i++)
      {
         $currAsset = &$assets[$i];

         echo '<div hash-link="#' . $currAsset["Tag"] . '" class="toggle">' . $currAsset["Name"] . '</div>' .
              '<div class="content">'. 
                 '<form class="asset-panel" method="post">';
         if( $currAsset["Tag"] == $assetType )
         {
            $currentSlice = $i;
         }

         $assetOptions = &$currAsset["Options"];
         $assetOptionCount = count($assetOptions);
         
         //echo '<div class="asset-manager">';

         // Create Control Panl with asset list
         echo '<div class="control-pane">';
         
         echo '<select class="asset-list" id="' . $currAsset["Tag"] .'Select" ' .
                         'name="asset" size="' . ( $assetOptionCount + 2) . '" >';
            
         foreach($assetOptions as $key => $value)
         {
            $selected = '';
            //if ($key == $pId)
            //{
            //   $selected = 'selected="selected"';
            //}
            //else
            //{
            //   $selected = '';
            //}

            echo '<option value="' . $key . '" ' . $selected . '>' .
                    $value .
                 '</option>';
         }
         echo '</select>';
         echo '<br/>';

         // Control Buttons
         echo '<input type="button" value="Upload" onclick="uploadAsset(\'' . $currAsset["Tag"] . '\');"> ';
         echo '<input type="button" value="Preview" onclick="previewAsset(\'' . $currAsset["Tag"] . '\');"> ';
         echo '<input type="submit" name="delete" value="Delete" onclick="return confirmDelete();">';

         echo '</div>';

         // Create Preview Pane
         echo '<div class="preview-pane">';

         echo '<input type="text" name="assetType" value="' . $currAsset["Tag"] . '" style="display:none;"/>';
         echo '<input type="text" id="' . $currAsset["Tag"] . 'SelectedAsset" name="selectedAsset" style="display:none;"/>';
         
         echo '<div class="preview-box rounded-box">';
         if($currAsset["Tag"] != 'images') {
         
            // Buttons
            echo '<div style="display:table-row;">';
            echo '<input type="button" value="New" ' .
                        'onclick="newAsset(\'' . $currAsset["Tag"] . '\');" /> ' .
                 '<input type="button" id="' . $currAsset["Tag"] . 'SaveBtn" value="Save" ' .
                        'onclick="saveAsset(\'' . $currAsset["Tag"] . '\');" disabled="disabled" /> ';
            echo '<input type="button" id="' . $currAsset["Tag"] . 'SaveAsBtn"value="Save As.." ' .
                        'onclick="saveAssetAs(\'' . $currAsset["Tag"] . '\');" disabled="disabled">';
                        
            // Details
            echo '<h3>File Name : <span id="' . $currAsset["Tag"] . 'FileName"></span></h3>';
            echo '<h3>File Size : <span id="' . $currAsset["Tag"] . 'FileSize"></span></h3>';
            echo '</div>';
                        
            echo '<div style="display:table-cell; height:100%;">';
            echo '<textarea id="' . $currAsset["Tag"] . 'Preview" class="text-preview" disabled="disabled"></textarea>';
            echo '</div>';
         }
         else
         {
            // Details
            echo '<div style="display:table-row;">';  
            echo '<h3>File Name : <span id="' . $currAsset["Tag"] . 'FileName"></span></h3>';
            echo '<h3>File Size : <span id="' . $currAsset["Tag"] . 'FileSize"></span></h3>';
            echo '</div>';
         
            //echo '<div style="height:100%;">';
            echo '<img id="' . $currAsset["Tag"] . 'Preview" class="img-preview"></img>';
            //echo '</div>';
         }
         echo '</div>';
         echo '</div>';

         
         echo '</form>';
         echo '</div>';
         
         /*
         if ( $assetOptionCount > 0)
         {


            echo '<div class="asset-manager">';

            echo '<div class="control-pane">';
            echo '<select class="asset-list" id="' . $currAsset["Tag"] .'Select" ' .
                         'name="asset" size="'.($assetOptionCount + 1).'" >';
            
            foreach($assetOptions as $key => $value)
            {
            $selected = '';
               //if ($key == $pId)
               //{
               //   $selected = 'selected="selected"';
               //}
               //else
               //{
               //   $selected = '';
               //}

               echo '<option value="' . $key . '" ' . $selected . '>' .
                       $value . ' (' . $key . ')' .
                    '</option>';
            }
            
            //for ($j = 0; $j < $assetOptionCount; $j++)
            //{
            //   echo $assetOptions[$j];
            //}
            echo '</select>';

            echo '<br/>';



            // File Info
            echo '<h3>File Size : <span id="' . $currAsset["Tag"] . 'FileSize"></span></h3>';

            // Control Buttons
            echo '<input type="button" value="Upload" onclick="uploadAsset(\'' . $currAsset["Tag"] . '\');"> ';
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
echo '<input type="text" name="assetType" value="' . $currAsset["Tag"] . '" style="display:none;"/>';
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
              */
      }

      //echo '</div>';

      echo '<script type="text/javascript">assetDir = "' . $assetBaseDir . '"; CURRENT_SLICE = ' . $currentSlice . ';</script>';

   ?>


         <!-- Upload Form
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
      for($i = 0; $i < count($assets); $i++)
      {
         $currAsset = &$assets[$i];
         echo '<option value="'. $currAsset["Tag"] .'">'. $currAsset["Name"] .'</option>';
      }
   ?>
            </select>
            <br/>

            <input type="submit" name="upload" value="Upload">
         </form>
 --> 

         <!-- Upload Form --> 
         <form id="uploadForm" method="post" enctype="multipart/form-data" style="display:none;">
            <input id="assetFile" type="file" name="assetFile" required="required" onchange="$('upload').click();" />
            <input id="assetType" type="text" name="assetType" />
            <input id="upload" type="submit" name="upload" value="Upload">
         </form>


      </div>
   </div>
   
</body>
</html>
