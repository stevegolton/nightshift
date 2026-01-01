import m from 'mithril';
import './HeatingPage.css';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import Tag from '../components/Tag';
import { SegmentedButtonGroup, SegmentedButton } from '../components/SegmentedButton';
import Checkbox from '../components/Checkbox';

interface Zone {
  id: string;
  name: string;
  currentTemp: number;
  targetTemp: number;
  humidity: number;
  mode: 'schedule' | 'manual' | 'off';
}

function isZoneHeating(zone: Zone): boolean {
  return zone.mode !== 'off' && zone.currentTemp < zone.targetTemp;
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
      mode: 'manual',
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom',
      currentTemp: 19.2,
      targetTemp: 19,
      humidity: 52,
      mode: 'schedule',
    },
    {
      id: 'kitchen',
      name: 'Kitchen',
      currentTemp: 20.8,
      targetTemp: 21,
      humidity: 48,
      mode: 'manual',
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      currentTemp: 23.1,
      targetTemp: 24,
      humidity: 65,
      mode: 'manual',
    },
    {
      id: 'office',
      name: 'Home Office',
      currentTemp: 20.0,
      targetTemp: 21,
      humidity: 42,
      mode: 'off',
    },
    {
      id: 'guest',
      name: 'Guest Room',
      currentTemp: 18.5,
      targetTemp: 18,
      humidity: 50,
      mode: 'off',
    },
  ],
  systemMode: 'home',
  boilerStatus: 'heating',
};

function getStatusTag(zone: Zone): m.Vnode {
  if (zone.mode === 'off') {
    return m(Tag, 'Off');
  }
  if (isZoneHeating(zone)) {
    return m(Tag, { variant: 'success' }, 'Heating');
  }
  return m(Tag, 'At Target');
}

function ZoneCard(zone: Zone): m.Vnode {
  return m('.zone-card', { class: isZoneHeating(zone) ? 'active' : '' }, [
    m('.zone-header', [m('.zone-name', zone.name), getStatusTag(zone)]),
    m('.zone-body', [
      m('.zone-current', [
        m('.zone-current-label', 'Current'),
        m('.zone-current-temp', [
          m('.zone-current-value', zone.currentTemp.toFixed(1)),
          m('.zone-current-unit', '°C'),
        ]),
      ]),
      m('.zone-target', [
        m('.zone-target-label', 'Target'),
        m('.zone-target-value', `${zone.targetTemp.toFixed(1)}°C`),
      ]),
      m(ButtonGroup, { vertical: true }, [
        m(Button, {
          icon: 'add',
          onclick: () => {
            zone.targetTemp = Math.min(28, zone.targetTemp + 0.5);
          },
        }),
        m(Button, {
          icon: 'remove',
          onclick: () => {
            zone.targetTemp = Math.max(15, zone.targetTemp - 0.5);
          },
        }),
      ]),
    ]),
    m('.zone-meta', [
      m('.zone-meta-item', [m('span.material-symbols-outlined', 'water_drop'), m('span', `${zone.humidity}%`)]),
    ]),
    m('.zone-mode', [
      m(SegmentedButtonGroup, [
        m(
          SegmentedButton,
          {
            active: zone.mode === 'schedule',
            onclick: () => (zone.mode = 'schedule'),
          },
          'Schedule'
        ),
        m(
          SegmentedButton,
          {
            active: zone.mode === 'manual',
            onclick: () => (zone.mode = 'manual'),
          },
          'Manual'
        ),
        m(
          SegmentedButton,
          {
            active: zone.mode === 'off',
            onclick: () => (zone.mode = 'off'),
          },
          'Off'
        ),
      ]),
    ]),
  ]);
}

const HeatingPage: m.Component = {
  view(): m.Vnode {
    const activeZones = state.zones.filter((z) => isZoneHeating(z)).length;
    const avgTemp = state.zones.reduce((sum, z) => sum + z.currentTemp, 0) / state.zones.length;

    return m('.page-heating', [
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

          m('.sidebar-section.sidebar-nav', [
            m(Button, { variant: 'ghost', active: true }, 'Dashboard'),
            m(Button, { variant: 'ghost', onclick: () => m.route.set('/schedules') }, 'Schedules'),
            m(Button, { variant: 'ghost' }, 'History'),
            m(Button, { variant: 'ghost' }, 'Settings'),
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
