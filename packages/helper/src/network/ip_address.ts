type ICallback = (ip?: string, isPublic?: boolean) => void

export interface IIPAddressOptions {
  iceServers?: RTCIceServer[]
}

export function getIPAddress(callback: ICallback, options: IIPAddressOptions = {}) {
  const RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
  if (!RTCPeerConnection) {
    return
  }
  const regexIpv4Local = /^(192\.168\.|169\.254\.|10\.|172\.(1[6-9]|2\d|3[01]))/
  const regexIpv4 = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
  const ipDuplicates = {}
  const defaultOptions = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
  options = { ...defaultOptions, ...options }
  const { iceServers } = options

  const pc = new RTCPeerConnection({ iceServers })

  function handleCandidate(candidate?: string) {
    if (!candidate) {
      callback()
      return
    }

    const match = regexIpv4.exec(candidate)
    if (!match) {
      return
    }
    const ipAddress = match[1]
    const isLocal = !!ipAddress.match(regexIpv4Local)
    if (ipDuplicates[ipAddress] === undefined) {
      callback(ipAddress, isLocal)
    }
    ipDuplicates[ipAddress] = true
  }

  pc.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
    if (e.candidate) {
      handleCandidate(e.candidate.candidate)
    } else {
      handleCandidate()
    }
  }

  try {
    pc.createDataChannel('sctp', {})
    // eslint-disable-next-line no-empty
  } catch (e) {}

  pc.createOffer().then((offer) => pc.setLocalDescription(offer).then(afterCreateOffer))

  function afterCreateOffer() {
    if (!pc || !pc.localDescription) {
      return
    }
    const lines = pc.localDescription.sdp.split('\n')
    lines.forEach((line) => {
      if (line && line.indexOf('a=candidate:') === 0) {
        handleCandidate(line)
      }
    })
  }
}
