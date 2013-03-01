(function($) {


   var simplePopUp = {

      init : function (options, elem) {
         var self = this;

         self.cache = {
            elem           : elem
         };
         self.elem         = elem,
         self.$elem        = $(elem),
         self.popUpId  = '#' + self.$elem.attr('id'),
         self.$popUpId = $(self.popUpId),

         // Set Options
         self.options = $.extend({}, $.fn.simplePopup.defaults, options);

         self.build();

      },

      build : function() {
         var self = this;
/*					
         // set the accordion's width & height
         self.$elem.css({
            width   : self.options.accordionW,
            height  : self.cache.accordionH + 'px'
         });
						
						
						// set the top & height for each slice.
						// also save the position of each one.
						// as we navigate, the first one in the accordion
						// will have position 1 and the last settings.visibleSlices.
						// finally set line-height of the title (<h3>)
         self.$slices.each(function(i){
            var $slice = $(this);
            $slice.css({
               top      : i * self.options.sliceH + 'px',
               height   : self.options.sliceH + 'px'
            }).data( 'position', (i + 1) );
         })
         .children('.vca-title')
         .css( 'line-height', self.options.sliceH + 'px' );
						
*/
      },

      show : function() {
         var self = this;

         return $.Deferred(
            function( dfd ) {
					
               //var expanded = $el.data('expanded'),
               //pos          = $el.data('position'),
							
						
               // the animation parameters for the popup
/*
               var animParam = { 
                  height    : itemHeight + 'px', 
                  opacity   : 1,
                  top       : ( pos - 1 ) * othersHeight + 'px'
                  },
               animSpeed        = self.options.animSpeed,
               animEasing       = self.options.animEasing,
               contentAnimSpeed = self.options.contentAnimSpeed,
               animOpacity      = self.options.animOpacity;
						
               // animate the clicked slice and also its title (<h3>)
               $el.stop()
                  .animate( animParam, animSpeed, animEasing, function() {
                     if( !expanded )
                        $el.find('.vca-content').fadeIn( contentAnimSpeed );
                  })
                  .find('.vca-title')
                  .stop()
                  .animate({
                     lineHeight   : self.options.sliceH + 'px'
                     }, animSpeed, animEasing);				   
*/
               // animate all the others

            }

         ).promise();
				
      }

   };



   $.fn.simplePopUp = function (options) {
      return this.each(function () {

			var popUp = Object.create(simplePopUp);
			accordion.init(options, this);

			$.data(this, 'simplePopUp', popUp);
      });
   };

   $.fn.simplePopUp.defaults = {
      showSpeed       : '100'
   };

	
});
