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

// Create SplitPanel instances once to maintain state
const HorizontalSplit = SplitPanel();
const VerticalSplit = SplitPanel();

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
                m(Button, { active: true }, 'Object'),
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
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedView === 'grid',
                    title: 'Grid',
                    onclick: () => (State.segmentedView = 'grid'),
                  },
                  m('span.material-icons', 'grid_view')
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedView === 'list',
                    title: 'List',
                    onclick: () => (State.segmentedView = 'list'),
                  },
                  m('span.material-icons', 'view_list')
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedView === 'details',
                    title: 'Details',
                    onclick: () => (State.segmentedView = 'details'),
                  },
                  m('span.material-icons', 'view_module')
                ),
              ]),
            ]),
            m('.demo-row', [
              m(SegmentedButtonGroup, [
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedAlign === 'left',
                    title: 'Align Left',
                    onclick: () => (State.segmentedAlign = 'left'),
                  },
                  m('span.material-icons', 'format_align_left')
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedAlign === 'center',
                    title: 'Align Center',
                    onclick: () => (State.segmentedAlign = 'center'),
                  },
                  m('span.material-icons', 'format_align_center')
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedAlign === 'right',
                    title: 'Align Right',
                    onclick: () => (State.segmentedAlign = 'right'),
                  },
                  m('span.material-icons', 'format_align_right')
                ),
              ]),
              m(SegmentedButtonGroup, [
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedDisplay === 'solid',
                    onclick: () => (State.segmentedDisplay = 'solid'),
                  },
                  [m('span.material-icons', 'change_history'), 'Solid']
                ),
                m(
                  SegmentedButton,
                  {
                    active: State.segmentedDisplay === 'wire',
                    onclick: () => (State.segmentedDisplay = 'wire'),
                  },
                  [m('span.material-icons', 'change_history_outlined'), 'Wire']
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
              m(ProgressBar, { value: 75, class: 'bl-mb-md' }),
              m(ProgressBar, { value: 45 }),
            ]),
            m('.demo-label.bl-mt-md', 'Progress Bar Variants'),
            m('div', { style: { maxWidth: '400px' } }, [
              m(ProgressBar, { value: 90, variant: 'success', class: 'bl-mb-sm' }),
              m(ProgressBar, { value: 60, variant: 'warning', class: 'bl-mb-sm' }),
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
            m(ObjectTable, {
              columns: [
                { header: 'Name', key: 'name' },
                { header: 'Type', key: 'type' },
                { header: 'Vertices', key: 'vertices' },
                {
                  header: 'Status',
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
                m(HorizontalSplit, {
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
                m(VerticalSplit, {
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
