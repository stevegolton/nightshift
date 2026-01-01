import m from 'mithril';
import './ComponentsPage.css';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { SegmentedButtonGroup, SegmentedButton } from '../components/SegmentedButton';
import { Tabs } from '../components/Tabs';
import { SplitPanel } from '../components/SplitPanel';
import Input from '../components/Input';
import Select from '../components/Select';
import Checkbox from '../components/Checkbox';
import Radio from '../components/Radio';
import Slider from '../components/Slider';
import ProgressBar from '../components/ProgressBar';
import Table from '../components/Table';
import Anchor from '../components/Anchor';
import NumberInput from '../components/NumberInput';
import TimeInput from '../components/TimeInput';
import Tag from '../components/Tag';
import MenuBar from '../components/MenuBar';
import Portal from '../components/Portal';
import Popover, { PopoverPlacement } from '../components/Popover';
import PopupMenu from '../components/PopupMenu';

// Page-local state
const state = {
  // Popover demos
  popoverOpen: false,
  popoverPlacement: 'bottom' as PopoverPlacement,
  // Portal demos
  portalVisible: false,
  // Select demos
  selectMode: 'object',
  selectView: 'solid',
  // Checkbox demos
  checkOverlays: true,
  checkFloor: true,
  checkAxes: false,
  // Radio demos
  radioPivot: 'median',
  // Slider demos
  slider1: 75,
  slider2: 25,
  // Segmented button demos
  segmentedMode: 'vertex',
  segmentedAlign: 'center',
  segmentedDisplay: 'wire',
  // Tab demos
  activeTab: 'scene',
  activeSecondaryTab: 'summary',
};

// Create Table instance
interface ObjectData {
  id: string;
  name: string;
  type: string;
  vertices: number;
  status: 'active' | 'hidden' | 'modified';
}

const ObjectTable = Table<ObjectData>();

const tableData: ObjectData[] = [
  { id: 'cube', name: 'Cube', type: 'Mesh', vertices: 8, status: 'active' },
  { id: 'suzanne', name: 'Suzanne', type: 'Mesh', vertices: 507, status: 'hidden' },
  { id: 'sphere', name: 'Sphere', type: 'Mesh', vertices: 482, status: 'modified' },
];

