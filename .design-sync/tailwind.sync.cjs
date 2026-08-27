// design-sync: the repo's Tailwind config, widened for the design system build.
//
// Two changes from the app's own config, both because the consumer is different.
// The app ships only the classes its own source uses; a design system ships a
// vocabulary that a design agent composes NEW layouts from, and a class that was
// never used in src/ would otherwise silently resolve to nothing.
//
//  1. `content` also scans the authored previews.
//  2. `safelist` pins the whole semantic colour palette and the layout scales an
//     agent reaches for, whether or not the app happens to use them.
const base = require('../tailwind.config.js')
const cfg = base.default || base

const COLORS = [
  'background', 'foreground', 'card', 'card-foreground', 'muted', 'muted-foreground',
  'border', 'input', 'ring', 'primary', 'primary-foreground', 'secondary',
  'secondary-foreground', 'accent', 'accent-foreground', 'destructive',
  'destructive-foreground',
].join('|')

module.exports = {
  ...cfg,
  content: ['./src/**/*.{ts,tsx}', './.design-sync/previews/**/*.tsx'],
  safelist: [
    // The design language itself: every semantic colour on every property that
    // can carry it, in every interactive state.
    {
      pattern: new RegExp(`^(bg|text|border|ring|ring-offset|fill|stroke|decoration|divide|placeholder|caret|outline|shadow|accent)-(${COLORS})$`),
      variants: ['hover', 'focus', 'focus-visible', 'active', 'disabled', 'group-hover', 'peer-focus'],
    },
    // Layout scales. The app exercises a slice of these; an agent composing new
    // screens needs the rest.
    { pattern: /^(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y)-(0|0\.5|1|1\.5|2|2\.5|3|3\.5|4|5|6|7|8|9|10|11|12|14|16|20|24|px)$/ },
    { pattern: /^(w|h|min-w|min-h|max-w|max-h)-(0|px|full|screen|min|max|fit|auto|touch|1|2|3|4|5|6|8|10|12|14|16|20|24|32|40|48|56|64|72|80|96)$/ },
    { pattern: /^max-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|prose|none)$/ },
    { pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|left|center|right)$/ },
    { pattern: /^font-(thin|light|normal|medium|semibold|bold|extrabold)$/ },
    { pattern: /^(leading|tracking)-(none|tight|snug|normal|relaxed|loose|wide|wider|widest)$/ },
    { pattern: /^(rounded|rounded-t|rounded-b|rounded-l|rounded-r|rounded-tl|rounded-tr|rounded-bl|rounded-br)(-(none|sm|md|lg|xl|2xl|3xl|full))?$/ },
    { pattern: /^border(-(0|2|4|8|t|b|l|r|x|y))?$/ },
    { pattern: /^(flex|grid|block|inline-flex|inline-block|inline|hidden|contents)$/ },
    { pattern: /^(flex-(row|col|wrap|nowrap|1|auto|initial|none)|shrink-0|shrink|grow-0|grow|basis-0|basis-full)$/ },
    { pattern: /^(items|justify|self|content|place-items|place-content)-(start|end|center|between|around|evenly|stretch|baseline|auto)$/ },
    { pattern: /^grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12|none)$/ },
    { pattern: /^col-span-(1|2|3|4|5|6|7|8|9|10|11|12|full)$/ },
    { pattern: /^(relative|absolute|fixed|sticky|static)$/ },
    { pattern: /^(inset|top|bottom|left|right|inset-x|inset-y)-(0|auto|px|1|2|3|4|6|8|full)$/ },
    { pattern: /^z-(0|10|20|30|40|50|auto)$/ },
    { pattern: /^(overflow|overflow-x|overflow-y)-(auto|hidden|visible|scroll|clip)$/ },
    { pattern: /^opacity-(0|5|10|20|25|30|40|50|60|70|75|80|90|95|100)$/ },
    { pattern: /^shadow(-(sm|md|lg|xl|2xl|inner|none))?$/ },
    { pattern: /^(truncate|uppercase|lowercase|capitalize|italic|underline|antialiased|sr-only|tabular-nums|whitespace-nowrap|break-words|cursor-pointer|select-none|pointer-events-none)$/ },
    { pattern: /^animate-(pop-in|slide-up|spin|pulse|none)$/ },
    { pattern: /^(pb|pt)-(safe-b|safe-t)$/ },
    'tnum',
  ],
}
