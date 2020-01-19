import externalsObj from './commonDeps'
import applyPlugin from './systemjs-amd-introp'

/** 模块加载路径定义 */
const moduleURLProtocals = {
  jsdelivr: (actualLoadPkgName, actualLoadPkgVersion) => {
    return {
      main: `https://cdn.jsdelivr.net/npm/${actualLoadPkgName}@${actualLoadPkgVersion}/dist/index.js`,
      doc: `https://cdn.jsdelivr.net/npm/${actualLoadPkgName}@${actualLoadPkgVersion}/dist/_doc.system.js`,
    }
  },
  unpkg: (actualLoadPkgName, actualLoadPkgVersion) => {
    return {
      main: `https://unpkg.com/${actualLoadPkgName}@${actualLoadPkgVersion}/dist/index.js`,
      doc: `https://unpkg.com/${actualLoadPkgName}@${actualLoadPkgVersion}/dist/_doc.system.js`,
    }
  },
}

interface IDocDef {
  prodPkgName: string
  actualLoadPkgName: string
  actualLoadPkgVersion: string
}

const cache: Map<string, Promise<any>> = new Map()

export default function loadDocModule(docDef: IDocDef) {
  const cacheKey = `${docDef.prodPkgName}/${docDef.actualLoadPkgName}/${docDef.actualLoadPkgVersion}`

  if (cache.has(cacheKey)) return cache.get(cacheKey)

  const protocalResolved = moduleURLProtocals.unpkg(
    docDef.actualLoadPkgName,
    docDef.actualLoadPkgVersion
  )

  const systemjsCtor: any = System.constructor
  const newSystemjsInstance = new systemjsCtor()
  applyPlugin(newSystemjsInstance)

  newSystemjsInstance.resolve = request => {
    if (request === protocalResolved.doc) {
      return protocalResolved.doc
    }
    // 在文档中请求包生产包名，则从cdn加载物料包
    if (request === docDef.prodPkgName) {
      return protocalResolved.main
    }
    // 在文档中请求环境依赖（比如react、styled-components）
    if (externalsObj[request]) {
      const module = externalsObj[request]
      // 实际上不会请求这个url，它只被作为模块的id
      const fakeURL = `https://test.taobao.com/${request}`
      newSystemjsInstance.set(fakeURL, module)
      return fakeURL
    }

    throw new Error(
      `[@alicloud/console-components-lib-documenter] Unexpected request: ${request}`
    )
  }

  const promise = newSystemjsInstance.import(protocalResolved.doc)
  cache.set(cacheKey, promise)
  return promise
}
