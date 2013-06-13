<?php
   /**
    * Generates a string message based on templates. This provides 
    * access to all automatically generated messages in the DynaSearch
    * system.
    *
    * @param string $template - message template
    * @param array  $args     - variables for use in the template
    *
    * @return string - message formated based on template with custom
    *                  variable values
    */
   function genMessage( $template, $args )
   {
      $msg = '';

      switch ( $template ) {
         case 'email_reset_request':
            $msg = 'Hello ' . $args['name'] . '!' . PHP_EOL . PHP_EOL .
                   'A request for a password reset for your Dynasearch account was recieved.' . PHP_EOL . PHP_EOL .
                   'To reset your password, please follow this link:' . PHP_EOL .
                   $args['url'] . PHP_EOL . PHP_EOL .
                   '(This link will expire on ' . date('j-M-Y', $args['exp']) . ' at ' . date('h:i a, e', $args['exp']) . ')' . PHP_EOL .
                   'If you did not request a password reset, please click on the following link:' . PHP_EOL .
                   'example' . PHP_EOL . PHP_EOL .
                   'Thank you!' . PHP_EOL . PHP_EOL .
                   '-The DynaSearch Team';
            break;
            
         case 'email_reset':
            break;
            
         default :
            echo 'ERROR: Unrecognized Message Template';
            break;
      }
      
      return $msg;
   }
?>