import { NavigationElements, NavigationElement } from './NavigationTypes'

export type ScreenActions =
    'insert' | 'remove' | 'append' | 'hide' | 'show' | 'collapse' | 'expand' | 'rename'

export type ScreenAction = {
    type: ScreenActions,
    screen?: NavigationElement,
    index?: number,
    name?: string,
}

export const ScreensReducer = (currentState: NavigationElements, action: ScreenAction) => {
    const index = typeof action.index === 'number' && 
        action.index >= 0 && action.index < currentState.length ? action.index : -1
    switch (action.type) {
        case 'insert': {
            if (index !== -1 && index < currentState.length && action.screen) {
                currentState.splice(index, 0, action.screen)
                return [...currentState]
            }
            return currentState
        }
        case 'append': {
            if (action.screen)
                return [...currentState, action.screen]
            return currentState
        }
        case 'remove': {
            // Removes children too
            let length = 1
            for (let i = index + 1; i < currentState.length; i++) {
                if (currentState[i].depth <= currentState[index].depth) break
                length++
            }
            if (index !== -1) {
                currentState.splice(index, length)
                return [...currentState]
            }
            return currentState
        }
        case 'hide': {
            if (index !== -1 && index < currentState.length) {
                currentState[index].isHidden = true
                return {...currentState}
            }
            return currentState
        }
        case 'show': {
            if (index !== -1 && index < currentState.length) {
                currentState[index].isHidden = false
                return {...currentState}
            }
            return currentState
        }
        case 'collapse': {
            if (index !== -1 && index < currentState.length) {
                currentState[index].isCollapsed = true
                return [...currentState]
            }
            return currentState
        }
        case 'expand': {
            if (index !== -1 && index < currentState.length) {
                currentState[index].isCollapsed = false
                return [...currentState]
            }
            return currentState
        }
        case 'rename': {
            if (index !== -1 && index < currentState.length && action.name) {
                currentState[index].label = action.name
                return {...currentState}
            }
            return currentState
        }        
    }
}
