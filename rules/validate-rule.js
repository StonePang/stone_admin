import _ from '~utils/utils'

/**
 * rules: List {
 *  ruleType: 校验类型 custom, type, length
 *  reg: custom时的正则表达式
 *  message: custom的校验错误信息
 *  min, max: length校验的最大最小长度
 *  type: 类型校验的类型
 * }
 */
class ValidateRule {
  constructor({label, required, rules}) {
    this.rules = []
    // this.triggerType = this.triggerTypeMap[type] || 'change'
    if (required) {
      let message = `${label}为必填`
      this.rules.push({
        required: true,
        message,
      })
    }
    rules.forEach(item => {
      let ruleType = item.ruleType
      let handler = this.ruleMap[ruleType]
      if (handler) {
        let rule = handler(item)
        this.rules.push(rule)
      } else {
        console.warn(`(${label})的校验规则类型(${ruleType})未在规则库中定义`)
      }
    });
  }

  get triggerTypeMap() {
    return {
      'input': 'blur',
      'select': 'change',
      'radio': 'change',
      'textarea': 'blur',
      'checkbox': 'change',
      'date': 'change',
      'datetime': 'change',
      'year': 'change',
      'month': 'change',
      'week': 'change',
      'dates': 'change',
      'daterange': 'change',
      'time': 'change',
      'timerange': 'change',
    }
  }

  get ruleMap() {
    return {
      custom: this.customRule,
      type: this.typeRule,
      length: this.lengthRule,
    }
  }

  customRule(ruleItem) {
    let reg = ruleItem.reg
    let message = ruleItem.message
    let validator = (rule, value, callback) => {
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error(message))
      }
    }
    return {
      validator
    }
  }

  typeRule(ruleItem) {
    let type = ruleItem.type.toLowerCase()
    let message = `输入的类型必须是(${type})`
    return {
      type,
      message,
    }
  }

  lengthRule(ruleItem) {
    let min = Number(ruleItem.min)
    let max = Number(ruleItem.max)
    let message = '长度校验规则'
    if (_.valid(min) && _.valid(max)) {
      message = `输入长度在${min}到${max}个字符`
    }else if(_.invalid(min) && _.valid(max)) {
      message = `输入长度应小于${max}个字符`
    }else if(_.valid(min) && _.invalid(max)) {
      message = `输入长度应大于${min}个字符`
    } else {
      message = `输入长度校验-长度未定义`      
    }
    return {
      min,
      max,
      message,
    }

  }
}

export default ValidateRule