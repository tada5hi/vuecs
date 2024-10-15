import { injectManager } from './singleton';
import type { NavigationManagerBuildOptions } from './types';

export async function buildNavigation(options: NavigationManagerBuildOptions): Promise<void> {
    const manager = injectManager();

    await manager.build(options);
}
