# Jamal.dev

**Version 1.0.0**

Personal site for [Jamal Yusuf](https://jamal.dev) — Principal AI + Backend Systems Engineer, cognition researcher, and writer. Built with [Hugo](https://gohugo.io/) and deployed to **GitHub Pages** at [jamal.dev](https://jamal.dev).

**Repository:** [github.com/JamalYusuf/jamal.dev](https://github.com/JamalYusuf/jamal.dev)

The site brings together professional work (architecture, AI systems, platforms, leadership), Expert Vision research, writing, speaking, open-source projects, and U.S. legal pages — in a sharp, research-forward design system.

## What's in this repo

| Area | Description |
|------|-------------|
| **Home** | Hero, resume spotlight, credibility band, research preview, work highlights, focus areas |
| **About** | Profile, founder sections, employment history, social links |
| **Work** | Architecture, AI systems, platforms, leadership, open source, case studies |
| **Research** | Expert Vision framework and related programs |
| **Writing** | Essays on AI, engineering, design systems, cognition, and side projects |
| **Speaking** | Topics and engagement overview |
| **Legal** | Privacy, terms, disclaimer, accessibility |

Custom Hugo theme: `themes/jamal/` — layouts, CSS, JS, and partials tuned for this site.

## Tech stack

- **Hugo** (Extended) — static site generator
- **Tailwind CSS** (CDN) — utility styling
- **Font Awesome** (CDN) — icons
- **Vanilla JS** — theme toggle, filters, resume tabs, crosshair cursor
- **GitHub Actions** — build and deploy to GitHub Pages

## Requirements

- [Hugo Extended](https://gohugo.io/installation/) **0.120.0+** (developed and tested on **0.163.2**)
- Git

## Local development

```bash
git clone https://github.com/JamalYusuf/jamal.dev.git
cd jamal.dev
hugo server -D
```

Open [http://localhost:1313](http://localhost:1313). The dev server live-reloads on content and theme changes.

### Production build

```bash
hugo --minify
```

Output is written to `public/` (gitignored; CI builds this on deploy).

### Configuration

Site config lives in [`hugo.toml`](hugo.toml):

- `baseURL` — production URL (`https://jamal.dev/`)
- `[params]` — author, social links, contact email, hero copy, headshots, feature text
- `data/*.yaml` — resume, work areas, research themes, open-source projects, featured areas

Custom domain for GitHub Pages: [`static/CNAME`](static/CNAME) → `jamal.dev`.

## Deploy to GitHub Pages

This site is published from **[JamalYusuf/jamal.dev](https://github.com/JamalYusuf/jamal.dev)**. Deployment is automated via [`.github/workflows/hugo.yml`](.github/workflows/hugo.yml) on every push to `main`.

**One-time GitHub setup:**

1. Open [github.com/JamalYusuf/jamal.dev](https://github.com/JamalYusuf/jamal.dev) → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions** (not “Deploy from a branch”)
3. After the first workflow run, the site is available at `https://jamalyusuf.github.io/jamal.dev/` until a custom domain is configured
4. For production: set **Custom domain** to `jamal.dev`, configure DNS (below), then enable **Enforce HTTPS**

The workflow builds with Hugo Extended **0.163.2**, runs `hugo --minify`, uploads `public/` as a Pages artifact, and deploys via `actions/deploy-pages`.

**Manual deploy (optional):** push to `main`, or run the workflow from **Actions** → **Deploy Hugo site** → **Run workflow**.

### Custom domain (jamal.dev)

At your DNS provider, add:

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `JamalYusuf.github.io` |

(Use your GitHub Pages docs for the latest IP list if these change.)

Enable **Enforce HTTPS** in GitHub Pages settings after DNS propagates.

## Project structure

```
jamal.dev/
├── archetypes/          # Content templates for hugo new
├── content/             # Pages and sections (about, work, research, writing, legal)
├── data/                # YAML data (resume, open source, themes, etc.)
├── static/              # Static assets (images, video, CNAME)
├── themes/jamal/        # Custom Hugo theme
│   ├── assets/          # CSS, JS (processed by Hugo Pipes)
│   └── layouts/         # HTML templates and partials
├── hugo.toml            # Site configuration
├── .github/workflows/   # GitHub Pages CI/CD
├── LICENSE              # CC BY-NC 4.0 — non-commercial use
└── README.md
```

Content is Markdown with YAML front matter. Section layouts are defined in `themes/jamal/layouts/`.

## Versioning

| Version | Notes |
|---------|-------|
| **1.0.0** | Initial public release — Jamal.dev site with work, research, writing, legal, and open-source integration |

Version is declared in [`hugo.toml`](hugo.toml) (`site_version`) and this README.

## License

**CC BY-NC 4.0** — [Creative Commons Attribution-NonCommercial 4.0](https://creativecommons.org/licenses/by-nc/4.0/)

You may view, fork, and adapt this project for **non-commercial** purposes with attribution. **Commercial use is not permitted** without written permission — including using the theme, design, or content in paid products, client deliverables, or commercial sites.

See [LICENSE](LICENSE) for full terms. Commercial licensing: [Contact@JamalYusuf.com](mailto:Contact@JamalYusuf.com).

Third-party assets (CDN libraries, fonts, etc.) remain under their respective licenses.

## Author

**Jamal Yusuf** — [jamal.dev](https://jamal.dev) · [GitHub](https://github.com/JamalYusuf/jamal.dev) · [LinkedIn](https://www.linkedin.com/in/jamal-yusuf)