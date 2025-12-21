import m from 'mithril';
import cx from 'classnames';
import './QuadcopterPage.css';
import { State } from '../state';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import { SegmentedButtonGroup, SegmentedButton } from '../components/SegmentedButton';
import NumberInput from '../components/NumberInput';
import Checkbox from '../components/Checkbox';
import Select from '../components/Select';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import MenuBar from '../components/MenuBar';
import { SplitPanel } from '../components/SplitPanel';

// Initialize state
State.quad = State.quad || {
  armed: false,
  flightMode: 'stabilize',
  batteryVoltage: 14.8,
  batteryCurrent: 12.5,
  batteryPercent: 78,
  altitude: 45.2,
  speed: 8.3,
  heading: 127,
  pitch: 2.5,
  roll: -1.2,
  yaw: 127,
  throttle: 0,
  rssi: 92,
  gpsLat: 37.7749,
  gpsLon: -122.4194,
  gpsSats: 12,
  motors: [65, 68, 62, 70],
  pidRoll: { p: 4.5, i: 0.045, d: 0.02 },
  pidPitch: { p: 4.5, i: 0.045, d: 0.02 },
  pidYaw: { p: 4.0, i: 0.05, d: 0.0 },
  ratesRoll: 360,
  ratesPitch: 360,
  ratesYaw: 180,
};

const MainSplit = SplitPanel();
const LeftSplit = SplitPanel();

function AttitudeIndicator(): m.Component {
  return {
    view() {
      const pitch = State.quad.pitch;
      const roll = State.quad.roll;
      return m('.attitude-indicator', [
        m(
          '.attitude-sphere',
          {
            style: {
              transform: `rotate(${roll}deg) translateY(${pitch * 2}px)`,
            },
          },
          [m('.attitude-horizon'), m('.attitude-pitch-lines')]
        ),
        m('.attitude-overlay', [m('.attitude-center-mark'), m('.attitude-roll-pointer')]),
        m('.attitude-labels', [
          m('span.attitude-value', `P: ${pitch.toFixed(1)}°`),
          m('span.attitude-value', `R: ${roll.toFixed(1)}°`),
        ]),
      ]);
    },
  };
}

function MotorOutputs(): m.Component {
  return {
    view() {
      const motors = State.quad.motors;
      return m('.motor-outputs', [
        m('.motor-diagram', [
          m('.motor-quad', [
            m('.motor-arm.front-left', [
              m('.motor-circle', { class: cx({ spinning: State.quad.armed }) }, [
                m('.motor-value', `${motors[0]}%`),
              ]),
            ]),
            m('.motor-arm.front-right', [
              m('.motor-circle', { class: cx({ spinning: State.quad.armed }) }, [
                m('.motor-value', `${motors[1]}%`),
              ]),
            ]),
            m('.motor-arm.rear-left', [
              m('.motor-circle', { class: cx({ spinning: State.quad.armed }) }, [
                m('.motor-value', `${motors[2]}%`),
              ]),
            ]),
            m('.motor-arm.rear-right', [
              m('.motor-circle', { class: cx({ spinning: State.quad.armed }) }, [
                m('.motor-value', `${motors[3]}%`),
              ]),
            ]),
            m('.motor-body'),
          ]),
        ]),
      ]);
    },
  };
}

function TelemetryPanel(): m.Component {
  return {
    view() {
      return m('.telemetry-panel', [
        m('.telemetry-grid', [
          m('.telemetry-item', [
            m('.telemetry-label', 'Altitude'),
            m('.telemetry-value', `${State.quad.altitude.toFixed(1)} m`),
          ]),
          m('.telemetry-item', [
            m('.telemetry-label', 'Speed'),
            m('.telemetry-value', `${State.quad.speed.toFixed(1)} m/s`),
          ]),
          m('.telemetry-item', [
            m('.telemetry-label', 'Heading'),
            m('.telemetry-value', `${State.quad.heading}°`),
          ]),
          m('.telemetry-item', [
            m('.telemetry-label', 'Throttle'),
            m('.telemetry-value', `${State.quad.throttle}%`),
          ]),
          m('.telemetry-item', [
            m('.telemetry-label', 'GPS'),
            m('.telemetry-value.small', [
              `${State.quad.gpsLat.toFixed(4)}, ${State.quad.gpsLon.toFixed(4)}`,
              m('span.telemetry-sub', ` (${State.quad.gpsSats} sats)`),
            ]),
          ]),
          m('.telemetry-item', [
            m('.telemetry-label', 'RSSI'),
            m('.telemetry-value', [
              `${State.quad.rssi}%`,
              m(
                'span.rssi-bar',
                {
                  style: { width: `${State.quad.rssi}%` },
                  class: cx({
                    low: State.quad.rssi < 30,
                    medium: State.quad.rssi >= 30 && State.quad.rssi < 60,
                  }),
                },
                ''
              ),
            ]),
          ]),
        ]),
      ]);
    },
  };
}

