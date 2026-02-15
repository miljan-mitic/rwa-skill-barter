import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[appOverflowTooltip]',
  hostDirectives: [MatTooltip],
})
export class OverflowTooltip implements AfterViewInit, OnDestroy {
  @Input() appOverflowTooltip = '';

  private resizeObserver: ResizeObserver;

  constructor(
    private el: ElementRef,
    private tooltip: MatTooltip,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    const nativeEl = this.el.nativeElement;

    this.tooltip.message = this.appOverflowTooltip;
    this.tooltip.position = 'above';

    const checkOverflow = () => {
      const hasOverflow = nativeEl.scrollWidth > nativeEl.clientWidth;

      this.tooltip.disabled = !hasOverflow;
      this.cdr.detectChanges();
    };

    checkOverflow();

    this.resizeObserver = new ResizeObserver(checkOverflow);
    this.resizeObserver.observe(nativeEl);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
