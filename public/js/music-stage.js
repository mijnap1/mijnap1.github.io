(function () {
    var stage = document.querySelector("[data-music-stage]");
    if (!stage) {
        return;
    }

    var toggleButton = stage.querySelector('[data-music-action="toggle"]');
    var shuffleButton = stage.querySelector('[data-music-action="shuffle"]');
    var prevButton = stage.querySelector('[data-music-action="prev"]');
    var nextButton = stage.querySelector('[data-music-action="next"]');
    var albumButton = stage.querySelector('[data-music-action="album"]');
    var albumBackButton = stage.querySelector('[data-music-action="album-back"]');
    var toggleIcon = toggleButton ? toggleButton.querySelector("ion-icon") : null;
    var currentCover = stage.querySelector(".music-stage-cover--current");
    var nextCover = stage.querySelector(".music-stage-cover--next");
    var albumCover = stage.querySelector("[data-music-album-cover]");
    var albumList = stage.querySelector("[data-music-album-list]");
    var titleEl = stage.querySelector("[data-music-title]");
    var artistEl = stage.querySelector("[data-music-artist]");
    var tracks = [
        { title: "Hype Boy", artist: "NewJeans", cover: "/public/ico/music/sub-cover/kpop/2.png", duration: "2:59" },
        { title: "Palette", artist: "IU", cover: "/public/ico/music/main-cover/palette.jpg", duration: "3:37" },
        { title: "Ao to Natsu", artist: "Mrs. GREEN APPLE", cover: "/public/ico/music/sub-cover/jpop/15.jpeg", duration: "4:31" },
        { title: "T.B.H", artist: "QWER", cover: "/public/ico/music/sub-cover/kpop/0.jpeg", duration: "3:06" },
        { title: "Thanks", artist: "Kim Dong Ryul", cover: "/public/ico/music/sub-cover/ballad/33.jpg", duration: "4:51" },
        { title: "Lilac", artist: "Mrs. GREEN APPLE", cover: "/public/ico/music/sub-cover/jpop/13.png", duration: "4:44" },
        { title: "How Sweet", artist: "NewJeans", cover: "/public/ico/music/sub-cover/kpop/200.jpeg", duration: "3:39" },
        { title: "Dried Flower", artist: "yuuri", cover: "/public/ico/music/sub-cover/jpop/12.jpg", duration: "4:45" }
    ];
    var upcomingTracks = [
        { title: "Coming soon...", artist: "More favorites on the way", duration: "--:--" }
    ];

    var currentIndex = Math.floor(Math.random() * tracks.length);
    var isPlaying = false;
    var isSwitching = false;
    var isAlbumOpen = false;
    var timers = [];
    var SWITCH_PREP_MS = 70;
    var RESTART_DELAY_MS = 120;

    function setCover(target, imagePath) {
        if (!target) {
            return;
        }
        target.style.backgroundImage = 'url("' + imagePath + '")';
    }

    function setTrackMeta(track) {
        if (titleEl) {
            titleEl.textContent = track.title;
        }
        if (artistEl) {
            artistEl.textContent = track.artist;
        }
        if (albumCover) {
            albumCover.style.backgroundImage = 'url("' + track.cover + '")';
        }
        syncAlbumList();
    }

    function syncAlbumList() {
        if (!albumList) {
            return;
        }
        var items = albumList.querySelectorAll("[data-track-index]");
        items.forEach(function (item) {
            item.classList.toggle("is-active", Number(item.getAttribute("data-track-index")) === currentIndex);
        });
    }

    function renderAlbumList() {
        if (!albumList) {
            return;
        }
        var trackMarkup = tracks.map(function (track, index) {
            return '' +
                '<button class="music-stage-album__track' + (index === currentIndex ? ' is-active' : '') + '" type="button" data-track-index="' + index + '">' +
                '<span class="music-stage-album__index">' + String(index + 1).padStart(2, "0") + '</span>' +
                '<span class="music-stage-album__track-copy">' +
                '<span class="music-stage-album__track-title">' + track.title + '</span>' +
                '<span class="music-stage-album__track-artist">' + track.artist + '</span>' +
                '</span>' +
                '<span class="music-stage-album__duration">' + track.duration + '</span>' +
                '</button>';
        }).join("");
        var upcomingMarkup = upcomingTracks.map(function (track, index) {
            return '' +
                '<div class="music-stage-album__track music-stage-album__track--coming-soon" aria-disabled="true">' +
                '<span class="music-stage-album__index">' + String(tracks.length + index + 1).padStart(2, "0") + '</span>' +
                '<span class="music-stage-album__track-copy">' +
                '<span class="music-stage-album__track-title">' + track.title + '</span>' +
                '<span class="music-stage-album__track-artist">' + track.artist + '</span>' +
                '</span>' +
                '<span class="music-stage-album__duration">' + track.duration + '</span>' +
                '</div>';
        }).join("");
        var archiveMarkup = '' +
            '<a class="music-stage-album__archive-link-row" href="/archive/music/">' +
            '<span class="music-stage-album__index">' + String(tracks.length + upcomingTracks.length + 1).padStart(2, "0") + '</span>' +
            '<span class="music-stage-album__track-copy">' +
            '<span class="music-stage-album__track-title">Open archive</span>' +
            '<span class="music-stage-album__track-artist">Browse the previous music pages</span>' +
            '</span>' +
            '<span class="music-stage-album__duration"><ion-icon name="arrow-forward-outline"></ion-icon></span>' +
            '</a>';
        albumList.innerHTML = trackMarkup + upcomingMarkup + archiveMarkup;
    }

    function openAlbumView() {
        isAlbumOpen = true;
        stage.classList.add("is-album-open");
        syncControlState();
    }

    function closeAlbumView() {
        isAlbumOpen = false;
        stage.classList.remove("is-album-open");
        syncControlState();
    }

    function syncControlState() {
        if (toggleButton) {
            toggleButton.classList.toggle("is-active", (isPlaying || isSwitching) && !isAlbumOpen);
            toggleButton.setAttribute("aria-pressed", (isPlaying || isSwitching) && !isAlbumOpen ? "true" : "false");
        }
        if (albumButton) {
            albumButton.classList.toggle("is-active", isAlbumOpen);
            albumButton.setAttribute("aria-pressed", isAlbumOpen ? "true" : "false");
        }
    }

    function syncToggleButton() {
        if (!toggleButton || !toggleIcon) {
            return;
        }
        var shouldShowPause = isPlaying || isSwitching;
        toggleIcon.setAttribute("name", shouldShowPause ? "pause" : "play");
        toggleButton.setAttribute("aria-label", shouldShowPause ? "Pause" : "Play");
        toggleButton.setAttribute("title", shouldShowPause ? "Pause" : "Play");
        syncControlState();
    }

    function clearTimers() {
        while (timers.length) {
            window.clearTimeout(timers.pop());
        }
    }

    function queueTimeout(fn, delay) {
        var timer = window.setTimeout(fn, delay);
        timers.push(timer);
        return timer;
    }

    function setPlaying(nextPlaying) {
        isPlaying = nextPlaying;
        stage.classList.remove("is-switching", "is-cover-swapping");
        stage.classList.toggle("is-playing", isPlaying);
        if (!isPlaying) {
            clearTimers();
        }
        syncToggleButton();
    }

    function beginPlaying() {
        stage.classList.remove("is-switching");
        stage.classList.remove("is-cover-swapping");
        isPlaying = true;
        requestAnimationFrame(function () {
            stage.classList.add("is-playing");
        });
        syncToggleButton();
    }

    function getNextIndex(step) {
        if (!tracks.length) {
            return currentIndex;
        }
        return (currentIndex + step + tracks.length) % tracks.length;
    }

    function getRandomIndex() {
        if (tracks.length < 2) {
            return currentIndex;
        }

        var nextIndex = currentIndex;
        while (nextIndex === currentIndex) {
            nextIndex = Math.floor(Math.random() * tracks.length);
        }
        return nextIndex;
    }

    function switchToIndex(nextIndex) {
        if (isSwitching || isAlbumOpen) {
            return;
        }

        isSwitching = true;
        isPlaying = false;
        clearTimers();
        stage.classList.remove("is-playing");
        stage.classList.remove("is-cover-swapping");
        stage.classList.add("is-switching");
        syncToggleButton();

        queueTimeout(function () {
            currentIndex = nextIndex;
            setCover(currentCover, tracks[currentIndex].cover);
            setCover(nextCover, tracks[currentIndex].cover);
            setTrackMeta(tracks[currentIndex]);
            queueTimeout(function () {
                isSwitching = false;
                beginPlaying();
            }, RESTART_DELAY_MS);
        }, SWITCH_PREP_MS);
    }

    function switchTrack(step) {
        switchToIndex(getNextIndex(step));
    }

    if (toggleButton) {
        toggleButton.addEventListener("click", function () {
            if (isSwitching || isAlbumOpen) {
                return;
            }

            if (isPlaying) {
                setPlaying(false);
                return;
            }

            beginPlaying();
        });
    }

    if (prevButton) {
        prevButton.addEventListener("click", function () {
            switchTrack(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            switchTrack(1);
        });
    }

    if (shuffleButton) {
        shuffleButton.addEventListener("click", function () {
            switchToIndex(getRandomIndex());
        });
    }

    if (albumButton) {
        albumButton.addEventListener("click", function () {
            if (isSwitching) {
                return;
            }
            openAlbumView();
        });
    }

    if (albumBackButton) {
        albumBackButton.addEventListener("click", closeAlbumView);
    }

    if (albumList) {
        albumList.addEventListener("click", function (event) {
            var button = event.target.closest("[data-track-index]");
            if (!button || isSwitching) {
                return;
            }
            currentIndex = Number(button.getAttribute("data-track-index"));
            setCover(currentCover, tracks[currentIndex].cover);
            setCover(nextCover, tracks[currentIndex].cover);
            setTrackMeta(tracks[currentIndex]);
            closeAlbumView();
            beginPlaying();
        });
    }

    renderAlbumList();
    setCover(currentCover, tracks[currentIndex].cover);
    setCover(nextCover, tracks[currentIndex].cover);
    setTrackMeta(tracks[currentIndex]);
    syncToggleButton();
})();
