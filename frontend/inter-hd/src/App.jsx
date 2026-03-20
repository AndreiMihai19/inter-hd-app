import { useMemo, useState } from "react"
import "./App.css"
import crest from "./assets/stema-inter-hd.png"

const squad = [
  { number: 1, name: "Ghita", role: "Portar" },
  { number: 4, name: "Madalin", role: "Fundaș" },
  { number: 5, name: "Gorcea", role: "Fundaș" },
  { number: 7, name: "Coman", role: "Mijlocaș" },
  { number: 8, name: "Catalin", role: "Mijlocaș" },
  { number: 9, name: "Clej", role: "Atacant" },
  { number: 10, name: "Albulescu", role: "Atacant" },
  { number: 11, name: "Tebies", role: "Fundaș" },
  { number: 12, name: "Cioltea", role: "Portar" },
  { number: 13, name: "Jorza", role: "Atacant" },
  { number: 15, name: "Andrei F.", role: "Mijlocaș" },
  { number: 17, name: "Totu", role: "Atacant" },
  { number: 19, name: "Andrei M.", role: "Atacant" },
  { number: 25, name: "Alex", role: "Fundaș" },
  { number: 66, name: "Nutu", role: "Atacant" },
  { number: 88, name: "Codrin", role: "Mijlocaș" },
  { number: 99, name: "Adrian", role: "Atacant" },
]

const FORMATIONS = {
  "2-2-1": [
    { key: "gk", label: "Portar", type: "Portar", grid: "gk" },
    { key: "def1", label: "Fundaș stânga", type: "Fundaș", grid: "def-left" },
    { key: "def2", label: "Fundaș dreapta", type: "Fundaș", grid: "def-right" },
    { key: "mid1", label: "Mijlocaș stânga", type: "Mijlocaș", grid: "mid-left" },
    { key: "mid2", label: "Mijlocaș dreapta", type: "Mijlocaș", grid: "mid-right" },
    { key: "att1", label: "Atacant", type: "Atacant", grid: "att-center" },
  ],
  "2-1-2": [
    { key: "gk", label: "Portar", type: "Portar", grid: "gk" },
    { key: "def1", label: "Fundaș stânga", type: "Fundaș", grid: "def-left" },
    { key: "def2", label: "Fundaș dreapta", type: "Fundaș", grid: "def-right" },
    { key: "mid1", label: "Mijlocaș", type: "Mijlocaș", grid: "mid-center" },
    { key: "att1", label: "Atacant stânga", type: "Atacant", grid: "att-left" },
    { key: "att2", label: "Atacant dreapta", type: "Atacant", grid: "att-right" },
  ],
  "1-3-1": [
    { key: "gk", label: "Portar", type: "Portar", grid: "gk" },
    { key: "def1", label: "Fundaș", type: "Fundaș", grid: "def-center" },
    { key: "mid1", label: "Mijlocaș stânga", type: "Mijlocaș", grid: "mid-left-wide" },
    { key: "mid2", label: "Mijlocaș centru", type: "Mijlocaș", grid: "mid-center" },
    { key: "mid3", label: "Mijlocaș dreapta", type: "Mijlocaș", grid: "mid-right-wide" },
    { key: "att1", label: "Atacant", type: "Atacant", grid: "att-center" },
  ],
}

const DEFAULT_LINEUPS = {
  "2-2-1": {
    gk: 1,
    def1: 4,
    def2: 5,
    mid1: 7,
    mid2: 8,
    att1: 9,
  },
  "2-1-2": {
    gk: 1,
    def1: 4,
    def2: 5,
    mid1: 7,
    att1: 9,
    att2: 10,
  },
  "1-3-1": {
    gk: 1,
    def1: 4,
    mid1: 7,
    mid2: 8,
    mid3: 15,
    att1: 9,
  },
}

