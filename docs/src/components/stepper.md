# Stepper

Multi-step navigator for wizards, checkout flows, and onboarding. Built on [Reka UI](https://reka-ui.com/)'s `Stepper` primitives.

The compound parts let you assemble the step item exactly the way your design needs it (indicator + title + description, or just indicator + title, or any combination). Each item carries `data-state="active|completed|inactive"` so theme classes can react to step state without explicit wiring.

```bash
npm install @vuecs/navigation
```

<Demo name="stepper" component="VCStepper">
  <template #code>

::: code-group

```vue [Vue]
<script setup lang="ts">
import {
    VCStepper,
    VCStepperDescription,
    VCStepperIndicator,
    VCStepperItem,
    VCStepperSeparator,
    VCStepperTitle,
    VCStepperTrigger,
} from '@vuecs/navigation';
import { ref } from 'vue';

const current = ref(2);
const steps = [
    { title: 'Account', description: 'Create your profile' },
    { title: 'Address', description: 'Where to send things' },
    { title: 'Payment', description: 'Add a card' },
];
</script>

<template>
    <VCStepper v-model="current">
        <template v-for="(step, i) in steps" :key="i">
            <VCStepperItem :step="i + 1">
                <VCStepperTrigger>
                    <VCStepperIndicator>{{ i + 1 }}</VCStepperIndicator>
                </VCStepperTrigger>
                <div>
                    <VCStepperTitle>{{ step.title }}</VCStepperTitle>
                    <VCStepperDescription>{{ step.description }}</VCStepperDescription>
                </div>
            </VCStepperItem>
            <VCStepperSeparator v-if="i < steps.length - 1" />
        </template>
    </VCStepper>
</template>
```

```css [CSS]
@import "tailwindcss";
@import "@vuecs/design";
@import "@vuecs/navigation";

@custom-variant dark (&:where(.dark, .dark *));
```

:::

  </template>
</Demo>

## Compound API

| Component | Wraps | Notes |
|---|---|---|
| `VCStepper` | `StepperRoot` | Holds active-step state. v-models `modelValue` (1-based step number). `linear` blocks navigation past the next incomplete step. |
| `VCStepperItem` | `StepperItem` | Per-step wrapper. `step` (1-based) is required. Carries `data-state="active|completed|inactive"`. |
| `VCStepperTrigger` | `StepperTrigger` | Clickable trigger inside a step. Disabled when the step is unreachable in linear mode. |
| `VCStepperIndicator` | `StepperIndicator` | Circular indicator (number / check / icon). |
| `VCStepperTitle` | `StepperTitle` | Step title. |
| `VCStepperDescription` | `StepperDescription` | Step description. |
| `VCStepperSeparator` | `StepperSeparator` | Line between consecutive steps. Carries `data-state="completed"` when the preceding step is done. |

## Theme keys

| Key | Default class |
|---|---|
| `root` | `vc-stepper` |
| `item` | `vc-stepper-item` |
| `trigger` | `vc-stepper-trigger` |
| `indicator` | `vc-stepper-indicator` |
| `title` | `vc-stepper-title` |
| `description` | `vc-stepper-description` |
| `separator` | `vc-stepper-separator` |

## API Reference

### `<VCStepper>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `undefined` | Active step (1-based). v-model. |
| `defaultValue` | `number` | `1` | Initial active step for uncontrolled usage. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction. |
| `dir` | `'ltr' \| 'rtl'` | from `ConfigManager` | Reading direction. |
| `linear` | `boolean` | `false` | Block navigation past the next incomplete step. |
| `themeClass` | `Partial<StepperThemeClasses>` | `undefined` | Per-instance theme override. |
| `themeVariant` | `Record<string, string \| boolean>` | `undefined` | Per-instance variant values. |

| Emit | Payload | Description |
|---|---|---|
| `update:modelValue` | `number \| undefined` | Fired when the active step changes. |

### `<VCStepperItem>`

| Prop | Type | Default | Description |
|---|---|---|---|
| `step` | `number` | required | 1-based step index. |
| `disabled` | `boolean` | `false` | Block interaction with this step. |
| `completed` | `boolean` | `undefined` | Force completion state (Reka derives this automatically when omitted). |

| Slot props | Description |
|---|---|
| `state` | `'active' \| 'completed' \| 'inactive'` |
