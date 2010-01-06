var scrollLoader = function(){
    
    return{
      // images to monitor position of
     imagesToWatch:   [],
     // element cache
     elements:        {}, 
     // your viewport size
     viewportHeight:  600,
     // once the viewport gets within X pixels of image, it will load
     threshHold:      150,
     boundEvents:     {},
     // set state     
     isBusy:          false,
     // last checked position should be the top of the page on load     
     lastChecked:     0,
     // the selector for the images
     imageSelector:   'img.scrollLoader',
     
     initialize: function(options){
       if(!_||!jQuery){
         throw('Underscore.js and jQuery are required');
         return;
       }
       if(options){
         // copy over default properties
         _.extend(options,this);
       }
       // set the initial viewport height
       this.setViewportHeight();
       // cache elements
       this.elements.window = jQuery(window);
       // bind event scope
       this.boundEvents.checkScrollPosition = _.bind(this.checkScrollPosition,this);
       // store element position
       this.setImagesPosition(jQuery(this.imageSelector));
       // start polling the scrollY
       this.startObserving();
     },
     setImagesPosition: function(els){
       var me                   = this;
       var scrollTop            = window.scrollY + this.threshHold;

       els.each(function(i){
         var el                 = jQuery(this);
         var top                = parseInt(el.offset().top)+i;
         me.imagesToWatch[top]  = el;
       });
     },
     // check the scroll position on scroll and load images within range
     checkScrollPosition: function(){
       // die if we're still looping
       if(this.isBusy === true){
         return;
       }
       // Stop if we've loaded everything
       if(this.imagesToWatch.length === 0){
         this.stopObserving();
         return;
       }
       
       this.isBusy      = true;
       var scrollTop    = window.scrollY + this.threshHold + this.viewportHeight;
       var me           = this;

       for(var i = scrollTop; i > this.lastChecked; i--){
         var img = me.imagesToWatch[i];
         if(img instanceof Object){
           this.loadImage(img);
           me.imagesToWatch[i] = null;
         }
       }
       // set the lastchecked position so we dont loop over unecessary ranges
       this.lastChecked = scrollTop;
       this.isBusy      = false;

     },
     // Call this on subtantial page reflows
     resetPositions: function(){
       this.lastChecked = 0;
       this.setImagesPosition(this.imagesToWatch);
     },
     // changes the rel attribute to the img src     
     loadImage: function(img){
       var a                = document.createAttribute('src');
       a.value              = img.attr('rel');
       img[0].setAttributeNode(a);
     },
     // Destroy everything related to scrollLoader
     destroy: function(){
       this.stopObserving();
       this.imagesToWatch = null;
       this.elements      = null;
       this.boundEvents   = null;
     },
     // set the viewport height, you'll want to attach this to a resize event
     setViewportHeight: function(){
       this.viewportHeight = window.innerHeight ? window.innerHeight : this.elements.window.height();
     },
     // Start observing the scroll
     startObserving: function(){
       this.elements.window.bind('scroll',this.boundEvents.checkScrollPosition);
     },
     // Stop observing the scroll     
     stopObserving: function(){
       this.elements.window.unbind('scroll',this.boundEvents.checkScrollPosition);
     }
    }
}();
