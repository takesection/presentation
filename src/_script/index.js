const bespoke = require("bespoke");
const keys = require("bespoke-keys");
const touch = require("bespoke-touch");
const insertCss = require("insert-css");

const css = ".bespoke-slide { position:absolute;left:0;top:0;width:100%;height:100% } .bespoke-inactive { opacity:0;pointer-events:none } .bespoke-active { opacity:1;pointer-events:auto }";
insertCss(css, { prepend: true });

const elements = document.querySelectorAll('#p > svg');
const classes = function(deck) {
    var addClass = function(el, cls) {
        el.classList.add('bespoke-' + cls);
      },

      removeClass = function(el, cls) {
        if (el instanceof SVGElement) {
            el.setAttribute("class", el.getAttribute("class")
                .replace(new RegExp('bespoke-' + cls +'(\\s|$)', 'g'), ' ')
                .trim());
        } else {
            el.className = el.className
                .replace(new RegExp('bespoke-' + cls +'(\\s|$)', 'g'), ' ')
                .trim();
        }
      },

      deactivate = function(el, index) {
        var activeSlide = deck.slides[deck.slide()],
          offset = index - deck.slide(),
          offsetClass = offset > 0 ? 'after' : 'before';

        ['before(-\\d+)?', 'after(-\\d+)?', 'active', 'inactive'].map(removeClass.bind(null, el));

        if (el !== activeSlide) {
          ['inactive', offsetClass, offsetClass + '-' + Math.abs(offset)].map(addClass.bind(null, el));
        }
      };

    addClass(deck.parent, 'parent');
    deck.slides.map(function(el) { addClass(el, 'slide'); });

    deck.on('activate', function(e) {
      deck.slides.map(deactivate);
      addClass(e.slide, 'active');
      removeClass(e.slide, 'inactive');
    });
};
const deck = bespoke.from({ parent: '#p', slides: '#p > svg' }, [ classes, keys(), touch() ]);
