import m from 'mithril';
import cx from 'classnames';
import './ReorderableList.css';
import { parseIcon, IconProp } from '../utils/icon';

export interface ReorderableItem {
  id: string;
  label: string;
  /** Material icon name. Use ":filled" suffix or object { name, filled } for filled icons */
  icon?: IconProp;
  children?: ReorderableItem[];
  expanded?: boolean;
}

export interface ReorderableListAttrs {
  /** List items */
  items: ReorderableItem[];
  /** Called when items are reordered */
  onreorder: (items: ReorderableItem[]) => void;
  /** Enable tree mode with nesting support */
  tree?: boolean;
  /** Additional class names */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

interface ReorderableListState {
  draggingId: string | null;
  dragOverId: string | null;
  dragPosition: 'before' | 'after' | 'onto' | null;
  ghostEl: HTMLElement | null;
  startY: number;
  offsetY: number;
  expandedIds: Set<string>;
  handleMouseMove: (e: MouseEvent) => void;
  handleMouseUp: (e: MouseEvent) => void;
}

// Helper: Find item by id in tree
function findItemById(items: ReorderableItem[], id: string): ReorderableItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper: Find parent array and index of item
function findItemLocation(
  items: ReorderableItem[],
  id: string,
  parent: ReorderableItem[] | null = null
): { parent: ReorderableItem[]; index: number } | null {
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      return { parent: items, index: i };
    }
    if (items[i].children) {
      const found = findItemLocation(items[i].children!, id, items);
      if (found) return found;
    }
  }
  return null;
}

// Helper: Deep clone items
function cloneItems(items: ReorderableItem[]): ReorderableItem[] {
  return items.map((item) => ({
    ...item,
    children: item.children ? cloneItems(item.children) : undefined,
  }));
}

// Helper: Check if target is descendant of source (prevent circular nesting)
function isDescendant(items: ReorderableItem[], sourceId: string, targetId: string): boolean {
  const source = findItemById(items, sourceId);
  if (!source?.children) return false;

  function checkChildren(children: ReorderableItem[]): boolean {
    for (const child of children) {
      if (child.id === targetId) return true;
      if (child.children && checkChildren(child.children)) return true;
    }
    return false;
  }

  return checkChildren(source.children);
}

