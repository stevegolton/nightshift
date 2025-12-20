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