function BatteryStatus(): m.Component {
  return {
    view() {
      const percent = State.quad.batteryPercent;
      const variant = percent < 20 ? 'error' : percent < 40 ? 'warning' : 'success';
      return m('.battery-status', [
        m('.battery-header', [
          m('span.battery-title', 'Battery'),
          m(Badge, { variant }, `${percent}%`),
        ]),
        m(ProgressBar, { value: percent, variant }),
        m('.battery-details', [
          m('span', `${State.quad.batteryVoltage.toFixed(1)}V`),
          m('span', `${State.quad.batteryCurrent.toFixed(1)}A`),
        ]),
      ]);
    },
  };
}

function PIDTuning(): m.Component {
  return {
    view() {
      const axes = [
        { key: 'pidRoll', label: 'Roll' },
        { key: 'pidPitch', label: 'Pitch' },
        { key: 'pidYaw', label: 'Yaw' },
      ] as const;

      return m('.pid-tuning', [
        m('.pid-header', 'PID Tuning'),
        m('.pid-grid', [
          m('.pid-labels', [m('span'), m('span', 'P'), m('span', 'I'), m('span', 'D')]),
          ...axes.map((axis) =>
            m('.pid-row', [
              m('span.pid-axis', axis.label),
              m(NumberInput, {
                label: 'P',
                value: State.quad[axis.key].p,
                precision: 2,
                step: 0.1,
                min: 0,
                max: 20,
                oninput: (v: number) => (State.quad[axis.key].p = v),
              }),
              m(NumberInput, {
                label: 'I',
                value: State.quad[axis.key].i,
                precision: 3,
                step: 0.001,
                min: 0,
                max: 1,
                oninput: (v: number) => (State.quad[axis.key].i = v),
              }),
              m(NumberInput, {
                label: 'D',
                value: State.quad[axis.key].d,
                precision: 3,
                step: 0.001,
                min: 0,
                max: 0.5,
                oninput: (v: number) => (State.quad[axis.key].d = v),
              }),
            ])
          ),
        ]),
      ]);
    },
  };
}

function RatesTuning(): m.Component {
  return {
    view() {
      return m('.rates-tuning', [
        m('.rates-header', 'Rates (°/s)'),
        m('.rates-grid', [
          m('.rates-row', [
            m('span.rates-label', 'Roll'),
            m(NumberInput, {
              label: 'Roll',
              value: State.quad.ratesRoll,
              precision: 0,
              step: 10,
              min: 100,
              max: 800,
              unit: '°/s',
              oninput: (v: number) => (State.quad.ratesRoll = v),
            }),
          ]),
          m('.rates-row', [
            m('span.rates-label', 'Pitch'),
            m(NumberInput, {
              label: 'Pitch',
              value: State.quad.ratesPitch,
              precision: 0,
              step: 10,
              min: 100,
              max: 800,
              unit: '°/s',
              oninput: (v: number) => (State.quad.ratesPitch = v),
            }),
          ]),
          m('.rates-row', [
            m('span.rates-label', 'Yaw'),
            m(NumberInput, {
              label: 'Yaw',
              value: State.quad.ratesYaw,
              precision: 0,
              step: 10,
              min: 50,
              max: 400,
              unit: '°/s',
              oninput: (v: number) => (State.quad.ratesYaw = v),
            }),
          ]),
        ]),
      ]);
    },
  };
}

