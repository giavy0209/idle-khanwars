import axios from 'axios'

import { storage } from 'utils'

import { DOMAIN } from 'const'
import axiosRetry from 'axios-retry';
import { toast } from 'react-toastify';

const create = () => {
  try {
    const jwt = storage.getToken()
    return axios.create({
      baseURL: `${DOMAIN}/api`,
      headers: {
        Authorization: `Bearer ${jwt}`,
      }
    })

  } catch (error) {
    return axios.create({
      baseURL: `${DOMAIN}/api`,
    })
  }
}

const checkError = (error: any) => {
  if (error?.response?.data?.code) {
    if (error?.response?.data?.code === 401) {
      toast('Session timeout, please login again')
    } else {
      toast(error.response.data.message)
    }
  }
}

interface Option {
  toastError?: boolean
  toastSuccess?: boolean
}

const callAPI = {
  get: async (route: string, options?: Option) => {
    const { toastError = true, toastSuccess = false } = options || {}
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.get(route)
      if (toastSuccess) {
        toast(data.message)
      }
      return data
    } catch (error: any) {
      if (toastError) {
        return checkError(error)
      }
      return error?.response?.data
    }
  },
  post: async <T = {}>(route: string, body: T, options?: Option) => {
    const { toastError = true, toastSuccess = false } = options || {}
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.post(route, body)
      if (toastSuccess) {
        toast(data.message)
      }
      return data
    } catch (error: any) {
      if (toastError) {
        return checkError(error)
      }
      return error?.response?.data
    }
  },
  put: async (route: string, body: {}, options?: Option) => {
    const { toastError = true, toastSuccess = false } = options || {}
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.put(route, body)
      if (toastSuccess) {
        toast(data.message)
      }
      return data
    } catch (error: any) {
      if (toastError) {
        return checkError(error)
      }
      return error?.response?.data
    }
  },
  patch: async (route: string, body: {}, options?: Option) => {
    const { toastError = true, toastSuccess = false } = options || {}
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.patch(route, body)
      if (toastSuccess) {
        toast(data.message)
      }
      return data
    } catch (error: any) {
      if (toastError) {
        return checkError(error)
      }
      return error?.response?.data
    }
  },
  delete: async (route: string, options?: Option) => {
    const { toastError = true, toastSuccess = false } = options || {}
    try {
      const client = create()
      axiosRetry(client, {
        retries: 3,
        retryDelay: retryCount => retryCount * 1000,
      })
      const { data } = await client.delete(route)
      if (toastSuccess) {
        toast(data.message)
      }
      return data
    } catch (error: any) {
      if (toastError) {
        return checkError(error)
      }
      return error?.response?.data
    }
  }
}

export default callAPI