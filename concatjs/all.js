/**
 * Draw Fill SVG
 *
 * A plugin that simulates a "draw" effect on the stroke of an SVG, fades out
 * the stroke, and fades in a fill colour.
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Call Me Nick
 * http://callmenick.com
 */

(function( window ){

  'use strict';

  /**
   * Cross browser transition end events
   *
   * Use modernizr to detect cross browser transition end events. Make sure
   * to include Modernizr in your doc and have "Modernizr.prefixed()" checked
   * off in the extensibility section.
   */

  var transEndEventNames = {
    "WebkitTransition" : "webkitTransitionEnd",
    "MozTransition"    : "transitionend",
    "OTransition"      : "oTransitionEnd",
    "msTransition"     : "MSTransitionEnd",
    "transition"       : "transitionend"
  },
  transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

  /**
   * Extend obj function
   *
   */

  function extend( a, b ) {
    for( var key in b ) { 
      if( b.hasOwnProperty( key ) ) {
        a[key] = b[key];
      }
    }
    return a;
  }

  /**
   * DrawFillSVG constructor
   *
   */

  function DrawFillSVG( options ) {
    this.options = extend( {}, this.options );
    extend( this.options, options );
    this._init();
  }

  /**
   * DrawFillSVG options
   *
   * Available options:
   * elementId - the ID of the element to draw
   */

  DrawFillSVG.prototype.options = {
    elementId : "svg"
  }

  /**
   * DrawFillSVG _init
   *
   * Initialise DrawFillSVG
   */

  DrawFillSVG.prototype._init = function() {
    this.svg = document.getElementById(this.options.elementId);
    this.paths = this.svg.querySelectorAll("path");
    this._initAnimation();
  }

  /**
   * DrawFillSVG _initAnimation()
   *
   * Reset some style properties on our paths, add some transitions, set the
   * stroke-dasharray to the length of the path, and the stroke-dashoffset to
   * the length of the path pushing it out of view initially. Then, set the 
   * stroke-dashoffset to 0, animating the strokes in a drawing manner. Then,
   * run the path filler sequence.
   */

  DrawFillSVG.prototype._initAnimation = function() {
    for ( var i = 0; i < this.paths.length; i++ ) {
      var path = this.paths[i];
      var length = path.getTotalLength();

      // reset opacities
      path.style.fillOpacity = 0;
      path.style.strokeOpacity = 1;

      // reset transitions
      path.style.transition = path.style.WebkitTransition = "none";


      // reset stroke dash array and stroke dash offset
      path.style.strokeDasharray = length + " " + length;
      path.style.strokeDashoffset = length;
      path.getBoundingClientRect();

      // apply new transitions
      path.style.transition = path.style.WebkitTransition = "stroke-dashoffset 2s ease-in-out";

      // go baby go
      path.style.strokeDashoffset = 0;

      // fill the path
      this._fillPath( path );

    }
  }

  /**
   * DrawFillSVG _fillPath()
   *
   * Resets the transition props, then fills the path and fades out the stroke
   * by updating the styles.
   */

  DrawFillSVG.prototype._fillPath = function( path ) {
    path.addEventListener( transEndEventName, function() {
      // reset transitions
      //alert("NO");
      path.style.transition = path.style.WebkitTransition = "none";
      path.style.transition = path.style.WebkitTransition = "fill-opacity 1s ease-in-out, stroke-opacity 1s ease-in-out";

      // edit props
      path.style.fillOpacity = 1;
      path.style.strokeOpacity = 0;
    } );
  }

  /**
   * DrawFillSVG replay
   *
   * A public function that allows you to replay the animation if you want. For
   * example, click a button, and replay the animation.
   */

  DrawFillSVG.prototype.replay = function() {
    this._initAnimation();
  }

  /**
   * Add to global namespace
   */

  window.DrawFillSVG = DrawFillSVG;

})( window );
/*!
 * fullPage 2.6.7
 * https://github.com/alvarotrigo/fullPage.js
 * @license MIT licensed
 *
 * Copyright (C) 2015 alvarotrigo.com - A project by Alvaro Trigo
 */
