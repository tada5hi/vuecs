import { Component } from '../type';
import { ComponentLayoutKey } from './constants';
import { hasOwnProperty } from '../utils';
import { ComponentRestrictionContext } from './type';

export function applyRestrictionForComponents<T extends Component>(
    components: T[],
    context: ComponentRestrictionContext,
) : T[] {
    context.layoutKey = context.layoutKey || {};

    const childrenKey = context.layoutKey.children ||
        ComponentLayoutKey.CHILDREN;

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
            !context.isLoggedIn()
        ) {
            continue;
        }

        if (
            hasOwnProperty(components[i], requiredLoggedOutKey) &&
            components[i][requiredLoggedOutKey] &&
            context.isLoggedIn()
        ) {
            continue;
        }

        let canPass = true;

        if (
            hasOwnProperty(components[i], requiredPermissionKey) &&
            canPass
        ) {
            let checks = components[i][requiredPermissionKey];
            if (typeof checks === 'function') {
                if (!checks(context.hasPermission)) {
                    canPass = false;
                }
            } else if (Array.isArray(checks)) {
                checks = checks.filter((item) => item);

                if (
                    checks.length > 0 &&
                    !checks.some((item: any) => context.hasPermission(item))
                ) {
                    canPass = false;
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
