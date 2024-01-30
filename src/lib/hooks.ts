import { useEffect, useRef, useState, useTransition } from "react"

export const useServerAction = <P, R>(
  action: (_: P) => Promise<R>,
  onFinished?: (_: R | undefined) => void
): [(_: P) => Promise<R | undefined>, boolean] => {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<R>()
  const [finished, setFinished] = useState(false)
  const resolver = useRef<(value?: R | PromiseLike<R>) => void>()

  useEffect(() => {
    if (!finished) return

    if (onFinished) onFinished(result)
    resolver.current?.(result)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, finished])

  const runAction = async (args: P): Promise<R | undefined> => {
    startTransition(() => {
      action(args).then((data) => {
        setResult(data)
        setFinished(true)
      })
    })

    return new Promise((resolve) => {
      resolver.current = resolve
    })
  }

  return [runAction, isPending]
}

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches)
    }

    const result = matchMedia(query)
    result.addEventListener("change", onChange)
    setValue(result.matches)

    return () => result.removeEventListener("change", onChange)
  }, [query])

  return value
}
