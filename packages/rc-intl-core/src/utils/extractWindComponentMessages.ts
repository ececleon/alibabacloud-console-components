import set from 'lodash/set'

import { IMessages } from '../types'

const defaultOptions = {
  namespace: '@wind_v2.base',
}

export default function extractWindComponentMessages(
  rawMessages: IMessages,
  options: { namespace: string } = defaultOptions
) {
  const result: IMessages = {}
  const { namespace } = options
  const prefix = `${namespace}.`

  Object.keys(rawMessages).forEach(key => {
    if (key.indexOf(prefix) === 0) {
      set(result, key.replace(prefix, ''), rawMessages[key])
    }
  })

  return result
}
