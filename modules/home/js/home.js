(function () {
    var root = document.documentElement;
    var body = document.body;
    var loader = document.getElementById('intro-loader');
    var video = document.getElementById('intro-loader-video');

    if (!loader || !body) {
        return;
    }

    var shouldPlay = root.classList.contains('has-intro-loader');
    var exitTimer = null;
    var revealTimer = null;
    var maxIntroTimer = null;
    window.__homeIntroPending = shouldPlay;
    var EXIT_DURATION_MS = 200;
    var MAX_INTRO_DURATION_MS = 2050;
    var INTRO_START_TIME_S = 0.12;

    function finalizeLoader() {
        window.clearTimeout(exitTimer);
        window.clearTimeout(revealTimer);
        window.clearTimeout(maxIntroTimer);
        try {
            window.sessionStorage.setItem('homeIntroSeen', '1');
        } catch (error) {}
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
        exitTimer = window.setTimeout(finalizeLoader, EXIT_DURATION_MS);
    }

    body.classList.add('intro-active');
    body.classList.remove('loaded');
    loader.removeAttribute('hidden');
    loader.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(function () {
        loader.classList.add('is-visible');
        if (!video) {
            beginExit();
            return;
        }

        video.currentTime = INTRO_START_TIME_S;
        video.playbackRate = 1.46;
        var playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(function () {
                beginExit();
            });
        }
    });

    maxIntroTimer = window.setTimeout(beginExit, MAX_INTRO_DURATION_MS);

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
    startHomeModule();
});

(function () {
    var heroImage = document.querySelector('.home-hello-container .image');
    var learnMoreLink = document.querySelector('.home-hello-container .link a');
    if (!heroImage) {
        return;
    }

    var rainLayer = document.createElement('div');
    rainLayer.className = 'home-hero-rain';
    var snowLayer = document.createElement('div');
    snowLayer.className = 'home-hero-snow';
    var clearLayer = document.createElement('div');
    clearLayer.className = 'home-hero-clear';
    var clockLayer = document.createElement('div');
    clockLayer.className = 'home-hero-clock';
    var hourHand = document.createElement('span');
    hourHand.className = 'home-hero-clock-hand home-hero-clock-hand--hour';
    var minuteHand = document.createElement('span');
    minuteHand.className = 'home-hero-clock-hand home-hero-clock-hand--minute';
    var secondHand = document.createElement('span');
    secondHand.className = 'home-hero-clock-hand home-hero-clock-hand--second';
    clockLayer.appendChild(hourHand);
    clockLayer.appendChild(minuteHand);
    clockLayer.appendChild(secondHand);

    for (var i = 0; i < 24; i++) {
        var left = (i * 4.1) + (i % 4) * 1.4;
        var delay = (i % 8) * 0.14;
        var duration = 0.64 + (i % 5) * 0.06;

        var drop = document.createElement('span');
        drop.className = 'home-hero-rain-drop';
        drop.style.left = left + '%';
        drop.style.animationDelay = delay + 's';
        drop.style.animationDuration = duration + 's';
        rainLayer.appendChild(drop);

        var splash = document.createElement('span');
        splash.className = 'home-hero-rain-splash';
        splash.style.left = left + '%';
        splash.style.animationDelay = delay + 's';
        splash.style.animationDuration = duration + 's';
        rainLayer.appendChild(splash);
    }

    for (var j = 0; j < 40; j++) {
        var flake = document.createElement('span');
        flake.className = 'home-hero-snowflake';
        flake.style.left = (4 + (j * 4.7) + (j % 4) * 1.3) + '%';
        flake.style.animationDelay = ((j % 7) * 0.55) + 's';
        flake.style.animationDuration = (4.15 + (j % 5) * 0.45) + 's';
        flake.style.setProperty('--home-snow-drift', ((j % 5) - 2) * 7 + 'px');
        flake.style.setProperty('--home-snow-size', (4 + (j % 4) * 1.4) + 'px');
        snowLayer.appendChild(flake);
    }

    for (var k = 0; k < 6; k++) {
        var glow = document.createElement('span');
        glow.className = 'home-hero-clear-glow';
        glow.style.left = (8 + k * 15) + '%';
        glow.style.top = (10 + (k % 3) * 24) + '%';
        glow.style.animationDelay = (k * 0.8) + 's';
        glow.style.animationDuration = (6.2 + (k % 3) * 0.9) + 's';
        clearLayer.appendChild(glow);
    }

    for (var m = 0; m < 9; m++) {
        var streak = document.createElement('span');
        streak.className = 'home-hero-clear-streak';
        streak.style.top = (12 + m * 8) + '%';
        streak.style.animationDelay = (m * 0.55) + 's';
        streak.style.animationDuration = (8.5 + (m % 4) * 1.1) + 's';
        clearLayer.appendChild(streak);
    }

    heroImage.appendChild(clockLayer);
    heroImage.appendChild(clearLayer);
    heroImage.appendChild(rainLayer);
    heroImage.appendChild(snowLayer);

    var torontoClockFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Toronto',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
    });

    var handAngles = {
        hour: null,
        minute: null,
        second: null
    };

    function getContinuousAngle(previous, next) {
        if (previous === null || !isFinite(previous)) {
            return next;
        }
        while (next < previous) {
            next += 360;
        }
        return next;
    }

    function updateHeroClock() {
        var parts = torontoClockFormatter.formatToParts(new Date());
        var hour = 0;
        var minute = 0;
        var second = 0;
        for (var n = 0; n < parts.length; n++) {
            if (parts[n].type === 'hour') {
                hour = parseInt(parts[n].value, 10) || 0;
            } else if (parts[n].type === 'minute') {
                minute = parseInt(parts[n].value, 10) || 0;
            } else if (parts[n].type === 'second') {
                second = parseInt(parts[n].value, 10) || 0;
            }
        }

        var hourAngle = ((hour % 12) + (minute / 60) + (second / 3600)) * 30;
        var minuteAngle = (minute + (second / 60)) * 6;
        var secondAngle = second * 6;

        handAngles.hour = getContinuousAngle(handAngles.hour, hourAngle);
        handAngles.minute = getContinuousAngle(handAngles.minute, minuteAngle);
        handAngles.second = getContinuousAngle(handAngles.second, secondAngle);

        hourHand.style.transform = 'rotate(' + (handAngles.hour - 90) + 'deg)';
        minuteHand.style.transform = 'rotate(' + (handAngles.minute - 90) + 'deg)';
        secondHand.style.transform = 'rotate(' + (handAngles.second - 90) + 'deg)';
    }

    function applyWeatherState(detail) {
        var condition = detail && detail.condition ? detail.condition : document.documentElement.getAttribute('data-toronto-weather');
        var isDay = detail && typeof detail.isDay === 'boolean' ? detail.isDay : document.documentElement.getAttribute('data-toronto-is-day') !== 'false';
        heroImage.classList.toggle('is-rainy', condition === 'rain');
        heroImage.classList.toggle('is-snowy', condition === 'snow');
        heroImage.classList.toggle('is-clear-day', condition === 'clear' && isDay);
    }

    document.addEventListener('toronto-weather-change', function (event) {
        applyWeatherState(event.detail);
    });

    if (learnMoreLink) {
        learnMoreLink.addEventListener('click', function () {
            heroImage.classList.add('is-rain-dismissing');
        });
    }

    updateHeroClock();
    window.setInterval(updateHeroClock, 1000);
    applyWeatherState();
})();
