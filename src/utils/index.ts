import { SysDept } from '@/type/sys/sys'
import { cloneDeep } from 'lodash'

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
    item.title = item.name
    item.value = item.id
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

export { formatTree }
