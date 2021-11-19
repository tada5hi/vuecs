import {LayoutKey} from "../contants";
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
                    component.hasOwnProperty(LayoutKey.REQUIRED_LOGGED_IN) &&
                    component[LayoutKey.REQUIRED_LOGGED_IN] &&
                    !context.loggedIn
                ) {
                    return false
                }

                if (
                    component.hasOwnProperty(LayoutKey.REQUIRED_LOGGED_OUT) &&
                    component[LayoutKey.REQUIRED_LOGGED_OUT] &&
                    context.loggedIn
                ) {
                    return false
                }
            }

            if(typeof context.auth !== 'undefined') {
                const keys: string[] = [
                    LayoutKey.REQUIRED_PERMISSIONS,
                    LayoutKey.REQUIRED_ABILITY
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

                        if (LayoutKey.REQUIRED_PERMISSIONS) {
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
