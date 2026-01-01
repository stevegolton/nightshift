import m from 'mithril';
import cx from 'classnames';
import './ButtonGroup.css';

export interface ButtonGroupAttrs {
  /** Additional CSS classes */
  className?: string;
  /** Stack buttons vertically */
  vertical?: boolean;
}

const ButtonGroup: m.Component<ButtonGroupAttrs> = {
  view(vnode) {
    return m(
      'div',
      {
        class: cx('bl-btn-group', vnode.attrs.className, {
          'bl-btn-group-vertical': vnode.attrs.vertical,
        }),
      },
      vnode.children
    );
  },
};

export default ButtonGroup;
