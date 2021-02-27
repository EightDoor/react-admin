import { SysMenu, SysRole, SysUserInfo } from '@/type/sys/sys'
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
      return payload
    },
  },
})
