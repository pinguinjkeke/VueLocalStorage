# VueLocalStorage
[![CircleCI status](https://circleci.com/gh/pinguinjkeke/vue-local-storage/tree/master.svg?style=shield)](https://circleci.com/gh/pinguinjkeke/vue-local-storage/tree/master.svg?style=shield)
[![npm version](https://img.shields.io/npm/v/vue-localstorage.svg)](https://www.npmjs.com/package/vue-localstorage)
[![npm downloads](https://img.shields.io/npm/dt/vue-localstorage.svg)](https://www.npmjs.com/package/vue-localstorage)

LocalStorage plugin inspired by Vue typed props which take a care of typecasting for Vue.js 1 and 2 with SSR support.

## Install

  ``` bash
  npm install vue-localstorage --save
  ```
  or
  ``` bash
  bower install vue-localstorage
  ```

## Usage
  ``` js
  import VueLocalStorage from 'vue-localstorage'

  Vue.use(VueLocalStorage)
  // Or you can specify any other name and use it via this.$ls, this.$whatEverYouWant
  Vue.use(VueLocalStorage, {
    name: 'ls',
    bind: true //created computed members from your variable declarations
    adapter: 'localStorage' // can be either localStorage or sessionStorage
  })

  // Use localStorage from Vue object
  Vue.localStorage.set('someNumber', 123)
  Vue.localStorage.get('someNumber')

  // Fallback value if nothing found in localStorage
  Vue.localStorage.get('propertyThatNotExists', 'fallbackValue') // Will return 'fallbackValue' string
  
  // Default type if value isn't registered in localStorage section
  Vue.localStorage.get('property', null, Number)

  //register localStorage variables and adds computed variables to local components
  //to be used like regular computeds that are stored in the localstorage
  var vm = new Vue({
    localStorage: {
      someObject: {
        type: Object,
        default: {
          hello: 'world'
        }
      },
      someNumber: {
        type: Number,
      },
      someBoolean: {
        type: Boolean
      },
      stringOne: '',
      stringTwo: {
        type: String,
        default: 'helloworld!'
      },
      stringThree: {
        default: 'hello'
      }
    },
    methods: {
      someMethod () {
        let lsValue = this.$localStorage.get('someObject')
        this.$localStorage.set('someBoolean', true)
        this.$localStorage.remove('stringOne')
      }
    }
  })
  ```
## License
[MIT](https://github.com/pinguinjkeke/vue-local-storage/blob/master/LICENSE)
