'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rowLink;

var _turbo = require('@hotwired/turbo');

var Turbo = _interopRequireWildcard(_turbo);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Navigat to the passed `href`
 * @param  {Event} e The original event
 * @param  {String} href The URL to visit
 * @return {Void}
 */
function goToLink(e, href) {
  if (e.metaKey) {
    window.open(href);
  } else {
    Turbo.visit(href);
  }
}

/**
 * Allow the passed `el` to act like a link. Useful for having `<tr>` elements
 * link to their default action.
 * @param  {Node} el Bound element
 * @param  {Strng} props.href The link to send to
 * @return {Void}
 */
function rowLink(el, props) {
  el.addEventListener('click', function (e) {
    // Let other semantic clickables do their thing
    if (e.target.nodeName !== 'A' && e.target.nodeName !== 'BUTTON') {
      e.preventDefault();
      goToLink(e, props.href);
    }
  });
}