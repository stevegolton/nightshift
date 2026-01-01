import m from 'mithril';
import cx from 'classnames';
import './Tag.css';

export interface TagAttrs {
  /** Tag variant */
  variant?: 'default' | 'success' | 'warning' | 'error';
  /** Solid background style (like a badge) vs translucent (like a chip) */
  solid?: boolean;
  /** Icon to display (Material Symbol name) */
  icon?: string;
  /** Show remove button */
  removable?: boolean;
  /** Called when remove button is clicked */
  onremove?: () => void;
  /** Called when tag itself is clicked */
  onclick?: () => void;
  /** Tag is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

const Tag: m.Component<TagAttrs> = {
  view(vnode) {
    const {
      variant,
      solid,
      icon,
      removable,
      onremove,
      onclick,
      disabled,
      className,
    } = vnode.attrs;

    const classes = cx('bl-tag', className, {
      [`bl-tag-${variant}`]: variant,
      'bl-tag-solid': solid,
      'bl-tag-clickable': onclick && !disabled,
      'bl-tag-disabled': disabled,
    });

    return m(
      'span',
      {
        class: classes,
        onclick: disabled ? undefined : onclick,
      },
      [
        icon && m('span.material-symbols-outlined.bl-tag-icon', icon),
        m('span.bl-tag-content', vnode.children),
        removable &&
          m(
            'button.bl-tag-remove',
            {
              type: 'button',
              onclick: (e: Event) => {
                e.stopPropagation();
                if (!disabled && onremove) onremove();
              },
              disabled,
            },
            '×'
          ),
      ]
    );
  },
};

export default Tag;