(function(global, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function($) {
          return factory($, global, global.document, global.Math);
        });
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'), global, global.document, global.Math);
    } else {
        factory(jQuery, global, global.document, global.Math);
    }
})(typeof window !== 'undefined' ? window : this, function($, window, document, Math, undefined) {
    'use strict';

    // keeping central set of classnames and selectors
    var WRAPPER =               'fullpage-wrapper';
    var WRAPPER_SEL =           '.' + WRAPPER;

    // slimscroll
    var SCROLLABLE =            'fp-scrollable';
    var SCROLLABLE_SEL =        '.' + SCROLLABLE;
    var SLIMSCROLL_BAR_SEL =    '.slimScrollBar';
    var SLIMSCROLL_RAIL_SEL =   '.slimScrollRail';

    // util
    var RESPONSIVE =            'fp-responsive';
    var NO_TRANSITION =         'fp-notransition';
    var DESTROYED =             'fp-destroyed';
    var ENABLED =               'fp-enabled';
    var VIEWING_PREFIX =        'fp-viewing';
    var ACTIVE =                'active';
    var ACTIVE_SEL =            '.' + ACTIVE;

    // section
    var SECTION_DEFAULT_SEL =   '.section';
    var SECTION =               'fp-section';
    var SECTION_SEL =           '.' + SECTION;
    var SECTION_ACTIVE_SEL =    SECTION_SEL + ACTIVE_SEL;
    var SECTION_FIRST_SEL =     SECTION_SEL + ':first';
    var SECTION_LAST_SEL =      SECTION_SEL + ':last';
    var TABLE_CELL =            'fp-tableCell';
    var TABLE_CELL_SEL =        '.' + TABLE_CELL;

    // section nav
    var SECTION_NAV =           'fp-nav';
    var SECTION_NAV_SEL =       '#' + SECTION_NAV;
    var SECTION_NAV_TOOLTIP =   'fp-tooltip';
    var SHOW_ACTIVE_TOOLTIP =   'fp-show-active';

    // slide
    var SLIDE_DEFAULT_SEL =     '.slide';
    var SLIDE =                 'fp-slide';
    var SLIDE_SEL =             '.' + SLIDE;
    var SLIDE_ACTIVE_SEL =      SLIDE_SEL + ACTIVE_SEL;
    var SLIDES_WRAPPER =        'fp-slides';
    var SLIDES_WRAPPER_SEL =    '.' + SLIDES_WRAPPER;
    var SLIDES_CONTAINER =      'fp-slidesContainer';
    var SLIDES_CONTAINER_SEL =  '.' + SLIDES_CONTAINER;
    var TABLE =                 'fp-table';

    // slide nav
    var SLIDES_NAV =            'fp-slidesNav';
    var SLIDES_NAV_SEL =        '.' + SLIDES_NAV;
    var SLIDES_NAV_LINK_SEL =   SLIDES_NAV_SEL + ' a';
    var SLIDES_ARROW =          'fp-controlArrow';
    var SLIDES_ARROW_SEL =      '.' + SLIDES_ARROW;
    var SLIDES_PREV =           'fp-prev';
    var SLIDES_PREV_SEL =       '.' + SLIDES_PREV;
    var SLIDES_ARROW_PREV =     SLIDES_ARROW + ' ' + SLIDES_PREV;
    var SLIDES_ARROW_PREV_SEL = SLIDES_ARROW_SEL + SLIDES_PREV_SEL;
    var SLIDES_NEXT =           'fp-next';
    var SLIDES_NEXT_SEL =       '.' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT =     SLIDES_ARROW + ' ' + SLIDES_NEXT;
    var SLIDES_ARROW_NEXT_SEL = SLIDES_ARROW_SEL + SLIDES_NEXT_SEL;

    var $window = $(window);
    var $document = $(document);

    $.fn.fullpage = function(options) {

        // common jQuery objects
        var $htmlBody = $('html, body');
        var $body = $('body');

        var FP = $.fn.fullpage;
        // Create some defaults, extending them with any options that were provided
        options = $.extend({
            //navigation
            menu: false,
            anchors:[],
            lockAnchors: false,
            navigation: false,
            navigationPosition: 'right',
            navigationTooltips: [],
            showActiveTooltip: false,
            slidesNavigation: false,
            slidesNavPosition: 'bottom',
            scrollBar: false,

            //scrolling
            css3: true,
            scrollingSpeed: 700,
            autoScrolling: true,
            fitToSection: true,
            easing: 'easeInOutCubic',
            easingcss3: 'ease',
            loopBottom: false,
            loopTop: false,
            loopHorizontal: true,
            continuousVertical: false,
            normalScrollElements: null,
            scrollOverflow: false,
            touchSensitivity: 5,
            normalScrollElementTouchThreshold: 5,

            //Accessibility
            keyboardScrolling: true,
            animateAnchor: true,
            recordHistory: true,

            //design
            controlArrows: true,
            controlArrowColor: '#fff',
            verticalCentered: true,
            resize: false,
            sectionsColor : [],
            paddingTop: 0,
            paddingBottom: 0,
            fixedElements: null,
            responsive: 0, //backwards compabitility with responsiveWiddth
            responsiveWidth: 0,
            responsiveHeight: 0,

            //Custom selectors
            sectionSelector: SECTION_DEFAULT_SEL,
            slideSelector: SLIDE_DEFAULT_SEL,


            //events
            afterLoad: null,
            onLeave: null,
            afterRender: null,
            afterResize: null,
            afterReBuild: null,
            afterSlideLoad: null,
            onSlideLeave: null
        }, options);

        displayWarnings();

        //easeInOutCubic animation included in the plugin
        $.extend($.easing,{ easeInOutCubic: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b;}});

        //TO BE REMOVED in future versions. Maintained temporaly for backwards compatibility.
        $.extend($.easing,{ easeInQuart: function (x, t, b, c, d) { return c*(t/=d)*t*t*t + b; }});

        /**
        * Sets the autoScroll option.
        * It changes the scroll bar visibility and the history of the site as a result.
        */
        FP.setAutoScrolling = function(value, type){
            setVariableState('autoScrolling', value, type);

            var element = $(SECTION_ACTIVE_SEL);

            if(options.autoScrolling && !options.scrollBar){
                $htmlBody.css({
                    'overflow' : 'hidden',
                    'height' : '100%'
                });

                FP.setRecordHistory(options.recordHistory, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': 'none',
                    'touch-action': 'none'
                });

                if(element.length){
                    //moving the container up
                    silentScroll(element.position().top);
                }

            }else{
                $htmlBody.css({
                    'overflow' : 'visible',
                    'height' : 'initial'
                });

                FP.setRecordHistory(false, 'internal');

                //for IE touch devices
                container.css({
                    '-ms-touch-action': '',
                    'touch-action': ''
                });

                silentScroll(0);

                //scrolling the page to the section with no animation
                if (element.length) {
                    $htmlBody.scrollTop(element.position().top);
                }
            }
        };

        /**
        * Defines wheter to record the history for each hash change in the URL.
        */
        FP.setRecordHistory = function(value, type){
            setVariableState('recordHistory', value, type);
        };

        /**
        * Defines the scrolling speed
        */
        FP.setScrollingSpeed = function(value, type){
            setVariableState('scrollingSpeed', value, type);
        };

        /**
        * Sets fitToSection
        */
        FP.setFitToSection = function(value, type){
            setVariableState('fitToSection', value, type);
        };

        /**
        * Sets lockAnchors
        */
        FP.setLockAnchors = function(value){
            options.lockAnchors = value;
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel or the trackpad.
        */
        FP.setMouseWheelScrolling = function (value){
            if(value){
                addMouseWheelHandler();
            }else{
                removeMouseWheelHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the mouse wheel/trackpad or touch gestures.
        * Optionally a second parameter can be used to specify the direction for which the action will be applied.
        *
        * @param directions string containing the direction or directions separated by comma.
        */
        FP.setAllowScrolling = function (value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'm');
                });
            }
            else if(value){
                FP.setMouseWheelScrolling(true);
                addTouchHandler();
            }else{
                FP.setMouseWheelScrolling(false);
                removeTouchHandler();
            }
        };

        /**
        * Adds or remove the possiblity of scrolling through sections by using the keyboard arrow keys
        */
        FP.setKeyboardScrolling = function (value, directions){
            if(typeof directions !== 'undefined'){
                directions = directions.replace(/ /g,'').split(',');

                $.each(directions, function (index, direction){
                    setIsScrollAllowed(value, direction, 'k');
                });
            }else{
                options.keyboardScrolling = value;
            }
        };

        /**
        * Moves the page up one section.
        */
        FP.moveSectionUp = function(){
            var prev = $(SECTION_ACTIVE_SEL).prev(SECTION_SEL);

            //looping to the bottom if there's no more sections above
            if (!prev.length && (options.loopTop || options.continuousVertical)) {
                prev = $(SECTION_SEL).last();
            }

            if (prev.length) {
                scrollPage(prev, null, true);
            }
        };

        /**
        * Moves the page down one section.
        */
        FP.moveSectionDown = function (){
            var next = $(SECTION_ACTIVE_SEL).next(SECTION_SEL);

            //looping to the top if there's no more sections below
            if(!next.length &&
                (options.loopBottom || options.continuousVertical)){
                next = $(SECTION_SEL).first();
            }

            if(next.length){
                // before slide move callback
                if(options.onBeforeMoveSection && $.isFunction( options.onBeforeMoveSection )){
                    if(options.onBeforeMoveSection.call(this, direction, currentSlide, destiny, slides, activeSection) === false){
                        return;
                    }
                }

                scrollPage(next, null, false);
            }
        };

        /**
        * Moves the page to the given section and slide with no animation.
        * Anchors or index positions can be used as params.
        */
        FP.silentMoveTo = function(sectionAnchor, slideAnchor){
            FP.setScrollingSpeed (0, 'internal');
            FP.moveTo(sectionAnchor, slideAnchor)
            FP.setScrollingSpeed (originals.scrollingSpeed, 'internal');
        };

        /**
        * Moves the page to the given section and slide.
        * Anchors or index positions can be used as params.
        */
        FP.moveTo = function (sectionAnchor, slideAnchor){
            var destiny = getSectionByAnchor(sectionAnchor);

            if (typeof slideAnchor !== 'undefined'){
                scrollPageAndSlide(sectionAnchor, slideAnchor);
            }else if(destiny.length > 0){
                scrollPage(destiny);
            }
        };

        /**
        * Slides right the slider of the active section.
        */
        FP.moveSlideRight = function(){
            moveSlide('next');
        };

        /**
        * Slides left the slider of the active section.
        */
        FP.moveSlideLeft = function(){
            moveSlide('prev');
        };

        /**
         * When resizing is finished, we adjust the slides sizes and positions
         */
        FP.reBuild = function(resizing){
            if(container.hasClass(DESTROYED)){ return; }  //nothing to do if the plugin was destroyed

            isResizing = true;

            var windowsWidth = $window.width();
            windowsHeight = $window.height();  //updating global var

            //text resizing
            if (options.resize) {
                resizeMe(windowsHeight, windowsWidth);
            }

            $(SECTION_SEL).each(function(){
                var slidesWrap = $(this).find(SLIDES_WRAPPER_SEL);
                var slides = $(this).find(SLIDE_SEL);

                //adjusting the height of the table-cell for IE and Firefox
                if(options.verticalCentered){
                    $(this).find(TABLE_CELL_SEL).css('height', getTableHeight($(this)) + 'px');
                }

                $(this).css('height', windowsHeight + 'px');

                //resizing the scrolling divs
                if(options.scrollOverflow){
                    if(slides.length){
                        slides.each(function(){
                            createSlimScrolling($(this));
                        });
                    }else{
                        createSlimScrolling($(this));
                    }
                }

                //adjusting the position fo the FULL WIDTH slides...
                if (slides.length > 1) {
                    landscapeScroll(slidesWrap, slidesWrap.find(SLIDE_ACTIVE_SEL));
                }
            });

            var activeSection = $(SECTION_ACTIVE_SEL);
            var sectionIndex = activeSection.index(SECTION_SEL);

            //isn't it the first section?
            if(sectionIndex){
                //adjusting the position for the current section
                FP.silentMoveTo(sectionIndex + 1);
            }

            isResizing = false;
            $.isFunction( options.afterResize ) && resizing && options.afterResize.call(container);
            $.isFunction( options.afterReBuild ) && !resizing && options.afterReBuild.call(container);
        };

        /**
        * Turns fullPage.js to normal scrolling mode when the viewport `width` or `height`
        * are smaller than the set limit values.
        */
        FP.setResponsive = function (active){
            var isResponsive = container.hasClass(RESPONSIVE);

            if(active){
                if(!isResponsive){
                    FP.setAutoScrolling(false, 'internal');
                    FP.setFitToSection(false, 'internal');
                    $(SECTION_NAV_SEL).hide();
                    container.addClass(RESPONSIVE);
                }
            }
            else if(isResponsive){
                FP.setAutoScrolling(originals.autoScrolling, 'internal');
                FP.setFitToSection(originals.autoScrolling, 'internal');
                $(SECTION_NAV_SEL).show();
                container.removeClass(RESPONSIVE);
            }
        }

        //flag to avoid very fast sliding for landscape sliders
        var slideMoving = false;

        var isTouchDevice = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/);
        var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));
        var container = $(this);
        var windowsHeight = $window.height();
        var isResizing = false;
        var lastScrolledDestiny;
        var lastScrolledSlide;
        var canScroll = true;
        var scrollings = [];
        var nav;
        var controlPressed;
        var isScrollAllowed = {};
        isScrollAllowed.m = {  'up':true, 'down':true, 'left':true, 'right':true };
        isScrollAllowed.k = $.extend(true,{}, isScrollAllowed.m);
        var originals = $.extend(true, {}, options); //deep copy

        //timeouts
        var resizeId;
        var afterSectionLoadsId;
        var afterSlideLoadsId;
        var scrollId;
        var scrollId2;
        var keydownId;

        if($(this).length){
            container.css({
                'height': '100%',
                'position': 'relative'
            });

            //adding a class to recognize the container internally in the code
            container.addClass(WRAPPER);
            $('html').addClass(ENABLED);
        }

        //if css3 is not supported, it will use jQuery animations
        if(options.css3){
            options.css3 = support3d();
        }

        FP.setAllowScrolling(true);
        container.removeClass(DESTROYED); //in case it was destroyed before initilizing it again


        //adding internal class names to void problem with common ones
        $(options.sectionSelector).each(function(){
            $(this).addClass(SECTION);
        });
        $(options.slideSelector).each(function(){
            $(this).addClass(SLIDE);
        });

        //creating the navigation dots
        if (options.navigation) {
            addVerticalNavigation();
        }

        //styling the sections
        $(SECTION_SEL).each(function(index){
            var that = $(this);
            var slides = $(this).find(SLIDE_SEL);
            var numSlides = slides.length;

            //if no active section is defined, the 1st one will be the default one
            if(!index && $(SECTION_ACTIVE_SEL).length === 0) {
                $(this).addClass(ACTIVE);
            }

            $(this).css('height', windowsHeight + 'px');

            if(options.paddingTop){
                $(this).css('padding-top', options.paddingTop);
            }

            if(options.paddingBottom){
                $(this).css('padding-bottom', options.paddingBottom);
            }

            if (typeof options.sectionsColor[index] !==  'undefined') {
                $(this).css('background-color', options.sectionsColor[index]);
            }

            if (typeof options.anchors[index] !== 'undefined') {
                $(this).attr('data-anchor', options.anchors[index]);

                //activating the menu / nav element on load
                if($(this).hasClass(ACTIVE)){
                    activateMenuAndNav(options.anchors[index], index);
                }
            }

            // if there's any slide
            if (numSlides > 0) {
                var sliderWidth = numSlides * 100;
                var slideWidth = 100 / numSlides;

                slides.wrapAll('<div class="' + SLIDES_CONTAINER + '" />');
                slides.parent().wrap('<div class="' + SLIDES_WRAPPER + '" />');

                $(this).find(SLIDES_CONTAINER_SEL).css('width', sliderWidth + '%');

                if(numSlides > 1){
                    if(options.controlArrows){
                        createSlideArrows($(this));
                    }

                    if(options.slidesNavigation){
                        addSlidesNavigation($(this), numSlides);
                    }
                }

                slides.each(function(index) {
                    $(this).css('width', slideWidth + '%');

                    if(options.verticalCentered){
                        addTableClass($(this));
                    }
                });

                var startingSlide = that.find(SLIDE_ACTIVE_SEL);

                //if the slide won't be an starting point, the default will be the first one
                if(!startingSlide.length){
                    slides.eq(0).addClass(ACTIVE);
                }

                //is there a starting point for a non-starting section?
                else{
                    silentLandscapeScroll(startingSlide);
                }

            }else{
                if(options.verticalCentered){
                    addTableClass($(this));
                }
            }

        }).promise().done(function(){
            FP.setAutoScrolling(options.autoScrolling, 'internal');

            //the starting point is a slide?
            var activeSlide = $(SECTION_ACTIVE_SEL).find(SLIDE_ACTIVE_SEL);

            //the active section isn't the first one? Is not the first slide of the first section? Then we load that section/slide by default.
            if( activeSlide.length &&  ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) !== 0 || ($(SECTION_ACTIVE_SEL).index(SECTION_SEL) === 0 && activeSlide.index() !== 0))){
                silentLandscapeScroll(activeSlide);
            }

            //fixed elements need to be moved out of the plugin container due to problems with CSS3.
            if(options.fixedElements && options.css3){
                $(options.fixedElements).appendTo($body);
            }

            //vertical centered of the navigation + first bullet active
            if(options.navigation){
                nav.css('margin-top', '-' + (nav.height()/2) + 'px');
                nav.find('li').eq($(SECTION_ACTIVE_SEL).index(SECTION_SEL)).find('a').addClass(ACTIVE);
            }

            //moving the menu outside the main container if it is inside (avoid problems with fixed positions when using CSS3 tranforms)
            if(options.menu && options.css3 && $(options.menu).closest(WRAPPER_SEL).length){
                $(options.menu).appendTo($body);
            }

            if(options.scrollOverflow){
                if(document.readyState === 'complete'){
                    createSlimScrollingHandler();
                }
                //after DOM and images are loaded
                $window.on('load', createSlimScrollingHandler);
            }else{
                afterRenderActions();
            }

            responsive();

            //for animateAnchor:false
            if(!options.animateAnchor){
                //getting the anchor link in the URL and deleting the `#`
                var value =  window.location.hash.replace('#', '').split('/');
                var destiny = value[0];

                if(destiny.length){
                    var section = $('[data-anchor="'+destiny+'"]');

                    if(section.length){
                        if(options.autoScrolling){
                            silentScroll(section.position().top);
                        }
                        else{
                            silentScroll(0);

                            //scrolling the page to the section with no animation
                            $htmlBody.scrollTop(section.position().top);
                        }
                        activateMenuAndNav(destiny, null);

                        $.isFunction( options.afterLoad ) && options.afterLoad.call( section, destiny, (section.index(SECTION_SEL) + 1));

                        //updating the active class
                        section.addClass(ACTIVE).siblings().removeClass(ACTIVE);
                    }
                }
            }

            //setting the class for the body element
            setBodyClass();

            $window.on('load', function() {
                scrollToAnchor();
            });

        });


        /**
        * Creates the control arrows for the given section
        */
        function createSlideArrows(section){
            section.find(SLIDES_WRAPPER_SEL).after('<div class="' + SLIDES_ARROW_PREV + '"></div><div class="' + SLIDES_ARROW_NEXT + '"></div>');

            if(options.controlArrowColor!='#fff'){
                section.find(SLIDES_ARROW_NEXT_SEL).css('border-color', 'transparent transparent transparent '+options.controlArrowColor);
                section.find(SLIDES_ARROW_PREV_SEL).css('border-color', 'transparent '+ options.controlArrowColor + ' transparent transparent');
            }

            if(!options.loopHorizontal){
                section.find(SLIDES_ARROW_PREV_SEL).hide();
            }
        }

        /**
        * Creates a vertical navigation bar.
        */
        function addVerticalNavigation(){
            $body.append('<div id="' + SECTION_NAV + '"><ul></ul></div>');
            nav = $(SECTION_NAV_SEL);

            nav.addClass(function() {
                return options.showActiveTooltip ? SHOW_ACTIVE_TOOLTIP + ' ' + options.navigationPosition : options.navigationPosition;
            });

            for (var i = 0; i < $(SECTION_SEL).length; i++) {
                var link = '';
                if (options.anchors.length) {
                    link = options.anchors[i];
                }

                var li = '<li><a href="#' + link + '"><span></span></a>';

                // Only add tooltip if needed (defined by user)
                var tooltip = options.navigationTooltips[i];

                if (typeof tooltip !== 'undefined' && tooltip !== '') {
                    li += '<div class="' + SECTION_NAV_TOOLTIP + ' ' + options.navigationPosition + '">' + tooltip + '</div>';
                }

                li += '</li>';

                nav.find('ul').append(li);
            }
        }

        /**
        * Creates the slim scroll scrollbar for the sections and slides inside them.
        */
        function createSlimScrollingHandler(){
            $(SECTION_SEL).each(function(){
                var slides = $(this).find(SLIDE_SEL);

                if(slides.length){
                    slides.each(function(){
                        createSlimScrolling($(this));
                    });
                }else{
                    createSlimScrolling($(this));
                }

            });
            afterRenderActions();
        }

        /**
        * Actions and callbacks to fire afterRender
        */
        function afterRenderActions(){
            var section = $(SECTION_ACTIVE_SEL);

            solveBugSlimScroll(section);
            lazyLoad(section);
            playMedia(section);

            $.isFunction( options.afterLoad ) && options.afterLoad.call(section, section.data('anchor'), (section.index(SECTION_SEL) + 1));
            $.isFunction( options.afterRender ) && options.afterRender.call(container);
        }


        /**
        * Solves a bug with slimScroll vendor library #1037, #553
        */
        function solveBugSlimScroll(section){
            var slides = section.find('SLIDES_WRAPPER');
            var scrollableWrap = section.find(SCROLLABLE_SEL);

            if(slides.length){
                scrollableWrap = slides.find(SLIDE_ACTIVE_SEL);
            }

            scrollableWrap.mouseover();
        }


        var isScrolling = false;

        //when scrolling...
        $window.on('scroll', scrollHandler);

        function scrollHandler(){
            var currentSection;

            if(!options.autoScrolling || options.scrollBar){
                var currentScroll = $window.scrollTop();
                var visibleSectionIndex = 0;
                var initial = Math.abs(currentScroll - document.querySelectorAll(SECTION_SEL)[0].offsetTop);

                //taking the section which is showing more content in the viewport
                var sections =  document.querySelectorAll(SECTION_SEL);
                for (var i = 0; i < sections.length; ++i) {
                    var section = sections[i];

                    var current = Math.abs(currentScroll - section.offsetTop);

                    if(current < initial){
                        visibleSectionIndex = i;
                        initial = current;
                    }
                }

                //geting the last one, the current one on the screen
                currentSection = $(sections).eq(visibleSectionIndex);
            }

            if(!options.autoScrolling || options.scrollBar){
                //executing only once the first time we reach the section
                if(!currentSection.hasClass(ACTIVE)){
                    isScrolling = true;
                    var leavingSection = $(SECTION_ACTIVE_SEL);
                    var leavingSectionIndex = leavingSection.index(SECTION_SEL) + 1;
                    var yMovement = getYmovement(currentSection);
                    var anchorLink  = currentSection.data('anchor');
                    var sectionIndex = currentSection.index(SECTION_SEL) + 1;
                    var activeSlide = currentSection.find(SLIDE_ACTIVE_SEL);

                    if(activeSlide.length){
                        var slideAnchorLink = activeSlide.data('anchor');
                        var slideIndex = activeSlide.index();
                    }

                    if(canScroll){
                        currentSection.addClass(ACTIVE).siblings().removeClass(ACTIVE);

                        $.isFunction( options.onLeave ) && options.onLeave.call( leavingSection, leavingSectionIndex, sectionIndex, yMovement);

                        $.isFunction( options.afterLoad ) && options.afterLoad.call( currentSection, anchorLink, sectionIndex);
                        lazyLoad(currentSection);

                        activateMenuAndNav(anchorLink, sectionIndex - 1);

                        if(options.anchors.length){
                            //needed to enter in hashChange event when using the menu with anchor links
                            lastScrolledDestiny = anchorLink;

                            setState(slideIndex, slideAnchorLink, anchorLink, sectionIndex);
                        }
                    }

                    //small timeout in order to avoid entering in hashChange event when scrolling is not finished yet
                    clearTimeout(scrollId);
                    scrollId = setTimeout(function(){
                        isScrolling = false;
                    }, 100);
                }

                if(options.fitToSection){
                    //for the auto adjust of the viewport to fit a whole section
                    clearTimeout(scrollId2);

                    scrollId2 = setTimeout(function(){
                        if(canScroll){
                            //allows to scroll to an active section and
                            //if the section is already active, we prevent firing callbacks
                            if($(SECTION_ACTIVE_SEL).is(currentSection)){
                                isResizing = true;
                            }
                            scrollPage(currentSection);
                            isResizing = false;
                        }
                    }, 1000);
                }
            }
        }


        /**
        * Determines whether the active section or slide is scrollable through and scrolling bar
        */
        function isScrollable(activeSection){
            //if there are landscape slides, we check if the scrolling bar is in the current one or not
            if(activeSection.find(SLIDES_WRAPPER_SEL).length){
                return activeSection.find(SLIDE_ACTIVE_SEL).find(SCROLLABLE_SEL);
            }

            return activeSection.find(SCROLLABLE_SEL);
        }

        /**
        * Determines the way of scrolling up or down:
        * by 'automatically' scrolling a section or by using the default and normal scrolling.
        */
        function scrolling(type, scrollable){
            if (!isScrollAllowed.m[type]){
                return;
            }
            var check, scrollSection;

            if(type == 'down'){
                check = 'bottom';
                scrollSection = FP.moveSectionDown;
            }else{
                check = 'top';
                scrollSection = FP.moveSectionUp;
            }

            if(scrollable.length > 0 ){
                //is the scrollbar at the start/end of the scroll?
                if(isScrolled(check, scrollable)){
                    scrollSection();
                }else{
                    return true;
                }
            }else{
                // moved up/down
                scrollSection();
            }
        }


        var touchStartY = 0;
        var touchStartX = 0;
        var touchEndY = 0;
        var touchEndX = 0;

        /* Detecting touch events

        * As we are changing the top property of the page on scrolling, we can not use the traditional way to detect it.
        * This way, the touchstart and the touch moves shows an small difference between them which is the
        * used one to determine the direction.
        */
        function touchMoveHandler(event){
            var e = event.originalEvent;

            // additional: if one of the normalScrollElements isn't within options.normalScrollElementTouchThreshold hops up the DOM chain
            if (!checkParentForNormalScrollElement(event.target) && isReallyTouch(e) ) {

                if(options.autoScrolling){
                    //preventing the easing on iOS devices
                    event.preventDefault();
                }

                var activeSection = $(SECTION_ACTIVE_SEL);
                var scrollable = isScrollable(activeSection);

                if (canScroll && !slideMoving) { //if theres any #
                    var touchEvents = getEventsPage(e);

                    touchEndY = touchEvents.y;
                    touchEndX = touchEvents.x;

                    //if movement in the X axys is greater than in the Y and the currect section has slides...
                    if (activeSection.find(SLIDES_WRAPPER_SEL).length && Math.abs(touchStartX - touchEndX) > (Math.abs(touchStartY - touchEndY))) {

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartX - touchEndX) > ($window.width() / 100 * options.touchSensitivity)) {
                            if (touchStartX > touchEndX) {
                                if(isScrollAllowed.m.right){
                                    FP.moveSlideRight(); //next
                                }
                            } else {
                                if(isScrollAllowed.m.left){
                                    FP.moveSlideLeft(); //prev
                                }
                            }
                        }
                    }

                    //vertical scrolling (only when autoScrolling is enabled)
                    else if(options.autoScrolling){

                        //is the movement greater than the minimum resistance to scroll?
                        if (Math.abs(touchStartY - touchEndY) > ($window.height() / 100 * options.touchSensitivity)) {
                            if (touchStartY > touchEndY) {
                                scrolling('down', scrollable);
                            } else if (touchEndY > touchStartY) {
                                scrolling('up', scrollable);
                            }
                        }
                    }
                }
            }

        }

        /**
         * recursive function to loop up the parent nodes to check if one of them exists in options.normalScrollElements
         * Currently works well for iOS - Android might need some testing
         * @param  {Element} el  target element / jquery selector (in subsequent nodes)
         * @param  {int}     hop current hop compared to options.normalScrollElementTouchThreshold
         * @return {boolean} true if there is a match to options.normalScrollElements
         */
        function checkParentForNormalScrollElement (el, hop) {
            hop = hop || 0;
            var parent = $(el).parent();

            if (hop < options.normalScrollElementTouchThreshold &&
                parent.is(options.normalScrollElements) ) {
                return true;
            } else if (hop == options.normalScrollElementTouchThreshold) {
                return false;
            } else {
                return checkParentForNormalScrollElement(parent, ++hop);
            }
        }

        /**
        * As IE >= 10 fires both touch and mouse events when using a mouse in a touchscreen
        * this way we make sure that is really a touch event what IE is detecting.
        */
        function isReallyTouch(e){
            //if is not IE   ||  IE is detecting `touch` or `pen`
            return typeof e.pointerType === 'undefined' || e.pointerType != 'mouse';
        }

        /**
        * Handler for the touch start event.
        */
        function touchStartHandler(event){
            var e = event.originalEvent;

            //stopping the auto scroll to adjust to a section
            if(options.fitToSection){
                $htmlBody.stop();
            }

            if(isReallyTouch(e)){
                var touchEvents = getEventsPage(e);
                touchStartY = touchEvents.y;
                touchStartX = touchEvents.x;
            }
        }

        /**
        * Gets the average of the last `number` elements of the given array.
        */
        function getAverage(elements, number){
            var sum = 0;

            //taking `number` elements from the end to make the average, if there are not enought, 1
            var lastElements = elements.slice(Math.max(elements.length - number, 1));

            for(var i = 0; i < lastElements.length; i++){
                sum = sum + lastElements[i];
            }

            return Math.ceil(sum/number);
        }

        /**
         * Detecting mousewheel scrolling
         *
         * http://blogs.sitepointstatic.com/examples/tech/mouse-wheel/index.html
         * http://www.sitepoint.com/html5-javascript-mouse-wheel/
         */
        var prevTime = new Date().getTime();

        function MouseWheelHandler(e) {
            var curTime = new Date().getTime();

            //autoscrolling and not zooming?
            if(options.autoScrolling && !controlPressed){
                // cross-browser wheel delta
                e = e || window.event;
                var value = e.wheelDelta || -e.deltaY || -e.detail;
                var delta = Math.max(-1, Math.min(1, value));

                //Limiting the array to 150 (lets not waste memory!)
                if(scrollings.length > 149){
                    scrollings.shift();
                }

                //keeping record of the previous scrollings
                scrollings.push(Math.abs(value));

                //preventing to scroll the site on mouse wheel when scrollbar is present
                if(options.scrollBar){
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                }

                var activeSection = $(SECTION_ACTIVE_SEL);
                var scrollable = isScrollable(activeSection);

                //time difference between the last scroll and the current one
                var timeDiff = curTime-prevTime;
                prevTime = curTime;

                //haven't they scrolled in a while?
                //(enough to be consider a different scrolling action to scroll another section)
                if(timeDiff > 200){
                    //emptying the array, we dont care about old scrollings for our averages
                    scrollings = [];
                }

                if(canScroll){
                    var averageEnd = getAverage(scrollings, 10);
                    var averageMiddle = getAverage(scrollings, 70);
                    var isAccelerating = averageEnd >= averageMiddle;

                    //to avoid double swipes...
                    if(isAccelerating){
                        //scrolling down?
                        if (delta < 0) {
                            scrolling('down', scrollable);

                        //scrolling up?
                        }else {
                            scrolling('up', scrollable);
                        }
                    }
                }

                return false;
            }

            if(options.fitToSection){
                //stopping the auto scroll to adjust to a section
                $htmlBody.stop();
            }
        }

        /**
        * Slides a slider to the given direction.
        */
        function moveSlide(direction){
            var activeSection = $(SECTION_ACTIVE_SEL);
            var slides = activeSection.find(SLIDES_WRAPPER_SEL);
            var numSlides = slides.find(SLIDE_SEL).length;

            // more than one slide needed and nothing should be sliding
            if (!slides.length || slideMoving || numSlides < 2) {
                return;
            }

            var currentSlide = slides.find(SLIDE_ACTIVE_SEL);
            var destiny = null;

            if(direction === 'prev'){
                destiny = currentSlide.prev(SLIDE_SEL);
            }else{
                destiny = currentSlide.next(SLIDE_SEL);
            }

            //isn't there a next slide in the secuence?
            if(!destiny.length){
                //respect loopHorizontal settin
                if (!options.loopHorizontal) return;

                if(direction === 'prev'){
                    destiny = currentSlide.siblings(':last');
                }else{
                    destiny = currentSlide.siblings(':first');
                }
            }

            slideMoving = true;

            landscapeScroll(slides, destiny);
        }

        /**
        * Maintains the active slides in the viewport
        * (Because he `scroll` animation might get lost with some actions, such as when using continuousVertical)
        */
        function keepSlidesPosition(){
            $(SLIDE_ACTIVE_SEL).each(function(){
                silentLandscapeScroll($(this), 'internal');
            });
        }

        /**
        * Scrolls the site to the given element and scrolls to the slide if a callback is given.
        */
        function scrollPage(element, callback, isMovementUp){
            var dest = element.position();
            if(typeof dest === 'undefined'){ return; } //there's no element to scroll, leaving the function

            //local variables
            var v = {
                element: element,
                callback: callback,
                isMovementUp: isMovementUp,
                dest: dest,
                dtop: dest.top,
                yMovement: getYmovement(element),
                anchorLink: element.data('anchor'),
                sectionIndex: element.index(SECTION_SEL),
                activeSlide: element.find(SLIDE_ACTIVE_SEL),
                activeSection: $(SECTION_ACTIVE_SEL),
                leavingSection: $(SECTION_ACTIVE_SEL).index(SECTION_SEL) + 1,

                //caching the value of isResizing at the momment the function is called
                //because it will be checked later inside a setTimeout and the value might change
                localIsResizing: isResizing
            };

            //quiting when destination scroll is the same as the current one
            if((v.activeSection.is(element) && !isResizing) || (options.scrollBar && $window.scrollTop() === v.dtop)){ return; }

            if(v.activeSlide.length){
                var slideAnchorLink = v.activeSlide.data('anchor');
                var slideIndex = v.activeSlide.index();
            }

            // If continuousVertical && we need to wrap around
            if (options.autoScrolling && options.continuousVertical && typeof (v.isMovementUp) !== "undefined" &&
                ((!v.isMovementUp && v.yMovement == 'up') || // Intending to scroll down but about to go up or
                (v.isMovementUp && v.yMovement == 'down'))) { // intending to scroll up but about to go down

                v = createInfiniteSections(v);
            }

            //callback (onLeave) if the site is not just resizing and readjusting the slides
            if($.isFunction(options.onLeave) && !v.localIsResizing){
                if(options.onLeave.call(v.activeSection, v.leavingSection, (v.sectionIndex + 1), v.yMovement) === false){
                    return;
                }else{
                    stopMedia(v.activeSection);
                }
            }

            element.addClass(ACTIVE).siblings().removeClass(ACTIVE);

            //preventing from activating the MouseWheelHandler event
            //more than once if the page is scrolling
            canScroll = false;

            setState(slideIndex, slideAnchorLink, v.anchorLink, v.sectionIndex);

            performMovement(v);

            //flag to avoid callingn `scrollPage()` twice in case of using anchor links
            lastScrolledDestiny = v.anchorLink;

            //avoid firing it twice (as it does also on scroll)
            activateMenuAndNav(v.anchorLink, v.sectionIndex);
        }

        /**
        * Performs the movement (by CSS3 or by jQuery)
        */
        function performMovement(v){
            // using CSS3 translate functionality
            if (options.css3 && options.autoScrolling && !options.scrollBar) {

                var translate3d = 'translate3d(0px, -' + v.dtop + 'px, 0px)';
                transformContainer(translate3d, true);

                //even when the scrollingSpeed is 0 there's a little delay, which might cause the
                //scrollingSpeed to change in case of using silentMoveTo();
                if(options.scrollingSpeed){
                    afterSectionLoadsId = setTimeout(function () {
                        afterSectionLoads(v);
                    }, options.scrollingSpeed);
                }else{
                    afterSectionLoads(v);
                }
            }

            // using jQuery animate
            else{
                var scrollSettings = getScrollSettings(v);

                $(scrollSettings.element).animate(
                    scrollSettings.options,
                options.scrollingSpeed, options.easing).promise().done(function () { //only one single callback in case of animating  `html, body`
                    afterSectionLoads(v);
                });
            }
        }

        /**
        * Gets the scrolling settings depending on the plugin autoScrolling option
        */
        function getScrollSettings(v){
            var scroll = {};

            if(options.autoScrolling && !options.scrollBar){
                scroll.options = { 'top': -v.dtop};
                scroll.element = WRAPPER_SEL;
            }else{
                scroll.options = { 'scrollTop': v.dtop};
                scroll.element = 'html, body';
            }

            return scroll;
        }

        /**
        * Adds sections before or after the current one to create the infinite effect.
        */
        function createInfiniteSections(v){
            // Scrolling down
            if (!v.isMovementUp) {
                // Move all previous sections to after the active section
                $(SECTION_ACTIVE_SEL).after(v.activeSection.prevAll(SECTION_SEL).get().reverse());
            }
            else { // Scrolling up
                // Move all next sections to before the active section
                $(SECTION_ACTIVE_SEL).before(v.activeSection.nextAll(SECTION_SEL));
            }

            // Maintain the displayed position (now that we changed the element order)
            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();

            // save for later the elements that still need to be reordered
            v.wrapAroundElements = v.activeSection;

            // Recalculate animation variables
            v.dest = v.element.position();
            v.dtop = v.dest.top;
            v.yMovement = getYmovement(v.element);

            return v;
        }

        /**
        * Fix section order after continuousVertical changes have been animated
        */
        function continuousVerticalFixSectionOrder (v) {
            // If continuousVertical is in effect (and autoScrolling would also be in effect then),
            // finish moving the elements around so the direct navigation will function more simply
            if (!v.wrapAroundElements || !v.wrapAroundElements.length) {
                return;
            }

            if (v.isMovementUp) {
                $(SECTION_FIRST_SEL).before(v.wrapAroundElements);
            }
            else {
                $(SECTION_LAST_SEL).after(v.wrapAroundElements);
            }

            silentScroll($(SECTION_ACTIVE_SEL).position().top);

            // Maintain the active slides visible in the viewport
            keepSlidesPosition();
        }


        /**
        * Actions to do once the section is loaded.
        */
        function afterSectionLoads (v){
            continuousVerticalFixSectionOrder(v);

            v.element.find('.fp-scrollable').mouseover();

            //callback (afterLoad) if the site is not just resizing and readjusting the slides
            $.isFunction(options.afterLoad) && !v.localIsResizing && options.afterLoad.call(v.element, v.anchorLink, (v.sectionIndex + 1));

            lazyLoad(v.element);
            playMedia(v.element)

            canScroll = true;

            $.isFunction(v.callback) && v.callback.call(this);
        }

        /**
        * Lazy loads image, video and audio elements.
        */
        function lazyLoad(destiny){
            //Lazy loading images, videos and audios
            var slide = destiny.find(SLIDE_ACTIVE_SEL);
            if( slide.length ) {
                destiny = $(slide);
            }
            destiny.find('img[data-src], video[data-src], audio[data-src]').each(function(){
                $(this).attr('src', $(this).data('src'));
                $(this).removeAttr('data-src');
            });
        }

        /**
        * Plays video and audio elements.
        */
        function playMedia(destiny){
            //playing HTML5 media elements
            destiny.find('video, audio').each(function(){
                var element = $(this).get(0);

                if( element.hasAttribute('autoplay') && typeof element.play === 'function' ) {
                    element.play();
                }
            });
        }

        /**
        * Stops video and audio elements.
        */
        function stopMedia(destiny){
            //stopping HTML5 media elements
            destiny.find('video, audio').each(function(){
                var element = $(this).get(0);

                if( !element.hasAttribute('data-ignore') && typeof element.pause === 'function' ) {
                    element.pause();
                }
            });
        }

        /**
        * Scrolls to the anchor in the URL when loading the site
        */
        function scrollToAnchor(){
            //getting the anchor link in the URL and deleting the `#`
            var value =  window.location.hash.replace('#', '').split('/');
            var section = value[0];
            var slide = value[1];

            if(section){  //if theres any #
                scrollPageAndSlide(section, slide);
            }
        }

        //detecting any change on the URL to scroll to the given anchor link
        //(a way to detect back history button as we play with the hashes on the URL)
        $window.on('hashchange', hashChangeHandler);

        function hashChangeHandler(){
            if(!isScrolling && !options.lockAnchors){
                var value =  window.location.hash.replace('#', '').split('/');
                var section = value[0];
                var slide = value[1];

                if(section.length){
                    //when moving to a slide in the first section for the first time (first time to add an anchor to the URL)
                    var isFirstSlideMove =  (typeof lastScrolledDestiny === 'undefined');
                    var isFirstScrollMove = (typeof lastScrolledDestiny === 'undefined' && typeof slide === 'undefined' && !slideMoving);

                    /*in order to call scrollpage() only once for each destination at a time
                    It is called twice for each scroll otherwise, as in case of using anchorlinks `hashChange`
                    event is fired on every scroll too.*/
                    if ((section && section !== lastScrolledDestiny) && !isFirstSlideMove || isFirstScrollMove || (!slideMoving && lastScrolledSlide != slide ))  {
                        scrollPageAndSlide(section, slide);
                    }
                }
            }
        }

        /**
         * Sliding with arrow keys, both, vertical and horizontal
         */
        $document.keydown(keydownHandler);

        //to prevent scrolling while zooming
        $document.keyup(function(e){
            controlPressed = e.ctrlKey;
        });

        //when opening a new tab (ctrl + t), `control` won't be pressed when comming back.
        $(window).blur(function() {
            controlPressed = false;
        });

        var keydownId;
        function keydownHandler(e) {

            clearTimeout(keydownId);


            var activeElement = $(':focus');

            if(!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select') &&
                options.keyboardScrolling && options.autoScrolling){
                var keyCode = e.which;

                //preventing the scroll with arrow keys & spacebar & Page Up & Down keys
                var keyControls = [40, 38, 32, 33, 34];
                if($.inArray(keyCode, keyControls) > -1){
                    e.preventDefault();
                }

                keydownId = setTimeout(function(){
                    onkeydown(e);
                },150);
            }
        }

        /**
        * Keydown event
        */
        function onkeydown(e){
            var shiftPressed = e.shiftKey;
            controlPressed = e.ctrlKey;

            switch (e.which) {
                //up
                case 38:
                case 33:
                    if(isScrollAllowed.k.up){
                        FP.moveSectionUp();
                    }
                    break;

                //down
                case 32: //spacebar
                    if(shiftPressed && isScrollAllowed.k.up){
                        FP.moveSectionUp();
                        break;
                    }
                case 40:
                case 34:
                    if(isScrollAllowed.k.down){
                        FP.moveSectionDown();
                    }
                    break;

                //Home
                case 36:
                    if(isScrollAllowed.k.up){
                        FP.moveTo(1);
                    }
                    break;

                //End
                case 35:
                     if(isScrollAllowed.k.down){
                        FP.moveTo( $(SECTION_SEL).length );
                    }
                    break;

                //left
                case 37:
                    if(isScrollAllowed.k.left){
                        FP.moveSlideLeft();
                    }
                    break;

                //right
                case 39:
                    if(isScrollAllowed.k.right){
                        FP.moveSlideRight();
                    }
                    break;

                default:
                    return; // exit this handler for other keys
            }
        }

        //binding the mousemove when the mouse's middle button is released
        container.mousedown(function(e){
            //middle button
            if (e.which == 2){
                oldPageY = e.pageY;
                container.on('mousemove', mouseMoveHandler);
            }
        });

        //unbinding the mousemove when the mouse's middle button is released
        container.mouseup(function(e){
            //middle button
            if (e.which == 2){
                container.off('mousemove');
            }
        });

        /**
        * Detecting the direction of the mouse movement.
        * Used only for the middle button of the mouse.
        */
        var oldPageY = 0;
        function mouseMoveHandler(e){
            // moving up
            if(canScroll){
                if (e.pageY < oldPageY){
                    FP.moveSectionUp();

                // moving downw
                }else if(e.pageY > oldPageY){
                    FP.moveSectionDown();
                }
            }
            oldPageY = e.pageY;
        }

        /**
        * Scrolls to the section when clicking the navigation bullet
        */
        $document.on('click touchstart', SECTION_NAV_SEL + ' a', function(e){
            e.preventDefault();
            var index = $(this).parent().index();
            scrollPage($(SECTION_SEL).eq(index));
        });

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        $document.on('click touchstart', SLIDES_NAV_LINK_SEL, function(e){
            e.preventDefault();
            var slides = $(this).closest(SECTION_SEL).find(SLIDES_WRAPPER_SEL);
            var destiny = slides.find(SLIDE_SEL).eq($(this).closest('li').index());

            landscapeScroll(slides, destiny);
        });

        /**
        * Applying normalScroll elements.
        * Ignoring the scrolls over the specified selectors.
        */
        if(options.normalScrollElements){
            $document.on('mouseenter', options.normalScrollElements, function () {
                FP.setMouseWheelScrolling(false);
            });

            $document.on('mouseleave', options.normalScrollElements, function(){
                FP.setMouseWheelScrolling(true);
            });
        }

        /**
         * Scrolling horizontally when clicking on the slider controls.
         */
        $(SECTION_SEL).on('click touchstart', SLIDES_ARROW_SEL, function() {
            if ($(this).hasClass(SLIDES_PREV)) {
                if(isScrollAllowed.m.left){
                    FP.moveSlideLeft();
                }
            } else {
                if(isScrollAllowed.m.right){
                    FP.moveSlideRight();
                }
            }
        });

        /**
        * Scrolls horizontal sliders.
        */
        function landscapeScroll(slides, destiny){
            var destinyPos = destiny.position();
            var slideIndex = destiny.index();
            var section = slides.closest(SECTION_SEL);
            var sectionIndex = section.index(SECTION_SEL);
            var anchorLink = section.data('anchor');
            var slidesNav = section.find(SLIDES_NAV_SEL);
            var slideAnchor = getSlideAnchor(destiny);

            //caching the value of isResizing at the momment the function is called
            //because it will be checked later inside a setTimeout and the value might change
            var localIsResizing = isResizing;

            if(options.onSlideLeave){
                var prevSlide = section.find(SLIDE_ACTIVE_SEL);
                var prevSlideIndex = prevSlide.index();
                var xMovement = getXmovement(prevSlideIndex, slideIndex);

                //if the site is not just resizing and readjusting the slides
                if(!localIsResizing && xMovement!=='none'){
                    if($.isFunction( options.onSlideLeave )){
                        if(options.onSlideLeave.call( prevSlide, anchorLink, (sectionIndex + 1), prevSlideIndex, xMovement, slideIndex ) === false){
                            slideMoving = false;
                            return;
                        }
                    }
                }
            }

            destiny.addClass(ACTIVE).siblings().removeClass(ACTIVE);
            lazyLoad(destiny);

            if(!options.loopHorizontal && options.controlArrows){
                //hidding it for the fist slide, showing for the rest
                section.find(SLIDES_ARROW_PREV_SEL).toggle(slideIndex!==0);

                //hidding it for the last slide, showing for the rest
                section.find(SLIDES_ARROW_NEXT_SEL).toggle(!destiny.is(':last-child'));
            }

            //only changing the URL if the slides are in the current section (not for resize re-adjusting)
            if(section.hasClass(ACTIVE)){
                setState(slideIndex, slideAnchor, anchorLink, sectionIndex);
            }

            var afterSlideLoads = function(){
                //if the site is not just resizing and readjusting the slides
                if(!localIsResizing){
                    $.isFunction( options.afterSlideLoad ) && options.afterSlideLoad.call( destiny, anchorLink, (sectionIndex + 1), slideAnchor, slideIndex);
                }
                //letting them slide again
                slideMoving = false;
            };

            if(options.css3){
                var translate3d = 'translate3d(-' + Math.round(destinyPos.left) + 'px, 0px, 0px)';

                addAnimation(slides.find(SLIDES_CONTAINER_SEL), options.scrollingSpeed>0).css(getTransforms(translate3d));

                afterSlideLoadsId = setTimeout(function(){
                    afterSlideLoads();
                }, options.scrollingSpeed, options.easing);
            }else{
                slides.animate({
                    scrollLeft : Math.round(destinyPos.left)
                }, options.scrollingSpeed, options.easing, function() {

                    afterSlideLoads();
                });
            }

            slidesNav.find(ACTIVE_SEL).removeClass(ACTIVE);
            slidesNav.find('li').eq(slideIndex).find('a').addClass(ACTIVE);
        }

        //when resizing the site, we adjust the heights of the sections, slimScroll...
        $window.resize(resizeHandler);

        var previousHeight = windowsHeight;
        function resizeHandler(){
            //checking if it needs to get responsive
            responsive();

            // rebuild immediately on touch devices
            if (isTouchDevice) {
                var activeElement = $(document.activeElement);

                //if the keyboard is NOT visible
                if (!activeElement.is('textarea') && !activeElement.is('input') && !activeElement.is('select')) {
                    var currentHeight = $window.height();

                    //making sure the change in the viewport size is enough to force a rebuild. (20 % of the window to avoid problems when hidding scroll bars)
                    if( Math.abs(currentHeight - previousHeight) > (20 * Math.max(previousHeight, currentHeight) / 100) ){
                        FP.reBuild(true);
                        previousHeight = currentHeight;
                    }
                }
            }else{
                //in order to call the functions only when the resize is finished
                //http://stackoverflow.com/questions/4298612/jquery-how-to-call-resize-event-only-once-its-finished-resizing
                clearTimeout(resizeId);

                resizeId = setTimeout(function(){
                    FP.reBuild(true);
                }, 350);
            }
        }

        /**
        * Checks if the site needs to get responsive and disables autoScrolling if so.
        * A class `fp-responsive` is added to the plugin's container in case the user wants to use it for his own responsive CSS.
        */
        function responsive(){
            var widthLimit = options.responsive || options.responsiveWidth; //backwards compatiblity
            var heightLimit = options.responsiveHeight;

            if(widthLimit){
                FP.setResponsive($window.width() < widthLimit);
            }

            if(heightLimit){
                var isResponsive = container.hasClass(RESPONSIVE);

                //if its not already in responsive mode because of the `width` limit
                if(!isResponsive){
                    FP.setResponsive($window.height() < heightLimit);
                }
            }
        }

        /**
        * Adds transition animations for the given element
        */
        function addAnimation(element){
            var transition = 'all ' + options.scrollingSpeed + 'ms ' + options.easingcss3;

            element.removeClass(NO_TRANSITION);
            return element.css({
                '-webkit-transition': transition,
                'transition': transition
            });
        }

        /**
        * Remove transition animations for the given element
        */
        function removeAnimation(element){
            return element.addClass(NO_TRANSITION);
        }

        /**
         * Resizing of the font size depending on the window size as well as some of the images on the site.
         */
        function resizeMe(displayHeight, displayWidth) {
            //Standard dimensions, for which the body font size is correct
            var preferredHeight = 825;
            var preferredWidth = 900;

            if (displayHeight < preferredHeight || displayWidth < preferredWidth) {
                var heightPercentage = (displayHeight * 100) / preferredHeight;
                var widthPercentage = (displayWidth * 100) / preferredWidth;
                var percentage = Math.min(heightPercentage, widthPercentage);
                var newFontSize = percentage.toFixed(2);

                $body.css('font-size', newFontSize + '%');
            } else {
                $body.css('font-size', '100%');
            }
        }

        /**
         * Activating the website navigation dots according to the given slide name.
         */
        function activateNavDots(name, sectionIndex){
            if(options.navigation){
                $(SECTION_NAV_SEL).find(ACTIVE_SEL).removeClass(ACTIVE);
                if(name){
                    $(SECTION_NAV_SEL).find('a[href="#' + name + '"]').addClass(ACTIVE);
                }else{
                    $(SECTION_NAV_SEL).find('li').eq(sectionIndex).find('a').addClass(ACTIVE);
                }
            }
        }

        /**
         * Activating the website main menu elements according to the given slide name.
         */
        function activateMenuElement(name){
            if(options.menu){
                $(options.menu).find(ACTIVE_SEL).removeClass(ACTIVE);
                $(options.menu).find('[data-menuanchor="'+name+'"]').addClass(ACTIVE);
            }
        }

        function activateMenuAndNav(anchor, index){
            activateMenuElement(anchor);
            activateNavDots(anchor, index);
        }

        /**
        * Return a boolean depending on whether the scrollable element is at the end or at the start of the scrolling
        * depending on the given type.
        */
        function isScrolled(type, scrollable){
            if(type === 'top'){
                return !scrollable.scrollTop();
            }else if(type === 'bottom'){
                return scrollable.scrollTop() + 1 + scrollable.innerHeight() >= scrollable[0].scrollHeight;
            }
        }

        /**
        * Retuns `up` or `down` depending on the scrolling movement to reach its destination
        * from the current section.
        */
        function getYmovement(destiny){
            var fromIndex = $(SECTION_ACTIVE_SEL).index(SECTION_SEL);
            var toIndex = destiny.index(SECTION_SEL);
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'up';
            }
            return 'down';
        }

        /**
        * Retuns `right` or `left` depending on the scrolling movement to reach its destination
        * from the current slide.
        */
        function getXmovement(fromIndex, toIndex){
            if( fromIndex == toIndex){
                return 'none';
            }
            if(fromIndex > toIndex){
                return 'left';
            }
            return 'right';
        }


        function createSlimScrolling(element){
            //needed to make `scrollHeight` work under Opera 12
            element.css('overflow', 'hidden');

            //in case element is a slide
            var section = element.closest(SECTION_SEL);
            var scrollable = element.find(SCROLLABLE_SEL);
            var contentHeight;

            //if there was scroll, the contentHeight will be the one in the scrollable section
            if(scrollable.length){
                contentHeight = scrollable.get(0).scrollHeight;
            }else{
                contentHeight = element.get(0).scrollHeight;
                if(options.verticalCentered){
                    contentHeight = element.find(TABLE_CELL_SEL).get(0).scrollHeight;
                }
            }

            var scrollHeight = windowsHeight - parseInt(section.css('padding-bottom')) - parseInt(section.css('padding-top'));

            //needs scroll?
            if ( contentHeight > scrollHeight) {
                //was there already an scroll ? Updating it
                if(scrollable.length){
                    scrollable.css('height', scrollHeight + 'px').parent().css('height', scrollHeight + 'px');
                }
                //creating the scrolling
                else{
                    if(options.verticalCentered){
                        element.find(TABLE_CELL_SEL).wrapInner('<div class="' + SCROLLABLE + '" />');
                    }else{
                        element.wrapInner('<div class="' + SCROLLABLE + '" />');
                    }

                    element.find(SCROLLABLE_SEL).slimScroll({
                        allowPageScroll: true,
                        height: scrollHeight + 'px',
                        size: '10px',
                        alwaysVisible: true
                    });
                }
            }

            //removing the scrolling when it is not necessary anymore
            else{
                removeSlimScroll(element);
            }

            //undo
            element.css('overflow', '');
        }

        function removeSlimScroll(element){
            element.find(SCROLLABLE_SEL).children().first().unwrap().unwrap();
            element.find(SLIMSCROLL_BAR_SEL).remove();
            element.find(SLIMSCROLL_RAIL_SEL).remove();
        }

        function addTableClass(element){
            element.addClass(TABLE).wrapInner('<div class="' + TABLE_CELL + '" style="height:' + getTableHeight(element) + 'px;" />');
        }

        function getTableHeight(element){
            var sectionHeight = windowsHeight;

            if(options.paddingTop || options.paddingBottom){
                var section = element;
                if(!section.hasClass(SECTION)){
                    section = element.closest(SECTION_SEL);
                }

                var paddings = parseInt(section.css('padding-top')) + parseInt(section.css('padding-bottom'));
                sectionHeight = (windowsHeight - paddings);
            }

            return sectionHeight;
        }

        /**
        * Adds a css3 transform property to the container class with or without animation depending on the animated param.
        */
        function transformContainer(translate3d, animated){
            if(animated){
                addAnimation(container);
            }else{
                removeAnimation(container);
            }

            container.css(getTransforms(translate3d));

            //syncronously removing the class after the animation has been applied.
            setTimeout(function(){
                container.removeClass(NO_TRANSITION);
            },10);
        }

        /**
        * Gets a section by its anchor / index
        */
        function getSectionByAnchor(sectionAnchor){
            //section
            var section = $(SECTION_SEL + '[data-anchor="'+sectionAnchor+'"]');
            if(!section.length){
                section = $(SECTION_SEL).eq( (sectionAnchor -1) );
            }

            return section;
        }

        /**
        * Gets a slide inside a given section by its anchor / index
        */
        function getSlideByAnchor(slideAnchor, section){
            var slides = section.find(SLIDES_WRAPPER_SEL);
            var slide =  slides.find(SLIDE_SEL + '[data-anchor="'+slideAnchor+'"]');

            if(!slide.length){
                slide = slides.find(SLIDE_SEL).eq(slideAnchor);
            }

            return slide;
        }

        /**
        * Scrolls to the given section and slide anchors
        */
        function scrollPageAndSlide(destiny, slide){
            var section = getSectionByAnchor(destiny);

            //default slide
            if (typeof slide === 'undefined') {
                slide = 0;
            }

            //we need to scroll to the section and then to the slide
            if (destiny !== lastScrolledDestiny && !section.hasClass(ACTIVE)){
                scrollPage(section, function(){
                    scrollSlider(section, slide);
                });
            }
            //if we were already in the section
            else{
                scrollSlider(section, slide);
            }
        }

        /**
        * Scrolls the slider to the given slide destination for the given section
        */
        function scrollSlider(section, slideAnchor){
            if(typeof slideAnchor !== 'undefined'){
                var slides = section.find(SLIDES_WRAPPER_SEL);
                var destiny =  getSlideByAnchor(slideAnchor, section);

                if(destiny.length){
                    landscapeScroll(slides, destiny);
                }
            }
        }

        /**
        * Creates a landscape navigation bar with dots for horizontal sliders.
        */
        function addSlidesNavigation(section, numSlides){
            section.append('<div class="' + SLIDES_NAV + '"><ul></ul></div>');
            var nav = section.find(SLIDES_NAV_SEL);

            //top or bottom
            nav.addClass(options.slidesNavPosition);

            for(var i=0; i< numSlides; i++){
                nav.find('ul').append('<li><a href="#"><span></span></a></li>');
            }

            //centering it
            nav.css('margin-left', '-' + (nav.width()/2) + 'px');

            nav.find('li').first().find('a').addClass(ACTIVE);
        }


        /**
        * Sets the state of the website depending on the active section/slide.
        * It changes the URL hash when needed and updates the body class.
        */
        function setState(slideIndex, slideAnchor, anchorLink, sectionIndex){
            var sectionHash = '';

            if(options.anchors.length && !options.lockAnchors){

                //isn't it the first slide?
                if(slideIndex){
                    if(typeof anchorLink !== 'undefined'){
                        sectionHash = anchorLink;
                    }

                    //slide without anchor link? We take the index instead.
                    if(typeof slideAnchor === 'undefined'){
                        slideAnchor = slideIndex;
                    }

                    lastScrolledSlide = slideAnchor;
                    setUrlHash(sectionHash + '/' + slideAnchor);

                //first slide won't have slide anchor, just the section one
                }else if(typeof slideIndex !== 'undefined'){
                    lastScrolledSlide = slideAnchor;
                    setUrlHash(anchorLink);
                }

                //section without slides
                else{
                    setUrlHash(anchorLink);
                }
            }

            setBodyClass();
        }

        /**
        * Sets the URL hash.
        */
        function setUrlHash(url){
            if(options.recordHistory){
                location.hash = url;
            }else{
                //Mobile Chrome doesn't work the normal way, so... lets use HTML5 for phones :)
                if(isTouchDevice || isTouch){
                    history.replaceState(undefined, undefined, '#' + url);
                }else{
                    var baseUrl = window.location.href.split('#')[0];
                    window.location.replace( baseUrl + '#' + url );
                }
            }
        }

        /**
        * Gets the anchor for the given slide. Its index will be used if there's none.
        */
        function getSlideAnchor(slide){
            var slideAnchor = slide.data('anchor');
            var slideIndex = slide.index();

            //Slide without anchor link? We take the index instead.
            if(typeof slideAnchor === 'undefined'){
                slideAnchor = slideIndex;
            }

            return slideAnchor;
        }

        /**
        * Sets a class for the body of the page depending on the active section / slide
        */
        function setBodyClass(){
            var section = $(SECTION_ACTIVE_SEL);
            var slide = section.find(SLIDE_ACTIVE_SEL);

            var sectionAnchor = section.data('anchor');
            var slideAnchor = getSlideAnchor(slide);

            var sectionIndex = section.index(SECTION_SEL);

            var text = String(sectionIndex);

            if(options.anchors.length){
                text = sectionAnchor;
            }

            if(slide.length){
                text = text + '-' + slideAnchor;
            }

            //changing slash for dash to make it a valid CSS style
            text = text.replace('/', '-').replace('#','');

            //removing previous anchor classes
            var classRe = new RegExp('\\b\\s?' + VIEWING_PREFIX + '-[^\\s]+\\b', "g");
            $body[0].className = $body[0].className.replace(classRe, '');

            //adding the current anchor
            $body.addClass(VIEWING_PREFIX + '-' + text);
        }

        /**
        * Checks for translate3d support
        * @return boolean
        * http://stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
        */
        function support3d() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform':'-webkit-transform',
                    'OTransform':'-o-transform',
                    'msTransform':'-ms-transform',
                    'MozTransform':'-moz-transform',
                    'transform':'transform'
                };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return (has3d !== undefined && has3d.length > 0 && has3d !== 'none');
        }

        /**
        * Removes the auto scrolling action fired by the mouse wheel and trackpad.
        * After this function is called, the mousewheel and trackpad movements won't scroll through sections.
        */
        function removeMouseWheelHandler(){
            if (document.addEventListener) {
                document.removeEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.removeEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.removeEventListener('DOMMouseScroll', MouseWheelHandler, false); //old Firefox
            } else {
                document.detachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the auto scrolling action for the mouse wheel and trackpad.
        * After this function is called, the mousewheel and trackpad movements will scroll through sections
        */
        function addMouseWheelHandler(){
            if (document.addEventListener) {
                document.addEventListener('mousewheel', MouseWheelHandler, false); //IE9, Chrome, Safari, Oper
                document.addEventListener('wheel', MouseWheelHandler, false); //Firefox
                document.addEventListener('DOMMouseScroll', MouseWheelHandler, false); //Old Firefox
            } else {
                document.attachEvent('onmousewheel', MouseWheelHandler); //IE 6/7/8
            }
        }

        /**
        * Adds the possibility to auto scroll through sections on touch devices.
        */
        function addTouchHandler(){
            if(isTouchDevice || isTouch){
                //Microsoft pointers
                var MSPointer = getMSPointer();

                $(WRAPPER_SEL).off('touchstart ' +  MSPointer.down).on('touchstart ' + MSPointer.down, touchStartHandler);
                $(WRAPPER_SEL).off('touchmove ' + MSPointer.move).on('touchmove ' + MSPointer.move, touchMoveHandler);
            }
        }

        /**
        * Removes the auto scrolling for touch devices.
        */
        function removeTouchHandler(){
            if(isTouchDevice || isTouch){
                //Microsoft pointers
                var MSPointer = getMSPointer();

                $(WRAPPER_SEL).off('touchstart ' + MSPointer.down);
                $(WRAPPER_SEL).off('touchmove ' + MSPointer.move);
            }
        }

        /*
        * Returns and object with Microsoft pointers (for IE<11 and for IE >= 11)
        * http://msdn.microsoft.com/en-us/library/ie/dn304886(v=vs.85).aspx
        */
        function getMSPointer(){
            var pointer;

            //IE >= 11 & rest of browsers
            if(window.PointerEvent){
                pointer = { down: 'pointerdown', move: 'pointermove'};
            }

            //IE < 11
            else{
                pointer = { down: 'MSPointerDown', move: 'MSPointerMove'};
            }

            return pointer;
        }

        /**
        * Gets the pageX and pageY properties depending on the browser.
        * https://github.com/alvarotrigo/fullPage.js/issues/194#issuecomment-34069854
        */
        function getEventsPage(e){
            var events = [];

            events.y = (typeof e.pageY !== 'undefined' && (e.pageY || e.pageX) ? e.pageY : e.touches[0].pageY);
            events.x = (typeof e.pageX !== 'undefined' && (e.pageY || e.pageX) ? e.pageX : e.touches[0].pageX);

            //in touch devices with scrollBar:true, e.pageY is detected, but we have to deal with touch events. #1008
            if(isTouch && isReallyTouch(e) && options.scrollBar){
                events.y = e.touches[0].pageY;
                events.x = e.touches[0].pageX;
            }

            return events;
        }

        /**
        * Slides silently (with no animation) the active slider to the given slide.
        */
        function silentLandscapeScroll(activeSlide, noCallbacks){
            FP.setScrollingSpeed (0, 'internal');

            if(typeof noCallbacks !== 'undefined'){
                //preventing firing callbacks afterSlideLoad etc.
                isResizing = true;
            }

            landscapeScroll(activeSlide.closest(SLIDES_WRAPPER_SEL), activeSlide);

            if(typeof noCallbacks !== 'undefined'){
                isResizing = false;
            }

            FP.setScrollingSpeed(originals.scrollingSpeed, 'internal');
        }

        /**
        * Scrolls silently (with no animation) the page to the given Y position.
        */
        function silentScroll(top){
            if(options.scrollBar){
                container.scrollTop(top);
            }
            else if (options.css3) {
                var translate3d = 'translate3d(0px, -' + top + 'px, 0px)';
                transformContainer(translate3d, false);
            }
            else {
                container.css('top', -top);
            }
        }

        /**
        * Returns the cross-browser transform string.
        */
        function getTransforms(translate3d){
            return {
                '-webkit-transform': translate3d,
                '-moz-transform': translate3d,
                '-ms-transform':translate3d,
                'transform': translate3d
            };
        }

        /**
        * Allowing or disallowing the mouse/swipe scroll in a given direction. (not for keyboard)
        * @type  m (mouse) or k (keyboard)
        */
        function setIsScrollAllowed(value, direction, type){
            switch (direction){
                case 'up': isScrollAllowed[type].up = value; break;
                case 'down': isScrollAllowed[type].down = value; break;
                case 'left': isScrollAllowed[type].left = value; break;
                case 'right': isScrollAllowed[type].right = value; break;
                case 'all':
                    if(type == 'm'){
                        FP.setAllowScrolling(value);
                    }else{
                        FP.setKeyboardScrolling(value);
                    }
            }
        }

        /*
        * Destroys fullpage.js plugin events and optinally its html markup and styles
        */
        FP.destroy = function(all){
            FP.setAutoScrolling(false, 'internal');
            FP.setAllowScrolling(false);
            FP.setKeyboardScrolling(false);
            container.addClass(DESTROYED);

            clearTimeout(afterSlideLoadsId);
            clearTimeout(afterSectionLoadsId);
            clearTimeout(resizeId);
            clearTimeout(scrollId);
            clearTimeout(scrollId2);

            $window
                .off('scroll', scrollHandler)
                .off('hashchange', hashChangeHandler)
                .off('resize', resizeHandler);

            $document
                .off('click', SECTION_NAV_SEL + ' a')
                .off('mouseenter', SECTION_NAV_SEL + ' li')
                .off('mouseleave', SECTION_NAV_SEL + ' li')
                .off('click', SLIDES_NAV_LINK_SEL)
                .off('mouseover', options.normalScrollElements)
                .off('mouseout', options.normalScrollElements);

            $(SECTION_SEL)
                .off('click', SLIDES_ARROW_SEL);

            //lets make a mess!
            if(all){
                destroyStructure();
            }
        };

        /*
        * Removes inline styles added by fullpage.js
        */
        function destroyStructure(){
            //reseting the `top` or `translate` properties to 0
            silentScroll(0);

            $(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL).remove();

            //removing inline styles
            $(SECTION_SEL).css( {
                'height': '',
                'background-color' : '',
                'padding': ''
            });

            $(SLIDE_SEL).css( {
                'width': ''
            });

            container.css({
                'height': '',
                'position': '',
                '-ms-touch-action': '',
                'touch-action': ''
            });

            //removing added classes
            $(SECTION_SEL + ', ' + SLIDE_SEL).each(function(){
                removeSlimScroll($(this));
                $(this).removeClass(TABLE + ' ' + ACTIVE);
            });

            removeAnimation(container);

            //Unwrapping content
            container.find(TABLE_CELL_SEL + ', ' + SLIDES_CONTAINER_SEL + ', ' + SLIDES_WRAPPER_SEL).each(function(){
                //unwrap not being use in case there's no child element inside and its just text
                $(this).replaceWith(this.childNodes);
            });

            //scrolling the page to the top with no animation
            $htmlBody.scrollTop(0);
        }

        /*
        * Sets the state for a variable with multiple states (original, and temporal)
        * Some variables such as `autoScrolling` or `recordHistory` might change automatically its state when using `responsive` or `autoScrolling:false`.
        * This function is used to keep track of both states, the original and the temporal one.
        * If type is not 'internal', then we assume the user is globally changing the variable.
        */
        function setVariableState(variable, value, type){
            options[variable] = value;
            if(type !== 'internal'){
                originals[variable] = value;
            }
        }

        /**
        * Displays warnings
        */
        function displayWarnings(){
            // Disable mutually exclusive settings
            if (options.continuousVertical &&
                (options.loopTop || options.loopBottom)) {
                options.continuousVertical = false;
                showError('warn', 'Option `loopTop/loopBottom` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            if(options.scrollBar && options.scrollOverflow){
                showError('warn', 'Option `scrollBar` is mutually exclusive with `scrollOverflow`. Sections with scrollOverflow might not work well in Firefox');
            }

            if(options.continuousVertical && options.scrollBar){
                options.continuousVertical = false;
                showError('warn', 'Option `scrollBar` is mutually exclusive with `continuousVertical`; `continuousVertical` disabled');
            }

            //anchors can not have the same value as any element ID or NAME
            $.each(options.anchors, function(index, name){
                if($('#' + name).length || $('[name="'+name+'"]').length ){
                    showError('error', 'data-anchor tags can not have the same value as any `id` element on the site (or `name` element for IE).');
                }
            });
        }

        /**
        * Shows a message in the console of the given type.
        */
        function showError(type, text){
            console && console[type] && console[type]('fullPage: ' + text);
        }
    };
});

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

