import {boot} from 'quasar/wrappers'

export default boot(({app}) => {
  app.config.globalProperties.$notify = (message, type = 'info') => {
    app.config.globalProperties.$q.notify({
      type: type,
      message: message
    })
  }
})
