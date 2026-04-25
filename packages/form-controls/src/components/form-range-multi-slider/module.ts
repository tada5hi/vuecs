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

    // Stored bound handlers so addEventListener and removeEventListener
    // receive the same function reference. Without this, .bind() returns a
    // fresh function each call and removeEventListener becomes a no-op,
    // leaking listeners on unmount.
    private boundClick = this.clickEventHandler.bind(this);

    private boundTouchend = this.touchendEventHandler.bind(this);

    private boundMouseMove = this.mouseMoveEventHandler.bind(this);

    private boundMouseUp = this.mouseUpEventHandler.bind(this);

    private boundTouchMove = this.touchMoveEventHandler.bind(this);

    private boundTouchEnd = this.touchEndEventHandler.bind(this);

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
        this.trackElement.addEventListener('click', this.boundClick);
        this.trackElement.addEventListener('touchend', this.boundTouchend);

        this.sliderMin = new FormRangeSliderThumb(this.el.querySelector('.lower'), this);
        this.sliderMin.mount();
        this.sliderMin.setPercent(this._min);

        this.sliderMax = new FormRangeSliderThumb(this.el.querySelector('.upper'), this);
        this.sliderMax.mount();
        this.sliderMax.setPercent(this._max);

        if (typeof window !== 'undefined') {
            window.addEventListener('mousemove', this.boundMouseMove);
            window.addEventListener('mouseup', this.boundMouseUp);

            window.addEventListener('touchmove', this.boundTouchMove);
            window.addEventListener('touchend', this.boundTouchEnd);
        }
    }

    unmount() {
        this.trackElement.removeEventListener('click', this.boundClick);
        this.trackElement.removeEventListener('touchend', this.boundTouchend);

        if (this.sliderMin) {
            this.sliderMin.unmount();
            this.sliderMin = undefined;
        }

        if (this.sliderMax) {
            this.sliderMax.unmount();
            this.sliderMax = undefined;
        }

        if (typeof window !== 'undefined') {
            window.removeEventListener('mousemove', this.boundMouseMove);
            window.removeEventListener('mouseup', this.boundMouseUp);

            window.removeEventListener('touchmove', this.boundTouchMove);
            window.removeEventListener('touchend', this.boundTouchEnd);
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

        // Snap thumb positions to integer percentages. Floor the lower thumb,
        // ceil the upper — gives a slightly conservative (inclusive) range so
        // consumers filtering with `>= min && <= max` cover the full visual
        // span of the thumbs without sub-percent jitter on every emit.
        let newMin = Math.floor(this.sliderMin.getPercent());
        let newMax = Math.ceil(this.sliderMax.getPercent());

        // Maintain at least 1% gap between thumbs. Identify which thumb
        // moved (its raw percent diverged from the stored snapped value)
        // and clamp ONLY that thumb to the boundary — reverting the other
        // produces a jarring snap-back of an untouched thumb.
        if (newMax - newMin <= 1) {
            const minMoved = newMin !== this._min;
            const maxMoved = newMax !== this._max;
            if (maxMoved && !minMoved) {
                newMax = this._min + 1;
            } else if (minMoved && !maxMoved) {
                newMin = this._max - 1;
            } else {
                // Both diverged (e.g. programmatic set or rare race) — fall
                // back to the previous valid state on both.
                newMin = this._min;
                newMax = this._max;
            }
        }

        // No-op guard: only fire `change` when the snapped values actually
        // differ from the stored state. Otherwise the 500 Hz drag tick
        // produces hundreds of redundant identical-payload emits per second.
        if (newMin === this._min && newMax === this._max) {
            // Still align the thumb visual to the snapped value in case a
            // float drift left it off by a fraction of a percent.
            this.sliderMin.setPercent(this._min, false);
            this.sliderMax.setPercent(this._max, false);
            return;
        }

        this._min = newMin;
        this._max = newMax;

        // Keep the thumb visuals in sync with the snapped values; otherwise
        // the thumb sits at a fractional percent while the emitted value is
        // already rounded, producing a sub-pixel drift between the thumb
        // center and the underlying value.
        this.sliderMin.setPercent(newMin, false);
        this.sliderMax.setPercent(newMax, false);

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
