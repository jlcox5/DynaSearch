<?php
   include("assets/php/config.php");
   include("assets/php/std_api.php");
   require_once("assets/php/db_util.php");
   
   function strToHex($string)
{
    $hex='';
    for ($i=0; $i < strlen($string); $i++)
    {
        $hex .= dechex(ord($string[$i]));
    }
    return $hex;
}

function hexToStr($hex)
{
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2)
    {
        $string .= chr( hexdec($hex[$i].$hex[$i+1]) );
    }
	return $string;
}
   
   // Are we supposed to be here?
   if(isset($_SESSION['page_sig'])) {
   	if($_SESSION['page_sig'] != 'instructions.php') {
		redirect('assets/php/user.php?logout=true');
	}
   }
   else
   {
   	redirect('assets/php/user.php?logout=true');
   }
   
	/////////////////////////////////////////////////
	// Get the title and content
	/////////////////////////////////////////////////
	$username = $_SESSION['username'];
	
	// Get our current page.
	$result = query_db('select * from t_user where User_ID=\''. $username .'\'');
	$row = mysql_fetch_array($result, MYSQL_BOTH);
	$current_position = $row['current_position'];
   
   $expshortname = $row['experiment'];
 	// Find out where we should go now.
	$result = query_db('select * from t_experiments where ExperimentShortName=\''. $expshortname .'\'');
	$row = mysql_fetch_array($result, MYSQL_BOTH);
	
	$expstr = $row['ExperimentString'];

	$exparr = explode('$',$expstr);
	for($i=0; $i<count($exparr);$i++)
	{
		$properties = explode('&', $exparr[$i]);
		
		for($j=0;$j < count($properties);$j++)
		{
			$item = explode('=',$properties[$j]);
			
			// Match up with the page we should be on.
			if($item[0] == 'page')
			{
				$pagenum = (int)$item[1];
				if($pagenum == $current_position-1)
				{
					for($k=0;$k<count($properties);$k++)
					{
						$item2 = explode('=',$properties[$k]);
						
						if($item2[0] == 'title')
						{
							$exp_page_title = hexToStr($item2[1]);
						}
						elseif($item2[0] == 'src')
						{
							$myFile = 'hurricane_data/'. $expshortname . '/'. hexToStr($item2[1]);
							$fh = fopen($myFile, 'r');
							$page_content = fread($fh, filesize($myFile));
							fclose($fh);
						}
					}
				}				
			}
		}
	}
	/////////////////////////////////////////////////
   
   $page_title = "Dynaview";
   $style_file = "style.css";

   $template_style_array  = array($style_file);
   $template_script_array = array();
 
   include('assets/php/standard.php');
   
   
?>


<body>
    <div id="maincontainer">
    <div id="wrapper" style="width:70%; margin: auto auto;">
        <h1><?php echo $exp_page_title; ?></h1>
    	<br/>
        <?php
		echo $page_content;	
		?>
    	<br/>
		<p>
		<form action="advance.php" method="post" >
		<input name="advance" style="visibility:hidden;" value="true"/>
		<button type="submit">Continue</button>
		</form>
		</p>
        </div>
       
    </div>
    </div>
</body>
</html>
