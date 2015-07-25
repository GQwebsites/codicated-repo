
$(document).ready(function() {
    
    var myIcons = new SVGMorpheus('#icon'),
        $siteNav = $("#site-nav"),
        $icon    = $("#icon"),
        $mobileMatch = window.matchMedia('(max-width: 600px)');
        
        //Toggle Menu open & close
        $(".nav-line-container").on( "click", function() {
                    $(".threedbox").toggleClass('threedbox-open-menu');
                });

    $('#fullpage').fullpage({
    	scrollingSpeed: 2000,
        onLeave: function(index, nextIndex, direction){
            var leavingSection = $(this);

            //after leaving section 2
            if(index == 1 && direction =='down' && $('#boxthreed').hasClass('threedbox-open-menu')){
                $('.threeD').css({'opacity': '0'});
                $(".threedbox").toggleClass('threedbox-open-menu');
                myIcons.to('rec-svg',{duration:1000});
                $(".navLine").css({'background-color': '#fff','opacity': '0'});
                $icon.attr('class', 'nav-after-logo-animation');
                $("#imageMorph").css({"margin-top" : "0"});
                $("#push-left-text").css({"right" : "0", "opacity" : "1"});
                $("#small-logo").css({"margin" : "4em 4em 4em 4em", "opacity" : "1"});

                

                
            }

            if(index == 1 && direction =='down'){
                
                myIcons.to('rec-svg',{duration:1000});
                $(".navLine").css({'background-color': '#fff','opacity': '0'});
				        $icon.attr('class', 'nav-after-logo-animation');
				        $("#imageMorph").css({"margin-top" : "0"});
                $("#push-left-text").css({"right" : "0", "opacity" : "1"});
                $("#small-logo").css({"margin" : "4em 4em 4em 4em", "opacity" : "1"});
				

				
            }

            if(index == 1 && direction =='down' && $mobileMatch.matches){
                
                myIcons.to('rec-svg',{duration:1000});
                $(".navLine").css({'background-color': '#fff','opacity': '0'});
                $icon.attr('class', 'nav-after-logo-animation');
                $("#imageMorph").css({"margin-top" : "0"});
                $("#push-left-text").css({"right" : "0", "opacity" : "1"});
                $("#small-logo").css({"margin" : "1em", "opacity" : "1"});
        

        
            }

            if(index == 2 && direction == 'up' && $("#boxthreed").hasClass('threedbox-open-menu')){
                $(".threedbox").toggleClass('threedbox-open-menu');
                $(".navLine").css({'background-color': '#000','opacity': '0'});
                $("#codicated-c").css({"opacity" : "0"});
                myIcons.to('codicated-logo-svg',{duration:1000});
                $siteNav.css({'background':"transparent"});
                $("#front").css({'background-color':"transparent"});
                //$("#back").css({'background-color':"transparent"});
				$icon.attr('class', 'iconId');
                //$(".fp-tableCell").css({'vertical-align' : 'top'});
				
				
            }

            if(index == 2 && direction == 'up'){
                //$(".threedbox").toggleClass('threedbox-open-menu');
                $(".navLine").css({'background-color': '#000','opacity': '0'});
                $("#codicated-c").css({"opacity" : "0"});
                myIcons.to('codicated-logo-svg',{duration:1000});
                $siteNav.css({'background':"transparent"});
                $("#front").css({'background-color':"transparent"});
                //$("#back").css({'background-color':"transparent"});
                $icon.attr('class', 'iconId');
                //$(".fp-tableCell").css({'vertical-align' : 'top'});
                
                
            }


            if(index == 2 && direction == 'down'){

                $(".project-title").css({"left" : "0", "opacity" : "1"});
                $(".project-paragraph").css({"left" : "0", "opacity" : "1"});
                //$(".fp-section").css({"margin-top" : "0"});
                
                
            }

             if(index == 3 && direction == 'down'){
                aboutUsDrawFillAnimation();
                servicesDrawFillAnimation();
                 phoneDrawFillAnimation();
             }

         },afterLoad: function(anchorLink, index){
            if(index == 1){
                $(".navLine").css({"opacity" : "1"});
                //$(".treedbox").toggleClass('threedbox-open-menu');

            }
         	if(index == 2){
                 $('.threeD').css({'opacity': '1'});
                 //$siteNav.css({'background-color':"#fff", 'position':'fixed'});
                 $("#front").css({'background-color':"#29b2d1"});
                 //$("#back").css({'background-color':"#067391"});
                 $(".navLine").css({"opacity" : "1"});
                 //$("#site-nav").addClass('nav-gradient-background');
                 $("#codicated-c").css({"opacity" : "1"});
             }
             if(index == 3){
                $siteNav.css({'background-color':"transparent"});
             }
             if(index == 4){
                 //phoneI.play();
             }

            // if(index == 4) {
            //     var phoneI = new Vivus('phone-icon', {type: 'delayed', duration: 150});
            //      phoneI.reset().play();
            //  }
           }
    });
});

function aboutUsDrawFillAnimation() {
                    var myAnimation = new DrawFillSVG({
                      elementId: "about-us-icon"
                    });
                  };

function servicesDrawFillAnimation() {
                    var myAnimation = new DrawFillSVG({
                      elementId: "services-icon"
                    });
                  };

function phoneDrawFillAnimation() {
                    var myAnimation = new DrawFillSVG({
                      elementId: "phone-icon"
                    });
                  };

// Inline SVG
//new Vivus('phone-icon', {type: 'delayed', duration: 200}, myCallback);


// $(".site-nav").css({'background-color':"#18598c"});




//  $(document).on('scroll',function () {
	
	
// // $('#push').click(function (e) {
// // 	    e.preventDefault();
// 	if ($(this).scrollTop() > 1) {
// 		//$(".iconId").toggleClass("nav-after-logo-animation");
// 	myIcons.to('rec-svg',{duration:1000});
// 	$("#icon").attr('class', 'nav-after-logo-animation');
// 	alert("what");

// 	// $('.site').css({'top':'-100%'});

// 	// $(".iconId").attr('class', 'nav-after-class-toggle');
// 	// $windowHeight = window.innerHeight;
// 	//   $('.site').css({"transform": "translate3d(0," + -$windowHeight + "px, 0)"});



// 	}

// 	else {
// 	$('#push').removeClass("shoe");
// 		myIcons.to('codicated-logo-svg',{duration:1000});
// 		$("#icon").attr('class', 'iconId');
		
// 		 // alert("yes");
//  }
	
// });

//  $(document).ready(function(){
// 	$('#push').on('click',function (e) {
// 	    e.preventDefault();

// 	    var target = $('#lori');
	    

// 	    $('html, body').stop().animate({
// 	        'scrollTop': target.offset().top
// 	    }, 900, 'swing', function () {
// 	        window.location.hash = target;
// 	    });
// 	});
// });
	

