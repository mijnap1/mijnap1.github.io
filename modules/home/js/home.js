(function () {
    var root = document.documentElement;
    var body = document.body;
    var loader = document.getElementById('intro-loader');
    var video = document.getElementById('intro-loader-video');
    var frame = document.getElementById('intro-frame');

    if (!loader || !body) {
        return;
    }

    var shouldPlay = root.classList.contains('has-intro-loader');
    var exitTimer = null;
    var revealTimer = null;
    window.__homeIntroPending = shouldPlay;

    function finalizeLoader() {
        window.clearTimeout(exitTimer);
        window.clearTimeout(revealTimer);
        root.classList.remove('has-intro-loader');
        body.classList.remove('intro-active');
        body.classList.add('intro-reveal');
        body.classList.add('loaded');
        window.__homeIntroPending = false;
        loader.setAttribute('hidden', 'hidden');
        loader.setAttribute('aria-hidden', 'true');
        loader.classList.remove('is-visible', 'is-exiting');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
        if (loader.parentNode) {
            loader.parentNode.removeChild(loader);
        }
        revealTimer = window.setTimeout(function () {
            body.classList.remove('intro-reveal');
        }, 700);
        document.dispatchEvent(new CustomEvent('home:intro-finished'));
    }

    if (!shouldPlay) {
        finalizeLoader();
        return;
    }

    function beginExit() {
        if (loader.classList.contains('is-exiting')) {
            return;
        }
        body.classList.add('loaded');
        loader.classList.add('is-exiting');
        exitTimer = window.setTimeout(finalizeLoader, 420);
    }

    body.classList.add('intro-active');
    body.classList.remove('loaded');
    if (frame) {
        frame.classList.add('is-animated');
    }
    loader.removeAttribute('hidden');
    loader.setAttribute('aria-hidden', 'false');

    window.setTimeout(function () {
        loader.classList.add('is-visible');
        if (!video) {
            beginExit();
            return;
        }

        video.currentTime = 0.02;
        var playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(function () {
                beginExit();
            });
        }
    }, 24);

    if (video) {
        video.addEventListener('ended', beginExit);
    }
})();

var homeModuleStarted = false;

function startHomeModule() {
    if (homeModuleStarted) {
        return;
    }
    homeModuleStarted = true;

    $('.lazyajax').show().lazy({
        effect: "fadeIn",
        effectTime: 1000
    });

    if (wcag === false) {
        setTimeout(function() {
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
}

$(document).ready(function() {
    if (window.__homeIntroPending) {
        document.addEventListener('home:intro-finished', startHomeModule, {
            once: true
        });
        return;
    }

    startHomeModule();
});