/*!
 * SVG Morpheus v0.1.8
 * https://github.com/alexk111/SVG-Morpheus
 *
 * Copyright (c) 2014 Alex Kaul
 * License: MIT
 *
 * Generated at Tuesday, December 2nd, 2014, 11:12:16 AM
 */



var SVGMorpheus=(function() {
'use strict';

/*
 * Easing functions
 */

var easings={};
easings['circ-in']=function (t) {
  return -1 * (Math.sqrt(1 - t*t) - 1);
};
easings['circ-out']=function (t) {
  return Math.sqrt(1 - (t=t-1)*t);
};
easings['circ-in-out']=function (t) {
  if ((t/=1/2) < 1) return -1/2 * (Math.sqrt(1 - t*t) - 1);
  return 1/2 * (Math.sqrt(1 - (t-=2)*t) + 1);
};
easings['cubic-in']=function (t) { return t*t*t };
easings['cubic-out']=function (t) { return (--t)*t*t+1 };
easings['cubic-in-out']=function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 };
easings['elastic-in']=function (t) {
  var s=1.70158;var p=0;var a=1;
  if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
  if (a < Math.abs(1)) { a=1; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (1/a);
  return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
};
easings['elastic-out']=function (t) {
  var s=1.70158;var p=0;var a=1;
  if (t==0) return 0;  if (t==1) return 1;  if (!p) p=.3;
  if (a < Math.abs(1)) { a=1; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (1/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t-s)*(2*Math.PI)/p ) + 1;
};
easings['elastic-in-out']=function (t) {
  var s=1.70158;var p=0;var a=1;
  if (t==0) return 0;  if ((t/=1/2)==2) return 1;  if (!p) p=1*(.3*1.5);
  if (a < Math.abs(1)) { a=1; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (1/a);
  if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p ));
  return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t-s)*(2*Math.PI)/p )*.5 + 1;
};
easings['expo-in']=function (t) {
  return (t==0) ? 0 : Math.pow(2, 10 * (t - 1));
};
easings['expo-out']=function (t) {
  return (t==1) ? 1 : 1-Math.pow(2, -10 * t);
};
easings['expo-in-out']=function (t) {
  if (t==0) return 0;
  if (t==1) return 1;
  if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
  return 1/2 * (-Math.pow(2, -10 * --t) + 2);
};
easings['linear']=function (t) { return t };
easings['quad-in']=function (t) { return t*t };
easings['quad-out']=function (t) { return t*(2-t) };
easings['quad-in-out']=function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t };
easings['quart-in']=function (t) { return t*t*t*t };
easings['quart-out']=function (t) { return 1-(--t)*t*t*t };
easings['quart-in-out']=function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t };
easings['quint-in']=function (t) { return t*t*t*t*t };
easings['quint-out']=function (t) { return 1+(--t)*t*t*t*t };
easings['quint-in-out']=function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t };
easings['sine-in']=function (t) {
  return 1-Math.cos(t * (Math.PI/2));
};
easings['sine-out']=function (t) {
  return Math.sin(t * (Math.PI/2));
};
easings['sine-in-out']=function (t) {
  return 1/2 * (1-Math.cos(Math.PI*t));
};


