import {MainNavComponent} from "./type";

let navigationComponents : MainNavComponent[] = [];

export function setMainNavComponents(components: MainNavComponent[]) {
    navigationComponents = components;
}

export function getMainNavComponents() : MainNavComponent[] {
    return  navigationComponents;
}

export function getMainNavComponentById(
    id: string
) : MainNavComponent | undefined {
    const index = navigationComponents.findIndex(navigation => navigation.id === id);
    if(index !== -1) {
        return navigationComponents[index];
    }

    return undefined;
}
