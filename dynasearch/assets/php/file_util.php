<?php

   require_once('std_api.php');
   include("config.php");
   include('admin_dir.php');
	//global $adminDirSize;
	//global $adminMaxSize;


   if( isset($_POST['fileop']) )
   {
      $request = $_POST['fileop'];
      $results = array();

      switch( $request )
      {
         case 'read' :
         $filepath = '../../' . $_POST['filepath'];

         $results['fileContent'] = file_get_contents($filepath);
         $results['fileSize'] = filesize($filepath);
         break;

         case 'write' :
         $filepath = '../../' . $_POST['filepath'];
         $contents = $_POST['contents'];
         
         $fileSize = strlen( $contents );
            //file_put_contents($filepath, $contents);
         if( ($adminDirSize + $fileSize) <= $adminMaxSize )
         {
            file_put_contents($filepath, $contents);
            $results['error'] = '';
         }
         else
         {
            $results['error'] = 'overCap';
         }
         $results['size'] = "(" . $adminDirSize . " + " . $fileSize. ") <=" . $adminMaxSize;
         break;

         case 'exists' :
         $filepath = '../../' . $_POST['filepath'];

         $results['exists'] = file_exists($filepath);
         break;
      }

      echo json_encode($results);
   }
?>
