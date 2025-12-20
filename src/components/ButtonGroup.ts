import m from 'mithril';

export interface ButtonGroupAttrs {
  /** Additional CSS classes */
  class?: string;
}

const ButtonGroup: m.Component<ButtonGroupAttrs> = {
  view(vnode) {
    const classes = ['bl-btn-group'];
    if (vnode.attrs.class) classes.push(vnode.attrs.class);

    return m('div', { class: classes.join(' ') }, vnode.children);
  },
};

export default ButtonGroup;
