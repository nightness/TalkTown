import {
  DrawerNavigationState,
  NavigationHelpers,
  ParamListBase
} from '@react-navigation/native'
import React, { createContext, useState } from 'react'
import { UserClaimsResponse } from 'src/database/firebase/types'
import {
  Badges,
  NavigationElements,
  NavigationElement
} from './NavigationTypes'
import { ScreenActions } from './RoutingReducer'

interface Props {
  children: JSX.Element | JSX.Element[]
  activeClaims?: UserClaimsResponse
  screens: NavigationElements
  screensDispatch: React.Dispatch<any>
}

interface ScreenManagerType {
  removeScreen: (index: number) => void
  insertScreen: (index: number, screen?: NavigationElement) => void
  appendScreen: (screen?: NavigationElement) => void
  getScreenIndex: (screenPath: number[]) => number | undefined
  getScreenPath: (index: number) => number[] | undefined
  addChild: (
    parentScreenPath: number[],
    screenConfig: NavigationElement
  ) => number
  insertChild: (
    screenPath: number[],
    index: number,
    screenConfig: NavigationElement
  ) => void
  removeChild: (parentScreenPath: number[], removeChildIndex: number) => void
  collapse: (child: number | number[]) => void
  expand: (node: number | number[]) => void
  hide: (node: number | number[]) => void
  show: (node: number | number[]) => void
  rename: (node: number | number[], label: string) => void
}

type ContextType = {
  badges: Badges
  setBadge: (routeName: string, value: string) => void
  screens: NavigationElements
  ScreenManager?: ScreenManagerType
  hamburgerBadge?: string
  activeClaims?: UserClaimsResponse
  navigation?: NavigationHelpers<any>
  state?: DrawerNavigationState<ParamListBase>
  screenIndex: number
  setDrawerContent: (
    navigation: NavigationHelpers<any>,
    state: DrawerNavigationState<ParamListBase>
  ) => void
}

export const DrawerContext = createContext<ContextType>({
  screenIndex: -1,
  badges: {},
  screens: [],
  setBadge: (routeName: string, value: string) => undefined,
  setDrawerContent: (
    navigation: NavigationHelpers<any>,
    state: DrawerNavigationState<ParamListBase>
  ) => undefined
})

const sameElements = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i])

