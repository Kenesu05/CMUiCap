# CMUiCAP

CMUiCAP is a responsive front-end prototype for the CMU Capstone Project Repository and Topic Recommendation System.

## Responsive support

The interface is designed to adapt across:
- Desktop PCs and large monitors
- Laptops
- iPads and tablets
- Android/iOS phones and small screens

### Mobile navigation
- Student pages use a collapsible hamburger navigation below 760px.
- Admin and faculty pages use an off-canvas sidebar below 900px.
- Navigation closes from the close button, overlay, Escape key, or selecting a page.

### Mobile safety
- Horizontal overflow is prevented at the document level.
- Tables remain readable through horizontal table scrolling where necessary.
- Images and SVGs are constrained to their containers.
- Forms, buttons, grids, cards, and toolbars wrap on smaller screens.
- OTP inputs scale down for small phones.
- Login and upload layouts have additional small-screen rules.

## Run locally

This is a static HTML/CSS/JavaScript prototype. GitHub Pages uses `index.html` as the entry page. `index.html` is the same CMUiCAP login page as `index.html`. You can also open `index.html` directly in a browser, or serve the folder with a local web server.

Example with VS Code:
1. Open the `CMUiCAP` folder.
2. Use Live Server or another static server.
3. Open `index.html` (or `index.html`).

## GitHub Pages

The project can be deployed as a static GitHub Pages site. Upload the contents of this folder to a repository and enable GitHub Pages from the repository's Pages settings.

No build step is required.
