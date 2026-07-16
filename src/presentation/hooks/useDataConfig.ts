import { useEffect, useState } from 'react'
import { createParamsUrl } from '../../core/shared/utils/utils'
import { useSessionStore } from '../../infrastructure/stores/session.store'
import { useContainer } from './useContainer'

let param = ''

export const useCities = <T>(type = '') => {
  if (type === 'select') {
    param = '?select=true'
  }
  const { settingsRepository } = useContainer()
  const [cities, setCities] = useState<T[]>([])
  useEffect(() => {
    settingsRepository.getCities(param).then((resp) => {
      console.log(resp)

      if (typeof resp !== 'undefined') {
        setCities(resp as T[])
      }
    })
  }, [type])

  return cities
}

export const useProfiles = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [profiles, setProfiles] = useState<T[]>([])

  useEffect(() => {
    if (type === 'select') {
      param = '?select=true'
    }

    settingsRepository.getProfiles(param).then((resp) => {
      if (typeof resp !== 'undefined') {
        setProfiles(resp as T[])
      }
    })
  }, [type])

  return profiles
}

export const useBanks = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [banks, setBanks] = useState<T[]>([])

  useEffect(() => {
    if (type === 'select') {
      param = '?select=true'
    }

    settingsRepository.getBanks(param).then((resp) => {
      if (typeof resp !== 'undefined') {
        setBanks(resp as T[])
      }
    })
  }, [type])

  return banks
}

export const useCenters = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [centers, setCenters] = useState<T[]>([])
  const { user } = useSessionStore((state) => state.values)
  useEffect(() => {
    param = createParamsUrl({ company_id: user.company_id })
    if (type === 'select') {
      param += '&select=true'
    }
    console.log(param)
    settingsRepository.getCenters(param).then((resp) => {
      if (typeof resp !== 'undefined') {
        setCenters(resp as T[])
      }
    })
  }, [type])

  return centers
}
