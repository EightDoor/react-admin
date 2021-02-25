import { Models } from '@rematch/core'
import { sys } from './sys/SysModel'

export interface RootModel extends Models<RootModel> {
  sys: typeof sys
}

export const models: RootModel = { sys }
