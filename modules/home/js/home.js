$(document).ready(function() {
    $('.lazyajax').show().lazy({
        effect: "fadeIn",
        effectTime: 1000
    });

    if (wcag === false) {
        setTimeout(function() {
            /*$("#hello-typed").typed({
            	//strings: ["First sentence.", "Second sentence."],
            	// Optionally use an HTML element to grab strings from (must wrap each string in a <p>)
            	//stringsElement: null,
            	stringsElement: $('#typed-strings'),
            	// typing speed
            	typeSpeed: 10,
            	// time before typing starts
            	startDelay: 0,
            	// backspacing speed
            	backSpeed: 0,
            	// time before backspacing
            	backDelay: 500,
            	// loop
            	loop: true,
            	// show cursor
            	showCursor: false,
            	// attribute to type (null == text)
            	attr: null,
            	// either html or text
            	contentType: 'html',
            });*/
            var typed = new Typed('#hello-typed', {
                stringsElement: '#typed-strings',
                typeSpeed: 20,
                startDelay: 0,
                backSpeed: 0,
                backDelay: 5000,
                fadeOut: true,
                loop: true,
                showCursor: false,
            });
        }, 1300);
    } else {
        var hello_type_value = $('#typed-strings p').html();
        $('#hello-typed').html(hello_type_value);
    }
});