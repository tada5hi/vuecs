import { Store } from '../store';

export class StoreManager {
    protected instances : Record<string, Store>;

    constructor() {
        this.instances = {};
    }

    keys() {
        return Object.keys(this.instances);
    }

    use(key: string) : Store {
        if (typeof this.instances[key] !== 'undefined') {
            return this.instances[key];
        }

        this.instances[key] = new Store();

        return this.instances[key];
    }
}
