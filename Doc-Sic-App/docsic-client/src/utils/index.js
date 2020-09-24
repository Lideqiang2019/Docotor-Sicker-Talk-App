/*
包含n 个工具函数的模块
*/
/*
注册doctor--> /doctorinfo
注册sicker--> /sickerinfo
登陆sicker --> /sickerinfo 或者/sicker
登陆doctor--> /doctorinfo 或者/doctor
*/

export function getRedirectPath(type, header) {

    let path=''
    // type
    if (type === 'doctor') {
        path += '/doctor'
    } else {
        path += '/sicker'
    }
    // header
    if (!header) { // 没有值, 返回信息完善界面的path
        path += 'info'
    }

    return path //别忘了return
}