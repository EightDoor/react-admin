import { SysMenu, SysRole } from '@/type/sys/sys'
import { createModel } from '@rematch/core'
import { RootModel } from '../models'

type SysModelType = {
  menus: SysMenu[]
  roles: SysRole[]
}
export const sys = createModel<RootModel>()({
  state: {
    menus: [],
    roles: [],
  } as SysModelType,
  reducers: {},
})
