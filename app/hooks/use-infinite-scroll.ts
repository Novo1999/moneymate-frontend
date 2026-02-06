import { useCallback, useEffect, useRef } from 'react'

type UseInfiniteScrollProp = {
  fetch: () => void
  hasNextPage: boolean
}

const useInfiniteScroll = ({ fetch, hasNextPage }: UseInfiniteScrollProp) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const isFetchingRef = useRef(false)

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const isIntersecting = entries[0]?.isIntersecting

      if (isIntersecting && hasNextPage && !isFetchingRef.current) {
        isFetchingRef.current = true
        fetch()
        setTimeout(() => {
          isFetchingRef.current = false
        }, 1000)
      }
    },
    [fetch, hasNextPage],
  )

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '100px',
    })

    const currentRef = loadMoreRef.current

    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
      observer.disconnect()
    }
  }, [handleIntersection])

  return { loadMoreRef }
}

export default useInfiniteScroll
