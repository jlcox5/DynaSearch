<?php

   include("assets/php/config.php");
   include("assets/php/std_api.php");
   
   function backdoorErrorLogging( $level, $message, $file, $line, $context )
   {
      echo "<b>Error:</b> [$level] $message ( Line $line ) <br>";
      /*$error = Array(
         'level'   => $level,
         'message' => $message,
         'file'    => $file,
         'line'    => $line
       //  'context' => $context,
      );
      $_SESSION['log'][] = $error;*/
   }
   //set_error_handler('backdoorErrorLogging');
   mysql_connect($DB_HOST, $DB_USER, $DB_PASS) or die("Unable to connect.");
   mysql_select_db($DB_NAME) or die("Unable to select database.");

   $page_title = "backdoor";
   echo $jdfjsd;

   $template_style_array  = array("backdoor.css");
   $template_script_array = array("backdoor.js");


   /*$username       = $_SESSION['username'];
   $expId          = ifSetElse( $_REQUEST['expId'], -1 );
   $expName        = ifSetElse( $_REQUEST['expName'] );
   $expString      = ifSetElse( $_REQUEST['expData'] );
   $scaleProfileId = ifSetElse( $_REQUEST['scaleProfileId'], -1 );*/
   
   $reportId = ifSetElse( $_POST['reportId']);
   
   
   if ( isset($_POST['update']) ) {
      $comments = ifSetElse( $_POST['comments'] );
      $status   = ifSetElse( $_POST['status']   );
      
      $sqlComments = mysql_real_escape_string( $comments );
      
      $query = "UPDATE bugs " .
               "SET Status='$status', Comments='$sqlComments' " .
               "WHERE id=$reportId;";
      mysql_query($query);
   }
   
   // A little statistics
   $bugStatusCount     = Array();
   $requestStatusCount = Array();
   
   $status_codes = Array(
      0 => "New Report",
      1 => "In Progress",
      2 => "Resolved",
      3 => "Feature Implemented",
   );
   
   // Get Bug and Request Lists
   $bugs     = Array();
   $requests = Array(); 
   $query    = "SELECT * FROM bugs;";
   $result   = mysql_query( $query );
   while ( $row = mysql_fetch_array($result, MYSQL_BOTH) )
   {
      $type = $row['Type'];
      switch ( $type )
      {
         case 'bug_report' :
            $bug = Array(
               'user'        => $row['User_ID'],
               'description' => $row['Description'],
               'jslog'       => json_decode( $row['JsLog']  ),
               'phplog'      => json_decode( $row['PhpLog'] ),
               'timestamp'   => $row['Timestamp'],
               'status'      => $row['Status'],
               'comments'    => $row['Comments'],
            );
            $bugStatusCount[ $row['Status'] ] ++;
            //echo $bug['jslog'];
            //print_r( $bug['jslog'] );
            //print_r( $bug['phplog'] );
            $bugs[ $row['ID'] ] = $bug;
            break;
            
         case 'feature_request' :
            $request = Array(
               'id'          => $row['ID'],
               'user'        => $row['User_ID'],
               'description' => $row['Description'],
               //'jslog'       => $row['JsLog'],
               //'phplog'      => $row['PhpLog'],
               'timestamp'   => $row['Timestamp'],
               'status'      => $row['Status'],
               'comments'    => $row['Comments'],
            );
            break;
            
         default :
            break;
      }
      
   }
   
   $op = ifSetElse( $_REQUEST['fileop'] );   
   switch ( $op )
   {
      case 'operation' :

       break;

      default :
        break;
   }

   include('assets/php/standard.php');

?>

