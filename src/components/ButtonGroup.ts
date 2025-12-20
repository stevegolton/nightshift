import m from 'mithril';
import cx from 'classnames';

export interface ButtonGroupAttrs {
  /** Additional CSS classes */
  class?: string;
}

const ButtonGroup: m.Component<ButtonGroupAttrs> = {
  view(vnode) {
    return m('div', { class: cx('bl-btn-group', vnode.attrs.class) }, vnode.children);
  },
};

export default ButtonGroup;
