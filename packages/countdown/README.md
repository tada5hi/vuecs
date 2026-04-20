# @vuecs/countdown ⏰

[![npm version](https://badge.fury.io/js/@vuecs%2Fcountdown.svg)](https://badge.fury.io/js/@vuecs%2Fcountdown)
[![main](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/vuecs/actions/workflows/main.yml)

Countdown timer component for Vue 3 with auto-start, visibility handling, and scoped slot for custom display.

**Table of Contents**

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Props](#props)
- [Exposed Methods](#exposed-methods)
- [License](#license)

## Installation

```bash
npm install @vuecs/countdown @vuecs/core
```

## Quick Start

```typescript
import countdown from '@vuecs/countdown';

app.use(countdown);
```

```vue
<template>
    <VCCountdown :time="60000" @end="onFinished">
        <template #default="{ minutes, seconds }">
            {{ minutes }}:{{ seconds }}
        </template>
    </VCCountdown>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `time` | `number` | `0` | Time in milliseconds to count down from |
| `autoStart` | `boolean` | `true` | Start countdown on mount |
| `interval` | `number` | `1000` | Progress interval in milliseconds |
| `tag` | `string` | `'span'` | Root element tag |
| `emitEvents` | `boolean` | `true` | Emit start/progress/abort/end events |

## Exposed Methods

Access via template ref:

```vue
<VCCountdown ref="timer" :time="10000" :auto-start="false" />
```

| Method | Description |
|--------|-------------|
| `start()` | Start the countdown |
| `abort()` | Abort the countdown |
| `end()` | End the countdown immediately |

## License

Made with 💚

Published under [MIT License](./LICENSE).
