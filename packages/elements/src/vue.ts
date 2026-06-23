import type VCAlert from './components/alert/Alert.vue';
import type VCAlertClose from './components/alert/AlertClose.vue';
import type VCAlertDescription from './components/alert/AlertDescription.vue';
import type VCAlertTitle from './components/alert/AlertTitle.vue';
import type VCAspectRatio from './components/aspect-ratio/AspectRatio.vue';
import type VCAvatar from './components/avatar/Avatar.vue';
import type VCBadge from './components/badge/Badge.vue';
import type VCCard from './components/card/Card.vue';
import type VCCardBody from './components/card/CardBody.vue';
import type VCCardDescription from './components/card/CardDescription.vue';
import type VCCardFooter from './components/card/CardFooter.vue';
import type VCCardHeader from './components/card/CardHeader.vue';
import type { VCCardPlaceholder } from './components/card/CardPlaceholder';
import type VCCardTitle from './components/card/CardTitle.vue';
import type VCCollapse from './components/collapse/Collapse.vue';
import type VCCollapseContent from './components/collapse/CollapseContent.vue';
import type VCCollapseTrigger from './components/collapse/CollapseTrigger.vue';
import type VCSeparator from './components/separator/Separator.vue';
import type VCTag from './components/tag/Tag.vue';
import type VCTags from './components/tag/Tags.vue';
import type VCVisuallyHidden from './components/visually-hidden/VisuallyHidden.vue';

declare module 'vue' {
    export interface GlobalComponents {
        VCSeparator: typeof VCSeparator,
        VCTag: typeof VCTag,
        VCTags: typeof VCTags,
        VCAvatar: typeof VCAvatar,
        VCAspectRatio: typeof VCAspectRatio,
        VCVisuallyHidden: typeof VCVisuallyHidden,
        VCBadge: typeof VCBadge,
        VCCard: typeof VCCard,
        VCCardHeader: typeof VCCardHeader,
        VCCardTitle: typeof VCCardTitle,
        VCCardDescription: typeof VCCardDescription,
        VCCardBody: typeof VCCardBody,
        VCCardFooter: typeof VCCardFooter,
        VCCardPlaceholder: typeof VCCardPlaceholder,
        VCCollapse: typeof VCCollapse,
        VCCollapseTrigger: typeof VCCollapseTrigger,
        VCCollapseContent: typeof VCCollapseContent,
        VCAlert: typeof VCAlert,
        VCAlertTitle: typeof VCAlertTitle,
        VCAlertDescription: typeof VCAlertDescription,
        VCAlertClose: typeof VCAlertClose,
    }
}
