import m from 'mithril';
import cx from 'classnames';
import './Badge.css';

export interface BadgeAttrs {
  /** Badge variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Additional class names */
  className?: string;
}

const Badge: m.Component<BadgeAttrs> = {
  view(vnode) {
    const { variant, className } = vnode.attrs;

    const classes = cx('bl-badge', className, {
      'bl-badge-success': variant === 'success',
      'bl-badge-warning': variant === 'warning',
      'bl-badge-error': variant === 'error',
    });

    return m('span', { class: classes }, vnode.children);
  },
};

export default Badge;