/*
 * Helper functions
 */

var _reqAnimFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame;
var _cancelAnimFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.oCancelAnimationFrame;

// Calculate style
function styleNormCalc(styleNormFrom, styleNormTo, progress) {
  var i, len, styleNorm={};
  for(i in styleNormFrom) {
    switch (i) {
      case 'fill':
      case 'stroke':
        styleNorm[i]=clone(styleNormFrom[i]);
        styleNorm[i].r=styleNormFrom[i].r+(styleNormTo[i].r-styleNormFrom[i].r)*progress;
        styleNorm[i].g=styleNormFrom[i].g+(styleNormTo[i].g-styleNormFrom[i].g)*progress;
        styleNorm[i].b=styleNormFrom[i].b+(styleNormTo[i].b-styleNormFrom[i].b)*progress;
        styleNorm[i].opacity=styleNormFrom[i].opacity+(styleNormTo[i].opacity-styleNormFrom[i].opacity)*progress;
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[i]=styleNormFrom[i]+(styleNormTo[i]-styleNormFrom[i])*progress;
        break;
    }
  }
  return styleNorm;
}

function styleNormToString(styleNorm) {
  var i;
  var style={};
  for(i in styleNorm) {
    switch (i) {
      case 'fill':
      case 'stroke':
        style[i]=rgbToString(styleNorm[i]);
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        style[i]=styleNorm[i];
        break;
    }
  }
  return style;
}

