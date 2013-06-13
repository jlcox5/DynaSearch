var DS_SCRIPT_BASE_PATH = 'assets/scripts/'

ds_include = function ( path ) {

   var src = DS_SCRIPT_BASE_PATH + path;
//alert(src);
   var script = new Element(
      'script',
      {
         //'language' : 'javascript',
         'type'     : 'text/javascript',
         'src'      : src,
      }
   );
   document.head.appendChild(script);
};