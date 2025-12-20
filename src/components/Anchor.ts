import m from 'mithril';
import './Anchor.css';

export interface AnchorAttrs {
  /** Link URL */
  href: string;
  /** Material icon name */
  icon?: string;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Open in new tab */
  external?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  class?: string;
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
      class: className,
      onclick,
    } = vnode.attrs;

    const classes = ['bl-anchor'];
    if (icon) classes.push('bl-anchor-with-icon');
    if (disabled) classes.push('bl-anchor-disabled');
    if (className) classes.push(className);

    const iconEl = icon ? m('span.bl-anchor-icon.material-icons', icon) : null;

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
