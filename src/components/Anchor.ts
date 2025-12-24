import m from 'mithril';
import './Anchor.css';
import { parseIcon, IconProp } from '../utils/icon';

export interface AnchorAttrs {
  /** Link URL */
  href: string;
  /** Material icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Open in new tab */
  external?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Click handler */
  onclick?: (e: Event) => void;
}

const Anchor: m.Component<AnchorAttrs> = {
  view(vnode) {
    const {
      href,
      icon,
      iconPosition = 'left',
      external = false,
      disabled = false,
      className,
      onclick,
    } = vnode.attrs;

    const classes = ['bl-anchor'];
    if (icon) classes.push('bl-anchor-with-icon');
    if (disabled) classes.push('bl-anchor-disabled');
    if (className) classes.push(className);

    const iconEl = icon
      ? (() => {
          const { name, filled } = parseIcon(icon);
          return m('span.bl-anchor-icon.material-symbols-outlined', { class: filled ? 'filled' : '' }, name);
        })()
      : null;

    return m(
      'a',
      {
        href: disabled ? undefined : href,
        class: classes.join(' '),
        target: external ? '_blank' : undefined,
        rel: external ? 'noopener noreferrer' : undefined,
        onclick: disabled ? (e: Event) => e.preventDefault() : onclick,
      },
      [
        iconPosition === 'left' ? iconEl : null,
        vnode.children,
        iconPosition === 'right' ? iconEl : null,
      ]
    );
  },
};

export default Anchor;
