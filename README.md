# Neurosync

A calm Pomodoro focus timer with optional brainwave-entrainment audio (binaural beats / isochronic tones), nature soundscapes, lo-fi radio, and a brain-dump notes pad. Local-only, no account, no cloud sync.

## Run it

It's a single-file webapp. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Aesthetic

Warm paper, drifting peach/rose/sage atmospheric washes, Fraunces serif numerals, Manrope sans body. One big time, one play button, everything else behind a drawer. The visual system is documented in [`docs/design-system.md`](docs/design-system.md).

## Docs

- [`docs/design-system.md`](docs/design-system.md) — tokens, components, patterns, anti-patterns
- [`docs/design-critique.md`](docs/design-critique.md) — candid review of the current build
- [`docs/user-research.md`](docs/user-research.md) — personas, JTBD, competitive map, research roadmap

## Status

Pre-1.0. Audio engine is stable; markup is being rebuilt to drop legacy v1 scar tissue.
