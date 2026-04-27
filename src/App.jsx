import React, { useMemo, useState } from "react";

function getDaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return hash;
}

function pseudoRandom(seed, index) {
  const x = Math.sin(seed * 999 + index * 1234) * 10000;
  return x - Math.floor(x);
}

function generateDailyNiches(force = 0) {
  const seed = hashString(getDaySeed() + force);

  const base = [
    "Anxiety Relief Coloring Book",
    "ADHD Focus Workbook",
    "Cottagecore Aesthetic Coloring",
    "Dark Academia Coloring Book",
    "Cute Horror Chibi Book",
    "Sleep Therapy Coloring Pages",
    "Mindfulness Mandala Book",
    "Animal Coloring Book",
    "Fantasy Creatures Coloring",
    "Kawaii Coloring Book",
    "Minimalist Line Art",
    "Nature Coloring",
    "Ocean Life Coloring",
    "Botanical Coloring",
    "Fairy Tale Coloring",
    "Urban Sketch Coloring",
    "Motivational Quotes Coloring",
    "Fashion Coloring Book",
    "Cozy Lifestyle Coloring",
    "Cute Animals Coloring"
  ];

  return base
    .map((n, i) => {
      const trend = Math.floor(pseudoRandom(seed, i + 10) * 100);
      const competition = pseudoRandom(seed, i + 20) > 0.6 ? "Low" : "Medium";
      const score = Math.floor(pseudoRandom(seed, i) * 5 + 5);

      let opportunity = score;
      if (competition === "Low") opportunity += 2;
      if (trend > 70) opportunity += 2;

      const trendType = trend > 70 ? "Trending" : trend > 40 ? "Stable" : "Evergreen";

      let decision = "⚠️ Skip";
      if (competition === "Low" && trend > 50) decision = "🔥 Publish Now";
      else if (competition === "Low") decision = "✅ Good Opportunity";
      else if (trend > 70) decision = "⚡ Fast Trend";

      return { name: n, score, trend, competition, opportunity, trendType, decision };
    })
    .sort((a, b) => b.opportunity - a.opportunity);
}

function generateSubNiches(niche) {
  const seed = hashString(niche + getDaySeed());
  const pool = [
    "Mandala therapy pages",
    "Stress relief patterns",
    "Focus training workbook",
    "Mindfulness flow",
    "Aesthetic variations",
    "Daily relaxation",
    "Beginner friendly",
    "Advanced detail pages"
  ];

  return pool
    .map((item, i) => ({ item, sort: pseudoRandom(seed, i) }))
    .sort((a, b) => b.sort - a.sort)
    .slice(0, 3)
    .map((x) => x.item);
}

function generateKeywords(niche) {
  return [
    `${niche.toLowerCase()} coloring book`,
    "adult coloring book",
    "stress relief coloring",
    "relaxing coloring pages",
    "mindfulness coloring",
    "anti anxiety coloring",
    "creative coloring book"
  ];
}

function generatePrompts(niche) {
  const base = "black and white coloring page, clean bold lines, no shading, white background, printable KDP interior";
  return Array.from({ length: 30 }).map((_, i) => `${niche} scene ${i + 1}, ${base}`);
}

function generateCoverPrompt(niche) {
  return `${niche} cover design, bold typography, eye-catching composition, high contrast, clean modern KDP book cover, professional bestselling style`;
}

function generateDescription(niche) {
  return `✨ Discover the Magic of ${niche}! ✨\n\nUnwind, relax, and express your creativity with this beautifully designed coloring book. Whether you are a beginner or an experienced colorist, this book offers a calming escape from stress and daily pressure.\n\n✔ Stress-relieving designs\n✔ Perfect for mindfulness and relaxation\n✔ Great gift idea for friends and family\n✔ High-quality pages for a premium experience\n\nStart your creative journey today and enjoy hours of peaceful coloring with ${niche}.`;
}

function generateBook(niche) {
  return {
    niche,
    title: `${niche}: Stress Relief Coloring Book for Adults`,
    subtitle: "Relaxing Designs for Mindfulness and Creativity",
    keywords: generateKeywords(niche),
    prompts: generatePrompts(niche),
    cover: generateCoverPrompt(niche),
    description: generateDescription(niche)
  };
}

function Checklist() {
  return (
    <div className="card mb">
      <h2>🧠 KDP Dashboard</h2>
      <ul className="text-sm">
        <li>Daily 20 Niches Engine ACTIVE</li>
        <li>Auto Refresh every day</li>
        <li>Sub-niche generator ON</li>
        <li>Search system enabled</li>
        <li>Cover generator added</li>
        <li>Description generator added</li>
      </ul>
    </div>
  );
}

