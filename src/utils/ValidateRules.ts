export const ValidateRules = {
  required: (value: any) => {
    // 判断空格，修复vuetify组件输入空格判断错误的问题
    if (typeof value === 'string' && /^[ ]+$/g.test(value)) {
      return '必填'
    } else if (Array.isArray(value) && value.length === 0) return '必填'
    else {
      return value === 0 || !!value || '必填'
    }
  },

  maxLength: (value: any, length: number) => {
    return (value && value.length <= length) || `最大长度${length}`
  },

  email: (value: any) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || !value || '无效邮箱'
  },
  mobile: (value: any) => {
    const pattern =
      /^(12[0-9]|13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
    return pattern.test(value) || !value || '无效手机号'
  },

  telephone: (value: any) => {
    if (value === undefined || value === '' || value === 0) {
      return true
    }
    const pattern =
      /^([1]\d{10}|([(（]?0[0-9]{2,3}[）)]?[-]?)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?)$/
    return pattern.test(value) || '无效电话'
  },

  password: (value: string) => {
    const pattern = /^[a-zA-Z0-9]{1,}$/
    return (
      value === undefined ||
      value === '' ||
      value === null ||
      (pattern.test(value) && value.length > 7 && value.length < 17) ||
      '密码格式不正确，必须为8-16数字＋字母的组合'
    )
  },

  strongPassword: (value: string) => {
    const pattern =
      /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,25}$/

    return (
      (pattern.test(value) && value.length > 7) ||
      !value ||
      '密码格式错误，请输入8-25位的密码，密码必须包含大写字母、小写字母、数字、符号四种中的三种'
    )
  },

  passwordConfirm: (pwd: string, pwdConfirm: string) => {
    return pwd === pwdConfirm || '密码不一致'
  },

  dictLenth: (value: string) => {
    return (value || '').length <= 15 || '最长只能15个字符'
  },

  dictName: (value: string) => {
    const pattern = /[\s]+/
    return !pattern.test(value) || '请输入正确的字典名称.'
  },

  username: (value: string) => {
    return !!value || '请输入正确的账号.'
  },

  number: (value: any) => {
    return value.length > 3 || '请输入正确的验证码.'
  },

  userNo: (value: any) => {
    const pattern = /^[a-zA-Z0-9]{1,}$/
    return pattern.test(value) || !value || '只能输入字母和数字'
  },

  fixTwo: (value: any) => {
    const pattern = /^\d+(\.\d{0,2})?$/
    return pattern.test(value) || !value || '只能输入不超过两位小数的数字'
  },

  idNo: (value: any) => {
    const pattern =
      /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ ||
      /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/
    return pattern.test(value) || !value || '无效身份证'
  },

  idCard: (value: any) => {
    const pattern = /^\d{1,}$/g
    return pattern.test(value) || !value || '请输入正确的纯数字银行卡号'
  },
  sum: (num1: number, num2: number) => {
    // 大于gt   小于lt    等于et    大于等于ge   小于等于le
    return Number(num1) + Number(num2) <= 100 || '佣金之和不能大于100'
  },
  geTwoNum: (num1: number, num2: number, str: string) => {
    return Number(num1) <= Number(num2) || str
  },
  gt(num1: number, num2: number) {
    return Number(num1) > Number(num2) || '必须大于' + Number(num2)
  },
  positiveInt: (value: any) => {
    const pattern = /^[1-9]\d*$/
    return pattern.test(value) || !value || '请输入正整数'
  }
}
