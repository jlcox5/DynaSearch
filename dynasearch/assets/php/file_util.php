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
      }

      echo json_encode($results);
   }
?>
