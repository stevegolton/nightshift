import m from 'mithril';
import cx from 'classnames';
import './ProxmoxPage.css';
import { State } from '../state';
import Button from '../components/Button';
import ButtonGroup from '../components/ButtonGroup';
import ProgressBar from '../components/ProgressBar';
import Badge from '../components/Badge';
import MenuBar from '../components/MenuBar';
import { SplitPanel } from '../components/SplitPanel';

interface VM {
  id: number;
  name: string;
  type: 'vm' | 'lxc';
  status: 'running' | 'stopped' | 'paused';
  cpu: number;
  memory: { used: number; total: number };
  disk: { used: number; total: number };
  uptime?: string;
  ip?: string;
}

// Initialize state
State.proxmox = State.proxmox || {
  selectedNode: 'pve1',
  selectedVM: null as number | null,
  vms: [
    {
      id: 100,
      name: 'ubuntu-server',
      type: 'vm',
      status: 'running',
      cpu: 23,
      memory: { used: 2.1, total: 4 },
      disk: { used: 18, total: 32 },
      uptime: '14d 6h 23m',
      ip: '192.168.1.100',
    },
    {
      id: 101,
      name: 'docker-host',
      type: 'vm',
      status: 'running',
      cpu: 45,
      memory: { used: 6.8, total: 8 },
      disk: { used: 42, total: 64 },
      uptime: '7d 12h 5m',
      ip: '192.168.1.101',
    },
    {
      id: 102,
      name: 'windows-dev',
      type: 'vm',
      status: 'stopped',
      cpu: 0,
      memory: { used: 0, total: 16 },
      disk: { used: 85, total: 128 },
    },
    {
      id: 200,
      name: 'nginx-proxy',
      type: 'lxc',
      status: 'running',
      cpu: 5,
      memory: { used: 0.3, total: 0.5 },
      disk: { used: 1.2, total: 8 },
      uptime: '21d 3h 45m',
      ip: '192.168.1.200',
    },
    {
      id: 201,
      name: 'pihole',
      type: 'lxc',
      status: 'running',
      cpu: 2,
      memory: { used: 0.2, total: 0.5 },
      disk: { used: 0.8, total: 4 },
      uptime: '21d 3h 45m',
      ip: '192.168.1.201',
    },
    {
      id: 202,
      name: 'postgres-db',
      type: 'lxc',
      status: 'paused',
      cpu: 0,
      memory: { used: 1.5, total: 2 },
      disk: { used: 12, total: 32 },
    },
  ] as VM[],
  nodeStats: {
    cpu: 34,
    memory: { used: 24.5, total: 64 },
    rootfs: { used: 120, total: 500 },
    uptime: '45d 12h 34m',
  },
};

const MainSplit = SplitPanel();

function formatBytes(gb: number): string {
  if (gb < 1) return `${(gb * 1024).toFixed(0)} MB`;
  return `${gb.toFixed(1)} GB`;
}

function NodeSummary(): m.Component {
  return {
    view() {
      const stats = State.proxmox.nodeStats;
      return m('.node-summary', [
        m('.summary-header', [
          m('span.node-name', State.proxmox.selectedNode),
          m(Badge, { variant: 'success' }, 'Online'),
        ]),
        m('.summary-stats', [
          m('.stat-item', [
            m('.stat-label', 'CPU Usage'),
            m(ProgressBar, { value: stats.cpu }),
            m('.stat-value', `${stats.cpu}%`),
          ]),
          m('.stat-item', [
            m('.stat-label', 'Memory'),
            m(ProgressBar, {
              value: (stats.memory.used / stats.memory.total) * 100,
            }),
            m(
              '.stat-value',
              `${formatBytes(stats.memory.used)} / ${formatBytes(stats.memory.total)}`
            ),
          ]),
          m('.stat-item', [
            m('.stat-label', 'Root FS'),
            m(ProgressBar, {
              value: (stats.rootfs.used / stats.rootfs.total) * 100,
            }),
            m(
              '.stat-value',
              `${formatBytes(stats.rootfs.used)} / ${formatBytes(stats.rootfs.total)}`
            ),
          ]),
          m('.stat-item.text-only', [m('.stat-label', 'Uptime'), m('.stat-value', stats.uptime)]),
        ]),
      ]);
    },
  };
}

