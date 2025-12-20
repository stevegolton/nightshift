var m = require('mithril');
var State = require('../state').State;

var ProfilerPage = {
  oncreate: function(vnode) {
    // Setup resize handle
    var resizeHandle = vnode.dom.querySelector('#resizeHandle');
    var detailsPanel = vnode.dom.querySelector('#detailsPanel');
    var isResizing = false;

    if (resizeHandle && detailsPanel) {
      resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'ns-resize';
        document.body.style.userSelect = 'none';
      });

      document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        var containerRect = detailsPanel.parentElement.getBoundingClientRect();
        var newHeight = containerRect.bottom - e.clientY;
        if (newHeight >= 100 && newHeight <= window.innerHeight * 0.5) {
          detailsPanel.style.height = newHeight + 'px';
          State.detailsPanelHeight = newHeight;
        }
      });

      document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      });
    }
  },

  view: function() {
    function toggleTrackGroup(groupId) {
      State.collapsedTrackGroups[groupId] = !State.collapsedTrackGroups[groupId];
    }

    function toggleTrack(trackId) {
      State.collapsedTracks[trackId] = !State.collapsedTracks[trackId];
    }

    function expandAllTracks() {
      State.collapsedTrackGroups = {};
      State.collapsedTracks = {};
    }

    function collapseAllTracks() {
      State.collapsedTrackGroups = { 'main-thread': true, 'gpu': true, 'workers': true };
      State.collapsedTracks = { 'frame': true, 'scripts': true, 'paint': true };
    }

    return m('.page-profiler', [
      // Header Bar
      m('header.bl-header', [
        m('.bl-header-menu', [
          m('.bl-header-menu-item', 'File'),
          m('.bl-header-menu-item', 'Edit'),
          m('.bl-header-menu-item', 'View'),
          m('.bl-header-menu-item', 'Profile'),
          m('.bl-header-menu-item', 'Help')
        ]),
        m('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 'var(--bl-spacing-md)' } }, [
          m('span.bl-badge.bl-badge-success', 'Recording'),
          m('button.bl-btn.bl-btn-primary', 'Stop')
        ])
      ]),

      m('.profiler-main', [
        m('.profiler-timeline-area', [
          m('.bl-timeline', [
            // Timeline Header
            m('.bl-timeline-header', [
              m('span.bl-timeline-title', 'Frame Profile - Frame #1247'),
              m('.bl-btn-group', [
                m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Previous Frame' },
                  m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11 3L5 8l6 5V3z"/><rect x="3" y="3" width="2" height="10"/></svg>')),
                m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Next Frame' },
                  m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l6 5-6 5V3z"/><rect x="11" y="3" width="2" height="10"/></svg>'))
              ]),
              m('.bl-timeline-controls', [
                m('.bl-select', m('select', [
                  m('option', 'All Threads'),
                  m('option', 'Main Thread'),
                  m('option', 'GPU')
                ])),
                m('.bl-timeline-zoom', [
                  m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Zoom Out' },
                    m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="2"/></svg>')),
                  m('span', '100%'),
                  m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Zoom In' },
                    m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="7" width="10" height="2"/><rect x="7" y="3" width="2" height="10"/></svg>'))
                ]),
                m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Fit to Window' },
                  m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h4v2H4v2H2V2zm8 0h4v4h-2V4h-2V2zM4 10H2v4h4v-2H4v-2zm8 2v2h-2v2h4v-4h-2z"/></svg>'))
              ])
            ]),

            // Timeline Minimap
            m('.bl-timeline-minimap', [
              m('.bl-timeline-minimap-slice', { style: { left: '2%', width: '50%', top: '6px', backgroundColor: '#5a9a5a' } }),
              m('.bl-timeline-minimap-slice', { style: { left: '55%', width: '15%', top: '10px', backgroundColor: '#d4842a' } }),
              m('.bl-timeline-minimap-slice', { style: { left: '70%', width: '20%', top: '14px', backgroundColor: '#8a6ab5' } }),
              m('.bl-timeline-minimap-slice', { style: { left: '3%', width: '45%', top: '20px', backgroundColor: '#b54a4a' } }),
              m('.bl-timeline-minimap-viewport', { style: { left: '0%', width: '100%' } })
            ]),

            // Timeline Body
            m('.bl-timeline-body', [
              m('.bl-timeline-ruler-row', [
                m('.bl-timeline-tracks-header', [
                  m('.bl-track-search', [
                    m.trust('<svg viewBox="0 0 16 16"><path d="M11.5 10.5L15 14M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'),
                    m('input[type=text]', { placeholder: 'Filter tracks...' })
                  ]),
                  m('.bl-track-header-actions', [
                    m('button.bl-track-btn.bl-tooltip', { 'data-tooltip': 'Expand All', onclick: expandAllTracks },
                      m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 4h10v2H3V4zm3 4h4v2H6V8zm-3 4h10v2H3v-2z"/></svg>')),
                    m('button.bl-track-btn.bl-tooltip', { 'data-tooltip': 'Collapse All', onclick: collapseAllTracks },
                      m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M3 7h10v2H3V7z"/></svg>'))
                  ])
                ]),
                m('.bl-timeline-ruler', [
                  m('.bl-timeline-ruler-inner', [
                    m('.bl-timeline-ruler-mark.major', { style: { left: '0' } }, m('span', '0ms')),
                    m('.bl-timeline-ruler-mark.major', { style: { left: '25%' } }, m('span', '4ms')),
                    m('.bl-timeline-ruler-mark.major', { style: { left: '50%' } }, m('span', '8ms')),
                    m('.bl-timeline-ruler-mark.major', { style: { left: '75%' } }, m('span', '12ms')),
                    m('.bl-timeline-ruler-mark.major', { style: { left: '100%' } }, m('span', '16ms'))
                  ])
                ])
              ]),

              m('.bl-timeline-scroll', [
                m('.bl-timeline-tracks', [
                  // Main Thread Group
                  m('.bl-track-group', {
                    'data-group': 'main-thread',
                    class: State.collapsedTrackGroups['main-thread'] ? 'collapsed' : ''
                  }, [
                    m('.bl-track-group-header', { onclick: function() { toggleTrackGroup('main-thread'); } }, [
                      m('.bl-track-group-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                      m('span.bl-track-group-name', 'Main Thread'),
                      m('.bl-track-buttons', [
                        m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                          m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>')),
                        m('button.bl-track-btn', { title: 'More', onclick: function(e) { e.stopPropagation(); } },
                          m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>'))
                      ])
                    ]),
                    m('.bl-track-group-content', [
                      // Frame Track
                      m('.bl-track.expandable', {
                        'data-track': 'frame',
                        'data-depth': '1',
                        class: State.collapsedTracks['frame'] ? 'collapsed' : '',
                        onclick: function() { toggleTrack('frame'); }
                      }, [
                        m('.bl-track-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                        m('span.bl-track-name', 'Frame'),
                        m('.bl-track-buttons', [
                          m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                            m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>')),
                          m('button.bl-track-btn', { title: 'More', onclick: function(e) { e.stopPropagation(); } },
                            m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/></svg>'))
                        ])
                      ]),
                      !State.collapsedTracks['frame'] && m('.bl-track-children', { 'data-track': 'frame' }, [
                        // Scripts Track
                        m('.bl-track.expandable', {
                          'data-track': 'scripts',
                          'data-depth': '2',
                          class: State.collapsedTracks['scripts'] ? 'collapsed' : '',
                          onclick: function(e) { e.stopPropagation(); toggleTrack('scripts'); }
                        }, [
                          m('.bl-track-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                          m('span.bl-track-name', 'Scripts'),
                          m('.bl-track-buttons', [
                            m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                              m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                          ])
                        ]),
                        !State.collapsedTracks['scripts'] && m('.bl-track-children', { 'data-track': 'scripts' }, [
                          m('.bl-track', { 'data-depth': '3' }, [
                            m('span.bl-track-name', 'updateScene()'),
                            m('.bl-track-buttons', [
                              m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                                m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                            ])
                          ]),
                          m('.bl-track', { 'data-depth': '3' }, [
                            m('span.bl-track-name', 'processInput()'),
                            m('.bl-track-buttons', [
                              m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                                m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                            ])
                          ])
                        ]),
                        m('.bl-track', { 'data-depth': '2' }, [
                          m('span.bl-track-name', 'Layout'),
                          m('.bl-track-buttons', [
                            m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                              m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                          ])
                        ]),
                        // Paint Track
                        m('.bl-track.expandable', {
                          'data-track': 'paint',
                          'data-depth': '2',
                          class: State.collapsedTracks['paint'] ? 'collapsed' : '',
                          onclick: function(e) { e.stopPropagation(); toggleTrack('paint'); }
                        }, [
                          m('.bl-track-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                          m('span.bl-track-name', 'Paint'),
                          m('.bl-track-buttons', [
                            m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                              m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                          ])
                        ]),
                        !State.collapsedTracks['paint'] && m('.bl-track-children', { 'data-track': 'paint' }, [
                          m('.bl-track', { 'data-depth': '3' }, m('span.bl-track-name', 'paint')),
                          m('.bl-track', { 'data-depth': '3' }, m('span.bl-track-name', 'rasterize'))
                        ])
                      ])
                    ])
                  ]),

                  // GPU Group
                  m('.bl-track-group', {
                    'data-group': 'gpu',
                    class: State.collapsedTrackGroups['gpu'] ? 'collapsed' : ''
                  }, [
                    m('.bl-track-group-header', { onclick: function() { toggleTrackGroup('gpu'); } }, [
                      m('.bl-track-group-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                      m('span.bl-track-group-name', 'GPU'),
                      m('.bl-track-buttons', [
                        m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                          m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                      ])
                    ]),
                    m('.bl-track-group-content', [
                      m('.bl-track', [
                        m('span.bl-track-name', 'Render Pass'),
                        m('.bl-track-buttons', [
                          m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                            m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                        ])
                      ]),
                      m('.bl-track', [
                        m('span.bl-track-name', 'Compositing'),
                        m('.bl-track-buttons', [
                          m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                            m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                        ])
                      ])
                    ])
                  ]),

                  // Workers Group
                  m('.bl-track-group', {
                    'data-group': 'workers',
                    class: State.collapsedTrackGroups['workers'] ? 'collapsed' : ''
                  }, [
                    m('.bl-track-group-header', { onclick: function() { toggleTrackGroup('workers'); } }, [
                      m('.bl-track-group-toggle', m.trust('<svg viewBox="0 0 10 10"><path d="M2 1 L8 5 L2 9 Z"/></svg>')),
                      m('span.bl-track-group-name', 'Worker Threads'),
                      m('.bl-track-buttons', [
                        m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                          m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                      ])
                    ]),
                    m('.bl-track-group-content', [
                      m('.bl-track', [
                        m('span.bl-track-name', 'Worker 1'),
                        m('.bl-track-buttons', [
                          m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                            m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                        ])
                      ]),
                      m('.bl-track', [
                        m('span.bl-track-name', 'Worker 2'),
                        m('.bl-track-buttons', [
                          m('button.bl-track-btn', { title: 'Pin', onclick: function(e) { e.stopPropagation(); } },
                            m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>'))
                        ])
                      ])
                    ])
                  ])
                ]),

                m('.bl-timeline-lanes-column', [
                  m('.bl-timeline-lanes-inner', { style: { width: '100%', minHeight: '100%' } }, [
                    // Grid Lines
                    m('.bl-timeline-grid', [
                      m('.bl-timeline-grid-line.major', { style: { left: '0' } }),
                      m('.bl-timeline-grid-line', { style: { left: '12.5%' } }),
                      m('.bl-timeline-grid-line.major', { style: { left: '25%' } }),
                      m('.bl-timeline-grid-line', { style: { left: '37.5%' } }),
                      m('.bl-timeline-grid-line.major', { style: { left: '50%' } }),
                      m('.bl-timeline-grid-line', { style: { left: '62.5%' } }),
                      m('.bl-timeline-grid-line.major', { style: { left: '75%' } }),
                      m('.bl-timeline-grid-line', { style: { left: '87.5%' } })
                    ]),

                    m('.bl-timeline-playhead', { style: { left: '32%' } }),

                    // Main Thread Lanes
                    m('.bl-lane-group', {
                      'data-group': 'main-thread',
                      class: State.collapsedTrackGroups['main-thread'] ? 'collapsed' : ''
                    }, [
                      m('.bl-lane-group-header'),
                      m('.bl-lane-group-content', [
                        m('.bl-timeline-lane', [
                          m('.bl-slice.bl-slice-blue', { style: { left: '1%', width: '98%' } }, [
                            m('span.bl-slice-label', 'requestAnimationFrame'),
                            m('span.bl-slice-duration', '16.4ms')
                          ])
                        ]),
                        !State.collapsedTracks['frame'] && m('.bl-lane-children', { 'data-track': 'frame' }, [
                          m('.bl-timeline-lane', [
                            m('.bl-slice.bl-slice-green', { style: { left: '2%', width: '50%' } }, [
                              m('span.bl-slice-label', 'Scripts'),
                              m('span.bl-slice-duration', '8.2ms')
                            ])
                          ]),
                          !State.collapsedTracks['scripts'] && m('.bl-lane-children', { 'data-track': 'scripts' }, [
                            m('.bl-timeline-lane', [
                              m('.bl-slice.bl-slice-green', { style: { left: '3%', width: '25%' } }, m('span.bl-slice-label', 'updateScene'))
                            ]),
                            m('.bl-timeline-lane', [
                              m('.bl-slice.bl-slice-green', { style: { left: '30%', width: '20%' } }, m('span.bl-slice-label', 'processInput'))
                            ])
                          ]),
                          m('.bl-timeline-lane', [
                            m('.bl-slice.bl-slice-orange', { style: { left: '55%', width: '13%' } }, [
                              m('span.bl-slice-label', 'Layout'),
                              m('span.bl-slice-duration', '2.1ms')
                            ])
                          ]),
                          m('.bl-timeline-lane', [
                            m('.bl-slice.bl-slice-purple', { style: { left: '70%', width: '12%' } }, [
                              m('span.bl-slice-label', 'Paint'),
                              m('span.bl-slice-duration', '1.8ms')
                            ])
                          ]),
                          !State.collapsedTracks['paint'] && m('.bl-lane-children', { 'data-track': 'paint' }, [
                            m('.bl-timeline-lane', [
                              m('.bl-slice.bl-slice-purple', { style: { left: '71%', width: '5%' } }, m('span.bl-slice-label', 'drawRect'))
                            ]),
                            m('.bl-timeline-lane', [
                              m('.bl-slice.bl-slice-purple', { style: { left: '77%', width: '4%' } }, m('span.bl-slice-label', 'rasterize'))
                            ])
                          ])
                        ])
                      ])
                    ]),

                    // GPU Lanes
                    m('.bl-lane-group', {
                      'data-group': 'gpu',
                      class: State.collapsedTrackGroups['gpu'] ? 'collapsed' : ''
                    }, [
                      m('.bl-lane-group-header'),
                      m('.bl-lane-group-content', [
                        m('.bl-timeline-lane', [
                          m('.bl-slice.bl-slice-red', { style: { left: '3%', width: '45%' } }, [
                            m('span.bl-slice-label', 'Render Pass'),
                            m('span.bl-slice-duration', '7.2ms')
                          ])
                        ]),
                        m('.bl-timeline-lane', [
                          m('.bl-slice.bl-slice-teal', { style: { left: '50%', width: '35%' } }, [
                            m('span.bl-slice-label', 'Compositing'),
                            m('span.bl-slice-duration', '5.6ms')
                          ])
                        ])
                      ])
                    ]),

                    // Worker Lanes
                    m('.bl-lane-group', {
                      'data-group': 'workers',
                      class: State.collapsedTrackGroups['workers'] ? 'collapsed' : ''
                    }, [
                      m('.bl-lane-group-header'),
                      m('.bl-lane-group-content', [
                        m('.bl-timeline-lane', [
                          m('.bl-slice.bl-slice-yellow', { style: { left: '5%', width: '20%' } }, m('span.bl-slice-label', 'parseGeometry'))
                        ]),
                        m('.bl-timeline-lane', [
                          m('.bl-slice.bl-slice-yellow', { style: { left: '10%', width: '15%' } }, m('span.bl-slice-label', 'decodeTexture'))
                        ])
                      ])
                    ])
                  ])
                ])
              ])
            ])
          ])
        ]),

        m('.profiler-resize-handle', { id: 'resizeHandle' }),

        // Details Panel
        m('.profiler-details', { id: 'detailsPanel', style: { height: State.detailsPanelHeight + 'px' } }, [
          m('.profiler-details-tabs-primary', [
            m('.details-primary-tabs', [
              ['Selection', 'History', 'Flame Graph', 'Statistics'].map(function(tab) {
                return m('button.details-primary-tab', {
                  class: State.activePrimaryTab === tab ? 'active' : '',
                  onclick: function() { State.activePrimaryTab = tab; }
                }, tab);
              })
            ]),
            m('.profiler-details-actions', [
              m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Pin Selection' },
                m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M10 1L7 4 4.5 3.5 2 6l3.5 2L2 14l6-3.5L10.5 14 13 11.5 12.5 9l3-3z"/></svg>')),
              m('button.bl-btn.bl-btn-icon.bl-tooltip', { 'data-tooltip': 'Clear History' },
                m.trust('<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>'))
            ])
          ]),
          m('.profiler-details-header', [
            m('.details-secondary-tabs', [
              ['Summary', 'Call Stack', 'Bottom-Up', 'Top-Down'].map(function(tab) {
                return m('button.details-secondary-tab', {
                  class: State.activeSecondaryTab === tab ? 'active' : '',
                  onclick: function() { State.activeSecondaryTab = tab; }
                }, tab);
              })
            ])
          ]),
          m('.profiler-details-content', [
            m('.details-grid', [
              m('.details-section', [
                m('.details-section-title', 'Selected Slice'),
                m('.details-row', [
                  m('span.details-label', 'Function'),
                  m('span.details-value.highlight', 'requestAnimationFrame')
                ]),
                m('.details-row', [
                  m('span.details-label', 'Duration'),
                  m('span.details-value', '16.4ms')
                ]),
                m('.details-row', [
                  m('span.details-label', 'Self Time'),
                  m('span.details-value', '0.4ms')
                ])
              ]),
              m('.details-section', [
                m('.details-section-title', 'Frame Statistics'),
                m('.details-row', [
                  m('span.details-label', 'Total Frame Time'),
                  m('span.details-value', '16.4ms')
                ]),
                m('.details-row', [
                  m('span.details-label', 'Scripts'),
                  m('span.details-value', '8.2ms (50%)')
                ]),
                m('.details-row', [
                  m('span.details-label', 'Layout'),
                  m('span.details-value', '2.1ms (13%)')
                ]),
                m('.flame-bar', [
                  m('.flame-bar-segment', { style: { width: '50%', backgroundColor: '#5a9a5a' } }),
                  m('.flame-bar-segment', { style: { width: '13%', backgroundColor: '#d4842a' } }),
                  m('.flame-bar-segment', { style: { width: '11%', backgroundColor: '#8a6ab5' } }),
                  m('.flame-bar-segment', { style: { width: '26%', backgroundColor: '#424242' } })
                ])
              ]),
              m('.details-section', [
                m('.details-section-title', 'Warnings'),
                m('.details-row', { style: { color: 'var(--bl-warning)' } }, 'Long frame detected (>16ms budget)')
              ])
            ])
          ])
        ])
      ]),

      // Status Bar
      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', 'Frame: 1247'),
        m('span.bl-statusbar-item', 'Duration: 16.4ms'),
        m('span.bl-statusbar-item', '60 FPS target'),
        m('span.bl-statusbar-item', { style: { marginLeft: 'auto', borderRight: 'none' } }, 'Profiler v1.0')
      ])
    ]);
  }
};

module.exports = ProfilerPage;
