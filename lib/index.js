'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.views = undefined;
exports.default = roneo;

require('@hotwired/turbo');

var _domready = require('domready');

var _domready2 = _interopRequireDefault(_domready);

var _viewloader = require('viewloader');

var _viewloader2 = _interopRequireDefault(_viewloader);

var _views = require('./views');

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeNavOpenClasses() {
  // Remove any `.nav-aware` classes when widescreen
  var navAwareEls = Array.prototype.slice.call(document.querySelectorAll('.nav-aware'));
  navAwareEls.map(function (el) {
    el.classList.remove('nav-open');
  });
}

// Components
function roneo(views) {
  // Allow passing of specific views
  views = views || _views2.default;

  var viewloaderManager = (0, _viewloader2.default)(views);

  (0, _domready2.default)(function onDomready() {
    viewloaderManager.callViews();
  });
  // DOMContentLoaded equivalent with Turbo
  document.documentElement.addEventListener('turbo:render', function onTurboLoad() {
    viewloaderManager.callViews();
    var pageEl = document.querySelector('.page');
    if (pageEl) pageEl.classList.remove('page--inactive');
  });

  // Destroy views when navigating
  document.documentElement.addEventListener('turbo:before-render', function () {
    viewloaderManager.destroyViews();
    setTimeout(removeNavOpenClasses, 50);
    var pageEl = document.querySelector('.page');
    if (pageEl) pageEl.classList.add('page--inactive');
  });

  /**
   * Make adjustments based on breakpoints
   */
  var widescreenBreakpoint = window.matchMedia('(min-width: 1400px)');
  widescreenBreakpoint.addEventListener('change', function (e) {
    if (e.matches) {
      removeNavOpenClasses();
    }
  });
}

// Additional exports
exports.views = _views2.default;