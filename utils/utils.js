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
  cloneDeep(arg) {
    return _.cloneDeep(arg)
  },
  includes(...arg) {
    return _.includes(...arg)
  },
  defaultValue(arg, defaultValue) {
    if(this.invalid(arg)) {
      return defaultValue
    }
    return arg
  },
  getObjectValue(object, path) {
    return _.get(object, path)
  },
  setObjectValue(object, path, value) {
    return _.set(object, path, value)
  },
  mapKeys(object, callback) {
    return _.mapKeys(object, callback)
  }
}