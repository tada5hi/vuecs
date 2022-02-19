export interface AuthModuleInterface {
    hasAbility<T>(ability: T): boolean;
    hasPermission(name: string): boolean;
    [key: string]: any;
}
export declare type AuthRestrictionContext = {
    loggedIn?: boolean;
    auth?: AuthModuleInterface;
    layoutKey: {
        requiredAbilities: string;
        requiredPermissions: string;
        requiredLoggedOut: string;
        requiredLoggedIn: string;
    };
    [key: string]: any;
};
//# sourceMappingURL=type.d.ts.map