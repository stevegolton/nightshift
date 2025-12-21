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
