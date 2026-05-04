import type VCAspectRatio from './components/aspect-ratio/AspectRatio.vue';
import type VCAvatar from './components/avatar/Avatar.vue';
import type VCBadge from './components/badge/Badge.vue';
import type VCSeparator from './components/separator/Separator.vue';
import type VCTag from './components/tag/Tag.vue';
import type VCTagList from './components/tag/TagList.vue';
import type VCVisuallyHidden from './components/visually-hidden/VisuallyHidden.vue';

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        VCSeparator: typeof VCSeparator,
        VCTag: typeof VCTag,
        VCTagList: typeof VCTagList,
        VCAvatar: typeof VCAvatar,
        VCAspectRatio: typeof VCAspectRatio,
        VCVisuallyHidden: typeof VCVisuallyHidden,
        VCBadge: typeof VCBadge,
    }
}
