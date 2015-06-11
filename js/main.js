$(document).ready(function() {
    // $('#fullpage').fullpage();
    var myIcons = new SVGMorpheus('#icon')

    $('#fullpage').fullpage({
    	scrollingSpeed: 2000,
        onLeave: function(index, nextIndex, direction){
            var leavingSection = $(this);

            //after leaving section 2
            if(index == 1 && direction =='down'){
                
                myIcons.to('rec-svg',{duration:1000});
                $(".fp-section").css({"margin-top" : "3.8em"});
				$("#icon").attr('class', 'nav-after-logo-animation');
				$("#imageMorph").css({"margin-top" : "0"});
                //$(".fp-tableCell").css({'vertical-align' : 'top'});
				

				
            }

            else if(index == 2 && direction == 'up'){

                myIcons.to('codicated-logo-svg',{duration:1000});
                $(".site-nav").css({'background-color':"transparent"});
				$("#icon").attr('class', 'iconId');
                //$(".fp-tableCell").css({'vertical-align' : 'top'});
				
				
            }
         },afterLoad: function(anchorLink, index){
         	if(index == 2){
                 $(".site-nav").css({'background-color':"#18598c"});
                 //$(".fp-tableCell").css({'vertical-align' : 'top'});
             }
            if(index == 1) {
                //$(".fp-tableCell").css({'vertical-align' : 'top'});
            }
           }
    });
});


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
	

