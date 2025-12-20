import m from 'mithril';

export interface SplitPanelAttrs {
  direction?: 'horizontal' | 'vertical';
  initialSplit?: number; // percentage 0-100
  minSize?: number; // minimum size in pixels for each panel
  class?: string;
  firstPanel: m.Children;
  secondPanel: m.Children;
  onResize?: (splitPercent: number) => void;
}

// Factory function to create SplitPanel instances with their own state
export function SplitPanel(): m.Component<SplitPanelAttrs> {
  let splitPercent = 50;
  let isResizing = false;
  let cleanup: (() => void) | null = null;

  return {
    oninit(vnode) {
      splitPercent = vnode.attrs.initialSplit ?? 50;
    },

    oncreate(vnode) {
      const container = vnode.dom as HTMLElement;
      const handle = container.querySelector('.bl-split-handle') as HTMLElement;
      const direction = vnode.attrs.direction ?? 'horizontal';
      const minSize = vnode.attrs.minSize ?? 50;

      if (!handle) return;

      const onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        isResizing = true;
        document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
        handle.classList.add('active');
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;

        const rect = container.getBoundingClientRect();
        let newPercent: number;

        if (direction === 'horizontal') {
          const x = e.clientX - rect.left;
          newPercent = (x / rect.width) * 100;
        } else {
          const y = e.clientY - rect.top;
          newPercent = (y / rect.height) * 100;
        }

        // Apply min size constraints
        const containerSize = direction === 'horizontal' ? rect.width : rect.height;
        const minPercent = (minSize / containerSize) * 100;
        const maxPercent = 100 - minPercent;

        newPercent = Math.max(minPercent, Math.min(maxPercent, newPercent));
        splitPercent = newPercent;

        if (vnode.attrs.onResize) {
          vnode.attrs.onResize(newPercent);
        }

        m.redraw();
      };

      const onMouseUp = () => {
        if (isResizing) {
          isResizing = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          handle.classList.remove('active');
        }
      };

      handle.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);

      cleanup = () => {
        handle.removeEventListener('mousedown', onMouseDown);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    },

    onremove() {
      if (cleanup) {
        cleanup();
      }
    },

    view(vnode) {
      const { direction = 'horizontal', firstPanel, secondPanel } = vnode.attrs;

      const containerClasses = ['bl-split-panel', `bl-split-${direction}`];
      if (vnode.attrs.class) containerClasses.push(vnode.attrs.class);

      // Use flex-basis with calc to account for handle width (4px)
      const handleSize = 4;
      const firstStyle =
        direction === 'horizontal'
          ? { flex: `0 0 calc(${splitPercent}% - ${handleSize / 2}px)` }
          : { flex: `0 0 calc(${splitPercent}% - ${handleSize / 2}px)` };

      const secondStyle =
        direction === 'horizontal'
          ? { flex: `0 0 calc(${100 - splitPercent}% - ${handleSize / 2}px)` }
          : { flex: `0 0 calc(${100 - splitPercent}% - ${handleSize / 2}px)` };

      return m('div', { class: containerClasses.join(' ') }, [
        m('.bl-split-first', { style: firstStyle }, firstPanel),
        m('.bl-split-handle'),
        m('.bl-split-second', { style: secondStyle }, secondPanel),
      ]);
    },
  };
}

export default SplitPanel;
