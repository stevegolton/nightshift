import m from 'mithril';

export interface IconDef {
  name: string;
  filled?: boolean;
}

export type IconProp = string | IconDef;

/**
 * Parse an icon prop (string or object) into a normalized format.
 *
 * @example
 * parseIcon('home')                        // { name: 'home', filled: false }
 * parseIcon('home:filled')                 // { name: 'home', filled: true }
 * parseIcon({ name: 'home', filled: true }) // { name: 'home', filled: true }
 */
export function parseIcon(icon: IconProp): { name: string; filled: boolean } {
  if (typeof icon === 'string') {
    const [name, style] = icon.split(':');
    return {
      name,
      filled: style === 'filled',
    };
  }
  return {
    name: icon.name,
    filled: icon.filled ?? false,
  };
}

/**
 * Render a Material Symbols icon from an icon prop.
 * Supports string with ":filled" suffix or object format.
 *
 * @example
 * renderIcon('home')                         // outlined home icon
 * renderIcon('home:filled')                  // filled home icon
 * renderIcon({ name: 'home', filled: true }) // filled home icon
 */
export function renderIcon(icon: IconProp): m.Vnode {
  const { name, filled } = parseIcon(icon);
  return m('span.material-symbols-outlined', { class: filled ? 'filled' : '' }, name);
}
