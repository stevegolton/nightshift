import m from 'mithril';
import cx from 'classnames';
import './TimeInput.css';

export interface TimeInputAttrs {
  /** Input type: time, date, or datetime-local */
  type?: 'time' | 'date' | 'datetime-local';
  /** Current value (optional - component is uncontrolled if not provided) */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** Optional label displayed before the input */
  label?: string;
  /** Input is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
  /** Change handler */
  onchange?: (value: string, e: Event) => void;
  /** Input handler (fires during drag) */
  oninput?: (value: string, e: Event) => void;
}

export default function TimeInput(): m.Component<TimeInputAttrs> {
  let isDragging = false;
  let startX = 0;
  let startValue = '';
  let internalValue: string | undefined;

  function getDefaultValue(type: string): string {
    const now = new Date();
    if (type === 'time') {
      return now.toTimeString().slice(0, 5); // HH:MM
    } else if (type === 'date') {
      return now.toISOString().slice(0, 10); // YYYY-MM-DD
    } else {
      // datetime-local
      return now.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    }
  }

  function adjustTime(timeStr: string, deltaMinutes: number): string {
    const [hours, minutes] = timeStr.split(':').map(Number);
    let totalMinutes = hours * 60 + minutes + deltaMinutes;
    // Wrap around 24 hours
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  }

  function adjustDate(dateStr: string, deltaDays: number): string {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + deltaDays);
    return date.toISOString().slice(0, 10);
  }

  function adjustDateTime(dtStr: string, deltaMinutes: number): string {
    const date = new Date(dtStr);
    date.setMinutes(date.getMinutes() + deltaMinutes);
    return date.toISOString().slice(0, 16);
  }

  return {
    view(vnode) {
      const {
        type = 'time',
        value,
        defaultValue,
        label,
        disabled,
        className,
        onchange,
        oninput,
      } = vnode.attrs;

      // Controlled vs uncontrolled mode
      const isControlled = value !== undefined;
      if (!isControlled && internalValue === undefined) {
        internalValue = defaultValue ?? getDefaultValue(type);
      }
      const currentValue = isControlled ? value : internalValue!;

      function updateValue(newValue: string): void {
        if (!isControlled) {
          internalValue = newValue;
        }
      }

      const wrapperClasses = cx('bl-time-input', className, {
        'bl-time-input-disabled': disabled,
      });

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
        const sensitivity = e.shiftKey ? 0.25 : 1; // Shift for finer control
        const pixelsPerUnit = 5; // pixels per minute/day
        const units = Math.round(delta / pixelsPerUnit * sensitivity);

        let newValue: string;
        if (type === 'time') {
          newValue = adjustTime(startValue, units);
        } else if (type === 'date') {
          newValue = adjustDate(startValue, units);
        } else {
          newValue = adjustDateTime(startValue, units);
        }

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

        if (onchange && currentValue !== startValue) {
          onchange(currentValue, e);
        }
        m.redraw();
      }

      return m('div', { class: wrapperClasses }, [
        label &&
          m(
            '.bl-time-input-label',
            {
              onpointerdown: handlePointerDown,
              onpointermove: handlePointerMove,
              onpointerup: handlePointerUp,
              onpointercancel: handlePointerUp,
            },
            label
          ),
        m('input', {
          type,
          value: currentValue,
          disabled,
          onchange: (e: Event) => {
            const target = e.target as HTMLInputElement;
            updateValue(target.value);
            if (onchange) onchange(target.value, e);
          },
        }),
      ]);
    },
  };
}
