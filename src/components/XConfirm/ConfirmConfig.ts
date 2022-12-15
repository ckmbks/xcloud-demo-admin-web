export default interface ConfirmConfig {
  alert?: boolean,
  title?: string,
  content: string,
  confirm: () => Promise<any>
  cancel?: () => any
}
