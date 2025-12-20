var m = require('mithril');

// Import styles
require('./styles/app.css');
require('../blender-ui.css');

// Import state and initialize theme
var state = require('./state');
state.loadTheme();

// Import components
var Layout = require('./components/Layout');

// Import pages
var WidgetsPage = require('./pages/WidgetsPage');
var ProfilerPage = require('./pages/ProfilerPage');
var PluginsPage = require('./pages/PluginsPage');

// Route configuration
m.route(document.getElementById('app'), '/widgets', {
  '/widgets': {
    render: function() {
      return m(Layout, m(WidgetsPage));
    }
  },
  '/profiler': {
    render: function() {
      return m(Layout, m(ProfilerPage));
    }
  },
  '/plugins': {
    render: function() {
      return m(Layout, m(PluginsPage));
    }
  }
});
