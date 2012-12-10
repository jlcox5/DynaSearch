<?php

   require_once('assets/php/std_api.php');
   include("assets/php/config.php");
   include('assets/php/db_util.php');

   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "Manage Assets";
   $username = $_SESSION['username'];

   $template_style_array  = array("style.css");
   $template_script_array = array("ajax-core.js");


   // Extensible Settings:
   $assetSettings = array(
      array("AssetName" => "Images",
            "Extensions"=> array(),
            "MaxFileSize"=> 512)
   );


   $allAssets = array('Images', 'Tables', 'Other Objects', "Applets");


   function sanitize($string)
   {
      $match   = array("/\s+/", "/W+/");
      $replace = array("_",     ""    );
      $string  = preg_replace($match, $replace, $string);
      $string  = strtolower($string);
      return $string;
   }

   // Load User Asset Data  
   $assetBaseDir = "./admins/" . $username . "/assets/";
   $assets       = array();
   $assetDirs    = array();

   for ($i = 0; $i < count($allAssets); ++$i)
   {
      $assetTag       = sanitize($allAssets[$i]);
      $assets[$assetTag] = $allAssets[$i];
      $assetDirs[ $assetTag ] = $assetBaseDir . $assetTag;
   }

   for ($i = 0; $i < count($assetSettings); ++$i)
   {
      $assetTag       = sanitize($allAssets[$i]["AssetName"]);
      $assets[$assetTag] = $allAssets[$i];
      $assetDirs[ $assetTag ] = $assetBaseDir . $assetTag;
   }


   // Upload
   if( isset($_POST['upload']) )
   {

      if($_FILES["assetFile"]["error"] > 0)
      {
         echo "Error: " . $_FILES["assetFile"]["error"] . "<br>";;
      }
      else
      {
         echo "Upload: " . $_FILES["assetFile"]["name"] . "<br>";
         echo "Type: " . $_FILES["assetFile"]["type"] . "<br>";
         echo "Size: " . ($_FILES["assetFile"]["size"] / 1024) . " kB<br>";
         echo "Temp file: " . $_FILES["assetFile"]["tmp_name"] . "<br>";

         //if (file_exists())
         $assetType = $_POST['assetType'];
         $assetFilepath = $assetDirs[$assetType] . "/" . $_FILES["assetFile"]["name"];

         move_uploaded_file($_FILES["assetFile"]["tmp_name"],
                            $assetFilepath);
         echo "Stored in: " . $assetFilepath . "<br>";

      }
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
      foreach($assets as $key => $value)
      {
         echo '<td style="padding:10px;">' . 
                 '<h2>' . $value . '</h2>';

         if($handle = @opendir($assetDirs[ $key ]))
         {
            // Asset Directory exists, load all files
            $assetOptions = '';
            $assetOptionCount = 0;
            while(false !== ($file = readdir($handle)))
            {
               if($file !== '.' && $file !== '..')
               {
                  $assetOptions = $assetOptions.'<option value="'.$file.'">'.$file.'</option>';
                  ++$assetOptionCount;
               }
            }
         }
         else
         {
            // Asset Directory must be made
            echo "Made Directory : " . $assetDirs[ $key ];
            mkdir($assetDirs[ $key ], 0777, true);
         }

         if ($assetOptionCount > 0)
         {
            echo '<select name="'.$key.'Select" size="'.($assetOptionCount + 1).'">' . 
                    $assetOptions .
                 '</select>';
         }
         else
         {
            echo 'No Assets Uploaded';
         }

         echo '</td>';
      }

   ?>
         <br/>
         <br/>

         <!-- Upload Form --> 
         <form action="adminAssets.php" method="post" enctype="multipart/form-data">
            <label for="assetFile">Asset : </label>
            <input type="file" name="assetFile" required="required" />
            <br/>

            <label for="assetType">Asset Type : </label>
            <select name="assetType">
   <?php 
      foreach($assets as $key => $value)
      {
         echo '<option value="'.$key.'">'.$value .'</option>';
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
