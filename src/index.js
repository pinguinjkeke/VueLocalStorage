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
      let adapter = 'localStorage'
      if (this.options.adapter) {
        if (['sessionStorage', 'localStorage'].includes(this.options.adapter)) {
          adapter = this.options.adapter
        } else {
          throw new Error(`${this.options.adapter} is an invalid storage adapter`)
        }
      }
      const testToken = `__vue-${adapter}-test__`
      window[adapter].setItem(testToken, testToken)
      window[adapter].removeItem(testToken)
      vueLocalStorage._adapter = adapter
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

            vueLocalStorage.addProperty(key, type, defaultValue)

            const existingProp = Object.getOwnPropertyDescriptor(vueLocalStorage, key)

            if (!existingProp) {
              const prop = {
                get: () => Vue.localStorage.get(key, defaultValue),
                set: val => Vue.localStorage.set(key, val),
                configurable: true
              }

              Object.defineProperty(vueLocalStorage, key, prop)
              Vue.util.defineReactive(vueLocalStorage, key, defaultValue)
            } else if (!Vue.config.silent) {
              console.log(`${key}: is already defined and will be reused`)
            }

            if ((bind || config.bind) && config.bind !== false) {
              this.$options.computed = this.$options.computed || {}

              if (!this.$options.computed[key]) {
                this.$options.computed[key] = {
                  get: () => Vue.localStorage[key],
                  set: (val) => { Vue.localStorage[key] = val }
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