const ReorderableList: m.Component<ReorderableListAttrs, ReorderableListState> = {
  oninit(vnode) {
    const state = vnode.state;
    state.draggingId = null;
    state.dragOverId = null;
    state.dragPosition = null;
    state.ghostEl = null;
    state.startY = 0;
    state.offsetY = 0;
    state.expandedIds = new Set<string>();

    // Initialize expanded state from items
    function initExpanded(items: ReorderableItem[]) {
      for (const item of items) {
        if (item.children && item.expanded !== false) {
          state.expandedIds.add(item.id);
        }
        if (item.children) {
          initExpanded(item.children);
        }
      }
    }
    initExpanded(vnode.attrs.items);

    state.handleMouseMove = (e: MouseEvent) => {
      if (!state.draggingId || !state.ghostEl) return;

      // Update ghost position
      state.ghostEl.style.top = `${e.clientY - state.offsetY}px`;
      state.ghostEl.style.left = `${e.clientX - 20}px`;

      // Find element under cursor (excluding ghost)
      state.ghostEl.style.display = 'none';
      const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
      state.ghostEl.style.display = '';

      // Find the reorderable item
      const itemEl = elementUnder?.closest('.bl-reorderable-item') as HTMLElement;
      if (itemEl && itemEl.dataset.id && itemEl.dataset.id !== state.draggingId) {
        const rect = itemEl.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const height = rect.height;

        state.dragOverId = itemEl.dataset.id;

        // In tree mode: top 25% = before, middle 50% = onto, bottom 25% = after
        // In list mode: top 50% = before, bottom 50% = after
        if (vnode.attrs.tree) {
          // Don't allow dropping onto if target is descendant of dragged item
          const canNest = !isDescendant(vnode.attrs.items, state.draggingId, state.dragOverId);

          if (relativeY < height * 0.25) {
            state.dragPosition = 'before';
          } else if (relativeY > height * 0.75) {
            state.dragPosition = 'after';
          } else if (canNest) {
            state.dragPosition = 'onto';
          } else {
            state.dragPosition = relativeY < height * 0.5 ? 'before' : 'after';
          }
        } else {
          state.dragPosition = relativeY < height * 0.5 ? 'before' : 'after';
        }
      } else {
        state.dragOverId = null;
        state.dragPosition = null;
      }

      m.redraw();
    };

    state.handleMouseUp = () => {
      if (state.draggingId && state.dragOverId && state.dragPosition) {
        const items = cloneItems(vnode.attrs.items);

        // Find and remove dragged item
        const sourceLocation = findItemLocation(items, state.draggingId);
        if (sourceLocation) {
          const [draggedItem] = sourceLocation.parent.splice(sourceLocation.index, 1);

          if (state.dragPosition === 'onto') {
            // Nest as child
            const targetItem = findItemById(items, state.dragOverId);
            if (targetItem) {
              if (!targetItem.children) {
                targetItem.children = [];
              }
              targetItem.children.push(draggedItem);
              // Auto-expand when nesting
              state.expandedIds.add(targetItem.id);
            }
          } else {
            // Insert before/after target
            const targetLocation = findItemLocation(items, state.dragOverId);
            if (targetLocation) {
              let insertIndex = targetLocation.index;
              if (state.dragPosition === 'after') {
                insertIndex++;
              }
              targetLocation.parent.splice(insertIndex, 0, draggedItem);
            }
          }

          vnode.attrs.onreorder(items);
        }
      }

      // Cleanup
      if (state.ghostEl) {
        state.ghostEl.remove();
        state.ghostEl = null;
      }

      state.draggingId = null;
      state.dragOverId = null;
      state.dragPosition = null;

      document.removeEventListener('mousemove', state.handleMouseMove);
      document.removeEventListener('mouseup', state.handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';

      m.redraw();
    };
  },

  view(vnode) {
    const { items, tree, className, disabled } = vnode.attrs;
    const state = vnode.state;

    const toggleExpand = (e: MouseEvent, itemId: string) => {
      e.stopPropagation();
      if (state.expandedIds.has(itemId)) {
        state.expandedIds.delete(itemId);
      } else {
        state.expandedIds.add(itemId);
      }
    };

    const startDrag = (item: ReorderableItem, e: MouseEvent) => {
      if (disabled) return;
      // Don't start drag if clicking expand button
      if ((e.target as HTMLElement).closest('.bl-reorderable-expand')) return;

      const target = e.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();

      state.draggingId = item.id;
      state.startY = e.clientY;
      state.offsetY = e.clientY - rect.top;

      // Create ghost element
      const ghost = target.cloneNode(true) as HTMLElement;
      ghost.classList.add('bl-reorderable-ghost', 'dragging');
      ghost.style.width = `${rect.width}px`;
      ghost.style.top = `${rect.top}px`;
      ghost.style.left = `${rect.left}px`;
      document.body.appendChild(ghost);
      state.ghostEl = ghost;

      document.addEventListener('mousemove', state.handleMouseMove);
      document.addEventListener('mouseup', state.handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';

      m.redraw();
    };

    const renderItem = (item: ReorderableItem, depth: number = 0): m.Vnode | m.Vnode[] => {
      const isDragging = state.draggingId === item.id;
      const isDropTarget = state.dragOverId === item.id;
      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = state.expandedIds.has(item.id);
      const indentPx = depth * 20;

      const itemClasses = cx('bl-reorderable-item', {
        dragging: isDragging,
        disabled,
        'drop-before': isDropTarget && state.dragPosition === 'before',
        'drop-after': isDropTarget && state.dragPosition === 'after',
        'drop-onto': isDropTarget && state.dragPosition === 'onto',
      });

      // Show placeholder for dragged item
      if (isDragging) {
        return m('.bl-reorderable-placeholder', {
          key: item.id,
          style: { height: '32px', marginLeft: tree ? `${indentPx}px` : undefined },
        });
      }

      const itemVnode = m(
        'div',
        {
          key: item.id,
          class: itemClasses,
          'data-id': item.id,
          style: tree ? { '--indent-offset': `${indentPx + 8}px` } : undefined,
          onmousedown: (e: MouseEvent) => startDrag(item, e),
        },
        [
          // Indentation
          tree && indentPx > 0 && m('.bl-reorderable-indent', { style: { width: `${indentPx}px` } }),

          // Expand/collapse toggle (tree mode only)
          tree &&
            (hasChildren
              ? m(
                  '.bl-reorderable-expand',
                  {
                    class: cx({ collapsed: !isExpanded }),
                    onclick: (e: MouseEvent) => toggleExpand(e, item.id),
                  },
                  m('span.material-symbols-outlined', 'expand_more')
                )
              : m('.bl-reorderable-expand-placeholder')),

          // Drag handle (non-tree mode only)
          !tree && m('span.bl-reorderable-handle'),

          // Content
          m('.bl-reorderable-content', [
            item.icon &&
              (() => {
                const { name, filled } = parseIcon(item.icon);
                return m('span.bl-reorderable-icon.material-symbols-outlined', { class: filled ? 'filled' : '' }, name);
              })(),
            m('span.bl-reorderable-label', item.label),
          ]),
        ]
      );

      // If has children and expanded, render them
      if (tree && hasChildren && isExpanded) {
        return [itemVnode, ...item.children!.flatMap((child) => renderItem(child, depth + 1))];
      }

      return itemVnode;
    };

    return m(
      'div',
      { class: cx('bl-reorderable-list', className, { 'tree-mode': tree }) },
      items.flatMap((item) => renderItem(item, 0))
    );
  },
};

export default ReorderableList;
