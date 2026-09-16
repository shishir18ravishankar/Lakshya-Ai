const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

// Built-in intelligent goal breakdown engine
function generateAiMilestones(goalTitle, category) {
  const commonMilestones = [
    { title: "Define Target Metrics & Success Criteria", time: "Day 1-3", priority: "High" },
    { title: "Research Best Practices & Resource Gathering", time: "Week 1", priority: "Medium" },
    { title: "Execution Phase: Core Focus Sprint", time: "Week 2-3", priority: "High" },
    { title: "Iterative Testing & Feedback Loop", time: "Week 4", priority: "Medium" },
    { title: "Refinement, Review & Milestone Completion", time: "Week 5", priority: "Low" }
  ];

  const categoryPresets = {
    tech: [
      { title: "Architect System & Tech Stack Selection", time: "Day 1-2", priority: "High" },
      { title: "Build Minimum Viable Prototype (MVP)", time: "Week 1", priority: "High" },
      { title: "Implement Core Logic & AI Integrations", time: "Week 2", priority: "High" },
      { title: "Automated Testing & Security Audit", time: "Week 3", priority: "Medium" },
      { title: "Deploy to Production & Setup Observability", time: "Week 4", priority: "High" }
    ],
    learning: [
      { title: "Map Curriculum & Core Concept Fundamentals", time: "Day 1-3", priority: "High" },
      { title: "Deep Dive: Theory & Hands-on Exercises", time: "Week 1-2", priority: "Medium" },
      { title: "Build Capstone Proof-of-Concept Project", time: "Week 3", priority: "High" },
      { title: "Peer Review & Knowledge Synthesis", time: "Week 4", priority: "Low" }
    ],
    career: [
      { title: "Conduct Skills Gap Analysis & Strategy", time: "Week 1", priority: "High" },
      { title: "Build Flagship Portfolio Artifacts", time: "Week 2-3", priority: "High" },
      { title: "Network Outreach & Industry Presence", time: "Week 4", priority: "Medium" },
      { title: "Interview / Pitch Execution & Negotiation", time: "Week 5+", priority: "High" }
    ],
    health: [
      { title: "Establish Baseline Metrics & Nutrition Regimen", time: "Day 1-3", priority: "High" },
      { title: "Build Daily Consistency Routine (21-Day Rule)", time: "Weeks 1-3", priority: "High" },
      { title: "Progressive Overload & Benchmark Check", time: "Week 4", priority: "Medium" },
      { title: "Sustain & Optimize Energy Levels", time: "Ongoing", priority: "Low" }
    ]
  };

  const selected = categoryPresets[category?.toLowerCase()] || commonMilestones;
  return selected.map((m, idx) => ({
    id: 'ms_' + Date.now() + '_' + idx,
    title: `${m.title} (${goalTitle.slice(0, 30)}...)`,
    targetTime: m.time,
    priority: m.priority,
    completed: false
  }));
}

const server = http.createServer((req, res) => {
  // Simple API endpoint for AI decomposition
  if (req.method === 'POST' && req.url === '/api/decompose') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { goalTitle, category } = JSON.parse(body || '{}');
        const milestones = generateAiMilestones(goalTitle || 'General Goal', category || 'tech');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, milestones }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Server
  let safePath = path.normalize(req.url.split('?')[0]);
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(PUBLIC_DIR, safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`🚀 Lakshya-Ai server is active!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`=================================================\n`);
});
