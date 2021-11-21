import {NavigationComponentConfig} from "../type";
import {AuthRestrictionContext} from "./type";

export function applyAuthRestrictionForNavigationComponents(
    components: NavigationComponentConfig[],
    context: AuthRestrictionContext
): NavigationComponentConfig[] {
    if (
        typeof context.auth === 'undefined' &&
        typeof context.loggedIn === 'undefined'
    ) {
        return components;
    }

    return components
        .filter((component: NavigationComponentConfig) => {
            if(typeof context.loggedIn !== 'undefined') {
                if (
                    component.hasOwnProperty(context.layoutKey.requiredLoggedIn) &&
                    component[context.layoutKey.requiredLoggedIn] &&
                    !context.loggedIn
                ) {
                    return false
                }

                if (
                    component.hasOwnProperty(context.layoutKey.requiredLoggedOut) &&
                    component[context.layoutKey.requiredLoggedOut] &&
                    context.loggedIn
                ) {
                    return false
                }
            }

            if(typeof context.auth !== 'undefined') {
                const keys: string[] = [
                    context.layoutKey.requiredPermissions,
                    context.layoutKey.requiredAbilities
                ];

                for (let i = 0; i < keys.length; i++) {
                    if (!component.hasOwnProperty(keys[i])) {
                        continue;
                    }

                    // @ts-ignore
                    const required = component[keys[i]].filter(item => !!item);

                    if (
                        Array.isArray(required) &&
                        required.length > 0
                    ) {

                        if (context.layoutKey.requiredPermissions === keys[i]) {
                            // @ts-ignore
                            return required.some(permission => context.auth.hasPermission(permission));
                        } else {
                            // @ts-ignore
                            return required.some(ability => context.auth.hasAbility(ability));
                        }
                    }

                    if (typeof required === 'function') {
                        return required(context.auth);
                    }
                }
            }

            return true;
        });
}
