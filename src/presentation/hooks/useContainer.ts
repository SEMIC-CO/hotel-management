import { useMemo } from 'react'
import type { AppContainer } from '../../core/di/Container'
import { container } from '../../infrastructure/di/container'

export const useContainer = (): AppContainer => {
  return useMemo(() => container, [])
}
