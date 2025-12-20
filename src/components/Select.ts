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
  /** Current value */
  value?: string;
  /** Placeholder text (shows as first disabled option) */
  placeholder?: string;
  /** Select is disabled */
  disabled?: boolean;
  /** Additional class names */
  class?: string;
  /** Change handler */
  onchange?: (value: string, e: Event) => void;
}

const Select: m.Component<SelectAttrs> = {
  view(vnode) {
    const { options, value, placeholder, disabled, class: className, onchange } = vnode.attrs;

    return m(
      'div',
      { class: cx('bl-select', className) },
      m(
        'select',
        {
          value,
          disabled,
          onchange: (e: Event) => {
            const target = e.target as HTMLSelectElement;
            if (onchange) onchange(target.value, e);
          },
        },
        [
          placeholder && m('option', { value: '', disabled: true, selected: !value }, placeholder),
          options.map((opt) =>
            m(
              'option',
              {
                value: opt.value,
                disabled: opt.disabled,
                selected: opt.value === value,
              },
              opt.label
            )
          ),
        ]
      )
    );
  },
};

export default Select;
