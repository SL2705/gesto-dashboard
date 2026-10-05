import { useEffect, useState } from 'react'
import { fetchStageDetails } from '../api'

export function useStageDetails(family, stage) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!family || !stage) {
      setData(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setHasError(false)

    fetchStageDetails(family, stage)
      .then((payload) => {
        if (!cancelled) setData(payload)
      })
      .catch(() => {
        if (!cancelled) setHasError(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [family, stage])

  return { data, loading, hasError }
}
