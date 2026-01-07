import m from 'mithril';
import Portal from './Portal';
import './Tooltip.css';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipAttrs {
  /** Tooltip text content */
  content: string;
  /** Placement relative to trigger */
  placement?: TooltipPlacement;
}

interface Position {
  top: number;
  left: number;
}

function calculatePosition(
  anchor: HTMLElement,
  tooltip: HTMLElement,
  placement: TooltipPlacement
): Position {
  const anchorRect = anchor.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const offset = 6;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = anchorRect.top - tooltipRect.height - offset;
      left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      top = anchorRect.bottom + offset;
      left = anchorRect.left + (anchorRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
      left = anchorRect.left - tooltipRect.width - offset;
      break;
    case 'right':
      top = anchorRect.top + (anchorRect.height - tooltipRect.height) / 2;
      left = anchorRect.right + offset;
      break;
  }

  // Clamp to viewport
  const padding = 8;
  top = Math.max(padding, Math.min(top, window.innerHeight - tooltipRect.height - padding));
  left = Math.max(padding, Math.min(left, window.innerWidth - tooltipRect.width - padding));

  return { top, left };
}

interface TooltipContentAttrs {
  triggerElement: HTMLElement;
  placement: TooltipPlacement;
  content: string;
}

function TooltipContent(): m.Component<TooltipContentAttrs> {
  let tooltipElement: HTMLElement | null = null;
  let isPositioned = false;

  return {
    oncreate(vnode) {
      tooltipElement = vnode.dom as HTMLElement;
      const { triggerElement, placement } = vnode.attrs;
      const position = calculatePosition(triggerElement, tooltipElement, placement);
      tooltipElement.style.top = `${position.top}px`;
      tooltipElement.style.left = `${position.left}px`;
      isPositioned = true;
      m.redraw();
    },

    onremove() {
      tooltipElement = null;
      isPositioned = false;
    },

    view(vnode) {
      return m(
        '.bl-tooltip-popup',
        {
          style: {
            visibility: isPositioned ? 'visible' : 'hidden',
          },
        },
        vnode.attrs.content
      );
    },
  };
}

interface TooltipState {
  triggerElement: HTMLElement | null;
  isVisible: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

const Tooltip: m.Component<TooltipAttrs> = {
  oninit(vnode) {
    const state = vnode.state as TooltipState;
    state.triggerElement = null;
    state.isVisible = false;
    state.handleMouseEnter = () => {
      state.isVisible = true;
      m.redraw();
    };
    state.handleMouseLeave = () => {
      state.isVisible = false;
      m.redraw();
    };
  },

  oncreate(vnode) {
    const state = vnode.state as TooltipState;
    // With display: contents, use the first child element for events and positioning
    const child = (vnode.dom as HTMLElement).firstElementChild as HTMLElement;
    if (child) {
      state.triggerElement = child;
      child.addEventListener('mouseenter', state.handleMouseEnter);
      child.addEventListener('mouseleave', state.handleMouseLeave);
    }
  },

  onremove(vnode) {
    const state = vnode.state as TooltipState;
    // Clean up event listeners
    if (state.triggerElement) {
      state.triggerElement.removeEventListener('mouseenter', state.handleMouseEnter);
      state.triggerElement.removeEventListener('mouseleave', state.handleMouseLeave);
      state.triggerElement = null;
    }
  },

  view(vnode) {
    const { content, placement = 'bottom' } = vnode.attrs;
    const state = vnode.state as TooltipState;

    return m(
      'span.bl-tooltip-anchor',
      [
        vnode.children,
        state.isVisible &&
          state.triggerElement &&
          m(
            Portal,
            m(TooltipContent, {
              triggerElement: state.triggerElement,
              placement,
              content,
            })
          ),
      ]
    );
  },
};

export default Tooltip;