function VMList(): m.Component {
  return {
    view() {
      const vms = State.proxmox.vms;
      const runningVMs = vms.filter((vm: VM) => vm.type === 'vm');
      const containers = vms.filter((vm: VM) => vm.type === 'lxc');

      return m('.vm-list', [
        m('.vm-group', [
          m('.vm-group-header', [
            m('span.material-icons', 'computer'),
            m('span', 'Virtual Machines'),
          ]),
          ...runningVMs.map((vm: VM) => m(VMListItem, { vm })),
        ]),
        m('.vm-group', [
          m('.vm-group-header', [
            m('span.material-icons', 'inventory_2'),
            m('span', 'LXC Containers'),
          ]),
          ...containers.map((vm: VM) => m(VMListItem, { vm })),
        ]),
      ]);
    },
  };
}

const VMListItem: m.Component<{ vm: VM }> = {
  view(vnode) {
    const vm = vnode.attrs.vm;
    const isSelected = State.proxmox.selectedVM === vm.id;
    const statusIcon =
      vm.status === 'running'
        ? 'play_circle'
        : vm.status === 'paused'
          ? 'pause_circle'
          : 'stop_circle';
    const statusClass = vm.status;

    return m(
      '.vm-list-item',
      {
        class: cx({ selected: isSelected }),
        onclick: () => (State.proxmox.selectedVM = vm.id),
      },
      [
        m('span.vm-status-icon.material-icons', { class: statusClass }, statusIcon),
        m('.vm-info', [m('.vm-name', vm.name), m('.vm-id', `${vm.type.toUpperCase()} ${vm.id}`)]),
        vm.status === 'running' && m('.vm-cpu', `${vm.cpu}%`),
      ]
    );
  },
};

