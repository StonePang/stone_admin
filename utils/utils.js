import _ from 'lodash'
export default {
  isArray(arg) {
    return _.isArray(arg)
  },
  isEmptyArray(arg) {
    return _.isEmpty(arg) && _.isArray(arg)
  },
  isEmptyObject(arg) {
    return _.isEmpty(arg) && _.isObject(arg)
  },
  invalid(arg) {
    return _.isNull(arg) || arg === undefined || arg === ''
  },
  valid(arg) {
    return !_.isNull(arg) && arg !== undefined && arg !== ''
  },

  
}