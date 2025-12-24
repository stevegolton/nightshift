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

  return {
    view(vnode) {
      const {
        value,
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

      const classes = cx('bl-number-input', className, {
        'bl-number-input-disabled': disabled,
      });

      const displayValue = (value ?? 0).toFixed(precision);

      function handlePointerDown(e: PointerEvent): void {
        if (disabled) return;

        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        isDragging = true;
        startX = e.clientX;
        startValue = value ?? 0;

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
}
