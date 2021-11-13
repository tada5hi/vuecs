export type SideNavComponentType = 'link' | 'separator';

export interface SideNavComponent {
    name: string,
    url?: string,
    icon?: string,
    environment?: 'development' | 'production' | 'testing',
    requireLoggedIn?: boolean,
    requirePermissions?: string[],
    requireLoggedOut?: boolean,
    show?: boolean

    type: SideNavComponentType,
    rootLink?: boolean,
    components?: SideNavComponent[]
}
