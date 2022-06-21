/* eslint-disable */
import axios from 'axios'
import { AzureCommunicationTokenCredential } from '@azure/communication-common'

export const createAutoRefreshingCredential = (userId, token) => {
  const options = {
    token,
    tokenRefresher: refreshTokenAsync(userId),
    refreshProactively: true
  }
  return new AzureCommunicationTokenCredential(options)
}

const refreshTokenAsync = async (userIdentity) => {
  const res = await axios({
    method: 'post',
    url: `http://localhost:8080/refreshToken/${userIdentity}`,
    data: {
      firstName: 'Fred',
      lastName: 'Flintstone'
    }
  })
  return res.data.token
}
