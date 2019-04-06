import vueLocalStorage from './VueLocalStorage'

export default {
  /**
   * Install vue-local-storage plugin
   *
   * @param {Vue} Vue
   * @param {Object} options
   */
  install: (Vue, options = {}) => {
    if (typeof process !== 'undefined' &&
      (
        process.server ||
        process.SERVER_BUILD ||
        (process.env && process.env.VUE_ENV === 'server')
      )
    ) {
      return
    }

    let isSupported = true

    try {
      const test = '__vue-localstorage-test__'

      window.localStorage.setItem(test, test)
      window.localStorage.removeItem(test)
    } catch (e) {
      isSupported = false
      vueLocalStorage._isSupported = false

      console.error('Local storage is not supported')
    }

    const name = options.name || 'localStorage'
    const bind = options.bind

    if (options.namespace) {
      vueLocalStorage.namespace = options.namespace
    }

    Vue.mixin({
      beforeCreate () {
        if (!isSupported) {
          return
        }

        if (this.$options[name]) {
          Object.keys(this.$options[name]).forEach((key) => {
            const config = this.$options[name][key]
            const [type, defaultValue] = [config.type, config.default]
            const storageKey = config.key || key

            vueLocalStorage.addProperty(storageKey, type, defaultValue)

            const existingProp = Object.getOwnPropertyDescriptor(vueLocalStorage, storageKey)

            if (!existingProp) {
              const prop = {
                get: () => Vue.localStorage.get(storageKey, defaultValue),
                set: val => Vue.localStorage.set(storageKey, val),
                configurable: true
              }

              Object.defineProperty(vueLocalStorage, storageKey, prop)
              Vue.util.defineReactive(vueLocalStorage, storageKey, defaultValue)
            } else if (!Vue.config.silent) {
              console.log(`${storageKey}: is already defined and will be reused`)
            }

            if ((bind || config.bind) && config.bind !== false) {
              this.$options.computed = this.$options.computed || {}

              if (!this.$options.computed[key]) {
                this.$options.computed[key] = {
                  get: () => Vue.localStorage[storageKey],
                  set: (val) => { Vue.localStorage[storageKey] = val }
                }
              }
            }
          })
        }
      }
    })

    Vue[name] = vueLocalStorage
    Vue.prototype[`$${name}`] = vueLocalStorage
  }
}
