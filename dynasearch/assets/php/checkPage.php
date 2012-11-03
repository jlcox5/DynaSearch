<?php

// Prevents the user from backtracking
function checkPage($pageNumber){

    // If first time visiting login screen
	if( !isset($_SESSION['currentPage'])){
	   $_SESSION['currentPage']=0;
	}
	// Else, assign next page number passed to currentPage
    else{
	   $_SESSION['currentPage'] = $pageNumber;
    }
	
    // If first time visiting login screen
	if( !isset($_SESSION['lastVisited'])){
	   $_SESSION['lastVisited']=0;
	}

	// If new page number is greater than the last page visited
	// assign it to current page as well
    if( $_SESSION['lastVisited'] < $_SESSION['currentPage'] ){
        $_SESSION['lastVisited'] = $_SESSION['currentPage'];
    }
	
	// If lastVisited and currentPage are not equal, user has tried to backtrack
	// so they need to be redirected
	if(isset($_SESSION['lastVisited']) && isset($_SESSION['currentPage'])){
	   // User is where they should be
	   if($_SESSION['lastVisited'] == $_SESSION['currentPage']){
	      // Do nothing
	      return;
	   }
	   // User is not where they should be
	   else if($_SESSION['lastVisited'] == 1){
          redirect("instructions.php");
	   }
	   else if($_SESSION['lastVisited'] == 2){
          redirect("sizeReg.php");
	   }
	   else if($_SESSION['lastVisited'] == 3){
          redirect("testCrazyScreen.php");
	   }
	   else if($_SESSION['lastVisited'] == 4){
          redirect("question.php");
	   }
	   else if($_SESSION['lastVisited'] == 5){
          redirect("logIn.php");
	   }
    }
}

?>
