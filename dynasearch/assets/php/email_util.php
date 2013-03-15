<?php 


   function valid_email( $emailAddr )
   {

      $isValid = true;
      $atIndex = strrpos($emailAddr, "@");
      if( is_bool($atIndex) && !$atIndex )
      {
         $isValid = false;
      }
      else
      {
         $domain = substr($emailAddr, $atIndex+1);
         $local = substr($emailAddr, 0, $atIndex);
         $localLen = strlen($local);
         $domainLen = strlen($domain);

         if( $localLen < 1 || $localLen > 64 )
         {
            // local part length exceeded
            $isValid = false;
         }
         else if( $domainLen < 1 || $domainLen > 255 )
         {
            // domain part length exceeded
            $isValid = false;
         }
         else if( $local[0] == '.' || $local[$localLen-1] == '.' )
         {
            // local part starts or ends with '.'
            $isValid = false;
         }
         else if( preg_match('/\\.\\./', $local) )
         {
            // local part has two consecutive dots
            $isValid = false;
         }
         else if( !preg_match('/^[A-Za-z0-9\\-\\.]+$/', $domain) )
         {
            // character not valid in domain part
            $isValid = false;
         }
         else if( preg_match('/\\.\\./', $domain) )
         {
            // domain part has two consecutive dots
            $isValid = false;
         }
         else if( !preg_match('/^(\\\\.|[A-Za-z0-9!#%&`_=\\/$\'*+?^{}|~.-])+$/',
                              str_replace("\\\\","",$local)) )
         {
            // character not valid in local part unless 
            // local part is quoted
            if( !preg_match('/^"(\\\\"|[^"])+"$/',
                            str_replace("\\\\","",$local)) )
            {
               $isValid = false;
            }
         }

         if( $isValid && !(checkdnsrr($domain,"MX") || checkdnsrr($domain,"A")) )
         {
            // domain not found in DNS
            $isValid = false;
         }
      }

      return $isValid;
   }

//ini_set('display_errors',1);


   if( $_POST['emailOp'] )
   {
      switch( $_POST['emailOp'] )
      {
      case 'send' :
         $recipient = $_POST['recipient'];
         $subject   = $_POST['subject'];
         $message   = $_POST['message'];
         $sender    = $_POST['sender'];
         $headers   = "From:" . $sender;
         if( mail($recipient, $subject, $message, $headers) )
         {
            echo "Success";
         }
         else
         {
            echo "Failed";
         }
         break;

      default :
         echo "Invalid Op";
         break;
      }
   }



/*

// Email Validation Testing

function testEmail($email)
{
  echo $email;
  $pass = valid_email($email);
  if ($pass)
  {
    echo " is valid.<br/>";
  }
  else
  {
    echo " is not valid.<br/>";
  }
  return $pass;
}

$pass = true;
echo "All of these should succeed:<br/>";
$pass &= testEmail("dclo@us.ibm.com");
$pass &= testEmail("abc\\@def@example.com");
$pass &= testEmail("abc\\\\@example.com");
$pass &= testEmail("Fred\\ Bloggs@example.com");
$pass &= testEmail("Joe.\\\\Blow@example.com");
$pass &= testEmail("\"Abc@def\"@example.com");
$pass &= testEmail("\"Fred Bloggs\"@example.com");
$pass &= testEmail("customer/department=shipping@example.com");
$pass &= testEmail("\$A12345@example.com");
$pass &= testEmail("!def!xyz%abc@example.com");
$pass &= testEmail("_somename@example.com");
$pass &= testEmail("user+mailbox@example.com");
$pass &= testEmail("peter.piper@example.com");
$pass &= testEmail("Doug\\ \\\"Ace\\\"\\ Lovell@example.com");
$pass &= testEmail("\"Doug \\\"Ace\\\" L.\"@example.com");
echo "\nAll of these should fail:<br/>";
$pass &= !testEmail("abc@def@example.com");
$pass &= !testEmail("abc\\\\@def@example.com");
$pass &= !testEmail("abc\\@example.com");
$pass &= !testEmail("@example.com");
$pass &= !testEmail("doug@");
$pass &= !testEmail("\"qu@example.com");
$pass &= !testEmail("ote\"@example.com");
$pass &= !testEmail(".dot@example.com");
$pass &= !testEmail("dot.@example.com");
$pass &= !testEmail("two..dot@example.com");
$pass &= !testEmail("\"Doug \"Ace\" L.\"@example.com");
$pass &= !testEmail("Doug\\ \\\"Ace\\\"\\ L\\.@example.com");
$pass &= !testEmail("hello world@example.com");
$pass &= !testEmail("gatsby@f.sc.ot.t.f.i.tzg.era.l.d.");
echo "<br/>The email validation ";
if ($pass)
{
   echo "passes all tests.\n";
}
else
{
   echo "is deficient.\n";
}
*/
?>
