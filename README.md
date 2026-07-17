# Model deprecation fallback notice

A focused front-end implementation for AI projects whose saved model has been deprecated and replaced at runtime by an active fallback.

## Live prototype

### [Open the ASU AI Builder prototype →](https://atimoh-boop.github.io/model_deprecations/)

The live prototype shows the deprecated-model fallback experience inside an ASU AI Builder-style interface.

## Behavior

- The selector keeps showing the project's saved (deprecated) model.
- A non-blocking status notice explains which active fallback is running.
- Projects without a deprecation fallback do not receive the notice.
- Detection is driven by the backend-shaped model state in `app/model-state.ts`.

Use the **QA preview** link in the page to switch between affected and unaffected backend states.

## Development

```bash
npm install
npm run dev
```

Run `npm test` to build the app and verify both states against server-rendered HTML.
