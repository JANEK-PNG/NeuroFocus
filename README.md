# NeuroFocus

A calm Pomodoro focus timer with optional brainwave-entrainment audio (binaural beats / isochronic tones), nature soundscapes, lo-fi radio, and a brain-dump notes pad. Local-only, no account, no cloud sync.

## Run it

Single-file webapp. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Aesthetic

Warm paper, drifting peach / rose / sage atmospheric washes, Fraunces serif numerals, Manrope sans body. One big time, one play button, everything else behind a drawer. The visual system is documented in [`docs/design-system.md`](docs/design-system.md).

## Layout

```
/
├── index.html              ← the app
├── docs/                   ← formal documentation
│   ├── design-system.md    tokens, components, patterns, anti-patterns
│   ├── design-critique.md  candid review of the current build
│   ├── user-research.md    personas, JTBD, competitive map
│   └── guerrilla-test.md   5-user test script and decision matrix
└── design/                 ← exploration history
    ├── briefs/             pitch decks (refresh, stone-tide)
    ├── moodboards/         inspirations + paper moodboard
    ├── mockups/            design explorations (calm, forest-floor, stone-tide)
    └── archive/            rejected directions (SPLINE 3D specs)
```

## Status

Pre-1.0. Audio engine is stable. The visual refresh ("calm screen", path B) is live in `index.html`; the design journey lives under `design/`.
