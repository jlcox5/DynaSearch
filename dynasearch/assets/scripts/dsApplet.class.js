var DS_APPLET_SWF_TAG = 'swf';


var DS_APPLET_CONSTRUCTOR = function( options ) {
   switch( options.type ) {
   
      case DS_APPLET_SWF_TAG :
         return new SwfApplet( options );
         
         
      default :
         alert('ERROR : Undefined window type!');
         break;
   }
};


/**
 * Applet Base Class
 *
 */
var SwfApplet = new Class({
   Implements : [Options],
   options : {
      source : '',
   },

	initialize: function( options ) {
      this.setOptions( options );
      this.source = this.options.source;
	},
   
  
   getElement : function( ) {
      var self = this;
      self.el = new Element(
         'object',
         {
            'class' : 'obj',
            'data'  : self.source,
            'type'  : 'application/x-shockwave-flash'
         }
      );
      var getFlashIcon = new Element('img', { 'src'  : 'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}),
          getFlash     = new Element('a',   { 'href' : 'http://www.adobe.com/go/getflash' } );
         
      getFlash.adopt( getFlashIcon );
      self.el.adopt( getFlash );
      self.el.adopt( new Element('param', { 'name' : 'wmode', 'value' : 'transparent'}) );
      return self.el;
   },


   
});
