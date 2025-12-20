import m from 'mithril';
import './Nav.css';
import { State, toggleTheme } from '../state';

function NavItem(route: string, icon: string, label: string): m.Vnode {
  const currentRoute = m.route.get();
  const isActive = currentRoute === route;
  return m(
    'a.app-nav-item',
    {
      class: isActive ? 'active' : '',
      href: '#/' + route,
    },
    [m('span.material-icons', icon), m('span.app-nav-item-label', label)]
  );
}

const Nav: m.Component = {
  view(): m.Vnode {
    return m('nav.app-nav', { class: State.navCollapsed ? 'collapsed' : '', id: 'appNav' }, [
      m('.app-nav-header', [
        m(
          'button.app-nav-toggle',
          {
            onclick: () => {
              State.navCollapsed = !State.navCollapsed;
            },
            title: 'Toggle sidebar',
          },
          m('span.material-icons', 'chevron_left')
        ),
        m('span.app-nav-title', 'Nightshift UI'),
      ]),
      m('.app-nav-items', [
        NavItem('widgets', 'widgets', 'Widgets'),
        NavItem('profiler', 'bar_chart', 'Profiler'),
        NavItem('plugins', 'extension', 'Plugins'),
      ]),
      m('.app-nav-footer', [
        m('.app-nav-item', { onclick: toggleTheme }, [
          m('span.material-icons', 'contrast'),
          m('span.app-nav-item-label', 'Toggle Theme'),
        ]),
      ]),
    ]);
  },
};

export default Nav;
