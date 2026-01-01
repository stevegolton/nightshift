import m from 'mithril';
import cx from 'classnames';
import Popover, { PopoverPlacement } from './Popover';
import { parseIcon, IconProp } from '../utils/icon';
import './PopupMenu.css';

export interface MenuItem {
  /** Menu item label */
  label: string;
  /** Material Icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Click handler */
  onclick?: (e: Event) => void;
  /** Show as danger/destructive action */
  danger?: boolean;
  /** Disable this item */
  disabled?: boolean;
  /** Keyboard shortcut hint (display only) */
  shortcut?: string;
}

export interface MenuSeparator {
  separator: true;
}

export interface MenuHeader {
  header: string;
}

export type MenuItemType = MenuItem | MenuSeparator | MenuHeader;

export interface PopupMenuAttrs {
  /** The trigger element that opens the menu */
  trigger: m.Children;
  /** Menu items */
  items: MenuItemType[];
  /** Placement relative to trigger */
  placement?: PopoverPlacement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether the menu is open (controlled mode) */
  open?: boolean;
  /** Called when menu opens/closes (for controlled mode) */
  onchange?: (open: boolean) => void;
  /** Additional class name for the menu */
  className?: string;
}

export default function PopupMenu(): m.Component<PopupMenuAttrs> {
  let isOpen = false;

  function handleTriggerClick(attrs: PopupMenuAttrs) {
    return (e: Event) => {
      e.stopPropagation();
      const newState = !isOpen;
      if (attrs.onchange) {
        attrs.onchange(newState);
      } else {
        isOpen = newState;
      }
    };
  }

  function handleClose(attrs: PopupMenuAttrs) {
    return () => {
      if (attrs.onchange) {
        attrs.onchange(false);
      } else {
        isOpen = false;
      }
    };
  }

  function handleItemClick(item: MenuItem, attrs: PopupMenuAttrs) {
    return (e: Event) => {
      e.stopPropagation();
      if (item.disabled) return;

      // Close menu
      handleClose(attrs)();

      // Execute action
      if (item.onclick) {
        item.onclick(e);
      }
    };
  }

  function renderItem(item: MenuItemType, attrs: PopupMenuAttrs): m.Children {
    if ('separator' in item) {
      return m('.bl-popup-menu-separator');
    }

    if ('header' in item) {
      return m('.bl-popup-menu-header', item.header);
    }

    const menuItem = item as MenuItem;
    const classes = cx('bl-popup-menu-item', {
      danger: menuItem.danger,
      disabled: menuItem.disabled,
    });

    return m(
      '.bl-popup-menu-item',
      {
        class: classes,
        onclick: handleItemClick(menuItem, attrs),
      },
      [
        menuItem.icon &&
          (() => {
            const { name, filled } = parseIcon(menuItem.icon);
            return m(
              'span.bl-popup-menu-icon.material-symbols-outlined',
              { class: filled ? 'filled' : '' },
              name
            );
          })(),
        m('span.bl-popup-menu-label', menuItem.label),
        menuItem.shortcut && m('span.bl-popup-menu-shortcut', menuItem.shortcut),
      ]
    );
  }

  return {
    view(vnode) {
      const {
        trigger,
        items,
        placement = 'bottom-start',
        offset = 4,
        open,
        className,
      } = vnode.attrs;

      // Controlled vs uncontrolled
      const menuOpen = open !== undefined ? open : isOpen;

      // Wrap trigger with click handler
      const wrappedTrigger = m(
        'span',
        { onclick: handleTriggerClick(vnode.attrs) },
        trigger
      );

      return m(
        Popover,
        {
          trigger: wrappedTrigger,
          placement,
          offset,
          open: menuOpen,
          onclose: handleClose(vnode.attrs),
          className: cx('bl-popup-menu', className),
        },
        items.map((item) => renderItem(item, vnode.attrs))
      );
    },
  };
}
