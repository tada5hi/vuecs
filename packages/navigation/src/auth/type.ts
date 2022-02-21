export type ComponentRestrictionContext = {
    module: {
        hasAbility(ability: any) : boolean;
        hasPermission(name: string) : boolean;
        isLoggedIn() : boolean;
        [key: string]: any
    },
    layoutKey?: {
        children?: string,
        requiredAbilities?: string,
        requiredPermissions?: string,
        requiredLoggedOut?: string,
        requiredLoggedIn?: string
    }
};
