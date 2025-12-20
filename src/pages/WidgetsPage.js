var m = require('mithril');
var State = require('../state').State;

var WidgetsPage = {
  view: function() {
    return m('.page-widgets', [
      // Header Bar
      m('header.bl-header', [
        m('.bl-header-menu', [
          m('.bl-header-menu-item', 'File'),
          m('.bl-header-menu-item', 'Edit'),
          m('.bl-header-menu-item', 'View'),
          m('.bl-header-menu-item', 'Object'),
          m('.bl-header-menu-item', 'Help')
        ])
      ]),

      m('.demo-main', [
        // Sidebar with Panels
        m('aside.demo-sidebar', [
          // Transform Panel
          m('.bl-panel', [
            m('.bl-panel-header', { onclick: function(e) { e.target.closest('.bl-panel').classList.toggle('collapsed'); } }, [
              m('.bl-panel-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
              m('span.bl-panel-title', 'Transform')
            ]),
            m('.bl-panel-content', [
              m('.bl-form-row', [
                m('label.bl-form-label', 'Location'),
                m('.bl-flex.bl-gap-xs', [
                  m('.bl-number-input', [
                    m('span.bl-number-label', 'X'),
                    m('input[type=text]', { value: '0.000' })
                  ])
                ])
              ]),
              m('.bl-form-row', [
                m('label.bl-form-label'),
                m('.bl-flex.bl-gap-xs', [
                  m('.bl-number-input', [
                    m('span.bl-number-label', 'Y'),
                    m('input[type=text]', { value: '0.000' })
                  ])
                ])
              ]),
              m('.bl-form-row', [
                m('label.bl-form-label'),
                m('.bl-flex.bl-gap-xs', [
                  m('.bl-number-input', [
                    m('span.bl-number-label', 'Z'),
                    m('input[type=text]', { value: '0.000' })
                  ])
                ])
              ])
            ])
          ]),

          // Material Panel
          m('.bl-panel', [
            m('.bl-panel-header', { onclick: function(e) { e.target.closest('.bl-panel').classList.toggle('collapsed'); } }, [
              m('.bl-panel-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
              m('span.bl-panel-title', 'Material')
            ]),
            m('.bl-panel-content', [
              m('.bl-form-row', [
                m('label.bl-form-label', 'Base Color'),
                m('.bl-color-swatch', [
                  m('.bl-color-preview', { style: { backgroundColor: '#e87d0d' } }),
                  m('span.bl-color-value', '#E87D0D')
                ])
              ]),
              m('.bl-form-row', [
                m('label.bl-form-label', 'Metallic'),
                m('.bl-slider', [
                  m('input[type=range]', { min: 0, max: 100, value: 0 }),
                  m('span.bl-slider-value', '0.00')
                ])
              ]),
              m('.bl-form-row', [
                m('label.bl-form-label', 'Roughness'),
                m('.bl-slider', [
                  m('input[type=range]', { min: 0, max: 100, value: 50 }),
                  m('span.bl-slider-value', '0.50')
                ])
              ])
            ])
          ]),

          // Tree View Panel
          m('.bl-panel', [
            m('.bl-panel-header', { onclick: function(e) { e.target.closest('.bl-panel').classList.toggle('collapsed'); } }, [
              m('.bl-panel-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
              m('span.bl-panel-title', 'Scene Collection')
            ]),
            m('.bl-panel-content', [
              m('.bl-tree', [
                m('.bl-tree-item', { onclick: function(e) { e.target.closest('.bl-tree-item').classList.toggle('collapsed'); } }, [
                  m('.bl-tree-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                  m('.bl-tree-icon', m('.icon-placeholder')),
                  m('span', 'Collection')
                ]),
                m('.bl-tree-children', [
                  m('.bl-tree-item.active', [
                    m('.bl-tree-toggle'),
                    m('.bl-tree-icon', m('.icon-placeholder')),
                    m('span', 'Cube')
                  ]),
                  m('.bl-tree-item', [
                    m('.bl-tree-toggle'),
                    m('.bl-tree-icon', m('.icon-placeholder')),
                    m('span', 'Camera')
                  ]),
                  m('.bl-tree-item', [
                    m('.bl-tree-toggle'),
                    m('.bl-tree-icon', m('.icon-placeholder')),
                    m('span', 'Light')
                  ])
                ])
              ])
            ])
          ])
        ]),

        // Main Content Area
        m('.demo-content', [
          // Buttons Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Buttons'),
            m('.demo-label', 'Standard Buttons'),
            m('.demo-row', [
              m('button.bl-btn', 'Default'),
              m('button.bl-btn.bl-btn-primary', 'Primary'),
              m('button.bl-btn', { disabled: true }, 'Disabled')
            ]),
            m('.demo-label', 'Icon Buttons'),
            m('.demo-row', [
              m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Move' }, m('.icon-placeholder')),
              m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Rotate' }, m('.icon-placeholder')),
              m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Scale' }, m('.icon-placeholder'))
            ]),
            m('.demo-label', 'Button Group'),
            m('.demo-row', [
              m('.bl-btn-group', [
                m('button.bl-btn.bl-btn-toggle.active', 'Object'),
                m('button.bl-btn.bl-btn-toggle', 'Edit'),
                m('button.bl-btn.bl-btn-toggle', 'Sculpt')
              ])
            ]),
            m('.demo-label', 'Segmented Buttons'),
            m('.demo-row', [
              m('.bl-segmented', [
                m('button.bl-segmented-btn.active', 'Vertex'),
                m('button.bl-segmented-btn', 'Edge'),
                m('button.bl-segmented-btn', 'Face')
              ]),
              m('.bl-segmented', [
                m('button.bl-segmented-btn.icon-only.active', { title: 'Grid' }, m.trust('<svg viewBox="0 0 16 16"><path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z"/></svg>')),
                m('button.bl-segmented-btn.icon-only', { title: 'List' }, m.trust('<svg viewBox="0 0 16 16"><path d="M1 2h14v2H1V2zm0 5h14v2H1V7zm0 5h14v2H1v-2z"/></svg>')),
                m('button.bl-segmented-btn.icon-only', { title: 'Details' }, m.trust('<svg viewBox="0 0 16 16"><path d="M1 1h4v4H1V1zm6 1h8v2H7V2zM1 6h4v4H1V6zm6 1h8v2H7V7zM1 11h4v4H1v-4zm6 1h8v2H7v-2z"/></svg>'))
              ])
            ]),
            m('.demo-row', [
              m('.bl-segmented', [
                m('button.bl-segmented-btn.icon-only', { title: 'Align Left' }, m.trust('<svg viewBox="0 0 16 16"><path d="M1 2h10v2H1V2zm0 4h14v2H1V6zm0 4h8v2H1v-2zm0 4h12v2H1v-2z"/></svg>')),
                m('button.bl-segmented-btn.icon-only.active', { title: 'Align Center' }, m.trust('<svg viewBox="0 0 16 16"><path d="M3 2h10v2H3V2zm1 4h8v2H4V6zm2 4h4v2H6v-2zm1 4h2v2H7v-2z"/></svg>')),
                m('button.bl-segmented-btn.icon-only', { title: 'Align Right' }, m.trust('<svg viewBox="0 0 16 16"><path d="M5 2h10v2H5V2zm1 4h9v2H6V6zm2 4h7v2H8v-2zm1 4h6v2H9v-2z"/></svg>'))
              ]),
              m('.bl-segmented', [
                m('button.bl-segmented-btn', [
                  m.trust('<svg viewBox="0 0 16 16"><path d="M8 1l7 14H1L8 1z"/></svg>'),
                  ' Solid'
                ]),
                m('button.bl-segmented-btn.active', [
                  m.trust('<svg viewBox="0 0 16 16"><path d="M8 1l7 14H1L8 1z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'),
                  ' Wire'
                ])
              ])
            ])
          ]),

          // Text Inputs Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Text Inputs'),
            m('.demo-label', 'Standard Input'),
            m('.demo-row', [
              m('input.bl-input[type=text]', { placeholder: 'Enter text...' }),
              m('input.bl-input[type=text]', { value: 'With value' }),
              m('input.bl-input[type=text]', { disabled: true, value: 'Disabled' })
            ]),
            m('.demo-label', 'Number Inputs'),
            m('.demo-row', [
              m('.bl-number-input', [m('span.bl-number-label', 'X'), m('input[type=text]', { value: '0.000' })]),
              m('.bl-number-input', [m('span.bl-number-label', 'Y'), m('input[type=text]', { value: '0.000' })]),
              m('.bl-number-input', [m('span.bl-number-label', 'Z'), m('input[type=text]', { value: '0.000' })])
            ])
          ]),

          // Selects Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Select Inputs'),
            m('.demo-row', [
              m('.bl-select', m('select', [
                m('option', 'Object Mode'),
                m('option', 'Edit Mode'),
                m('option', 'Sculpt Mode')
              ])),
              m('.bl-select', m('select', [
                m('option', 'Solid'),
                m('option', 'Wireframe'),
                m('option', 'Material Preview')
              ]))
            ])
          ]),

          // Checkboxes & Radio Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Checkboxes & Radio Buttons'),
            m('.demo-label', 'Checkboxes'),
            m('.demo-row', [
              m('label.bl-checkbox', [m('input[type=checkbox]', { checked: true }), ' Show Overlays']),
              m('label.bl-checkbox', [m('input[type=checkbox]', { checked: true }), ' Show Floor']),
              m('label.bl-checkbox', [m('input[type=checkbox]'), ' Show Axes'])
            ]),
            m('.demo-label', 'Disabled Checkboxes'),
            m('.demo-row', [
              m('label.bl-checkbox', [m('input[type=checkbox]', { checked: true, disabled: true }), ' Checked Disabled']),
              m('label.bl-checkbox', [m('input[type=checkbox]', { disabled: true }), ' Unchecked Disabled'])
            ]),
            m('.demo-label', 'Radio Buttons'),
            m('.demo-row', [
              m('label.bl-radio', [m('input[type=radio]', { name: 'pivot', checked: true }), ' Median Point']),
              m('label.bl-radio', [m('input[type=radio]', { name: 'pivot' }), ' 3D Cursor']),
              m('label.bl-radio', [m('input[type=radio]', { name: 'pivot' }), ' Active Element'])
            ]),
            m('.demo-label', 'Disabled Radio Buttons'),
            m('.demo-row', [
              m('label.bl-radio', [m('input[type=radio]', { name: 'disabled-radio', checked: true, disabled: true }), ' Selected Disabled']),
              m('label.bl-radio', [m('input[type=radio]', { name: 'disabled-radio', disabled: true }), ' Unselected Disabled'])
            ])
          ]),

          // Sliders Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Sliders & Progress'),
            m('.demo-label', 'Sliders'),
            m('.demo-grid', [
              m('.bl-slider', [
                m('input[type=range]', { min: 0, max: 100, value: 75, oninput: function(e) { e.target.nextElementSibling.textContent = (e.target.value / 100).toFixed(2); } }),
                m('span.bl-slider-value', '0.75')
              ]),
              m('.bl-slider', [
                m('input[type=range]', { min: 0, max: 100, value: 25, oninput: function(e) { e.target.nextElementSibling.textContent = (e.target.value / 100).toFixed(2); } }),
                m('span.bl-slider-value', '0.25')
              ])
            ]),
            m('.demo-label.bl-mt-md', 'Progress Bars'),
            m('div', { style: { maxWidth: '400px' } }, [
              m('.bl-progress.bl-mb-md', m('.bl-progress-bar', { style: { width: '75%' } })),
              m('.bl-progress', m('.bl-progress-bar', { style: { width: '45%' } }))
            ])
          ]),

          // Tabs Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Tabs'),
            m('.bl-tabs', [
              m('button.bl-tab', { class: State.activeTab === 'Scene' ? 'active' : '', onclick: function() { State.activeTab = 'Scene'; } }, 'Scene'),
              m('button.bl-tab', { class: State.activeTab === 'World' ? 'active' : '', onclick: function() { State.activeTab = 'World'; } }, 'World'),
              m('button.bl-tab', { class: State.activeTab === 'Object' ? 'active' : '', onclick: function() { State.activeTab = 'Object'; } }, 'Object'),
              m('button.bl-tab', { class: State.activeTab === 'Modifiers' ? 'active' : '', onclick: function() { State.activeTab = 'Modifiers'; } }, 'Modifiers')
            ]),
            m('.bl-tab-content', m('p', { style: { color: 'var(--bl-text-secondary)', margin: 0 } }, 'Tab content area'))
          ]),

          // Table Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Table'),
            m('table.bl-table', [
              m('thead', m('tr', [
                m('th', 'Name'),
                m('th', 'Type'),
                m('th', 'Vertices'),
                m('th', 'Status')
              ])),
              m('tbody', [
                m('tr.selected', [
                  m('td', 'Cube'),
                  m('td', 'Mesh'),
                  m('td', '8'),
                  m('td', m('span.bl-badge.bl-badge-success', 'Active'))
                ]),
                m('tr', [
                  m('td', 'Suzanne'),
                  m('td', 'Mesh'),
                  m('td', '507'),
                  m('td', m('span.bl-badge', 'Hidden'))
                ]),
                m('tr', [
                  m('td', 'Sphere'),
                  m('td', 'Mesh'),
                  m('td', '482'),
                  m('td', m('span.bl-badge.bl-badge-warning', 'Modified'))
                ])
              ])
            ])
          ]),

          // Badges Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Badges'),
            m('.demo-row', [
              m('span.bl-badge', 'Default'),
              m('span.bl-badge.bl-badge-success', 'Success'),
              m('span.bl-badge.bl-badge-warning', 'Warning'),
              m('span.bl-badge.bl-badge-error', 'Error')
            ])
          ]),

          // Menu Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Dropdown Menu'),
            m('.demo-row', [
              m('.bl-menu', { style: { display: 'inline-block' } }, [
                m('.bl-menu-item', [m('span', 'New'), m('span.bl-menu-item-shortcut', 'Ctrl+N')]),
                m('.bl-menu-item', [m('span', 'Open...'), m('span.bl-menu-item-shortcut', 'Ctrl+O')]),
                m('.bl-menu-item', [m('span', 'Save'), m('span.bl-menu-item-shortcut', 'Ctrl+S')]),
                m('.bl-menu-separator'),
                m('.bl-menu-item.disabled', m('span', 'Recover Last Session'))
              ])
            ])
          ])
        ])
      ]),

      // Status Bar
      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', 'Verts: 8'),
        m('span.bl-statusbar-item', 'Faces: 6'),
        m('span.bl-statusbar-item', 'Objects: 3/3'),
        m('span.bl-statusbar-item', { style: { marginLeft: 'auto', borderRight: 'none' } }, 'Blender UI Toolkit v1.0')
      ])
    ]);
  }
};

module.exports = WidgetsPage;