function styleToNorm(styleFrom, styleTo) {
  var styleNorm=[{},{}];
  var i;
  for(i in styleFrom) {
    switch(i) {
      case 'fill':
      case 'stroke':
        styleNorm[0][i]=getRGB(styleFrom[i]);
        if(styleTo[i]===undefined) {
          styleNorm[1][i]=getRGB(styleFrom[i]);
          styleNorm[1][i].opacity=0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[0][i]=styleFrom[i];
        if(styleTo[i]===undefined) {
          styleNorm[1][i]=1;
        }
        break;
    }
  }
  for(i in styleTo) {
    switch(i) {
      case 'fill':
      case 'stroke':
        styleNorm[1][i]=getRGB(styleTo[i]);
        if(styleFrom[i]===undefined) {
          styleNorm[0][i]=getRGB(styleTo[i]);
          styleNorm[0][i].opacity=0;
        }
        break;
      case 'opacity':
      case 'fill-opacity':
      case 'stroke-opacity':
      case 'stroke-width':
        styleNorm[1][i]=styleTo[i];
        if(styleFrom[i]===undefined) {
          styleNorm[0][i]=1;
        }
        break;
    }
  }
  return styleNorm;
}

// Calculate transform progress
function transCalc(transFrom, transTo, progress) {
  var res={};
  for(var i in transFrom) {
    switch(i) {
      case 'rotate':
        res[i]=[0,0,0];
        for(var j=0;j<3;j++) {
          res[i][j]=transFrom[i][j]+(transTo[i][j]-transFrom[i][j])*progress;
        }
        break;
    }
  }
  return res;
}

function trans2string(trans) {
  var res='';
  if(!!trans.rotate) {
    res+='rotate('+trans.rotate.join(' ')+')';
  }
  return res;
}

// Calculate curve progress
function curveCalc(curveFrom, curveTo, progress) {
  var curve=[];
  for(var i=0,len1=curveFrom.length;i<len1;i++) {
    curve.push([curveFrom[i][0]]);
    for(var j=1,len2=curveFrom[i].length;j<len2;j++) {
      curve[i].push(curveFrom[i][j]+(curveTo[i][j]-curveFrom[i][j])*progress);
    }
  }
  return curve;
}

function clone(obj) {
  var copy;

  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr]);
      }
    }
    return copy;
  }

  return obj;
}



