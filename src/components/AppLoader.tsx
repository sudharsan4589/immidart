/* ──────────────────────────────────────────────────────────────
   AppLoader — orbital loading screen
   Six application-module icons orbit the Immidart wordmark.
   Each icon counter-rotates so it always faces the viewer.
────────────────────────────────────────────────────────────── */

/* ── Custom module icon set (24×24 stroke-based SVGs) ─────── */

function AssignmentsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Briefcase */}
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      {/* Person silhouette */}
      <circle cx="12" cy="13" r="2.2" />
      <path d="M7.5 21v-.5a4.5 4.5 0 0 1 9 0v.5" />
    </svg>
  );
}

function ImmigrationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Passport booklet */}
      <rect x="4" y="2" width="16" height="20" rx="2" />
      {/* Embedded globe */}
      <circle cx="12" cy="10" r="3.5" />
      <path d="M12 6.5c-1.2 1.1-1.7 2.1-1.7 3.5s.5 2.4 1.7 3.5" />
      <path d="M12 6.5c1.2 1.1 1.7 2.1 1.7 3.5s-.5 2.4-1.7 3.5" />
      <line x1="8.5" y1="10" x2="15.5" y2="10" />
      {/* Signature lines */}
      <line x1="7" y1="17" x2="17" y2="17" />
      <line x1="7" y1="19.5" x2="12.5" y2="19.5" />
    </svg>
  );
}

function TravelIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Top-down airplane silhouette */}
      <path d="M12 2L8.5 9H5l1.5 2.5H9l-1.5 9 4.5-1.5 4.5 1.5L15 11.5h2.5L19 9h-3.5z" />
    </svg>
  );
}

function CoCIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Shield */}
      <path d="M12 3L4 7v5c0 4.8 3.6 8.6 8 9.9 4.4-1.3 8-5.1 8-9.9V7z" />
      {/* Certificate ribbon / check */}
      <polyline points="8.5 12 11 14.5 15.5 10" />
      {/* Bottom ribbon tab */}
      <path d="M10 20.5L12 22l2-1.5" />
    </svg>
  );
}

function HCCIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Building pediment */}
      <polyline points="3 10 12 3 21 10" />
      {/* Cornice */}
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* Three columns */}
      <line x1="6"  y1="10" x2="6"  y2="18" />
      <line x1="12" y1="10" x2="12" y2="18" />
      <line x1="18" y1="10" x2="18" y2="18" />
      {/* Base step */}
      <line x1="2" y1="18" x2="22" y2="18" />
      <line x1="4" y1="21" x2="20" y2="21" />
    </svg>
  );
}

function LCAIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {/* Center post */}
      <line x1="12" y1="3" x2="12" y2="21" />
      {/* Balance beam */}
      <line x1="4" y1="6" x2="20" y2="6" />
      {/* Left arm drop */}
      <line x1="6" y1="6" x2="6" y2="11" />
      {/* Right arm drop */}
      <line x1="18" y1="6" x2="18" y2="11" />
      {/* Left pan arc */}
      <path d="M3 11 Q6 15 9 11" />
      {/* Right pan arc */}
      <path d="M15 11 Q18 15 21 11" />
      {/* Base foot */}
      <line x1="9" y1="21" x2="15" y2="21" />
    </svg>
  );
}

/* ── Application module definitions ─────────────────────────── */
interface AppModule {
  name: string;
  short: string;
  Icon: React.ComponentType<{ className?: string }>;
  bg: string;
  ring: string;
}

const APP_MODULES: AppModule[] = [
  { name: "Assignments",             short: "Assign", Icon: AssignmentsIcon, bg: "bg-brand-blue",   ring: "ring-brand-blue/30"   },
  { name: "Immigration",             short: "Immig",  Icon: ImmigrationIcon, bg: "bg-brand-navy",   ring: "ring-brand-navy/30"   },
  { name: "Travel",                  short: "Travel", Icon: TravelIcon,      bg: "bg-brand-sky",    ring: "ring-brand-sky/30"    },
  { name: "Certificate of Coverage", short: "CoC",    Icon: CoCIcon,         bg: "bg-emerald-500",  ring: "ring-emerald-500/30"  },
  { name: "Host Country Compliance", short: "HCC",    Icon: HCCIcon,         bg: "bg-brand-amber",  ring: "ring-brand-amber/30"  },
  { name: "LCA",                     short: "LCA",    Icon: LCAIcon,         bg: "bg-purple-500",   ring: "ring-purple-500/30"   },
];

/* ── Layout constants ────────────────────────────────────────── */
const ORBIT_RADIUS = 90;
const ICON_SIZE    = 46;
const CONTAINER    = 260;
const CENTER       = CONTAINER / 2;
const ANIM_DUR     = "12s";

/* ─────────────────────────────────────────────────────────────
   AppLoader
   Full-screen loader: module icons orbit the Immidart wordmark.
   Counter-rotation keeps each icon facing the viewer.
───────────────────────────────────────────────────────────── */
export function AppLoader({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-canvas select-none">

      <div className="relative" style={{ width: CONTAINER, height: CONTAINER }}>

        {/* Dashed orbit track */}
        <div
          className="absolute rounded-full border border-dashed border-border/60 pointer-events-none"
          style={{
            width:  ORBIT_RADIUS * 2 + ICON_SIZE,
            height: ORBIT_RADIUS * 2 + ICON_SIZE,
            top:    CENTER - ORBIT_RADIUS - ICON_SIZE / 2,
            left:   CENTER - ORBIT_RADIUS - ICON_SIZE / 2,
          }}
        />

        {/* Rotating ring — moves icons along the orbit path */}
        <div
          className="absolute inset-0"
          style={{ animation: `immidart-orbit ${ANIM_DUR} linear infinite` }}
        >
          {APP_MODULES.map((mod, i) => {
            const angleDeg = (i * 360) / APP_MODULES.length;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x = CENTER + Math.sin(angleRad) * ORBIT_RADIUS - ICON_SIZE / 2;
            const y = CENTER - Math.cos(angleRad) * ORBIT_RADIUS - ICON_SIZE / 2;

            return (
              <div
                key={mod.name}
                title={mod.name}
                className="absolute"
                style={{ left: x, top: y, width: ICON_SIZE, height: ICON_SIZE }}
              >
                {/* Counter-rotate so icon stays upright */}
                <div
                  className="w-full h-full"
                  style={{ animation: `immidart-orbit ${ANIM_DUR} linear infinite reverse` }}
                >
                  <div
                    className={`w-full h-full flex flex-col items-center justify-center rounded-2xl shadow-lg ring-2 ${mod.bg} ${mod.ring}`}
                  >
                    <mod.Icon className="w-5 h-5 text-white" />
                    <span className="text-white text-[7px] font-bold leading-none mt-0.5 opacity-90 tracking-wide">
                      {mod.short}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Centre — Immidart wordmark (stationary) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="bg-white rounded-2xl shadow-xl px-5 py-3 z-10"
            style={{ animation: "immidart-pulse 2.4s ease-in-out infinite" }}
          >
            <span className="text-[1.6rem] font-bold leading-none text-brand-blue">Immi</span>
            <span className="text-[1.6rem] font-bold leading-none text-brand-orange">dart</span>
          </div>
        </div>
      </div>

    </div>
  );
}