function DecisionBadge({ decision }) {
  const color = decision.includes("Publish")
    ? "green"
    : decision.includes("Good")
    ? "blue"
    : decision.includes("Fast")
    ? "yellow"
    : "red";

  return <span className={`badge ${color}`}>{decision}</span>;
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [refresh, setRefresh] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [subMap, setSubMap] = useState({});
  const [copied, setCopied] = useState("");
  const [onlyWinners, setOnlyWinners] = useState(false);

  const niches = useMemo(() => generateDailyNiches(refresh), [refresh]);

  const visibleNiches = useMemo(() => {
    if (!onlyWinners) return niches;
    return niches.filter(
      (n) => n.decision === "🔥 Publish Now" || n.decision === "✅ Good Opportunity"
    );
  }, [niches, onlyWinners]);

  const toggleSub = (index, niche) => {
    setSubMap((prev) => ({
      ...prev,
      [index]: prev[index] ? null : generateSubNiches(niche)
    }));
  };

  const generateFromNiche = (niche) => {
    setSelectedBook(generateBook(niche));
    setTab("book");
  };

  const generateFromSub = (parentNiche, sub) => {
    setSelectedBook(generateBook(`${parentNiche} - ${sub}`));
    setTab("book");
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="container">
      <h1 className="title">KDP Dashboard Full Preview 🚀</h1>

      <Checklist />

      <div className="card mb">
        <h2>🔥 Smart Profit Filter</h2>
        <div className="flex">
          <button onClick={() => setRefresh((r) => r + 1)} className="btn purple">
            🔄 Refresh Niches
          </button>
          <button onClick={() => setOnlyWinners((v) => !v)} className="btn green">
            {onlyWinners ? "Show All Niches" : "🔥 Only Winning Niches"}
          </button>
        </div>
        <p className="text-xs muted">
          يعرض النيتشات التي تستحق التجربة بناءً على Competition + Trend + Opportunity.
        </p>
      </div>

      <div className="flex mb">
        <button onClick={() => setTab("overview")} className="btn gray">Niche Overview</button>
        <button onClick={() => setTab("deep")} className="btn gray">Deep Dive</button>
        <button onClick={() => setTab("book")} className="btn gray">Book Generator</button>
      </div>

      {tab === "overview" && (
        <div className="grid">
          {visibleNiches.map((n, i) => (
            <div key={i} className="card">
              <div className="row">
                <h3>{n.name}</h3>
                <DecisionBadge decision={n.decision} />
              </div>
              <p>🎯 Score: {n.score}/10</p>
              <p>🔥 Trend: {n.trend}%</p>
              <p>⚔ Competition: {n.competition}</p>
              <p>💰 Opportunity: {n.opportunity}/10</p>

              <div className="flex mt">
                <button className="btn blue" onClick={() => generateFromNiche(n.name)}>
                  Generate Book
                </button>
                <button className="btn green" onClick={() => toggleSub(i, n.name)}>
                  Sub Niches
                </button>
              </div>

              {subMap[i] && (
                <ul className="text-sm">
                  {subMap[i].map((s, idx) => (
                    <li key={idx} className="row mt">
                      <span>{s}</span>
                      <button className="btn yellow" onClick={() => generateFromSub(n.name, s)}>
                        Generate
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "deep" && (
        <div className="grid">
          {visibleNiches.slice(0, 10).map((n, i) => (
            <div key={i} className="card">
              <div className="row">
                <h3>{n.name}</h3>
                <DecisionBadge decision={n.decision} />
              </div>
              <p>🎯 Opportunity Score: {n.opportunity}/10</p>
              <p>📈 Trend: {n.trend}% ({n.trendType})</p>
              <p>⚔ Competition: {n.competition}</p>

              <div className="mt">
                <p><b>💡 Strategy:</b></p>
                <ul className="text-sm">
                  {n.trendType === "Trending" && <li>Publish fast because the trend is hot.</li>}
                  {n.trendType === "Stable" && <li>Balanced demand with long-term potential.</li>}
                  {n.trendType === "Evergreen" && <li>Good for slow and consistent passive income.</li>}
                  {n.competition === "Low" && <li>Better chance to rank quickly.</li>}
                  {n.competition === "Medium" && <li>Use a narrow sub-niche angle to compete.</li>}
                </ul>
              </div>

              <div className="mt">
                <p><b>🎯 Sub Niches:</b></p>
                <ul className="text-sm">
                  {generateSubNiches(n.name).map((s, idx) => (
                    <li key={idx} className="row mt">
                      <span>{s}</span>
                      <button className="btn yellow" onClick={() => generateFromSub(n.name, s)}>
                        Generate
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "book" && !selectedBook && (
        <div className="card">اختر نيتش من Niche Overview أو Deep Dive ثم اضغط Generate Book.</div>
      )}

      {tab === "book" && selectedBook && (
        <div className="card">
          <h2>Book Pack</h2>
          <p><b>Niche:</b> {selectedBook.niche}</p>

          <p className="mt"><b>Title:</b> {selectedBook.title}</p>
          <button className="btn gray" onClick={() => copy(selectedBook.title, "title")}>{copied === "title" ? "Copied!" : "Copy Title"}</button>

          <p className="mt"><b>Subtitle:</b> {selectedBook.subtitle}</p>
          <button className="btn gray" onClick={() => copy(selectedBook.subtitle, "subtitle")}>{copied === "subtitle" ? "Copied!" : "Copy Subtitle"}</button>

          <p className="mt"><b>Keywords:</b></p>
          <ul className="text-sm">
            {selectedBook.keywords.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
          <button className="btn gray" onClick={() => copy(selectedBook.keywords.join(", "), "keywords")}>{copied === "keywords" ? "Copied!" : "Copy Keywords"}</button>

          <p className="mt"><b>Cover Prompt:</b></p>
          <p className="text-sm">{selectedBook.cover}</p>
          <button className="btn gray" onClick={() => copy(selectedBook.cover, "cover")}>{copied === "cover" ? "Copied!" : "Copy Cover Prompt"}</button>

          <p className="mt"><b>Description:</b></p>
          <p className="text-sm" style={{ whiteSpace: "pre-line" }}>{selectedBook.description}</p>
          <button className="btn gray" onClick={() => copy(selectedBook.description, "description")}>{copied === "description" ? "Copied!" : "Copy Description"}</button>

          <p className="mt"><b>30 Prompts:</b></p>
          <div className="prompt-box text-sm">
            {selectedBook.prompts.map((p, i) => <div key={i}>{i + 1}. {p}</div>)}
          </div>
          <button className="btn gray" onClick={() => copy(selectedBook.prompts.join("\n"), "prompts")}>{copied === "prompts" ? "Copied!" : "Copy Prompts"}</button>
        </div>
      )}
    </div>
  );
}
