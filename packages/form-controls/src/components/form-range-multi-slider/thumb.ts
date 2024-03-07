import type { FormRangeSlider } from './module';

export class FormRangeSliderThumb {
    public readonly el: HTMLElement;

    private percent = 0;

    private interval : ReturnType<typeof setInterval> | undefined;

    private readonly parent: FormRangeSlider;

    constructor(el: HTMLElement | null, parent: FormRangeSlider) {
        if (!el) throw new Error('Thumb was undefined');

        this.parent = parent;
        this.el = el;
    }

    mount() {
        this.el.addEventListener('mousedown', this.mouseDownEventHandler.bind(this));
        this.el.addEventListener('touchstart', this.touchStartEventHandler.bind(this));
    }

    unmount() {
        this.el.removeEventListener('mousedown', this.mouseDownEventHandler.bind(this));
        this.el.removeEventListener('touchstart', this.touchStartEventHandler.bind(this));
    }

    private update(event: Event) : void {
        event.preventDefault();
        event.stopPropagation();

        this.interval = setInterval(() => {
            this.drag();
        }, 2);
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
        if (!this.interval) return;

        clearInterval(this.interval);
        this.interval = undefined;
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
