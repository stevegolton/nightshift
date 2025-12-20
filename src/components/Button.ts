import m from 'mithril';
import './Button.css';

export interface ButtonAttrs {
  /** Button variant */
  variant?: 'default' | 'primary' | 'toggle' | 'ghost';
  /** Material Icon name (e.g., 'home', 'settings', 'delete') */
  icon?: string;
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

    const classes = ['bl-btn'];

    if (variant === 'primary') classes.push('bl-btn-primary');
    if (variant === 'toggle') classes.push('bl-btn-toggle');
    if (variant === 'ghost') classes.push('bl-btn-ghost');
    const hasChildren =
      vnode.children && (Array.isArray(vnode.children) ? vnode.children.length > 0 : true);
    if (icon && !hasChildren) classes.push('bl-btn-icon');
    if (active) classes.push('active');
    if (tooltip) classes.push('bl-tooltip');

    const content: m.Children[] = [];

    if (icon) {
      content.push(m('span.material-icons', icon));
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
        class: classes.join(' '),
        disabled,
        onclick,
        'data-tooltip': tooltip,
      },
      content
    );
  },
};

export default Button;
