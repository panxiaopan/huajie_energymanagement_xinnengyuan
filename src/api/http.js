import axios from "axios";
import qs from 'qs';
import router from '../router';
import {
  Message
} from "element-ui"
import {
  baseUrl
} from "../../static/baseurl";

axios.interceptors.response.use(
  response => {
    // console.log("interceptors response", response)
    let code = response.data && response.data.head && response.data.head.code
    let msg = response.data && response.data.head && response.data.head.msg
    console.log("code msg", code, msg)

    // 0--成功 33022--重定向 99998--登录失效
    if (typeof code !== 'undefined') {
      if (+code === 0) {
        // if (message !== '') {
        //   Message.success({
        //     message
        //   })
        // }
      } else if (+code === 33022) {
        if (typeof window !== 'undefined') {
          window.location.href = msg
        }
        if (msg) {
          Message.warning({
            message: msg
          })
        }
      } else if (+code === 99998) {
        router.replace({
          path: '/login'
        })
        if (msg) {
          Message.warning({
            message: msg
          })
        }
      } else {
        if (msg) {
          Message.error({
            message: "请求失败: " + msg
          })
        }
      }
      // 针对其他服务器或跨域请求 根据status 和statusText 判定请求结果
    } else if (200 <= response.status && response.status < 400 && response.statusText.toLocaleLowerCase() === 'ok') {
      // if (message !== '') {
      //   Message.success({
      //     message
      //   })
      // }
    } else {
      Message.error({
        message: "请求失败"
      })
    }
    return response;
  },
  error => {
    // console.log("error++++++++++++", error)

    console.log(error)
    if (error.response) {
      Message.error({
        message: "请求链接失败"
      })
    }
    return Promise.reject(error.response.data) // 返回接口返回的错误信息
  });



/*
 * @params config  <Object>               请求参数对象url-接口地址 json-接口参数，method-请求方法，contentType-请求数据类型 
 * @return Promise <Object>               返回值 请求Promise
 */
export default function ({
  url = '',
  json = {},
  method = 'get',
  contentType = 'formUrlEncoded', // json, formUrlEncoded, formData
  responseType,
  timeout = 0
  // transformRequest:
}) {
  var config = {
    method,
    url,
    timeout,
    params: json,
    // 默认编码规则 冒号编码保留，空格编码转为+ 具体查看源码axios/lib/helpers/buildURL.js
    paramsSerializer: function (params) {
      return qs.stringify(params, {
        arrayFormat: 'repeat'
      })
    }
  }
  if (method === 'post' || method === 'put' || method === 'patch') {
    console.log('上传测试')


    config = {
      method,
      url: baseUrl + url,
      timeout,
      data: json
    }
    if (contentType === 'formUrlEncoded') {
      config['data'] = qs.stringify(json, {
        arrayFormat: 'repeat' //提交数组数据时 数据名中括号不含序号
      })
      config['headers'] = {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    }
  }
  if (responseType) {
    config['responseType'] = responseType
  }
  // console.log("axios config++++++++++++", config)
  return axios(config)
}
