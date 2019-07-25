// Import F7
import Framework7 from 'framework7/framework7.esm.bundle.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import './css/icons.css';
import './css/app.css';
import './stylus/app.styl';

// Import Routes
import routes from './routes.js';

// Init Framework7
const app = new Framework7({
  root: '#app',
  id: 'snow.werewolf.f7', // App bundle ID
  name: 'Werewolf f7', // App name
  theme: 'auto', // Automatic theme detection
  // App routes
  routes: routes,
  view: {
    pushState: true,
  },
});

window.app = app;
