import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from "ionic-angular";
import { Observable } from 'rxjs';
import { SlideCmp } from './components/slide-component';
import { SlideController } from "./components/slide-controller";

@NgModule({
  declarations: [
    SlideCmp
  ],
  providers: [SlideController],
  exports: [
    SlideCmp
  ],
  imports: [
    BrowserModule,
    IonicModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class SlideModule { }