function VMDetails(): m.Component {
  return {
    view() {
      const selectedId = State.proxmox.selectedVM;
      const vm = State.proxmox.vms.find((v: VM) => v.id === selectedId);

      if (!vm) {
        return m('.vm-details.empty', [
          m('span.material-icons', 'touch_app'),
          m('p', 'Select a VM or container'),
        ]);
      }

      return m('.vm-details', [
        m('.details-header', [
          m('.details-title', [
            m('span.material-icons', vm.type === 'vm' ? 'computer' : 'inventory_2'),
            m('span', vm.name),
            m(
              Badge,
              {
                variant:
                  vm.status === 'running'
                    ? 'success'
                    : vm.status === 'paused'
                      ? 'warning'
                      : undefined,
              },
              vm.status
            ),
          ]),
          m('.details-actions', [
            m(ButtonGroup, [
              vm.status !== 'running' &&
                m(Button, { icon: 'play_arrow', variant: 'primary', tooltip: 'Start' }),
              vm.status === 'running' && m(Button, { icon: 'pause', tooltip: 'Pause' }),
              vm.status !== 'stopped' && m(Button, { icon: 'stop', tooltip: 'Stop' }),
              m(Button, { icon: 'restart_alt', tooltip: 'Restart' }),
            ]),
            m(ButtonGroup, [
              m(Button, { icon: 'terminal', tooltip: 'Console' }),
              m(Button, { icon: 'settings', tooltip: 'Settings' }),
            ]),
          ]),
        ]),
        m('.details-content', [
          m('.details-section', [
            m('.section-title', 'Status'),
            m('.details-grid', [
              vm.status === 'running' && [
                m('.detail-item', [m('.detail-label', 'Uptime'), m('.detail-value', vm.uptime)]),
                m('.detail-item', [m('.detail-label', 'IP Address'), m('.detail-value', vm.ip)]),
              ],
              m('.detail-item', [
                m('.detail-label', 'Type'),
                m('.detail-value', vm.type === 'vm' ? 'Virtual Machine' : 'LXC Container'),
              ]),
              m('.detail-item', [m('.detail-label', 'ID'), m('.detail-value', vm.id)]),
            ]),
          ]),
          m('.details-section', [
            m('.section-title', 'Resources'),
            m('.resource-bars', [
              m('.resource-item', [
                m('.resource-header', [m('span', 'CPU'), m('span', `${vm.cpu}%`)]),
                m(ProgressBar, { value: vm.cpu }),
              ]),
              m('.resource-item', [
                m('.resource-header', [
                  m('span', 'Memory'),
                  m('span', `${formatBytes(vm.memory.used)} / ${formatBytes(vm.memory.total)}`),
                ]),
                m(ProgressBar, {
                  value: (vm.memory.used / vm.memory.total) * 100,
                  variant: vm.memory.used / vm.memory.total > 0.9 ? 'warning' : undefined,
                }),
              ]),
              m('.resource-item', [
                m('.resource-header', [
                  m('span', 'Disk'),
                  m('span', `${formatBytes(vm.disk.used)} / ${formatBytes(vm.disk.total)}`),
                ]),
                m(ProgressBar, {
                  value: (vm.disk.used / vm.disk.total) * 100,
                  variant: vm.disk.used / vm.disk.total > 0.9 ? 'error' : undefined,
                }),
              ]),
            ]),
          ]),
          vm.type === 'vm' &&
            m('.details-section', [
              m('.section-title', 'Hardware'),
              m('.details-grid', [
                m('.detail-item', [m('.detail-label', 'Sockets'), m('.detail-value', '1')]),
                m('.detail-item', [m('.detail-label', 'Cores'), m('.detail-value', '4')]),
                m('.detail-item', [m('.detail-label', 'BIOS'), m('.detail-value', 'SeaBIOS')]),
                m('.detail-item', [m('.detail-label', 'Machine'), m('.detail-value', 'q35')]),
              ]),
            ]),
          m('.details-section', [
            m('.section-title', 'Network'),
            m('.details-grid', [
              m('.detail-item', [m('.detail-label', 'Bridge'), m('.detail-value', 'vmbr0')]),
              m('.detail-item', [m('.detail-label', 'Model'), m('.detail-value', 'VirtIO')]),
              m('.detail-item', [m('.detail-label', 'Firewall'), m('.detail-value', 'Yes')]),
            ]),
          ]),
        ]),
      ]);
    },
  };
}

const ProxmoxPage: m.Component = {
  view() {
    return m('.page-proxmox', [
      m(MenuBar, [
        m(Button, { variant: 'ghost' }, 'Datacenter'),
        m(Button, { variant: 'ghost' }, 'Create VM'),
        m(Button, { variant: 'ghost' }, 'Create CT'),
        m(Button, { variant: 'ghost' }, 'Backup'),
      ]),

      m('.proxmox-main', [
        m(MainSplit, {
          direction: 'horizontal',
          initialSplit: 25,
          minSize: 200,
          firstPanel: m('.sidebar-panel', [m(NodeSummary()), m(VMList())]),
          secondPanel: m(VMDetails()),
        }),
      ]),

      m('footer.bl-statusbar', [
        m('span.bl-statusbar-item', `Node: ${State.proxmox.selectedNode}`),
        m(
          'span.bl-statusbar-item',
          `VMs: ${State.proxmox.vms.filter((v: VM) => v.status === 'running').length}/${State.proxmox.vms.length} running`
        ),
        m(
          'span.bl-statusbar-item',
          { style: { marginLeft: 'auto', borderRight: 'none' } },
          'Proxmox Dashboard v1.0'
        ),
      ]),
    ]);
  },
};

export default ProxmoxPage;
