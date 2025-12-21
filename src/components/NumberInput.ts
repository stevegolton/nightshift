import m from 'mithril';
import cx from 'classnames';
import './NumberInput.css';

export interface NumberInputAttrs {
  /** Current value */
  value: number;
  /** Label text (e.g., 'X', 'Y', 'Z') */
  label?: string;
  /** Unit suffix (e.g., 'm', 'kg', '°/s') */
  unit?: string;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Decimal precision for display */
  precision?: number;
  /** Input width in pixels */
  width?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional class names */
  class?: string;
  /** Change handler */
  onchange?: (value: number, e: Event) => void;
  /** Input handler (fires during typing) */
  oninput?: (value: number, e: Event) => void;
}

interface NumberInputState {
  isDragging: boolean;
  startX: number;
  startValue: number;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: () => void;
}

const NumberInput: m.Component<NumberInputAttrs, NumberInputState> = {
  oninit(vnode) {
    const state = vnode.state;
    state.isDragging = false;
    state.startX = 0;
    state.startValue = 0;

    state.handleMouseMove = (e: MouseEvent) => {
      if (!state.isDragging) return;

      const { min, max, step = 1, oninput } = vnode.attrs;
      const delta = e.clientX - state.startX;
      const sensitivity = e.shiftKey ? 0.1 : 1;
      let newValue = state.startValue + delta * step * sensitivity * 0.1;

      if (min !== undefined) newValue = Math.max(min, newValue);
      if (max !== undefined) newValue = Math.min(max, newValue);

      if (oninput) oninput(newValue, e);
      m.redraw();
    };

    state.handleMouseUp = () => {
      state.isDragging = false;
      document.removeEventListener('mousemove', state.handleMouseMove);
      document.removeEventListener('mouseup', state.handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      m.redraw();
    };
  },

  view(vnode) {
    const {
      value,
      label,
      unit,
      min,
      max,
      precision = 3,
      width,
      disabled,
      class: className,
      onchange,
      oninput,
    } = vnode.attrs;

    const state = vnode.state;

    const classes = cx('bl-number-input', className, {
      'bl-number-input-disabled': disabled,
    });

    const displayValue = (value ?? 0).toFixed(precision);

    function handleMouseDown(e: MouseEvent): void {
      if (disabled) return;

      state.isDragging = true;
      state.startX = e.clientX;
      state.startValue = value ?? 0;

      document.addEventListener('mousemove', state.handleMouseMove);
      document.addEventListener('mouseup', state.handleMouseUp);

      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return m('div', { class: classes }, [
      label &&
        m(
          'span.bl-number-label',
          {
            onmousedown: handleMouseDown,
          },
          label
        ),
      m('input[type=text]', {
        value: displayValue,
        disabled,
        style: width ? { width: `${width}px` } : undefined,
        onchange: (e: Event) => {
          const target = e.target as HTMLInputElement;
          let newValue = parseFloat(target.value);
          if (isNaN(newValue)) newValue = 0;
          if (min !== undefined) newValue = Math.max(min, newValue);
          if (max !== undefined) newValue = Math.min(max, newValue);
          if (onchange) onchange(newValue, e);
        },
        oninput: (e: Event) => {
          const target = e.target as HTMLInputElement;
          const newValue = parseFloat(target.value);
          if (!isNaN(newValue) && oninput) {
            let clampedValue = newValue;
            if (min !== undefined) clampedValue = Math.max(min, clampedValue);
            if (max !== undefined) clampedValue = Math.min(max, clampedValue);
            oninput(clampedValue, e);
          }
        },
      }),
      unit && m('span.bl-number-unit', unit),
    ]);
  },
};

export default NumberInput;