/*
 * Useful things from Adobe's Snap.svg adopted to the library needs
 */

/*
 * Paths
 */

var spaces = "\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029";
var pathCommand = new RegExp("([a-z])[" + spaces + ",]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[" + spaces + "]*,?[" + spaces + "]*)+)", "ig");
var pathValues = new RegExp("(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[" + spaces + "]*,?[" + spaces + "]*", "ig");

// Parses given path string into an array of arrays of path segments
var parsePathString = function (pathString) {
  if (!pathString) {
    return null;
  }

  if(typeof pathString === typeof []) {
    return pathString;
  } else {
    var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [];

    String(pathString).replace(pathCommand, function (a, b, c) {
      var params = [],
          name = b.toLowerCase();
      c.replace(pathValues, function (a, b) {
        b && params.push(+b);
      });
      if (name == "m" && params.length > 2) {
        data.push([b].concat(params.splice(0, 2)));
        name = "l";
        b = b == "m" ? "l" : "L";
      }
      if (name == "o" && params.length == 1) {
        data.push([b, params[0]]);
      }
      if (name == "r") {
        data.push([b].concat(params));
      } else while (params.length >= paramCounts[name]) {
        data.push([b].concat(params.splice(0, paramCounts[name])));
        if (!paramCounts[name]) {
          break;
        }
      }
    });

    return data;
  }
};

// http://schepers.cc/getting-to-the-point
var catmullRom2bezier=function(crp, z) {
  var d = [];
  for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
    var p = [
              {x: +crp[i - 2], y: +crp[i - 1]},
              {x: +crp[i],     y: +crp[i + 1]},
              {x: +crp[i + 2], y: +crp[i + 3]},
              {x: +crp[i + 4], y: +crp[i + 5]}
            ];
    if (z) {
      if (!i) {
        p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
      } else if (iLen - 4 == i) {
        p[3] = {x: +crp[0], y: +crp[1]};
      } else if (iLen - 2 == i) {
        p[2] = {x: +crp[0], y: +crp[1]};
        p[3] = {x: +crp[2], y: +crp[3]};
      }
    } else {
      if (iLen - 4 == i) {
        p[3] = p[2];
      } else if (!i) {
        p[0] = {x: +crp[i], y: +crp[i + 1]};
      }
    }
    d.push(["C",
          (-p[0].x + 6 * p[1].x + p[2].x) / 6,
          (-p[0].y + 6 * p[1].y + p[2].y) / 6,
          (p[1].x + 6 * p[2].x - p[3].x) / 6,
          (p[1].y + 6*p[2].y - p[3].y) / 6,
          p[2].x,
          p[2].y
    ]);
  }

  return d;

};

var ellipsePath=function(x, y, rx, ry, a) {
  if (a == null && ry == null) {
    ry = rx;
  }
  x = +x;
  y = +y;
  rx = +rx;
  ry = +ry;
  if (a != null) {
    var rad = Math.PI / 180,
        x1 = x + rx * Math.cos(-ry * rad),
        x2 = x + rx * Math.cos(-a * rad),
        y1 = y + rx * Math.sin(-ry * rad),
        y2 = y + rx * Math.sin(-a * rad),
        res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
  } else {
    res = [
        ["M", x, y],
        ["m", 0, -ry],
        ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
        ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
        ["z"]
    ];
  }
  return res;
};

var pathToAbsolute=function(pathArray) {
  pathArray = parsePathString(pathArray);

  if (!pathArray || !pathArray.length) {
    return [["M", 0, 0]];
  }
  var res = [],
      x = 0,
      y = 0,
      mx = 0,
      my = 0,
      start = 0,
      pa0;
  if (pathArray[0][0] == "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = ["M", x, y];
  }
  var crz = pathArray.length == 3 &&
      pathArray[0][0] == "M" &&
      pathArray[1][0].toUpperCase() == "R" &&
      pathArray[2][0].toUpperCase() == "Z";
  for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
    res.push(r = []);
    pa = pathArray[i];
    pa0 = pa[0];
    if (pa0 != pa0.toUpperCase()) {
      r[0] = pa0.toUpperCase();
      switch (r[0]) {
        case "A":
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +pa[6] + x;
          r[7] = +pa[7] + y;
          break;
        case "V":
          r[1] = +pa[1] + y;
          break;
        case "H":
          r[1] = +pa[1] + x;
          break;
        case "R":
          var dots = [x, y].concat(pa.slice(1));
          for (var j = 2, jj = dots.length; j < jj; j++) {
            dots[j] = +dots[j] + x;
            dots[++j] = +dots[j] + y;
          }
          res.pop();
          res = res.concat(catmullRom2bezier(dots, crz));
          break;
        case "O":
          res.pop();
          dots = ellipsePath(x, y, pa[1], pa[2]);
          dots.push(dots[0]);
          res = res.concat(dots);
          break;
        case "U":
          res.pop();
          res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
          r = ["U"].concat(res[res.length - 1].slice(-2));
          break;
        case "M":
          mx = +pa[1] + x;
          my = +pa[2] + y;
        default:
          for (j = 1, jj = pa.length; j < jj; j++) {
            r[j] = +pa[j] + ((j % 2) ? x : y);
          }
      }
    } else if (pa0 == "R") {
      dots = [x, y].concat(pa.slice(1));
      res.pop();
      res = res.concat(catmullRom2bezier(dots, crz));
      r = ["R"].concat(pa.slice(-2));
    } else if (pa0 == "O") {
      res.pop();
      dots = ellipsePath(x, y, pa[1], pa[2]);
      dots.push(dots[0]);
      res = res.concat(dots);
    } else if (pa0 == "U") {
      res.pop();
      res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
      r = ["U"].concat(res[res.length - 1].slice(-2));
    } else {
      for (var k = 0, kk = pa.length; k < kk; k++) {
        r[k] = pa[k];
      }
    }
    pa0 = pa0.toUpperCase();
    if (pa0 != "O") {
      switch (r[0]) {
        case "Z":
          x = +mx;
          y = +my;
          break;
        case "H":
          x = r[1];
          break;
        case "V":
          y = r[1];
          break;
        case "M":
          mx = r[r.length - 2];
          my = r[r.length - 1];
        default:
          x = r[r.length - 2];
          y = r[r.length - 1];
      }
    }
  }

  return res;
};

var l2c = function(x1, y1, x2, y2) {
  return [x1, y1, x2, y2, x2, y2];
};
var q2c = function(x1, y1, ax, ay, x2, y2) {
  var _13 = 1 / 3,
      _23 = 2 / 3;
  return [
          _13 * x1 + _23 * ax,
          _13 * y1 + _23 * ay,
          _13 * x2 + _23 * ax,
          _13 * y2 + _23 * ay,
          x2,
          y2
      ];
};
var a2c = function(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
  // for more information of where this math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  var _120 = Math.PI * 120 / 180,
      rad = Math.PI / 180 * (+angle || 0),
      res = [],
      xy,
      rotate = function (x, y, rad) {
          var X = x * Math.cos(rad) - y * Math.sin(rad),
              Y = x * Math.sin(rad) + y * Math.cos(rad);
          return {x: X, y: Y};
      };
  if (!recursive) {
    xy = rotate(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotate(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;
    var cos = Math.cos(Math.PI / 180 * angle),
        sin = Math.sin(Math.PI / 180 * angle),
        x = (x1 - x2) / 2,
        y = (y1 - y2) / 2;
    var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    var rx2 = rx * rx,
        ry2 = ry * ry,
        k = (large_arc_flag == sweep_flag ? -1 : 1) *
            Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
        cx = k * rx * y / ry + (x1 + x2) / 2,
        cy = k * -ry * x / rx + (y1 + y2) / 2,
        f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
        f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    f1 < 0 && (f1 = Math.PI * 2 + f1);
    f2 < 0 && (f2 = Math.PI * 2 + f2);
    if (sweep_flag && f1 > f2) {
      f1 = f1 - Math.PI * 2;
    }
    if (!sweep_flag && f2 > f1) {
      f2 = f2 - Math.PI * 2;
    }
  } else {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  }
  var df = f2 - f1;
  if (Math.abs(df) > _120) {
    var f2old = f2,
        x2old = x2,
        y2old = y2;
    f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  var c1 = Math.cos(f1),
      s1 = Math.sin(f1),
      c2 = Math.cos(f2),
      s2 = Math.sin(f2),
      t = Math.tan(df / 4),
      hx = 4 / 3 * rx * t,
      hy = 4 / 3 * ry * t,
      m1 = [x1, y1],
      m2 = [x1 + hx * s1, y1 - hy * c1],
      m3 = [x2 + hx * s2, y2 - hy * c2],
      m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [m2, m3, m4].concat(res);
  } else {
    res = [m2, m3, m4].concat(res).join().split(",");
    var newres = [];
    for (var i = 0, ii = res.length; i < ii; i++) {
      newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
    }
    return newres;
  }
};

var path2curve=function(path, path2) {
  var p = pathToAbsolute(path),
      p2 = path2 && pathToAbsolute(path2),
      attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      processPath = function (path, d, pcom) {
        var nx, ny;
        if (!path) {
          return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
        }
        !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
        switch (path[0]) {
          case "M":
            d.X = path[1];
            d.Y = path[2];
            break;
          case "A":
            path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
            break;
          case "S":
            if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
              nx = d.x * 2 - d.bx;          // And reflect the previous
              ny = d.y * 2 - d.by;          // command's control point relative to the current point.
            }
            else {                            // or some else or nothing
              nx = d.x;
              ny = d.y;
            }
            path = ["C", nx, ny].concat(path.slice(1));
            break;
          case "T":
            if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
              d.qx = d.x * 2 - d.qx;        // And make a reflection similar
              d.qy = d.y * 2 - d.qy;        // to case "S".
            }
            else {                            // or something else or nothing
              d.qx = d.x;
              d.qy = d.y;
            }
            path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
            break;
          case "Q":
            d.qx = path[1];
            d.qy = path[2];
            path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
            break;
          case "L":
            path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
            break;
          case "H":
            path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
            break;
          case "V":
            path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
            break;
          case "Z":
            path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
            break;
        }
        return path;
      },
      fixArc = function (pp, i) {
        if (pp[i].length > 7) {
          pp[i].shift();
          var pi = pp[i];
          while (pi.length) {
            pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
            p2 && (pcoms2[i] = "A"); // the same as above
            pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
          }
          pp.splice(i, 1);
          ii = Math.max(p.length, p2 && p2.length || 0);
        }
      },
      fixM = function (path1, path2, a1, a2, i) {
        if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
          path2.splice(i, 0, ["M", a2.x, a2.y]);
          a1.bx = 0;
          a1.by = 0;
          a1.x = path1[i][1];
          a1.y = path1[i][2];
          ii = Math.max(p.length, p2 && p2.length || 0);
        }
      },
      pcoms1 = [], // path commands of original path p
      pcoms2 = [], // path commands of original path p2
      pfirst = "", // temporary holder for original path command
      pcom = ""; // holder for previous path command of original path
  for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
    p[i] && (pfirst = p[i][0]); // save current path command

    if (pfirst != "C") { // C is not saved yet, because it may be result of conversion
      pcoms1[i] = pfirst; // Save current path command
      i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
    }
    p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

    if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
    // which may produce multiple C:s
    // so we have to make sure that C is also C in original path

    fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

    if (p2) { // the same procedures is done to p2
      p2[i] && (pfirst = p2[i][0]);
      if (pfirst != "C") {
        pcoms2[i] = pfirst;
        i && (pcom = pcoms2[i - 1]);
      }
      p2[i] = processPath(p2[i], attrs2, pcom);

      if (pcoms2[i] != "A" && pfirst == "C") {
        pcoms2[i] = "C";
      }

      fixArc(p2, i);
    }
    fixM(p, p2, attrs, attrs2, i);
    fixM(p2, p, attrs2, attrs, i);
    var seg = p[i],
        seg2 = p2 && p2[i],
        seglen = seg.length,
        seg2len = p2 && seg2.length;
    attrs.x = seg[seglen - 2];
    attrs.y = seg[seglen - 1];
    attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
    attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
    attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
    attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
    attrs2.x = p2 && seg2[seg2len - 2];
    attrs2.y = p2 && seg2[seg2len - 1];
  }

  return p2 ? [p, p2] : p;
};