function App() {
  const [formation, setFormation] = useState("2-2-1")
  const [lineup, setLineup] = useState(DEFAULT_LINEUPS["2-2-1"])
  const [activeTab, setActiveTab] = useState("table")
  const [panelTab, setPanelTab] = useState("starters")

  const positions = FORMATIONS[formation]

  const starters = useMemo(() => {
    return positions
      .map((pos) => {
        const player = squad.find((p) => p.number === Number(lineup[pos.key]))
        return player
          ? {
              ...player,
              positionLabel: pos.label,
              grid: pos.grid,
              slotKey: pos.key,
            }
          : null
      })
      .filter(Boolean)
  }, [positions, lineup])

  const starterNumbers = starters.map((player) => player.number)
  const bench = squad.filter((player) => !starterNumbers.includes(player.number))

  function handleFormationChange(e) {
    const newFormation = e.target.value
    setFormation(newFormation)
    setLineup(DEFAULT_LINEUPS[newFormation])
  }

  function handlePlayerChange(slotKey, value) {
    const number = Number(value)

    setLineup((current) => {
      const next = { ...current }

      const usedKey = Object.keys(next).find(
        (key) => key !== slotKey && Number(next[key]) === number
      )

      if (usedKey) {
        next[usedKey] = current[slotKey]
      }

      next[slotKey] = number
      return next
    })
  }

  function handleReset() {
    setLineup(DEFAULT_LINEUPS[formation])
  }

  function getOptionsForType(type) {
    return squad.filter((player) => player.role === type)
  }

  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb--left"></div>
      <div className="bg-orb bg-orb--right"></div>

      <div className="app-container">
        <header className="topbar">
          <div className="brand">
            <div className="brand__crest">
              <img src={crest} alt="Stema Inter HD" />
            </div>

            <div className="brand__text">
              <span className="brand__eyebrow">Inter HD</span>
              <h1>Management echipă</h1>
            </div>
          </div>

          <div className="topbar__actions">
            <div className="tabs">
              <button
                className={activeTab === "table" ? "tabs__button is-active" : "tabs__button"}
                onClick={() => setActiveTab("table")}
              >
                Tabelă
              </button>
              <button
                className={activeTab === "squad" ? "tabs__button is-active" : "tabs__button"}
                onClick={() => setActiveTab("squad")}
              >
                Lot
              </button>
            </div>

            {activeTab === "table" && (
              <label className="select-field select-field--top">
                <span>Formație</span>
                <select value={formation} onChange={handleFormationChange}>
                  {Object.keys(FORMATIONS).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        </header>

        {activeTab === "table" && (
          <main className="workspace">
            <section className="card card--pitch">
              <div className="card__header">
                <div>
                  <span className="card__eyebrow">Formație activă</span>
                </div>
              </div>

              <div className="pitch">
                <div className="pitch__inner">
                  <div className="pitch__line"></div>
                  <div className="pitch__circle"></div>

                  <div className="pitch-grid">
                    {starters.map((player) => (
                      <div
                        key={player.slotKey}
                        className={`pitch-slot pitch-slot--${player.grid}`}
                      >
                        <PlayerCard player={player} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <aside className="card card--panel">
              <div className="panel-header">
                <div>
                  <span className="card__eyebrow">Control</span>
                  <h2>Gestionare lot</h2>
                </div>

                <div className="mini-tabs">
                  <button
                    className={panelTab === "starters" ? "mini-tabs__button is-active" : "mini-tabs__button"}
                    onClick={() => setPanelTab("starters")}
                  >
                    Titulari
                  </button>
                  <button
                    className={panelTab === "bench" ? "mini-tabs__button is-active" : "mini-tabs__button"}
                    onClick={() => setPanelTab("bench")}
                  >
                    Rezerve
                  </button>
                </div>
              </div>

              {panelTab === "starters" && (
                <>
                  <div className="editor-list">
                    {positions.map((pos) => (
                      <label key={pos.key} className="select-field">
                        <span>{pos.label}</span>
                        <select
                          value={lineup[pos.key]}
                          onChange={(e) => handlePlayerChange(pos.key, e.target.value)}
                        >
                          {getOptionsForType(pos.type).map((player) => (
                            <option key={player.number} value={player.number}>
                              #{player.number} {player.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>

                  <div className="panel-actions">
                    <button className="ghost-button" onClick={handleReset}>
                      Resetează formula
                    </button>
                  </div>
                </>
              )}

              {panelTab === "bench" && (
                <div className="bench-list">
                  {bench.map((player) => (
                    <div key={player.number} className="bench-item">
                      <div className="bench-item__meta">
                        <strong>{player.name}</strong>
                        <p>{player.role}</p>
                      </div>
                      <span className="number-pill">#{player.number}</span>
                    </div>
                  ))}
                </div>
              )}
            </aside>
          </main>
        )}

        {activeTab === "squad" && (
          <main className="workspace workspace--single">
            <section className="card">
              <div className="card__header">
                <div>
                  <span className="card__eyebrow">Lot</span>
                </div>
              </div>

              <div className="table-wrap">
                <table className="players-table">
                  <thead>
                    <tr>
                      <th>Nr.</th>
                      <th>Nume</th>
                      <th>Post</th>
                    </tr>
                  </thead>
                  <tbody>
                    {squad.map((player) => (
                      <tr key={player.number}>
                        <td>
                          <span className="number-pill">#{player.number}</span>
                        </td>
                        <td>{player.name}</td>
                        <td>{player.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  )
}

function PlayerCard({ player }) {
  return (
    <div className="player-card">
      <div className="player-card__number">{player.number}</div>
      <div className="player-card__name">{player.name}</div>
      <div className="player-card__role">{player.positionLabel}</div>
    </div>
  )
}

export default App