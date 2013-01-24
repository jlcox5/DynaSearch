var changeViewMode = function() {
   var viewMode    = $("viewMode").value;
   var userSelect  = $("userSelect");
   var expSelect   = $("expSelect");

   switch (viewMode) {
   case "participant":
      userSelect.setProperty('style', '');
      userSelect.setProperty('disabled', '');

      expSelect.setProperty('style', 'display:none;');
      expSelect.setProperty('disabled', 'disabled;');
      break;

   case "experiment":
      expSelect.setProperty('style', '');
      expSelect.setProperty('disabled', '');

      userSelect.setProperty('style', 'display:none;');
      userSelect.setProperty('disabled', 'disabled');
      break;
   }


}
