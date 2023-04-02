/*

	Adjuk a 'scroll-indicator-start' osztályt annak az elemnek, amelynek a megjelenésétől indítani akarjuk a scrollBar-t!
	Adjuk a 'scroll-indicator-stop' osztályt annak az elemnek, amelynek ha megjelenk az alja, akkor a scrollBar 100% széles legyen!
	Ha valamelyik nincs megadva, az sem gond, akkor az oldal teteje, illetve az alja lesz a viszonyítási pont.

*/

var scrollIndicatorOriantation = 'horizontal'; // 'horizontal'; 'vertical'

initScrollIndicator();

window.onload = function() {
    scrollIndicatorUpdate();
};
window.onresize = function() {
    scrollIndicatorUpdate();
};
window.onscroll = function() {
    scrollIndicatorUpdate();
};

function initScrollIndicator() {
    var scrollIndicator = document.getElementById("scroll_indicator_container");
    if (scrollIndicator === null) {
        //console.log('Nem található');
        var scrollIndicator = document.createElement('div');
        scrollIndicator.id = 'scroll_indicator_container';
        scrollIndicator.setAttribute("class", 'scroll-indicator-container' /*+' hidden-xs hidden-sm'*/ );
        scrollIndicator.classList.add('sic-' + (scrollIndicatorOriantation == 'vertical' ? 'vertical' : 'horizontal'));
        var scrollIndicatorBar = document.createElement('div');
        scrollIndicatorBar.id = 'scroll_indicator_bar';
        scrollIndicatorBar.setAttribute("class", 'scroll-indicator-bar');
        scrollIndicator.appendChild(scrollIndicatorBar);
        document.body.appendChild(scrollIndicator);
    }
}

// Mert az offsetTop nem jó értéket ad vissza (JS offsetTop property is not great and here is why)
// Forrás 1: https://medium.com/@alexcambose/js-offsettop-property-is-not-great-and-here-is-why-b79842ef7582
// Forrás 2: https://muffinman.io/blog/javascript-get-element-offset/

if (typeof getElementOffset === 'undefined') {
    function getElementOffset(el) {
        let top = 0;
        let left = 0;
        let element = el;

        // Loop through the DOM tree
        // and add it's parent's offset to get page offset
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return {
            top: top,
            left: left
        };
    }
}

// Another way is using getBoundingClientRect which is cool because it takes CSS transforms into calculations and it is natively supported. No need to loop through the element’s parents. But it’s top and left properties are distances from the viewport, not from the document. Because of this, you need to add document scroll to it.
//Just note one thing, there is a known bug with iOS and getBoundingClientRect in combination with position: fixed. Sometimes it is returning wrong values. So when you have fixed elements, you probably want to fallback to the method above
/*function getElementOffset(el) {
	const rect = el.getBoundingClientRect();
	return {
		top: rect.top + window.pageYOffset,
		left: rect.left + window.pageXOffset
	};
}
*/

function scrollIndicatorUpdate() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var scrollDistance = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrollCalculated = winScroll;
    //console.log(winScroll);

    var checkFrom = 0;
    var checkFromItems = document.getElementsByClassName("scroll-indicator-start");
    if (checkFromItems.length > 0) {
        checkFromOffsets = getElementOffset(checkFromItems[0]);
        // Csak akkor kell figyelembe venni ha hajtás alatt kezdődik ez a tartalom
        if (checkFromOffsets['top'] > document.documentElement.clientHeight) {
            checkFrom = checkFromOffsets['top'] - document.documentElement.clientHeight;
            scrollDistance -= checkFrom;
            scrollCalculated -= checkFrom;
        }
    }
    //console.log(checkFrom);

    var checkTo = 0;
    var checkToItems = document.getElementsByClassName("scroll-indicator-stop");
    if (checkToItems.length > 0) {
        checkToOffsets = getElementOffset(checkToItems[0]);
        checkTo = checkToOffsets['top'] + checkToItems[0].offsetHeight;
        scrollDistance -= (document.documentElement.scrollHeight - checkTo);
    }
    //console.log(checkTo);

    //console.log(scrollDistance);

    // Ha ez a feltétel nincs benne, akkor abban az esetben, ha nem kell görgetni a 100% eléréséig, akkor nem jelenik meg a csík
    // Azt, hogy melyik jobb, azt nem tudom, egyelőre így hagyon, talán így kicsit következetesebb a működés
    if (scrollDistance > 0 || winScroll == 0) {
        var scrollCalculated = (winScroll - checkFrom);
        if (scrollCalculated < 0) {
            scrollCalculated = 0;
        }
        //console.log(scrollCalculated);

        var scrolled = (scrollCalculated / scrollDistance) * 100;
        if (scrolled > 100) {
            scrolled = 100;
        } else if (scrolled <= 0) {
            scrolled = 0;
        }
    } else {
        scrolled = 100;
    }
    //console.log(scrolled);

    var scrollIndicatorBar = document.getElementById("scroll_indicator_bar");

    if (scrollIndicatorBar.parentElement.classList.contains('sic-horizontal')) {
        scrollIndicatorBar.style.width = scrolled + "%";
    } else {
        scrollIndicatorBar.style.height = scrolled + "%";
    }
}