 type Gradient = [string, string, ...string[]]

export interface GradientColorSet {
    background: Gradient,
    primary: Gradient,
    secondary: Gradient,
    drawer: Gradient,
}

export type GradientThemeSet = {
    Light: GradientColorSet,
    Dark: GradientColorSet
}

export const GradientColors: GradientThemeSet = {
    Light: {
        background: ['#ada9f0', '#88ddd2', '#8ccfdd'],
        primary: ['#ada9f0', '#88ddd2', '#8ccfdd'],
        secondary: ['#d5d4f1', '#d1e8f5', '#eff4fa'],
        drawer: ['#ada9f0', '#88ddd2', '#8ccfdd'],
    },
    Dark: {
        background: ['#0c0a7d', '#0b2450', '#060818'],
        primary: ['#090828', '#021d4f', '#020c6b'],
        secondary: ['#131242', '#0c1b36', '#060818'],
        drawer: ['#0c0a7d', '#0b2450', '#060818'],
    }
}
