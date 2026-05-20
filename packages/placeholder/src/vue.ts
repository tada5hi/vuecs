import type {
    VCPlaceholder,
    VCPlaceholderCard,
    VCPlaceholderTable,
    VCPlaceholderWrapper,
} from './components';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCPlaceholder: typeof VCPlaceholder;
        VCPlaceholderCard: typeof VCPlaceholderCard;
        VCPlaceholderTable: typeof VCPlaceholderTable;
        VCPlaceholderWrapper: typeof VCPlaceholderWrapper;
    }
}
