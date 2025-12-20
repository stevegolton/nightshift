import m from 'mithril';
import './Layout.css';
import Nav from './Nav';

const Layout: m.Component = {
  view(vnode: m.Vnode): m.Vnode {
    return m('.app-layout', [m(Nav), m('main.app-main', vnode.children)]);
  },
};

export default Layout;