var box=function(x, y, width, height) {
  if (x == null) {
    x = y = width = height = 0;
  }
  if (y == null) {
    y = x.y;
    width = x.width;
    height = x.height;
    x = x.x;
  }
  return {
    x: x,
    y: y,
    w: width,
    h: height,
    cx: x + width / 2,
    cy: y + height / 2
  };
};

// Returns bounding box of cubic bezier curve.
// Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
// Original version: NISHIO Hirokazu
// Modifications: https://github.com/timo22345
var curveDim=function(x0, y0, x1, y1, x2, y2, x3, y3) {
  var tvalues = [],
      bounds = [[], []],
      a, b, c, t, t1, t2, b2ac, sqrtb2ac;
  for (var i = 0; i < 2; ++i) {
    if (i == 0) {
      b = 6 * x0 - 12 * x1 + 6 * x2;
      a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
      c = 3 * x1 - 3 * x0;
    } else {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }
    if (Math.abs(a) < 1e-12) {
      if (Math.abs(b) < 1e-12) {
        continue;
      }
      t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    b2ac = b * b - 4 * c * a;
    sqrtb2ac = Math.sqrt(b2ac);
    if (b2ac < 0) {
      continue;
    }
    t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  var x, y, j = tvalues.length,
      jlen = j,
      mt;
  while (j--) {
    t = tvalues[j];
    mt = 1 - t;
    bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
    bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  bounds[0].length = bounds[1].length = jlen + 2;

  return {
    min: {x: Math.min.apply(0, bounds[0]), y: Math.min.apply(0, bounds[1])},
    max: {x: Math.max.apply(0, bounds[0]), y: Math.max.apply(0, bounds[1])}
  };
};

var curvePathBBox=function(path) {
  var x = 0,
      y = 0,
      X = [],
      Y = [],
      p;
  for (var i = 0, ii = path.length; i < ii; i++) {
    p = path[i];
    if (p[0] == "M") {
      x = p[1];
      y = p[2];
      X.push(x);
      Y.push(y);
    } else {
      var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
      X = X.concat(dim.min.x, dim.max.x);
      Y = Y.concat(dim.min.y, dim.max.y);
      x = p[5];
      y = p[6];
    }
  }
  var xmin = Math.min.apply(0, X),
      ymin = Math.min.apply(0, Y),
      xmax = Math.max.apply(0, X),
      ymax = Math.max.apply(0, Y),
      bb = box(xmin, ymin, xmax - xmin, ymax - ymin);

  return bb;
};

var p2s=/,?([a-z]),?/gi;
var path2string=function(path) {
  return path.join(',').replace(p2s, "$1");
};

/*
 * Styles
 */

var hsrg = {hs: 1, rg: 1},
    has = "hasOwnProperty",
    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
    commaSpaces = new RegExp("[" + spaces + "]*,[" + spaces + "]*");

// Converts RGB values to a hex representation of the color
// var rgb = function (r, g, b, o) {
//   if (isFinite(o)) {
//     var round = math.round;
//     return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
//   }
//   return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
// };
var rgbToString = function (rgb) {
  var round = Math.round;
  return "rgba(" + [round(rgb.r), round(rgb.g), round(rgb.b), +rgb.opacity.toFixed(2)] + ")";
};
var toHex = function (color) {
  var i = window.document.getElementsByTagName("head")[0] || window.document.getElementsByTagName("svg")[0],
      red = "rgb(255, 0, 0)";
  toHex = function (color) {
    if (color.toLowerCase() == "red") {
      return red;
    }
    i.style.color = red;
    i.style.color = color;
    var out = window.document.defaultView.getComputedStyle(i, "").getPropertyValue("color");
    return out == red ? null : out;
  };
  return toHex(color);
};

var packageRGB = function (r, g, b, o) {
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  var rgb = {
      r: r,
      g: g,
      b: b,
      opacity: isFinite(o) ? o : 1
  };
  return rgb;
};

// Converts HSB values to an RGB object
var hsb2rgb = function (h, s, v, o) {
  if (typeof h === typeof {} && "h" in h && "s" in h && "b" in h) {
      v = h.b;
      s = h.s;
      h = h.h;
      o = h.o;
  }
  h *= 360;
  var R, G, B, X, C;
  h = (h % 360) / 60;
  C = v * s;
  X = C * (1 - Math.abs(h % 2 - 1));
  R = G = B = v - C;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];
  return packageRGB(R, G, B, o);
};

// Converts HSL values to an RGB object
var hsl2rgb = function (h, s, l, o) {
  if (typeof h === typeof {} && "h" in h && "s" in h && "l" in h) {
    l = h.l;
    s = h.s;
    h = h.h;
  }
  if (h > 1 || s > 1 || l > 1) {
    h /= 360;
    s /= 100;
    l /= 100;
  }
  h *= 360;
  var R, G, B, X, C;
  h = (h % 360) / 60;
  C = 2 * s * (l < .5 ? l : 1 - l);
  X = C * (1 - Math.abs(h % 2 - 1));
  R = G = B = l - C / 2;

  h = ~~h;
  R += [C, X, 0, 0, X, C][h];
  G += [X, C, C, X, 0, 0][h];
  B += [0, 0, X, C, C, X][h];
  return packageRGB(R, G, B, o);
};

// Parses color string as RGB object
var getRGB = function (colour) {
  if (!colour || !!((colour = String(colour)).indexOf("-") + 1)) {
    return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
  }
  if (colour == "none") {
    return {r: -1, g: -1, b: -1, opacity: -1};
  }
  !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
  if (!colour) {
    return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
  }
  var res,
      red,
      green,
      blue,
      opacity,
      t,
      values,
      rgb = colour.match(colourRegExp);
  if (rgb) {
    if (rgb[2]) {
      blue = parseInt(rgb[2].substring(5), 16);
      green = parseInt(rgb[2].substring(3, 5), 16);
      red = parseInt(rgb[2].substring(1, 3), 16);
    }
    if (rgb[3]) {
      blue = parseInt((t = rgb[3].charAt(3)) + t, 16);
      green = parseInt((t = rgb[3].charAt(2)) + t, 16);
      red = parseInt((t = rgb[3].charAt(1)) + t, 16);
    }
    if (rgb[4]) {
      values = rgb[4].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red *= 2.55);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green *= 2.55);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue *= 2.55);
      rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
    }
    if (rgb[5]) {
      values = rgb[5].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red /= 100);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green /= 100);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue /= 100);
      (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
      rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
      return hsb2rgb(red, green, blue, opacity);
    }
    if (rgb[6]) {
      values = rgb[6].split(commaSpaces);
      red = parseFloat(values[0]);
      values[0].slice(-1) == "%" && (red /= 100);
      green = parseFloat(values[1]);
      values[1].slice(-1) == "%" && (green /= 100);
      blue = parseFloat(values[2]);
      values[2].slice(-1) == "%" && (blue /= 100);
      (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
      rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = parseFloat(values[3]));
      values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
      return hsl2rgb(red, green, blue, opacity);
    }
    red = Math.min(Math.round(red), 255);
    green = Math.min(Math.round(green), 255);
    blue = Math.min(Math.round(blue), 255);
    opacity = Math.min(Math.max(opacity, 0), 1);
    rgb = {r: red, g: green, b: blue};
    rgb.opacity = isFinite(opacity) ? opacity : 1;
    return rgb;
  }
  return {r: -1, g: -1, b: -1, opacity: -1, error: 1};
};

function SVGMorpheus(element, options, callback) {
  if (!element) {
    throw new Error('SVGMorpheus > "element" is required');
  }

  if(typeof element === typeof '') {
    element=document.querySelector(element);
    if (!element) {
      throw new Error('SVGMorpheus > "element" query is not related to an existing DOM node');
    }
  }

  if (!!options && typeof options !== typeof {}) {
    throw new Error('SVGMorpheus > "options" parameter must be an object');
  }
  options = options || {};

  if (!!callback && typeof callback !== typeof (function(){})) {
    throw new Error('SVGMorpheus > "callback" parameter must be a function');
  }

  var that=this;

  this._icons={};
  this._curIconId=options.iconId || '';
  this._toIconId='';
  this._curIconItems=[];
  this._fromIconItems=[];
  this._toIconItems=[];
  this._morphNodes=[];
  this._morphG;
  this._startTime;
  this._defDuration=options.duration || 750;
  this._defEasing=options.easing || 'quad-in-out';
  this._defRotation=options.rotation || 'none';
  this._defCallback = callback || function () {};
  this._duration=this._defDuration;
  this._easing=this._defEasing;
  this._rotation=this._defRotation;
  this._callback=this._defCallback;
  this._rafid;

  this._fnTick=function(timePassed) {
    if(!that._startTime) {
      that._startTime=timePassed;
    }
    var progress=Math.min((timePassed-that._startTime)/that._duration,1);
    that._updateAnimationProgress(progress);
    if(progress<1) {
      that._rafid=_reqAnimFrame(that._fnTick);
    } else {
      that._animationEnd();
    }
  };

  if(element.nodeName.toUpperCase()==='SVG') {
    this._svgDoc=element;
  } else {
    this._svgDoc = element.getSVGDocument();
  }
  if(!this._svgDoc) {
    element.addEventListener("load",function(){
      that._svgDoc = element.getSVGDocument();
      that._init();
    },false);
  } else {
    that._init();
  }
}

SVGMorpheus.prototype._init=function(){
  if(this._svgDoc.nodeName.toUpperCase()!=='SVG') {
    this._svgDoc=this._svgDoc.getElementsByTagName('svg')[0];
  }

  if(!!this._svgDoc) {
    var lastIconId='',
        i, len, id, items, item, j, len2, icon;

    // Read Icons Data
    // Icons = 1st tier G nodes having ID
    for(i=this._svgDoc.childNodes.length-1;i>=0;i--) {
      var nodeIcon=this._svgDoc.childNodes[i];
      if(nodeIcon.nodeName.toUpperCase()==='G') {
        id=nodeIcon.getAttribute('id');
        if(!!id) {
          items=[];
          for(j=0, len2=nodeIcon.childNodes.length;j<len2;j++) {
            var nodeItem=nodeIcon.childNodes[j];
            item={
              path: '',
              attrs: {},
              style: {}
            };

            // Get Item Path (Convert all shapes into Path Data)
            switch(nodeItem.nodeName.toUpperCase()) {
              case 'PATH':
                item.path=nodeItem.getAttribute('d');
                break;
              case 'CIRCLE':
                var cx=nodeItem.getAttribute('cx')*1,
                    cy=nodeItem.getAttribute('cy')*1,
                    r=nodeItem.getAttribute('r')*1;
                item.path='M'+(cx-r)+','+cy+'a'+r+','+r+' 0 1,0 '+(r*2)+',0a'+r+','+r+' 0 1,0 -'+(r*2)+',0z';
                break;
              case 'ELLIPSE':
                var cx=nodeItem.getAttribute('cx')*1,
                    cy=nodeItem.getAttribute('cy')*1,
                    rx=nodeItem.getAttribute('rx')*1,
                    ry=nodeItem.getAttribute('ry')*1;
                item.path='M'+(cx-rx)+','+cy+'a'+rx+','+ry+' 0 1,0 '+(rx*2)+',0a'+rx+','+ry+' 0 1,0 -'+(rx*2)+',0z';
                break;
              case 'RECT':
                var x=nodeItem.getAttribute('x')*1,
                    y=nodeItem.getAttribute('y')*1,
                    w=nodeItem.getAttribute('width')*1,
                    h=nodeItem.getAttribute('height')*1,
                    rx=nodeItem.getAttribute('rx')*1,
                    ry=nodeItem.getAttribute('ry')*1;
                if(!rx && !ry) {
                  item.path='M'+x+','+y+'l'+w+',0l0,'+h+'l-'+w+',0z';
                } else {
                  item.path='M'+(x+rx)+','+y+
                            'l'+(w-rx*2)+',0'+
                            'a'+rx+','+ry+' 0 0,1 '+rx+','+ry+
                            'l0,'+(h-ry*2)+
                            'a'+rx+','+ry+' 0 0,1 -'+rx+','+ry+
                            'l'+(rx*2-w)+',0'+
                            'a'+rx+','+ry+' 0 0,1 -'+rx+',-'+ry+
                            'l0,'+(ry*2-h)+
                            'a'+rx+','+ry+' 0 0,1 '+rx+',-'+ry+
                            'z';
                }
                break;
              case 'POLYGON':
                var points=nodeItem.getAttribute('points');
                var p = points.split(/\s+/);
                var path = "";
                for( var k = 0, len = p.length; k < len; k++ ){
                    path += (k && "L" || "M") + p[k]
                }
                item.path=path+'z';
                break;
              case 'LINE':
                var x1=nodeItem.getAttribute('x1')*1,
                    y1=nodeItem.getAttribute('y1')*1,
                    x2=nodeItem.getAttribute('x2')*1,
                    y2=nodeItem.getAttribute('y2')*1;
                item.path='M'+x1+','+y1+'L'+x2+','+y2+'z';
                break;
            }
            if(item.path!='') {
              // Traverse all attributes and get style values
              for (var k = 0, len3=nodeItem.attributes.length; k < len3; k++) {
                var attrib = nodeItem.attributes[k];
                if (attrib.specified) {
                  var name=attrib.name.toLowerCase();
                  switch (name) {
                    case 'fill':
                    case 'fill-opacity':
                    case 'opacity':
                    case 'stroke':
                    case 'stroke-opacity':
                    case 'stroke-width':
                      item.attrs[name]=attrib.value;
                  }
                }
              }

              // Traverse all inline styles and get supported values
              for (var l = 0, len4=nodeItem.style.length; l < len4; l++) {
                var styleName = nodeItem.style[l];
                switch (styleName) {
                  case 'fill':
                  case 'fill-opacity':
                  case 'opacity':
                  case 'stroke':
                  case 'stroke-opacity':
                  case 'stroke-width':
                    item.style[styleName]=nodeItem.style[styleName];
                }
              }

              items.push(item);
            }
          }

          // Add Icon
          if(items.length>0) {
            icon={
              id: id,
              items: items
            };
            this._icons[id]=icon;
          }

          // Init Node for Icons Items and remove Icon Nodes
          if(!this._morphG) {
            lastIconId=id;
            this._morphG=document.createElementNS('http://www.w3.org/2000/svg', 'g');
            this._svgDoc.replaceChild(this._morphG,nodeIcon);
          } else {
            this._svgDoc.removeChild(nodeIcon);
          }
        }
      }
    }
    // To Default Icon
    if(lastIconId!=='') {
      this._setupAnimation(lastIconId);
      this._updateAnimationProgress(1);
      this._animationEnd();
    }
  }

};

