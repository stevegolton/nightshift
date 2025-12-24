import m from 'mithril';
import cx from 'classnames';
import './FilterChip.css';
import { parseIcon, IconProp } from '../utils/icon';

export interface FilterChipAttrs {
  /** Filter field/column name */
  label: string;
  /** Filter value (displayed after the label) */
  value?: string;
  /** Material Icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Chip is active/selected */
  active?: boolean;
  /** Chip is disabled */
  disabled?: boolean;
  /** Show remove button */
  removable?: boolean;
  /** Chip variant */
  variant?: 'default' | 'outlined' | 'success' | 'warning' | 'error';
  /** Click handler for the chip */
  onclick?: (e: Event) => void;
  /** Click handler for remove button */
  onremove?: (e: Event) => void;
}

const FilterChip: m.Component<FilterChipAttrs> = {
  view(vnode) {
    const {
      label,
      value,
      icon,
      active,
      disabled,
      removable = true,
      variant = 'default',
      onclick,
      onremove,
    } = vnode.attrs;

    const classes = cx('bl-filter-chip', {
      active,
      disabled,
      'bl-filter-chip-outlined': variant === 'outlined',
      'bl-filter-chip-success': variant === 'success',
      'bl-filter-chip-warning': variant === 'warning',
      'bl-filter-chip-error': variant === 'error',
    });

    const handleRemove = (e: Event) => {
      e.stopPropagation();
      if (!disabled && onremove) {
        onremove(e);
      }
    };

    const content: m.Children[] = [];

    if (icon) {
      const { name, filled } = parseIcon(icon);
      content.push(m('span.bl-filter-chip-icon.material-symbols-outlined', { class: filled ? 'filled' : '' }, name));
    }

    content.push(m('span.bl-filter-chip-label', label));

    if (value) {
      content.push(m('span.bl-filter-chip-separator', ':'));
      content.push(m('span.bl-filter-chip-value', value));
    }

    if (removable && !disabled) {
      content.push(
        m(
          'span.bl-filter-chip-remove',
          { onclick: handleRemove },
          m('span.material-symbols-outlined', 'close')
        )
      );
    }

    return m(
      'span',
      {
        class: classes,
        onclick: disabled ? undefined : onclick,
      },
      content
    );
  },
};

export interface FilterChipGroupAttrs {
  /** Additional class names */
  className?: string;
}

export const FilterChipGroup: m.Component<FilterChipGroupAttrs> = {
  view(vnode) {
    const { className } = vnode.attrs;
    return m('div', { class: cx('bl-filter-chip-group', className) }, vnode.children);
  },
};

export interface AddFilterChipAttrs {
  /** Button text */
  label?: string;
  /** Click handler */
  onclick?: (e: Event) => void;
}

export const AddFilterChip: m.Component<AddFilterChipAttrs> = {
  view(vnode) {
    const { label = 'Add filter', onclick } = vnode.attrs;

    return m('span.bl-filter-chip.bl-filter-chip-add', { onclick }, [
      m('span.bl-filter-chip-icon.material-symbols-outlined', 'add'),
      m('span.bl-filter-chip-label', label),
    ]);
  },
};

export default FilterChip;
