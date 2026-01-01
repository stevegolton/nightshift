import m from 'mithril';
import cx from 'classnames';
import './NumberInput.css';

export interface NumberInputAttrs {
  /** Current value (optional - component is uncontrolled if not provided) */
  value?: number;
  /** Initial value for uncontrolled mode */
  defaultValue?: number;
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
  className?: string;
  /** Change handler */
  onchange?: (value: number, e: Event) => void;
  /** Input handler (fires during typing) */
  oninput?: (value: number, e: Event) => void;
}

export default function NumberInput(): m.Component<NumberInputAttrs> {
  let isDragging = false;
  let startX = 0;
  let startValue = 0;
  let internalValue: number | undefined;

  return {
    view(vnode) {
      const {
        value,
        defaultValue = 0,
        label,
        unit,
        min,
        max,
        step = 1,
        precision = 3,
        width,
        disabled,
        className,
        onchange,
        oninput,
      } = vnode.attrs;

      // Controlled vs uncontrolled mode
      const isControlled = value !== undefined;
      if (!isControlled && internalValue === undefined) {
        internalValue = defaultValue;
      }
      const currentValue = isControlled ? value : internalValue!;

      function updateValue(newValue: number): void {
        if (!isControlled) {
          internalValue = newValue;
        }
      }

      const classes = cx('bl-number-input', className, {
        'bl-number-input-disabled': disabled,
      });

      const displayValue = currentValue.toFixed(precision);

      function handlePointerDown(e: PointerEvent): void {
        if (disabled) return;

        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        isDragging = true;
        startX = e.clientX;
        startValue = currentValue;

        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
      }

      function handlePointerMove(e: PointerEvent): void {
        if (!isDragging) return;

        const delta = e.clientX - startX;
        const sensitivity = e.shiftKey ? 0.1 : 1;
        let newValue = startValue + delta * step * sensitivity * 0.1;

        if (min !== undefined) newValue = Math.max(min, newValue);
        if (max !== undefined) newValue = Math.min(max, newValue);

        updateValue(newValue);
        if (oninput) oninput(newValue, e);
        m.redraw();
      }

      function handlePointerUp(e: PointerEvent): void {
        if (!isDragging) return;

        const target = e.currentTarget as HTMLElement;
        target.releasePointerCapture(e.pointerId);

        isDragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        m.redraw();
      }

      return m('div', { class: classes }, [
        label &&
          m(
            'span.bl-number-label',
            {
              onpointerdown: handlePointerDown,
              onpointermove: handlePointerMove,
              onpointerup: handlePointerUp,
              onpointercancel: handlePointerUp,
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
            updateValue(newValue);
            if (onchange) onchange(newValue, e);
          },
          oninput: (e: Event) => {
            const target = e.target as HTMLInputElement;
            const newValue = parseFloat(target.value);
            if (!isNaN(newValue)) {
              let clampedValue = newValue;
              if (min !== undefined) clampedValue = Math.max(min, clampedValue);
              if (max !== undefined) clampedValue = Math.min(max, clampedValue);
              updateValue(clampedValue);
              if (oninput) oninput(clampedValue, e);
            }
          },
        }),
        unit && m('span.bl-number-unit', unit),
      ]);
    },
  };
}
