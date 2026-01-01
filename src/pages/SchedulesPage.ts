import m from 'mithril';
import './SchedulesPage.css';
import Button from '../components/Button';
import Input from '../components/Input';
import TimeInput from '../components/TimeInput';
import NumberInput from '../components/NumberInput';
import Select from '../components/Select';
import Tag from '../components/Tag';
import { SegmentedButtonGroup, SegmentedButton } from '../components/SegmentedButton';

interface TimeSlot {
  id: string;
  startTime: string; // "HH:MM" format
  targetTemp: number;
}

interface DailyPattern {
  id: string;
  name: string;
  days: boolean[]; // [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  baseTemp: number;
  timeSlots: TimeSlot[];
}

interface Schedule {
  id: string;
  name: string;
  patterns: DailyPattern[];
}

interface Zone {
  id: string;
  name: string;
  scheduleId: string | null;
}

interface SchedulesState {
  schedules: Schedule[];
  zones: Zone[];
  selectedScheduleId: string | null;
}

const state: SchedulesState = {
  schedules: [
    {
      id: 'normal',
      name: 'Normal Week',
      patterns: [
        {
          id: 'weekday',
          name: 'Weekday',
          days: [false, true, true, true, true, true, false],
          baseTemp: 16,
          timeSlots: [
            { id: '1', startTime: '06:00', targetTemp: 21 },
            { id: '2', startTime: '09:00', targetTemp: 16 },
            { id: '3', startTime: '17:00', targetTemp: 21 },
            { id: '4', startTime: '22:00', targetTemp: 16 },
          ],
        },
        {
          id: 'weekend',
          name: 'Weekend',
          days: [true, false, false, false, false, false, true],
          baseTemp: 18,
          timeSlots: [
            { id: '1', startTime: '08:00', targetTemp: 20 },
            { id: '2', startTime: '23:00', targetTemp: 18 },
          ],
        },
      ],
    },
    {
      id: 'away',
      name: 'Away Mode',
      patterns: [
        {
          id: 'alldays',
          name: 'All Days',
          days: [true, true, true, true, true, true, true],
          baseTemp: 15,
          timeSlots: [],
        },
      ],
    },
  ],
  zones: [
    { id: 'living', name: 'Living Room', scheduleId: 'normal' },
    { id: 'bedroom', name: 'Master Bedroom', scheduleId: 'normal' },
    { id: 'kitchen', name: 'Kitchen', scheduleId: 'normal' },
    { id: 'bathroom', name: 'Bathroom', scheduleId: 'normal' },
    { id: 'office', name: 'Home Office', scheduleId: 'normal' },
    { id: 'guest', name: 'Guest Room', scheduleId: null },
  ],
  selectedScheduleId: 'normal',
};

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function getSelectedSchedule(): Schedule | undefined {
  return state.schedules.find((s) => s.id === state.selectedScheduleId);
}

function getZonesForSchedule(scheduleId: string): Zone[] {
  return state.zones.filter((z) => z.scheduleId === scheduleId);
}

function getUnassignedZones(): Zone[] {
  return state.zones.filter((z) => z.scheduleId === null);
}

function getUnassignedDays(schedule: Schedule, excludePatternId?: string): number[] {
  const assignedDays = new Set<number>();
  for (const pattern of schedule.patterns) {
    if (pattern.id !== excludePatternId) {
      pattern.days.forEach((d, i) => {
        if (d) assignedDays.add(i);
      });
    }
  }
  return [0, 1, 2, 3, 4, 5, 6].filter((i) => !assignedDays.has(i));
}

function ScheduleListItem(schedule: Schedule): m.Vnode {
  const isSelected = state.selectedScheduleId === schedule.id;
  const zoneCount = getZonesForSchedule(schedule.id).length;

  return m(
    '.schedule-list-item',
    {
      class: isSelected ? 'selected' : '',
      onclick: () => {
        state.selectedScheduleId = schedule.id;
      },
    },
    [
      m('.schedule-list-info', [
        m('.schedule-list-name', schedule.name),
        m('.schedule-list-meta', [
          m('span', `${zoneCount} zone${zoneCount !== 1 ? 's' : ''}`),
          m('span', '·'),
          m('span', `${schedule.patterns.length} pattern${schedule.patterns.length !== 1 ? 's' : ''}`),
        ]),
      ]),
          ]
  );
}

function TimeSlotRow(slot: TimeSlot, pattern: DailyPattern): m.Vnode {
  return m('.time-slot-row', [
    m(TimeInput, {
      label: 'From',
      value: slot.startTime,
      onchange: (value) => (slot.startTime = value),
    }),
    m(NumberInput, {
      label: 'Temp',
      value: slot.targetTemp,
      min: 10,
      max: 30,
      step: 0.5,
      unit: '°C',
      onchange: (value: number) => (slot.targetTemp = value),
    }),
    m(Button, {
      icon: 'delete',
      onclick: () => {
        const idx = pattern.timeSlots.indexOf(slot);
        if (idx !== -1) pattern.timeSlots.splice(idx, 1);
      },
    }),
  ]);
}

