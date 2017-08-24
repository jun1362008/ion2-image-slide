import { Animation, PageTransition } from 'ionic-angular';
export class SlideTransition extends PageTransition {
  slidePositionView(nativeEle: HTMLElement, ev: any) {

  }
}

export class SlideIn extends SlideTransition {
  init() {
    console.log('slide in', this.opts)
    let targetDim = this.opts.ev.data && this.opts.ev.data.target && this.opts.ev.data.target.getBoundingClientRect();

    let ele = this.enteringView.pageRef().nativeElement;

    let slideZoom = new Animation(this.plt, ele.querySelector('.slide-content-wrap'));
    let slideWrap = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    slideZoom.fromTo('transform', 'translateY(' + (targetDim.top - ele.querySelector('.slide-zoom').offsetTop) + 'px)', 'translateY(0)');
    slideWrap.fromTo('opacity', '0', '1');

    this
      .duration(333)
      .add(slideZoom)
      .add(slideWrap);
  }

  play() {
    this.plt.raf(() => {
      this.slidePositionView(this.enteringView.pageRef().nativeElement, this.opts.ev);
      super.play();
    });
  }
}

export class SlideOut extends SlideTransition {
  init() {
    let targetDim = this.opts.ev.data && this.opts.ev.data.target && this.opts.ev.data.target.getBoundingClientRect();

    let ele = this.leavingView.pageRef().nativeElement;

    let slideZoom = new Animation(this.plt, ele.querySelector('.slide-content-wrap'));
    let slideWrap = new Animation(this.plt, ele.querySelector('ion-backdrop'));
    slideZoom.fromTo('transform', 'translateY(0)', 'translateY(' + (targetDim.top - ele.querySelector('.slide-zoom').offsetTop) + 'px)');
    slideWrap.fromTo('opacity', '1', '0');

    this
      .duration(333)
      .add(slideZoom)
      .add(slideWrap);
  }
}
