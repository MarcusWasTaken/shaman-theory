import React, { useState } from 'react';
import { simulate } from './functions'
import races from './data/races'
import items from './data/items'
import spells from './data/spells'

function App() {
  const [duration, setDuration] = useState(60)
  const [spell, setSpell] = useState(Object.values(spells)[0].id)
  const [rank, setRank] = useState('rank1')
  const [race, setRace] = useState(Object.values(races)[0].id)
  const [result, setResult] = useState()

  function handleDurationInput(e) {
    setDuration(e.target.value)
  }

  function handleRaceSelection(e) {
    setRace(e.target.value)
  }

  function handleSpellSelection(e) {
    setSpell(e.target.value)
    setRank('rank1')
  }

  function handleRankSelection(e) {
    setRank(e.target.value)
  }

  return (
    <>
      <h1>Hello world!</h1>
      <fieldset>
        <legend>Setup</legend>
        <div>
          <label htmlFor="race-select">Race</label><br />
          <select id="race-select" onChange={handleRaceSelection} value={race}>
            <>
              {Object.values(races).map(race => (
                <option key={race.id} value={race.id}>{race.name}</option>
              ))}
            </>
          </select>
        </div>
        <div>
          <label htmlFor="duration-select">Encounter duration (in seconds)</label><br />
          <input id="duration-select" type="number" value={duration} onChange={handleDurationInput} />
        </div>
        <div>
          <label htmlFor="spell-select">Spell</label><br />
          <select id="spell-select" onChange={handleSpellSelection} value={spell}>
            <>
              {Object.values(spells).map(spell => (
                <option key={spell.id} value={spell.id}>{spell.name}</option>
              ))}
            </>
          </select>
        </div>
        <div>
          <label htmlFor="rank-select">Rank</label><br />
          <select id="rank-select" onChange={handleRankSelection} value={rank}>
            <>
              {spells[spell].ranks.map(rank => (
                <option key={`rank${rank}`} value={`rank${rank}`}>{rank}</option>
              ))}
            </>
          </select>
        </div>
        <br/>
        <button onClick={() => setResult(simulate(spells[spell][rank], duration, races[race], items))}>Run sim!</button>
      </fieldset>
      <br/>
      {result && (
        <fieldset>
          <legend>Result</legend>
          <table>
            <tbody>
              <tr>
                <td valign="top">
                  <fieldset>
                    <legend>Gear</legend>
                    {Object.keys(result.finalSet).map(slot => (
                      <div key={slot}><small>{slot}</small><br />{result.finalSet[slot].name}</div>
                    ))}
                  </fieldset>
                </td>
                <td valign="top">
                  <fieldset>
                    <legend>Stats</legend>
                    <table>
                      <tbody>
                        {Object.keys(races[race].stats).map(stat => (
                          <tr key={stat}>
                            <td>{`${stat}: `}</td>
                            <td>{`${races[race].stats[stat]}${result.finalStats[stat] ? ` + ${result.finalStats[stat]}` : ''}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </fieldset>
                </td>
                <td valign="top">
                  <fieldset>
                    <legend>Simulation data</legend>
                    <table>
                      <tbody>
                        <tr>
                          <td>Iterations: </td>
                          <td>{result.iteration}</td>
                        </tr>
                        <tr>
                          <td>Throughput: </td>
                          <td>{Math.round(result.throughput)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </fieldset>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      )}
    </>
  );
}

export default App;
