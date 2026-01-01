import m from 'mithril';
import Portal from './Portal';
import './Popover.css';

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface PopoverAttrs {
  /** The trigger element that opens/anchors the popover */
  trigger: m.Children;
  /** Placement relative to trigger */
  placement?: PopoverPlacement;
  /** Offset from trigger in pixels */
  offset?: number;
  /** Whether the popover is visible */
  open?: boolean;
  /** Called when popover requests to close (e.g., click outside) */
  onclose?: () => void;
  /** Additional class name for the popover content */
  className?: string;
}

interface Position {
  top: number;
  left: number;
}

function calculatePosition(
  anchor: HTMLElement,
  popover: HTMLElement,
  placement: PopoverPlacement,
  offset: number
): Position {
  const anchorRect = anchor.getBoundingClientRect();
  const popoverRect = popover.getBoundingClientRect();

  let top = 0;
  let left = 0;

  // Primary axis positioning
  switch (placement) {
    case 'top':
    case 'top-start':
    case 'top-end':
      top = anchorRect.top - popoverRect.height - offset;
      break;
    case 'bottom':
    case 'bottom-start':
    case 'bottom-end':
      top = anchorRect.bottom + offset;
      break;
    case 'left':
    case 'left-start':
    case 'left-end':
      left = anchorRect.left - popoverRect.width - offset;
      break;
    case 'right':
    case 'right-start':
    case 'right-end':
      left = anchorRect.right + offset;
      break;
  }

  // Secondary axis positioning
  switch (placement) {
    case 'top':
    case 'bottom':
      left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
      break;
    case 'top-start':
    case 'bottom-start':
      left = anchorRect.left;
      break;
    case 'top-end':
    case 'bottom-end':
      left = anchorRect.right - popoverRect.width;
      break;
    case 'left':
    case 'right':
      top = anchorRect.top + (anchorRect.height - popoverRect.height) / 2;
      break;
    case 'left-start':
    case 'right-start':
      top = anchorRect.top;
      break;
    case 'left-end':
    case 'right-end':
      top = anchorRect.bottom - popoverRect.height;
      break;
  }

  // Clamp to viewport
  const padding = 8;
  top = Math.max(padding, Math.min(top, window.innerHeight - popoverRect.height - padding));
  left = Math.max(padding, Math.min(left, window.innerWidth - popoverRect.width - padding));

  return { top, left };
}

interface PopoverContentAttrs {
  triggerElement: HTMLElement;
  placement: PopoverPlacement;
  offset: number;
  onclose?: () => void;
  className?: string;
}

// Defined outside to maintain stable component identity
function PopoverContent(): m.Component<PopoverContentAttrs> {
  let popoverElement: HTMLElement | null = null;
  let animationFrame: number | null = null;
  let isPositioned = false;
  let clickHandler: ((e: MouseEvent) => void) | null = null;

  function updatePosition(
    triggerElement: HTMLElement,
    placement: PopoverPlacement,
    offset: number
  ) {
    if (!popoverElement || !triggerElement) return;

    const position = calculatePosition(triggerElement, popoverElement, placement, offset);
    popoverElement.style.top = `${position.top}px`;
    popoverElement.style.left = `${position.left}px`;
    isPositioned = true;
    m.redraw();

    // Schedule next update
    animationFrame = requestAnimationFrame(() => {
      updatePosition(triggerElement, placement, offset);
    });
  }

  function startPositioning(
    triggerElement: HTMLElement,
    placement: PopoverPlacement,
    offset: number
  ) {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    isPositioned = false;
    updatePosition(triggerElement, placement, offset);
  }

  function stopPositioning() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
  }

  function handleClickOutside(
    e: MouseEvent,
    triggerElement: HTMLElement,
    onclose?: () => void
  ) {
    if (!popoverElement || !onclose) return;
    const target = e.target as Node;
    if (!popoverElement.contains(target) && !triggerElement.contains(target)) {
      onclose();
    }
  }

  function setupClickHandler(triggerElement: HTMLElement, onclose?: () => void) {
    cleanupClickHandler();
    clickHandler = (e: MouseEvent) => handleClickOutside(e, triggerElement, onclose);
    document.addEventListener('mousedown', clickHandler);
  }

  function cleanupClickHandler() {
    if (clickHandler) {
      document.removeEventListener('mousedown', clickHandler);
      clickHandler = null;
    }
  }

  return {
    oncreate(vnode) {
      popoverElement = vnode.dom as HTMLElement;
      const { triggerElement, placement, offset, onclose } = vnode.attrs;
      startPositioning(triggerElement, placement, offset);
      setupClickHandler(triggerElement, onclose);
    },

    onupdate(vnode) {
      const { triggerElement, onclose } = vnode.attrs;
      setupClickHandler(triggerElement, onclose);
    },

    onremove() {
      stopPositioning();
      cleanupClickHandler();
      popoverElement = null;
      isPositioned = false;
    },

    view(vnode) {
      return m(
        '.bl-popover',
        {
          class: vnode.attrs.className,
          style: {
            visibility: isPositioned ? 'visible' : 'hidden',
          },
        },
        vnode.children
      );
    },
  };
}

export default function Popover(): m.Component<PopoverAttrs> {
  let triggerElement: HTMLElement | null = null;

  return {
    oncreate(vnode) {
      triggerElement = (vnode.dom as HTMLElement).firstElementChild as HTMLElement;
    },

    onupdate(vnode) {
      triggerElement = (vnode.dom as HTMLElement).firstElementChild as HTMLElement;
    },

    view(vnode) {
      const {
        trigger,
        placement = 'bottom',
        offset = 8,
        open = false,
        onclose,
        className,
      } = vnode.attrs;

      return m('span.bl-popover-anchor', [
        m('span.bl-popover-trigger', trigger),
        open &&
          triggerElement &&
          m(
            Portal,
            m(
              PopoverContent,
              {
                triggerElement,
                placement,
                offset,
                onclose,
                className,
              },
              vnode.children
            )
          ),
      ]);
    },
  };
}
