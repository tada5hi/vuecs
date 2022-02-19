export declare type NavigationComponentTier = number;
export declare type NavigationComponentConfig = {
    id?: string;
    default?: boolean;
    type?: 'separator' | 'link';
    name: string;
    url?: string;
    icon?: string;
    environment?: 'development' | 'production' | 'testing';
    display?: boolean;
    displayChildren?: boolean;
    rootLink?: boolean;
    components?: NavigationComponentConfig[];
    [key: string]: any;
};
export declare type NavigationComponentConfigSlim = Omit<NavigationComponentConfig, 'name'> & Partial<Pick<NavigationComponentConfig, 'name'>>;
export interface NavigationProviderInterface {
    getComponent(tier: NavigationComponentTier, id: string, context: NavigationProviderContext): Promise<NavigationComponentConfig | undefined>;
    getComponents(tier: NavigationComponentTier, context: NavigationProviderContext): Promise<NavigationComponentConfig[]>;
    hasTier(tier: NavigationComponentTier): Promise<boolean>;
    getContextForUrl?(url: string): Promise<NavigationProviderContext | undefined>;
}
export declare type NavigationProviderContext = {
    components: NavigationComponentConfig[];
};
export declare type NavigationComponentToggleContext = {
    component: NavigationComponentConfigSlim;
    enable: boolean;
    display?: boolean;
    rootLevel?: boolean;
};
//# sourceMappingURL=type.d.ts.map