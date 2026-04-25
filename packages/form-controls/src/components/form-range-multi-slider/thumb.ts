import type { FormRangeSlider } from './module';

export class FormRangeSliderThumb {
    public readonly el: HTMLElement;

    private percent = 0;

    private rafId: number | undefined;

    private dragging = false;

    private readonly parent: FormRangeSlider;

    // Stored bound handlers so removeEventListener actually matches the
    // function reference passed to addEventListener. Using `.bind(this)`
    // inline returns a fresh function each call and the remove silently
    // becomes a no-op.
    private boundMouseDown = this.mouseDownEventHandler.bind(this);

    private boundTouchStart = this.touchStartEventHandler.bind(this);

    constructor(el: HTMLElement | null, parent: FormRangeSlider) {
        if (!el) throw new Error('Thumb was undefined');

        this.parent = parent;
        this.el = el;
    }

    mount() {
        this.el.addEventListener('mousedown', this.boundMouseDown);
        this.el.addEventListener('touchstart', this.boundTouchStart);
    }

    unmount() {
        this.el.removeEventListener('mousedown', this.boundMouseDown);
        this.el.removeEventListener('touchstart', this.boundTouchStart);
        this.stopDrag();
    }

    private update(event: Event) : void {
        event.preventDefault();
        event.stopPropagation();

        this.dragging = true;
        const tick = () => {
            if (!this.dragging) return;
            this.drag();
            this.rafId = globalThis.requestAnimationFrame(tick);
        };
        this.rafId = globalThis.requestAnimationFrame(tick);
    }

    public setPercent(percent: number, update = true) {
        this.percent = percent;
        this.el.style.left = `calc(${percent}% - ${16 / 2}px)`;
        if (!update) return;
        this.parent.change();
    }

    public getPercent(): number {
        return this.percent;
    }

    public stopDrag() {
        this.dragging = false;
        if (typeof this.rafId === 'number') {
            globalThis.cancelAnimationFrame(this.rafId);
            this.rafId = undefined;
        }
    }

    private drag() {
        this.setPercent(this.parent.mousePercent());
    }

    protected mouseDownEventHandler(event: MouseEvent) {
        this.update(event);
    }

    protected touchStartEventHandler(event: TouchEvent) {
        this.update(event);
    }
}
