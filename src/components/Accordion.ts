import m from 'mithril';
import cx from 'classnames';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  header: m.Children;
  content: m.Children;
}

export interface AccordionAttrs {
  items: AccordionItem[];
  /** Currently expanded item id (controlled) */
  expanded?: string | null;
  /** Callback when item is toggled */
  onToggle?: (id: string | null) => void;
  /** Allow multiple items to be expanded */
  multiple?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const Accordion: m.Component<AccordionAttrs> = {
  view(vnode) {
    const { items, expanded, onToggle, multiple = false, className } = vnode.attrs;

    function toggle(id: string): void {
      if (!onToggle) return;
      if (expanded === id) {
        onToggle(null);
      } else {
        onToggle(id);
      }
    }

    return m('.bl-accordion', { class: className }, [
      ...items.map((item) => {
        const isExpanded = expanded === item.id;
        return m('.bl-accordion-item', {
          class: cx({ expanded: isExpanded }),
        }, [
          m('.bl-accordion-header', {
            onclick: () => toggle(item.id),
          }, [
            m('span.material-symbols-outlined.bl-accordion-icon',
              isExpanded ? 'expand_more' : 'chevron_right'
            ),
            m('.bl-accordion-header-content', item.header),
          ]),
          isExpanded && m('.bl-accordion-content', item.content),
        ]);
      }),
    ]);
  },
};

export default Accordion;
