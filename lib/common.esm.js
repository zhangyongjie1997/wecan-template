import * as $ from 'jquery';
import * as md5 from 'md5-js';


Date.prototype.Format = function(format) {
  format = format || "yyyy-MM-dd hh:mm:ss";
  var o = {
    "M+": this.getMonth() + 1,
    "d+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "q+": Math.floor((this.getMonth() + 3) / 3),
    S: this.getMilliseconds()
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

function webViewJSBridgeReady(callback) {
  if (window.WebViewJavascriptBridge) {
    callback(WebViewJavascriptBridge);
  } else {
    document.addEventListener(
      "WebViewJavascriptBridgeReady",
      function() {
        callback(WebViewJavascriptBridge);
      },
      false
    );
  }
}
var ua = navigator.userAgent;
var MD5KEY = "0c09bc02-c74e-11e2-a9da-00163e1210d9",
  weixin_url,
  open_url,
  appid,
  park_url,
  activity_url;
var common = {
  version: "1.0.0",
  activityId: "activity_anniversary",
  isWeixin: ua.toLowerCase().match(/MicroMessenger/i) == "micromessenger",
  isClient: ua.indexOf("Edaijia/") !== -1,
  defaultAjaxOption: {
    type: "GET",
    dataType: "json",
    timeout: 5000
  },
  defaultRequestData: {
    appkey: "51000031",
    from: "02050050",
    udid: "20000001",
    ver: 3
  }
};

var wxData = {
  title: "e代驾的七周年豪礼大放送，速来领取！",
  link: location.origin + "/2018/7-years/index.html",
  desc: "e代驾七周年礼包，献给每一位亲爱的你。",
  imgUrl: location.origin + "/2018/7-years/images/gift.png"
};

if (location.href.indexOf("h5.edaijia") === -1) {
  weixin_url = "//weixin.d.edaijia.cn/";
  appid = "wx34f941dbe86392a3";
  open_url = "//open.d.api.edaijia.cn/";
  activity_url = "//activity.d.edaijia.cn/";
  park_url = "https://park.d.edaijia.cn/";
} else {
  weixin_url = "//weixin.edaijia.cn/";
  appid = "wx8c8df4a3218410e0";
  open_url = "//open.api.edaijia.cn/";
  activity_url = "//activity.edaijia.cn/";
  park_url = "https://park.edaijia.cn/";
}

common.urlGet = function() {
  var args = {};
  var query = location.search.substring(1);
  var pairs = query.split("&");
  for (var i = 0; i < pairs.length; i++) {
    var pos = pairs[i].indexOf("=");
    if (pos == -1) continue;
    var argname = pairs[i].substring(0, pos);
    var value = pairs[i].substring(pos + 1);
    value = decodeURIComponent(value);
    args[argname] = value;
  }
  return args;
};

function getSig(param) {
  var paramStr = [],
    paramStrSorted = [];
  for (var n in param) {
    paramStr.push(n);
  }
  paramStr = paramStr.sort();
  $(paramStr).each(function(index) {
    paramStrSorted.push(this + param[this]);
  });
  var text = MD5KEY + paramStrSorted.join("") + MD5KEY;
  return md5(text).slice(0, 30);
}

function stringify(data) {
  var value = [];
  for (prop in data) {
    value.push(prop + "=" + encodeURIComponent(data[prop]));
  }
  return value.join("&");
}

function request(_options, hideLoading, hideToast) {
  var options = $.extend({}, common.defaultAjaxOption, _options);
  var data = $.extend({}, common.defaultRequestData, options.data);
  var loading = common.loading();
  data.timestamp = new Date().Format();
  data.sig = getSig(data);
  options.data = stringify(data);

  !hideLoading && loading.show();
  return $.ajax(options)
    .done(function() {
      !hideLoading && loading.hide();
    })
    .fail(function() {
      !hideLoading && loading.hide();
      common.toast("网络异常,请检查网络");
    });
}

function parkRequest(_options, hideLoading, hideToast) {
  _options.url = park_url + _options.url;
  return request(_options, hideLoading, hideToast);
}
common.parkRequest = parkRequest;

function weixinRequest(_options, hideLoading, hideToast) {
  _options.url = weixin_url + _options.url;
  return request(_options, hideLoading, hideToast);
}
common.weixinRequest = weixinRequest;

function openRequest(_options, hideLoading, hideToast) {
  _options.url = open_url + _options.url;
  return request(_options, hideLoading, hideToast);
}
common.openRequest = openRequest;

function activityRequest(_options, hideLoading, hideToast) {
  _options.url = activity_url + _options.url;
  return request(_options, hideLoading, hideToast);
}
common.activityRequest = activityRequest;

function getLocalStroge(key) {
  return localStorage.getItem("worldCup-" + key + "-" + common.version);
}

function setLocalStroge(key, value) {
  localStorage.setItem("worldCup-" + key + "-" + common.version, value);
}

function removeLocalStroge(key) {
  localStorage.removeItem("worldCup-" + key + "-" + common.version);
}

function clearLocalStroge() {
  localStorage.clear();
}

common.getLocalStroge = getLocalStroge;
common.setLocalStroge = setLocalStroge;
common.removeLocalStroge = removeLocalStroge;

function createToast(text, notAutoHide) {
  var notAutoHide = notAutoHide == "notAutoHide";
  if ($(".container-toast").length < 1) {
    var toast = $('<div class="toast-layer"><div class="container-toast">' + text + "</div></div>");
    toast.appendTo("body").fadeIn("fast", function() {
      if (notAutoHide) return;
      setTimeout(function() {
        toast.fadeOut("fast", function() {
          toast.remove();
        });
      }, 1200);
    });
  } else {
    $(".container-toast").html(text);
  }
}

function createModel(text) {
  $("body").append('<div class="model-layer"><div class="model-inner">' + text + "</div></div>");
}

function statusModel(status) {
  if (status == "begin") {
    $("body").append('<div class="status-layer"><div class="container-toast">活动未开始</div></div>');
  } else {
    $("body").append('<div class="status-layer"><div class="container-toast">活动已结束</div></div>');
  }
}
function statusModel2(text) {
  $("body,html").css({ height: "100%", overflow: "hidden", position: "fixed," });
  $("body").append('<div class="status-layer"><div class="container-toast">' + text + "</div></div>");
  $(".status-layer").on("touchmove", function(e) {
    e.preventDefault();
  });
}

function Loading() {
  this.elem = $('<div class="loading-layer"><div class="loading-inner"><img src="img/loading.png" /></div></div>');
}
Loading.prototype.show = function() {
  this.elem.appendTo("body").fadeIn("fast");
};
Loading.prototype.hide = function() {
  var that = this;
  this.elem.fadeOut("fast", function() {
    that.elem.remove();
  });
};
common.statusModel = statusModel;
common.statusModel2 = statusModel2;
common.request = request;
common.toast = createToast;
common.model = createModel;
common.loading = function() {
  return new Loading();
};

common.actions = {
  wxAuth: function() {
    // 通过 jssdk 配置信息
    return weixinRequest({ url: "wechat/auth", data: { url: location.href.split("#")[0] } });
  },
  wxGetOpenId: function(code) {
    // 通过code 获取openid
    return weixinRequest({ url: "wechat/forward", data: { code: code, type: "openid" } });
  },
  wxGetUser: function(openId) {
    // 通过openid获取用户信息
    return weixinRequest({ url: "weixin/user/get", data: { openId: openId } });
  },
  wxBind: function(data) {
    // 微信绑定
    return weixinRequest({ url: "weixin/bind", type: "POST", data: data });
  },
  getCaptcha: function(data) {
    // 获取验证码
    return parkRequest({ url: "activity/sendCode", data: data });
  },
  login: function(data) {
    // 登录
    return openRequest({ url: "customer/login", data: data });
  },
  queryPrizeStatus: function(data) {
    // 查询活动状态
    return activityRequest({ url: "v2/activity/detail", data: data });
  }
};

function getOpenId() {
  var dtd = $.Deferred(),
    openId = getLocalStroge("openId"),
    urlGet = common.urlGet(),
    redirectUri = encodeURIComponent(
      location.href
        .replace(/#.*/, "")
        .replace(/(code|state)=[^&]+[&]?/g, "")
        .replace(/&$/, "")
    ),
    baseUrl =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      appid +
      "&redirect_uri=" +
      redirectUri +
      "&response_type=code&scope=snsapi_base&state=null#wechat_redirect";
  if (openId) {
    dtd.resolve(openId);
  } else if (urlGet.code) {
    common.actions.wxGetOpenId(urlGet.code).done(function(res) {
      if (res.openid) {
        setLocalStroge("openId", res.openid);
        dtd.resolve(res.openid);
      } else {
        location.replace(baseUrl);
      }
    });
  } else {
    location.replace(baseUrl);
  }
  return dtd.promise();
}

function adaptWeixin(dtd) {
  getOpenId().done(function(openId) {
    common.actions.wxGetUser(openId).done(function(res) {
      if (res.code == 0) {
        if (res.data.token) {
          setLocalStroge("phone", res.data.phone);
          setLocalStroge("token", res.data.token);
        } else {
          res.data = { token: "", phone: "" };
        }
        dtd.resolve(res.data);
      } else {
        dtd.resolve({ token: "", phone: "" });
      }
    });
  });
}

function weixinShare() {
  common.actions.wxAuth().done(function(config) {
    config.jsApiList = [
      "checkJsApi",
      "onMenuShareTimeline",
      "onMenuShareAppMessage",
      "onMenuShareQQ",
      "onMenuShareWeibo",
      "hideMenuItems",
      "showMenuItems",
      "hideAllNonBaseMenuItem",
      "showAllNonBaseMenuItem",
      "translateVoice",
      "startRecord",
      "stopRecord",
      "onRecordEnd",
      "playVoice",
      "pauseVoice",
      "stopVoice",
      "uploadVoice",
      "downloadVoice",
      "chooseImage",
      "previewImage",
      "uploadImage",
      "downloadImage",
      "getNetworkType",
      "openLocation",
      "getLocation",
      "hideOptionMenu",
      "showOptionMenu",
      "closeWindow",
      "scanQRCode",
      "chooseWXPay",
      "openProductSpecificView",
      "addCard",
      "chooseCard",
      "openCard"
    ];
    wx.config(config);
    wx.ready(function() {
      wx.onMenuShareAppMessage(wxData);
      wx.onMenuShareTimeline(wxData);
      wx.onMenuShareQQ(wxData);
    });
  });
}

function adaptClient(dtd) {
  webViewJSBridgeReady(function(bridge) {
    bridge.init(function(message, responseCallback) {
      if (responseCallback) {
        responseCallback();
      }
    });
    common.bridge = bridge; // bridge 全局
    bridge.callHandler("showShareMenu");
    bridge.callHandler("title", document.title);
    bridge.callHandler("initShareData", wxData);

    bridge.callHandler("getUser", "", function(json) {
      json = typeof json === "string" ? eval("(" + json + ")") : json;
      if (json && json.token) {
        dtd.resolve({ phone: json.phone, token: json.token });
      } else {
        dtd.resolve({ token: "", phone: "" });
      }
    });
  });
}

function getToken() {
  var dtd = $.Deferred();
  var token = getLocalStroge("token"),
    phone = getLocalStroge("phone");
  if (common.isWeixin) weixinShare();
  if (token && phone) {
    dtd.resolve({ token: token, phone: phone });
  } else if (common.isWeixin) {
    adaptWeixin(dtd);
  } else if (common.isClient) {
    adaptClient(dtd);
  } else {
    dtd.resolve({ token: "", phone: "" });
  }
  return dtd.promise();
}
common.init = getToken;
//if (common.isWeixin) weixinShare();
window.common = common;
window.$ = $;

export default common;
