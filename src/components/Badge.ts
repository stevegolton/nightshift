import m from 'mithril';
import cx from 'classnames';

export interface BadgeAttrs {
  /** Badge variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Additional class names */
  class?: string;
}

const Badge: m.Component<BadgeAttrs> = {
  view(vnode) {
    const { variant, class: className } = vnode.attrs;

    const classes = cx('bl-badge', className, {
      'bl-badge-success': variant === 'success',
      'bl-badge-warning': variant === 'warning',
      'bl-badge-error': variant === 'error',
    });

    return m('span', { class: classes }, vnode.children);
  },
};

export default Badge;
