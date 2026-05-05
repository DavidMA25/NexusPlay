import { useState, useEffect } from 'react';
import { Calendar, Users, ArrowRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgFindYourGame from '../assets/find-your-game.png';
import imgMatchSystem from '../assets/match-system.jpg';
import imgInstantTryout from '../assets/instant-tryout.jpg';

const WP_URL = import.meta.env.VITE_WP_URL || 'http://localhost/wordpress';
const WP_API = `${WP_URL}/wp-json/wp/v2/tryouts`;

const STATUS_MAP = {
  scheduled: { label: 'Upcoming', style: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
  ongoing:   { label: 'Live',     style: 'bg-brand-red/10 text-brand-red border border-brand-red/20 animate-pulse' },
  finished:  { label: 'Finished', style: 'bg-gray-800 text-gray-300 border border-gray-700' },
};

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return d; }
}

function getFeaturedImage(tryout) {
  const media = tryout._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.medium_large?.source_url
    || media.media_details?.sizes?.medium?.source_url
    || media.source_url
    || null;
}

function getField(tryout, field) {
  if (tryout[field] != null && tryout[field] !== '') return tryout[field];
  if (tryout.meta?.[field] != null && tryout.meta[field] !== '') return tryout.meta[field];
  return null;
}

// datos de ejemplo para cuando wordpress no esta corriendo
const MOCK_EVENTS = [
  {
    id: 1,
    title: { rendered: 'Valorant Open Tryout — Spring 2026' },
    date: '2026-05-20T18:00:00',
    meta: { tryout_status: 'scheduled', max_participants: '16' },
    mockImg: imgFindYourGame,
  },
  {
    id: 2,
    title: { rendered: 'League of Legends 5v5 Showdown' },
    date: '2026-05-22T20:00:00',
    meta: { tryout_status: 'ongoing', max_participants: '10' },
    mockImg: imgMatchSystem,
  },
  {
    id: 3,
    title: { rendered: 'CS2 Pro Recruitment — NexusPlay Cup' },
    date: '2026-05-28T17:00:00',
    meta: { tryout_status: 'scheduled', max_participants: '20' },
    mockImg: imgInstantTryout,
  },
];

export default function UpcomingEvents() {
  // arranco con los mock para que siempre haya contenido visible
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // intento traer los eventos reales de wordpress, si falla me quedo con los mock
    fetch(`${WP_API}?per_page=3&page=1&_embed=1&orderby=date&order=desc`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length > 0) setEvents(data); })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-brand-red font-bold text-sm tracking-widest uppercase">
          Live & Upcoming
        </span>
        <h2 className="text-white text-4xl md:text-5xl font-bold mt-4 mb-6">
          Latest <span className="text-brand-red">Tryouts</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          Join competitive tryouts organized by top teams. Register to participate and prove your skills.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-red"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event) => {
              const img      = getFeaturedImage(event) || event.mockImg || null;
              const status   = getField(event, 'tryout_status') || 'scheduled';
              const badge    = STATUS_MAP[status] || STATUS_MAP.scheduled;
              const dateStart = getField(event, 'date_start') || getField(event, 'start_date') || event.date;
              const slots    = getField(event, 'max_participants') || getField(event, 'slots');

              return (
                <div
                  key={event.id}
                  className="group bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:border-brand-red hover:shadow-[0_0_20px_rgba(255,51,51,0.1)] hover:-translate-y-1"
                >
                  {/* imagen del evento */}
                  <div className="relative h-44 overflow-hidden bg-[#1a1a1a]">
                    {img ? (
                      <img
                        src={img}
                        alt={event.title?.rendered || 'Event'}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy size={40} className="text-gray-700" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                    <span className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${badge.style}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3
                      className="text-white font-bold text-lg leading-tight mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: event.title?.rendered || 'Tryout' }}
                    />

                    <div className="space-y-2 text-sm text-gray-400">
                      {dateStart && (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-brand-red shrink-0" />
                          <span>{formatDate(dateStart)}</span>
                        </div>
                      )}
                      {slots && (
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-brand-red shrink-0" />
                          <span>{slots} slots</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigate('/register')}
                      className="mt-5 w-full flex items-center justify-center gap-2 bg-brand-red/10 hover:bg-brand-red text-brand-red hover:text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-300"
                    >
                      Join Tryout
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 border border-gray-700 hover:border-brand-red text-gray-300 hover:text-white px-8 py-3 rounded-lg text-sm font-medium transition-all"
            >
              View All Events
              <ArrowRight size={16} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
