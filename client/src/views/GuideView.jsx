import React from 'react';
import { scoringData } from '../data/scoringData';

export default function GuideView() {
  return (
    <div className="guide-container">
      <h2>Scoring Guide / 计分表</h2>
      <p>Reference for Hong Kong Mahjong Scoring (No Seven Pairs)</p>

      <table className="hand-table">
        <thead>
          <tr>
            <th>Name (EN/ZH)</th>
            <th>Phonetic (Pinyin/Jyutping)</th>
            <th>Faan / 番</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {scoringData.map((hand, idx) => (
            <tr key={idx}>
              <td>
                <div><strong>{hand.name_en}</strong></div>
                <div>{hand.name_zh}</div>
              </td>
              <td>
                <div>Py: {hand.pinyin}</div>
                <div>Jp: {hand.jyutping}</div>
              </td>
              <td style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{hand.faan}</td>
              <td>{hand.description}</td>
              <td>
                <div className="hand-img" style={{width: 'auto', height: 'auto', background: 'transparent'}}>
                   <img
                      src={`/hand_images/${hand.image}`}
                      alt={hand.name_en}
                      style={{maxWidth: '150px', maxHeight: '100px'}}
                      onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerText = 'Image Pending';
                      }}
                   />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
