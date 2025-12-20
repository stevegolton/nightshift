var m = require('mithril');
var state = require('../state');
var State = state.State;
var toggleTheme = state.toggleTheme;

function NavItem(route, icon, label) {
  var currentRoute = m.route.get();
  var isActive = currentRoute === route;
  return m('a.app-nav-item', {
    class: isActive ? 'active' : '',
    href: '#!/' + route,
    oncreate: m.route.link,
    onupdate: m.route.link
  }, [
    m.trust(icon),
    m('span.app-nav-item-label', label)
  ]);
}

var Nav = {
  view: function() {
    return m('nav.app-nav', { class: State.navCollapsed ? 'collapsed' : '', id: 'appNav' }, [
      m('.app-nav-header', [
        m('button.app-nav-toggle', {
          onclick: function() { State.navCollapsed = !State.navCollapsed; },
          title: 'Toggle sidebar'
        }, m.trust('<svg viewBox="0 0 16 16"><path d="M11 3L5 8l6 5V3z"/></svg>')),
        m('span.app-nav-title', 'Blender UI')
      ]),
      m('.app-nav-items', [
        NavItem('widgets', '<svg viewBox="0 0 16 16"><path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z"/></svg>', 'Widgets'),
        NavItem('profiler', '<svg viewBox="0 0 16 16"><path d="M1 14h14v1H1v-1zm1-3h2v3H2v-3zm3-2h2v5H5V9zm3-4h2v9H8V5zm3 2h2v7h-2V7z"/></svg>', 'Profiler'),
        NavItem('plugins', '<svg viewBox="0 0 16 16"><path d="M6 1v3H4.5A1.5 1.5 0 0 0 3 5.5v1A1.5 1.5 0 0 0 4.5 8H6v7h4V8h1.5A1.5 1.5 0 0 0 13 6.5v-1A1.5 1.5 0 0 0 11.5 4H10V1H6z"/></svg>', 'Plugins')
      ]),
      m('.app-nav-footer', [
        m('.app-nav-item', { onclick: toggleTheme }, [
          m.trust('<svg viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5V2.5a5.5 5.5 0 0 1 0 11z"/></svg>'),
          m('span.app-nav-item-label', 'Toggle Theme')
        ])
      ])
    ]);
  }
};

module.exports = Nav;
