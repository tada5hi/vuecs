export interface MainNavComponent {
    name: string,
    url?: string,
    icon?: string,
    environment?: 'development' | 'production' | 'testing',
    requireLoggedIn?: boolean,
    requirePermissions?: string[],
    requireLoggedOut?: boolean,
    show?: boolean

    id: string,
    components?: MainNavComponent[]
}

export const NAVIGATION_DEFAULT_ID = 'default';
