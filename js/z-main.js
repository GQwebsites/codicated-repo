
$(document).ready(function() {
    
      // var myIcons = new SVGMorpheus('#icon'),
      //   $siteNav = $("#site-nav"),
      //   $icon    = $("#icon"),
      //   $mobileMatch = matchMedia('(max-width: 600px)'),
      //   $biggerThanMobile = matchMedia('(min-width: 600px)'),
      //   $navLineContainer = $(".nav-line-container"),
      //   $topLogoPageText = $("#top-logo-page-text"),
      //   $navLine = $(".navLine");

        var myIcons = new SVGMorpheus('#icon');
        var $siteNav = $("#site-nav");
        var $icon    = $("#icon");
        var $mobileMatch = matchMedia('(max-width: 600px)');
        var $biggerThanMobile = matchMedia('(min-width: 600px)');
        var $navLineContainer = $(".nav-line-container");
        var $topLogoPageText = $("#top-logo-page-text");
        var $navLine = $(".navLine");

    
        //CHeck if user is using IE 10
        var ua = window.navigator.userAgent;
        if (ua.indexOf("Trident/7.0") > 0) {
          $('html').addClass('ieB');
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
                $("#back").css({"opacity" : "0"});
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
                $("#front").css({'background-color':"transparent"});
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
                    //     $("#front").css({'background-color':"#29b2d1"});
                    //     slideMenuOnScreenWhenMobile();

                    //     navLineOpacityOne();
                    //     coditechtureCopacityOne();


                    // }

                 	if(index == 2){

                         $("#front").css({'background-color':"#29b2d1"});
                         $siteNav.css({"border-bottom" : "1px solid grey"});
                         $("#back").css({"opacity" : "1"});
                         slideMenuOnScreenWhenMobile();

                         navLineOpacityOne();
                         coditechtureCopacityOne();
                     }

                     if(index == 3){
                        $siteNav.css({'background-color':"transparent"});
                        
                     }

                     // if(index == 4){
                     //    ab.reset().play();
                        
                     // }


                   }
            });

    function morphSVGtoRec() {
                if ($biggerThanMobile.matches) {
                    myIcons.to('rec-svg',{duration:1000});
                }
            }

            function morphSVGtoCoditechure() {
                if ($biggerThanMobile.matches) {
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
                    var $front = $("#front");
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
                if (!$('html').hasClass('ieB')) {                
                  var myAnimation = new DrawFillSVG({
                    elementId: "about-us-icon"
                  });
                }
              };

function servicesDrawFillAnimation() {
                    if (!$('html').hasClass('ieB')) {                
                  var myAnimation = new DrawFillSVG({
                    elementId: "services-icon"
                  });
                }
              };

function phoneDrawFillAnimation() {
                    if (!$('html').hasClass('ieB')) {                
                  var myAnimation = new DrawFillSVG({
                    elementId: "phone-icon"
                  });
                }
              };



