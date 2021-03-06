## React starter

React Native starter is what we think an ideal starting point for the most ReactNative frontend applications. It is based on the following primary technologies:

- [react](https://github.com/facebook/react)
- [react-native](https://github.com/facebook/react-native)
- [react-router](https://github.com/ReactTraining/react-router)
- [redux](http://redux.js.org/)
- [postcss](https://github.com/postcss/postcss)
- [eslint](http://eslint.org)

Application structured in a way, which we find most efficient in both short and long term projects. The main intention of the current structure is to keep logical components close to each other and define clear structure for the common things, such as routers, store, api wrappers, reducers, action creators, store selectors.

### Explanations of the files structure.

1. **[src/app/components](./src/app/components)** - this folder consist all UI components. Root level folders (such as [profile](./src/app/components/profile), [index](./src/app/components/index)) are typically pages of your application. Every such component should have all files related to the page: images, style files, jsx files, sub components. This folder also consist two none page components: [common](./src/app/components/common) and [layout](./src/app/components/common). *Common* folder should have all common components which are reused in **at least two** root level components. Layout - represent a layout of your application and should consist all layout related logic and other components, such as headers, footers, sidebars.
2. **[src/app/components/routes.jsx](./src/app/components/routes.jsx)** - this file should consist all routes for your client side application.
3. **[src/app/helpers](./src/app/helpers)** - this folder should consist off common helpers used in other components, such as date formatters, api wrappers, common functions and all other files that does not fit current structure. If you don't know where to put certain file - put it into this folder and we will eventually figure out the right place for it.
4. **[src/app/resources](./src/app/resources/user)** - a folder consist of all redux/api related things. Typically resource maps 1 to 1 to the api endpoint, but not limited to only api endpoints. Every resource is responsible for management certain part of the redux store. If you need keep something client specific in the redux store, you can create separate resource for it. For example: navigation resource may contain something history of the all opened pages to without 1 to 1 connection to the rest api. Main moving parts of resource:
    - **[src/app/resources/store.js](./src/app/resources/store.js)** - initialization logic for the redux store. Combines all reducers, adds redux middlewares.
    - **[src/app/resources/*/*.actions.js](./src/app/resources/user/user.actions.js)** - consist redux action creators for the given resource.
    - **[src/app/resources/*/*.api.js](./src/app/resources/user/user.api.js)** - consist all api methods of the given resource. Optional.
    - **[src/app/resources/*/*.reducer.js](./src/app/resources/user/user.reducer.js)** - consist reducer for the give resource. All reducers combined together in the `[store.js](./src/app/resources/store.js)`.
    - **[src/app/resource/*/*.selectors.js](./src/app/resources/user/user.selectors.js)** - consist selectors for the given resource. You should never access store directly, but always use selectors instead. That would simplify things when structure of the store data changes.
5. **[src/app/services](./src/app/services)** - folder should consist the logic for the the third party service integrations (such as Intercom, Segment, etc). Not limited only to the third party services, but could consist some standalone application related services.

### Run project

To run android version of app:

1. Install [react-native](https://github.com/facebook/react-native) , [react-native-cli](https://www.npmjs.com/package/react-native-cli) with -g flag
2. Setup [Android Studio](https://developer.android.com/studio/index.html?gclid=EAIaIQobChMIjuCC6qyz1QIVxLftCh0angiSEAAYASAAEgKlWvD_BwE)
3. Follow [guide](https://facebook.github.io/react-native/releases/0.21/docs/running-on-device-android.html)

To run ios version of app:

1. Install [react-native](https://github.com/facebook/react-native) , [react-native-cli](https://www.npmjs.com/package/react-native-cli) with -g flag
2. Setup [Xcode](https://developer.apple.com/xcode/)
3. Follow [guide](https://facebook.github.io/react-native/docs/running-on-simulator-ios.html)

### Important things to keep in mind

1. Logical components should be tightly coupled. Keep all component related files, such as images, styles, sub components as close as possible to the component. Do not put component into the `common` folder for the *future use*.
2. Two separate page components should be loosely coupled. If there is two page components which use same image - keep two copies of every image within every page. Do not create generic images folder, as all images belong to some ui components.

### Conventions

1. Name of all files for components should start from lowercased letter.
2. Code style. (TODO: add link to the common eslint configuration for the javascript)

### List of planned improvements

1. Add api wrapper which can be reused in `*.api.js` files
2. Make two current pages stylish.
3. Add stylish loading screen, while app loading (fake 3 seconds profile loading).
