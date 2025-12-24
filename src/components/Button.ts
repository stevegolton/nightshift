import m from 'mithril';
import cx from 'classnames';
import './Button.css';
import { renderIcon, IconProp } from '../utils/icon';

export interface ButtonAttrs {
  /** Button variant */
  variant?: 'default' | 'primary' | 'toggle' | 'ghost';
  /** Material Icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Button is currently active/pressed */
  active?: boolean;
  /** Button is disabled */
  disabled?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Click handler */
  onclick?: (e: Event) => void;
}

const Button: m.Component<ButtonAttrs> = {
  view(vnode) {
    const { variant, icon, active, disabled, tooltip, onclick } = vnode.attrs;

    const hasChildren =
      vnode.children && (Array.isArray(vnode.children) ? vnode.children.length > 0 : true);

    const classes = cx('bl-btn', {
      'bl-btn-primary': variant === 'primary',
      'bl-btn-toggle': variant === 'toggle',
      'bl-btn-ghost': variant === 'ghost',
      'bl-btn-icon': icon && !hasChildren,
      active,
      'bl-tooltip': tooltip,
    });

    const content: m.Children[] = [];

    if (icon) {
      content.push(renderIcon(icon));
    }

    const children = vnode.children;
    if (children && Array.isArray(children) && children.length) {
      content.push(...children);
    } else if (children && !Array.isArray(children)) {
      content.push(children);
    }

    return m(
      'button',
      {
        class: classes,
        disabled,
        onclick,
        'data-tooltip': tooltip,
      },
      content
    );
  },
};

export default Button;
