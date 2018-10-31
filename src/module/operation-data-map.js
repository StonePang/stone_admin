export default {
  1: {
    id: 1,
    isShow: true,
    label: '测试按钮',
    disabled: false,
    loading: false,
    displayType: 'primary',
    size: 'small',
    isValidate: true,
    isValidateAll: true,
    isApi: true,
    api: true,
    // customHandler: (view, vm) => {
    //   let n = 2
    //   return new Promise((res, rej) => {
    //     setTimeout(() => {
    //       console.log('setTimeout')
    //       if(n === 1) {
    //         res(view, vm)
    //       }else {
    //         rej('自定义错误')
    //       }
    //     }, 1000)
    //   })
    // }
  },
  2: {
    id: 2,
    isShow: true,
    label: '测试子表按钮',
    disabled: false,
    loading: false,
    displayType: 'primary',
    size: 'small',
    isValidate: false,
    isApi: false,
    api: true,
  }
}
