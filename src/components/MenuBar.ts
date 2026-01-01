import m from 'mithril';
import cx from 'classnames';
import './MenuBar.css';

export interface MenuBarAttrs {
  /** Optional content for the right side of the menu bar */
  rightContent?: m.Children;
  /** Additional class names */
  className?: string;
}

const MenuBar: m.Component<MenuBarAttrs> = {
  view(vnode) {
    const { rightContent, className } = vnode.attrs;

    return m('header.bl-header', { class: cx(className) }, [
      m('.bl-header-menu', vnode.children),
      rightContent,
    ]);
  },
};

export default MenuBar;