export const DrawerProvider = ({ children, screens, activeClaims, screensDispatch }: Props) => {
  const [badges, setBadges] = useState<Badges>({})
  const [navigation, setNavigation] = useState<NavigationHelpers<any>>()
  const [state, setState] = useState<DrawerNavigationState<ParamListBase>>()
  const screenIndex = state && state.index >= 0 ? state.index : -1

  const setBadge = (routeName: string, value: string): void => {
    const newState = { ...badges }
    newState[routeName] = value
    setBadges(newState)
  }

  const setDrawerContent = (
    currentNavigation: NavigationHelpers<any>,
    state: DrawerNavigationState<ParamListBase>
  ) => {
    if (currentNavigation !== navigation) setNavigation(currentNavigation)
    setState(state)
  }

  const nodeHandler = (
    type: ScreenActions,
    node: number | number[],
    name?: string
  ) => {
    if (Array.isArray(node)) {
      const index = ScreenManager.getScreenIndex(node)
      if (index === undefined) throw new Error(`${type}: path is invalid`)
      node = index
    }
    // At this point node is for sure an index
    const dispatch = { type, index: node, name }
    screensDispatch(dispatch)
  }

  const dispatcher = (
    type: ScreenActions,
    index?: number,
    screen?: NavigationElement
  ) => screensDispatch({ type, index, screen })

  const ScreenManager: ScreenManagerType = {
    removeScreen: (index: number) => {
      if (index === screenIndex && navigation && navigation.canGoBack())
        navigation.goBack()
      screensDispatch({ type: 'remove', index })
    },
    insertScreen: (index: number, screen?: NavigationElement) =>
      screensDispatch({ type: 'insert', index, screen }),
    appendScreen: (screen?: NavigationElement) =>
      screensDispatch({ type: 'append', screen }),
    collapse: (node: number | number[]) => nodeHandler('collapse', node),
    expand: (node: number | number[]) => nodeHandler('expand', node),
    hide: (node: number | number[]) => nodeHandler('hide', node),
    show: (node: number | number[]) => nodeHandler('show', node),
    rename: (node: number | number[], label: string) =>
      nodeHandler('rename', node, label),
    addChild: (parentScreenPath: number[], screenConfig: NavigationElement) => {
      const parentIndex = ScreenManager.getScreenIndex(parentScreenPath)
      if (parentIndex === undefined)
        throw new Error(`addChild: Parent index not found`)
      const childDepth = screens[parentIndex].depth + 1
      for (let index = parentIndex + 1; index <= screens.length; index++) {
        const node = screens[index]
        if (node.depth > childDepth) continue

        if (node.depth < childDepth) {
          screenConfig.depth = childDepth
          dispatcher('insert', index, screenConfig)
          return index
        }
      }
      return -1
    },
    insertChild: (
      parentScreenPath: number[],
      insertChildIndex: number,
      screenConfig: NavigationElement
    ) => {
      const parentIndex = ScreenManager.getScreenIndex(parentScreenPath)
      if (parentIndex === undefined)
        throw new Error(`insertChild: Parent index not found`)
      const childDepth = screens[parentIndex].depth + 1
      var childIndex = -1
      for (let index = parentIndex + 1; index <= screens.length; index++) {
        const node = screens[index]
        if (node.depth > childDepth) continue
        if (node.depth < childDepth) break
        childIndex++
        if (childIndex === insertChildIndex) {
          screenConfig.depth = node.depth
          dispatcher('insert', index, screenConfig)
          break
        }
      }
    },
    removeChild: (parentScreenPath: number[], removeChildIndex: number) => {
      const parentIndex = ScreenManager.getScreenIndex(parentScreenPath)
      if (parentIndex === undefined)
        throw new Error(`removeChild: Parent index not found`)
      const childDepth = screens[parentIndex].depth + 1
      var childIndex = -1
      for (let index = parentIndex + 1; index <= screens.length; index++) {
        const node = screens[index]
        if (node.depth > childDepth) continue
        if (node.depth < childDepth) break
        childIndex++
        if (childIndex === removeChildIndex) {
          // If removing the current screen, go back in the history first, then remove
          if (
            removeChildIndex === screenIndex &&
            navigation &&
            navigation.canGoBack()
          )
            navigation.goBack()
          dispatcher('remove', index)
          break
        }
      }
    },
    getScreenIndex: (screenPath: number[]) => {
      const path: number[] = [0]
      let currentDepth = 0

      if (sameElements(screenPath, [0])) return 0
      for (let index = 1; index <= screens.length; index++) {
        // Check for a depth change
        const { depth } = screens[index]
        if (depth > currentDepth) {
          currentDepth++
          path.push(-1)
        }
        if (depth < currentDepth) {
          currentDepth--
          path.pop()
        }

        // Increment the path's index for this depth
        path[currentDepth]++

        if (sameElements(screenPath, path)) {
          return index
        }
      }
      return -1
    },
    getScreenPath: (searchIndex: number) => {
      const path: number[] = [0]
      let currentDepth = 0

      for (let index = 1; index <= searchIndex; index++) {
        // Check for a depth change
        const { depth } = screens[index]
        if (depth > currentDepth) {
          currentDepth++
          path.push(-1)
        }
        if (depth < currentDepth) {
          currentDepth--
          path.pop()
        }

        // Increment the path's index for this depth
        path[currentDepth]++
      }

      return path
    }
  }

  return (
    <DrawerContext.Provider
      value={{
        badges,
        setBadge,
        navigation,
        state,
        screenIndex,
        screens,
        ScreenManager,
        activeClaims,
        setDrawerContent
      }}
    >
      {children}
    </DrawerContext.Provider>
  )
}
