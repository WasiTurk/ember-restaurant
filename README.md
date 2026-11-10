# Ember Restaurant

A multi-page restaurant website: home, menu, reservations and visit info, with a delivery cart that follows you across pages. Plain HTML, CSS and JavaScript, no build step.

## Pages
- `index.html` home with today's special, house favourites and quick links
- `menu.html` full menu with category tabs (link straight to one with `menu.html#mains`)
- `reserve.html` table booking form with validation
- `visit.html` address, live opening hours, delivery info

## Run it
Open `index.html`, or run `npx serve .`

## Deploy on GitHub Pages
Push the files to a repo, then Settings → Pages → Deploy from branch → `main` / root.

## Customize
- Menu, prices, hours, delivery fee, today's special: top of `script.js`
- Colours and fonts: variables at the top of `style.css`
- Dish photos: `images/<dish-name>.jpg`
- Name, address, phone: the four `.html` files

Orders and reservations are simulated in the browser (the cart is saved in localStorage). Connect the handlers in `script.js` to a backend or form service to receive real ones.
