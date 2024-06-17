export type HttpRequest = {
  params?: any
  body?: any
  query?: any
}

export type HttpResponse = {
  statusCode: number
  body: any
}

export interface ControllerInterface {
  execute: (input: HttpRequest) => Promise<HttpResponse>
}