const QuadcopterPage: m.Component = {
  view() {
    return m('.page-quadcopter', [
      m(MenuBar, [
        m(Button, { variant: 'ghost' }, 'File'),
        m(Button, { variant: 'ghost' }, 'Vehicle'),
        m(Button, { variant: 'ghost' }, 'Tuning'),
        m(Button, { variant: 'ghost' }, 'Logs'),
      ]),

      m('.quad-toolbar', [
        m('.toolbar-left', [
          m(
            Button,
            {
              variant: State.quad.armed ? 'primary' : 'default',
              icon: State.quad.armed ? 'lock_open' : 'lock',
              onclick: () => (State.quad.armed = !State.quad.armed),
            },
            State.quad.armed ? 'ARMED' : 'DISARMED'
          ),
          m(Select, {
            value: State.quad.flightMode,
            options: [
              { value: 'stabilize', label: 'Stabilize' },
              { value: 'acro', label: 'Acro' },
              { value: 'althold', label: 'Alt Hold' },
              { value: 'loiter', label: 'Loiter' },
              { value: 'rtl', label: 'RTL' },
              { value: 'land', label: 'Land' },
            ],
            onchange: (v: string) => (State.quad.flightMode = v),
          }),
        ]),
        m('.toolbar-right', [
          m(ButtonGroup, [
            m(Button, { icon: 'refresh', tooltip: 'Refresh' }),
            m(Button, { icon: 'download', tooltip: 'Download Params' }),
            m(Button, { icon: 'upload', tooltip: 'Upload Params' }),
          ]),
        ]),
      ]),

      m('.quad-main', [
        m(MainSplit, {
          direction: 'horizontal',
          initialSplit: 65,
          firstPanel: m(LeftSplit, {
            direction: 'vertical',
            initialSplit: 55,
            firstPanel: m('.quad-panel.monitor-panel', [
              m('.panel-header', 'Flight Monitor'),
              m('.monitor-content', [
                m('.monitor-left', [m(AttitudeIndicator()), m(MotorOutputs())]),
                m('.monitor-right', [m(BatteryStatus()), m(TelemetryPanel())]),
              ]),
            ]),
            secondPanel: m('.quad-panel.tuning-panel', [
              m('.panel-header', 'Tuning'),
              m('.tuning-content', [m(PIDTuning()), m(RatesTuning())]),
            ]),
          }),
          secondPanel: m('.quad-panel.params-panel', [
            m('.panel-header', 'Parameters'),
            m('.params-content', [
              m('.param-group', [
                m('.param-group-header', 'Arming'),
                m(Checkbox, { checked: true }, 'Require GPS Lock'),
                m(Checkbox, { checked: true }, 'Require Low Throttle'),
                m(Checkbox, { checked: false }, 'Allow Arm Without RC'),
              ]),
              m('.param-group', [
                m('.param-group-header', 'Failsafe'),
                m('.param-row', [
                  m('span', 'RC Loss Action'),
                  m(Select, {
                    value: 'rtl',
                    options: [
                      { value: 'land', label: 'Land' },
                      { value: 'rtl', label: 'Return to Launch' },
                      { value: 'hover', label: 'Hover' },
                    ],
                  }),
                ]),
                m('.param-row', [
                  m('span', 'Low Battery Action'),
                  m(Select, {
                    value: 'rtl',
                    options: [
                      { value: 'warn', label: 'Warning Only' },
                      { value: 'land', label: 'Land' },
                      { value: 'rtl', label: 'Return to Launch' },
                    ],
                  }),
                ]),
              ]),
              m('.param-group', [
                m('.param-group-header', 'Limits'),
                m('.param-row', [
                  m('span', 'Max Altitude'),
                  m(NumberInput, {
                    value: 120,
                    precision: 0,
                    step: 10,
                    min: 10,
                    max: 500,
                    unit: 'm',
                  }),
                ]),
                m('.param-row', [
                  m('span', 'Max Speed'),
                  m(NumberInput, {
                    value: 15,
                    precision: 0,
                    step: 1,
                    min: 1,
                    max: 50,
                    unit: 'm/s',
                  }),
                ]),
                m('.param-row', [
                  m('span', 'Geofence Radius'),
                  m(NumberInput, {
                    value: 200,
                    precision: 0,
                    step: 50,
                    min: 50,
                    max: 2000,
                    unit: 'm',
                  }),
                ]),
              ]),
            ]),
          ]),
        }),
      ]),

      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', [
          'Status: ',
          m(
            'span',
            {
              class: cx({ 'status-armed': State.quad.armed, 'status-disarmed': !State.quad.armed }),
            },
            State.quad.armed ? 'ARMED' : 'DISARMED'
          ),
        ]),
        m('span.bl-statusbar-item', `Mode: ${State.quad.flightMode.toUpperCase()}`),
        m('span.bl-statusbar-item', `Alt: ${State.quad.altitude.toFixed(1)}m`),
        m(
          'span.bl-statusbar-item',
          { style: { marginLeft: 'auto', borderRight: 'none' } },
          'Quadcopter Tuner v1.0'
        ),
      ]),
    ]);
  },
};

export default QuadcopterPage;
