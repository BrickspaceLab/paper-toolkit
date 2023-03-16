<img src="https://user-images.githubusercontent.com/4685863/225655352-0d8b3cd2-4b27-4565-9f60-e240a1285349.jpg" width="64" style="border-radius:4px;">

#  Paper

[Join Discord](https://discord.gg/NeSWQWCh) / [Download theme](https://themes.shopify.com/themes/paper/styles/poster) / [Become an affiliate](https://brickspacelab.notion.site/Paper-partner-program-4f3da78aff844b43badce89b570777a6)

---


# Overview
This is a kit to help extend and customize the Paper Shopify theme. You will need to have a valid copy of Paper installed on your Shopify account in order to use this. Consider applying to our [affiliate program](https://brickspacelab.notion.site/Paper-partner-program-4f3da78aff844b43badce89b570777a6) for a commision on any Paper installs.

---

# Features
Paper has a number of useful features that make it a developer friendly theme to work with out of the box.
- **Fast and reliable**: From the very beginning, we've made sure Paper works fast and reliably by using the latest browser-supported features. Don't worry if you're still using an older browser, our progressive enhancement ensures you'll still have the best experience.
- **Works with JavaScript disabled**: We want everyone to have access to your store, so we've minimized the use of JavaScript. Even if someone has disabled JavaScript, we've got you covered with excellent fallbacks for core functionality.
- **Easily extendable**: We've built Paper with a modular approach, so it's super simple to extend and customize. We use Tailwind CSS to give you an easy approach to styling, and Alpine.js to add interactivity without weighing you down.
- **Meets all standards for theme store**: Paper meets all the [requirements](https://shopify.dev/docs/themes/store/requirements) for the Shopify theme store.

---

# Getting started
### Requirements
- [Paper](https://themes.shopify.com/themes/paper/styles/poster) installed on your Shopify account
- NPM (6.0.0 or higher)
- [Node.js](https://nodejs.org/en/download/) (14.17.0 or higher)
- [Shopify CLI](https://shopify.dev/docs/themes/tools/cli/install)


### Installing
1. Clone this repo
2. Update the `login` command in `package.json` to point to your store
3. Run `npm install` to install dependencies
4. Run `npm run login` to log in to your Shopify account
5. Run `npm run download` to download theme files from your account
6. Run `npm run watch` to watch for changes and start a develeopment preview

### Command refferance

| Command  | Description |
| ------------- | ------------- |
| `npm run login`  | Logs out of any Shopify account then logs in to the store assigend in `package.json` |
| `npm run download`  | Pulls theme files from your Shopify account |
| `npm run watch`  | Creates a development theme then watches for changes to update the development preview with compiles CSS and JavaScript |
| `npm run build`  | Builds minified CSS and JavaScript assets |
| `npm run deploy`  | Builds minified CSS and JavaScript assets then deploys to a theme |

---

# Making changes

### Development previews
Use `npm run watch` to setup a development preview that refreshes your CSS and JavaScript as you make changes. This is the best way to implement more in-depth changes on Paper.

### Naming coventions
Paper uses a naming convention to help keep things organized. We use the following prefixes to help identify the files in our `/snippet` folder.
- `components__`: Components are reusable pieces of code that can be used in multiple places. Most of our components are used in multiple places throughout the theme.
- `theme__`: Theme files are only ever used in the `theme.liquid` file. These are global snippets that appear on every page of your theme. `
- `script__`: Script files contain small snippets of JavaScript that are used throughout the theme.
- `article__`, `collection__`, `product__`: Article, collection and product files are used in their respecitive templates only.
- `header__`: Header files are used to within the header of your theme.

Section files follow a similar naming convention. 
- Section files prefixed with a keyword and a double underscore are only used in their respecitve template files. E.g. `collection__banner.liquid` is only used in the `collection.liquid` file.

### Tips and tricks
- Use the `theme__styles.liquid` file to update or edit theme-wide CSS variables.

---

# Resources
- [Discord server](https://discord.gg/NeSWQWCh)
- [Twitter updates](https://twitter.com/brickspacelab)
- [Our blog](https://brickspacelab.com/blogs/news)
- [Paper changelog](https://www.notion.so/brickspacelab/Paper-changelog-cdfeea8101ae465f8880ac90ce22e951)
- [Merchant support](https://brickspacelab.notion.site/Paper-help-center-84ce6b9217574833a7d9b9f4053cb403)


