import m from 'mithril';
import './Input.css';

export interface InputAttrs {
  /** Input type */
  type?: 'text' | 'password' | 'email' | 'number' | 'search';
  /** Material Icon name (e.g., 'search', 'person', 'lock') */
  icon?: string;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Placeholder text */
  placeholder?: string;
  /** Current value */
  value?: string;
  /** Input is disabled */
  disabled?: boolean;
  /** Additional class names */
  class?: string;
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
      class: className,
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
        class: className,
        oninput,
        onchange,
        onfocus,
        onblur,
        onkeydown,
      });
    }

    // With icon, wrap in container
    const wrapperClasses = ['bl-input-wrapper'];
    if (iconPosition === 'right') wrapperClasses.push('icon-right');
    if (className) wrapperClasses.push(className);

    const iconEl = m('.bl-input-icon', m('span.material-icons', icon));

    return m('div', { class: wrapperClasses.join(' ') }, [
      iconPosition === 'left' ? iconEl : null,
      inputEl,
      iconPosition === 'right' ? iconEl : null,
    ]);
  },
};

export default Input;
