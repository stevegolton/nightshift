import m from 'mithril';
import './WidgetsPage.css';
import { State } from '../state';
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
import MenuBar from '../components/MenuBar';
import Badge from '../components/Badge';
import FilterChip, { FilterChipGroup, AddFilterChip } from '../components/FilterChip';
import ReorderableList, { ReorderableItem } from '../components/ReorderableList';

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

const WidgetsPage: m.Component = {
  view(): m.Vnode {
    return m('.page-widgets', [
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
            m('.demo-label', 'Segmented Buttons'),
            m('.demo-row', [
              m(SegmentedButtonGroup, [
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedMode === 'vertex',
                    onclick: () => (State.segmentedMode = 'vertex'),
                  },
                  'Vertex'
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedMode === 'edge',
                    onclick: () => (State.segmentedMode = 'edge'),
                  },
                  'Edge'
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedMode === 'face',
                    onclick: () => (State.segmentedMode = 'face'),
                  },
                  'Face'
                ),
              ]),
              m(SegmentedButtonGroup, [
                m(SegmentedButton, {
                  active: State.segmentedAlign === 'left',
                  title: 'Align Left',
                  onclick: () => (State.segmentedAlign = 'left'),
                  icon: 'format_align_left',
                }),
                m(SegmentedButton, {
                  active: State.segmentedAlign === 'center',
                  title: 'Align Center',
                  onclick: () => (State.segmentedAlign = 'center'),
                  icon: 'format_align_center',
                }),
                m(SegmentedButton, {
                  active: State.segmentedAlign === 'right',
                  title: 'Align Right',
                  onclick: () => (State.segmentedAlign = 'right'),
                  icon: 'format_align_right',
                }),
              ]),
              m(SegmentedButtonGroup, [
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedDisplay === 'solid',
                    onclick: () => (State.segmentedDisplay = 'solid'),
                    icon: { name: 'deployed_code', filled: true },
                  },
                  'Solid'
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedDisplay === 'wire',
                    onclick: () => (State.segmentedDisplay = 'wire'),
                    icon: { name: 'deployed_code', filled: false },
                  },
                  'Wireframe'
                ),
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
            m('.demo-label', 'Icon on Right'),
            m('.demo-row', [
              m(Input, {
                icon: 'visibility',
                iconPosition: 'right',
                type: 'password',
                placeholder: 'Password',
              }),
              m(Input, { icon: 'clear', iconPosition: 'right', placeholder: 'Clearable input' }),
            ]),
            m('.demo-label', 'Number Inputs'),
            m('.demo-row', [
              m(NumberInput, {
                label: 'X',
                value: State.numberX ?? 0,
                oninput: (v: number) => {
                  State.numberX = v;
                },
              }),
              m(NumberInput, {
                label: 'Y',
                value: State.numberY ?? 0,
                oninput: (v: number) => {
                  State.numberY = v;
                },
              }),
              m(NumberInput, {
                label: 'Z',
                value: State.numberZ ?? 0,
                oninput: (v: number) => {
                  State.numberZ = v;
                },
              }),
            ]),
            m('.demo-label', 'Number Inputs with units'),
            m('.demo-row', [
              m(NumberInput, {
                label: 'Roll',
                unit: 'rad/s',
                value: State.numberX ?? 0,
                oninput: (v: number) => {
                  State.numberX = v;
                },
              }),
              m(NumberInput, {
                label: 'Pitch',
                unit: 'rad/s',
                value: State.numberY ?? 0,
                oninput: (v: number) => {
                  State.numberY = v;
                },
              }),
              m(NumberInput, {
                label: 'Yaw',
                unit: 'rad/s',
                value: State.numberZ ?? 0,
                oninput: (v: number) => {
                  State.numberZ = v;
                },
              }),
            ]),
          ]),

          // Selects Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Select Inputs'),
            m('.demo-row', [
              m(Select, {
                value: State.selectMode || 'object',
                options: [
                  { value: 'object', label: 'Object Mode' },
                  { value: 'edit', label: 'Edit Mode' },
                  { value: 'sculpt', label: 'Sculpt Mode' },
                ],
                onchange: (val: string) => {
                  State.selectMode = val;
                },
              }),
              m(Select, {
                value: State.selectView || 'solid',
                options: [
                  { value: 'solid', label: 'Solid' },
                  { value: 'wireframe', label: 'Wireframe' },
                  { value: 'material', label: 'Material Preview' },
                ],
                onchange: (val: string) => {
                  State.selectView = val;
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

          // Checkboxes & Radio Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Checkboxes & Radio Buttons'),
            m('.demo-label', 'Checkboxes'),
            m('.demo-row', [
              m(
                Checkbox,
                {
                  checked: State.checkOverlays,
                  onchange: (v: boolean) => {
                    State.checkOverlays = v;
                  },
                },
                'Show Overlays'
              ),
              m(
                Checkbox,
                {
                  checked: State.checkFloor,
                  onchange: (v: boolean) => {
                    State.checkFloor = v;
                  },
                },
                'Show Floor'
              ),
              m(
                Checkbox,
                {
                  checked: State.checkAxes,
                  onchange: (v: boolean) => {
                    State.checkAxes = v;
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
                  checked: State.radioPivot === 'median',
                  onchange: (v: string) => {
                    State.radioPivot = v;
                  },
                },
                'Median Point'
              ),
              m(
                Radio,
                {
                  name: 'pivot',
                  value: 'cursor',
                  checked: State.radioPivot === 'cursor',
                  onchange: (v: string) => {
                    State.radioPivot = v;
                  },
                },
                '3D Cursor'
              ),
              m(
                Radio,
                {
                  name: 'pivot',
                  value: 'active',
                  checked: State.radioPivot === 'active',
                  onchange: (v: string) => {
                    State.radioPivot = v;
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
          ]),

          // Sliders Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Sliders & Progress'),
            m('.demo-label', 'Sliders'),
            m('.demo-grid', [
              m(Slider, {
                value: State.slider1,
                oninput: (v: number) => {
                  State.slider1 = v;
                },
              }),
              m(Slider, {
                value: State.slider2,
                oninput: (v: number) => {
                  State.slider2 = v;
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
              activeTab: State.activeTab,
              onTabChange: (tabId: string) => {
                State.activeTab = tabId;
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
              activeTab: State.activeSecondaryTab || 'summary',
              onTabChange: (tabId: string) => {
                State.activeSecondaryTab = tabId;
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
                    return m(Badge, { variant }, label);
                  },
                },
              ],
              data: tableData,
              rowKey: (row) => row.id,
            }),
          ]),

          // Badges Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Badges'),
            m('.demo-row', [
              m(Badge, 'Default'),
              m(Badge, { variant: 'success' }, 'Success'),
              m(Badge, { variant: 'warning' }, 'Warning'),
              m(Badge, { variant: 'error' }, 'Error'),
            ]),
          ]),

          // Filter Chips Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Filter Chips'),
            m('.demo-label', 'Interactive Filters (for SQL results, tables, etc.)'),
            m(FilterChipGroup, [
              ...State.activeFilters.map((filter) =>
                m(FilterChip, {
                  label: filter.label,
                  value: filter.value,
                  active: true,
                  variant: filter.variant as 'default' | 'success' | 'warning' | 'error',
                  onremove: () => {
                    State.activeFilters = State.activeFilters.filter((f) => f.id !== filter.id);
                  },
                })
              ),
              m(AddFilterChip, {
                onclick: () => {
                  const id = String(Date.now());
                  State.activeFilters.push({ id, label: 'New Filter', value: 'Value' });
                },
              }),
            ]),
            m('.demo-label.bl-mt-md', 'Filter Chip States'),
            m('.demo-row', [
              m(FilterChip, { label: 'Default', removable: false }),
              m(FilterChip, { label: 'Active', active: true, removable: false }),
              m(FilterChip, { label: 'With Value', value: 'example', removable: false }),
              m(FilterChip, { label: 'Disabled', disabled: true, removable: false }),
            ]),
            m('.demo-label.bl-mt-md', 'Outlined Variant'),
            m('.demo-row', [
              m(FilterChip, { label: 'Outlined', variant: 'outlined', removable: false }),
              m(FilterChip, {
                label: 'Active',
                variant: 'outlined',
                active: true,
                removable: false,
              }),
            ]),
            m('.demo-label.bl-mt-md', 'Status Variants'),
            m('.demo-row', [
              m(FilterChip, {
                label: 'Success',
                variant: 'success',
                active: true,
                removable: false,
              }),
              m(FilterChip, {
                label: 'Warning',
                variant: 'warning',
                active: true,
                removable: false,
              }),
              m(FilterChip, { label: 'Error', variant: 'error', active: true, removable: false }),
            ]),
            m('.demo-label.bl-mt-md', 'With Icons'),
            m('.demo-row', [
              m(FilterChip, {
                label: 'Date',
                value: 'Today',
                icon: 'calendar_today',
                removable: false,
              }),
              m(FilterChip, { label: 'User', value: 'Admin', icon: 'person', removable: false }),
              m(FilterChip, {
                label: 'Status',
                value: 'Online',
                icon: 'circle',
                variant: 'success',
                active: true,
                removable: false,
              }),
            ]),
          ]),

          // Reorderable List Section
          m('section.demo-section', [
            m('h2.demo-section-title', 'Reorderable List'),
            m('.demo-label', 'Flat List'),
            m(
              'div',
              { style: { maxWidth: '300px' } },
              m(ReorderableList, {
                items: State.reorderableItems,
                onreorder: (items: ReorderableItem[]) => {
                  State.reorderableItems = items;
                },
              })
            ),
            m('.demo-label.bl-mt-md', 'Tree Mode (drag onto items to nest)'),
            m(
              'div',
              { style: { maxWidth: '300px' } },
              m(ReorderableList, {
                items: State.reorderableTree,
                tree: true,
                onreorder: (items: ReorderableItem[]) => {
                  State.reorderableTree = items;
                },
              })
            ),
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

export default WidgetsPage;
