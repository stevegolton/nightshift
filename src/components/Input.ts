import m from 'mithril';
import cx from 'classnames';
import './Input.css';
import { parseIcon, IconProp } from '../utils/icon';

export interface InputAttrs {
  /** Input type */
  type?: 'text' | 'password' | 'email' | 'number' | 'search';
  /** Material Icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value?: string;
  /** Input is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Input handler */
  oninput?: (e: Event) => void;
  /** Change handler */
  onchange?: (e: Event) => void;
  /** Focus handler */
  onfocus?: (e: Event) => void;
  /** Blur handler */
  onblur?: (e: Event) => void;
  /** Keydown handler */
  onkeydown?: (e: KeyboardEvent) => void;
}

const Input: m.Component<InputAttrs> = {
  view(vnode) {
    const {
      type = 'text',
      icon,
      iconPosition = 'left',
      placeholder,
      value,
      disabled,
      className,
      oninput,
      onchange,
      onfocus,
      onblur,
      onkeydown,
    } = vnode.attrs;

    const inputEl = m('input.bl-input', {
      type,
      placeholder,
      value,
      disabled,
      oninput,
      onchange,
      onfocus,
      onblur,
      onkeydown,
    });

    // If no icon, just return the input
    if (!icon) {
      return m('input.bl-input', {
        type,
        placeholder,
        value,
        disabled,
        className,
        oninput,
        onchange,
        onfocus,
        onblur,
        onkeydown,
      });
    }

    // With icon, wrap in container
    const wrapperClasses = cx('bl-input-wrapper', className, {
      'icon-right': iconPosition === 'right',
    });

    const { name: iconName, filled } = parseIcon(icon);
    const iconEl = m('.bl-input-icon', m('span.material-symbols-outlined', { class: filled ? 'filled' : '' }, iconName));

    return m('div', { class: wrapperClasses }, [
      iconPosition === 'left' ? iconEl : null,
      inputEl,
      iconPosition === 'right' ? iconEl : null,
    ]);
  },
};

export default Input;
