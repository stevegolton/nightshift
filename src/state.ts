import type { IconProp } from './utils/icon';

// Application state
export interface AppState {
  navCollapsed: boolean;
  activeTab: string;
  activePrimaryTab: string;
  activeSecondaryTab: string;
  profilerPrimaryTab: string;
  profilerSecondaryTab: string;
  detailsPanelHeight: number;
  collapsedTrackGroups: Record<string, boolean>;
  collapsedTracks: Record<string, boolean>;
  // Widget demo state
  selectMode: string;
  selectView: string;
  checkOverlays: boolean;
  checkFloor: boolean;
  checkAxes: boolean;
  radioPivot: string;
  slider1: number;
  slider2: number;
  numberX: number;
  numberY: number;
  numberZ: number;
  // Segmented button demo state
  segmentedMode: string;
  segmentedView: string;
  segmentedAlign: string;
  segmentedDisplay: string;
  // Filter chip demo state
  activeFilters: { id: string; label: string; value?: string; variant?: string }[];
  // Reorderable list demo state
  reorderableItems: { id: string; label: string; icon?: IconProp }[];
  // Reorderable tree demo state
  reorderableTree: {
    id: string;
    label: string;
    icon?: IconProp;
    children?: AppState['reorderableTree'];
    expanded?: boolean;
  }[];
  // Page-specific state (initialized by pages)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quad: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  proxmox: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heating: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finances: any;
}

export const State: AppState = {
  navCollapsed: false,
  activeTab: 'scene',
  activePrimaryTab: 'Selection',
  activeSecondaryTab: 'summary',
  profilerPrimaryTab: 'selection',
  profilerSecondaryTab: 'summary',
  detailsPanelHeight: 200,
  collapsedTrackGroups: {},
  collapsedTracks: {},
  // Widget demo state
  selectMode: 'object',
  selectView: 'solid',
  checkOverlays: true,
  checkFloor: true,
  checkAxes: false,
  radioPivot: 'median',
  slider1: 75,
  slider2: 25,
  numberX: 0,
  numberY: 0,
  numberZ: 0,
  // Segmented button demo state
  segmentedMode: 'vertex',
  segmentedView: 'grid',
  segmentedAlign: 'center',
  segmentedDisplay: 'wire',
  // Filter chip demo state
  activeFilters: [
    { id: '1', label: 'Status', value: 'Active', variant: 'success' },
    { id: '2', label: 'Type', value: 'Mesh' },
    { id: '3', label: 'Modified', variant: 'warning' },
  ],
  // Reorderable list demo state
  reorderableItems: [
    { id: '1', label: 'Camera', icon: 'videocam' },
    { id: '2', label: 'Light', icon: 'light_mode' },
    { id: '3', label: 'Cube', icon: 'check_box_outline_blank' },
    { id: '4', label: 'Sphere', icon: 'circle' },
    { id: '5', label: 'Plane', icon: 'square' },
  ],
  // Reorderable tree demo state
  reorderableTree: [
    {
      id: 'scene',
      label: 'Scene',
      icon: 'public',
      children: [
        {
          id: 'camera',
          label: 'Camera',
          icon: 'videocam',
        },
        {
          id: 'lights',
          label: 'Lights',
          icon: 'lightbulb',
          children: [
            { id: 'sun', label: 'Sun', icon: 'light_mode' },
            { id: 'spot', label: 'Spot Light', icon: 'highlight' },
          ],
        },
        {
          id: 'meshes',
          label: 'Meshes',
          icon: 'category',
          children: [
            { id: 'cube', label: 'Cube', icon: 'check_box_outline_blank' },
            { id: 'sphere', label: 'Sphere', icon: 'circle' },
          ],
        },
      ],
    },
  ],
  // Page-specific state
  quad: null,
  proxmox: null,
  heating: null,
  finances: null,
};

// Theme management
export function loadTheme(): void {
  const savedTheme = localStorage.getItem('bl-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('bl-theme-light');
  }
}

export function toggleTheme(): void {
  document.body.classList.toggle('bl-theme-light');
  const isLight = document.body.classList.contains('bl-theme-light');
  localStorage.setItem('bl-theme', isLight ? 'light' : 'dark');
}