const ComponentsPage: m.Component = {
  view(): m.Vnode {
    return m('.page-components', [
      m(MenuBar, [
        m(Button, { variant: 'ghost' }, 'File'),
        m(Button, { variant: 'ghost' }, 'Edit'),
        m(Button, { variant: 'ghost' }, 'View'),
        m(Button, { variant: 'ghost' }, 'Object'),
        m(Button, { variant: 'ghost' }, 'Help'),
      ]),

      m('.demo-main', [
        // Main Content Area
        m('.demo-content', [
          // Buttons Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Buttons'),
            m('.demo-label', 'Standard Buttons'),
            m('.demo-row', [
              m(Button, 'Default'),
              m(Button, { variant: 'primary' }, 'Primary'),
              m(Button, { disabled: true }, 'Disabled'),
            ]),
            m('.demo-label', 'Icon Buttons'),
            m('.demo-row', [
              m(Button, { icon: 'open_with', tooltip: 'Move' }),
              m(Button, { icon: 'rotate_right', tooltip: 'Rotate' }),
              m(Button, { icon: 'zoom_out_map', tooltip: 'Scale' }),
            ]),
            m('.demo-label', 'Icon + Text Buttons'),
            m('.demo-row', [
              m(Button, { icon: 'save' }, 'Save'),
              m(Button, { icon: 'folder_open' }, 'Open'),
              m(Button, { icon: 'delete', variant: 'primary' }, 'Delete'),
            ]),
            m('.demo-label', 'Ghost Buttons'),
            m(
              '.demo-row',
              {
                style: {
                  backgroundColor: 'var(--bl-surface-2)',
                  padding: 'var(--bl-spacing-sm)',
                  borderRadius: 'var(--bl-radius-md)',
                },
              },
              [
                m(Button, { variant: 'ghost', icon: 'push_pin' }),
                m(Button, { variant: 'ghost', icon: 'more_vert' }),
                m(Button, { variant: 'ghost', icon: 'settings' }),
                m(Button, { variant: 'ghost' }, 'Ghost Text'),
              ]
            ),
            m('.demo-label', 'Button Group'),
            m('.demo-row', [
              m(ButtonGroup, [
                m(Button, {}, 'Object'),
                m(Button, {}, 'Edit'),
                m(Button, {}, 'Sculpt'),
              ]),
            ]),
          ]),

          // Anchors Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Anchors'),
            m('.demo-row', [
              m(Anchor, { href: '#' }, 'Default Link'),
              m(Anchor, { href: 'https://blender.org', external: true }, 'External Link'),
              m(Anchor, { href: '#', disabled: true }, 'Disabled Link'),
            ]),
            m('.demo-label', 'With Icons'),
            m('.demo-row', [
              m(Anchor, { href: '#', icon: 'link' }, 'With Icon'),
              m(Anchor, { href: '#', icon: 'open_in_new', iconPosition: 'right' }, 'Icon Right'),
              m(Anchor, { href: '#', icon: 'download' }, 'Download'),
            ]),
          ]),

          // Text Inputs Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Text Inputs'),
            m('.demo-label', 'Standard Input'),
            m('.demo-row', [
              m(Input, { placeholder: 'Enter text...' }),
              m(Input, { value: 'With value' }),
              m(Input, { disabled: true, value: 'Disabled' }),
            ]),
            m('.demo-label', 'Input with Icon'),
            m('.demo-row', [
              m(Input, { icon: 'search', placeholder: 'Search...' }),
              m(Input, { icon: 'person', placeholder: 'Username' }),
              m(Input, { icon: 'lock', type: 'password', placeholder: 'Password' }),
            ]),
            m('.demo-label', 'With Right Element (interactive buttons)'),
            m('.demo-row', [
              m(Input, {
                type: 'password',
                placeholder: 'Password',
                rightElement: m(Button, { variant: 'ghost', icon: 'visibility' }),
              }),
              m(Input, {
                placeholder: 'Clearable input',
                rightElement: m(Button, { variant: 'ghost', icon: 'clear' }),
              }),
            ]),
          ]),

          // Number Inputs Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Number Inputs'),
            m('.demo-label', 'Standard'),
            m('.demo-row', [
              m(NumberInput, { label: 'X' }),
              m(NumberInput, { label: 'Y' }),
              m(NumberInput, { label: 'Z' }),
            ]),
            m('.demo-label', 'With Units'),
            m('.demo-row', [
              m(NumberInput, { label: 'Roll', unit: 'rad/s' }),
              m(NumberInput, { label: 'Pitch', unit: 'rad/s' }),
              m(NumberInput, { label: 'Yaw', unit: 'rad/s' }),
            ]),
          ]),

          // Selects Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Select Inputs'),
            m('.demo-row', [
              m(Select, {
                options: [
                  { value: 'object', label: 'Object Mode' },
                  { value: 'edit', label: 'Edit Mode' },
                  { value: 'sculpt', label: 'Sculpt Mode' },
                ],
              }),
              m(Select, {
                value: state.selectView || 'solid',
                options: [
                  { value: 'solid', label: 'Solid' },
                  { value: 'wireframe', label: 'Wireframe' },
                  { value: 'material', label: 'Material Preview' },
                ],
                onchange: (val: string) => {
                  state.selectView = val;
                },
              }),
            ]),
            m('.demo-label', 'With Placeholder'),
            m('.demo-row', [
              m(Select, {
                placeholder: 'Choose an option...',
                options: [
                  { value: 'a', label: 'Option A' },
                  { value: 'b', label: 'Option B' },
                  { value: 'c', label: 'Option C' },
                ],
              }),
              m(Select, {
                disabled: true,
                value: 'disabled',
                options: [{ value: 'disabled', label: 'Disabled Select' }],
              }),
            ]),
          ]),

          // Time/Date Inputs Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Time & Date Inputs'),
            m('.demo-label', 'Time Input'),
            m('.demo-row', [
              m(TimeInput, {
                type: 'time',
                label: 'Start',
              }),
              m(TimeInput, {
                type: 'time',
                label: 'End',
              }),
              m(TimeInput, {
                type: 'time',
                value: '12:30',
                disabled: true,
              }),
            ]),
            m('.demo-label', 'Date Input'),
            m('.demo-row', [
              m(TimeInput, {
                type: 'date',
                label: 'Date',
              }),
              m(TimeInput, {
                type: 'date',
                value: '2025-12-25',
                disabled: true,
              }),
            ]),
            m('.demo-label', 'DateTime Input'),
            m('.demo-row', [
              m(TimeInput, {
                type: 'datetime-local',
                label: 'Event',
              }),
            ]),
          ]),

          // Checkboxes & Radio Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Checkboxes & Radio Buttons'),
            m('.demo-label', 'Checkboxes'),
            m('.demo-row', [
              m(
                Checkbox,
                {
                  checked: state.checkOverlays,
                  onchange: (v: boolean) => {
                    state.checkOverlays = v;
                  },
                },
                'Show Overlays'
              ),
              m(
                Checkbox,
                {
                  checked: state.checkFloor,
                  onchange: (v: boolean) => {
                    state.checkFloor = v;
                  },
                },
                'Show Floor'
              ),
              m(
                Checkbox,
                {
                  checked: state.checkAxes,
                  onchange: (v: boolean) => {
                    state.checkAxes = v;
                  },
                },
                'Show Axes'
              ),
            ]),
            m('.demo-label', 'Disabled Checkboxes'),
            m('.demo-row', [
              m(Checkbox, { checked: true, disabled: true }, 'Checked Disabled'),
              m(Checkbox, { checked: false, disabled: true }, 'Unchecked Disabled'),
            ]),
            m('.demo-label', 'Radio Buttons'),
            m('.demo-row', [
              m(
                Radio,
                {
                  name: 'pivot',
                  value: 'median',
                  checked: state.radioPivot === 'median',
                  onchange: (v: string) => {
                    state.radioPivot = v;
                  },
                },
                'Median Point'
              ),
              m(
                Radio,
                {
                  name: 'pivot',
                  value: 'cursor',
                  checked: state.radioPivot === 'cursor',
                  onchange: (v: string) => {
                    state.radioPivot = v;
                  },
                },
                '3D Cursor'
              ),
              m(
                Radio,
                {
                  name: 'pivot',
                  value: 'active',
                  checked: state.radioPivot === 'active',
                  onchange: (v: string) => {
                    state.radioPivot = v;
                  },
                },
                'Active Element'
              ),
            ]),
            m('.demo-label', 'Disabled Radio Buttons'),
            m('.demo-row', [
              m(
                Radio,
                { name: 'disabled-radio', value: 'selected', checked: true, disabled: true },
                'Selected Disabled'
              ),
              m(
                Radio,
                { name: 'disabled-radio', value: 'unselected', disabled: true },
                'Unselected Disabled'
              ),
            ]),
            m('.demo-label', 'Segmented Buttons'),
            m('.demo-row', [
              m(SegmentedButtonGroup, [
                m(
                  SegmentedButton,
                  {
                    active: state.segmentedMode === 'vertex',
                    onclick: () => (state.segmentedMode = 'vertex'),
                  },
                  'Vertex'
                ),
                m(
                  SegmentedButton,
                  {
                    active: state.segmentedMode === 'edge',
                    onclick: () => (state.segmentedMode = 'edge'),
                  },
                  'Edge'
                ),
                m(
                  SegmentedButton,
                  {
                    active: state.segmentedMode === 'face',
                    onclick: () => (state.segmentedMode = 'face'),
                  },
                  'Face'
                ),
              ]),
              m(SegmentedButtonGroup, [
                m(SegmentedButton, {
                  active: state.segmentedAlign === 'left',
                  title: 'Align Left',
                  onclick: () => (state.segmentedAlign = 'left'),
                  icon: 'format_align_left',
                }),
                m(SegmentedButton, {
                  active: state.segmentedAlign === 'center',
                  title: 'Align Center',
                  onclick: () => (state.segmentedAlign = 'center'),
                  icon: 'format_align_center',
                }),
                m(SegmentedButton, {
                  active: state.segmentedAlign === 'right',
                  title: 'Align Right',
                  onclick: () => (state.segmentedAlign = 'right'),
                  icon: 'format_align_right',
                }),
              ]),
              m(SegmentedButtonGroup, [
                m(
                  SegmentedButton,
                  {
                    active: state.segmentedDisplay === 'solid',
                    onclick: () => (state.segmentedDisplay = 'solid'),
                    icon: { name: 'deployed_code', filled: true },
                  },
                  'Solid'
                ),
                m(
                  SegmentedButton,
                  {
                    active: state.segmentedDisplay === 'wire',
                    onclick: () => (state.segmentedDisplay = 'wire'),
                    icon: { name: 'deployed_code', filled: false },
                  },
                  'Wireframe'
                ),
              ]),
            ]),
          ]),

          // Sliders Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Sliders & Progress'),
            m('.demo-label', 'Sliders'),
            m('.demo-grid', [
              m(Slider, {
                value: state.slider1,
                oninput: (v: number) => {
                  state.slider1 = v;
                },
              }),
              m(Slider, {
                value: state.slider2,
                oninput: (v: number) => {
                  state.slider2 = v;
                },
              }),
            ]),
            m('.demo-label.bl-mt-md', 'Slider Variants'),
            m('.demo-grid', [
              m(Slider, {
                value: 50,
                showValue: false,
              }),
              m(Slider, {
                value: 75,
                disabled: true,
              }),
            ]),
            m('.demo-label.bl-mt-md', 'Progress Bars'),
            m('div', { style: { maxWidth: '400px' } }, [
              m(ProgressBar, { value: 75, className: 'bl-mb-md' }),
              m(ProgressBar, { value: 45 }),
            ]),
            m('.demo-label.bl-mt-md', 'Progress Bar Variants'),
            m('div', { style: { maxWidth: '400px' } }, [
              m(ProgressBar, { value: 90, variant: 'success', className: 'bl-mb-sm' }),
              m(ProgressBar, { value: 60, variant: 'warning', className: 'bl-mb-sm' }),
              m(ProgressBar, { value: 30, variant: 'error' }),
            ]),
          ]),

          // Tabs Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Tabs'),
            m('.demo-label', 'Primary Tabs (Browser Style)'),
            m(Tabs, {
              variant: 'primary',
              tabs: [
                {
                  id: 'scene',
                  label: 'Scene',
                  icon: 'landscape',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'Scene settings and configuration options.'
                  ),
                },
                {
                  id: 'world',
                  label: 'World',
                  icon: 'public',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'World environment and lighting settings.'
                  ),
                },
                {
                  id: 'object',
                  label: 'Object',
                  icon: 'category',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'Selected object properties and transforms.'
                  ),
                },
                {
                  id: 'modifiers',
                  label: 'Modifiers',
                  icon: 'tune',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'Object modifiers and effects stack.'
                  ),
                },
              ],
              activeTab: state.activeTab,
              onTabChange: (tabId: string) => {
                state.activeTab = tabId;
              },
            }),
            m('.demo-label.bl-mt-md', 'Inline Tabs (Pill Style)'),
            m(Tabs, {
              variant: 'inline',
              tabs: [
                {
                  id: 'summary',
                  label: 'Summary',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'Summary content panel.'
                  ),
                },
                {
                  id: 'details',
                  label: 'Details',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'Detailed information panel.'
                  ),
                },
                {
                  id: 'history',
                  label: 'History',
                  content: m(
                    'p',
                    { style: { color: 'var(--bl-text-secondary)', margin: 0 } },
                    'History and changelog.'
                  ),
                },
              ],
              activeTab: state.activeSecondaryTab || 'summary',
              onTabChange: (tabId: string) => {
                state.activeSecondaryTab = tabId;
              },
            }),
          ]),

          // Table Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Table'),
            m('.demo-label', 'With Column Actions (hover headers to see menu)'),
            m(ObjectTable, {
              columns: [
                {
                  header: 'Name',
                  key: 'name',
                  sort: 'asc',
                  actions: [
                    {
                      label: 'Sort Ascending',
                      icon: 'arrow_upward',
                      onclick: () => console.log('Sort asc'),
                    },
                    {
                      label: 'Sort Descending',
                      icon: 'arrow_downward',
                      onclick: () => console.log('Sort desc'),
                    },
                    { separator: true },
                    {
                      label: 'Filter...',
                      icon: 'filter_list',
                      onclick: () => console.log('Filter'),
                    },
                    {
                      label: 'Hide Column',
                      icon: 'visibility_off',
                      onclick: () => console.log('Hide'),
                    },
                  ],
                },
                {
                  header: 'Type',
                  key: 'type',
                  actions: [
                    {
                      label: 'Sort Ascending',
                      icon: 'arrow_upward',
                      onclick: () => console.log('Sort asc'),
                    },
                    {
                      label: 'Sort Descending',
                      icon: 'arrow_downward',
                      onclick: () => console.log('Sort desc'),
                    },
                    { separator: true },
                    {
                      label: 'Group by Type',
                      icon: 'workspaces',
                      onclick: () => console.log('Group'),
                    },
                  ],
                },
                {
                  header: 'Vertices',
                  key: 'vertices',
                  actions: [
                    {
                      label: 'Sort Ascending',
                      icon: 'arrow_upward',
                      onclick: () => console.log('Sort asc'),
                    },
                    {
                      label: 'Sort Descending',
                      icon: 'arrow_downward',
                      onclick: () => console.log('Sort desc'),
                    },
                  ],
                },
                {
                  header: 'Status',
                  actions: [
                    {
                      label: 'Filter...',
                      icon: 'filter_list',
                      onclick: () => console.log('Filter'),
                    },
                  ],
                  render: (row) => {
                    const variant =
                      row.status === 'active'
                        ? 'success'
                        : row.status === 'modified'
                          ? 'warning'
                          : undefined;
                    const label = row.status.charAt(0).toUpperCase() + row.status.slice(1);
                    return m(Tag, { variant, solid: true }, label);
                  },
                },
              ],
              data: tableData,
              rowKey: (row) => row.id,
            }),
          ]),

          // Tags Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Tags'),
            m('.demo-label', 'Standard'),
            m('.demo-row', [
              m(Tag, 'Default'),
              m(Tag, { variant: 'success' }, 'Success'),
              m(Tag, { variant: 'warning' }, 'Warning'),
              m(Tag, { variant: 'error' }, 'Error'),
            ]),
            m('.demo-label', 'Solid (badge style)'),
            m('.demo-row', [
              m(Tag, { solid: true }, 'Default'),
              m(Tag, { solid: true, variant: 'success' }, 'Success'),
              m(Tag, { solid: true, variant: 'warning' }, 'Warning'),
              m(Tag, { solid: true, variant: 'error' }, 'Error'),
            ]),
            m('.demo-label', 'With Icons'),
            m('.demo-row', [
              m(Tag, { icon: 'schedule' }, 'Schedule'),
              m(Tag, { icon: 'thermostat', variant: 'success' }, 'Heating'),
              m(Tag, { icon: 'warning', variant: 'warning' }, 'Alert'),
              m(Tag, { icon: 'error', variant: 'error' }, 'Error'),
            ]),
            m('.demo-label', 'Removable'),
            m('.demo-row', [
              m(
                Tag,
                {
                  removable: true,
                  onremove: () => console.log('Remove clicked'),
                },
                'Removable'
              ),
              m(
                Tag,
                {
                  icon: 'person',
                  removable: true,
                  onremove: () => console.log('Remove clicked'),
                },
                'User Tag'
              ),
              m(
                Tag,
                {
                  variant: 'success',
                  removable: true,
                  onremove: () => console.log('Remove clicked'),
                },
                'Active'
              ),
            ]),
            m('.demo-label', 'Clickable'),
            m('.demo-row', [
              m(
                Tag,
                {
                  onclick: () => console.log('Clicked'),
                },
                'Click me'
              ),
              m(
                Tag,
                {
                  icon: 'add',
                  onclick: () => console.log('Add clicked'),
                },
                'Add Item'
              ),
            ]),
            m('.demo-label', 'Disabled'),
            m('.demo-row', [
              m(Tag, { disabled: true }, 'Disabled'),
              m(Tag, { disabled: true, icon: 'lock' }, 'Locked'),
            ]),
          ]),

          // Menu Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Dropdown Menu'),
            m('.demo-row', [
              m('.bl-menu', { style: { display: 'inline-block' } }, [
                m('.bl-menu-item', [m('span', 'New'), m('span.bl-menu-item-shortcut', 'Ctrl+N')]),
                m('.bl-menu-item', [
                  m('span', 'Open...'),
                  m('span.bl-menu-item-shortcut', 'Ctrl+O'),
                ]),
                m('.bl-menu-item', [m('span', 'Save'), m('span.bl-menu-item-shortcut', 'Ctrl+S')]),
                m('.bl-menu-separator'),
                m('.bl-menu-item.disabled', m('span', 'Recover Last Session')),
              ]),
            ]),
          ]),

          // Portal Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Portal'),
            m('.demo-label', 'Renders content outside the normal DOM hierarchy'),
            m('.demo-row', [
              m(
                Button,
                {
                  variant: state.portalVisible ? 'primary' : 'default',
                  onclick: () => {
                    state.portalVisible = !state.portalVisible;
                  },
                },
                state.portalVisible ? 'Hide Portal' : 'Show Portal'
              ),
            ]),
            state.portalVisible &&
              m(
                Portal,
                m(
                  '.portal-demo-overlay',
                  {
                    style: {
                      position: 'fixed',
                      bottom: '80px',
                      right: '20px',
                      padding: '16px 20px',
                      background: 'var(--bl-surface-3)',
                      border: '1px solid var(--bl-border)',
                      borderRadius: 'var(--bl-radius-lg)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                      zIndex: 1000,
                    },
                  },
                  [
                    m('div', { style: { fontWeight: 500, marginBottom: '8px' } }, 'Portal Content'),
                    m(
                      'div',
                      { style: { color: 'var(--bl-text-secondary)', fontSize: '13px' } },
                      'This is rendered at document.body'
                    ),
                  ]
                )
              ),
          ]),

          // Popover Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Popover'),
            m('.demo-label', 'Anchored popover that follows its trigger element'),
            m('.demo-row', { style: { gap: '12px', flexWrap: 'wrap' } }, [
              m(
                Popover,
                {
                  trigger: m(
                    Button,
                    {
                      variant: state.popoverOpen ? 'primary' : 'default',
                      onclick: () => {
                        state.popoverOpen = !state.popoverOpen;
                      },
                    },
                    'Toggle Popover'
                  ),
                  placement: state.popoverPlacement,
                  open: state.popoverOpen,
                  onclose: () => {
                    state.popoverOpen = false;
                  },
                },
                [
                  m('div', { style: { fontWeight: 500, marginBottom: '8px' } }, 'Popover Content'),
                  m(
                    'div',
                    { style: { color: 'var(--bl-text-secondary)', fontSize: '13px' } },
                    'Click outside to close'
                  ),
                ]
              ),
              m(Select, {
                value: state.popoverPlacement,
                options: [
                  { value: 'top', label: 'Top' },
                  { value: 'top-start', label: 'Top Start' },
                  { value: 'top-end', label: 'Top End' },
                  { value: 'bottom', label: 'Bottom' },
                  { value: 'bottom-start', label: 'Bottom Start' },
                  { value: 'bottom-end', label: 'Bottom End' },
                  { value: 'left', label: 'Left' },
                  { value: 'left-start', label: 'Left Start' },
                  { value: 'left-end', label: 'Left End' },
                  { value: 'right', label: 'Right' },
                  { value: 'right-start', label: 'Right Start' },
                  { value: 'right-end', label: 'Right End' },
                ],
                onchange: (val: string) => {
                  state.popoverPlacement = val as PopoverPlacement;
                },
              }),
            ]),
          ]),

          // Popup Menu Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Popup Menu'),
            m('.demo-label', 'Menu triggered by button'),
            m('.demo-row', { style: { gap: '12px' } }, [
              m(PopupMenu, {
                trigger: m(Button, { icon: 'more_vert' }),
                items: [
                  { label: 'Cut', icon: 'content_cut', shortcut: 'Ctrl+X' },
                  { label: 'Copy', icon: 'content_copy', shortcut: 'Ctrl+C' },
                  { label: 'Paste', icon: 'content_paste', shortcut: 'Ctrl+V' },
                  { separator: true },
                  { label: 'Select All', icon: 'select_all', shortcut: 'Ctrl+A' },
                  { separator: true },
                  { label: 'Delete', icon: 'delete', danger: true },
                ],
              }),
              m(PopupMenu, {
                trigger: m(Button, 'File Menu'),
                items: [
                  { header: 'File' },
                  { label: 'New', icon: 'add', shortcut: 'Ctrl+N' },
                  { label: 'Open...', icon: 'folder_open', shortcut: 'Ctrl+O' },
                  { label: 'Save', icon: 'save', shortcut: 'Ctrl+S' },
                  { label: 'Save As...', icon: 'save_as', shortcut: 'Ctrl+Shift+S' },
                  { separator: true },
                  { header: 'Export' },
                  { label: 'Export as PNG', icon: 'image' },
                  { label: 'Export as PDF', icon: 'picture_as_pdf' },
                  { separator: true },
                  { label: 'Close', icon: 'close', shortcut: 'Ctrl+W' },
                ],
              }),
              m(PopupMenu, {
                trigger: m(Button, { icon: 'settings' }, 'Options'),
                placement: 'bottom-end',
                items: [
                  { label: 'Settings', icon: 'settings' },
                  { label: 'Preferences', icon: 'tune' },
                  { separator: true },
                  { label: 'Disabled Item', icon: 'block', disabled: true },
                  { separator: true },
                  { label: 'Log Out', icon: 'logout', danger: true },
                ],
              }),
            ]),
          ]),

          // Split Panel Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Split Panel'),
            m('.demo-label', 'Horizontal Split'),
            m(
              '.split-demo',
              {
                style: {
                  height: '150px',
                  border: '1px solid var(--bl-border-dark)',
                  borderRadius: 'var(--bl-radius-md)',
                },
              },
              [
                m(SplitPanel, {
                  direction: 'horizontal',
                  initialSplit: 40,
                  firstPanel: m('.split-panel-content', [
                    m('h4', 'Left Panel'),
                    m('p', 'Drag the handle to resize'),
                  ]),
                  secondPanel: m('.split-panel-content', [
                    m('h4', 'Right Panel'),
                    m('p', 'Content adjusts automatically'),
                  ]),
                }),
              ]
            ),
            m('.demo-label.bl-mt-md', 'Vertical Split'),
            m(
              '.split-demo',
              {
                style: {
                  height: '200px',
                  border: '1px solid var(--bl-border-dark)',
                  borderRadius: 'var(--bl-radius-md)',
                },
              },
              [
                m(SplitPanel, {
                  direction: 'vertical',
                  initialSplit: 50,
                  firstPanel: m('.split-panel-content', [
                    m('h4', 'Top Panel'),
                    m('p', 'Vertical split with top/bottom layout'),
                  ]),
                  secondPanel: m('.split-panel-content', [
                    m('h4', 'Bottom Panel'),
                    m('p', 'Useful for editors and consoles'),
                  ]),
                }),
              ]
            ),
          ]),

          // Split Panel Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Text alignment'),
            m('', [
              m(Button, 'Foo'),
              m(Select, {
                options: [
                  { value: 'a', label: 'Option A' },
                  { value: 'b', label: 'Option B' },
                  { value: 'c', label: 'Option C' },
                ],
              }),
              'Some text here',
              m(Input, { placeholder: 'Enter text...' }),
              m(Button, { icon: 'download' }),
            ]),
          ]),
        ]),
      ]),

      // Status Bar
      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', 'Verts: 8'),
        m('span.bl-statusbar-item', 'Faces: 6'),
        m('span.bl-statusbar-item', 'Objects: 3/3'),
        m(
          'span.bl-statusbar-item',
          { style: { marginLeft: 'auto', borderRight: 'none' } },
          'NightShift v1.0'
        ),
      ]),
    ]);
  },
};

export default ComponentsPage;
