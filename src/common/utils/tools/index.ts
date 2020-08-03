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