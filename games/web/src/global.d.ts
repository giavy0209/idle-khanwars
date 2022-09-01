declare global {
  interface Pagination {
    page?: number
    limit?: number
    sort?: `${string}:${'asc' | 'desc'}`[]
  }
}

export { }

