import React, { useState } from 'react';
import { scoringData } from '../data/scoringData';
import HandCalculator from './HandCalculator';

export default function GuideView() {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calculator'

  return (
    <div className="guide-container">
      <div className="guide-header">
        <h2>Scoring Guide / 计分表</h2>
        <p>Reference for Hong Kong Mahjong Scoring (No Seven Pairs)</p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setViewMode('table')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: viewMode === 'table' ? '#d4af37' : '#444',
            color: viewMode === 'table' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Scoring Table
        </button>
        <button
          onClick={() => setViewMode('calculator')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: viewMode === 'calculator' ? '#d4af37' : '#444',
            color: viewMode === 'calculator' ? '#000' : '#fff',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Hand Calculator (Beta)
        </button>
      </div>

      {viewMode === 'table' ? (
        <table className="hand-table">
          <thead>
            <tr>
              <th>Name (EN/ZH)</th>
              <th>Phonetic (Pinyin/Jyutping)</th>
              <th>Faan / 番</th>
              <th>Probability</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {scoringData.map((hand, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <td rowSpan="2">
                    <div><strong>{hand.name_en}</strong></div>
                    <div>{hand.name_zh}</div>
                  </td>
                  <td>
                    <div>Py: {hand.pinyin}</div>
                    <div>Jp: {hand.jyutping}</div>
                  </td>
                  <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{hand.faan}</td>
                  <td style={{ fontWeight: 'bold', color: '#888' }}>{hand.probability}</td>
                  <td>{hand.description}</td>
                </tr>
                <tr>
                  <td colSpan="4" style={{ textAlign: 'left', padding: '10px', background: 'rgba(0,0,0,0.2)' }}>
                    {hand.example_tiles ? (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {hand.example_tiles.map((tile, i) => (
                          tile === "/" ? (
                            <span key={i} style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 8px', color: '#666' }}>/</span>
                          ) : (
                            <img
                              key={i}
                              src={`/hand_images/${tile}`}
                              alt={tile}
                              style={{ height: '60px', width: 'auto' }}
                            />
                          )
                        ))}
                      </div>
                    ) : (
                      <div className="hand-img" style={{ width: 'auto', height: 'auto', background: 'transparent' }}>
                        <img
                          src={`/hand_images/${hand.image}`}
                          alt={hand.name_en}
                          style={{ maxWidth: '150px', maxHeight: '100px' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <HandCalculator />
      )}
    </div>
  );
}
