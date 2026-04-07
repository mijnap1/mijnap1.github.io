function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i);
    //alert( pattern.test(emailAddress) );
    return pattern.test(emailAddress);
}

function setCookie(name, value, day) {
    var expire = '';
    if (day) {
        var date = new Date();
        date.setTime(date.getTime() + (day * 24 * 60 * 60 * 1000));
        expire = '; expires=' + date.toGMTString();
    }
    document.cookie = name + '=' + value + expire + '; path=/';
}

function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        } else {
            if (c == name)
                return '';
        }
    }
    return null;
}

function unsetCookie(name) {
    setCookie(name, '', -1);
}

function padded(n) {
    return (n < 10) ? ("0" + n) : n;
}

function setWcag() {
    var href = base + website_modules[29]['alias'] + '/setWcag';
    jQuery.ajax({
        type: 'POST',
        url: href,
        dataType: 'json',
        success: function(data) {
            //console.log(data);
            window.location = act_url;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log('error');
        }
    });
}

$(document).ready(function() {
    function socialLinks() {
        return $('.socials a, #social-box a');
    }

    function clearSocialLinkFocus() {
        socialLinks().blur();
        if (document.activeElement && $(document.activeElement).is('.socials a, #social-box a')) {
            document.activeElement.blur();
        }
    }

    socialLinks().on('click', function() {
        var link = this;
        window.setTimeout(function() {
            if (link && typeof link.blur === 'function') {
                link.blur();
            }
            clearSocialLinkFocus();
        }, 0);
    });

    clearSocialLinkFocus();
    window.addEventListener('pageshow', clearSocialLinkFocus);

    //autosize
    autosize($('textarea'));
    //tooltip
    $('[data-toggle="tooltip"]').tooltip();
    //menu
    var navbarCloseColorTimer = null;

    function clearNavbarCloseColorTimer() {
        if (navbarCloseColorTimer) {
            clearTimeout(navbarCloseColorTimer);
            navbarCloseColorTimer = null;
        }
    }

    function queueNavbarCloseColorReset() {
        clearNavbarCloseColorTimer();
        $("#navbar-open-button").addClass('is-closing');
        navbarCloseColorTimer = setTimeout(function() {
            $("#navbar-open-button").removeClass('is-closing');
            navbarCloseColorTimer = null;
        }, 500);
    }

    $("#navbar-open-button").click(function(e) {
        e.preventDefault();
        clearNavbarCloseColorTimer();
        $(this).removeClass('is-closing');
        $(this).toggleClass('navbar-close');
        $("body").toggleClass('navbar-open');
        if ($(this).hasClass('navbar-close')) {
            showAnimated();
        } else {
            queueNavbarCloseColorReset();
            hideAnimated();
        }
    });
    $('.navbar-box').click(function(event) {
        if (!$(event.target).closest('.navbar-box-right').length) {
            clearNavbarCloseColorTimer();
            $("#navbar-open-button").removeClass('navbar-close');
            queueNavbarCloseColorReset();
            $("body").removeClass('navbar-open');
            hideAnimated();
        }
    });
    $(window).resize(function() {
        clearNavbarCloseColorTimer();
        $("#navbar-open-button").removeClass('is-closing');
        if ($("#navbar-open-button").hasClass('navbar-close')) {
            showAnimated();
        } else {
            hideAnimated();
        }
    });

    function showAnimated() {
        $(".animated.click").each(function(index) {
            var thisis = $(this);
            var animate = thisis.data('show-name');
            var delay = thisis.data('show-delay');
            if (delay !== undefined) {
                setTimeout(function() {
                    thisis.addClass(animate);
                }, delay);
            } else {
                thisis.addClass(animate);
            }
        });
    }

    function hideAnimated() {
        $(".animated.click").each(function(index) {
            var thisis = $(this);
            var animate = thisis.data('hide-name');
            var delay = thisis.data('hide-delay');
            if (delay !== undefined) {
                setTimeout(function() {
                    thisis.addClass(animate);
                    //itt csak torlom az osztalyokat
                    setTimeout(function() {
                        var remove_class = thisis.data('show-name');
                        thisis.removeClass(remove_class);
                        var remove_class = thisis.data('hide-name');
                        thisis.removeClass(remove_class);
                    }, 1000);
                }, delay);
            } else {
                thisis.addClass(animate);
            }
        });
    }

    var email1 = 'info';
    var email2 = 'interword.hu';
    jQuery('.mainemail').attr('href', 'mailto:' + email1 + '@' + email2);
    jQuery('.mainemail').text(email1 + '@' + email2);

    $('.animated.appear').appear();
    setTimeout(function() {
        $.force_appear();
    }, 10);
    $(".animated.now").each(function(index) {
        //console.log('now');
        var thisis = $(this);
        initAnimation(thisis);
    });
    jQuery(document.body).on('appear', '.animated.appear', function(e, $affected) {
        //console.log('appear');
        var thisis = $(this);
        if (thisis.hasClass('appearjustmobile') && window.innerWidth <= 991) {
            initAnimation(thisis);
        } else if (!thisis.hasClass('appearjustmobile')) {
            initAnimation(thisis);
        }
    });

    function initAnimation(thisis) {

        var remove_class = thisis.data('hide-name');
        thisis.removeClass(remove_class);

        var animate = thisis.data('show-name');
        var delay = thisis.data('show-delay');

        if (delay !== undefined) {
            setTimeout(function() {
                thisis.addClass(animate);
            }, delay);
        } else {
            thisis.addClass(animate);
        }
    }
    //swipe
    $("body.noscroll .frame").swipe({
        swipeUp: function(event, direction, distance, duration, fingerCount) {
            if ($('body').hasClass('portfolio-grid-mode')) {
                return;
            }
            $('#carousel_about_change_right').click();
            $('#carousel_portfolio_change_right').click();
            //console.log("You swiped " + direction );
        },
        swipeDown: function(event, direction, distance, duration, fingerCount) {
            if ($('body').hasClass('portfolio-grid-mode')) {
                return;
            }
            $('#carousel_about_change_left').click();
            $('#carousel_portfolio_change_left').click();
            //console.log("You swiped " + direction );
        },
        threshold: 0
    });

    $("body.noscroll .frame").bind('touchmove', function(e) {
        if ($(e.target).closest('#portfolio_grid_view').length) {
            return;
        }
        e.preventDefault();
    });

    //search
    jQuery("#searchModal .search-delete").click(function(event) {
        //console.log('delete');
        jQuery("#searchphraseinput").val('');
        jQuery('#searchModal').find('.search-modal-product-list').html('');
        jQuery('#searchModal').find('.search-modal-loading').hide();
        jQuery('#searchModal').find('.search-hits-box').text('');
        jQuery(this).hide();
    })
    jQuery('#searchModal').on('shown.bs.modal', function(e) {
        jQuery("#searchphraseinput").focus();
    });

    var searchtime;
    jQuery("#searchphraseinput").keyup(function(event) {
        //https://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
        if ((event.which == 9) || (event.which >= 16 && event.which <= 20) || (event.which >= 33 && event.which <= 40)) {
            return false;
        }

        clearTimeout(searchtime);
        if (event.which == 13) {
            event.preventDefault();
        }
        var searchphrase = jQuery("#searchphraseinput").val();
        if (searchphrase.length >= 3) {
            jQuery("#searchModal .search-delete").show();
            //jQuery('#searchModal').find('.search-modal-product-list').html('<div class="search-modal-product-container text-center">... keresés folyamatban ...</div>');
            jQuery('#searchModal').find('.search-modal-product-list').html('<div class="search-modal-product-container">&nbsp;</div>');
            jQuery('#searchModal').find('.search-modal-loading').hide();
            searchtime = setTimeout(function() {
                searchBlog(searchphrase);
            }, 1000);
        } else {
            jQuery("#searchModal .search-delete").hide();
            jQuery('#searchModal').find('.search-modal-product-list').html('<div class="search-modal-product-container"><div class="help-text">A keresési kifejezésnek legalább 3 karakternek kell lenni!</div></div>');
            jQuery('#searchModal').find('.search-modal-loading').hide();
        }
        jQuery('#searchModal').find('.search-hits-box').text('');
    });

    function searchBlog(searchphrase) {
        var href = url + website_modules[29]['alias'] + '/searchBlog';
        jQuery.ajax({
            type: 'POST',
            url: href,
            dataType: 'json',
            //async: false,
            data: {
                searchphrase: searchphrase,
                validate: 'valid'
            },
            success: function(data) {
                //console.log(data);
                jQuery('#searchModal').find('.search-modal-loading').hide();
                if (data.txt == '1') {
                    jQuery('#searchModal').find('.search-modal-product-list').html('<div class="search-modal-product-container">' + data.products + '</div>');
                } else {
                    jQuery('#searchModal').find('.search-modal-product-list').html('<div class="search-modal-product-container">' + data.txt + '</div>');
                }
                if (data.counter != 0) {
                    jQuery('#searchModal').find('.search-hits-box').text(data.counter + ' találat');
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log('error');
            }
        });

    }

    /* ABOUT */
    var about_waiting_time = 2000;
    var about_mouse_change = false;
    setTimeout(function() {
        about_mouse_change = true;
    }, about_waiting_time);
    var about_first = false;
    var about_last = false;
    if ($('#carousel_about .item:first').hasClass('active')) {
        about_first = true;
    }
    if ($('#carousel_about .item:last').hasClass('active')) {
        about_last = true;
    }

    $('#carousel_about').carousel({
        interval: false,
        wrap: false,
        //transitionDuration: carouselTransitionDuration,
        pause: 'cycle' //hover, cycle
    });

    $('#carousel_about').on('slid.bs.carousel', function() {
        setTimeout(function() {
            about_mouse_change = true;
        }, about_waiting_time);
        about_first = about_last = false;
        if ($('#carousel_about .item:first').hasClass('active')) {
            about_first = true;
            $('#carousel_about_change_left').removeClass('slideInDown').addClass('slideOutUp');
        } else {
            $('#carousel_about_change_left').removeClass('hidden slideOutUp').addClass('slideInDown');
        }
        if ($('#carousel_about .item:last').hasClass('active')) {
            about_last = true;
            $('#carousel_about_change_right').removeClass('slideInUp').addClass('slideOutDown');
        } else {
            $('#carousel_about_change_right').removeClass('hidden slideOutDown').addClass('slideInUp');
        }

        //aktualis oldal szam mutatasa
        var currentindex = $('#carousel_about .active').index('#carousel_about .item');
        var current = (parseInt(currentindex) + 1);
        $('.about-page-number').removeClass('actual-1 actual-2 actual-3').addClass('actual-' + current);

        //direkt a force_appear elott - toroljuk a felesleges osztalyokat
        $("#carousel_about .item .animated.appear").each(function(index) {
            var thisis = $(this);
            var remove_class = thisis.data('show-name') + ' ' + thisis.data('hide-name');
            thisis.removeClass(remove_class);
        });

        //appear
        $.force_appear();

        //nav-label lekezelése (mindenkepp a force_appear utan)
        var thisis = $('#nav-label span');
        var animate = thisis.data('hide-name');
        thisis.addClass(animate); //eltuntetjuk
        var help_label = thisis.data('label-' + current);
        var help_metatitle = help_label;
        if (typeof thisis.data('metatitle-' + current) !== 'undefined') {
            help_metatitle = thisis.data('metatitle-' + current);
        }
        var help_alias = thisis.data('alias-' + current);
        setTimeout(function() {
            //amikor eltunt kicserljuk a szoveget
            thisis.text(help_label);
            //toroljuk a regi class-okat
            var remove_class = thisis.data('show-name') + ' ' + thisis.data('hide-name');
            thisis.removeClass(remove_class);
            //majd megjelenítjük
            var animate = thisis.data('show-name');
            thisis.addClass(animate);
        }, 500);

        //url change
        var new_url = url + alias + '/' + help_alias;
        //console.log(new_url);
        window.history.replaceState({}, "", new_url);
        document.title = help_metatitle;
    });

    //gorgetes
    jQuery('#carousel_about').mousewheel(function(event) {
        if (about_mouse_change) {
            event.preventDefault(); //bug javitas
            //console.log(event.deltaX + ' | ' + event.deltaY + ' | ' + event.deltaFactor);
            if (event.deltaY < 0) {
                //console.log('Scrolling Down');
                $('#carousel_about').carousel('next');
                if (!about_last) {
                    about_mouse_change = false;
                }
                return false;
            } else {
                //console.log('Scrolling Up');
                $('#carousel_about').carousel('prev');
                if (!about_first) {
                    about_mouse_change = false;
                }
                return false;
            }
        }
    });
    $('#carousel_about_change_left').click(function() {
        $('#carousel_about').carousel('prev');
    });
    $('#carousel_about_change_right').click(function() {
        $('#carousel_about').carousel('next');
    });
    //animacio lekezelese amikor kivezetjük
    $('#carousel_about').on('slide.bs.carousel', function() {
        $('.awards-container').removeClass('crushed');
        $("#carousel_about .item.active .animated.appear").each(function(index) {
            var thisis = $(this);
            var animate = thisis.data('hide-name');
            var delay = thisis.data('hide-delay');
            if (delay !== undefined) {
                setTimeout(function() {
                    thisis.addClass(animate);
                }, delay);
            } else {
                thisis.addClass(animate);
            }
        });
    });
    //crushed
    $('.awards-container').click(function() {
        if (window.innerWidth >= 1260) {
            $('.awards-container').toggleClass('crushed');
        }
    });
    /* ABOUT END */

    /* PORTFOLIO */
    function normalizePortfolioAlias(value) {
        return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
    function getPortfolioTargetFromUrl() {
        var hashValue = window.location.hash ? window.location.hash.slice(1) : '';
        var params = new URLSearchParams(window.location.search);
        return params.get('project') || params.get('slide') || hashValue;
    }
    function getPortfolioTargetIndexFromUrl() {
        if (!$('#carousel_portfolio').length) {
            return 0;
        }
        var target = getPortfolioTargetFromUrl();
        if (!target) {
            return 0;
        }
        if (/^\d+$/.test(target)) {
            return parseInt(target, 10);
        }
        var normalizedTarget = normalizePortfolioAlias(decodeURIComponent(target));
        var foundIndex = 0;
        $('#carousel_portfolio .item').each(function(index) {
            var alias = $(this).data('alias');
            if (!alias) {
                return;
            }
            if (normalizePortfolioAlias(alias) === normalizedTarget) {
                foundIndex = index + 1;
                return false;
            }
        });
        return foundIndex;
    }
    var portfolio_waiting_time = 2000;
    var portfolio_change = false;
    setTimeout(function() {
        portfolio_change = true;
    }, portfolio_waiting_time);
    var portfolio_first = true;
    var portfolio_last = false;
    var initialPortfolioIndex = getPortfolioTargetIndexFromUrl();
    if (initialPortfolioIndex) {
        var $portfolioItems = $('#carousel_portfolio .item');
        $portfolioItems.removeClass('active');
        $portfolioItems.eq(initialPortfolioIndex - 1).addClass('active');
        jQuery('.carousel-page-number .current').text(padded(initialPortfolioIndex));
    }

    $('#carousel_portfolio').carousel({
        interval: false,
        wrap: false,
        //transitionDuration: carouselTransitionDuration,
        pause: 'cycle' //hover, cycle
    });

    $('#carousel_portfolio').on('slid.bs.carousel', function() {
        portfolio_change = true;
        setTimeout(function() {
            portfolio_change = true;
        }, portfolio_waiting_time);
        syncPortfolioUi(true);
    });
    jQuery('#carousel_portfolio').mousewheel(function(event) {
        if (portfolio_change) {
            event.preventDefault(); //bug javitas
            //console.log(event.deltaX, event.deltaY, event.deltaFactor);
            if (event.deltaY < 0) {
                //console.log('Scrolling Down');
                $('#carousel_portfolio').carousel('next');
                if (!portfolio_last) {
                    portfolio_change = false;
                }
                return false;
            } else {
                //console.log('Scrolling Up');
                $('#carousel_portfolio').carousel('prev');
                if (!portfolio_first) {
                    portfolio_change = false;
                }
                return false;
            }
        }
    });
    $('#carousel_portfolio_change_left').click(function() {
        $('#carousel_portfolio').carousel('prev');
    });
    $('#carousel_portfolio_change_right').click(function() {
        $('#carousel_portfolio').carousel('next');
    });
    function getPortfolioMax() {
        var maxText = jQuery('.carousel-page-number .max').text();
        var max = parseInt(maxText, 10);
        if (isNaN(max) || max < 1) {
            return 0;
        }
        return max;
    }
    function getPortfolioCurrentIndex() {
        var currentindex = $('#carousel_portfolio .active').index('#carousel_portfolio .item');
        return parseInt(currentindex, 10) + 1;
    }
    function syncPortfolioUi(shouldForceAppear) {
        portfolio_first = portfolio_last = false;

        if ($('#carousel_portfolio .item:first').hasClass('active')) {
            portfolio_first = true;
            $('#carousel_portfolio_change_left').removeClass('slideInDown').addClass('slideOutUp');
        } else {
            $('#carousel_portfolio_change_left').removeClass('hidden slideOutUp').addClass('slideInDown');
        }
        if ($('#carousel_portfolio .item:last').hasClass('active')) {
            portfolio_last = true;
            $('#carousel_portfolio_change_right').removeClass('slideInUp').addClass('slideOutDown');
        } else {
            $('#carousel_portfolio_change_right').removeClass('hidden slideOutDown').addClass('slideInUp');
        }

        var max = jQuery('.carousel-page-number .max').text();
        var currentindex = $('#carousel_portfolio .active').index('#carousel_portfolio .item');
        var current = (parseInt(currentindex, 10) + 1);
        if (current > max) {
            current = max;
        }
        jQuery('.carousel-page-number .current').text(padded(current));

        $("#carousel_portfolio .item .animated.appear").each(function(index) {
            var thisis = $(this);
            var remove_class = thisis.data('show-name') + ' ' + thisis.data('hide-name');
            thisis.removeClass(remove_class);
        });

        if (shouldForceAppear) {
            $.force_appear();
        }

        var help_alias = $('#carousel_portfolio .active').data('alias');
        var new_url = url + alias + '/' + help_alias;
        window.history.replaceState({}, "", new_url);
    }
    function animateActivePortfolioItem() {
        $('#carousel_portfolio .item.active .animated.appear').each(function() {
            var $node = $(this);
            var showClass = $node.data('show-name');
            if (!showClass) {
                return;
            }
            $node.removeClass(showClass + ' ' + ($node.data('hide-name') || ''));
            // Force a reflow so the first active slide can replay its entrance classes on fresh load.
            void this.offsetWidth;
            $node.addClass(showClass);
        });
    }
    function setPortfolioActiveIndexImmediate(targetIndex) {
        var max = getPortfolioMax();
        if (!max) {
            return;
        }
        if (targetIndex < 1) {
            targetIndex = 1;
        } else if (targetIndex > max) {
            targetIndex = max;
        }
        var $portfolioItems = $('#carousel_portfolio .item');
        $portfolioItems.removeClass('active');
        $portfolioItems.eq(targetIndex - 1).addClass('active');
    }
    function gotoPortfolioIndex(targetIndex) {
        var max = getPortfolioMax();
        if (!max) {
            return;
        }
        if (targetIndex < 1) {
            targetIndex = 1;
        } else if (targetIndex > max) {
            targetIndex = max;
        }
        $('#carousel_portfolio').carousel(targetIndex - 1);
    }
    function gotoPortfolioFromUrl() {
        var foundIndex = getPortfolioTargetIndexFromUrl();
        if (!foundIndex) {
            return;
        }
        if (getPortfolioCurrentIndex() === foundIndex) {
            return;
        }
        gotoPortfolioIndex(foundIndex);
    }
    var $portfolioViewToggle = $('#portfolio_view_toggle');
    var $portfolioGrid = $('#portfolio_grid_view');
    var portfolioViewMode = 'carousel';
    var portfolioViewTransitioning = false;
    var portfolioViewTimers = [];
    var pendingPortfolioGridTargetIndex = null;
    var PORTFOLIO_GRID_PANEL_DELAY = 160;
    var PORTFOLIO_GRID_REVEAL_DELAY = 360;
    var PORTFOLIO_RETURN_CONTENT_DELAY = 180;
    function escapePortfolioHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    function renderPortfolioGrid() {
        if (!$portfolioGrid.length || $portfolioGrid.children().length) {
            return;
        }
        var isFrenchPage = $('html').attr('lang') === 'fr';
        var detailLabel = isFrenchPage ? 'Detail' : 'Detail';
        var gridImageMap = {
            'Scratch': '/public/ico/projects/grid/scratch.png',
            'Mysemester': '/public/ico/projects/grid/mysemester.png',
            'Detector': '/public/ico/projects/grid/detector.png',
            '3dvoxelizer': '/public/ico/projects/grid/dog.png',
            'langswitch': '/public/ico/projects/grid/langswitch.png',
            'pascal-mystery-hexagon': '/public/ico/projects/grid/pascal.png',
            'Notion-timer': '/public/ico/projects/grid/notion-timer.png',
            'Team Tomorrow': '/public/ico/projects/grid/tt.png',
            'UTKCC': '/public/ico/projects/grid/utkcc.png',
            'LFTimes': '/public/ico/projects/grid/lftimes.png',
            'yourname': '/public/ico/projects/grid/yourname.png',
            'Chess Game': '/public/ico/projects/grid/chess.png'
        };
        var gridImagePositionMap = {
            'Notion-timer': '42% center',
            'Detector': 'center -70px'
        };
        var gridImageSizeMap = {
            'Detector': '133% auto'
        };
        var gridImageRepeatMap = {
            'Detector': 'no-repeat'
        };
        var cards = [];
        $('#carousel_portfolio .item').each(function(index) {
            var $item = $(this);
            var $img = $item.find('.portfolio-img-box img').first();
            var $link = $item.find('.portfolio-btn').first();
            var title = $.trim($item.find('.portfolio-title').first().text());
            var intro = $.trim($item.find('.portfolio-intro').first().text());
            var alias = $item.data('alias');
            var imgSrc = gridImageMap[alias] || $img.attr('src') || '';
            var imgPosition = gridImagePositionMap[alias] || 'center center';
            var imgSize = gridImageSizeMap[alias] || 'cover';
            var imgRepeat = gridImageRepeatMap[alias] || 'no-repeat';
            var imgAlt = $img.attr('alt') || title;
            var linkHref = $link.attr('href') || '';
            var linkLabel = $.trim($link.text());
            cards.push(
                '<article class="portfolio-grid-card" style="--grid-card-delay:' + (500 + (index * 28)) + 'ms">' +
                    '<div class="portfolio-grid-card-media" role="img" aria-label="' + escapePortfolioHtml(imgAlt) + '" style="background-image:url(\'' + escapePortfolioHtml(imgSrc) + '\');background-position:' + escapePortfolioHtml(imgPosition) + ';background-size:' + escapePortfolioHtml(imgSize) + ';background-repeat:' + escapePortfolioHtml(imgRepeat) + '"></div>' +
                    '<div class="portfolio-grid-card-body">' +
                        '<div class="portfolio-grid-card-index">' + padded(index + 1) + '</div>' +
                        '<div class="portfolio-grid-card-title">' + escapePortfolioHtml(title) + '</div>' +
                        '<div class="portfolio-grid-card-intro">' + escapePortfolioHtml(intro) + '</div>' +
                        '<div class="portfolio-grid-card-actions">' +
                            '<button type="button" class="portfolio-grid-card-open" data-target-index="' + (index + 1) + '">' + detailLabel + '</button>' +
                            (linkHref ? '<a class="portfolio-grid-card-link" href="' + escapePortfolioHtml(linkHref) + '" target="_blank" rel="noopener">' + escapePortfolioHtml(linkLabel) + '</a>' : '') +
                        '</div>' +
                    '</div>' +
                '</article>'
            );
        });
        $portfolioGrid.html('<div class="portfolio-grid-view-inner">' + cards.join('') + '</div>');
    }
    function clearPortfolioViewTimers() {
        while (portfolioViewTimers.length) {
            clearTimeout(portfolioViewTimers.pop());
        }
    }
    function schedulePortfolioViewStep(callback, delay) {
        portfolioViewTimers.push(setTimeout(callback, delay));
    }
    function updatePortfolioViewToggle() {
        if (!$portfolioViewToggle.length) {
            return;
        }
        var isGrid = portfolioViewMode === 'grid';
        var isFrenchPage = $('html').attr('lang') === 'fr';
        var label = isGrid
            ? (isFrenchPage ? 'Basculer vers la vue détaillée' : 'Switch to detail view')
            : (isFrenchPage ? 'Basculer vers la vue en grille' : 'Switch to grid view');
        $portfolioViewToggle.attr('aria-pressed', isGrid ? 'true' : 'false');
        $portfolioViewToggle.attr('aria-label', label);
        $portfolioViewToggle.attr('title', label);
        $portfolioViewToggle.prop('disabled', portfolioViewTransitioning);
        $portfolioViewToggle.find('.fa').removeClass('fa-th-large fa-list-ul').addClass(isGrid ? 'fa-list-ul' : 'fa-th-large');
    }
    function resetPortfolioGridState() {
        $('body').removeClass('portfolio-grid-transition portfolio-grid-stage-exit portfolio-grid-stage-return portfolio-grid-stage-panel portfolio-grid-mode');
        $portfolioGrid.attr('aria-hidden', 'true');
        $('.carousel-page-number').removeClass('fadeOutRight').addClass('fadeInRight');
    }
    function enterPortfolioGridView() {
        renderPortfolioGrid();
        clearPortfolioViewTimers();
        portfolioViewTransitioning = true;
        portfolioViewMode = 'grid';
        $('body')
            .addClass('portfolio-grid-transition portfolio-grid-stage-exit')
            .removeClass('portfolio-grid-stage-panel portfolio-grid-mode');
        $portfolioGrid.attr('aria-hidden', 'true');
        $('.carousel-page-number').removeClass('fadeInRight').addClass('fadeOutRight');
        updatePortfolioViewToggle();
        schedulePortfolioViewStep(function() {
            $('body').addClass('portfolio-grid-stage-panel');
        }, PORTFOLIO_GRID_PANEL_DELAY);
        schedulePortfolioViewStep(function() {
            $('body').addClass('portfolio-grid-mode');
            $portfolioGrid.attr('aria-hidden', 'false');
            portfolioViewTransitioning = false;
            updatePortfolioViewToggle();
        }, PORTFOLIO_GRID_REVEAL_DELAY);
    }
    function exitPortfolioGridView(onComplete) {
        clearPortfolioViewTimers();
        portfolioViewMode = 'carousel';
        portfolioViewTransitioning = true;
        $('body')
            .addClass('portfolio-grid-transition portfolio-grid-stage-return portfolio-grid-stage-panel')
            .removeClass('portfolio-grid-mode portfolio-grid-stage-exit');
        $portfolioGrid.attr('aria-hidden', 'true');
        updatePortfolioViewToggle();
        schedulePortfolioViewStep(function() {
            if (pendingPortfolioGridTargetIndex !== null) {
                setPortfolioActiveIndexImmediate(pendingPortfolioGridTargetIndex);
                syncPortfolioUi(false);
            }
            $('body').removeClass('portfolio-grid-stage-panel');
        }, 20);
        schedulePortfolioViewStep(function() {
            resetPortfolioGridState();
            portfolioViewTransitioning = false;
            updatePortfolioViewToggle();
            if (pendingPortfolioGridTargetIndex !== null) {
                animateActivePortfolioItem();
                pendingPortfolioGridTargetIndex = null;
            }
            $.force_appear();
            if (typeof onComplete === 'function') {
                onComplete();
            }
        }, PORTFOLIO_RETURN_CONTENT_DELAY);
    }
    function setPortfolioView(mode, onComplete) {
        if (!$('#carousel_portfolio').length || !$portfolioViewToggle.length || !$portfolioGrid.length) {
            return;
        }
        if (portfolioViewTransitioning) {
            return;
        }
        if (mode === 'grid') {
            enterPortfolioGridView();
            return;
        }
        exitPortfolioGridView(onComplete);
    }
    $portfolioViewToggle.on('click', function(event) {
        event.preventDefault();
        setPortfolioView(portfolioViewMode === 'grid' ? 'carousel' : 'grid');
    });
    $portfolioGrid.on('click', '.portfolio-grid-card-open', function(event) {
        event.preventDefault();
        var targetIndex = parseInt($(this).data('target-index'), 10);
        pendingPortfolioGridTargetIndex = targetIndex;
        setPortfolioView('carousel');
    });
    updatePortfolioViewToggle();
    function startPortfolioCounterEdit() {
        var $current = jQuery('.carousel-page-number .current');
        if (!$current.length || $current.attr('contenteditable') === 'true') {
            return;
        }
        $current.attr('contenteditable', 'true').addClass('editing').focus();
        var range = document.createRange();
        range.selectNodeContents($current.get(0));
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    function finishPortfolioCounterEdit(commit) {
        var $current = jQuery('.carousel-page-number .current');
        if (!$current.length) {
            return;
        }
        var text = $current.text().replace(/\D/g, '');
        var target = parseInt(text, 10);
        $current.attr('contenteditable', 'false').removeClass('editing');
        if (commit && !isNaN(target)) {
            gotoPortfolioIndex(target);
            return;
        }
        var actual = getPortfolioCurrentIndex();
        $current.text(padded(actual));
    }
    jQuery('.carousel-page-number .current').on('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            finishPortfolioCounterEdit(true);
        } else if (event.key === 'Escape') {
            event.preventDefault();
            finishPortfolioCounterEdit(false);
        }
    });
    jQuery('.carousel-page-number .current').on('blur', function() {
        finishPortfolioCounterEdit(true);
    });
    jQuery('.carousel-page-number').on('dblclick', function(event) {
        event.preventDefault();
        startPortfolioCounterEdit();
    });
    gotoPortfolioFromUrl();
    animateActivePortfolioItem();
    (function() {
        var lastTap = 0;
        jQuery('.carousel-page-number').on('touchend', function(event) {
            var now = Date.now();
            if (now - lastTap < 300) {
                event.preventDefault();
                startPortfolioCounterEdit();
            }
            lastTap = now;
        });
    })();
    //animacio lekezelese amikor kivezetjük
    $('#carousel_portfolio').on('slide.bs.carousel', function() {
        //console.log('slide');
        $("#carousel_portfolio .item.active .animated.appear").each(function(index) {
            var thisis = $(this);
            var animate = thisis.data('hide-name');
            var delay = thisis.data('hide-delay');
            if (delay !== undefined) {
                setTimeout(function() {
                    thisis.addClass(animate);
                }, delay);
            } else {
                thisis.addClass(animate);
            }
        });
    });
    /* PORTFOLIO END */

    /* HOME */
    if (($("#video_about").length > 0)) {
        var vid;
        $('.home-box.mycolor').hover(function() {
            if ($('#video_about').find('video').length > 0) {
                vid = $('#video_about').find('video').get(0);
                vid.play();
            }
            if ($('#video_portfolio').find('video').length > 0) {
                $('#video_portfolio').find('video').get(0).pause();
            }
        }, function() {
            if ($('#video_about').find('video').length > 0) {
                vid = $('#video_about').find('video').get(0);
                vid.pause();
            }
        });
        setTimeout(function() {
            if ($('#video_about').find('video').length > 0) {
                vid = $('#video_about').find('video').get(0);
                vid.play();
            }
        }, 1800);
        //video
        $("#video_about").vide(base + "public/design/video/about", {
            volume: 1,
            playbackRate: 1,
            muted: true,
            loop: true,
            autoplay: false,
            position: "50% 50%",
            className: 'video_about'
        });

        $('.home-box.grey').hover(function() {
            if ($('#video_portfolio').find('video').length > 0) {
                vid = $('#video_portfolio').find('video').get(0);
                vid.play();
            }
            if ($('#video_about').find('video').length > 0) {
                $('#video_about').find('video').get(0).pause();
            }
        }, function() {
            if ($('#video_portfolio').find('video').length > 0) {
                vid = $('#video_portfolio').find('video').get(0);
                vid.pause();
            }
        });
        //video
        $("#video_portfolio").vide(base + "public/design/video/portfolio", {
            volume: 1,
            playbackRate: 1,
            muted: true,
            loop: true,
            autoplay: false,
            position: "50% 50%",
            className: 'video_portfolio'
        });
        //$('#video_portfolio video').fadeOut(0).delay(200).fadeIn(800);
    }
    /* HOME END */

    $(document).on('click', 'a', function() {
        $('#searchModal').modal('hide');
        if (!$(this).hasClass('noanimation')) {
            var link_delay = parseInt(1500);
            var link_href = $(this).attr('href');
            var link_target = $(this).attr('target');
            //console.log(link_href+' | '+link_target);
            if (typeof link_href != 'undefined' && link_target !== '_blank' && !isNaN(link_delay)) {
                //visszafele animacio
                animtedHide();
                //egyelore igy rejtjuk el a menut
                $("#navbar-open-button").removeClass('navbar-close');
                $("body").removeClass('navbar-open');

                setTimeout(function() {
                    window.location = link_href;
                }, link_delay);
                return false;
            }
        }
    });

    /* cookie */
    jQuery('#cookie_policy_accept').click(function() {
        setCookie('cookie_policy', 'accepted', 180);
        var thisis = $(this).parents('#cookie_policy_container');
        if (thisis.hasClass('appearjustmobile') && window.innerWidth <= 991) {
            tmpHideAnimate(thisis);
        } else if (!thisis.hasClass('appearjustmobile')) {
            tmpHideAnimate(thisis);
        }
        return false;
    });
    /* cookie end */

    $(".wcag-icon").click(function() {
        setWcag();
        return false;
    });
});

function animtedHide() {
    $('.awards-container').removeClass('crushed');
    $(".animated.now, .animated.appear").each(function(index) {
        var thisis = $(this);
        if (thisis.hasClass('appearjustmobile') && window.innerWidth <= 991) {
            tmpHideAnimate(thisis);
        } else if (!thisis.hasClass('appearjustmobile')) {
            tmpHideAnimate(thisis);
        }
    });
}

function tmpHideAnimate(thisis) {
    if (typeof thisis !== 'undefined') {
        var animate = thisis.data('hide-name');
        var delay = thisis.data('hide-delay');
        if (delay !== undefined) {
            setTimeout(function() {
                thisis.addClass(animate);
            }, delay);
        } else {
            thisis.addClass(animate);
        }
    }
}
