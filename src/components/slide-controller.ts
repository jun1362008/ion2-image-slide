import { App, Config } from 'ionic-angular';
import { SlideIn, SlideOut } from './slide-transitions';

import { Injectable } from '@angular/core';
import { Slide } from './slide';
import { SlideOptions } from './slide-options';

@Injectable()
export class SlideController {
  constructor(private _app: App, private config: Config) {
    this.config.setTransition('slide-in', SlideIn);
    this.config.setTransition('slide-out', SlideOut);
  }

  create(data = {}, opts: SlideOptions = {}): Slide {
    return new Slide(this._app, data, opts);
  }
}
