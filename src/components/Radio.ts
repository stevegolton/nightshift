import m from 'mithril';
import cx from 'classnames';
import './Radio.css';

export interface RadioAttrs {
  /** Radio button name (groups radios together) */
  name: string;
  /** Radio button value */
  value: string;
  /** Radio is checked */
  checked?: boolean;
  /** Radio is disabled */
  disabled?: boolean;
  /** Radio label */
  label?: string;
  /** Additional class names */
  className?: string;
  /** Change handler */
  onchange?: (value: string, e: Event) => void;
}

const Radio: m.Component<RadioAttrs> = {
  view(vnode) {
    const { name, value, checked, disabled, label, className, onchange } = vnode.attrs;

    // Support children as label content
    const labelContent =
      vnode.children && (Array.isArray(vnode.children) ? vnode.children.length > 0 : true)
        ? vnode.children
        : label;

    return m('label', { class: cx('bl-radio', className) }, [
      m('input[type=radio]', {
        name,
        value,
        checked,
        disabled,
        onchange: (e: Event) => {
          if (onchange) onchange(value, e);
        },
      }),
      labelContent ? [' ', labelContent] : null,
    ]);
  },
};

export default Radio;
