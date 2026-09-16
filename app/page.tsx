import React from 'react';

export default function Home() {
  return (
    <main style={{ padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Lakshya AI</h1>
      <p>Rural Micro-Entrepreneur Feasibility & Financial Planning Platform</p>
      <ul>
        <li><code>POST /api/feasibility</code> - AI Feasibility Analysis</li>
        <li><code>POST /api/calculate</code> - Financial Calculator</li>
        <li><code>POST /api/verdict</code> - Unified Verdict & Submission</li>
      </ul>
    </main>
  );
}
