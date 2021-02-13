import { SysDept } from '@/type/sys/sys'
import { cloneDeep } from 'lodash'
import { Key } from 'react'

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

export { formatTree, formatMenuType }
