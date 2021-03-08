import { SysUserInfo } from '@/type/sys/sys'
import { createModel } from '@rematch/core'
import { RootModel } from '../models'

export const sys = createModel<RootModel>()({
  state: {
    menus: [],
    roles: [],
    userInfo: {},
  } as SysUserInfo,
  reducers: {
    setUserInfo(state, payload) {
      state.menus = payload.menus
      state.roles = payload.roles
      state.userInfo = payload.userInfo
      return state
    },
  },
})
