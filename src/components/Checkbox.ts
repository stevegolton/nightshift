import m from 'mithril';
import cx from 'classnames';
import './Checkbox.css';

export interface CheckboxAttrs {
  /** Checkbox is checked */
  checked?: boolean;
  /** Checkbox is disabled */
  disabled?: boolean;
  /** Checkbox label */
  label?: string;
  /** Additional class names */
  class?: string;
  /** Change handler */
  onchange?: (checked: boolean, e: Event) => void;
}

const Checkbox: m.Component<CheckboxAttrs> = {
  view(vnode) {
    const { checked, disabled, label, class: className, onchange } = vnode.attrs;

    // Support children as label content
    const labelContent =
      vnode.children && (Array.isArray(vnode.children) ? vnode.children.length > 0 : true)
        ? vnode.children
        : label;

    return m('label', { class: cx('bl-checkbox', className) }, [
      m('input[type=checkbox]', {
        checked,
        disabled,
        onchange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (onchange) onchange(target.checked, e);
        },
      }),
      labelContent ? [' ', labelContent] : null,
    ]);
  },
};

export default Checkbox;
