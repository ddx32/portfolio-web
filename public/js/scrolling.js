function isElementInViewport (el) {

    var rect = el.getBoundingClientRect();

    return ( rect.top <= (window.innerHeight || document.documentElement.clientHeight) );
}

var el = document.querySelectorAll('.portfolio__item');

var handler =  function() {
    for (var i = 0; i < el.length; i++) {
        if (isElementInViewport(el[i])) {
            el[i].classList.add('skewed');
        }
    }
};


if (window.addEventListener) {
    addEventListener('DOMContentLoaded', handler, false);
    addEventListener('load', handler, false);
    addEventListener('scroll', handler, false);
    addEventListener('resize', handler, false);
} else if (window.attachEvent)  {
    attachEvent('onDOMContentLoaded', handler);
    attachEvent('onload', handler);
    attachEvent('onscroll', handler);
    attachEvent('onresize', handler);
}
