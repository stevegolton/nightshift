import m from 'mithril';
import './ProfilerPage.css';
import { State } from '../state';
import { Tabs } from '../components/Tabs';
import Button from '../components/Button';
import { SplitPanel } from '../components/SplitPanel';
import Table from '../components/Table';
import MenuBar from '../components/MenuBar';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Select from '../components/Select';

// Create SplitPanel instance at module level
const ProfilerSplit = SplitPanel();

// Create Table instance for Bottom-Up view
interface BottomUpEntry {
  id: string;
  function: string;
  selfTime: number;
  totalTime: number;
  percentage: number;
}

const BottomUpTable = Table<BottomUpEntry>();

const bottomUpData: BottomUpEntry[] = [
  { id: '1', function: 'updateScene', selfTime: 4.2, totalTime: 4.2, percentage: 25.6 },
  { id: '2', function: 'processInput', selfTime: 3.8, totalTime: 3.8, percentage: 23.2 },
  { id: '3', function: 'Layout', selfTime: 2.1, totalTime: 2.1, percentage: 12.8 },
  { id: '4', function: 'Paint', selfTime: 1.8, totalTime: 1.8, percentage: 11.0 },
  { id: '5', function: 'rasterize', selfTime: 0.9, totalTime: 0.9, percentage: 5.5 },
  { id: '6', function: 'drawRect', selfTime: 0.6, totalTime: 0.6, percentage: 3.7 },
];

