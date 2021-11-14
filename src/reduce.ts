import {LayoutKey} from "./contants";
import {Component, ReduceComponentContext} from "./type";

export function reduceComponents(
    components: Component[],
    context: ReduceComponentContext
): Component[] {
    if (typeof context.auth === 'undefined') {
        return components;
    }

    return components
        .filter((component: Component) => {
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

            return true;
        });
}
