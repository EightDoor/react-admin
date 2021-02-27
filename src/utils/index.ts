import { SysDept, SysUser, SysUserInfo } from '@/type/sys/sys'
import { message } from 'antd'
import { cloneDeep } from 'lodash'
import { Key } from 'react'
import { TOKEN } from './constant'
import { http } from './request'
import { store } from './store'

type AntTreeType<T> = T & TreeType

interface TreeType {
  title?: string
  value?: string
}
/**
 * 树形结构格式化
 */
function formatTree<T extends SysDept>(list: T[]): AntTreeType<T>[] {
  const result: AntTreeType<T>[] = cloneDeep(list)
  const map: any = {}
  const tree: AntTreeType<T>[] = []
  result.map((item) => {
    item.title = item.title || item.name
    item.value = item.id
    item.key = item.id
    return item
  })
  for (const element of result) {
    map[element.id] = element
  }
  for (const node of result) {
    if (node.parentId !== 0) {
      if (map[node.parentId].children) {
        map[node.parentId].children.push(node)
      } else {
        map[node.parentId].children = [node]
      }
    } else {
      tree.push(node)
    }
  }
  return tree
}

/**
 * 菜单类型
 * @param val  值
 */
const formatMenuType = (val?: Key) => {
  const data = {
    title: '-',
    color: 'blue',
    options: [1, 2, 3],
  }
  switch (Number(val)) {
    case 1:
      data.title = '目录'
      data.color = 'green'
      break
    case 2:
      data.title = '菜单'
      data.color = 'geekblue'
      break
    case 3:
      data.title = '按钮'
      data.color = 'gold'
      break
    default:
  }
  return data
}
/**
 * 获取的token
 */
const getTokenValue = () => store.getItem(TOKEN)
/**
 * 获取用户信息
 */
const getUserInfo = (): Promise<SysUserInfo> =>
  new Promise((resolve, reject) => {
    getTokenValue()
      .then((v) => {
        if (v) {
          // eslint-disable-next-line promise/no-nesting
          http
            .get<SysUserInfo>('auth/userInfo', {
              headers: {
                Authorization: `Bearer ${v}`,
              },
              params: {
                sort: 'orderNum,ASC',
              },
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((error) => {
              reject(error)
            })
        } else {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('token获取错误')
        }
      })
      .catch((error) => {
        reject(error)
      })
  })

/**
 * 退出登陆
 */
const logOutUtils = async () => {
  await store.clear()
  message.destroy()
  window.location.replace('/login')
}
export { formatTree, formatMenuType, getUserInfo, logOutUtils, getTokenValue }
