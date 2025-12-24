import m from 'mithril';
import cx from 'classnames';
import './Slider.css';

export interface SliderAttrs {
  /** Current value */
  value?: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Slider is disabled */
  disabled?: boolean;
  /** Show value display */
  showValue?: boolean;
  /** Format function for displayed value */
  formatValue?: (value: number) => string;
  /** Additional class names */
  className?: string;
  /** Input handler (fires during drag) */
  oninput?: (value: number, e: Event) => void;
  /** Change handler (fires on release) */
  onchange?: (value: number, e: Event) => void;
}

const Slider: m.Component<SliderAttrs> = {
  view(vnode) {
    const {
      value = 50,
      min = 0,
      max = 100,
      step = 1,
      disabled,
      showValue = true,
      formatValue = (v: number) => (v / 100).toFixed(2),
      className,
      oninput,
      onchange,
    } = vnode.attrs;

    return m('div', { class: cx('bl-slider', className) }, [
      m('input[type=range]', {
        value,
        min,
        max,
        step,
        disabled,
        oninput: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const newValue = parseFloat(target.value);
          if (oninput) oninput(newValue, e);
        },
        onchange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const newValue = parseFloat(target.value);
          if (onchange) onchange(newValue, e);
        },
      }),
      showValue && m('span.bl-slider-value', formatValue(value)),
    ]);
  },
};

export default Slider;
