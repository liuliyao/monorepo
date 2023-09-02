import axios from 'axios'
import { getHost } from 'src/common/utils/var'
import { DefineEnvMode } from '../common/define/types'
import { getIPAddress, IIPAddressOptions } from './ip_address'

interface IVPNResponse {
  readonly code: number
  readonly msg: string
  readonly data?: IVPNData
}

interface ISecurity {
  vpn: boolean | null
  proxy: boolean | null
  relay: boolean | null
}

interface ILocation {
  city: string | null
  region: string | null
  country: string | null
}

export interface IVPNData {
  ip: string
  security: ISecurity | null
  location: ILocation | null
}

export interface IVPNOptions extends IIPAddressOptions {
  env?: DefineEnvMode
}

class VPN {
  private _options: IVPNOptions

  constructor(options: IVPNOptions = {}) {
    this._options = options
  }

  detect(): Promise<IVPNData | undefined> {
    return new Promise((resolve, reject) => {
      const { iceServers, env = DefineEnvMode.dev } = this._options
      let publicIP: string | null = null
      getIPAddress(
        async function (ip, isLocal) {
          if (!ip || isLocal || publicIP) {
            return
          }
          publicIP = ip
          try {
            const res = await axios.get<IVPNResponse>(`${getHost('VPN_HOST')[env]}/c/v1/ip/${publicIP}`, {
              timeout: 10_000,
            })
            if (res.data && res.data.code === 0) {
              resolve(res.data.data)
              return
            }
            reject()
          } catch (e) {
            reject()
          }
        },
        { iceServers }
      )
    })
  }

  async isProxy() {
    try {
      const data = await this.detect()
      return !!data?.security?.proxy
    } catch (e) {
      return false
    }
  }
}

export default VPN
