import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, BadgeCheck, BookOpen, Check, ChevronDown,
  ChevronLeft, ChevronRight, Clock3, Feather, FileText, Fingerprint,
  History, Lightbulb, LoaderCircle, LockKeyhole, MapPin, Menu,
  MessageSquareText, Plus, Printer, Search, Share2, ShieldCheck,
  Sparkles, Star, UserRound, X
} from 'lucide-react';
import { casesApi, errorMessage } from './api';
import type { CaseHistoryItem, Difficulty, Mystery, Result, Suspect } from './types';

function saveLocalCase(item: CaseHistoryItem) {
  try {
    const raw = localStorage.getItem('case_history');
    const list: CaseHistoryItem[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex(c => c.id === item.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      list.unshift(item);
    }
    localStorage.setItem('case_history', JSON.stringify(list.slice(0, 25)));
  } catch {
    // Ignore storage quota errors
  }
}

function getLocalCases(): CaseHistoryItem[] {
  try {
    const raw = localStorage.getItem('case_history');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function Brand() {
  return (
    <Link className="brand" to="/">
      <span className="brand-mark"><Fingerprint size={20} /></span>
      <span>casefile<span className="brand-dot">.</span></span>
    </Link>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState<CaseHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const openHistory = async () => {
    setHistoryOpen(true);
    setLoadingHistory(true);
    try {
      const serverList = await casesApi.history();
      if (serverList && serverList.length > 0) {
        setHistoryList(serverList);
      } else {
        setHistoryList(getLocalCases());
      }
    } catch {
      setHistoryList(getLocalCases());
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Brand />
        <nav className="topnav">
          <Link to="/create">Create a mystery</Link>
          <Link to="/case/sample">Sample case</Link>
          <button type="button" className="nav-btn-link" onClick={openHistory}>
            <History size={15} /> Case history
          </button>
        </nav>
        <div className="nav-right">
          <button type="button" className="history-pill-btn" onClick={openHistory} title="View your past cases">
            <History size={14} /> <span>History</span>
          </button>
          <span className="session-chip">
            <span className="online-dot" /> Investigator Active
          </span>
          <span className="avatar-button" aria-hidden="true">
            <UserRound size={17} />
          </span>
          <button
            className="mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav">
            <Link to="/create" onClick={() => setMenuOpen(false)}>Create a mystery</Link>
            <Link to="/case/sample" onClick={() => setMenuOpen(false)}>Explore sample case</Link>
            <button
              type="button"
              className="mobile-nav-btn"
              onClick={() => { setMenuOpen(false); openHistory(); }}
            >
              <History size={16} /> View Case History
            </button>
          </nav>
        )}
      </header>

      {/* Case History Modal */}
      {historyOpen && (
        <div className="modal-backdrop" onClick={() => setHistoryOpen(false)}>
          <div className="history-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="history-title">
            <div className="history-modal-header">
              <div>
                <span className="eyebrow"><History size={13} /> INVESTIGATION ARCHIVES</span>
                <h2 id="history-title">Your Case Files</h2>
              </div>
              <button className="icon-action" onClick={() => setHistoryOpen(false)} aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <div className="history-modal-body">
              {loadingHistory ? (
                <div className="history-empty"><LoaderCircle className="spin" size={24} /><p>Loading case files…</p></div>
              ) : historyList.length === 0 ? (
                <div className="history-empty">
                  <FileText size={32} />
                  <p>No cases investigated yet.</p>
                  <small>Create your first mystery or explore the sample case to get started.</small>
                  <Link to="/create" className="button button-primary" onClick={() => setHistoryOpen(false)}>
                    Create a mystery <ArrowRight size={15} />
                  </Link>
                </div>
              ) : (
                <div className="history-items">
                  {historyList.map(c => (
                    <div key={c.id} className="history-item-row">
                      <div className="history-item-info">
                        <strong>{c.title}</strong>
                        <div className="history-item-tags">
                          <span className={`difficulty-pill level-${c.difficulty}`}>{c.difficulty}</span>
                          <span className={`status-badge ${c.status === 'completed' ? 'solved' : 'in-progress'}`}>
                            {c.status === 'completed' ? `Solved (${c.score ?? 0} pts)` : 'In progress'}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={c.status === 'completed' ? `/case/${c.id}/result` : `/case/${c.id}`}
                        className="button button-secondary history-open-btn"
                        onClick={() => setHistoryOpen(false)}
                      >
                        {c.status === 'completed' ? 'View Result' : 'Resume'} <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {children}

      <footer className="site-footer">
        <Brand />
        <span>Curiosity is your best lead. Evidence never lies.</span>
        <span>Stories are fictional · © 2026 Casefile</span>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <Shell>
      <main>
        <section className="hero wrap">
          <div className="hero-copy animate-in">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT GREAT STORY STARTS HERE</div>
            <h1>Some stories are<br />waiting to be <em>solved.</em></h1>
            <p>Step into the story. Follow the evidence. Find the truth hiding in plain sight.</p>
            <div className="hero-actions">
              <Link className="button button-primary" to="/create">Create your mystery <ArrowRight size={17} /></Link>
              <Link className="text-link" to="/case/sample"><span className="play-button">▶</span> Explore a sample case</Link>
            </div>
            <div className="hero-social">
              <div className="avatar-stack"><i>J</i><i>M</i><i>A</i><i>+</i></div>
              <span>Join <b>2,400+</b> curious minds on the case</span>
            </div>
          </div>
          <div className="hero-art animate-in delay-1" aria-label="Illustration of a detective investigation board">
            <div className="art-glow" />
            <div className="paperclip">✳</div>
            <div className="photo-card photo-back">
              <div className="photo-scene">
                <div className="moon" />
                <div className="building b1" />
                <div className="building b2" />
                <div className="building b3" />
              </div>
              <small>PROPERTY RECORD · 02:14 AM</small>
            </div>
            <div className="photo-card photo-front">
              <div className="portrait">
                <div className="portrait-hair" />
                <div className="portrait-face"><span /><i /></div>
                <div className="portrait-neck" />
                <div className="portrait-coat" />
              </div>
              <div className="photo-note">
                <span className="tiny-label">PERSON OF INTEREST</span>
                <strong>Clara Whitmore</strong>
                <small>Estate curator · 38</small>
              </div>
            </div>
            <div className="thread thread-a" />
            <div className="thread thread-b" />
            <div className="pin pin-a" />
            <div className="pin pin-b" />
            <div className="note-tag"><Star size={12} /> SOMETHING DOESN’T ADD UP</div>
            <div className="art-stamp"><span>THE</span><strong>UNKNOWN</strong><span>IS A CLUE</span></div>
          </div>
          <div className="hero-bottom">
            <div><span className="hero-stat">01</span><span>ONE STORY</span></div>
            <div><span className="hero-stat">∞</span><span>POSSIBILITIES</span></div>
            <div><span className="hero-stat">YOU</span><span>CONNECT THE DOTS</span></div>
          </div>
        </section>
        <section className="how-section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <div className="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</div>
                <h2>Three steps to <em>the truth.</em></h2>
              </div>
              <p>Every case is an invitation to look closer,<br />think deeper, and trust your instincts.</p>
            </div>
            <div className="steps-grid">
              <article className="step-card">
                <span className="step-number">01</span>
                <div className="step-icon icon-lilac"><Feather size={21} /></div>
                <h3>Set the scene</h3>
                <p>Give us a premise, a place, a feeling. Your imagination sets the mystery in motion.</p>
                <span className="step-rule" />
              </article>
              <article className="step-card">
                <span className="step-number">02</span>
                <div className="step-icon icon-amber"><Search size={21} /></div>
                <h3>Follow the clues</h3>
                <p>Meet your suspects, study the details, and piece together what really happened.</p>
                <span className="step-rule" />
              </article>
              <article className="step-card">
                <span className="step-number">03</span>
                <div className="step-icon icon-sage"><BadgeCheck size={21} /></div>
                <h3>Make your call</h3>
                <p>Weigh the evidence and name your culprit. Every detail has a reason to be there.</p>
                <span className="step-rule" />
              </article>
            </div>
          </div>
        </section>
        <section className="bottom-cta wrap">
          <div>
            <div className="eyebrow">THE CASE IS YOURS</div>
            <h2>Ready to trust<br />your instincts?</h2>
          </div>
          <Link className="button button-light" to="/create">Start investigating <ArrowRight size={17} /></Link>
          <div className="cta-scribble">No experience needed <span>↗</span></div>
        </section>
      </main>
    </Shell>
  );
}

const PRESET_PREMISES = [
  {
    title: 'The Gallery Heist',
    text: 'A priceless Renaissance painting vanished from a private rooftop gallery during a sudden thunderstorm. Four guests were attending the intimate viewing, and by midnight, one of them was found locked in the wine cellar.'
  },
  {
    title: 'The Clockwork Manor',
    text: 'At exactly 11:15 PM, the master pendulum stopped in Lord Ashford’s study. When the staff unlocked the double doors from outside, the safe was standing wide open with the family ruby missing and a tea cup still steaming.'
  },
  {
    title: 'The Midnight Express',
    text: 'During a blizzard stop at High Peak Station, the passenger in compartment B disappeared without a trace. Their luggage remained neatly packed on the rack, but the snow outside the window showed no footprints whatsoever.'
  }
];

function Create() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [stage, setStage] = useState('');
  const [retryJobId, setRetryJobId] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (scenario.trim().length < 30) {
      setErr('Give us at least 30 characters to build a fair mystery.');
      return;
    }
    if (scenario.length > 2000) {
      setErr('Keep your premise under 2,000 characters.');
      return;
    }
    setLoading(true);
    setErr('');
    try {
      const job = retryJobId ? await casesApi.retryGeneration(retryJobId) : await casesApi.create(scenario.trim(), difficulty);
      for (;;) {
        const state = await casesApi.status(job.caseId);
        setStage(state.stage);
        if (state.status === 'ready') {
          saveLocalCase({ id: job.caseId, title: scenario.slice(0, 45) + '…', difficulty, status: 'active' });
          navigate(`/case/${job.caseId}`);
          return;
        }
        if (state.status === 'failed') {
          setRetryJobId(state.retryable ? job.caseId : null);
          throw new Error(state.error?.message ?? 'The case could not be prepared. Please try again.');
        }
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
    } catch (e) {
      setErr(e instanceof Error && !(e as Error & { isAxiosError?: boolean }).isAxiosError ? e.message : errorMessage(e));
      setLoading(false);
      setStage('');
    }
  };

  const stages = ['queued', 'constructing', 'validating', 'ready'];
  const stageLabels: Record<string, string> = {
    queued: 'Case queued securely',
    constructing: 'Constructing suspects & evidence',
    validating: 'Checking deduction paths for consistency',
    ready: 'Opening the investigation room'
  };

  const isGeminiMissing = err.toLowerCase().includes('not configured') || err.toLowerCase().includes('gemini');

  return (
    <Shell>
      <main className="create-page wrap">
        <Link to="/" className="back-link"><ArrowLeft size={16} /> Back home</Link>
        <div className="create-layout">
          <div className="create-intro">
            <div className="eyebrow">A BLANK PAGE. A THOUSAND POSSIBILITIES.</div>
            <h1>What’s the<br /><em>mystery?</em></h1>
            <p>Give us the first thread. We’ll weave a world of secrets, suspects, and clues for you to unravel.</p>
            <div className="fiction-note">
              <ShieldCheck size={18} />
              <span>Every case is an original work of fiction, generated just for you.</span>
            </div>

            {/* Quick Inspiration Pills */}
            <div className="presets-box">
              <span className="presets-label"><Sparkles size={14} /> Need inspiration? Try a premise:</span>
              <div className="presets-list">
                {PRESET_PREMISES.map(p => (
                  <button
                    key={p.title}
                    type="button"
                    className="preset-btn"
                    onClick={() => { setScenario(p.text); setErr(''); setRetryJobId(null); }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="create-sketch" aria-hidden="true">
              <div className="sketch-ring ring-one" />
              <div className="sketch-ring ring-two" />
              <Fingerprint size={68} />
              <span>BEGIN WITH A QUESTION</span>
            </div>
          </div>

          <form className="create-form paper-panel" onSubmit={submit}>
            <div className="form-top">
              <div>
                <div className="eyebrow">YOUR CASE BEGINS</div>
                <h2>Set the scene</h2>
              </div>
              <span className="form-step">01 <i /> 01</span>
            </div>

            <label htmlFor="premise">Tell us what happened</label>
            <textarea
              id="premise"
              placeholder="A priceless painting vanished from a locked gallery during a thunderstorm. Four people were inside. By morning, one of them had disappeared…"
              value={scenario}
              maxLength={2000}
              onChange={e => { setScenario(e.target.value); setErr(''); setRetryJobId(null); }}
              rows={7}
            />
            <div className="input-meta">
              <span>Be as imaginative or subtle as you like</span>
              <span className={scenario.length > 1900 ? 'count-warn' : ''}>{scenario.length.toLocaleString()} / 2,000</span>
            </div>

            <div className="form-divider" />

            <fieldset className="difficulty-select">
              <legend>Choose your challenge <span>Controls suspect count, evidence volume & hints</span></legend>
              <div className="difficulty-options">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d, i) => (
                  <button
                    key={d}
                    type="button"
                    className={`difficulty-option ${difficulty === d ? 'selected' : ''} level-${d}`}
                    onClick={() => { setDifficulty(d); setRetryJobId(null); }}
                  >
                    <span className="difficulty-icon">{['✳', '✦', '✧'][i]}</span>
                    <span>
                      <strong>{d[0].toUpperCase() + d.slice(1)}</strong>
                      <small>{['3 suspects · 5 clues · 2 hints', '4 suspects · 7 clues · 3 hints', '5 suspects · 9 clues · 3 hints'][i]}</small>
                    </span>
                    {difficulty === d && <Check size={17} className="option-check" />}
                  </button>
                ))}
              </div>
            </fieldset>

            {err && (
              <div className="alert-error" role="alert">
                <p>{err}</p>
                {isGeminiMissing && (
                  <div className="alert-extra-action">
                    <span>You can instantly play the built-in sample case without Gemini configured:</span>
                    <Link to="/case/sample" className="button button-secondary alert-btn">
                      Play Seeded Sample Case <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {loading && (
              <div className="generation-state" aria-live="polite">
                <div className="generation-dots">
                  {stages.map(s => (
                    <i key={s} className={stages.indexOf(stage) >= stages.indexOf(s) ? 'complete' : ''} />
                  ))}
                </div>
                <span>{stageLabels[stage] ?? 'Preparing your investigation…'}</span>
              </div>
            )}

            <button className="button button-primary submit-button" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  {stage === 'validating' ? 'Verifying deduction logic…' : 'Building your case room…'}
                </>
              ) : (
                <>
                  {retryJobId ? 'Retry case generation' : 'Build my mystery'} <Sparkles size={17} />
                </>
              )}
            </button>
            <p className="form-footnote"><LockKeyhole size={14} /> Your premise stays private to your case session.</p>
          </form>
        </div>
      </main>
    </Shell>
  );
}

function CasePage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [mystery, setMystery] = useState<Mystery | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'clues' | 'suspects'>('clues');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'discovered' | 'unread'>('all');
  const [notes, setNotes] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [toast, setToast] = useState('');

  // Investigation stopwatch
  useEffect(() => {
    if (!mystery || mystery.status === 'completed') return;
    const key = `case_timer_${mystery.id}`;
    const initial = parseInt(localStorage.getItem(key) || '0', 10);
    setElapsedSeconds(initial);

    const timer = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        localStorage.setItem(key, String(next));
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mystery?.id, mystery?.status]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const c = id === 'sample' ? await casesApi.sample() : await casesApi.get(id);
        if (!mounted) return;
        if (id === 'sample') navigate(`/case/${c.id}`, { replace: true });
        setMystery(c);
        saveLocalCase({ id: c.id, title: c.title, difficulty: c.difficulty, status: c.status, score: c.score });
        const old = localStorage.getItem(`case-note-${c.id}`);
        if (old) setNotes(old);
        setSelected(c.clues[0]?.id ?? null);
      } catch (e) {
        if (mounted) setError(errorMessage(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const activeClue = mystery?.clues.find(c => c.id === selected);
  const discovered = new Set(mystery?.discoveredClueIds ?? []);

  const discover = async (clueId: string) => {
    if (!mystery || discovered.has(clueId)) return;
    try {
      const updated = await casesApi.discover(mystery.id, clueId);
      setMystery(updated);
      showToast('Clue recorded into evidence log');
    } catch (e) {
      setError(errorMessage(e));
    }
  };

  const askHint = async () => {
    if (!mystery || busy) return;
    setBusy(true);
    setError('');
    try {
      const r = await casesApi.hint(mystery.id);
      setHint(r.hint);
      setMystery(r.mystery);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Shell>
        <div className="loading-screen">
          <LoaderCircle className="spin" size={32} />
          <p>Opening the case file & assembling evidence…</p>
        </div>
      </Shell>
    );
  }

  if (error && !mystery) {
    return (
      <Shell>
        <div className="error-screen">
          <div className="step-icon icon-amber"><FileText size={24} /></div>
          <h1>We can’t open this case.</h1>
          <p>{error}</p>
          <Link className="button button-primary" to="/">Return home <ArrowRight size={17} /></Link>
        </div>
      </Shell>
    );
  }

  if (!mystery) return null;

  // Filter clues
  const availableCategories = Array.from(new Set(mystery.clues.map(c => c.category)));
  const filteredClues = mystery.clues.filter(c => {
    const matchesQuery = `${c.title} ${c.category} ${c.location} ${c.summary}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ? true :
      statusFilter === 'discovered' ? discovered.has(c.id) :
      !discovered.has(c.id);
    return matchesQuery && matchesCategory && matchesStatus;
  });

  // Clue Navigation (Previous/Next)
  const currentClueIndex = activeClue ? mystery.clues.indexOf(activeClue) : -1;
  const prevClue = currentClueIndex > 0 ? mystery.clues[currentClueIndex - 1] : null;
  const nextClue = currentClueIndex >= 0 && currentClueIndex < mystery.clues.length - 1 ? mystery.clues[currentClueIndex + 1] : null;

  return (
    <Shell>
      <main className="room wrap">
        {toast && <div className="toast-notification" role="status"><Check size={16} /> {toast}</div>}

        <div className="room-breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Investigation room</span>
          <span className="case-ref">CASE FILE #{mystery.id.slice(-6).toUpperCase()}</span>
        </div>

        <div className="room-heading">
          <div>
            <div className="eyebrow"><span className="case-pulse" /> CASE IN PROGRESS</div>
            <h1>{mystery.title}</h1>
            <p>{mystery.story}</p>
          </div>
          <div className="room-heading-side">
            <span className={`difficulty-pill level-${mystery.difficulty}`}>{mystery.difficulty} difficulty</span>
            <span className="time-pill" title="Elapsed investigation time">
              <Clock3 size={15} /> <b>{formatTime(elapsedSeconds)}</b> elapsed
            </span>
          </div>
        </div>

        {/* Progress Strip */}
        <div className="progress-strip">
          <div className="progress-copy">
            <span>YOUR INVESTIGATION PROGRESS</span>
            <strong>{discovered.size} <small>of {mystery.clues.length} clues uncovered ({Math.round(mystery.clues.length ? (discovered.size / mystery.clues.length) * 100 : 0)}%)</small></strong>
          </div>
          <div className="progress-bar">
            <i style={{ width: `${mystery.clues.length ? (discovered.size / mystery.clues.length) * 100 : 0}%` }} />
          </div>
          <button className="hint-action" onClick={askHint} disabled={busy || mystery.hintsRemaining <= 0}>
            <Lightbulb size={16} />
            {busy ? 'Finding a hint…' : `Ask for a hint · ${mystery.hintsRemaining} remaining`}
          </button>
        </div>

        {error && (
          <div className="alert-error room-error" role="alert">
            {error}
            <button onClick={() => setError('')} aria-label="Dismiss error"><X size={15} /></button>
          </div>
        )}

        {hint && (
          <div className="hint-card">
            <div className="step-icon icon-amber"><Lightbulb size={20} /></div>
            <div>
              <small>A DEDUCTIVE NUDGE</small>
              <p>{hint}</p>
            </div>
            <button onClick={() => setHint('')} aria-label="Dismiss hint"><X size={18} /></button>
          </div>
        )}

        {/* 3-Column Detective Desk */}
        <div className="room-grid">
          {/* Left Column: Evidence & Suspect List */}
          <aside className="room-left">
            <div className="room-tabs">
              <button
                className={activeTab === 'clues' ? 'active' : ''}
                onClick={() => setActiveTab('clues')}
              >
                <FileText size={16} /> Clues <span>{mystery.clues.length}</span>
              </button>
              <button
                className={activeTab === 'suspects' ? 'active' : ''}
                onClick={() => setActiveTab('suspects')}
              >
                <UserRound size={16} /> Suspects <span>{mystery.suspects.length}</span>
              </button>
            </div>

            <div className="room-list-heading">
              <h3>{activeTab === 'clues' ? 'Evidence Desk' : 'People of Interest'}</h3>
              <span>{activeTab === 'clues' ? `${filteredClues.length} SHOWN` : `${mystery.suspects.length} PERSONS`}</span>
            </div>

            {activeTab === 'clues' ? (
              <>
                <div className="search-field">
                  <Search size={16} />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search clues, locations, text…"
                    aria-label="Search clues"
                  />
                  {query && (
                    <button type="button" className="clear-query" onClick={() => setQuery('')}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Filter chips */}
                <div className="clue-filters">
                  <div className="category-chips">
                    <button
                      type="button"
                      className={`filter-chip ${categoryFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setCategoryFilter('all')}
                    >
                      All
                    </button>
                    {availableCategories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        className={`filter-chip ${categoryFilter === cat ? 'active' : ''}`}
                        onClick={() => setCategoryFilter(categoryFilter === cat ? 'all' : cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <div className="status-toggle-row">
                    <button
                      type="button"
                      className={`status-btn ${statusFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('all')}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      className={`status-btn ${statusFilter === 'unread' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('unread')}
                    >
                      Unread
                    </button>
                    <button
                      type="button"
                      className={`status-btn ${statusFilter === 'discovered' ? 'active' : ''}`}
                      onClick={() => setStatusFilter('discovered')}
                    >
                      Logged
                    </button>
                  </div>
                </div>

                <div className="clue-list">
                  {filteredClues.length === 0 ? (
                    <div className="no-clues-found">No clues match your current filters.</div>
                  ) : (
                    filteredClues.map((clue, i) => (
                      <button
                        key={clue.id}
                        className={`clue-row ${selected === clue.id ? 'chosen' : ''}`}
                        onClick={() => { setSelected(clue.id); discover(clue.id); }}
                      >
                        <span className="clue-index">{String(i + 1).padStart(2, '0')}</span>
                        <span className="clue-row-copy">
                          <strong>{clue.title}</strong>
                          <small>
                            <span className={`cat-tag cat-${clue.category.toLowerCase().replace(/\s+/g, '-')}`}>
                              {clue.category}
                            </span>
                            <i /> {clue.location}
                          </small>
                        </span>
                        {discovered.has(clue.id) ? (
                          <span className="status-pill logged" title="Clue logged"><Check size={12} /> Logged</span>
                        ) : (
                          <span className="status-pill unread" title="New evidence">• New</span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className="suspect-list">
                {mystery.suspects.map(s => (
                  <SuspectCard
                    key={s.id}
                    suspect={s}
                    selected={selected === s.id}
                    onClick={() => setSelected(s.id)}
                  />
                ))}
              </div>
            )}

            <div className="sidebar-foot">
              <ShieldCheck size={16} />
              <span>Everyone has a story.<br /><b>Not everyone is telling the truth.</b></span>
            </div>
          </aside>

          {/* Center Column: Evidence Inspection / Suspect File */}
          <section className="evidence-panel">
            {activeTab === 'clues' && activeClue ? (
              <>
                <div className="evidence-topline">
                  <span className={`evidence-label cat-${activeClue.category.toLowerCase().replace(/\s+/g, '-')}`}>
                    <span className="evidence-bullet" /> {activeClue.category}
                  </span>
                  <span className="evidence-number">
                    EVIDENCE #{String(mystery.clues.indexOf(activeClue) + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="evidence-illustration">
                  <div className="evidence-paper">
                    <span className="paper-stamp">CASEFILE<br />ARCHIVE</span>
                    <div className="paper-lines" />
                    <div className="paper-signature">
                      {activeClue.category === 'Document' ? 'RECORD NO. 001' : 'FIELD NOTES'}
                    </div>
                    <div className="paper-clip">⌁</div>
                  </div>
                  <div className="evidence-orbit orbit-1" />
                  <div className="evidence-orbit orbit-2" />
                  <span className="evidence-spark">✳</span>
                </div>

                <div className="evidence-content">
                  <div className="evidence-kicker">{activeClue.category} <i /> ADDED TO CASE FILE</div>
                  <h2>{activeClue.title}</h2>
                  <p className="evidence-summary">{activeClue.detail}</p>

                  <div className="evidence-meta">
                    <div>
                      <Clock3 size={16} />
                      <span>
                        <small>TIME RECORDED</small>
                        <b>{activeClue.time}</b>
                      </span>
                    </div>
                    <div>
                      <MapPin size={16} />
                      <span>
                        <small>FOUND AT</small>
                        <b>{activeClue.location}</b>
                      </span>
                    </div>
                  </div>

                  {/* Mentioned Suspects Links */}
                  {activeClue.suspectIds && activeClue.suspectIds.length > 0 && (
                    <div className="evidence-suspects-link">
                      <small>PERSONS REFERENCED IN THIS EVIDENCE:</small>
                      <div className="suspect-tag-chips">
                        {activeClue.suspectIds.map(suspectId => {
                          const matched = mystery.suspects.find(s => s.id === suspectId);
                          if (!matched) return null;
                          return (
                            <button
                              key={suspectId}
                              type="button"
                              className="suspect-ref-chip"
                              onClick={() => {
                                setActiveTab('suspects');
                                setSelected(suspectId);
                              }}
                              title={`Inspect ${matched.name}`}
                            >
                              <span className="chip-avatar">{matched.avatar}</span>
                              <span>{matched.name}</span>
                              <ArrowRight size={12} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Evidence Navigation (Prev / Next) */}
                  <div className="evidence-nav-bar">
                    <button
                      type="button"
                      className="nav-arrow-btn"
                      disabled={!prevClue}
                      onClick={() => {
                        if (prevClue) {
                          setSelected(prevClue.id);
                          discover(prevClue.id);
                        }
                      }}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="nav-counter">
                      Clue {currentClueIndex + 1} of {mystery.clues.length}
                    </span>
                    <button
                      type="button"
                      className="nav-arrow-btn"
                      disabled={!nextClue}
                      onClick={() => {
                        if (nextClue) {
                          setSelected(nextClue.id);
                          discover(nextClue.id);
                        }
                      }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="evidence-actions">
                    <button
                      className={`button ${discovered.has(activeClue.id) ? 'button-success' : 'button-primary'}`}
                      onClick={() => discover(activeClue.id)}
                    >
                      {discovered.has(activeClue.id) ? (
                        <><Check size={16} /> Clue logged into case</>
                      ) : (
                        <><Plus size={16} /> Add to my findings</>
                      )}
                    </button>
                    <button
                      className="icon-action"
                      aria-label="Copy case link"
                      title="Copy case link"
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(window.location.href);
                          showToast('Case link copied to clipboard!');
                        }
                      }}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : activeTab === 'suspects' ? (
              <div className="suspect-detail">
                {(() => {
                  const s = mystery.suspects.find(s => s.id === selected) || mystery.suspects[0];
                  if (!s) return null;
                  const relatedClues = mystery.clues.filter(c => c.suspectIds?.includes(s.id));
                  return (
                    <>
                      <div className="suspect-large-avatar">{s.avatar}</div>
                      <div className="eyebrow">PERSON OF INTEREST</div>
                      <h2>{s.name}</h2>
                      <div className="suspect-role">{s.role} · {s.age} years old</div>
                      <div className="suspect-quote">“{s.description}”</div>
                      <div className="suspect-meta">
                        <small>POSSIBLE MOTIVE</small>
                        <p>{s.motive}</p>
                      </div>

                      {relatedClues.length > 0 && (
                        <div className="suspect-evidence-box">
                          <small>CONNECTED EVIDENCE ({relatedClues.length})</small>
                          <div className="suspect-clue-chips">
                            {relatedClues.map(c => (
                              <button
                                key={c.id}
                                type="button"
                                className="suspect-clue-chip"
                                onClick={() => {
                                  setActiveTab('clues');
                                  setSelected(c.id);
                                  discover(c.id);
                                }}
                              >
                                <FileText size={13} />
                                <span>{c.title}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <p className="muted-note">
                        A motive is not proof. Look for physical or digital evidence that places someone at the scene.
                      </p>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="empty-evidence">
                <FileText size={32} />
                <p>Select a clue or suspect to inspect details.</p>
              </div>
            )}
          </section>

          {/* Right Column: Detective Notebook & Suspects at a Glance */}
          <aside className="room-right">
            <div className="notebook-head">
              <div>
                <div className="eyebrow">YOUR PERSONAL NOTES</div>
                <h3>Case notebook <BookOpen size={16} /></h3>
              </div>
              <span className="saved-label"><Check size={13} /> Auto-saved</span>
            </div>
            <textarea
              className="notebook"
              placeholder="Record connections, contradictions, alibis, questions…"
              value={notes}
              onChange={e => {
                setNotes(e.target.value);
                localStorage.setItem(`case-note-${mystery.id}`, e.target.value);
              }}
              aria-label="Case notebook"
            />
            <div className="notebook-tip">
              <MessageSquareText size={15} />
              <span>Your thoughts stay private on this device and never affect your score.</span>
            </div>

            <div className="room-side-divider" />

            <div className="suspects-heading">
              <div className="eyebrow">AT A GLANCE</div>
              <h3>People in the story</h3>
            </div>
            {mystery.suspects.map(s => (
              <button
                className={`mini-suspect ${selected === s.id && activeTab === 'suspects' ? 'mini-selected' : ''}`}
                key={s.id}
                onClick={() => { setActiveTab('suspects'); setSelected(s.id); }}
              >
                <span className="mini-avatar">{s.avatar}</span>
                <span>
                  <b>{s.name}</b>
                  <small>{s.role}</small>
                </span>
                <ChevronDown size={15} />
              </button>
            ))}

            <Link className="accuse-button" to={`/case/${mystery.id}/accuse`}>
              <span>Make an accusation</span>
              <ArrowRight size={17} />
            </Link>
            <div className="privacy-note">
              <LockKeyhole size={13} /> Your solution stays secret until you submit your accusation.
            </div>
          </aside>
        </div>
      </main>
    </Shell>
  );
}

function SuspectCard({ suspect, selected, onClick }: { suspect: Suspect; selected: boolean; onClick: () => void }) {
  return (
    <button className={`suspect-row ${selected ? 'chosen' : ''}`} onClick={onClick}>
      <span className="mini-avatar">{suspect.avatar}</span>
      <span>
        <b>{suspect.name}</b>
        <small>{suspect.role} · {suspect.age}</small>
      </span>
      <ArrowRight size={15} />
    </button>
  );
}

function Accusation() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [mystery, setMystery] = useState<Mystery | null>(null);
  const [selected, setSelected] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    casesApi.get(id).then(setMystery).catch(e => setError(errorMessage(e)));
  }, [id]);

  const submit = async () => {
    if (!selected || !mystery) return;
    setBusy(true);
    try {
      const result = await casesApi.accuse(mystery.id, selected);
      sessionStorage.setItem(`result-${mystery.id}`, JSON.stringify(result));
      saveLocalCase({
        id: mystery.id,
        title: mystery.title,
        difficulty: mystery.difficulty,
        status: 'completed',
        score: result.score
      });
      navigate(`/case/${mystery.id}/result`);
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  };

  if (!mystery) {
    return (
      <Shell>
        <div className="loading-screen">
          {error ? <p role="alert">{error}</p> : <><LoaderCircle className="spin" size={30} /><p>Reviewing the case files…</p></>}
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="accusation-page wrap">
        <Link className="back-link" to={`/case/${id}`}><ArrowLeft size={16} /> Back to the investigation room</Link>
        <div className="accusation-card paper-panel">
          <div className="step-icon icon-lilac"><Fingerprint size={26} /></div>
          <div className="eyebrow">THE MOMENT OF TRUTH</div>
          <h1>Who do you<br /><em>believe did it?</em></h1>
          <p>Choose carefully. Once submitted, your accusation is permanent and the truth will be revealed.</p>

          <div className="accused-list">
            {mystery.suspects.map(s => (
              <button
                key={s.id}
                className={`accused-option ${selected === s.id ? 'selected' : ''}`}
                onClick={() => setSelected(s.id)}
              >
                <span className="mini-avatar">{s.avatar}</span>
                <span>
                  <b>{s.name}</b>
                  <small>{s.role} · {s.motive}</small>
                </span>
                <span className="radio-dot">{selected === s.id && <i />}</span>
              </button>
            ))}
          </div>

          {error && <div className="alert-error" role="alert">{error}</div>}

          <button className="button button-primary submit-button" disabled={!selected || busy} onClick={submit}>
            {busy ? (
              <><LoaderCircle size={18} className="spin" /> Recording your final accusation…</>
            ) : (
              <>Submit final accusation <ArrowRight size={17} /></>
            )}
          </button>
          <div className="confirmation-note">
            <LockKeyhole size={14} /> One accusation per case. The full explanation will be revealed next.
          </div>
        </div>
      </main>
    </Shell>
  );
}

function Results() {
  const { id = '' } = useParams();
  const [result, setResult] = useState<Result | null>(null);
  const [mystery, setMystery] = useState<Mystery | null>(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    let cached = sessionStorage.getItem(`result-${id}`);
    if (cached) {
      setResult(JSON.parse(cached));
      casesApi.get(id).then(setMystery).catch(() => {});
    } else {
      Promise.all([casesApi.result(id), casesApi.get(id)])
        .then(([r, m]) => {
          setResult(r);
          setMystery(m);
          saveLocalCase({
            id: m.id,
            title: m.title,
            difficulty: m.difficulty,
            status: 'completed',
            score: r.score
          });
        })
        .catch(e => setError(errorMessage(e)));
    }
  }, [id]);

  if (!result) {
    return (
      <Shell>
        <div className="loading-screen">
          {error ? (
            <>
              <p role="alert">{error}</p>
              <Link className="text-link" to={`/case/${id}`}>Return to the case <ArrowRight size={15} /></Link>
            </>
          ) : (
            <><LoaderCircle className="spin" size={30} /><p>Reconstructing the case explanation…</p></>
          )}
        </div>
      </Shell>
    );
  }

  // Get investigation time if stored
  const timerSecs = parseInt(localStorage.getItem(`case_timer_${id}`) || '0', 10);
  const formattedDuration = timerSecs > 0 ? `${Math.floor(timerSecs / 60)}m ${timerSecs % 60}s` : null;

  return (
    <Shell>
      <main className="results-page wrap">
        {toast && <div className="toast-notification" role="status"><Check size={16} /> {toast}</div>}
        <div className="result-confetti">✳</div>
        <div className="result-card paper-panel">
          <div className={`result-emblem ${result.correct ? 'correct' : 'incorrect'}`}>
            {result.correct ? <BadgeCheck size={36} /> : <Fingerprint size={36} />}
          </div>
          <div className="eyebrow">CASE CLOSED · {result.correct ? 'DEDUCTION ACCURATE' : 'THE TRUTH WAS ELUSIVE'}</div>
          <h1>{result.correct ? 'Your instincts were right.' : 'A clever theory, but…'}</h1>
          <p className="result-intro">
            {result.correct
              ? 'You weighed the evidence, broke through the red herrings, and named the true culprit.'
              : 'Take a breath. Even the greatest detectives occasionally chase the wrong lead.'}
          </p>

          <div className="verdict-grid">
            <div>
              <span>YOU ACCUSED</span>
              <strong>{result.accusation.name}</strong>
              <small>{result.accusation.role}</small>
            </div>
            <div className="verdict-arrow">→</div>
            <div>
              <span>THE ACTUAL CULPRIT</span>
              <strong className={result.correct ? 'culprit-correct' : 'culprit-reveal'}>{result.culprit.name}</strong>
              <small>{result.culprit.role}</small>
            </div>
          </div>

          <div className="score-box">
            <div>
              <small>YOUR CASE SCORE</small>
              <strong>{result.score}<i>pts</i></strong>
              {formattedDuration && (
                <span className="duration-tag"><Clock3 size={12} /> Time: {formattedDuration}</span>
              )}
            </div>
            <div className="score-breakdown">
              <span>Correct accusation <b>+{result.breakdown.base}</b></span>
              <span>Clues uncovered <b>+{result.breakdown.clues}</b></span>
              <span>Hints used <b>−{result.breakdown.hints}</b></span>
            </div>
          </div>

          <div className="explanation">
            <div className="eyebrow">THE RESOLUTION DOSSIER</div>
            <h2>Here’s what really happened</h2>
            <p>{result.explanation}</p>
          </div>

          <div className="resolution-facts">
            <article>
              <div className="eyebrow">THE MOTIVE</div>
              <p>{result.motive}</p>
            </article>
            <article>
              <div className="eyebrow">THE METHOD</div>
              <p>{result.method}</p>
            </article>
          </div>

          {result.timeline && (
            <div className="resolution-timeline">
              <div className="eyebrow">RECONSTRUCTED TIMELINE OF EVENTS</div>
              {result.timeline.map((event, i) => (
                <div key={i}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <p>{event}</p>
                </div>
              ))}
            </div>
          )}

          {mystery && (
            <div className="result-clues">
              <div className="eyebrow">KEY EVIDENCE THAT ESTABLISHED THE SOLUTION</div>
              <div>
                {mystery.clues.filter(c => c.key).map(c => (
                  <div key={c.id}>
                    <Check size={16} />
                    <span>
                      <b>{c.title}</b>
                      <small>{c.summary}</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="result-actions">
            <Link className="button button-primary" to="/create">
              Create another mystery <Plus size={16} />
            </Link>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => window.print()}
              title="Print a physical detective report"
            >
              <Printer size={16} /> Print Detective Dossier
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  showToast('Result link copied to clipboard!');
                }
              }}
            >
              <Share2 size={16} /> Share Result
            </button>
            <Link className="text-link" to="/">
              Back to home <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    </Shell>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Create />} />
      <Route path="/case/:id" element={<CasePage />} />
      <Route path="/case/:id/accuse" element={<Accusation />} />
      <Route path="/case/:id/result" element={<Results />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
