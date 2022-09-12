import axios from 'axios'

import { storage } from 'utils'

import { DOMAIN } from 'const'
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';
import { URLSearchParams } from 'url';

const create = () => {
  try {
    const jwt = storage.getToken()
    return axios.create({
      baseURL: `${DOMAIN}`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    })

  } catch (error) {
    return axios.create({
      baseURL: `${DOMAIN}`,
    })
  }
}

const checkError = (error: any) => {
  if (error?.response?.data) {
    toast(error.response.data.message)
  }
}

const callAPI = {
  get: async (route: string) => {
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.get(route)
      return data
    } catch (error: any) {
      checkError(error)
    }
  },
  post: async (route: string, body: {}) => {
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.post(route, body)
      return data
    } catch (error: any) {
      checkError(error)

    }
  },
  put: async (route: string, body: {}) => {
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.put(route, body)
      return data
    } catch (error: any) {
      checkError(error)
    }
  },
  patch: async (route: string, body: {}) => {
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.patch(route, body)
      return data
    } catch (error: any) {
      checkError(error)
    }
  },
  delete: async (route: string) => {
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.delete(route)
      return data
    } catch (error: any) {
      checkError(error)
    }
  }
}

export default callAPI