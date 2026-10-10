import '@hotwired/turbo'
import domready from 'domready'
import viewloader from 'viewloader'

// Components
import {default as defaultViews} from './views'

function removeNavOpenClasses () {
  // Remove any `.nav-aware` classes when widescreen
  let navAwareEls = Array.prototype.slice.call(
    document.querySelectorAll('.nav-aware')
  )
  navAwareEls.map((el) => {
    el.classList.remove('nav-open')
  })
}

export default function roneo (views) {
  // Allow passing of specific views
  views = views || defaultViews

  let viewloaderManager = viewloader(views)

  domready(function onDomready () {
    viewloaderManager.callViews()
  })
  // DOMContentLoaded equivalent with Turbo
  document.documentElement.addEventListener('turbo:render', function onTurboLoad () {
    viewloaderManager.callViews()
    let pageEl = document.querySelector('.page')
    if (pageEl) pageEl.classList.remove('page--inactive')
  })

  // Destroy views when navigating
  document.documentElement.addEventListener('turbo:before-render', () => {
    viewloaderManager.destroyViews()
    setTimeout(removeNavOpenClasses, 50)
    let pageEl = document.querySelector('.page')
    if (pageEl) pageEl.classList.add('page--inactive')
  })

  /**
   * Make adjustments based on breakpoints
   */
  const widescreenBreakpoint = window.matchMedia('(min-width: 1400px)')
  widescreenBreakpoint.addEventListener('change', (e) => {
    if (e.matches) {
      removeNavOpenClasses()
    }
  })
}

// Additional exports
export {defaultViews as views}
