import HomePage from './pages/home.f7.html';
// import AboutPage from './pages/about.f7.html';
import GameSettingPage from './pages/game-setting.f7.html';
import GameJoinPage from './pages/game-join.f7.html';
import GamePageVue from './pages/game.vue.f7.html';

import PanelLeftPage from './pages/panel-left.f7.html';
import PanelRightPage from './pages/panel-right.f7.html';

export default [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage,
  },
  {
    path: '/panel-right/',
    component: PanelRightPage,
  },
  {
    path: '/game-setting',
    component: GameSettingPage,
  },
  {
    path: '/game-join',
    component: GameJoinPage,
  },
  {
    path: '/game',
    component: GamePageVue,
  },
  {
    path: '(.*)',
    component: HomePage,
  },
];
