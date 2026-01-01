import m from 'mithril';
import cx from 'classnames';
import './Input.css';
import { parseIcon, IconProp } from '../utils/icon';

export interface InputAttrs {
  /** Input type */
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'time';
  /** Material Icon name for left side. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Element to render on the right side (e.g., a ghost Button) */
  rightElement?: m.Children;
  /** Placeholder text */
  placeholder?: string;
  /** Current value (optional - component is uncontrolled if not provided) */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Input is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Input handler */
  oninput?: (value: string, e: Event) => void;
  /** Change handler */
  onchange?: (value: string, e: Event) => void;
  /** Focus handler */
  onfocus?: (e: Event) => void;
  /** Blur handler */
  onblur?: (e: Event) => void;
  /** Keydown handler */
  onkeydown?: (e: KeyboardEvent) => void;
}

export default function Input(): m.Component<InputAttrs> {
  let internalValue: string | undefined;

  return {
    view(vnode) {
      const {
        type = 'text',
        icon,
        rightElement,
        placeholder,
        value,
        defaultValue = '',
        disabled,
        className,
        oninput,
        onchange,
        onfocus,
        onblur,
        onkeydown,
      } = vnode.attrs;

      // Controlled vs uncontrolled mode
      const isControlled = value !== undefined;
      if (!isControlled && internalValue === undefined) {
        internalValue = defaultValue;
      }
      const currentValue = isControlled ? value : internalValue!;

      function updateValue(newValue: string): void {
        if (!isControlled) {
          internalValue = newValue;
        }
      }

      function handleInput(e: Event): void {
        const target = e.target as HTMLInputElement;
        updateValue(target.value);
        if (oninput) oninput(target.value, e);
      }

      function handleChange(e: Event): void {
        const target = e.target as HTMLInputElement;
        updateValue(target.value);
        if (onchange) onchange(target.value, e);
      }

      const hasIcon = !!icon;
      const hasRightElement = !!rightElement;
      const needsWrapper = hasIcon || hasRightElement;

      // If no decorations, just return the input
      if (!needsWrapper) {
        return m('input.bl-input', {
          type,
          placeholder,
          value: currentValue,
          disabled,
          className,
          oninput: handleInput,
          onchange: handleChange,
          onfocus,
          onblur,
          onkeydown,
        });
      }

      // With decorations, wrap in container
      const wrapperClasses = cx('bl-input-wrapper', className, {
        'has-icon': hasIcon,
        'has-right-element': hasRightElement,
      });

      const inputEl = m('input.bl-input', {
        type,
        placeholder,
        value: currentValue,
        disabled,
        oninput: handleInput,
        onchange: handleChange,
        onfocus,
        onblur,
        onkeydown,
      });

      let iconEl: m.Children = null;
      if (hasIcon) {
        const { name: iconName, filled } = parseIcon(icon);
        iconEl = m('.bl-input-icon', m('span.material-symbols-outlined', { class: filled ? 'filled' : '' }, iconName));
      }

      return m('div', { class: wrapperClasses }, [
        iconEl,
        inputEl,
        hasRightElement && m('.bl-input-right', rightElement),
      ]);
    },
  };
}
