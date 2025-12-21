import m from 'mithril';
import './HeatingPage.css';
import MenuBar from '../components/MenuBar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Slider from '../components/Slider';
import { SegmentedButtonGroup, SegmentedButton } from '../components/SegmentedButton';
import Checkbox from '../components/Checkbox';

interface Zone {
  id: string;
  name: string;
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  mode: 'heating' | 'cooling' | 'off' | 'auto';
  schedule: string;
  isActive: boolean;
}

interface HeatingState {
  zones: Zone[];
  systemMode: 'home' | 'away' | 'sleep';
  boilerStatus: 'idle' | 'heating' | 'cooling';
}

const state: HeatingState = {
  zones: [
    {
      id: 'living',
      name: 'Living Room',
      currentTemp: 21.5,
      targetTemp: 22,
      humidity: 45,
      mode: 'heating',
      schedule: 'Weekday Schedule',
      isActive: true,
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      currentTemp: 19.2,
      targetTemp: 19,
      humidity: 52,
      mode: 'auto',
      schedule: 'Night Schedule',
      isActive: false,
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      currentTemp: 20.8,
      targetTemp: 21,
      humidity: 48,
      mode: 'heating',
      schedule: 'Weekday Schedule',
      isActive: true,
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      currentTemp: 23.1,
      targetTemp: 24,
      humidity: 65,
      mode: 'heating',
      schedule: 'Morning Boost',
      isActive: true,
    },
    {
      id: 'office',
      name: 'Home Office',
      currentTemp: 20.0,
      targetTemp: 21,
      humidity: 42,
      mode: 'off',
      schedule: 'Work Hours',
      isActive: false,
    },
    {
      id: 'guest',
      name: 'Guest Room',
      currentTemp: 18.5,
      targetTemp: 18,
      humidity: 50,
      mode: 'off',
      schedule: 'Eco Mode',
      isActive: false,
    },
  ],
  systemMode: 'home',
  boilerStatus: 'heating',
};

function getStatusBadge(zone: Zone): m.Vnode {
  if (zone.mode === 'off') {
    return m(Badge, 'Off');
  }
  if (zone.isActive) {
    return m(Badge, { variant: 'success' }, 'Heating');
  }
  if (zone.currentTemp >= zone.targetTemp) {
    return m(Badge, { variant: 'warning' }, 'At Target');
  }
  return m(Badge, 'Idle');
}

function ZoneCard(zone: Zone): m.Vnode {
  return m('.zone-card', { class: zone.isActive ? 'active' : '' }, [
    m('.zone-header', [m('.zone-name', zone.name), getStatusBadge(zone)]),
    m('.zone-temps', [
      m('.zone-current', [
        m('.zone-current-value', zone.currentTemp.toFixed(1)),
        m('.zone-current-unit', '\u00B0C'),
      ]),
      m('.zone-target', [
        m('span.zone-target-label', 'Target'),
        m('span.zone-target-value', `${zone.targetTemp}\u00B0C`),
      ]),
    ]),
    m('.zone-controls', [
      m(Slider, {
        min: 15,
        max: 28,
        value: zone.targetTemp,
        onchange: (val: number) => {
          zone.targetTemp = val;
        },
      }),
    ]),
    m('.zone-footer', [
      m('.zone-humidity', [m('span.material-icons', 'water_drop'), m('span', `${zone.humidity}%`)]),
      m('.zone-schedule', [m('span.material-icons', 'schedule'), m('span', zone.schedule)]),
    ]),
    m('.zone-actions', [
      m(SegmentedButtonGroup, [
        m(
          SegmentedButton,
          {
            active: zone.mode === 'heating',
            onclick: () => (zone.mode = 'heating'),
            title: 'Heating',
          },
          m('span.material-icons', 'whatshot')
        ),
        m(
          SegmentedButton,
          {
            active: zone.mode === 'cooling',
            onclick: () => (zone.mode = 'cooling'),
            title: 'Cooling',
          },
          m('span.material-icons', 'ac_unit')
        ),
        m(
          SegmentedButton,
          {
            active: zone.mode === 'auto',
            onclick: () => (zone.mode = 'auto'),
            title: 'Auto',
          },
          m('span.material-icons', 'autorenew')
        ),
        m(
          SegmentedButton,
          {
            active: zone.mode === 'off',
            onclick: () => (zone.mode = 'off'),
            title: 'Off',
          },
          m('span.material-icons', 'power_settings_new')
        ),
      ]),
    ]),
  ]);
}

