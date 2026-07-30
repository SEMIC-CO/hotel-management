import { useEffect, useState } from 'react'
import { createParamsUrl } from '../../core/shared/utils/utils'
import { useUser } from './useUser'
import { useContainer } from './useContainer'

export const useCities = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [cities, setCities] = useState<T[]>([])
  const params = type === 'select' ? '?select=true' : ''

  useEffect(() => {
    let isMounted = true

    settingsRepository
      .getCities(params)
      .then((resp) => {
        if (isMounted) setCities(resp as T[])
      })
      .catch(() => {
        if (isMounted) setCities([])
      })

    return () => {
      isMounted = false
    }
  }, [params, settingsRepository])

  return cities
}

export const useProfiles = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [profiles, setProfiles] = useState<T[]>([])
  const params = type === 'select' ? '?select=true' : ''

  useEffect(() => {
    let isMounted = true

    settingsRepository
      .getProfiles(params)
      .then((resp) => {
        if (isMounted) setProfiles(resp as T[])
      })
      .catch(() => {
        if (isMounted) setProfiles([])
      })

    return () => {
      isMounted = false
    }
  }, [params, settingsRepository])

  return profiles
}

export const useBanks = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [banks, setBanks] = useState<T[]>([])
  const params = type === 'select' ? '?select=true' : ''

  useEffect(() => {
    let isMounted = true

    settingsRepository
      .getBanks(params)
      .then((resp) => {
        if (isMounted) setBanks(resp as T[])
      })
      .catch(() => {
        if (isMounted) setBanks([])
      })

    return () => {
      isMounted = false
    }
  }, [params, settingsRepository])

  return banks
}

export const useCenters = <T>(type = '') => {
  const { settingsRepository } = useContainer()
  const [centers, setCenters] = useState<T[]>([])
  const user = useUser()
  const params = `${createParamsUrl({ company_id: user.company_id })}${
    type === 'select' ? '&select=true' : ''
  }`

  useEffect(() => {
    let isMounted = true

    settingsRepository
      .getCenters(params)
      .then((resp) => {
        if (isMounted) setCenters(resp as T[])
      })
      .catch(() => {
        if (isMounted) setCenters([])
      })

    return () => {
      isMounted = false
    }
  }, [params, settingsRepository])

  return centers
}
