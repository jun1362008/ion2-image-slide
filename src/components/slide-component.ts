import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, Component, ComponentFactoryResolver, EventEmitter, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { BLOCK_ALL, GestureController, NavParams, Platform, Slides, ViewController } from 'ionic-angular';

@Component({
  selector: 'slide-cmp',
  template: `
    <ion-backdrop></ion-backdrop>
    <div class="slide-wrapper">
      <div class="slidewrap">
        <ion-slides class="slide-content-wrap" pager="true">
          <ion-slide *ngFor="let slide of imgSlides" [ngClass]="{'swiper-no-swiping': isWatchDetail}">
            <img #img style="display:block" [src]="slide.url" (click)="doClick($event)" (pan)='panmove($event)' (panend)='panleft($event)'
              (dblclick)="doDoubleClick()">
          </ion-slide>
        </ion-slides>
      </div>
    </div>
  `,
  styles: [`
    .slide-wrapper,
    .slide-content,
    .slidewrap {
      height: 100%;
      width: 100%;
    }
    
    .slide-wrapper {
      position: absolute;
      z-index: 10;
    }
    
    slide-content.slidewrap {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0px;
    }
    
    slide-cmp {
        position: absolute;
        width: 100%;
        height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideCmp implements AfterViewInit, AfterContentInit {
  @ViewChild('viewport', { read: ViewContainerRef }) _viewport: ViewContainerRef;

  d: {
    cssClass?: string;
    showBackdrop?: boolean;
    enableBackdropDismiss?: boolean;
  };

  _enabled: boolean;

  id: number;

  imgSlides: Array<any>;
  changeCB: Function;
  cancelCB: Function;
  slideWrap: any;
  temp: any;
  tempTime: any;
  timeout: any;
  isWatchDetail: boolean = false;
  initalX: number = 0;
  initalY: number = 0;
  gestureBlocker: any;
  canBack: boolean = false;

  @Output() testClick: EventEmitter<any> = new EventEmitter();

  @ViewChild(Slides) slides: Slides;
  @ViewChild('img') img: any;

  constructor(
    public _cfr: ComponentFactoryResolver,
    public viewCtrl: ViewController,
    gestureCtrl: GestureController,
    private navParams: NavParams,
    private plt: Platform,
  ) {
    this.d = navParams.data.opts;
    this.imgSlides = this.navParams.data.component.list;
    this.gestureBlocker = gestureCtrl.createBlocker(BLOCK_ALL);
    this.viewCtrl.didEnter.subscribe(this.onDidEnter.bind(this));

  }

  doClick(ev: any) {
    clearTimeout(this.timeout);
    if (!this.temp) {
      this.temp = new Date();
    } else {
      this.tempTime = this.temp;
      this.temp = new Date();
    }

    // 单击事件倒计时
    this.timeout = setTimeout(() => {
      this.slideDown(ev);
    }, 400);

    // 两次点击时间差
    let clickBuffer = this.temp - this.tempTime;
    // 如果双击 立即执行双击函数 并且清除单击事件倒计时
    if (clickBuffer && clickBuffer < 400) {
      this.doDoubleClick(ev);
      clearTimeout(this.timeout);
    }
  }

  doDoubleClick(ev: any) {
    let imgScale = ev.target;
    let imgWrap = imgScale.parentElement.parentElement;
    imgScale.style.transition = 'transform 0.33s';
    if (!this.isWatchDetail) {
      imgScale.style.transform = 'scale(2)';
    } else {
      imgScale.style.transform = 'scale(1)';
      imgWrap.style.transform = 'translate(0,0)';
      this.initalX = 0;
      this.initalY = 0;
    }
    this.isWatchDetail = !this.isWatchDetail;
  }

  slideDown(ev: any) {
    let imgScale = ev.target;
    let imgWrap = imgScale.parentElement.parentElement;
    this.changeCB(this.slides._activeIndex);
    imgScale.style.transform = 'scale(1)';
    imgWrap.style.transform = 'translate(0,0)';

    this.viewCtrl.dismiss();
  }

  panmove(ev: any) {
    let imgWrap = ev.target.parentElement.parentElement;

    let evX = ev.deltaX;
    let evY = ev.deltaY;
    if (this.isWatchDetail) {
      imgWrap.style.transform = 'translate(' + (evX + this.initalX) + 'px,' + (evY + this.initalY) + 'px)';
      imgWrap.style.transition = 'transform 0s';
    }
  }

  panleft(ev: any) {
    // 图片放大后宽高
    let _imgWidth = ev.target.getBoundingClientRect().width;
    let _imgHeight = ev.target.getBoundingClientRect().height;
    // 屏幕宽高
    let _width = this.plt.width();
    let _height = this.plt.height();
    // 临界值
    let _criticalWidth = (_imgWidth - _width) / 2;
    let _criticalHeight = (_imgHeight - _height) / 2;

    let imgWrap = ev.target.parentElement.parentElement;

    if (this.isWatchDetail) {
      // 下次移动时赋予初始值
      this.initalX += ev.deltaX;
      this.initalY += ev.deltaY;

      // 超出临界值后返回
      if (this.initalX > _criticalWidth) {
        imgWrap.style.transform = 'translate(' + _criticalWidth + 'px,' + this.initalY + 'px)';
        imgWrap.style.transition = 'transform .33s';
        this.initalX = _criticalWidth;
      }
      if (this.initalX < -_criticalWidth) {
        imgWrap.style.transform = 'translate(' + -_criticalWidth + 'px,' + this.initalY + 'px)';
        imgWrap.style.transition = 'transform .33s';
        this.initalX = -_criticalWidth;
      }
      if (this.initalY > _criticalHeight) {
        imgWrap.style.transform = 'translate(' + this.initalX + 'px,' + _criticalHeight + 'px)';
        imgWrap.style.transition = 'transform .33s';
        this.initalY = _criticalHeight;
      }
      if (this.initalY < -_criticalHeight) {
        imgWrap.style.transform = 'translate(' + this.initalX + 'px,' + -_criticalHeight + 'px)';
        imgWrap.style.transition = 'transform .33s';
        this.initalY = -_criticalHeight;
      }
    }
  }

  ngAfterViewInit() {
    if (this.navParams.data) {
      this.changeCB = this.navParams.data.component.change;
    }
    this.slides['_initSlides']();

    this.slides.slideTo(this.navParams.data.component.index, 0);
    // this.ref.markForCheck();
    console.log('ngAfterViewInit')
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit')
  }
  onDidEnter() {
    console.log('ondidenter')

  }

}
