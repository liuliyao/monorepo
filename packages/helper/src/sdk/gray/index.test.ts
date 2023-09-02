import { DefineEnvMode } from '../../common/define/types'
import { matchWhiteList } from './helper'

describe('test match white list', () => {
  test('match true', () => {
    expect(matchWhiteList(`https://study.tenclass.net.cn/admin/api/v1/course_content/live/users?live_number=1539782682880868352&order=&order_field=&orderIndex=`, DefineEnvMode.prod)).toBe(true)
    expect(matchWhiteList(`https://live.tenclass.net.cn/b/api/v1/user_list/private_msg?rid=1539782682880868352&uid=szrheqn2u-admin406&seller_role=false`, DefineEnvMode.prod)).toBe(true)
    expect(matchWhiteList(`https://bbg-crm.tenclass.net.cn/admin/api/v1/user/roles`, DefineEnvMode.prod)).toBe(true)
    expect(matchWhiteList(`https://ucenter.tenclass.net.cn/admin/api/v1/user/random_list`, DefineEnvMode.prod)).toBe(true)
  })
  test('match false', () => {
    expect(matchWhiteList(`https://arms-retcode.aliyuncs.com/r.png?t=api&times=1&page=pichu.tenclass.com%2F&tag=&release=&environment=prod&begin=1640767920096&api=janus.tenclass.com%2Fstudy-center%2Fadmin%2Fapi%2Fv1%2Fsale_workbench%2Ftodo_statistic&success=1&time=78&code=200&msg=ok&traceId=&pv_id=5jk7OxLFr0RahjuC8sw3v1Ojt8gg&domain=pichu.tenclass.com&flag=1&sr=1920x1080&vp=1920x347&ct=4g&uid=406&sid=eCk0qxvzrCgaLds6Lbv6l2nkg49w&pid=hpmew8xjez%4093802274fcd874a&_v=1.8.27&username=%E8%B0%A2%E4%B8%9A%E6%B1%9F&sampling=1&dl=https%3A%2F%2Fpichu.tenclass.com%2F%3Fquery_type%3D1&z=kxrausvy&post_res=`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://log-1.talk-fun.com/stats/socket.html?uri=https://chat-gz-g1b.talk-fun.com&socket_id=0&status=connect_error&xid=512498135&roomid=1208059&reason=Error:%20xhr%20poll%20error&uid=374c39eb1aff0aa13c9415364896e17a&pid=14551&rid=1208059&ht_tstamp=1640744966544`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://longsee.feishu.cn/docs/doccnDGVnAM1XBpQJAcDNDDsRSf#ml8RCZ`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://gitlab.weike.fm/bbg/study-fe/-/blob/master/package-lock.json`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay-prod.nuwaclass.com/live/10754.m3u8`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay-prod.nuwaclass.com/live/10754.flv`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://api.webhref.com/`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay-real-prod.tenclass.net.cn/live/19989_hd1080.m3u8?ticket=8f00b204e9800998_1655950646403`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay.nuwaclass.net/live/19989_hd1080.m3u8?ticket=8f00b204e9800998_1655950646403`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay-aliyun.tenclass.net.cn/live/19989_hd1080.m3u8?ticket=8f00b204e9800998_1655950646403`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay-prod.tenclass.net.cn/live/19989_hd1080.m3u8?ticket=8f00b204e9800998_1655950646403`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://liveplay-real-prod.tenclass.net.cn/live/19989_hd1080.m3u8?ticket=8f00b204e9800998_1655950646403`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://log-report.tenclass.net.cn/l?bbg_r_t=3&bbg_r_k=2`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://log-report.tenclass.net.cn/r`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://report.tenclass.net.cn/l`, DefineEnvMode.prod)).toBe(false)
    expect(matchWhiteList(`https://ip.tenclass.net.cn/ip/json`, DefineEnvMode.prod)).toBe(false)
  })
})
