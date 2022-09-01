import { HttpContext, HttpContextToken } from '@angular/common/http'

export const IS_TOAST_SUCCESS = new HttpContextToken<boolean>(() => true)
export const IS_TOAST_ERROR = new HttpContextToken<boolean>(() => true)
export const PAGINATION = new HttpContextToken<Pagination | undefined>(() => undefined)

export const setNotToastSuccess = new HttpContext().set(IS_TOAST_SUCCESS, false)
export const setNotToastError = new HttpContext().set(IS_TOAST_ERROR, false)

export const setQueryOptions = (pagination: Pagination) => new HttpContext().set(PAGINATION, pagination)