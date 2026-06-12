# OME Fleet Rollout + Overview R3

Standalone backup and research build of the **OpenShift Management Engine** prototype focused on:

- **Fleet rollout** (`/fleetrollout`) — fleet deployment flows, in-progress/completed detail views, activity stream
- **Overview R3** (`/overview`) — customizable dashboard widgets and fleet overview demo data

This repo is a snapshot from the Red Hat `hybrid-platforms` monorepo (`fleet-rollout-overview-r3-change` branch). Use it for stable research testing and sharing outside GitLab Pages. You can embed or link it from the [Hybrid Platforms hub](https://hybrid-platforms-bb0c74.pages.redhat.com/team/ome) later without losing this copy.

## Live preview

After GitHub Pages deploys from `main`:

**https://imjoyjean.github.io/ome-r3-fleet-overview/**

Key routes:

| Route | Description |
|-------|-------------|
| `/overview` | Overview R3 dashboard |
| `/fleetrollout` | Fleet rollout list and wizard entry |
| `/fleetrollout/:deploymentId` | Deployment drill-down |

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173/ and navigate to **Overview** or **Fleet rollout** from the console shell.

## Production build

```bash
npm run build
npm run preview
```

For GitHub Pages locally, match CI base path:

```bash
GITHUB_PAGES_BASE=/ome-r3-fleet-overview/ npm run build
```

## Moving back to Hybrid Platforms hub

When ready to publish on the team hub:

1. Merge or cherry-pick changes into `hybrid-platforms` on branch `fleet-rollout-overview-r3-change` (or a new branch).
2. Ensure `hub/public/branch-index.json` includes a card pointing at the branch preview.
3. CI publishes under `/fleet-rollout-overview-r3-change/ome-console-r3-wip/` on Pages.

This GitHub repo can stay as your personal stable reference even after hub integration.

## Source

- Monorepo: `gitlab.cee.redhat.com:uxd/prototypes/hybrid-platforms`
- Feature branch: `fleet-rollout-overview-r3-change`
- App directory in monorepo: `ome-console/`

## License

Internal Red Hat UX prototype — not for external distribution without approval.
