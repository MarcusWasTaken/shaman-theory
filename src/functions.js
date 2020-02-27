import talents from './data/talents'

// calculates throughput from a spell with a combat duration and a statsheet
export function calcThroughput(spell, duration, stats) {
    // standard coefficient calculation
    const coefficient = spell.cast / 3.5 * Math.min((1 - ((20 - spell.level) * 0.0375)), 1)
    // min and max takes the spell base, applies any effectiveness from purification talent (ranging from 1 to 1.1) and finally adds any +healing from stats multiplied by spell coefficient
    const min = (spell.min * talents.effectiveness + stats.healing * coefficient) * (spell.bounce || 1)
    const max = (spell.max * talents.effectiveness + stats.healing * coefficient) * (spell.bounce || 1)
    // crit multiplier takes the chance to crit (as decimal) and then multiplies the chance by the effect, aka. 1.5 of whatever the spell would've healed by
    const critMultiplier = (stats.crit + talents.crit + stats.intellect / 4950) * 1.5
    // multiplies any mana gained from items raw or from intellect with the multiplier from talent Ancestral Knowledge (ranging from 1 to 1.05), finally adds whatever ammount of mana you'd regen from mp5 over the duration
    const totalMana = (stats.mana + stats.intellect * 15) * talents.manaMultiplier + (stats.mp5 * duration / 5)
    // finally take whatever mana we've got to spend in the fight, multiply it by the average and finally the crit multiplier
    return totalMana / (spell.cost * talents.costReduction) * (min + max) / 2 * (1 + critMultiplier)
}

// returns an object with values over each slot for how many items are available on that slot and its iteration order
export function countItems(obj) {
    let count = {}
    let iterations = 1
    for (let key in obj) {
        let length = Object.values(obj[key]).length
        count[key] = {
            count: length,
            order: iterations
        }
        iterations *= length || 1
    }
    count['total'] = iterations
    return count
}

// takes two statsheets and adds the stats together returning one statsheet of the total
export function addStatsheets(target, source) {
    let result = Object.assign({}, target)
    for (let key in source) {
        if (result[key]) {
            result[key] += source[key]
        }
        else {
            result[key] = source[key]
        }
    }
    return result
}

// loops over a set object and applies the statsheet of each item to the base stats
export function statsFromSet(basestats, set) {
    let stats = addStatsheets({}, basestats)
    for (let key in set) {
        stats = addStatsheets(stats, set[key].stats)
    }
    return stats
}

// takes a slot (trinket or rings) and creates unique pairs, merging their stat sheets
export function pairsFromSlot(slot) {
    const slotItems = Object.values(slot)
    let result = {}
    for (let i = 0; i < slotItems.length; i++) {
        const trinket1 = slotItems[i]
        for (let n = trinket1.unique || trinket1.count < 2 ? i+1 : i; n < slotItems.length; n++) {
            const trinket2 = slotItems[n]
            result[`${trinket1.id}-${trinket2.id}`] = {
                ids: [trinket1.id, trinket2.id],
                name: `${trinket1.name}, ${trinket2.name}`,
                stats: addStatsheets(trinket1.stats, trinket2.stats)
            }
        }
    }
    return result
}

// processes the item list before performing simulation on it (converting trinket and rings to pairs to be compared, since you can equip 2)
export function processItems(items) {
    let result = {}
    for (let key in items) {
        if (key === 'trinket' || key === 'finger') {
            result[key] = pairsFromSlot(items[key])
        } else {
            result[key] = items[key]
        }
    }
    return result
}

// takes an iteration and creates a unique set from it
export function setFromIteration(iteration, items, itemCount) {
    let set = {}
    for (let key in items) {
        set[key] = items[key][Object.keys(items[key])[Math.floor(iteration / itemCount[key].order) % itemCount[key].count]]
    }
    return set
}

export function simulate(spell, duration, race, items) {
    const itemList = processItems(items)
    const itemCount = countItems(itemList)

    let result = {
        throughput: 0,
        iteration: 0
    }
    for (let i = 0; i < itemCount.total; i++) {
        let set = setFromIteration(i, itemList, itemCount)
        let throughput = calcThroughput(spell, duration, statsFromSet(race.stats, set))
        //console.log("throuhput: ", throughput, " iteration: ", i)
        if (throughput > result.throughput) {
            result = {
                throughput,
                iteration: i
            }
        }
    }
    const finalSet = setFromIteration(result.iteration, itemList, itemCount)
    const finalStats = statsFromSet({}, finalSet)
    return {finalSet, finalStats, ...result}
}