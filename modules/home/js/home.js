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
    var hasInitializedHeroVisuals = false;

    function initializeHeroVisuals() {
        if (hasInitializedHeroVisuals) {
            return;
        }
        hasInitializedHeroVisuals = true;

        var rainLayer = document.createElement('div');
        rainLayer.className = 'home-hero-rain';
        var snowLayer = document.createElement('div');
        snowLayer.className = 'home-hero-snow';
        var clearLayer = document.createElement('div');
        clearLayer.className = 'home-hero-clear';
        var clockLayer = document.createElement('div');
        clockLayer.className = 'home-hero-clock';
        var clockGlass = document.createElement('div');
        clockGlass.className = 'home-hero-clock-glass';
        var clockScale = document.createElement('div');
        clockScale.className = 'home-hero-clock-scale';
        var storyPanel = document.createElement('div');
        storyPanel.className = 'home-hero-story';
        var storyEyebrow = document.createElement('span');
        storyEyebrow.className = 'home-hero-story-eyebrow';
        var storyTitle = document.createElement('strong');
        storyTitle.className = 'home-hero-story-title';
        var storyBody = document.createElement('span');
        storyBody.className = 'home-hero-story-body';
        storyPanel.appendChild(storyEyebrow);
        storyPanel.appendChild(storyTitle);
        storyPanel.appendChild(storyBody);
        var hourHand = document.createElement('span');
        hourHand.className = 'home-hero-clock-hand home-hero-clock-hand--hour';
        var minuteHand = document.createElement('span');
        minuteHand.className = 'home-hero-clock-hand home-hero-clock-hand--minute';
        var secondHand = document.createElement('span');
        secondHand.className = 'home-hero-clock-hand home-hero-clock-hand--second';
        clockLayer.appendChild(clockGlass);
        clockLayer.appendChild(clockScale);
        clockLayer.appendChild(rainLayer);
        clockLayer.appendChild(hourHand);
        clockLayer.appendChild(minuteHand);
        clockLayer.appendChild(secondHand);

        for (var scaleIndex = 0; scaleIndex < 3; scaleIndex++) {
            var scaleItem = document.createElement('span');
            scaleItem.className = 'home-hero-clock-scale-item';
            scaleItem.textContent = '0' + (scaleIndex + 1);
            scaleItem.setAttribute('role', 'button');
            scaleItem.setAttribute('tabindex', '0');
            scaleItem.setAttribute('aria-label', 'Open clock story step ' + (scaleIndex + 1));
            scaleItem.setAttribute('data-step-index', String(scaleIndex));
            clockScale.appendChild(scaleItem);
        }

        var isMobileHero = window.innerWidth <= 767;
        var rainCount = isMobileHero ? 30 : 24;

        for (var i = 0; i < rainCount; i++) {
            var left = isMobileHero
                ? (6 + (i / Math.max(1, rainCount - 1)) * 88)
                : ((i * 4.1) + (i % 4) * 1.4);
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
        heroImage.appendChild(storyPanel);
        heroImage.appendChild(clearLayer);
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
        var clockTickTimer = null;
        var storyTimer = null;
        var storyPanelSwapTimer = null;
        var scaleItems = clockScale.querySelectorAll('.home-hero-clock-scale-item');
        var storyEntries = [
            {
                eyebrow: '01',
                title: 'Hello,',
                body: 'I am Jamie Ryu.'
            },
            {
                eyebrow: '02',
                title: 'I am a',
                body: 'full stack web developer.'
            },
            {
                eyebrow: '03',
                title: 'Drift',
                body: 'The lower note stays present but secondary to the center beat.'
            }
        ];

        var storySlotMap = [
            ['slot-center', 'slot-top', 'slot-bottom'],
            ['slot-bottom', 'slot-center', 'slot-top'],
            ['slot-top', 'slot-bottom', 'slot-center']
        ];

        function stopStorySequence() {
            if (storyTimer) {
                window.clearTimeout(storyTimer);
                storyTimer = null;
            }
            if (storyPanelSwapTimer) {
                window.clearTimeout(storyPanelSwapTimer);
                storyPanelSwapTimer = null;
            }
        }

        function updateStoryPanel(entry) {
            if (!entry) {
                return;
            }
            storyPanel.classList.add('is-transitioning');
            if (storyPanelSwapTimer) {
                window.clearTimeout(storyPanelSwapTimer);
            }
            storyPanelSwapTimer = window.setTimeout(function () {
                storyEyebrow.textContent = entry.eyebrow;
                storyTitle.textContent = entry.title;
                storyBody.textContent = entry.body;
                storyPanel.classList.remove('is-transitioning');
            }, 170);
        }

        function setActiveStoryStep(stepIndex, immediate) {
            for (var scaleCursor = 0; scaleCursor < scaleItems.length; scaleCursor++) {
                scaleItems[scaleCursor].classList.remove('slot-top', 'slot-center', 'slot-bottom');
                scaleItems[scaleCursor].classList.add(storySlotMap[stepIndex][scaleCursor]);
                scaleItems[scaleCursor].classList.toggle('is-active', scaleCursor === stepIndex);
                scaleItems[scaleCursor].setAttribute('aria-pressed', scaleCursor === stepIndex ? 'true' : 'false');
            }
            if (immediate) {
                storyEyebrow.textContent = storyEntries[stepIndex].eyebrow;
                storyTitle.textContent = storyEntries[stepIndex].title;
                storyBody.textContent = storyEntries[stepIndex].body;
                storyPanel.classList.remove('is-transitioning');
            } else {
                updateStoryPanel(storyEntries[stepIndex]);
            }
        }

        function bindStoryInteractions() {
            for (var itemIndex = 0; itemIndex < scaleItems.length; itemIndex++) {
                (function (targetIndex) {
                    var targetItem = scaleItems[targetIndex];
                    targetItem.addEventListener('click', function () {
                        stopStorySequence();
                        setActiveStoryStep(targetIndex, false);
                    });
                    targetItem.addEventListener('keydown', function (event) {
                        if (event.key !== 'Enter' && event.key !== ' ') {
                            return;
                        }
                        event.preventDefault();
                        stopStorySequence();
                        setActiveStoryStep(targetIndex, false);
                    });
                })(itemIndex);
            }
        }

        function startStorySequence() {
            if (window.innerWidth > 767) {
                return;
            }
            stopStorySequence();
            setActiveStoryStep(0, true);
        }

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

        function stopClockTicking() {
            if (clockTickTimer) {
                window.clearTimeout(clockTickTimer);
                clockTickTimer = null;
            }
        }

        function queueNextClockTick() {
            stopClockTicking();
            var now = new Date();
            var delay = 1000 - now.getMilliseconds();
            if (delay < 16) {
                delay += 1000;
            }
            clockTickTimer = window.setTimeout(function () {
                updateHeroClock();
                queueNextClockTick();
            }, delay);
        }

        function startClockTicking() {
            updateHeroClock();
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    clockLayer.classList.remove('is-booting');
                    clockLayer.classList.add('is-ready');
                    queueNextClockTick();
                });
            });
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

        bindStoryInteractions();
        clockLayer.classList.add('is-booting');
        updateHeroClock();
        startClockTicking();
        startStorySequence();
        applyWeatherState();
    }

    if (window.innerWidth <= 767 && window.__homeIntroPending) {
        document.addEventListener('home:intro-finished', initializeHeroVisuals, { once: true });
        return;
    }

    initializeHeroVisuals();
})();
