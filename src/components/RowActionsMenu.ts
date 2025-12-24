import m from 'mithril';
import cx from 'classnames';
import './RowActionsMenu.css';
import { parseIcon, IconProp } from '../utils/icon';

export interface RowAction {
  /** Action label */
  label: string;
  /** Material Icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  /** Click handler */
  onclick?: (e: Event) => void;
  /** Show as danger/destructive action */
  danger?: boolean;
  /** Disable this action */
  disabled?: boolean;
}

export interface RowActionSeparator {
  separator: true;
}

export type RowActionItem = RowAction | RowActionSeparator;

export interface RowActionsMenuAttrs {
  /** Menu actions */
  actions: RowActionItem[];
  /** Custom trigger icon (default: more_vert) */
  icon?: string;
  /** Menu opens to the left instead of right */
  menuLeft?: boolean;
  /** Menu opens upward instead of downward */
  menuUp?: boolean;
}

interface RowActionsMenuState {
  isOpen: boolean;
  closeHandler: ((e: MouseEvent) => void) | null;
}

const RowActionsMenu: m.Component<RowActionsMenuAttrs, RowActionsMenuState> = {
  oninit(vnode) {
    vnode.state.isOpen = false;
    vnode.state.closeHandler = null;
  },

  onremove(vnode) {
    if (vnode.state.closeHandler) {
      document.removeEventListener('click', vnode.state.closeHandler);
    }
  },

  view(vnode) {
    const { actions, icon = 'more_vert', menuLeft, menuUp } = vnode.attrs;
    const { isOpen } = vnode.state;

    const toggle = (e: Event) => {
      e.stopPropagation();

      if (!isOpen) {
        // Opening - add close handler
        vnode.state.isOpen = true;
        vnode.state.closeHandler = () => {
          vnode.state.isOpen = false;
          if (vnode.state.closeHandler) {
            document.removeEventListener('click', vnode.state.closeHandler);
            vnode.state.closeHandler = null;
          }
          m.redraw();
        };
        // Delay to prevent immediate close
        setTimeout(() => {
          if (vnode.state.closeHandler) {
            document.addEventListener('click', vnode.state.closeHandler);
          }
        }, 0);
      } else {
        // Closing
        vnode.state.isOpen = false;
        if (vnode.state.closeHandler) {
          document.removeEventListener('click', vnode.state.closeHandler);
          vnode.state.closeHandler = null;
        }
      }
    };

    const handleAction = (action: RowAction, e: Event) => {
      e.stopPropagation();
      if (action.disabled) return;

      // Close menu
      vnode.state.isOpen = false;
      if (vnode.state.closeHandler) {
        document.removeEventListener('click', vnode.state.closeHandler);
        vnode.state.closeHandler = null;
      }

      // Execute action
      if (action.onclick) {
        action.onclick(e);
      }
    };

    const menuClasses = cx('bl-row-actions-menu', {
      'menu-left': menuLeft,
      'menu-up': menuUp,
    });

    return m('div', { class: cx('bl-row-actions', { open: isOpen }) }, [
      m(
        'button.bl-row-actions-trigger',
        { onclick: toggle, type: 'button' },
        (() => {
          const { name, filled } = parseIcon(icon);
          return m('span.material-symbols-outlined', { class: filled ? 'filled' : '' }, name);
        })()
      ),
      m(
        'div',
        { class: menuClasses },
        actions.map((item) => {
          if ('separator' in item) {
            return m('div.bl-row-actions-separator');
          }

          const action = item as RowAction;
          const itemClasses = cx('bl-row-actions-item', {
            danger: action.danger,
            disabled: action.disabled,
          });

          return m(
            'div',
            {
              class: itemClasses,
              onclick: (e: Event) => handleAction(action, e),
            },
            [
              action.icon &&
                (() => {
                  const { name, filled } = parseIcon(action.icon);
                  return m('span.material-symbols-outlined', { class: filled ? 'filled' : '' }, name);
                })(),
              m('span', action.label),
            ]
          );
        })
      ),
    ]);
  },
};

export default RowActionsMenu;
