import m from 'mithril';

export interface PortalAttrs {
  /** Target container element to render into. Defaults to document.body */
  container?: HTMLElement;
}

/**
 * Portal component for rendering children outside the normal DOM hierarchy.
 * Useful for popovers, modals, tooltips, and other overlay elements.
 */
export default function Portal(): m.Component<PortalAttrs> {
  let portalElement: HTMLElement | null = null;

  function getContainer(attrs: PortalAttrs): HTMLElement {
    return attrs.container ?? document.body;
  }

  return {
    oncreate(vnode) {
      portalElement = document.createElement('div');
      portalElement.className = 'bl-portal';
      getContainer(vnode.attrs).appendChild(portalElement);
      m.render(portalElement, vnode.children as m.Children);
    },

    onupdate(vnode) {
      if (portalElement) {
        // Move portal if container changed
        const container = getContainer(vnode.attrs);
        if (portalElement.parentElement !== container) {
          container.appendChild(portalElement);
        }
        m.render(portalElement, vnode.children as m.Children);
      }
    },

    onremove() {
      if (portalElement) {
        m.render(portalElement, null);
        portalElement.remove();
        portalElement = null;
      }
    },

    view() {
      // Portal renders nothing in place - children are rendered via lifecycle hooks
      return null;
    },
  };
}
