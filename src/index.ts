import m from 'mithril';

// Import styles
import '../nightshift.css';

// Import state and initialize theme
import { loadTheme } from './state';
loadTheme();

// Import components
import Layout from './components/Layout';

// Import pages
import ComponentsPage from './pages/ComponentsPage';
import ProfilerPage from './pages/ProfilerPage';
import PluginsPage from './pages/PluginsPage';
import HeatingPage from './pages/HeatingPage';
import SchedulesPage from './pages/SchedulesPage';
import DronePage from './pages/DronePage';
import ServersPage from './pages/ServersPage';
import FinancesPage from './pages/FinancesPage';

// Route configuration
m.route.prefix = '#';

const root = document.getElementById('app');
if (root) {
  m.route(root, '/components', {
    '/components': {
      render: () => m(Layout, m(ComponentsPage)),
    },
    '/profiler': {
      render: () => m(Layout, m(ProfilerPage)),
    },
    '/plugins': {
      render: () => m(Layout, m(PluginsPage)),
    },
    '/heating': {
      render: () => m(Layout, m(HeatingPage)),
    },
    '/schedules': {
      render: () => m(Layout, m(SchedulesPage)),
    },
    '/drone': {
      render: () => m(Layout, m(DronePage)),
    },
    '/servers': {
      render: () => m(Layout, m(ServersPage)),
    },
    '/finances': {
      render: () => m(Layout, m(FinancesPage)),
    },
  });
}
