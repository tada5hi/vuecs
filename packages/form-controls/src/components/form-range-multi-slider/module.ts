import { FormRangeSliderThumb } from './thumb';
import type { FormRangeSliderContext } from './types';

export class FormRangeSlider {
    private el: HTMLElement;

    private trackElement : HTMLElement;

    private diffElement: HTMLElement | null;

    private sliderMin: FormRangeSliderThumb | undefined;

    private sliderMax: FormRangeSliderThumb | undefined;

    private _min: number;

    private _max: number;

    private width: number;

    private x: number;

    private mouseX: number;

    constructor(ctx: FormRangeSliderContext) {
        this._min = ctx.min;
        this._max = ctx.max;
        this.mouseX = 0;
        this.el = ctx.el;

        const track = this.el.querySelector('.track') as HTMLElement;
        track.style.cursor = 'pointer';
        this.trackElement = track;

        const boundingClientRect = this.el.getBoundingClientRect();
        this.width = boundingClientRect.width;
        this.x = boundingClientRect.x;

        this.diffElement = this.el.querySelector('.track-diff');

        this.updateDiff();
    }

    mount() {
        this.trackElement.addEventListener('click', this.clickEventHandler.bind(this));
        this.trackElement.addEventListener('touchend', this.touchendEventHandler.bind(this));

        this.sliderMin = new FormRangeSliderThumb(this.el.querySelector('.lower'), this);
        this.sliderMin.mount();
        this.sliderMin.setPercent(this._min);

        this.sliderMax = new FormRangeSliderThumb(this.el.querySelector('.upper'), this);
        this.sliderMax.mount();
        this.sliderMax.setPercent(this._max);

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', this.mouseMoveEventHandler.bind(this));
            window.addEventListener('mouseup', this.mouseUpEventHandler.bind(this));

            window.addEventListener('touchmove', this.touchMoveEventHandler.bind(this));
            window.addEventListener('touchend', this.touchEndEventHandler.bind(this));
        }
    }

    unmount() {
        this.trackElement.removeEventListener('click', this.clickEventHandler);
        this.trackElement.removeEventListener('touchend', this.touchendEventHandler);

        if (this.sliderMin) {
            this.sliderMin.unmount();
            this.sliderMin = undefined;
        }

        if (this.sliderMax) {
            this.sliderMax.unmount();
            this.sliderMax = undefined;
        }

        if (typeof window !== 'undefined') {
            window.removeEventListener('mousemove', this.mouseMoveEventHandler);
            window.removeEventListener('mouseup', this.mouseUpEventHandler);

            window.removeEventListener('touchmove', this.touchMoveEventHandler);
            window.removeEventListener('touchend', this.touchEndEventHandler);
        }
    }

    public mousePercent(): number {
        const newBoundingClientRect = this.el.getBoundingClientRect();
        this.x = newBoundingClientRect.x;
        this.width = newBoundingClientRect.width;

        const val = ((this.mouseX - this.x) / this.width) * 100;
        if (val < 0) return 0;
        if (val > 100) return 100;
        return val;
    }

    public change(): void {
        if (!this.sliderMin || !this.sliderMax) return;

        const newMin = this.sliderMin.getPercent();
        const newMax = this.sliderMax.getPercent();

        if (newMax - newMin - 1 <= 0) {
            this.sliderMin.setPercent(this._min, false);
            this.sliderMax.setPercent(this._max, false);
            return;
        }

        this._min = newMin;
        this._max = newMax;

        this.updateDiff();

        this.el.dispatchEvent(new CustomEvent('change'));
    }

    get min(): number {
        return this._min;
    }

    set min(value : number) {
        if (!this.sliderMin) return;

        if (value >= this._max) return;
        this._min = value;
        this.sliderMin.setPercent(this._min);
        this.change();
    }

    get max(): number {
        return this._max;
    }

    set max(value : number) {
        if (!this.sliderMax) return;

        if (value <= this._min) return;
        this._max = value;
        this.sliderMax.setPercent(this._max);
        this.change();
    }

    private updateDiff(): void {
        if (!this.diffElement) return;

        this.diffElement.style.left = `${this._min}%`;
        this.diffElement.style.width = `${this._max - this._min}%`;
    }

    private static getTouchPosition(event: TouchEvent) : number {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        event = (typeof event.originalEvent === 'undefined') ? event : event.originalEvent;
        const touch = event.touches[0] || event.changedTouches[0];
        if (!touch) return -1;
        return touch.pageX;
    }

    protected mouseMoveEventHandler(event: MouseEvent) {
        this.mouseX = event.x;
    }

    protected mouseUpEventHandler() {
        if (!this.sliderMin || !this.sliderMax) return;

        this.sliderMin.stopDrag();
        this.sliderMax.stopDrag();
    }

    protected touchMoveEventHandler(event: TouchEvent) {
        this.mouseX = FormRangeSlider.getTouchPosition(event);
    }

    protected touchEndEventHandler() {
        if (!this.sliderMin || !this.sliderMax) return;

        this.sliderMin.stopDrag();
        this.sliderMax.stopDrag();
    }

    protected clickEventHandler(event: MouseEvent) {
        this.handleClick(event.x);
    }

    protected touchendEventHandler(event: TouchEvent) {
        this.handleClick(FormRangeSlider.getTouchPosition(event));
    }

    protected handleClick(position: number) {
        if (!this.sliderMin || !this.sliderMax) {
            return;
        }

        this.mouseX = position;
        const percent = this.mousePercent();
        const thumb = Math.abs(this.sliderMin.getPercent() - percent) <= Math.abs(this.sliderMax.getPercent() - percent) ?
            this.sliderMin :
            this.sliderMax;

        thumb.setPercent(percent);
    }
}
