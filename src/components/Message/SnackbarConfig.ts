export default interface SnackbarConfig {
  message: string
  type?: SnackbarType
  timeout?: number
}

export enum SnackbarType {
  INFO,
  WARN,
  ERROR
}
