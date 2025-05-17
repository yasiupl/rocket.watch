# rocket.watch

[![Discord](https://img.shields.io/discord/150674920869724161)](https://discord.gg/cExSaKZ) [![Netlify Status](https://api.netlify.com/api/v1/badges/dd4154a3-2721-46b9-bdff-136de3c95f1f/deploy-status)](https://app.netlify.com/sites/rocketwatch/deploys)
[![](https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=114412&theme=dark)](https://www.producthunt.com/posts/rocket-watch)

![showcase](https://i.imgur.com/qJ6fE74.png)
## Our Mission & Premise

The original idea behind rocket.watch was to give spaceflight fans a tool to follow SpaceX activities in high detail. Initially, the app focused on SpaceX landings and the arrival of landing barges to Port Canaveral, Florida. The website included feeds like AIS, live marine radio, and live camera feeds on one page, allowing fans to see the outcome of the landing right as the barge appeared on the horizon. Many people would then come to see the booster in person, but many fans also stuck to the online feeds.

Once SpaceX landings became more routine, the website started focusing on other space launches.

The premise of Rocket Watch stays the same: it shall provide users and space fans with the most amount of information about any given space launch, augmented from additional sources. The key is to make the interface readable and useful. The project evolved from a focused SpaceX tracker to a comprehensive platform for all kinds of space launches, landings, and other events, including suborbital ones.

## Key Features

*   Tracking of current, past, and upcoming rocket launches.
*   Aggregation of data from the Launch Library API and other live feeds (YouTube, Twitter, Reddit, etc.).
*   Single Page Application (SPA) for a smooth and responsive user experience.
*   Progressive Web App (PWA) features including installability, potential for offline access, and push notifications for launch updates.
*   For more technical details, see our [Technical Documentation](TECHNICAL_DOCS.md).

## Getting Started / Development

### Prerequisites
*   [npm (Node Package Manager)](https://www.npmjs.com/get-npm)

### Quick Start for Development
1.  Clone the repository:
    ```bash
    git clone https://github.com/yasiupl/rocket.watch.git
    cd rocket.watch
    ```
2.  Install dependencies:
    ```bash
    make install
    ```
    (This runs `npm ci` for a clean installation based on `package-lock.json`)
3.  Run the development server:
    ```bash
    make serve
    ```
4.  Open `http://localhost:8080` (or the port specified by webpack-dev-server) in your browser.

### Building for Production
To create a production-ready build in the `dist/` directory:
```bash
make deploy
```

## How to Contribute

We welcome contributions! Please check out the [Technical Documentation](TECHNICAL_DOCS.md) for more details on the architecture, codebase, and how to get involved. Feel free to open an issue or submit a pull request.

## Community

*   Join us on [Discord](https://discord.gg/cExSaKZ)!
*   Follow us on [Twitter](https://twitter.com/rocket_watch).
*   Check us out on [Product Hunt](https://www.producthunt.com/posts/rocket-watch).

## Technical Documentation

For a deep dive into the architecture, codebase, and more detailed developer guides, please see our [Technical Documentation](TECHNICAL_DOCS.md).
