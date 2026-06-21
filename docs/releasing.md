# Releasing

All four `@slidesjs/*` packages are built together and attached to a GitHub
Release by the [`Release`](../.github/workflows/release.yml) workflow when a
`v*` tag is pushed. Nothing is published to npm.

## Cutting a release

1. Bump `"version"` in every `packages/*/package.json` (keep them in sync).
2. Commit the bump.
3. Tag and push:
   ```bash
   git tag v0.1.0
   git push origin main --tags
   ```
4. The workflow builds all packages, packs each into a `.tgz`, and creates a
   GitHub Release for the tag with auto-generated notes and the tarballs
   attached. It needs no extra secrets — it uses the workflow's built-in
   `GITHUB_TOKEN`.

## Building manually (fallback)

```bash
pnpm install
pnpm build
pnpm -r --filter "./packages/*" exec pnpm pack --pack-destination ./release-artifacts
```
