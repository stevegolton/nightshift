import m from 'mithril';
import cx from 'classnames';
import './Select.css';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectAttrs {
  /** Options for the select */
  options: SelectOption[];
  /** Current value (optional - component is uncontrolled if not provided) */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Placeholder text (shows as first disabled option) */
  placeholder?: string;
  /** Select is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Change handler */
  onchange?: (value: string, e: Event) => void;
}

export default function Select(): m.Component<SelectAttrs> {
  let internalValue: string | undefined;

  return {
    view(vnode) {
      const { options, value, defaultValue, placeholder, disabled, className, onchange } = vnode.attrs;

      // Controlled vs uncontrolled mode
      const isControlled = value !== undefined;
      if (!isControlled && internalValue === undefined) {
        internalValue = defaultValue ?? (options.length > 0 ? options[0].value : '');
      }
      const currentValue = isControlled ? value : internalValue!;

      function updateValue(newValue: string): void {
        if (!isControlled) {
          internalValue = newValue;
        }
      }

      return m(
        'div',
        { class: cx('bl-select', className) },
        m(
          'select',
          {
            value: currentValue,
            disabled,
            onchange: (e: Event) => {
              const target = e.target as HTMLSelectElement;
              updateValue(target.value);
              if (onchange) onchange(target.value, e);
            },
          },
          [
            placeholder && m('option', { value: '', disabled: true, selected: !currentValue }, placeholder),
            options.map((opt) =>
              m(
                'option',
                {
                  value: opt.value,
                  disabled: opt.disabled,
                  selected: opt.value === currentValue,
                },
                opt.label
              )
            ),
          ]
        )
      );
    },
  };
}