SVGMorpheus.prototype._setupAnimation=function(toIconId) {
  if(!!toIconId && !!this._icons[toIconId]) {
    this._toIconId=toIconId;
    this._startTime=undefined;
    var i, len, j, len2;
    this._fromIconItems=clone(this._curIconItems);
    this._toIconItems=clone(this._icons[toIconId].items);

    for(i=0, len=this._morphNodes.length;i<len;i++) {
      var morphNode=this._morphNodes[i];
      morphNode.fromIconItemIdx=i;
      morphNode.toIconItemIdx=i;
    }

    var maxNum=Math.max(this._fromIconItems.length, this._toIconItems.length);
    var toBB;
    for(i=0;i<maxNum;i++) {
      // Add items to fromIcon/toIcon if needed
      if(!this._fromIconItems[i]) {
        if(!!this._toIconItems[i]) {
          toBB=curvePathBBox(path2curve(this._toIconItems[i].path));
          this._fromIconItems.push({
            path: 'M'+toBB.cx+','+toBB.cy+'l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,toBB.cx,toBB.cy]
            }
          });
        } else {
          this._fromIconItems.push({
            path: 'M0,0l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,0,0]
            }
          });
        }
      }
      if(!this._toIconItems[i]) {
        if(!!this._fromIconItems[i]) {
          toBB=curvePathBBox(path2curve(this._fromIconItems[i].path));
          this._toIconItems.push({
            path: 'M'+toBB.cx+','+toBB.cy+'l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,toBB.cx,toBB.cy]
            }
          });
        } else {
          this._toIconItems.push({
            path: 'M0,0l0,0',
            attrs: {},
            style: {},
            trans: {
              'rotate': [0,0,0]
            }
          });
        }
      }

      // Add Node to DOM if needed
      if(!this._morphNodes[i]) {
        var node=document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this._morphG.appendChild(node);
        this._morphNodes.push({
          node: node,
          fromIconItemIdx: i,
          toIconItemIdx: i
        });
      }
    }

    for(i=0;i<maxNum;i++) {
      var fromIconItem=this._fromIconItems[i];
      var toIconItem=this._toIconItems[i];

      // Calculate from/to curve data and set to fromIcon/toIcon
      var curves=path2curve(this._fromIconItems[i].path,this._toIconItems[i].path);
      fromIconItem.curve=curves[0];
      toIconItem.curve=curves[1];

      // Normalize from/to attrs
      var attrsNorm=styleToNorm(this._fromIconItems[i].attrs,this._toIconItems[i].attrs);
      fromIconItem.attrsNorm=attrsNorm[0];
      toIconItem.attrsNorm=attrsNorm[1];
      fromIconItem.attrs=styleNormToString(fromIconItem.attrsNorm);
      toIconItem.attrs=styleNormToString(toIconItem.attrsNorm);

      // Normalize from/to style
      var styleNorm=styleToNorm(this._fromIconItems[i].style,this._toIconItems[i].style);
      fromIconItem.styleNorm=styleNorm[0];
      toIconItem.styleNorm=styleNorm[1];
      fromIconItem.style=styleNormToString(fromIconItem.styleNorm);
      toIconItem.style=styleNormToString(toIconItem.styleNorm);

      // Calculate from/to transform
      toBB=curvePathBBox(toIconItem.curve);
      toIconItem.trans={
        'rotate': [0,toBB.cx,toBB.cy]
      };
      var rotation=this._rotation, degAdd;
      if(rotation==='random') {
        rotation=Math.random()<0.5?'counterclock':'clock';
      }
      switch(rotation) {
        case 'none':
          if(!!fromIconItem.trans.rotate) {
            toIconItem.trans.rotate[0]=fromIconItem.trans.rotate[0];
          }
          break;
        case 'counterclock':
          if(!!fromIconItem.trans.rotate) {
            toIconItem.trans.rotate[0]=fromIconItem.trans.rotate[0]-360;
            degAdd=-fromIconItem.trans.rotate[0]%360;
            toIconItem.trans.rotate[0]+=(degAdd<180?degAdd:degAdd-360);
          } else {
            toIconItem.trans.rotate[0]=-360;
          }
          break;
        default: // Clockwise
          if(!!fromIconItem.trans.rotate) {
            toIconItem.trans.rotate[0]=fromIconItem.trans.rotate[0]+360;
            degAdd=fromIconItem.trans.rotate[0]%360;
            toIconItem.trans.rotate[0]+=(degAdd<180?-degAdd:360-degAdd);
          } else {
            toIconItem.trans.rotate[0]=360;
          }
          break;
      }
    }

    this._curIconItems=clone(this._fromIconItems);
  }
};

SVGMorpheus.prototype._updateAnimationProgress=function(progress) {
  progress=easings[this._easing](progress);

  var i, j, k, len;
  // Update path/attrs/transform
  for(i=0, len=this._curIconItems.length;i<len;i++) {
    this._curIconItems[i].curve=curveCalc(this._fromIconItems[i].curve, this._toIconItems[i].curve, progress);
    this._curIconItems[i].path=path2string(this._curIconItems[i].curve);

    this._curIconItems[i].attrsNorm=styleNormCalc(this._fromIconItems[i].attrsNorm, this._toIconItems[i].attrsNorm, progress);
    this._curIconItems[i].attrs=styleNormToString(this._curIconItems[i].attrsNorm);

    this._curIconItems[i].styleNorm=styleNormCalc(this._fromIconItems[i].styleNorm, this._toIconItems[i].styleNorm, progress);
    this._curIconItems[i].style=styleNormToString(this._curIconItems[i].styleNorm);

    this._curIconItems[i].trans=transCalc(this._fromIconItems[i].trans, this._toIconItems[i].trans, progress);
    this._curIconItems[i].transStr=trans2string(this._curIconItems[i].trans);
  }

  // Update DOM
  for(i=0, len=this._morphNodes.length;i<len;i++) {
    var morphNode=this._morphNodes[i];
    morphNode.node.setAttribute("d",this._curIconItems[i].path);
    var attrs=this._curIconItems[i].attrs;
    for(j in attrs) {
      morphNode.node.setAttribute(j,attrs[j]);
    }
    var style=this._curIconItems[i].style;
    for(k in style) {
      morphNode.node.style[k]=style[k];
    }
    morphNode.node.setAttribute("transform",this._curIconItems[i].transStr);
  }
};

SVGMorpheus.prototype._animationEnd=function() {
  for(var i=this._morphNodes.length-1;i>=0;i--) {
    var morphNode=this._morphNodes[i];
    if(!!this._icons[this._toIconId].items[i]) {
      morphNode.node.setAttribute("d",this._icons[this._toIconId].items[i].path);
    } else {
      morphNode.node.parentNode.removeChild(morphNode.node);
      this._morphNodes.splice(i,1);
    }
  }

  this._curIconId=this._toIconId;
  this._toIconId='';

  this._callback();
};

/*
 * Public methods
 */

// Morph To Icon
SVGMorpheus.prototype.to=function(iconId, options, callback) {
  if(iconId!==this._toIconId) {
    if (!!options && typeof options !== typeof {}) {
      throw new Error('SVGMorpheus.to() > "options" parameter must be an object');
    }
    options = options || {};

    if (!!callback && typeof callback !== typeof (function(){})) {
      throw new Error('SVGMorpheus.to() > "callback" parameter must be a function');
    }

    _cancelAnimFrame(this._rafid);

    this._duration=options.duration || this._defDuration;
    this._easing=options.easing || this._defEasing;
    this._rotation=options.rotation || this._defRotation;
    this._callback=callback || this._defCallback;

    this._setupAnimation(iconId);
    this._rafid=_reqAnimFrame(this._fnTick);
  }
};

return SVGMorpheus;
}());

$(document).ready(function() {

        var myIcons = new SVGMorpheus('#icon');
        var $siteNav = $("#site-nav");
        var $icon    = $("#icon");
        var $mobileMatch = matchMedia('(max-width: 600px)');
        var $biggerThanMobile = matchMedia('(min-width: 600px)');
        var $navLineContainer = $(".nav-line-container");
        var $topLogoPageText = $("#top-logo-page-text");
        var $navLine = $(".navLine");
        var $back = $('#back');
        var $front = $('#front');

    
        //CHeck if user is using IE 10
        var ua = window.navigator.userAgent;
        if (ua.indexOf("Trident/7.0") > 0) {
          $('html').addClass('ie10');
        }
        
        //Toggle Menu open & close
        $navLineContainer.on( "click", function() {
                    $(".threedbox").toggleClass('threedbox-open-menu');
                    $(".ieBack").toggleClass('ieBackopen');
                });

    $('#fullpage').fullpage({
    	scrollingSpeed: 2000,
        onLeave: function(index, nextIndex, direction){
            var leavingSection = $(this);


            if(index == 1 && direction =='down'){
                toggleOpenMenuOnScroll();
                traingleOpacity()
                $back.css({"opacity" : "0"});
                morphSVGtoRec();
                $navLine.css({'background-color': '#fff','opacity': '0'});
				        $icon.attr('class', 'nav-after-logo-animation');
				        $("#imageMorph").css({"margin-top" : "0"});
                $("#push-left-text").css({"right" : "0", "opacity" : "1"});
                $("#small-logo").css({"margin" : "4em 4em 4em 4em", "opacity" : "1"});
                $topLogoPageText.css({"opacity" : "0"});
                slideMenuOffScreenWhenMobile();
            }

   

            if(index == 2 && direction == 'up'){
                toggleOpenMenuOnScroll();
                $siteNav.css({"border-bottom" : "none"});
                $navLine.css({'background-color': '#000','opacity': '0'});
                $("#codicated-c").css({"opacity" : "0"});
                morphSVGtoCoditechure();
                slideMenuOffScreenWhenMobile()
                $siteNav.css({'background':"transparent"});
                $front.css({'background-color':"transparent"});
                $icon.attr('class', 'iconId');
                $topLogoPageText.css({"opacity" : "1"});
            }


            if(index == 2 && direction == 'down'){

                $(".project-title").css({"left" : "0", "opacity" : "1"});
                $(".project-paragraph").css({"left" : "0", "opacity" : "1"});
                
                
            }

             if(index == 3 && direction == 'down'){
                aboutUsDrawFillAnimation();
                servicesDrawFillAnimation();
                phoneDrawFillAnimation();
                // Inline SVG
                //new Vivus('about-us-icon', {type: 'delayed', duration: 200});
             }

         },afterLoad: function(anchorLink, index){
                    if(index == 1){
                        navLineOpacityOne();
                        slideMenuOnScreenWhenMobile();

                    }

                    // if(index == 2 && $mobileMatch.matches){
                    //     $front.css({'background-color':"#29b2d1"});
                    //     slideMenuOnScreenWhenMobile();

                    //     navLineOpacityOne();
                    //     coditechtureCopacityOne();


                    // }

                 	if(index == 2){

                         $front.css({'background-color':"#29b2d1"});
                         $siteNav.css({"border-bottom" : "1px solid grey"});
                         $back.css({"opacity" : "1"});
                         slideMenuOnScreenWhenMobile();

                         navLineOpacityOne();
                         coditechtureCopacityOne();
                     }

                     if(index == 3){
                        $siteNav.css({'background-color':"transparent"});
                        
                     }


                   }
            });

    function morphSVGtoRec() {
                if ($biggerThanMobile.matches && !$('html').hasClass('ieB')) {
                    myIcons.to('rec-svg',{duration:1000});
                }
            }

            function morphSVGtoCoditechure() {
                if ($biggerThanMobile.matches && !$('html').hasClass('ieB')) {
                    myIcons.to('codicated-logo-svg',{duration:1000});
                }
            }

            function slideMenuOffScreenWhenMobile() {
                if ($mobileMatch.matches) {
                    var $sn = $("#site-nav");
                        $sn.css({"right" : "-100%"});
                    
                }
            }

            function slideMenuOnScreenWhenMobile() {
                if ($mobileMatch.matches) {
                    var $sn = $("#site-nav");
                        $sn.css({"right" : "0"});
                    
                }
            }

            function frontMenuTransparent() {
                if($biggerThanMobile.matches) {
                    var $front = $front;
                        $front.css({'background-color':"transparent"});
                }
            }
            
            function toggleOpenMenuOnScroll() {
                var $boxthreed = $('#boxthreed');
                var $backMenu = $('#back');
                    if($boxthreed.hasClass('threedbox-open-menu')) {
                        var $threedbox = $(".threedbox");
                            $threedbox.toggleClass('threedbox-open-menu');
                    }
                    if($backMenu.hasClass('ieBackopen')) {
                        var $ieBack = $(".ieBack");
                            $ieBack.toggleClass('ieBackopen');
                    }  
            }

            function coditechtureCopacityOne() {
               var $codicatedC = $("#codicated-c");
                   $codicatedC.css({"opacity" : "1"});

            }

            function navLineOpacityOne() {
                var $navLine = $(".navLine");
                    $navLine.css({"opacity" : "1"});
            }

            function traingleOpacity() {
                var $triangleTop = $("#triangleTop");
                    $triangleTop.css({"opacity" : "0"});
            }
});

// //Check if browser supports SVG
// function svgasimg() {
//   return document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");
// }
// // if browser doesn't support SVG, then fall back with PNG
// if (!svgasimg()){
//   var e = document.getElementsByTagName("img");
//   if (!e.length){
//     e = document.getElementsByTagName("IMG");
//   }
//   for (var i=0, n=e.length; i<n; i++){
//     var img = e[i],
//         src = img.getAttribute("src");
//     if (src.match(/svgz?$/)) {
//       /* URL ends in svg or svgz */
//       img.setAttribute("src", 
//              img.getAttribute("data-fallback"));
//     }
//   }    
// }

// ab = new Vivus('about-us-icon', {type: 'delayed', duration: 200});

function aboutUsDrawFillAnimation() {
                if (!$('html').hasClass('ieB') && !$('html').hasClass('ie10')) {                
                  var myAnimation = new DrawFillSVG({
                    elementId: "about-us-icon"
                  });
                }
              };

function servicesDrawFillAnimation() {
                    if (!$('html').hasClass('ieB') && !$('html').hasClass('ie10')) {                
                  var myAnimation = new DrawFillSVG({
                    elementId: "services-icon"
                  });
                }
              };

function phoneDrawFillAnimation() {
                    if (!$('html').hasClass('ieB') && !$('html').hasClass('ie10')) {                
                  var myAnimation = new DrawFillSVG({
                    elementId: "phone-icon"
                  });
                }
              };



