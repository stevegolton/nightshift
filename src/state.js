// Application state
var State = {
  navCollapsed: false,
  activeTab: 'Scene',
  activePrimaryTab: 'Selection',
  activeSecondaryTab: 'Summary',
  detailsPanelHeight: 200,
  collapsedTrackGroups: {},
  collapsedTracks: {}
};

// Theme management
function loadTheme() {
  var savedTheme = localStorage.getItem('bl-theme');
  if (savedTheme === 'light') {
    document.body.classList.add('bl-theme-light');
  }
}

function toggleTheme() {
  document.body.classList.toggle('bl-theme-light');
  var isLight = document.body.classList.contains('bl-theme-light');
  localStorage.setItem('bl-theme', isLight ? 'light' : 'dark');
}

module.exports = {
  State: State,
  loadTheme: loadTheme,
  toggleTheme: toggleTheme
};
