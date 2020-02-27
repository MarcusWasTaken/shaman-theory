export default {
    HealingWave: {
        id: 'HealingWave',
        name: 'Healing Wave',
        ranks: [1],
        rank1: {
            id: 'rank1',
            level: 1,
            cost: 25,
            cast: 1.5,
            min: 36,
            max: 47
        }
    },
    ChainHeal: {
        id: 'ChainHeal',
        name: 'Chain Heal',
        ranks: [1, 2],
        rank1: {
            id: 'rank1',
            level: 40,
            cost: 260,
            cast: 2.5,
            min: 332,
            max: 381,
            bounce: 1.75
        },
        rank2: {
            id: 'rank2',
            level: 46,
            cost: 315,
            cast: 2.5,
            min: 419,
            max: 479,
            bounce: 1.75
        }
    }
}