<body>
   
   

   <div style="display:table; width:100%; height:100%;border-spacing:20px;">
      <h1 style="display:table-row;">the backdoor</h1>
      
      <div class="rounded-box" style="display:table-cell; width:50%; padding : 5px;">
         <form method="post">
            <input type="number" id="reportIdInput" name="reportId" hidden="hidden"/>

            <h2>Report ID : <span id="reportId"></span></h2>
            <h3>Submitted by : <span id="userId"></span></h3>
            <h3>
               Status :
               <select id="status" name="status">
               <?php
                  foreach ( $status_codes as $key => $value )
                  {
                     echo '<option value="' . $key . '">' . $value . '</option>';
                  }
               ?>
               </select>
               (Last Update : <span id="timestamp"></span>)
            </h3>
            <br/>
            <h3>Description :</h3>
            <p id="description" style="width:600px;word-wrap: break-word;"></p>
            <br/>
            <div class="accordion" id="accordion">
               <div class="toggle">JavaScript Log</div>
               <div class="content" id="jsLog">
               Log Empty
               </div>
            </div>
            <div class="accordion" id="accordion">
               <div class="toggle">PHP Log</div>
               <div class="content" id="phpLog">
               Log Empty
               </div>
            </div>
            <br/>
            <h3>Comments :</h3>
            <textarea id="comments" name="comments"></textarea>
            <br/>
            <br/>
            <button name="update">Update</button>
         </form>
      </div>
      
      <div class="rounded-box" style="display:table-cell;width:50%; padding : 5px;"">
         
         <!-- Statistics --> 
         <h3>New Bugs : <?php echo $bugStatusCount[0]; ?></h3>
         
   <?php
      echo $bugStatusCount[1];
   ?>
         
         <br/>
         <br/>
         
         <!-- Create Administrator 
         <form>
            <input type="text" name="email" placeholder="Email">
            <input type="text" name="email" placeholder="Email">
            <input type="text" name="op" placeholder="add admin">
         </form>-->
         <br/>
         
         
         <!-- Bug List -->
         <div class="accordion" id="accordion">
            <div class="toggle">bugs</div>
            <div class="content">
   <?php
      // Generate Bug List
      if ( count( $bugs ) > 0 )
      {
      
         echo
            '<table id="bug-table">' .
               '<tr>'.
                  '<th>ID</th>' .
                  '<th>User ID</th>' .
                  '<th>Description</th>' .
                  '<th>Timestamp</th>' .
                  '<th>Status</th>' .
               '</tr>';
         foreach ( $bugs as $id => $bug )
         {
            echo
               '<tr onclick="display_bug_report(' . $id . ')">' .
                  '<td>' . $id . '</td>' .
                  '<td>' . $bug['user'] . '</td>' .
                  '<td>' . $bug['description'] . '</td>' .
                  '<td>' . $bug['timestamp'] . '</td>' .
                  '<td>' . $status_codes[ $bug['status'] ] . '</td>' .
               '</tr>';
         }
         echo '</table>';
      }
      else
      {
         echo '<i>No bugs...yet!</i>';
      }
   ?>
            </div>
         </div>
   
         <!-- Feature Request List -->
         <div class="accordion" id="accordion">
            <div class="toggle">requests</div>
            <div class="content">
   <?php
      if ( count( $requests ) > 0 )
      {
         // Generate Request List
         echo
            '<table id="request-table">' .
               '<tr>'.
                  '<th>ID</th>' .
                  '<th>User ID</th>' .
                  '<th>Description</th>' .
                  '<th>Timestamp</th>' .
                  '<th>Status</th>' .
               '</tr>';
         foreach ( $requests as $id => $request )
         {
            echo
               '<tr onclick="display_bug_report(' . $id . ')">' .
                  '<td>' . $id . '</td>' .
                  '<td>' . $request['user'] . '</td>' .
                  '<td>' . $request['description'] . '</td>' .
                  '<td>' . $request['timestamp'] . '</td>' .
                  '<td>' . $status_codes[ $request['status'] ] . '</td>' .
               '</tr>';
         }
         echo '</table>';
      }
      else
      {
         echo '<i>No feature requests.</i>';
      }
   ?>
            </div>
         </div>

      </div>
   </div>
</body>
   <script type="text/javascript">
      var BUGS = <?php echo json_encode($bugs); ?>;
          
   </script>
</html>
