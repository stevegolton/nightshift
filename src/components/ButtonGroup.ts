import m from 'mithril';
import cx from 'classnames';

export interface ButtonGroupAttrs {
  /** Additional CSS classes */
  className?: string;
}

const ButtonGroup: m.Component<ButtonGroupAttrs> = {
  view(vnode) {
    return m('div', { class: cx('bl-btn-group', vnode.attrs.className) }, vnode.children);
  },
};

export default ButtonGroup;
