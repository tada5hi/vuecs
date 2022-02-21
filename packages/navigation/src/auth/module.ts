import { ComponentLayoutKey } from './constants';
import { hasOwnProperty } from '../utils';
import { ComponentRestrictionContext } from './type';

export function applyRestrictionForComponents<T extends Record<string, any> = Record<string, any>>(
    components: T[],
    context: ComponentRestrictionContext,
) : T[] {
    context.layoutKey = context.layoutKey || {};

    const childrenKey = context.layoutKey.children ||
        ComponentLayoutKey.CHILDREN;

    const requiredAbilityKey = context.layoutKey.requiredAbilities ||
        ComponentLayoutKey.REQUIRED_ABILITIES;

    const requiredPermissionKey = context.layoutKey.requiredPermissions ||
        ComponentLayoutKey.REQUIRED_PERMISSIONS;

    const requiredLoggedInKey = context.layoutKey.requiredLoggedIn ||
        ComponentLayoutKey.REQUIRED_LOGGED_IN;

    const requiredLoggedOutKey = context.layoutKey.requiredLoggedOut ||
        ComponentLayoutKey.REQUIRED_LOGGED_OUT;

    const result : T[] = [];

    for (let i = 0; i < components.length; i++) {
        if (
            hasOwnProperty(components[i], requiredLoggedInKey) &&
            components[i][requiredLoggedInKey] &&
            !context.module.isLoggedIn()
        ) {
            continue;
        }

        if (
            hasOwnProperty(components[i], requiredLoggedOutKey) &&
            components[i][requiredLoggedOutKey] &&
            context.module.isLoggedIn()
        ) {
            continue;
        }

        let canPass = true;

        const authorizeChecks : string[] = [requiredAbilityKey, requiredPermissionKey];
        for (let j = 0; j < authorizeChecks.length; j++) {
            if (
                hasOwnProperty(components[i], authorizeChecks[j]) &&
                canPass
            ) {
                let checks = components[i][authorizeChecks[j]];
                if (typeof checks === 'function') {
                    if (!checks(context.module)) {
                        canPass = false;
                    }
                } else if (Array.isArray(checks)) {
                    checks = checks.filter((item) => item);

                    if (checks.length > 0) {
                        if (
                            authorizeChecks[j] === requiredAbilityKey &&
                            !checks.some((item: any) => context.module.hasAbility(item))
                        ) {
                            canPass = false;
                        } else if (
                            authorizeChecks[j] === requiredPermissionKey &&
                            !checks.some((item: any) => context.module.hasPermission(item))
                        ) {
                            canPass = false;
                        }
                    }
                }
            }
        }

        if (canPass) {
            if (hasOwnProperty(components[i], childrenKey)) {
                components[i] = {
                    ...components[i],
                    [childrenKey]: applyRestrictionForComponents(components[i][childrenKey], context),
                };
            }

            result.push(components[i]);
        }
    }

    return result;
}
