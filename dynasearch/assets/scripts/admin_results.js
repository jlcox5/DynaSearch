var update = function() {

   var viewMode    = $('viewMode').value;


   var idTag, params, subArr, mainSelect;

   var select = new Element('select');

   switch (viewMode) {
   case "participant":

      $('sub-tag').set('html', 'Experiments');
      select.set('id', 'expId');

      idTag = 'Experiment_ID';
      params = new Array('User_ID', $('pId').value);
      subArr = ADMIN_EXPS;
      break;

   case "experiment":
      $('sub-tag').set('html', 'Participants');
      select.set('id', 'pId');

      idTag = 'User_ID';
      params = new Array('Experiment_ID', $('expId').value);
      subArr = ADMIN_USERS;
      break;
   }


   var request = new Request({
      method    : 'post',
      url       : './assets/php/db_util.php',
      data      : {
         'query'  : 'select',
         'table'  : 't_user_output',
         'params' : params
      },
      onSuccess : function(response) {

         var arr    = JSON.decode(response);

//alert( arr.length );
        
         for ( var i = 0; i < arr.length; i++ ) {

            var id     = arr[i][idTag],
                value  = subArr[id],
                option = new Element(
                   'option',
                   {
                      html  : value + ' (' + id + ')',
                      value : id
                   }
                );
            select.adopt( option );
         }

         if ( arr.length > 0 ) {
            $("sub-select").empty().adopt( select );
         } else {
            $("sub-select").set('html', '<i>No Results</i>');
         }
      }
   }).send();

}

var change_view_mode = function() {

   var viewMode    = $("viewMode").value;
   var mainSelect;
   //var expSelect   = $("expSelect");

   switch (viewMode) {
   case "participant":
      mainSelect = $('pIdProto').clone();
      mainSelect.set('id', 'pId');
      mainSelect.set('onchange', 'update();');
      break;

   case "experiment":
      mainSelect = $('expIdProto').clone();
      mainSelect.set('id', 'expId');
      mainSelect.set('onchange', 'update();');
      break;
   }

   //var oldSelect = $("main-select");
   //oldSelect.empty();
   $("main-select").empty().adopt( mainSelect );

   update();

}

var download_results = function() {

   var downloadBox = new mBox.Modal({
      title   : 'Download Results',
      content : 'download',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Download' ,
           event : function() {
              this.close();
              var form = new Element('form');
              //form.action = 'userOutput.php';
              form.style.visibility = 'hidden';
              form.method = 'POST';

              var op = new Element('input');
              op.name = 'op';
              op.value = 'download';
              form.adopt(op);

              var qId = new Element('input');
              qId.name = 'qId';
              qId.value = qSelect.value;
              form.adopt(qId);

              document.body.adopt(form);
              form.submit();

           },
           addClass : 'button-green' }
      ],
   }).open();
}

var display_results = function() {

   var downloadBox = new mBox.Modal({
      title   : 'Display Results',
      content : 'results-popup',
      /*width   : '800px',
      height  : '450px',*/
      overlay : true,
      closeOnBodyClick : false,
      buttons : [
         { title : 'Cancel' },
         { title : 'Display' ,
           event : function() {
              this.close();

              var qSelect = $("aQuests");
              var form = new Element('form');
              //form.action = 'userOutput.php';
              form.style.visibility = 'hidden';
              form.method = 'POST';

              var pId = new Element('input');
              pId.name = 'pId';
              pId.value = $("pId").value;
              form.adopt(pId);

              var expId = new Element('input');
              expId.name = 'expId';
              expId.value = $("expId").value;
              form.adopt(expId);

              document.body.adopt(form);
              form.submit();

           },
           addClass : 'button-green' }
      ],
   }).open();

}


window.addEvent(
   'domready',
   function() {

      //display_results();
      change_view_mode();

      // Create Accordion
      /*var questResultAcc = new Fx.Accordion(
         $('quest-accordion'),
         '#quest-accordion .toggle',
         '#quest-accordion .content',
         {
            alwaysHide : true
         }
      );*/
      
      // Create Accordions
      $$('.accordion').each( function( accordion ) {
         new Fx.Accordion(
            accordion,
            accordion.getElements('.toggle'),
            accordion.getElements('.content'),
            {
               alwaysHide : true
             }
         );
      });

   }
);
