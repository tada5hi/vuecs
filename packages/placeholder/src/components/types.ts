import type { placeholderProps, placeholderWrapperProps  } from './props';
import type { ExtractPublicPropTypes } from 'vue';


export type PlaceholderProps = ExtractPublicPropTypes<typeof placeholderProps>;

export type PlaceholderWrapperProps = ExtractPublicPropTypes<typeof placeholderWrapperProps>;
