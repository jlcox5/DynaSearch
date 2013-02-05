<?php

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

         file_put_contents($filepath, $contents);
         break;

         case 'exists' :
         $filepath = '../../' . $_POST['filepath'];

         $results['exists'] = file_exists($filepath);
         break;
      }

      echo json_encode($results);
   }
?>
