import _ from 'lodash'

// class Utils {
//   constructor() {
//     this._ = _
//   }

//   isEmpty(arg) {
//     return this._.isEmpty(arg)
//   }
// }
export default {
  isEmptyArray(arg) {
    return _.isEmpty(arg) && _.isArray(arg)
  },
  isEmptyObject(arg) {
    return _.isEmpty(arg) && _.isObject(arg)
  },
  invalid(arg) {
    return _.isNull(arg) || arg === undefined || arg === ''
  }
}