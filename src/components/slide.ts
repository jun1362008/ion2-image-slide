import { App, NavOptions, ViewController } from "ionic-angular";

import { Component } from '@angular/core';
import { SlideCmp } from "./slide-component";
import { SlideOptions } from "./slide-options";

export class Slide extends ViewController {
  private _app: App;

  constructor(app: App, component: any, data: any = {}, opts: SlideOptions = {}) {
    data.component = component;
    data.opts = opts;

    super(SlideCmp, data, null);
    this.isOverlay = true;
    this._app = app;
  }

  getTransitionName(direction: string) {
    return 'slide-' + (direction === 'back' ? 'out' : 'in');
  }

  present(navOptions: NavOptions) {
    return this._app.present(this, navOptions);
  }
}
