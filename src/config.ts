export const DIAG_CONFIG = {
  timeoutMs: 8000,
  endpoints: {
    filePreview: 'https://httpbin.org/image/png',
    fileUpload: 'https://httpbin.org/post',
    clientApi: 'https://httpbin.org/get?role=client',
    doctorApi: 'https://httpbin.org/get?role=doctor',
    wechat: 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
  }
} as const;


