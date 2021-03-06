import {App, IonicApp} from 'ionic/ionic';

import {ButtonPage} from './pages/button'
import {NavPage} from './pages/nav'
import {PullToRefreshPage} from './pages/pull-to-refresh'
import {ListPage} from './pages/list'
import {ListGroupPage} from './pages/list-group'
import {CardPage} from './pages/card'
import {FormPage} from './pages/form'
import {SegmentPage} from './pages/segment'
import {SearchBarPage} from './pages/searchbar'
import {TableSearchPage} from './pages/table-search'
import {IconsPage} from './pages/ionicons'
import {TabsPage} from './pages/tabs'
import {MenuPage} from './pages/menu'
import {AnimationPage} from './pages/animation'
import {SlidePage} from './pages/slides'
import {ActionSheetPage} from './pages/action-sheet'
import {ModalPage} from './pages/modal'


@App({
  templateUrl: 'main.html',
  routes: [
    {
      path: '/nav',
      component: NavPage,
      root: true
    }, {
      path: '/buttons',
      component: ButtonPage
    }, {
      path: '/lists',
      component: ListPage
    }, {
      path: '/list-groups',
      component: ListGroupPage
    }, {
      path: '/modal',
      component: ModalPage
    }, {
      path: '/ptr',
      component: PullToRefreshPage
    }, {
      path: '/cards',
      component: CardPage
    }, {
      path: '/forms',
      component: FormPage
    }, {
      path: '/segments',
      component: SegmentPage
    }, {
      path: '/table-search',
      component: TableSearchPage
    }, {
      path: '/icons',
      component: IconsPage
    }, {
      path: '/menu',
      component: MenuPage
    }, {
      path: '/animation',
      component: AnimationPage
    }, {
      path: '/slides',
      component: SlidePage
    }, {
      path: '/action-sheet',
      component: ActionSheetPage
    }
  ]
})
class MyApp {
  constructor(app: IonicApp) {
    this.app = app;

    this.components = [
      { title: 'Navigation', component: NavPage },
      { title: 'Tabs', component: TabsPage },
      { title: 'Buttons', component: ButtonPage },
      { title: 'Lists', component: ListPage },
      { title: 'List Groups', component: ListGroupPage },
      { title: 'Modal', component: ModalPage },
      { title: 'Pull to Refresh', component: PullToRefreshPage },
      { title: 'Cards', component: CardPage },
      { title: 'Forms', component: FormPage },
      { title: 'Segments', component: SegmentPage },
      { title: 'Search Bar', component: SearchBarPage },
      { title: 'Table Search', component: TableSearchPage },
      { title: 'Icons', component: IconsPage },
      { title: 'Menu', component: MenuPage },
      { title: 'Animation', component: AnimationPage },
      { title: 'Slides', component: SlidePage},
      { title: 'Action Sheet', component: ActionSheetPage },
    ];
  }

  openPage(menu, component) {
    menu.close();

    let nav = this.app.getComponent('myNav');
    nav.setViews([component.component]);
  }
}
