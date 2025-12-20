var m = require('mithril');

var PluginsPage = {
  view: function() {
    var plugins = [
      { name: 'Animation Nodes', version: 'v2.3.1', author: 'Jacques Lucke', enabled: true, status: 'Enabled', statusClass: 'bl-badge-success',
        description: 'A powerful node-based visual scripting system for creating complex animations and procedural effects.' },
      { name: 'Hard Ops', version: 'v9.87.2', author: 'Team C', enabled: true, status: 'Enabled', statusClass: 'bl-badge-success',
        description: 'Workflow enhancement addon for hard surface modeling with boolean operations and advanced mesh tools.' },
      { name: 'Node Wrangler', version: 'v1.0', author: 'Blender Foundation', enabled: false, status: 'Disabled', statusClass: '',
        description: 'Built-in addon with shortcuts and tools for efficient node editor workflow in shader and compositor nodes.' },
      { name: 'LoopTools', version: 'v4.6.7', author: 'Bart Crouch', enabled: false, status: 'Disabled', statusClass: '',
        description: 'Mesh editing tools including circle, curve, flatten, and relax operations for cleaner topology.' },
      { name: 'Rigify', version: 'v0.6.5', author: 'Blender Foundation', enabled: true, status: 'Enabled', statusClass: 'bl-badge-success',
        description: 'Automatic rigging system that generates production-ready character rigs with advanced controls.' },
      { name: 'Decal Machine', version: 'v2.4.0', author: 'MACHIN3', enabled: true, status: 'Update Available', statusClass: 'bl-badge-warning',
        description: 'Decal and trim sheet workflow addon for adding surface details without UV mapping complexity.' }
    ];

    return m('.page-plugins', [
      // Header Bar
      m('header.bl-header', [
        m('.bl-header-menu', [
          m('.bl-header-menu-item', 'File'),
          m('.bl-header-menu-item', 'Edit'),
          m('.bl-header-menu-item', 'View'),
          m('.bl-header-menu-item', 'Help')
        ]),
        m('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--bl-spacing-md)' } }, [
          m('input.bl-input[type=text]', { placeholder: 'Search plugins...', style: { width: '200px' } }),
          m('button.bl-btn.bl-btn-primary', 'Install Plugin')
        ])
      ]),

      m('.plugins-main', [
        m('.plugins-list', plugins.map(function(plugin) {
          return m('.plugin-item', { class: plugin.enabled ? '' : 'disabled' }, [
            m('.plugin-header', [
              m('label.bl-checkbox', [
                m('input[type=checkbox]', { checked: plugin.enabled })
              ]),
              m('.plugin-info', [
                m('.plugin-name', plugin.name),
                m('.plugin-version', plugin.version)
              ]),
              m('.plugin-actions', [
                m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Settings' },
                  m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0-8a6 6 0 0 1 4.47 10.02l.73.73a.5.5 0 0 1-.71.71l-.73-.73A6 6 0 1 1 8 2z"/></svg>')),
                m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'More' },
                  m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>'))
              ])
            ]),
            m('.plugin-description', plugin.description),
            m('.plugin-meta', [
              m('span.bl-badge', { class: plugin.statusClass }, plugin.status),
              m('span.plugin-author', 'by ' + plugin.author)
            ])
          ]);
        }))
      ]),

      // Status Bar
      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', 'Plugins: 6 total'),
        m('span.bl-statusbar-item', '4 enabled'),
        m('span.bl-statusbar-item', '2 disabled'),
        m('span.bl-statusbar-item', { style: { marginLeft: 'auto', borderRight: 'none' } }, 'Plugin Manager v1.0')
      ])
    ]);
  }
};

module.exports = PluginsPage;
