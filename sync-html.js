const fs = require('fs');

const html = fs.readFileSync('./macro-dashboard-0718.html', 'utf-8');
const match = html.match(/const TOPICS = (\[[\s\S]*?\]);\n/);
if (!match) {
  console.error("Could not parse TOPICS from HTML");
  process.exit(1);
}

// eval to parse the JS object literal
let TOPICS;
try {
  eval("TOPICS = " + match[1]);
} catch(e) {
  console.error("Error evaluating TOPICS", e);
  process.exit(1);
}

const DATA = [];
TOPICS.forEach(t => {
  if (t.core) DATA.push(...t.core);
  if (t.context) DATA.push(...t.context);
});

async function main() {
  const res = await fetch('http://localhost:3000/api/indicators');
  const dbInds = await res.json();
  const dbMap = {};
  dbInds.forEach(i => dbMap[i.name] = i.id);

  let updated = 0;
  for (const item of DATA) {
    const id = dbMap[item.n];
    if (!id) {
      console.log('Not found in DB:', item.n);
      continue;
    }
    
    // Attempt to parse numeric value from the display string
    let numericValue = null;
    if (item.v) {
        // e.g. "26.460" -> "26460", "100,78" -> "100.78", "$13,03B" -> "13.03"
        // Let's do a simple heuristic
        let vStr = item.v.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d.\-]/g, '');
        // Actually, if it's "26.460" in Vietnamese, it means 26460. 
        // If it's "4,50%", it means 4.5.
        // Let's just use the above replacement: remove dots, replace comma with dot, then strip non-numeric.
        if (vStr && !isNaN(vStr)) {
            numericValue = parseFloat(vStr);
        }
    }

    const body = {
      date: '2026-07-18T00:00:00.000Z',
      signal: item.sig || 'green',
      note: item.note || '',
      displayValue: item.v,
      value: numericValue
    };
    
    if (item.cmp) {
        if (item.cmp.w) body.cmpW = item.cmp.w;
        if (item.cmp.m) body.cmpM = item.cmp.m;
        if (item.cmp.ytd) body.cmpYtd = item.cmp.ytd;
        if (item.cmp.yoy) body.cmpYoy = item.cmp.yoy;
    }

    const post = await fetch(`http://localhost:3000/api/indicators/${id}/observations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (post.ok) {
      updated++;
      console.log('✔ Cập nhật:', item.n);
    } else {
      console.log('✘ Lỗi:', item.n, await post.text());
    }
  }
  console.log('\nTotal updated:', updated, '/', DATA.length);
}
main();