const HeatingPage: m.Component = {
  view(): m.Vnode {
    const activeZones = state.zones.filter((z) => z.isActive).length;
    const avgTemp = state.zones.reduce((sum, z) => sum + z.currentTemp, 0) / state.zones.length;

    return m('.page-heating', [
      m(
        MenuBar,
        {
          rightContent: m('.heating-header-right', [
            m(
              Badge,
              { variant: state.boilerStatus === 'heating' ? 'success' : undefined },
              state.boilerStatus === 'heating' ? 'Boiler Active' : 'Boiler Idle'
            ),
            m(Button, { icon: 'settings', variant: 'ghost' }),
          ]),
        },
        [
          m(Button, { variant: 'ghost' }, 'Dashboard'),
          m(Button, { variant: 'ghost' }, 'Schedules'),
          m(Button, { variant: 'ghost' }, 'History'),
          m(Button, { variant: 'ghost' }, 'Settings'),
        ]
      ),

      m('.heating-main', [
        m('.heating-sidebar', [
          m('.sidebar-section', [
            m('.sidebar-title', 'System Mode'),
            m(SegmentedButtonGroup, [
              m(
                SegmentedButton,
                {
                  active: state.systemMode === 'home',
                  onclick: () => (state.systemMode = 'home'),
                },
                'Home'
              ),
              m(
                SegmentedButton,
                {
                  active: state.systemMode === 'away',
                  onclick: () => (state.systemMode = 'away'),
                },
                'Away'
              ),
              m(
                SegmentedButton,
                {
                  active: state.systemMode === 'sleep',
                  onclick: () => (state.systemMode = 'sleep'),
                },
                'Sleep'
              ),
            ]),
          ]),

          m('.sidebar-section', [
            m('.sidebar-title', 'System Overview'),
            m('.sidebar-stats', [
              m('.stat-item', [
                m('.stat-value', `${avgTemp.toFixed(1)}\u00B0C`),
                m('.stat-label', 'Average Temp'),
              ]),
              m('.stat-item', [
                m('.stat-value', `${activeZones}/${state.zones.length}`),
                m('.stat-label', 'Active Zones'),
              ]),
            ]),
          ]),

          m('.sidebar-section', [
            m('.sidebar-title', 'Quick Actions'),
            m('.quick-actions', [
              m(Button, { icon: 'add' }, 'Boost All'),
              m(Button, { icon: 'remove' }, 'Reduce All'),
              m(Button, { icon: 'power_settings_new' }, 'All Off'),
            ]),
          ]),

          m('.sidebar-section', [
            m('.sidebar-title', 'Options'),
            m('.options-list', [
              m(Checkbox, { checked: true }, 'Frost protection'),
              m(Checkbox, { checked: true }, 'Holiday mode'),
              m(Checkbox, { checked: false }, 'Eco mode'),
              m(Checkbox, { checked: true }, 'Smart scheduling'),
            ]),
          ]),
        ]),

        m('.heating-content', [
          m('.zones-header', [
            m('.zones-title', 'Heating Zones'),
            m('.zones-actions', [
              m(Button, { icon: 'add', variant: 'primary' }, 'Add Zone'),
              m(Button, { icon: 'refresh', variant: 'ghost' }),
            ]),
          ]),
          m(
            '.zones-grid',
            state.zones.map((zone) => ZoneCard(zone))
          ),
        ]),
      ]),
    ]);
  },
};

export default HeatingPage;
