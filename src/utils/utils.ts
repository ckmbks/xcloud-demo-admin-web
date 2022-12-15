// 获取已知节点的父节点
export function getParentNode(
  sourceData: any,
  targetNodeId: number | string,
  { value = 'value', children = 'children', parentId = 'parentId' } = {}
) {
  const arrRes:any = []
  if (sourceData.length === 0) {
    return arrRes
  }
  const rec = (data: any, nodeId: number | string) => {
    data.forEach((node: any) => {
      if (node[value] === nodeId) {
        arrRes.unshift(node)
        rec(sourceData, node[parentId])
      } else {
        if (node[children] && node[children].length > 0) {
          rec(node[children], nodeId)
        }
      }
    })
    return arrRes
  }
  return rec(sourceData, targetNodeId)
}
