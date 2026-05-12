import { useState, useEffect, useCallback } from 'react';
import {
  Search, Trophy, Calendar, MapPin, Users, Activity,
  ChevronLeft, ChevronRight, ExternalLink,
  UserPlus, UserMinus, ChevronDown, ChevronUp,
  Wifi, Building2, Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const WP_URL       = import.meta.env.VITE_WP_URL  || 'http://localhost/wordpress';
const LARAVEL_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api')
  .replace(/\/api\/?$/, '');
const LARAVEL_API  = `${LARAVEL_BASE}/api`;
const WP_API       = `${WP_URL}/wp-json/wp/v2/tryouts`;

const StatusIcon = {
  approved: () => (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" className="inline-block">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  registered: () => (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" className="inline-block">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M8 5v3.5l2 2" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  rejected: () => (
    <svg viewBox="0 0 16 16" width="11" height="11" fill="none" className="inline-block">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round"/>
    </svg>
  ),
};

const P_STATUS = {
  registered: { label: 'Pending',  color: 'text-yellow-400', Icon: StatusIcon.registered },
  approved:   { label: 'Approved', color: 'text-green-400',  Icon: StatusIcon.approved   },
  rejected:   { label: 'Rejected', color: 'text-red-400',    Icon: StatusIcon.rejected   },
};

const STATUS_MAP = {
  scheduled: { label: 'Upcoming',  style: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
  ongoing:   { label: 'Live',      style: 'bg-brand-red/10 text-brand-red border border-brand-red/20'    },
  finished:  { label: 'Finished',  style: 'bg-gray-800 text-gray-300 border border-gray-700'             },
  cancelled: { label: 'Cancelled', style: 'bg-gray-900 text-gray-500 border border-gray-800'             },
};

const TAB_FILTERS = {
  all:          null,
  upcoming:     'scheduled',
  live:         'ongoing',
  completed:    'finished',
  
};

function resolveAsset(url) {
  if (!url) return null;
  if (/^https?:\/\
  return `${LARAVEL_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

function tryoutField(tryout, field) {
  if (tryout[field] !== undefined && tryout[field] !== '' && tryout[field] !== null)
    return tryout[field];
  if (tryout.meta?.[field] !== undefined && tryout.meta[field] !== '' && tryout.meta[field] !== null)
    return tryout.meta[field];
  return null;
}

function featuredImage(tryout) {
  
  const media = tryout._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  
  return media.media_details?.sizes?.medium_large?.source_url
      || media.media_details?.sizes?.medium?.source_url
      || media.source_url
      || null;
}

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return d; }
}

function useEnrollment(wpPostId, token, onOwnerResolved) {
  const [data, setData]   = useState({ enrolled: false, status: null, is_owner: false });
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = useCallback(async () => {
    if (!token || !wpPostId) return;
    try {
      const r = await fetch(`${LARAVEL_API}/tryouts/${wpPostId}/my-status`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (r.ok) {
        const d = await r.json();
        setData(d);
        if (onOwnerResolved) onOwnerResolved(!!d.is_owner);
      }
    } catch {}
  }, [wpPostId, token, onOwnerResolved]);

  const join = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch(`${LARAVEL_API}/tryouts/${wpPostId}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      const d = await r.json();
      if (r.ok) setData(prev => ({ ...prev, enrolled: true, status: d.status }));
      else      setError(d.message || 'Could not register.');
    } catch { setError('Connection error.'); }
    finally { setBusy(false); }
  };

  const leave = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch(`${LARAVEL_API}/tryouts/${wpPostId}/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (r.ok) setData(prev => ({ ...prev, enrolled: false, status: null }));
      else { const d = await r.json(); setError(d.message || 'Cannot cancel.'); }
    } catch { setError('Connection error.'); }
    finally { setBusy(false); }
  };

  return { data, fetchStatus, join, leave, busy, error };
}

function EnrollButton({ wpPostId, tryoutStatus, token, onOwnerResolved }) {
  const { data, fetchStatus, join, leave, busy, error } = useEnrollment(wpPostId, token, onOwnerResolved);
  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const canEnroll = tryoutStatus === 'scheduled' || tryoutStatus === 'ongoing';

  if (!token)         return <span className="text-[10px] text-gray-600 italic">Sign in to join</span>;
  if (data.is_owner)  return <span className="text-[10px] text-gray-500 italic">Your event</span>;
  if (!canEnroll)     return null;

  const ps = data.status ? P_STATUS[data.status] : null;

  return (
    <div className="flex flex-col items-end gap-1">
      {data.enrolled ? (
        <div className="flex items-center gap-2">
          {ps && (
            <span className={`flex items-center gap-1 text-[10px] font-semibold ${ps.color}`}>
              <ps.Icon /> {ps.label}
            </span>
          )}
          {data.status === 'registered' && (
            <button onClick={leave} disabled={busy}
              className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-[10px] font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-40">
              <UserMinus size={10} /> Cancel
            </button>
          )}
        </div>
      ) : (
        <button onClick={join} disabled={busy}
          className="flex items-center gap-1 bg-brand-red hover:bg-[#FF4D4D] text-white text-[10px] font-bold px-3 py-1.5 rounded transition-colors disabled:opacity-50">
          <UserPlus size={10} /> {busy ? '...' : 'Join'}
        </button>
      )}
      {error && <p className="text-[10px] text-red-400 max-w-[150px] text-right leading-tight">{error}</p>}
    </div>
  );
}

function ParticipantsPanel({ wpPostId, token, isOwner }) {
  const [open, setOpen]             = useState(false);
  const [parts, setParts]           = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const isManager = isOwner;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${LARAVEL_API}/tryouts/${wpPostId}/participants`);
      if (r.ok) {
        const d = await r.json();
        setParts(d.participants || []);
        setStats({ total: d.total, approved: d.approved, registered: d.registered, rejected: d.rejected });
      }
    } catch {}
    finally { setLoading(false); }
  }, [wpPostId]);

  useEffect(() => { if (open) load(); }, [open, load]);

  const updateStatus = async (pId, status) => {
    if (!token) return;
    setUpdatingId(pId);
    try {
      const r = await fetch(`${LARAVEL_API}/tryouts/${wpPostId}/participants/${pId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (r.ok) await load();
    } catch {}
    finally { setUpdatingId(null); }
  };

  return (
    <div className="border-t border-gray-800">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-white transition-colors">
        <span className="flex items-center gap-2">
          <Users size={12} /> Participants
          {stats && (
            <span className="bg-gray-800 px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-300">
              {stats.total}
            </span>
          )}
        </span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {open && (
        <div className="px-5 pb-4">
          {stats && (
            <div className="flex gap-3 mb-3 text-[10px] font-semibold flex-wrap">
              <span className="text-green-400 flex items-center gap-1"><StatusIcon.approved /> {stats.approved} approved</span>
              <span className="text-yellow-400 flex items-center gap-1"><StatusIcon.registered /> {stats.registered} pending</span>
              <span className="text-red-400 flex items-center gap-1"><StatusIcon.rejected /> {stats.rejected} rejected</span>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-brand-red" />
            </div>
          ) : parts.length === 0 ? (
            <p className="text-gray-600 text-xs py-2">No participants yet.</p>
          ) : (
            <ul className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {parts.map(p => {
                const si      = P_STATUS[p.status] || P_STATUS.registered;
                const avatarSrc = resolveAsset(p.user.avatar);
                return (
                  <li key={p.id} className="flex items-center gap-2 py-1.5 border-b border-gray-800/40 last:border-0">
                    {avatarSrc
                      ? <img src={avatarSrc} alt={p.user.name} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                      : <span className="w-7 h-7 rounded-full bg-brand-red/20 text-brand-red text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {(p.user.name || 'U')[0].toUpperCase()}
                        </span>
                    }
                    <span className="flex-1 min-w-0 text-xs text-white truncate">{p.user.nickname || p.user.name}</span>
                    <span className={`flex items-center gap-1 text-[10px] font-semibold ${si.color}`}>
                      <si.Icon /> {si.label}
                    </span>
                    {isManager && (
                      <div className="flex gap-1 ml-1">
                        {p.status !== 'approved' && (
                          <button disabled={updatingId === p.id} onClick={() => updateStatus(p.id, 'approved')}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-40">
                            ✓
                          </button>
                        )}
                        {p.status !== 'rejected' && (
                          <button disabled={updatingId === p.id} onClick={() => updateStatus(p.id, 'rejected')}
                            className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40">
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function EventCard({ tryout, token, userRole }) {
  const [isOwner, setIsOwner] = useState(false);
  const status         = tryoutField(tryout, 'tryout_status') || 'scheduled';
  const eventDate      = tryoutField(tryout, 'event_date');
  const locationType   = tryoutField(tryout, 'location_type') || 'online';
  const locationDetail = tryoutField(tryout, 'location_details');
  const maxParticipants= tryoutField(tryout, 'max_participants');
  const prizePool      = tryoutField(tryout, 'prize_pool');

  const statusInfo     = STATUS_MAP[status] || STATUS_MAP.scheduled;
  const prize          = prizePool
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(prizePool)
    : null;
  const LocationIcon   = locationType === 'lan' ? Building2 : Wifi;
  const locationText   = locationType === 'lan'
    ? `LAN${locationDetail ? ` — ${locationDetail}` : ''}`
    : `Online${locationDetail ? ` — ${locationDetail}` : ''}`;
  const gameName       = tryout._embedded?.['wp:term']?.flat()?.find(t => t.taxonomy === 'tryout_game')?.name || null;
  const imgSrc         = featuredImage(tryout);

  return (
    <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-red/40 hover:shadow-[0_0_18px_rgba(255,51,51,0.1)] hover:-translate-y-1 flex flex-col">

      {}
      <div className="h-32 relative flex items-center justify-center border-b border-gray-800 overflow-hidden bg-gradient-to-br from-[#FF3333]/10 to-transparent">
        {imgSrc ? (
          <img src={imgSrc} alt={tryout.title?.rendered || ''}
               className="absolute inset-0 w-full h-full object-cover opacity-60" />
        ) : (
          <Trophy size={34} className="text-brand-red opacity-50" />
        )}
        {}
        {imgSrc && <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 to-transparent" />}

        {status === 'ongoing' && (
          <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded z-10">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        )}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded z-10 ${statusInfo.style}`}>
          {statusInfo.label}
        </span>
      </div>

      {}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-bold text-white leading-tight line-clamp-2 mb-1"
            dangerouslySetInnerHTML={{ __html: tryout.title?.rendered || '—' }} />

        {gameName && (
          <span className="inline-block text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded mb-3 w-fit">
            {gameName}
          </span>
        )}

        <div className="space-y-2 text-xs text-gray-400 flex-1">
          {eventDate && (
            <div className="flex items-center gap-2">
              <Calendar size={12} className="flex-shrink-0" />
              <span>{formatDate(eventDate)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <LocationIcon size={12} className="flex-shrink-0" />
            <span>{locationText}</span>
          </div>
          {maxParticipants && (
            <div className="flex items-center gap-2">
              <Users size={12} className="flex-shrink-0" />
              <span>{maxParticipants} max slots</span>
            </div>
          )}
        </div>

        {}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
          <div className="flex items-baseline gap-1">
            {prize
              ? <><span className="text-brand-red font-bold text-sm">{prize}</span>
                  <span className="text-gray-500 text-[10px] uppercase ml-1">Prize Pool</span></>
              : <span className="text-gray-700 text-[10px] uppercase">No prize pool</span>
            }
          </div>
          <div className="flex items-center gap-2">
            <EnrollButton wpPostId={tryout.id} tryoutStatus={status} token={token}
              onOwnerResolved={setIsOwner} />
            <a href={tryout.link} target="_blank" rel="noopener noreferrer" title="View on WordPress"
              className="flex items-center border border-gray-700 hover:border-gray-500 text-gray-500 hover:text-white p-1.5 rounded transition-colors">
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      <ParticipantsPanel wpPostId={tryout.id} token={token} isOwner={isOwner} />
    </div>
  );
}

export default function Events() {
  const { user, token } = useAuth();

  const [tryouts, setTryouts]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [activeTab, setActiveTab]     = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);

  const [myParticipations, setMyParticipations] = useState(null);
  const [myTeamIds, setMyTeamIds]               = useState(null);

  const isSpecialTab = activeTab === 'participating' || activeTab === 'my-events';

  useEffect(() => {
    if (activeTab !== 'participating' || !token) return;
    if (myParticipations !== null) return;
    fetch(`${LARAVEL_API}/tryouts/my-participations`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.ok ? r.json() : { wp_post_ids: [] })
      .then(d => setMyParticipations(new Set((d.wp_post_ids || []).map(Number))))
      .catch(() => setMyParticipations(new Set()));
  }, [activeTab, token, myParticipations]);

  useEffect(() => {
    if (activeTab !== 'my-events' || !token) return;
    if (myTeamIds !== null) return;
    fetch(`${LARAVEL_API}/teams?owner=me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    })
      .then(r => r.ok ? r.json() : { data: [] })
      .then(d => {
        const ids = (d.data || d || []).map(t => Number(t.id));
        setMyTeamIds(new Set(ids));
      })
      .catch(() => setMyTeamIds(new Set()));
  }, [activeTab, token, myTeamIds]);

  const buildApiUrl = useCallback(() => {
    const p = new URLSearchParams({ per_page: '9', page: String(page), _embed: '1' });
    if (searchQuery) p.set('search', searchQuery);
    const sf = TAB_FILTERS[activeTab];
    if (sf) p.set('tryout_status', sf);
    return `${WP_API}?${p.toString()}`;
  }, [page, activeTab, searchQuery]);

  const fetchTryouts = useCallback(async () => {
    
    setLoading(true); setError(null);
    try {
      const url = isSpecialTab
        ? `${WP_API}?per_page=100&page=1&_embed=1${searchQuery ? '&search=' + encodeURIComponent(searchQuery) : ''}`
        : buildApiUrl();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`WP API ${res.status}`);
      let data = await res.json();

      if (activeTab === 'participating' && myParticipations !== null) {
        data = data.filter(t => myParticipations.has(Number(t.id)));
      }
      if (activeTab === 'my-events' && myTeamIds !== null) {
        data = data.filter(t => {
          const tid = Number(tryoutField(t, 'team_id'));
          return tid && myTeamIds.has(tid);
        });
      }

      setTryouts(data);
      setTotalPages(isSpecialTab ? 1 : parseInt(res.headers.get('X-WP-TotalPages') || '1', 10));
    } catch {
      setError('Could not load events. Make sure WordPress is running.');
    } finally { setLoading(false); }
  }, [buildApiUrl, isSpecialTab, activeTab, searchQuery, myParticipations, myTeamIds]);

  useEffect(() => {
    
    if (activeTab === 'participating' && myParticipations === null) return;
    if (activeTab === 'my-events' && myTeamIds === null) return;
    const t = setTimeout(fetchTryouts, searchQuery ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchTryouts, myParticipations, myTeamIds]);

  const tabs = [
    { key: 'all',          label: 'All' },
    { key: 'upcoming',     label: 'Upcoming' },
    { key: 'live',         label: 'Live', icon: <Activity size={13} /> },
    { key: 'completed',    label: 'Finished' },
    ...(token ? [
      { key: 'participating', label: 'Participating' },
      { key: 'my-events',     label: 'My Events' },
    ] : []),
  ];

  return (
    <div className="space-y-8">

      {}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Events & Tryouts</h1>
        <p className="text-gray-400 text-sm">Find and compete in tryouts across all games.</p>
        {user && (
          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5">
            <Shield size={11} />
            Signed in as <span className="text-white font-medium">{user.nickname || user.name}</span>
            {user.role === 'admin' && (
              <span className="bg-brand-red/10 text-brand-red text-[10px] font-bold px-2 py-0.5 rounded">
                admin
              </span>
            )}
          </p>
        )}
      </div>

      {}
      <div className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, icon }) => (
          <button key={key}
            onClick={() => { setActiveTab(key); setPage(1); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === key
                ? 'bg-brand-red text-white'
                : 'bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
            }`}>
            {label}{icon && <span>{icon}</span>}
          </button>
        ))}
      </div>

      {}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input type="text" value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
          placeholder="Search events..."
          className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500" />
      </div>

      {}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-red" />
        </div>
      ) : error ? (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-gray-800">
          <Trophy size={44} className="text-gray-700 mx-auto mb-4" />
          <p className="text-white font-medium mb-1">Failed to load events</p>
          <p className="text-gray-400 text-sm">{error}</p>
          <button onClick={fetchTryouts} className="mt-4 text-brand-red hover:underline text-sm">Retry</button>
        </div>
      ) : tryouts.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-gray-800">
          <Trophy size={44} className="text-gray-700 mx-auto mb-4" />
          <p className="text-white font-medium">No events found</p>
          <p className="text-gray-500 text-sm mt-1">
            {activeTab === 'participating' ? "You haven't joined any tryouts yet." :
             activeTab === 'my-events'     ? "You don't have any events as a team owner." :
             "Try a different filter or check back later."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tryouts.map(t => (
            <EventCard key={t.id} tryout={t} token={token} userRole={user?.role} />
          ))}
        </div>
      )}

      {}
      {!loading && !isSpecialTab && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg bg-[#121212] border border-gray-800 text-white disabled:opacity-40 hover:bg-gray-800 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-400 text-sm">
            Page <span className="text-white font-medium">{page}</span> of{' '}
            <span className="text-white font-medium">{totalPages}</span>
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="p-2 rounded-lg bg-[#121212] border border-gray-800 text-white disabled:opacity-40 hover:bg-gray-800 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
