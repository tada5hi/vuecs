import {SideNavComponent} from "./type";
import {NAVIGATION_DEFAULT_ID} from "../main-nav";

let components : Record<string, SideNavComponent[]> = {};

export function setSideNavComponents(items: SideNavComponent[] | Record<string, SideNavComponent[]>) {
    if(Array.isArray(items)) {
        components[NAVIGATION_DEFAULT_ID] = items;
    } else {
        components = {
            ...components,
            ...items
        };
    }
}

export function getSideNavComponents(navigationId? :string) : SideNavComponent[] {
    return (navigationId ? components[navigationId] : components[NAVIGATION_DEFAULT_ID]) ?? [];
}
