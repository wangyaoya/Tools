/**
 * 龙湖余量自动查询与提醒
 * 2025-08-08
 * https://github.com/wangyaoya/Tools
 */

// ==================== 配置模块 ====================
const CONFIG = {
    // API 配置
    API: {
        BASE_URL: "http://pay.wsdev.cn/api/SCADA/meterInfo/detail",
        TIMEOUT: 5000,
        HEADERS: {
            'Content-Type': 'application/json'
        }
    },
    
    // 默认参数
    DEFAULTS: {
        ALARM_BALANCE: 11,
        TITLE: '🔔龙湖余量查询用电量'
    },
    
    // 错误消息
    MESSAGES: {
        PARAM_MISSING: {
            title: '参数缺失',
            subtitle: 'WXOpenId未配置 ⚠️'
        },
        NETWORK_ERROR: {
            title: '❌查询失败',
            subtitle: '网络或接口异常'
        },
        NO_DATA: {
            title: '❌无数据',
            subtitle: '未获取到用电信息'
        },
        PARSE_ERROR: {
            title: '❌解析失败',
            subtitle: '解析用电信息失败'
        },
        LOW_BALANCE: {
            title: '⚠️电量提醒',
            subtitle: '余额不足，请及时充值'
        }
    },
    
    // 日志前缀
    LOG_PREFIXES: {
        START: '[开始查询]',
        REQUEST_ERROR: '[请求错误]',
        NO_DATA: '[无数据返回]',
        API_RESPONSE: '[接口返回]',
        PARSE_ERROR: '[解析错误]',
        SUFFICIENT_BALANCE: '[余额充足]'
    }
};

// ==================== 业务逻辑服务 ====================
class BalanceService {
    constructor($) {
        this.$ = $;
        this.title = CONFIG.DEFAULTS.TITLE;
    }

    /**
     * 验证必要参数
     * @param {string} wxOpenId - 微信OpenID
     * @returns {boolean} 参数是否有效
     */
    validateParams(wxOpenId) {
        if (!wxOpenId) {
            this.$.log('[参数缺失] WXOpenId 未配置');
            this.$.msg(this.title, '', CONFIG.MESSAGES.PARAM_MISSING.subtitle);
            return false;
        }
        return true;
    }

    /**
     * 构建请求参数
     * @param {string} wxOpenId - 微信OpenID
     * @param {string} meterId - 电表ID
     * @returns {object} 请求参数对象
     */
    buildRequestParams(wxOpenId, meterId) {
        const bodyObj = { WXOpenId: wxOpenId };
        if (meterId) {
            bodyObj.MeterID = meterId;
        }

        return {
            url: CONFIG.API.BASE_URL,
            timeout: CONFIG.API.TIMEOUT,
            headers: CONFIG.API.HEADERS,
            body: JSON.stringify(bodyObj)
        };
    }

    /**
     * 处理API响应数据
     * @param {string} data - API返回的原始数据
     * @param {number} alarmBalance - 报警阈值
     * @returns {object} 处理结果
     */
    processResponse(data, alarmBalance) {
        try {
            const body = JSON.parse(data);
            const amount = body.amount;
            
            if (typeof amount === 'undefined') {
                throw new Error('接口无amount字段');
            }

            const room = body.meterName || body.numplate || '未知房间';
            
            return {
                success: true,
                amount,
                room,
                isLowBalance: amount < alarmBalance
            };
        } catch (error) {
            this.$.log(CONFIG.LOG_PREFIXES.PARSE_ERROR, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 显示余额信息
     * @param {object} result - 处理结果
     * @param {number} alarmBalance - 报警阈值
     */
    displayBalanceInfo(result, alarmBalance) {
        const { amount, room, isLowBalance } = result;
        
        if (isLowBalance) {
            this.$.msg(
                this.title, 
                CONFIG.MESSAGES.LOW_BALANCE.title, 
                `房间：${room}\n剩余余额：${amount}`
            );
        } else {
            this.$.log(`${CONFIG.LOG_PREFIXES.SUFFICIENT_BALANCE} 房间：${room}，余额：${amount}`);
        }
    }

    /**
     * 处理错误情况
     * @param {string} errorType - 错误类型
     * @param {string} errorMessage - 错误信息
     */
    handleError(errorType, errorMessage = '') {
        const messageConfig = CONFIG.MESSAGES[errorType];
        if (messageConfig) {
            this.$.msg(this.title, messageConfig.title, messageConfig.subtitle);
        }
        
        if (errorMessage) {
            this.$.log(CONFIG.LOG_PREFIXES[errorType], errorMessage);
        }
    }

    /**
     * 执行余额查询
     * @param {string} wxOpenId - 微信OpenID
     * @param {string} meterId - 电表ID
     * @param {number} alarmBalance - 报警阈值
     */
    async queryBalance(wxOpenId, meterId, alarmBalance) {
        // 参数验证
        if (!this.validateParams(wxOpenId)) {
            return this.$.done();
        }

        this.$.log(`${CONFIG.LOG_PREFIXES.START} WXOpenId: ${wxOpenId}, MeterID: ${meterId || '无'}, 报警阈值: ${alarmBalance}`);

        // 构建请求参数
        const params = this.buildRequestParams(wxOpenId, meterId);

        // 发送请求
        this.$.post(params, (err, resp, data) => {
            if (err) {
                this.$.log(CONFIG.LOG_PREFIXES.REQUEST_ERROR, err);
                this.handleError('NETWORK_ERROR');
                return this.$.done();
            }

            if (!data) {
                this.$.log(CONFIG.LOG_PREFIXES.NO_DATA);
                this.handleError('NO_DATA');
                return this.$.done();
            }

            this.$.log(CONFIG.LOG_PREFIXES.API_RESPONSE, data);

            // 处理响应数据
            const result = this.processResponse(data, alarmBalance);
            
            if (result.success) {
                this.displayBalanceInfo(result, alarmBalance);
            } else {
                this.handleError('PARSE_ERROR', result.error);
            }

            this.$.done();
        });
    }
}

// ==================== 主程序入口 ====================
class LongHuBalanceChecker {
    constructor() {
        this.$ = new Env(CONFIG.DEFAULTS.TITLE, true);
        this.balanceService = new BalanceService(this.$);
    }

    /**
     * 获取配置参数
     * @returns {object} 配置参数对象
     */
    getConfigParams() {
        return {
            alarmBalance: Number(this.$.getdata('alarmbalance')) || CONFIG.DEFAULTS.ALARM_BALANCE,
            wxOpenId: this.$.getdata('WXOpenId'),
            meterId: this.$.getdata('MeterID')
        };
    }

    /**
     * 启动查询流程
     */
    async start() {
        try {
            const params = this.getConfigParams();
            await this.balanceService.queryBalance(
                params.wxOpenId,
                params.meterId,
                params.alarmBalance
            );
        } catch (error) {
            this.$.log('[主程序错误]', error.message);
            this.$.msg(CONFIG.DEFAULTS.TITLE, '❌程序异常', '查询过程中发生错误');
            this.$.done();
        }
    }
}

// ==================== 程序启动 ====================
const app = new LongHuBalanceChecker();
app.start();

// ==================== 环境兼容模块 ====================
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============📢系统通知📢=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `⚠️${this.name}, 错误!`, t.stack) : this.log("", `⚠️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! ⏱️ ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
