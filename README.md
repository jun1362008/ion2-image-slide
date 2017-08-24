# Ionic Slide Zoom

[![](https://img.shields.io/badge/ionic-3.6.0-blue.svg?ionic=3.6.0)](https://github.com/jun1362008/ion-image-slide)
[![](https://img.shields.io/npm/v/@cycle/core.svg)](https://www.npmjs.com/package/ion-image-slide)

Ionic slide with zoom modal

### How To Use:

```bash
$ npm install ion-image-slide --save
```

Then cd into `app.ts`:

```bash
import { SlideModule, SlideCmp }
```

```
@NgModule({
  imports: [
    xxx,
    SlideModule
  ],
  entrycomponents: [
    xxx,
    SlideCmp
  ]
})
```

Cd into your page:
```
  @ViewChild(Slides) slides: Slides;

  imgSlides: Array<any> = [
    {
      url: 'xxx.jpg'
    },
    {
      url: 'xxx.jpg'
    },
    {
      url: 'xxx.jpg'
    },
    {
      url: 'xxx.jpg'
    }
  ];

  constructor(private slideCtrl: SlideController){}

  slideUp(ev: any) {
    let currentIndex = this.slides._activeIndex;
    let slide = this.slideCtrl.create({
      ev: ev,
      list: this.imgSlides,
      index: currentIndex,
      change: this.changeCB.bind(this)
    });
    slide.present({
      ev: {
        data: ev,
        list: this.imgSlides,
        index: currentIndex,
        change: this.changeCB.bind(this)
      }
    });
  }

  changeCB(data: any) {
    this.slides.slideTo(data, 0);
  }
```

And the html template:
```
<div>
  <ion-slides>
    <ion-slide *ngFor="let slide of imgSlides">
      <img [src]="slide.url" (click)="slideUp($event)">
    </ion-slide>
  </ion-slides>
</div>
```

Substitute ios for android if not on a Mac.
