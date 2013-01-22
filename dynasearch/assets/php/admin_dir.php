<?php

   /**
    *
    */
   function sanitize($string)
   {
      $match   = array("/\s+/", "/W+/");
      $replace = array("_",     ""    );
      $string  = preg_replace($match, $replace, $string);
      $string  = strtolower($string);
      return $string;
   }


   // Extensible Settings:
   $assets = array(
      array("Name" => "Images",
            "Extensions" => array(),
            "MaxFileSize" => 512,
            "Options" => array() ),

      array("Name" => "Tables",
            "Extensions" => array(),
            "MaxFileSize" => 512,
            "Options" => array() ),

      array("Name" => "Applets",
            "Extensions" => array(),
            "MaxFileSize" => 512,
            "Options" => array() ),
			
      array("Name" => "Instructions",
            "Extensions" => array(),
            "MaxFileSize" => 512,
            "Options" => array() ),
			
	  array("Name" => "Text",
            "Extensions" => array(),
            "MaxFileSize" => 512,
            "Options" => array() ),
			
       array("Name" => "Training",
            "Extensions" => array(),
            "MaxFileSize" => 512,
            "Options" => array() )
   );

   $username = $_SESSION['username'];
   $assetBaseDir = "./admins/" . $username . "/assets/";
   for($i = 0; $i < count($assets); $i++)
   {
      $currAsset = &$assets[$i];
      $currAsset["Tag"] = sanitize($currAsset["Name"]);
      $currAsset["Path"] = $assetBaseDir . $currAsset["Tag"];

         if($handle = @opendir($currAsset["Path"]))
         {
            // Asset Directory exists, load all files
            $assetOptions = &$currAsset["Options"];
            $assetOptionCount = 0;
            while( false !== ($file = readdir($handle)) )
            {
               if($file !== '.' && $file !== '..')
               {
                  $assetOptions[ $assetOptionCount ] = '<option value="' . $file . '">' . $file . '</option>';
                  ++$assetOptionCount;
               }

            }
         }
         else
         {
            // Asset Directory must be made
            echo "Made Directory : " . $currAsset["Path"];
            mkdir($currAsset["Path"], 0777, true);
         }
      }
/*
   $allAssets = array('Images', 'Tables', 'Other Objects', "Applets");


   // Load User Asset Data  

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
*/

?>
