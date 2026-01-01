// Global application state
// Note: Page-specific state should be defined at the module level in each page file
// (see SchedulesPage.ts, WidgetsPage.ts for examples)
export interface AppState {
  navCollapsed: boolean;
  // Legacy page state slots - these pages should be refactored to use local state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  drone: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  servers: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  heating: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  finances: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profiler: any;
}

export const State: AppState = {
  navCollapsed: false,
  drone: null,
  servers: null,
  heating: null,
  finances: null,
  profiler: null,
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
