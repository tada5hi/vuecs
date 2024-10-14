import { injectManager } from './singleton';

import type { NavigationBuildContext } from './type';

export async function buildNavigation(
    context: NavigationBuildContext = {},
): Promise<void> {
    const manager = injectManager();

    await manager.build(context);
}
