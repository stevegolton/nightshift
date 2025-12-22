import m from 'mithril';
import cx from 'classnames';
import './SplitPanel.css';

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

  return {
    oninit(vnode) {
      splitPercent = vnode.attrs.initialSplit ?? 50;
    },

    view(vnode) {
      const { direction = 'horizontal', minSize = 50, firstPanel, secondPanel } = vnode.attrs;

      const containerClasses = cx('bl-split-panel', `bl-split-${direction}`, vnode.attrs.class);

      // Use flex-basis with calc to account for handle width (4px)
      const handleSize = 4;
      const firstStyle = { flex: `0 0 calc(${splitPercent}% - ${handleSize / 2}px)` };
      const secondStyle = { flex: `0 0 calc(${100 - splitPercent}% - ${handleSize / 2}px)` };

      const onPointerDown = (e: PointerEvent) => {
        e.preventDefault();
        const handle = e.currentTarget as HTMLElement;
        handle.setPointerCapture(e.pointerId);
        isResizing = true;
        document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
        handle.classList.add('active');
      };

      const onPointerMove = (e: PointerEvent) => {
        if (!isResizing) return;

        const handle = e.currentTarget as HTMLElement;
        const container = handle.parentElement!;
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

      const onPointerUp = (e: PointerEvent) => {
        if (isResizing) {
          const handle = e.currentTarget as HTMLElement;
          handle.releasePointerCapture(e.pointerId);
          isResizing = false;
          document.body.style.cursor = '';
          document.body.style.userSelect = '';
          handle.classList.remove('active');
        }
      };

      return m('div', { class: containerClasses }, [
        m('.bl-split-first', { style: firstStyle }, firstPanel),
        m('.bl-split-handle', {
          onpointerdown: onPointerDown,
          onpointermove: onPointerMove,
          onpointerup: onPointerUp,
          onpointercancel: onPointerUp,
        }),
        m('.bl-split-second', { style: secondStyle }, secondPanel),
      ]);
    },
  };
}

export default SplitPanel;
