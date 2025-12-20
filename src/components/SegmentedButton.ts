import m from 'mithril';

export interface SegmentedButtonGroupAttrs {
  /** Additional CSS classes */
  class?: string;
}

export interface SegmentedButtonAttrs {
  /** Material Icon name */
  icon?: string;
  /** Button is currently active */
  active?: boolean;
  /** Tooltip/title text */
  title?: string;
  /** Click handler */
  onclick?: (e: Event) => void;
}

/** Container for segmented buttons */
export const SegmentedButtonGroup: m.Component<SegmentedButtonGroupAttrs> = {
  view(vnode) {
    const classes = ['bl-segmented'];
    if (vnode.attrs.class) classes.push(vnode.attrs.class);

    return m('div', { class: classes.join(' ') }, vnode.children);
  },
};

/** Individual button within a segmented group */
export const SegmentedButton: m.Component<SegmentedButtonAttrs> = {
  view(vnode) {
    const { icon, active, title, onclick } = vnode.attrs;

    const classes = ['bl-segmented-btn'];
    const hasChildren =
      vnode.children && (Array.isArray(vnode.children) ? vnode.children.length > 0 : true);

    if (icon && !hasChildren) classes.push('icon-only');
    if (active) classes.push('active');

    const content: m.Children[] = [];

    if (icon) {
      content.push(m('span.material-icons', icon));
    }

    const children = vnode.children;
    if (children && Array.isArray(children) && children.length) {
      content.push(...children);
    } else if (children && !Array.isArray(children)) {
      content.push(children);
    }

    return m(
      'button',
      {
        class: classes.join(' '),
        title,
        onclick,
      },
      content
    );
  },
};
