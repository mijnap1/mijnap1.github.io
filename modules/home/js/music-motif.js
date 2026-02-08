(function () {
    var root = document.querySelector('.music-motif');
    if (!root) {
        return;
    }

    var pads = Array.prototype.slice.call(root.querySelectorAll('.motif-pad'));
    var startBtn = root.querySelector('.motif-start');
    var statusEl = root.querySelector('.motif-status');
    var revealEl = root.querySelector('.motif-reveal');
    var length = parseInt(root.getAttribute('data-length') || '4', 10);

    var audioCtx = null;
    var sequence = [];
    var progress = 0;
    var accepting = false;

    function getAudioContext() {
        if (!audioCtx) {
            try {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (err) {
                audioCtx = null;
            }
        }
        return audioCtx;
    }

    function beep(freq, duration) {
        var ctx = getAudioContext();
        if (!ctx) {
            return;
        }
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var now = ctx.currentTime;
        var dur = duration || 0.28;

        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.value = 0.0001;

        osc.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc.start(now);
        osc.stop(now + dur + 0.02);
    }

    function lightPad(pad, duration) {
        pad.classList.add('is-lit');
        window.setTimeout(function () {
            pad.classList.remove('is-lit');
        }, duration || 260);
    }

    function setStatus(message) {
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    function label(key, fallback) {
        return root.getAttribute(key) || fallback;
    }

    function playSequence() {
        accepting = false;
        setStatus(label('data-playing-label', 'Listen to the motif...'));
        var delay = 0;
        sequence.forEach(function (index) {
            var pad = pads[index];
            var freq = parseFloat(pad.getAttribute('data-freq')) || 440;
            window.setTimeout(function () {
                lightPad(pad);
                beep(freq);
            }, delay);
            delay += 450;
        });

        window.setTimeout(function () {
            progress = 0;
            accepting = true;
            setStatus(label('data-repeat-label', 'Your turn — repeat it.'));
        }, delay + 120);
    }

    function startGame() {
        if (!pads.length) {
            return;
        }
        if (revealEl) {
            revealEl.hidden = true;
            revealEl.classList.remove('is-revealed');
        }
        sequence = [];
        for (var i = 0; i < length; i += 1) {
            sequence.push(Math.floor(Math.random() * pads.length));
        }
        setStatus(label('data-ready-label', 'Get ready...'));
        window.setTimeout(playSequence, 500);
    }

    function handlePadClick(index) {
        if (!accepting) {
            return;
        }
        var pad = pads[index];
        var freq = parseFloat(pad.getAttribute('data-freq')) || 440;
        lightPad(pad, 180);
        beep(freq, 0.2);

        if (index !== sequence[progress]) {
            accepting = false;
            setStatus(label('data-fail-label', 'Close! Tap start to try again.'));
            if (startBtn) {
                startBtn.classList.add('shake');
                window.setTimeout(function () {
                    startBtn.classList.remove('shake');
                }, 350);
            }
            return;
        }

        progress += 1;
        if (progress >= sequence.length) {
            accepting = false;
            setStatus(label('data-win-label', 'Unlocked! Nice ear.'));
            if (revealEl) {
                revealEl.hidden = false;
                revealEl.classList.add('is-revealed');
            }
        }
    }

    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }

    pads.forEach(function (pad, index) {
        pad.addEventListener('click', function () {
            handlePadClick(index);
        });
    });
})();
