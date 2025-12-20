import m from 'mithril';
import './NumberInput.css';

export interface NumberInputAttrs {
  /** Current value */
  value: number;
  /** Label text (e.g., 'X', 'Y', 'Z') */
  label?: string;
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
  currentAttrs: NumberInputAttrs | null;
}

const NumberInput = (): m.Component<NumberInputAttrs> => {
  const state: NumberInputState = {
    isDragging: false,
    startX: 0,
    startValue: 0,
    currentAttrs: null,
  };

  let labelEl: HTMLElement | null = null;

  function handleMouseMove(e: MouseEvent): void {
    if (!state.isDragging || !state.currentAttrs) return;

    const { min, max, step = 1, oninput } = state.currentAttrs;
    const delta = e.clientX - state.startX;
    const sensitivity = e.shiftKey ? 0.1 : 1;
    let newValue = state.startValue + delta * step * sensitivity * 0.1;

    if (min !== undefined) newValue = Math.max(min, newValue);
    if (max !== undefined) newValue = Math.min(max, newValue);

    if (oninput) oninput(newValue, e);
    m.redraw();
  }

  function handleMouseUp(): void {
    state.isDragging = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    m.redraw();
  }

  function handleMouseDown(e: MouseEvent, attrs: NumberInputAttrs): void {
    if (attrs.disabled) return;

    state.isDragging = true;
    state.startX = e.clientX;
    state.startValue = attrs.value;
    state.currentAttrs = attrs;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    if (labelEl) {
      labelEl.style.cursor = 'ew-resize';
    }
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  }

  return {
    view(vnode) {
      const {
        value,
        label,
        min,
        max,
        precision = 3,
        width,
        disabled,
        class: className,
        onchange,
        oninput,
      } = vnode.attrs;

      // Keep attrs reference updated for drag handler
      state.currentAttrs = vnode.attrs;

      const classes = ['bl-number-input'];
      if (disabled) classes.push('bl-number-input-disabled');
      if (className) classes.push(className);

      const displayValue = value.toFixed(precision);

      return m('div', { class: classes.join(' ') }, [
        label &&
          m(
            'span.bl-number-label',
            {
              oncreate: (vn: m.VnodeDOM) => {
                labelEl = vn.dom as HTMLElement;
              },
              onmousedown: (e: MouseEvent) => handleMouseDown(e, vnode.attrs),
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
      ]);
    },
  };
};

export default NumberInput;