function PatternCard(pattern: DailyPattern, schedule: Schedule): m.Vnode {
  const unassignedDays = getUnassignedDays(schedule, pattern.id);
  const availableDays = pattern.days.map((d, i) => d || unassignedDays.includes(i));

  return m('.pattern-card', [
    m('.pattern-header', [
      m(Input, {
        value: pattern.name,
        onchange: (value) => (pattern.name = value),
      }),
      m(SegmentedButtonGroup, { className: 'pattern-days' }, [
        availableDays.map((available, i) =>
          m(
            SegmentedButton,
            {
              active: pattern.days[i],
              disabled: !available,
              onclick: () => {
                if (available) pattern.days[i] = !pattern.days[i];
              },
            },
            DAY_LABELS[i]
          )
        ),
      ]),
      schedule.patterns.length > 1 &&
        m(Button, {
          icon: 'delete',
          variant: 'ghost',
          onclick: () => {
            const idx = schedule.patterns.indexOf(pattern);
            if (idx !== -1) {
              schedule.patterns.splice(idx, 1);
            }
          },
        }),
    ]),

    m('.time-slots-list', [
      m('.time-slot-row.time-slot-base', [
        m('.time-slot-from', 'From 00:00'),
        m(NumberInput, {
          label: 'Temp',
          value: pattern.baseTemp,
          min: 10,
          max: 30,
          step: 0.5,
          unit: '°C',
          onchange: (value: number) => (pattern.baseTemp = value),
        }),
      ]),
      ...pattern.timeSlots.map((slot) => TimeSlotRow(slot, pattern)),
      m(
        '.time-slot-add',
        m(Button, {
          icon: 'add',
          variant: 'ghost',
          onclick: () => {
            pattern.timeSlots.push({
              id: String(Date.now()),
              startTime: '12:00',
              targetTemp: 20,
            });
          },
        })
      ),
    ]),
  ]);
}

function ScheduleDetail(schedule: Schedule): m.Vnode {
  const assignedZones = getZonesForSchedule(schedule.id);
  const unassignedZones = getUnassignedZones();

  return m('.schedule-detail', [
    m('.schedule-detail-header', [
      m('.schedule-detail-title', [
        m(Input, {
          value: schedule.name,
          onchange: (value) => (schedule.name = value),
        }),
      ]),
      m('.schedule-detail-actions', [
        m(Button, { icon: 'delete', variant: 'ghost' }),
      ]),
    ]),

    m('.schedule-section', [
      m('.schedule-section-header', [
        m('.schedule-section-title', 'Daily Patterns'),
        m(Button, {
          icon: 'add',
          onclick: () => {
            const unassigned = getUnassignedDays(schedule);
            const newPattern: DailyPattern = {
              id: String(Date.now()),
              name: 'New Pattern',
              days: [0, 1, 2, 3, 4, 5, 6].map((i) => unassigned.includes(i)),
              baseTemp: 18,
              timeSlots: [],
            };
            schedule.patterns.push(newPattern);
          },
        }),
      ]),
      m(
        '.patterns-list',
        schedule.patterns.map((pattern) => PatternCard(pattern, schedule))
      ),
    ]),

    m('.schedule-section', [
      m('.schedule-section-header', [
        m('.schedule-section-title', 'Assigned Zones'),
        unassignedZones.length > 0 &&
          m(Select, {
            placeholder: 'Add zone...',
            options: unassignedZones.map((z) => ({ value: z.id, label: z.name })),
            onchange: (zoneId: string) => {
              if (zoneId) {
                const zone = state.zones.find((z) => z.id === zoneId);
                if (zone) zone.scheduleId = schedule.id;
              }
            },
          }),
      ]),
      m(
        '.zone-chips',
        assignedZones.length === 0
          ? m('.zones-empty', 'No zones assigned')
          : assignedZones.map((zone) =>
              m(
                Tag,
                {
                  removable: true,
                  onremove: () => (zone.scheduleId = null),
                },
                zone.name
              )
            )
      ),
    ]),
  ]);
}

const SchedulesPage: m.Component = {
  view(): m.Vnode {
    const selectedSchedule = getSelectedSchedule();

    return m('.page-schedules', [
      m('.schedules-main', [
        m('.schedules-sidebar', [
          m('.sidebar-header', [
            m('.sidebar-title', 'Schedules'),
            m(Button, {
              icon: 'add',
              onclick: () => {
                const newSchedule: Schedule = {
                  id: String(Date.now()),
                  name: 'New Schedule',
                  patterns: [
                    {
                      id: String(Date.now()) + '-p',
                      name: 'All Days',
                      days: [true, true, true, true, true, true, true],
                      baseTemp: 18,
                      timeSlots: [],
                    },
                  ],
                };
                state.schedules.push(newSchedule);
                state.selectedScheduleId = newSchedule.id;
              },
            }),
          ]),
          m(
            '.schedule-list',
            state.schedules.map((schedule) => ScheduleListItem(schedule))
          ),
          m('.sidebar-nav', [
            m(Button, { variant: 'ghost', onclick: () => m.route.set('/heating') }, 'Dashboard'),
            m(Button, { variant: 'ghost', active: true }, 'Schedules'),
            m(Button, { variant: 'ghost' }, 'History'),
            m(Button, { variant: 'ghost' }, 'Settings'),
          ]),
        ]),

        m(
          '.schedules-content',
          selectedSchedule
            ? ScheduleDetail(selectedSchedule)
            : m('.no-schedule-selected', 'Select a schedule to edit')
        ),
      ]),
    ]);
  },
};

export default SchedulesPage;
