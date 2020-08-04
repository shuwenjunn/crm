// 搜索条件的值去空格
export const formatSearchValue = (values: any) => {
    for (let key in values) {
        if (typeof values[key] === 'string') {
            if (values[key] === '') {
                delete values[key]
            } else {
                values[key] = values[key].trim()
            }
        }
    }
    return values
}

export const isInteger = (rule, value, callback) => {
    var type = "^[0-9]*[1-9][0-9]*$"
    var r = new RegExp(type)
    var flag = r.test(value)
    if (value && (value != 0)) {
        if (!flag) {
            callback('请输入整数!')
        } else {
            if (value > 0) {
                callback()
                return
            } else {
                callback('请输入正确的范围')
            }
        }
    } else {
        callback()
        return
    }
}

/**
   * 判断是大于0.01
   */
export const isMoney = (rule, value, callback) => {
    let reg = /^[0-9]+.?[0-9]*$/
    if (value) {
        if (!reg.test(value)) {
            callback('金额格式错误')
        } else {
            if (value * 1 >= 0.01) {
                callback()
                return
            } else {
                callback('最低金额为0.01元')
            }
        }
    } else {
        callback()
        return
    }
}