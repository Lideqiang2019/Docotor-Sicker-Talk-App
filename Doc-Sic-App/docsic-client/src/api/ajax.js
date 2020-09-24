/*
使用axios 封装的ajax 请求函数
函数返回的是promise 对象
*/
import axios from 'axios'

export default function ajax(url='',data={},type='GET'){
    if(type==='GET'){
        // 只向后台请求数据
        // 准备url query 参数数据
        let dataStr = '';
        Object.keys(data).forEach(key=>{
            dataStr += key + '=' + data[key] + '&'; //准备url
            // console.log('dataStr',dataStr)
        })
        if(dataStr!==''){
            // 去掉最后一个‘&’
            dataStr = dataStr.substring(0,dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr  
        }
        // console.log('url',url)
        return axios.get(url)
    }else{
        // 发送post 请求
        return axios.post(url, data) // data: 包含请求体数据的对象
    }
}