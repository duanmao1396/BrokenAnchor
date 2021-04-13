//const domain = 'http://202.182.98.92:5628/'
const domain = 'http://202.182.98.92:5628/'
/*MD5*/
import md5 from 'js-md5'
const MD5 = md5
/*存储相关*/
const getStorage = uni.getStorageSync

function setStorage(key, data, ifSync) {
  if (ifSync) {
    if (data === null) {
      uni.removeStorageSync(key)
    } else {
      uni.setStorageSync(key, data)
    }
  } else {
    if (data === null) {
      uni.removeStorage({
        key: key
      })
    } else {
      uni.setStorage({
        key: key,
        data: data
      })
    }
  }
}
/*time*/
function getTimestamp() {
  return Math.floor(Date.parse(new Date()) / 1000)
}
/*url生成*/
function getUrl(base, dict) {
  let params = Object.keys(dict).map(function(key) {
    return key + "=" + dict[key];
  }).join("&")
  return base + "?" + params
}
/*token*/
function getToken(security) {
  security = security || 3
  let res = {}
  let delta = getStorage('delta_ts')
  if (delta) {
    res.timestamp = String(getTimestamp() + delta)
  } else {
    res.timestamp = String(getTimestamp())
  }
  let key = res.timestamp.slice(0, security)
  do {
    res.token = String(Math.floor(1e12 * Math.random()))
  } while (MD5(res.token + res.timestamp).slice(0, security) != key)
  return res
}
/*错误处理*/
function errorConfirm(message) {
  uni.showModal({
    title: '错误',
    content: message,
    showCancel: false,
    success() {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  })
}
/*Ajax相关*/
async function post(url, form, toast, method, Succ, Fail) {
  Fail = Fail || function() {}
  const trueFailRes = {
    statusCode: 100,
    data: {
      "status": 100,
      "msg": "No Network",
      "data": null
    }
  }
  if (method == 'noAuth') {
    let auth = getToken()
    form.tokenvalue = auth.token
    form.tokenstamp = auth.timestamp
  } else if (method == 'needAuth') {
    if (!getStorage('logged')) {
      uni.showToast({
        icon: 'none',
        title: '请先登录',
        duration: 1800
      })
      if (Succ) return
      const noAuthRes = {
        statusCode: 403,
        data: {
          "status": 403,
          "msg": "Not Authed",
          "data": null
        }
      }
      return Promise.resolve([noAuthRes, null])
    }
    form.AuthID = getStorage('AuthID')
    form.AuthTime = getStorage('AuthTime')
    form.AuthKey = getStorage('AuthKey')
    form.AuthType = getStorage('AuthType')
    form.AuthMsg = getStorage('AuthMsg')
  }
  if (toast != '') {
    uni.showLoading({
      title: toast
    })
  }
  var [err, res] = await uni.request({
    url: domain + url,
    data: form,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  if (err) {
    res = trueFailRes
  }
  let result
  let errInfo
  switch (res.statusCode) {
    case 100:
      uni.showToast({
        icon: 'none',
        title: '网络错误',
        duration: 2000
      })
      result = null
      errInfo = res
      break
    case 200:
      result = res.data.data
      errInfo = null
      break
    case 402:
      setStorage('delta_ts', (getStorage('delta_ts') || 0) + res.data.data, true)
      let auth = getToken()
      form.tokenvalue = auth.token
      form.tokenstamp = auth.timestamp
      console.log(auth)
      var [err2, res2] = await uni.request({
        url: domain + url,
        data: form,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      if (err2) {
        res2 = trueFailRes
      }
      switch (res2.statusCode) {
        case 200:
          console.log(res2)
          result = res2.data.data
          errInfo = null
          break
        default:
          result = null
          errInfo = res2
      }
      break
    case 403:
      setStorage('AuthID', null)
      setStorage('AuthTime', null)
      setStorage('AuthKey', null)
      setStorage('AuthType', null)
      setStorage('AuthMsg', null)
      result = null
      errInfo = res
      break
    default:
      result = null
      errInfo = res
  }
  uni.hideLoading()
  if (Succ) {
    if (result) {
      Succ(result)
    } else {
      Fail(errInfo)
    }
  } else {
    return Promise.resolve([errInfo, result])
  }
}

async function get(url, toast, method, Succ, Fail) {
  let form = {}
  Fail = Fail || function() {}
  const trueFailRes = {
    statusCode: 100,
    data: {
      "status": 100,
      "msg": "No Network",
      "data": null
    }
  }
  if (method == 'noAuth') {
    let auth = getToken()
    form.tokenvalue = auth.token
    form.tokenstamp = auth.timestamp
  } else if (method == 'needAuth') {
    if (!getStorage('AuthKey')) {
      uni.showToast({
        icon: 'none',
        title: '请先登录',
        duration: 1800
      })
      if (Succ) return
      const noAuthRes = {
        statusCode: 403,
        data: {
          "status": 403,
          "msg": "Not Authed",
          "data": null
        }
      }
      return Promise.resolve([noAuthRes, null])
    }
    form.AuthID = getStorage('AuthID')
    form.AuthTime = getStorage('AuthTime')
    form.AuthKey = getStorage('AuthKey')
    form.AuthType = getStorage('AuthType')
    form.AuthMsg = getStorage('AuthMsg')
  }
  if (toast != '') {
    uni.showLoading({
      title: toast
    })
  }
  var [err, res] = await uni.request({
    url: domain + url,
    data: form,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
  if (err) {
    res = trueFailRes
  }
  let result
  let errInfo
  switch (res.statusCode) {
    case 100:
      uni.showToast({
        icon: 'none',
        title: '网络错误',
        duration: 2000
      })
      result = null
      errInfo = res
      break
    case 200:
      result = res.data.data
      errInfo = null
      break
    case 402:
      setStorage('delta_ts', (getStorage('delta_ts') || 0) + res.data.data, true)
      let auth = getToken()
      form.tokenvalue = auth.token
      form.tokenstamp = auth.timestamp
      console.log(auth)
      var [err2, res2] = await uni.request({
        url: domain + url,
        data: form,
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
      if (err2) {
        res2 = trueFailRes
      }
      switch (res2.statusCode) {
        case 200:
          console.log(res2)
          result = res2.data.data
          errInfo = null
          break
        default:
          result = null
          errInfo = res2
      }
      break
    case 403:
      setStorage('AuthID', null)
      setStorage('AuthTime', null)
      setStorage('AuthKey', null)
      setStorage('AuthType', null)
      setStorage('AuthMsg', null)
      result = null
      errInfo = res
      break
    default:
      result = null
      errInfo = res
  }
  uni.hideLoading()
  if (Succ) {
    if (result) {
      Succ(result)
    } else {
      Fail(errInfo)
    }
  } else {
    return Promise.resolve([errInfo, result])
  }
}
/*错误处理*/
function errorGoIndex() {
  uni.showToast({
    title: '似乎发生了什么问题，程序即将返回主页',
    icon: 'none',
    mask: true,
    duration: 2000
  })
  setTimeout(function() {
    uni.reLaunch({
      url: '/pages/index/index'
    })
  }, 1800)
}
/*交互*/
function toast(content, time, icon) {
  time = time || 2000
  icon = icon || 'none'
  uni.showToast({
    title: content,
    icon: icon,
    duration: time
  })
}
/*信息传输*/
function setSession(key, data) {
  getApp().globalData.session = {
    timestamp: getTimestamp(),
    key: key,
    data: data
  }
}

function getSession(key) {
  let session = getApp().globalData.session
  if (!session) return null
  if (Math.abs(session.timestamp - getTimestamp()) > 3) return null
  if (session.key != key) return null
  getApp().globalData.session = null
  return session.data
}

export default {
  MD5,
  getStorage,
  setStorage,
  getUrl,
  post,
  get,
  errorGoIndex,
  setSession,
  getSession,
  toast
}
