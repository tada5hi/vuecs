import { ComponentOptionsManager } from './module';
import type { ComponentOptions, ComponentOptionsManagerContext } from './type';

export function createComponentOptionsManager<T extends ComponentOptions>(
    component: ComponentOptionsManagerContext,
) {
    return new ComponentOptionsManager<T>(component);
}
