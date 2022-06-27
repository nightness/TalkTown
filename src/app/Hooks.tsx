import { useState, useMemo, useEffect, useRef } from 'react'

export const useValidatedState = (
    initialValue: any,
    isValid: (value: any) => boolean,
    invalidated: () => void
) => {
    const [value, setValue] = useState(isValid(initialValue) ? initialValue : undefined)
    const wrapSetValue = (value: any) =>
        isValid(value) ? setValue(value) : invalidated()
    return [value, wrapSetValue]
}

// Returns a decreaseCount function; and that decrements and returns the new value (doesn't re-render the component)
export const useDecrementer = (initialValue: number) =>
    useMemo(() => {
        let count = initialValue
        return () => --count
    }, [])

// Returns an increaseCount function; and that increments and returns the new value (doesn't re-render the component)
export const useIncrementer = (initialValue: number) =>
    useMemo(() => {
        let count = initialValue
        return () => ++count
    }, [])

// Returns [get, set] for a persistent value that's set function doesn't re-render the component
export const useValue = (initialValue: number) => {
    useMemo(() => {
        let currentValue = initialValue
        return [() => currentValue, (newValue: any) => (currentValue = newValue)]
    }, [])
}

// returns [currentState, previousState, setState]
export const useStateChanged = (initialState: any) => {
    const previousState = useRef()
    const [state, _setState] = useState(initialState)

    const setState = (_state: any) =>
        _setState((_previousState: any) => {
            previousState.current = _previousState
            return _state
        })

    return [state, previousState.current, setState]
}

// returns [{ state, added, removed }, setState]
export const useStateDifferences = (initialState: [any] | null | undefined) => {
    const previousState = useRef<[any] | null | undefined>()
    const [state, setState] = useState<[any] | null | undefined>(initialState)
    let added, removed, _previousValue: [any] | null | undefined

    // Update the previousState
    useEffect(() => {
        previousState.current = state
    }, [state])

    // Find elements added to the state
    added =
        state && previousState.current
            ? state.flatMap((value) => {
                const after = _previousValue
                _previousValue = value
                if (!previousState.current || previousState.current.includes(value))
                    return []
                return [{ after, value }]
            })
            : state
                ? [
                    {
                        after: undefined,
                        value: state[0],
                    },
                ]
                : []

    // Find elements removed from state
    _previousValue = undefined
    removed =
        state && previousState.current
            ? previousState.current.flatMap((value) => {
                const after = _previousValue
                _previousValue = value
                if (state.includes(value)) return []
                return [{ after, value }]
            })
            : []

    return [{ state, added, removed }, setState]
}
