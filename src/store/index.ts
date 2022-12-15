import Vue from 'vue'
import Vuex from 'vuex'

import { IAppState } from './modules/app'
import { IUserState } from './modules/user'
import { IErrorLogState } from './modules/error-log'
import { IPermissionState } from './modules/permission'
import { ISettings } from '@/store/modules/settings'

Vue.use(Vuex)

export interface IRootState {
  app: IAppState
  user: IUserState
  errorLog: IErrorLogState
  permission: IPermissionState
  settings: ISettings
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({})