const ProfilerPage: m.Component = {
  view(): m.Vnode {
    function toggleTrackGroup(groupId: string): void {
      State.collapsedTrackGroups[groupId] = !State.collapsedTrackGroups[groupId];
    }

    function toggleTrack(trackId: string): void {
      State.collapsedTracks[trackId] = !State.collapsedTracks[trackId];
    }

    function expandAllTracks(): void {
      State.collapsedTrackGroups = {};
      State.collapsedTracks = {};
    }

    function collapseAllTracks(): void {
      State.collapsedTrackGroups = { 'main-thread': true, gpu: true, workers: true };
      State.collapsedTracks = { frame: true, scripts: true, paint: true };
    }

    return m('.page-profiler', [
      m(
        MenuBar,
        {
          rightContent: m(
            'div',
            {
              style: {
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--bl-spacing-md)',
              },
            },
            [
              m(Badge, { variant: 'success' }, 'Recording'),
              m(Button, { variant: 'primary' }, 'Stop'),
            ]
          ),
        },
        [
          m(Button, { variant: 'ghost' }, 'File'),
          m(Button, { variant: 'ghost' }, 'Edit'),
          m(Button, { variant: 'ghost' }, 'View'),
          m(Button, { variant: 'ghost' }, 'Profile'),
          m(Button, { variant: 'ghost' }, 'Help'),
        ]
      ),

      m(ProfilerSplit, {
        direction: 'vertical',
        initialSplit: 70,
        minSize: 100,
        className: 'profiler-main',
        firstPanel: m('.profiler-timeline-area', [
          m('.bl-timeline', [
            m('.bl-timeline-header', [
              m('span.bl-timeline-title', 'Frame Profile - Frame #1247'),
              m('.bl-btn-group', [
                m(Button, { icon: 'skip_previous', tooltip: 'Previous Frame' }),
                m(Button, { icon: 'skip_next', tooltip: 'Next Frame' }),
              ]),
              m('.bl-timeline-controls', [
                m(Input, { placeholder: 'Filter tracks...', icon: 'search' }),
                m(Button, { icon: 'unfold_more', tooltip: 'Expand All', onclick: expandAllTracks }),
                m(Button, {
                  icon: 'unfold_less',
                  tooltip: 'Collapse All',
                  onclick: collapseAllTracks,
                }),
                m(Select, {
                  options: [
                    { value: 'all', label: 'All Threads' },
                    { value: 'main', label: 'Main Thread' },
                    { value: 'gpu', label: 'GPU' },
                  ],
                }),
                m('.bl-timeline-zoom', [
                  m(Button, { icon: 'remove', tooltip: 'Zoom Out' }),
                  m('span', '100%'),
                  m(Button, { icon: 'add', tooltip: 'Zoom In' }),
                ]),
                m(Button, { icon: 'fit_screen', tooltip: 'Fit to Window' }),
              ]),
            ]),

            m('.bl-timeline-minimap', [
              m('.bl-timeline-minimap-slice', {
                style: { left: '2%', width: '50%', top: '6px', backgroundColor: '#5a9a5a' },
              }),
              m('.bl-timeline-minimap-slice', {
                style: { left: '55%', width: '15%', top: '10px', backgroundColor: '#d4842a' },
              }),
              m('.bl-timeline-minimap-slice', {
                style: { left: '70%', width: '20%', top: '14px', backgroundColor: '#8a6ab5' },
              }),
              m('.bl-timeline-minimap-slice', {
                style: { left: '3%', width: '45%', top: '20px', backgroundColor: '#b54a4a' },
              }),
              m('.bl-timeline-minimap-viewport', { style: { left: '0%', width: '100%' } }),
            ]),

            m('.bl-timeline-body', [
              m('.bl-timeline-ruler-row', [
                m('.bl-timeline-tracks-header', [m('span', 'Tracks')]),
                m('.bl-timeline-ruler', [
                  m('.bl-timeline-ruler-inner', [
                    m('.bl-timeline-ruler-mark.major', { style: { left: '0' } }, m('span', '0ms')),
                    m(
                      '.bl-timeline-ruler-mark.major',
                      { style: { left: '25%' } },
                      m('span', '4ms')
                    ),
                    m(
                      '.bl-timeline-ruler-mark.major',
                      { style: { left: '50%' } },
                      m('span', '8ms')
                    ),
                    m(
                      '.bl-timeline-ruler-mark.major',
                      { style: { left: '75%' } },
                      m('span', '12ms')
                    ),
                    m(
                      '.bl-timeline-ruler-mark.major',
                      { style: { left: '100%' } },
                      m('span', '16ms')
                    ),
                  ]),
                ]),
              ]),

              m('.bl-timeline-scroll', [
                m('.bl-timeline-tracks', [
                  // Main Thread Group
                  m(
                    '.bl-track-group',
                    {
                      'data-group': 'main-thread',
                      class: State.collapsedTrackGroups['main-thread'] ? 'collapsed' : '',
                    },
                    [
                      m(
                        '.bl-track-group-header',
                        { onclick: () => toggleTrackGroup('main-thread') },
                        [
                          m('span.bl-track-group-toggle.material-symbols-outlined', 'chevron_right'),
                          m('span.bl-track-group-name', 'Main Thread'),
                          m('.bl-track-buttons', [
                            m(Button, {
                              variant: 'ghost',
                              icon: 'push_pin',
                              tooltip: 'Pin',
                              onclick: (e: Event) => e.stopPropagation(),
                            }),
                            m(Button, {
                              variant: 'ghost',
                              icon: 'more_vert',
                              tooltip: 'More',
                              onclick: (e: Event) => e.stopPropagation(),
                            }),
                          ]),
                        ]
                      ),
                      m('.bl-track-group-content', [
                        m(
                          '.bl-track.expandable',
                          {
                            'data-track': 'frame',
                            'data-depth': '1',
                            class: State.collapsedTracks['frame'] ? 'collapsed' : '',
                            onclick: () => toggleTrack('frame'),
                          },
                          [
                            m('span.bl-track-toggle.material-symbols-outlined', 'chevron_right'),
                            m('span.bl-track-name', 'Frame'),
                            m('.bl-track-buttons', [
                              m(Button, {
                                variant: 'ghost',
                                icon: 'push_pin',
                                tooltip: 'Pin',
                                onclick: (e: Event) => e.stopPropagation(),
                              }),
                              m(Button, {
                                variant: 'ghost',
                                icon: 'more_vert',
                                tooltip: 'More',
                                onclick: (e: Event) => e.stopPropagation(),
                              }),
                            ]),
                          ]
                        ),
                        !State.collapsedTracks['frame'] &&
                          m('.bl-track-children', { 'data-track': 'frame' }, [
                            m(
                              '.bl-track.expandable',
                              {
                                'data-track': 'scripts',
                                'data-depth': '2',
                                class: State.collapsedTracks['scripts'] ? 'collapsed' : '',
                                onclick: (e: Event) => {
                                  e.stopPropagation();
                                  toggleTrack('scripts');
                                },
                              },
                              [
                                m('span.bl-track-toggle.material-symbols-outlined', 'chevron_right'),
                                m('span.bl-track-name', 'Scripts'),
                                m('.bl-track-buttons', [
                                  m(Button, {
                                    variant: 'ghost',
                                    icon: 'push_pin',
                                    tooltip: 'Pin',
                                    onclick: (e: Event) => e.stopPropagation(),
                                  }),
                                ]),
                              ]
                            ),
                            !State.collapsedTracks['scripts'] &&
                              m('.bl-track-children', { 'data-track': 'scripts' }, [
                                m('.bl-track', { 'data-depth': '3' }, [
                                  m('span.bl-track-name', 'updateScene()'),
                                  m('.bl-track-buttons', [
                                    m(Button, {
                                      variant: 'ghost',
                                      icon: 'push_pin',
                                      tooltip: 'Pin',
                                      onclick: (e: Event) => e.stopPropagation(),
                                    }),
                                  ]),
                                ]),
                                m('.bl-track', { 'data-depth': '3' }, [
                                  m('span.bl-track-name', 'processInput()'),
                                  m('.bl-track-buttons', [
                                    m(Button, {
                                      variant: 'ghost',
                                      icon: 'push_pin',
                                      tooltip: 'Pin',
                                      onclick: (e: Event) => e.stopPropagation(),
                                    }),
                                  ]),
                                ]),
                              ]),
                            m('.bl-track', { 'data-depth': '2' }, [
                              m('span.bl-track-name', 'Layout'),
                              m('.bl-track-buttons', [
                                m(Button, {
                                  variant: 'ghost',
                                  icon: 'push_pin',
                                  tooltip: 'Pin',
                                  onclick: (e: Event) => e.stopPropagation(),
                                }),
                              ]),
                            ]),
                            m(
                              '.bl-track.expandable',
                              {
                                'data-track': 'paint',
                                'data-depth': '2',
                                class: State.collapsedTracks['paint'] ? 'collapsed' : '',
                                onclick: (e: Event) => {
                                  e.stopPropagation();
                                  toggleTrack('paint');
                                },
                              },
                              [
                                m('span.bl-track-toggle.material-symbols-outlined', 'chevron_right'),
                                m('span.bl-track-name', 'Paint'),
                                m('.bl-track-buttons', [
                                  m(Button, {
                                    variant: 'ghost',
                                    icon: 'push_pin',
                                    tooltip: 'Pin',
                                    onclick: (e: Event) => e.stopPropagation(),
                                  }),
                                ]),
                              ]
                            ),
                            !State.collapsedTracks['paint'] &&
                              m('.bl-track-children', { 'data-track': 'paint' }, [
                                m(
                                  '.bl-track',
                                  { 'data-depth': '3' },
                                  m('span.bl-track-name', 'paint')
                                ),
                                m(
                                  '.bl-track',
                                  { 'data-depth': '3' },
                                  m('span.bl-track-name', 'rasterize')
                                ),
                              ]),
                          ]),
                      ]),
                    ]
                  ),

                  // GPU Group
                  m(
                    '.bl-track-group',
                    {
                      'data-group': 'gpu',
                      class: State.collapsedTrackGroups['gpu'] ? 'collapsed' : '',
                    },
                    [
                      m('.bl-track-group-header', { onclick: () => toggleTrackGroup('gpu') }, [
                        m('span.bl-track-group-toggle.material-symbols-outlined', 'chevron_right'),
                        m('span.bl-track-group-name', 'GPU'),
                        m('.bl-track-buttons', [
                          m(Button, {
                            variant: 'ghost',
                            icon: 'push_pin',
                            tooltip: 'Pin',
                            onclick: (e: Event) => e.stopPropagation(),
                          }),
                        ]),
                      ]),
                      m('.bl-track-group-content', [
                        m('.bl-track', [
                          m('span.bl-track-name', 'Render Pass'),
                          m('.bl-track-buttons', [
                            m(Button, {
                              variant: 'ghost',
                              icon: 'push_pin',
                              tooltip: 'Pin',
                              onclick: (e: Event) => e.stopPropagation(),
                            }),
                          ]),
                        ]),
                        m('.bl-track', [
                          m('span.bl-track-name', 'Compositing'),
                          m('.bl-track-buttons', [
                            m(Button, {
                              variant: 'ghost',
                              icon: 'push_pin',
                              tooltip: 'Pin',
                              onclick: (e: Event) => e.stopPropagation(),
                            }),
                          ]),
                        ]),
                      ]),
                    ]
                  ),

                  // Workers Group
                  m(
                    '.bl-track-group',
                    {
                      'data-group': 'workers',
                      class: State.collapsedTrackGroups['workers'] ? 'collapsed' : '',
                    },
                    [
                      m('.bl-track-group-header', { onclick: () => toggleTrackGroup('workers') }, [
                        m('span.bl-track-group-toggle.material-symbols-outlined', 'chevron_right'),
                        m('span.bl-track-group-name', 'Worker Threads'),
                        m('.bl-track-buttons', [
                          m(Button, {
                            variant: 'ghost',
                            icon: 'push_pin',
                            tooltip: 'Pin',
                            onclick: (e: Event) => e.stopPropagation(),
                          }),
                        ]),
                      ]),
                      m('.bl-track-group-content', [
                        m('.bl-track', [
                          m('span.bl-track-name', 'Worker 1'),
                          m('.bl-track-buttons', [
                            m(Button, {
                              variant: 'ghost',
                              icon: 'push_pin',
                              tooltip: 'Pin',
                              onclick: (e: Event) => e.stopPropagation(),
                            }),
                          ]),
                        ]),
                        m('.bl-track', [
                          m('span.bl-track-name', 'Worker 2'),
                          m('.bl-track-buttons', [
                            m(Button, {
                              variant: 'ghost',
                              icon: 'push_pin',
                              tooltip: 'Pin',
                              onclick: (e: Event) => e.stopPropagation(),
                            }),
                          ]),
                        ]),
                      ]),
                    ]
                  ),
                ]),

                m('.bl-timeline-lanes-column', [
                  m('.bl-timeline-lanes-inner', { style: { width: '100%', minHeight: '100%' } }, [
                    m('.bl-timeline-grid', [
                      m('.bl-timeline-grid-line.major', { style: { left: '0' } }),
                      m('.bl-timeline-grid-line', { style: { left: '12.5%' } }),
                      m('.bl-timeline-grid-line.major', { style: { left: '25%' } }),
                      m('.bl-timeline-grid-line', { style: { left: '37.5%' } }),
                      m('.bl-timeline-grid-line.major', { style: { left: '50%' } }),
                      m('.bl-timeline-grid-line', { style: { left: '62.5%' } }),
                      m('.bl-timeline-grid-line.major', { style: { left: '75%' } }),
                      m('.bl-timeline-grid-line', { style: { left: '87.5%' } }),
                    ]),

                    m('.bl-timeline-playhead', { style: { left: '32%' } }),

                    // Main Thread Lanes
                    m(
                      '.bl-lane-group',
                      {
                        'data-group': 'main-thread',
                        class: State.collapsedTrackGroups['main-thread'] ? 'collapsed' : '',
                      },
                      [
                        m('.bl-lane-group-header'),
                        m('.bl-lane-group-content', [
                          m('.bl-timeline-lane', [
                            m('.bl-slice.bl-slice-gray', { style: { left: '1%', width: '98%' } }, [
                              m('span.bl-slice-label', 'requestAnimationFrame'),
                              m('span.bl-slice-duration', '16.4ms'),
                            ]),
                          ]),
                          !State.collapsedTracks['frame'] &&
                            m('.bl-lane-children', { 'data-track': 'frame' }, [
                              m('.bl-timeline-lane', [
                                m(
                                  '.bl-slice.bl-slice-green',
                                  { style: { left: '2%', width: '50%' } },
                                  [
                                    m('span.bl-slice-label', 'Scripts'),
                                    m('span.bl-slice-duration', '8.2ms'),
                                  ]
                                ),
                              ]),
                              !State.collapsedTracks['scripts'] &&
                                m('.bl-lane-children', { 'data-track': 'scripts' }, [
                                  m('.bl-timeline-lane', [
                                    m(
                                      '.bl-slice.bl-slice-green',
                                      { style: { left: '3%', width: '25%' } },
                                      m('span.bl-slice-label', 'updateScene')
                                    ),
                                  ]),
                                  m('.bl-timeline-lane', [
                                    m(
                                      '.bl-slice.bl-slice-green',
                                      { style: { left: '30%', width: '20%' } },
                                      m('span.bl-slice-label', 'processInput')
                                    ),
                                  ]),
                                ]),
                              m('.bl-timeline-lane', [
                                m(
                                  '.bl-slice.bl-slice-orange',
                                  { style: { left: '55%', width: '13%' } },
                                  [
                                    m('span.bl-slice-label', 'Layout'),
                                    m('span.bl-slice-duration', '2.1ms'),
                                  ]
                                ),
                              ]),
                              m('.bl-timeline-lane', [
                                m(
                                  '.bl-slice.bl-slice-purple',
                                  { style: { left: '70%', width: '12%' } },
                                  [
                                    m('span.bl-slice-label', 'Paint'),
                                    m('span.bl-slice-duration', '1.8ms'),
                                  ]
                                ),
                              ]),
                              !State.collapsedTracks['paint'] &&
                                m('.bl-lane-children', { 'data-track': 'paint' }, [
                                  m('.bl-timeline-lane', [
                                    m(
                                      '.bl-slice.bl-slice-purple',
                                      { style: { left: '71%', width: '5%' } },
                                      m('span.bl-slice-label', 'drawRect')
                                    ),
                                  ]),
                                  m('.bl-timeline-lane', [
                                    m(
                                      '.bl-slice.bl-slice-purple',
                                      { style: { left: '77%', width: '4%' } },
                                      m('span.bl-slice-label', 'rasterize')
                                    ),
                                  ]),
                                ]),
                            ]),
                        ]),
                      ]
                    ),

                    // GPU Lanes
                    m(
                      '.bl-lane-group',
                      {
                        'data-group': 'gpu',
                        class: State.collapsedTrackGroups['gpu'] ? 'collapsed' : '',
                      },
                      [
                        m('.bl-lane-group-header'),
                        m('.bl-lane-group-content', [
                          m('.bl-timeline-lane', [
                            m('.bl-slice.bl-slice-red', { style: { left: '3%', width: '45%' } }, [
                              m('span.bl-slice-label', 'Render Pass'),
                              m('span.bl-slice-duration', '7.2ms'),
                            ]),
                          ]),
                          m('.bl-timeline-lane', [
                            m('.bl-slice.bl-slice-teal', { style: { left: '50%', width: '35%' } }, [
                              m('span.bl-slice-label', 'Compositing'),
                              m('span.bl-slice-duration', '5.6ms'),
                            ]),
                          ]),
                        ]),
                      ]
                    ),

                    // Worker Lanes
                    m(
                      '.bl-lane-group',
                      {
                        'data-group': 'workers',
                        class: State.collapsedTrackGroups['workers'] ? 'collapsed' : '',
                      },
                      [
                        m('.bl-lane-group-header'),
                        m('.bl-lane-group-content', [
                          m('.bl-timeline-lane', [
                            m(
                              '.bl-slice.bl-slice-yellow',
                              { style: { left: '5%', width: '20%' } },
                              m('span.bl-slice-label', 'parseGeometry')
                            ),
                          ]),
                          m('.bl-timeline-lane', [
                            m(
                              '.bl-slice.bl-slice-yellow',
                              { style: { left: '10%', width: '15%' } },
                              m('span.bl-slice-label', 'decodeTexture')
                            ),
                          ]),
                        ]),
                      ]
                    ),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
        secondPanel: m('.profiler-details', [
          m(Tabs, {
            variant: 'primary',
            className: 'profiler-primary-tabs',
            tabs: [
              {
                id: 'selection',
                label: 'Selection',
                icon: 'select_all',
                content: m('.profiler-tab-content', [
                  m(Tabs, {
                    variant: 'inline',
                    className: 'selection-subtabs',
                    tabs: [
                      {
                        id: 'summary',
                        label: 'Summary',
                        content: m('.details-grid', [
                          m('.details-section', [
                            m('.details-section-title', 'Selected Slice'),
                            m('.details-row', [
                              m('span.details-label', 'Function'),
                              m('span.details-value.highlight', 'requestAnimationFrame'),
                            ]),
                            m('.details-row', [
                              m('span.details-label', 'Duration'),
                              m('span.details-value', '16.4ms'),
                            ]),
                            m('.details-row', [
                              m('span.details-label', 'Self Time'),
                              m('span.details-value', '0.4ms'),
                            ]),
                          ]),
                          m('.details-section', [
                            m('.details-section-title', 'Frame Statistics'),
                            m('.details-row', [
                              m('span.details-label', 'Total Frame Time'),
                              m('span.details-value', '16.4ms'),
                            ]),
                            m('.details-row', [
                              m('span.details-label', 'Scripts'),
                              m('span.details-value', '8.2ms (50%)'),
                            ]),
                            m('.details-row', [
                              m('span.details-label', 'Layout'),
                              m('span.details-value', '2.1ms (13%)'),
                            ]),
                            m('.flame-bar', [
                              m('.flame-bar-segment', {
                                style: { width: '50%', backgroundColor: '#5a9a5a' },
                              }),
                              m('.flame-bar-segment', {
                                style: { width: '13%', backgroundColor: '#d4842a' },
                              }),
                              m('.flame-bar-segment', {
                                style: { width: '11%', backgroundColor: '#8a6ab5' },
                              }),
                              m('.flame-bar-segment', {
                                style: { width: '26%', backgroundColor: '#424242' },
                              }),
                            ]),
                          ]),
                          m('.details-section', [
                            m('.details-section-title', 'Warnings'),
                            m(
                              '.details-row',
                              { style: { color: 'var(--bl-warning)' } },
                              'Long frame detected (>16ms budget)'
                            ),
                          ]),
                        ]),
                      },
                      {
                        id: 'callstack',
                        label: 'Call Stack',
                        content: m('.callstack-content', [
                          m('.callstack-frame', [
                            m('span.callstack-index', '0'),
                            m('span.callstack-fn', 'requestAnimationFrame'),
                            m('span.callstack-location', 'native code'),
                          ]),
                          m('.callstack-frame', [
                            m('span.callstack-index', '1'),
                            m('span.callstack-fn', 'updateScene'),
                            m('span.callstack-location', 'scene.js:142'),
                          ]),
                          m('.callstack-frame', [
                            m('span.callstack-index', '2'),
                            m('span.callstack-fn', 'processInput'),
                            m('span.callstack-location', 'input.js:87'),
                          ]),
                          m('.callstack-frame', [
                            m('span.callstack-index', '3'),
                            m('span.callstack-fn', 'render'),
                            m('span.callstack-location', 'renderer.js:256'),
                          ]),
                        ]),
                      },
                      {
                        id: 'bottomup',
                        label: 'Bottom-Up',
                        content: m('.bottomup-content', [
                          m(BottomUpTable, {
                            borderless: true,
                            columns: [
                              { header: 'Function', key: 'function' },
                              {
                                header: 'Self Time',
                                render: (row) => `${row.selfTime.toFixed(1)}ms`,
                              },
                              {
                                header: 'Total Time',
                                render: (row) => `${row.totalTime.toFixed(1)}ms`,
                              },
                              {
                                header: '%',
                                render: (row) => `${row.percentage.toFixed(1)}%`,
                              },
                            ],
                            data: bottomUpData,
                            rowKey: (row) => row.id,
                          }),
                        ]),
                      },
                      {
                        id: 'topdown',
                        label: 'Top-Down',
                        content: m('.topdown-content', [
                          m('.topdown-row.expandable', [
                            m('span.topdown-toggle', '▶'),
                            m('span.topdown-fn', 'requestAnimationFrame'),
                            m('span.topdown-self', '0.4ms'),
                            m('span.topdown-total', '16.4ms'),
                          ]),
                          m('.topdown-row.indent-1', [
                            m('span.topdown-fn', 'Scripts'),
                            m('span.topdown-self', '0.2ms'),
                            m('span.topdown-total', '8.2ms'),
                          ]),
                          m('.topdown-row.indent-1', [
                            m('span.topdown-fn', 'Layout'),
                            m('span.topdown-self', '2.1ms'),
                            m('span.topdown-total', '2.1ms'),
                          ]),
                          m('.topdown-row.indent-1', [
                            m('span.topdown-fn', 'Paint'),
                            m('span.topdown-self', '1.8ms'),
                            m('span.topdown-total', '1.8ms'),
                          ]),
                        ]),
                      },
                    ],
                    activeTab: State.profilerSecondaryTab,
                    onTabChange: (tabId: string) => {
                      State.profilerSecondaryTab = tabId;
                    },
                  }),
                ]),
              },
              {
                id: 'history',
                label: 'History',
                icon: 'history',
                content: m('.profiler-tab-content', [
                  m('.history-list', [
                    m('.history-item.selected', [
                      m('span.history-time', '10:42:15'),
                      m('span.history-name', 'requestAnimationFrame'),
                      m('span.history-duration', '16.4ms'),
                    ]),
                    m('.history-item', [
                      m('span.history-time', '10:42:14'),
                      m('span.history-name', 'updateScene'),
                      m('span.history-duration', '4.2ms'),
                    ]),
                    m('.history-item', [
                      m('span.history-time', '10:42:13'),
                      m('span.history-name', 'processInput'),
                      m('span.history-duration', '3.8ms'),
                    ]),
                    m('.history-item', [
                      m('span.history-time', '10:42:12'),
                      m('span.history-name', 'render'),
                      m('span.history-duration', '12.1ms'),
                    ]),
                  ]),
                ]),
              },
              {
                id: 'flamegraph',
                label: 'Flame Graph',
                icon: 'local_fire_department',
                content: m('.profiler-tab-content', [
                  m('.flamegraph-placeholder', [
                    m('.flamegraph-row', { style: { width: '100%' } }, 'root (16.4ms)'),
                    m(
                      '.flamegraph-row',
                      { style: { width: '50%', marginLeft: '0' } },
                      'Scripts (8.2ms)'
                    ),
                    m(
                      '.flamegraph-row',
                      { style: { width: '25%', marginLeft: '0' } },
                      'updateScene (4.2ms)'
                    ),
                    m(
                      '.flamegraph-row',
                      { style: { width: '13%', marginLeft: '55%', marginTop: '-48px' } },
                      'Layout (2.1ms)'
                    ),
                    m(
                      '.flamegraph-row',
                      { style: { width: '12%', marginLeft: '70%', marginTop: '0' } },
                      'Paint (1.8ms)'
                    ),
                  ]),
                ]),
              },
              {
                id: 'statistics',
                label: 'Statistics',
                icon: 'bar_chart',
                content: m('.profiler-tab-content', [
                  m('.stats-grid', [
                    m('.stats-card', [
                      m('.stats-value', '16.4'),
                      m('.stats-unit', 'ms'),
                      m('.stats-label', 'Frame Time'),
                    ]),
                    m('.stats-card', [
                      m('.stats-value', '60.9'),
                      m('.stats-unit', 'fps'),
                      m('.stats-label', 'Frame Rate'),
                    ]),
                    m('.stats-card', [
                      m('.stats-value', '8.2'),
                      m('.stats-unit', 'ms'),
                      m('.stats-label', 'Script Time'),
                    ]),
                    m('.stats-card', [
                      m('.stats-value', '1.8'),
                      m('.stats-unit', 'ms'),
                      m('.stats-label', 'Paint Time'),
                    ]),
                  ]),
                ]),
              },
            ],
            activeTab: State.profilerPrimaryTab,
            onTabChange: (tabId: string) => {
              State.profilerPrimaryTab = tabId;
            },
          }),
        ]),
      }),

      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', 'Frame: 1247'),
        m('span.bl-statusbar-item', 'Duration: 16.4ms'),
        m('span.bl-statusbar-item', '60 FPS target'),
        m(
          'span.bl-statusbar-item',
          { style: { marginLeft: 'auto', borderRight: 'none' } },
          'Profiler v1.0'
        ),
      ]),
    ]);
  },
};

export default ProfilerPage;
