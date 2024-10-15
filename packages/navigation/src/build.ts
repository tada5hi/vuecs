import { injectManager } from './singleton';

export async function buildNavigation(path: string): Promise<void> {
    const manager = injectManager();

    await manager.build(path);
}
