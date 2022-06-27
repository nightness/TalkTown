import Empty from '../screens/Empty'
import Home from '../screens/Home'
import PrivateMessenger from '../messenger/PrivateMessenger'
import WallMessenger from '../messenger/WallMessenger'
import ManageGroups from '../messenger/ManageGroups'
import ManageUserRoles from '../messenger/ManageUserRoles'
import Room from '../webrtc/Room'
import GroupRoomChooser from '../messenger/GroupRoomChooser'
import { ToastExample } from '../screens/ToastExample'
import { Playground } from '../screens/Playground'
import { NavigationElements } from '@navigation'

import {
    homeParams,
    messagesParams,
    memberWallParams,
    groupChatParams,
    manageGroupsParams,
    manageUserRolesParams,
    playgroundParams,
} from './DrawerParams'
import PersonalSettings from '../screens/PersonalSettings'

export const initialNavigationElements: NavigationElements = [
    {
        label: 'Home',
        routeName: 'Home',
        component: Home,
        initialParams: homeParams,
        depth: 0,
    },
    // {
    //     label: 'Member Walls',
    //     routeName: 'MemberWalls',
    //     component: WallMessenger,
    //     initialParams: memberWallParams,
    //     depth: 0,
    // },
    {
        label: 'Messages',
        routeName: 'Messages',
        component: PrivateMessenger,
        initialParams: messagesParams,
        depth: 0,
    },
    // {
    //     label: 'Group Chat',
    //     routeName: 'GroupChat',
    //     component: GroupRoomChooser,
    //     initialParams: groupChatParams,
    //     depth: 0,
    // },
    {
        label: 'Video Chat',
        routeName: 'VideoChat',
        component: Room,
        initialParams: groupChatParams,
        depth: 0,
    },
    {
        label: 'Admin Settings',
        routeName: 'AdminHome',
        component: Empty,
        initialParams: manageGroupsParams,
        depth: 0,
        claims: ['admin'],
    },
    {
        label: 'Manage Groups',
        routeName: 'ManageGroups',
        component: ManageGroups,
        initialParams: manageGroupsParams,
        depth: 1,
        claims: ['admin'],
    },
    {
        label: 'Manage User Roles',
        routeName: 'ManageUserRoles',
        component: ManageUserRoles,
        initialParams: manageUserRolesParams,
        depth: 1,
        claims: ['admin'],
    },
    {
        label: 'Playground',
        routeName: 'Playground',
        component: Playground,
        initialParams: playgroundParams,
        depth: 0,
        claims: ['admin']
    },
    {
        label: 'Toast Example',
        routeName: 'Toast Example',
        component: ToastExample,
        initialParams: playgroundParams,
        depth: 0,
        claims: ['admin']
    },
    {
        label: 'Personal Settings',
        routeName: 'Personal Settings',
        component: PersonalSettings,
        initialParams: manageGroupsParams,
        depth: 0,
    },
]
