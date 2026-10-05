import { useCallback, useEffect, useState } from 'react'
import { fetchWipDashboard } from '../api'
import { FAMILIES } from '../constants'

export function useWipDashboards() {
  const [dataByFamily, setDataByFamily] = useState({})
  const [loading, setLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const results = await Promise.all(
        FAMILIES.map((family) => fetchWipDashboard(family.key)),
      )

      const next = {}
      results.forEach((payload, index) => {
        next[FAMILIES[index].key] = payload
      })

      setDataByFamily(next)
      setHasError(false)
      setLastUpdated(new Date())
    } catch {
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { dataByFamily, loading, hasError, lastUpdated, refresh }
}
