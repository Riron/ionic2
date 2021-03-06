import {NavController, NavParams} from 'ionic/ionic';
import {Page, ViewController} from 'ionic/ionic';
import {forwardRef} from 'angular2/angular2';
import * as helpers from '../helpers';


@Page({
  template: '' +
    '<ion-navbar *navbar hide-back-button class="android-attr">' +
    '<ion-title>Tabs</ion-title>' +
    '</ion-navbar>' +
    '<ion-content>' +
    '</ion-content>',
  directives: [forwardRef(() => helpers.AndroidAttribute)],
})
class TabTextCtrl {
  constructor(nav: NavController, view: ViewController) {
    this.nav = nav;
    this.view = view;
  }
}

@Page({
  template: 
    '<ion-tabs>' +
      '<ion-tab tab-title="Music" [root]="tabOne"></ion-tab>' +
      '<ion-tab tab-title="Movies" [root]="tabTwo"></ion-tab>' +
      '<ion-tab tab-title="Games" [root]="tabThree"></ion-tab>' +
    '</ion-tabs>',
})
export class TabsPage {
  constructor(nav: NavController, params: NavParams) {
    this.nav = nav;
    this.tabOne = TabTextCtrl;
    this.tabTwo = TabTextCtrl;
    this.tabThree = TabTextCtrl;
  }
}
