import { NavigationParams } from '@navigation'

export const homeParams: NavigationParams = {
    activeTintColor: '#5c3703',
    inactiveTintColor: '#5c3703',
    iconGroup: 'ionicon',
    iconName: 'home',
    focusedIconName: 'home-outline'
}

export const messagesParams: NavigationParams = {
    activeTintColor: '#234',
    inactiveTintColor: '#234',
    iconGroup: 'ionicon',
    iconName: 'chatbox',
    focusedIconName: 'chatbox-outline'
}

export const groupChatParams = messagesParams

export const myWallParams: NavigationParams = {
    activeTintColor: '#7a7a66',
    inactiveTintColor: '#7a7a66',
    iconGroup: 'ionicon',
    iconName: 'book',
    focusedIconName: 'book-outline'
}

export const memberWallParams: NavigationParams = {
    activeTintColor: '#345',
    inactiveTintColor: '#123',
    iconGroup: 'ionicon',
    iconName: 'browsers',
    focusedIconName: 'browsers-outline'
}

export const manageGroupsParams: NavigationParams = {
    activeTintColor: '#aaa',
    inactiveTintColor: '#888',
    iconGroup: 'ionicon',
    iconName: 'build',
    focusedIconName: 'build-outline'
}
export const manageUserRolesParams = manageGroupsParams

export const playgroundParams: NavigationParams = {
    activeTintColor: '#123',
    inactiveTintColor: '#000',
    iconGroup: 'ionicon',
    iconName: 'bug',
    focusedIconName: 'bug-outline'
}