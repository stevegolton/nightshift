import m from 'mithril';
import './ProgressBar.css';

export interface ProgressBarAttrs {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Show percentage text */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Variant style */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Additional class names */
  class?: string;
}

const ProgressBar: m.Component<ProgressBarAttrs> = {
  view(vnode) {
    const { value, max = 100, showLabel = false, label, variant, class: className } = vnode.attrs;

    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const wrapperClasses = ['bl-progress'];
    if (variant) wrapperClasses.push(`bl-progress-${variant}`);
    if (className) wrapperClasses.push(className);

    const barClasses = ['bl-progress-bar'];

    return m('div', { class: wrapperClasses.join(' ') }, [
      m('div', {
        class: barClasses.join(' '),
        style: { width: `${percentage}%` },
      }),
      showLabel && m('span.bl-progress-label', label || `${Math.round(percentage)}%`),
    ]);
  },
};

export default ProgressBar;
