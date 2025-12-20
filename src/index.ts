import m from 'mithril';

// Import styles
import '../nightshift.css';

// Import state and initialize theme
import { loadTheme } from './state';
loadTheme();

// Import components
import Layout from './components/Layout';

// Import pages
import WidgetsPage from './pages/WidgetsPage';
import ProfilerPage from './pages/ProfilerPage';
import PluginsPage from './pages/PluginsPage';

// Route configuration
const root = document.getElementById('app');
if (root) {
  m.route(root, '/widgets', {
    '/widgets': {
      render: () => m(Layout, m(WidgetsPage)),
    },
    '/profiler': {
      render: () => m(Layout, m(ProfilerPage)),
    },
    '/plugins': {
      render: () => m(Layout, m(PluginsPage)),
    },
  });
}
