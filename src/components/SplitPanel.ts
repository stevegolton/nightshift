import m from 'mithril';
import cx from 'classnames';
import './SplitPanel.css';

/** Split configuration - either percentage or fixed pixel mode */
export type SplitConfig =
  | { readonly percent: number }
  | { readonly fixed: { readonly panel: 'first' | 'second'; readonly size?: number } };

export interface SplitPanelAttrs {
  readonly direction?: 'horizontal' | 'vertical';
  /** Split configuration - defaults to { percent: 50 } */
  readonly split?: SplitConfig;
  /** Minimum size in pixels for each panel */
  readonly minSize?: number;
  readonly className?: string;
  readonly firstPanel: m.Children;
  readonly secondPanel: m.Children;
  readonly onResize?: (size: number) => void;
}

// Type guard for fixed mode
function isFixedConfig(
  split: SplitConfig
): split is { fixed: { panel: 'first' | 'second'; size?: number } } {
  return 'fixed' in split;
}

// Factory function to create SplitPanel instances with their own state
export function SplitPanel(): m.Component<SplitPanelAttrs> {
  let splitPercent = 50;
  let fixedSizePx = 200;
  let isResizing = false;

  return {
    oninit(vnode) {
      const split = vnode.attrs.split ?? { percent: 50 };
      if (isFixedConfig(split)) {
        fixedSizePx = split.fixed.size ?? 200;
      } else if ('percent' in split) {
        splitPercent = split.percent;
      }
    },

    view(vnode) {
      const {
        direction = 'horizontal',
        minSize = 50,
        split = { percent: 50 },
        firstPanel,
        secondPanel,
      } = vnode.attrs;

      const fixedPanel = isFixedConfig(split) ? split.fixed.panel : null;

      const containerClasses = cx('bl-split-panel', `bl-split-${direction}`, vnode.attrs.className);
      const handleSize = 4;

      let firstStyle: Record<string, string>;
      let secondStyle: Record<string, string>;

      if (fixedPanel === 'first') {
        firstStyle = { flex: `0 0 ${fixedSizePx}px` };
        secondStyle = { flex: '1 1 0' };
      } else if (fixedPanel === 'second') {
        firstStyle = { flex: '1 1 0' };
        secondStyle = { flex: `0 0 ${fixedSizePx}px` };
      } else {
        // Percentage mode
        firstStyle = { flex: `0 0 calc(${splitPercent}% - ${handleSize / 2}px)` };
        secondStyle = { flex: `0 0 calc(${100 - splitPercent}% - ${handleSize / 2}px)` };
      }

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
        const containerSize = direction === 'horizontal' ? rect.width : rect.height;

        if (fixedPanel) {
          // Fixed pixel mode
          let pos: number;
          if (direction === 'horizontal') {
            pos = e.clientX - rect.left;
          } else {
            pos = e.clientY - rect.top;
          }

          let newSize: number;
          if (fixedPanel === 'first') {
            newSize = pos;
          } else {
            newSize = containerSize - pos;
          }

          // Clamp to min/max
          newSize = Math.max(minSize, Math.min(containerSize - minSize - handleSize, newSize));
          fixedSizePx = newSize;

          if (vnode.attrs.onResize) {
            vnode.attrs.onResize(newSize);
          }
        } else {
          // Percentage mode
          let newPercent: number;
          if (direction === 'horizontal') {
            const x = e.clientX - rect.left;
            newPercent = (x / rect.width) * 100;
          } else {
            const y = e.clientY - rect.top;
            newPercent = (y / rect.height) * 100;
          }

          const minPercent = (minSize / containerSize) * 100;
          const maxPercent = 100 - minPercent;
          newPercent = Math.max(minPercent, Math.min(maxPercent, newPercent));
          splitPercent = newPercent;

          if (vnode.attrs.onResize) {
            vnode.attrs.onResize(newPercent);
          }
        }
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
