import m from 'mithril';
import cx from 'classnames';
import './Tabs.css';

export interface TabItem {
  /** Unique identifier for the tab */
  id: string;
  /** Tab label text */
  label: string;
  /** Optional Material Icon name */
  icon?: string;
  /** Tab content (rendered when active) */
  content?: m.Children;
}

export interface TabsAttrs {
  /** Array of tab items */
  tabs: TabItem[];
  /** Currently active tab id */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (tabId: string) => void;
  /** Tab style variant */
  variant?: 'primary' | 'inline';
  /** Additional CSS classes for container */
  class?: string;
}

export const Tabs: m.Component<TabsAttrs> = {
  view(vnode) {
    const { tabs, activeTab, onTabChange, variant = 'inline' } = vnode.attrs;

    const containerClasses = cx('bl-tabs-container', vnode.attrs.class, {
      'bl-tabs-primary': variant === 'primary',
    });

    const tabListClasses = variant === 'primary' ? 'bl-tabs-list-primary' : 'bl-tabs-list';

    const activeTabItem = tabs.find((t) => t.id === activeTab);

    return m('.', { class: containerClasses }, [
      m(
        '.',
        { class: tabListClasses },
        tabs.map((tab) => {
          const tabClasses = cx(variant === 'primary' ? 'bl-tab-primary' : 'bl-tab', {
            active: tab.id === activeTab,
          });

          const content: m.Children[] = [];
          if (tab.icon) {
            content.push(m('span.material-icons', tab.icon));
          }
          content.push(tab.label);

          return m(
            'button',
            {
              class: tabClasses,
              onclick: () => onTabChange(tab.id),
            },
            content
          );
        })
      ),
      activeTabItem?.content && m('.bl-tabs-content', activeTabItem.content),
    ]);
  },
};

export default Tabs;
