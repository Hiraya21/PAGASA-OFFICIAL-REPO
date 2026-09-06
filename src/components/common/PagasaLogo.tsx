import React from 'react';

interface PagasaLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
  textColor?: string;
  subtitleColor?: string;
}

export const PagasaLogo: React.FC<PagasaLogoProps> = ({
  size = 48,
  className = '',
  showText = false,
  textColor = 'text-slate-950',
  subtitleColor = 'text-slate-500'
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* High-Fidelity Vector Reproduction of Official PAGASA Guimba Seal */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-md select-none"
        aria-label="PAGASA Guimba Official Seal"
      >
        <defs>
          {/* Path for 'PAG' along top-left arc */}
          <path
            id="arc-pag"
            d="M 68,255 A 195,195 0 0,1 230,58"
            fill="none"
          />
          {/* Path for 'ASA' along top-right arc */}
          <path
            id="arc-asa"
            d="M 270,58 A 195,195 0 0,1 432,255"
            fill="none"
          />
          {/* Path for 'INSPIRE . LEARN . LEAD' arc */}
          <path
            id="arc-inspire"
            d="M 108,235 A 150,150 0 0,1 392,235"
            fill="none"
          />
          {/* Path for 'GUIMBA, NUEVA ECIJA' on bottom ribbon */}
          <path
            id="arc-guimba-ribbon"
            d="M 65,278 C 125,488 375,488 435,278"
            fill="none"
          />

          {/* 3D Extrusion Shadow Filter for PAG ASA */}
          <filter id="blockShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="3" dy="5" stdDeviation="0" floodColor="#1C2E4A" floodOpacity="1" />
          </filter>

          {/* Subtle Outer Glow */}
          <filter id="sealShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1C2E4A" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter="url(#sealShadow)">
          {/* 1. Outer Dark Navy Outline */}
          <circle cx="250" cy="250" r="244" fill="#1C2E4A" />

          {/* 2. Vibrant Sky Blue Outer Disc */}
          <circle cx="250" cy="250" r="238" fill="#40B5F8" />

          {/* 3. Thin Inner Sky Blue Ring Accent */}
          <circle cx="250" cy="250" r="231" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />

          {/* 4. Arched Bold Text: PAG (Top Left) with 3D Navy Shadow */}
          {/* Shadow layer for PAG */}
          <text
            fill="#1C2E4A"
            fontSize="72"
            fontWeight="900"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            letterSpacing="9"
          >
            <textPath href="#arc-pag" startOffset="50%" textAnchor="middle">
              PAG
            </textPath>
          </text>
          {/* Main White text for PAG (shifted slightly for 3D extrusion look) */}
          <text
            x="-4"
            y="-4"
            fill="#FFFFFF"
            stroke="#1C2E4A"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fontSize="72"
            fontWeight="900"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            letterSpacing="9"
          >
            <textPath href="#arc-pag" startOffset="50%" textAnchor="middle">
              PAG
            </textPath>
          </text>

          {/* Arched Bold Text: ASA (Top Right) with 3D Navy Shadow */}
          {/* Shadow layer for ASA */}
          <text
            fill="#1C2E4A"
            fontSize="72"
            fontWeight="900"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            letterSpacing="9"
          >
            <textPath href="#arc-asa" startOffset="50%" textAnchor="middle">
              ASA
            </textPath>
          </text>
          {/* Main White text for ASA */}
          <text
            x="-4"
            y="-4"
            fill="#FFFFFF"
            stroke="#1C2E4A"
            strokeWidth="3.5"
            strokeLinejoin="round"
            fontSize="72"
            fontWeight="900"
            fontFamily="'Arial Black', 'Impact', sans-serif"
            letterSpacing="9"
          >
            <textPath href="#arc-asa" startOffset="50%" textAnchor="middle">
              ASA
            </textPath>
          </text>

          {/* 5. Sub-Arc Text: INSPIRE . LEARN . LEAD */}
          <text
            fill="#FFFFFF"
            fontSize="15"
            fontWeight="800"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="7"
          >
            <textPath href="#arc-inspire" startOffset="50%" textAnchor="middle">
              INSPIRE • LEARN • LEAD
            </textPath>
          </text>

          {/* 6. Central White Badge Disc */}
          <circle cx="250" cy="255" r="126" fill="#1C2E4A" />
          <circle cx="250" cy="255" r="122" fill="#40B5F8" />
          <circle cx="250" cy="255" r="118" fill="#FFFFFF" />

          {/* Decorative White Rivet Dots on Blue Ring */}
          <circle cx="115" cy="262" r="5" fill="#FFFFFF" stroke="#1C2E4A" strokeWidth="1.5" />
          <circle cx="385" cy="262" r="5" fill="#FFFFFF" stroke="#1C2E4A" strokeWidth="1.5" />

          {/* 7. Laurel Wreath (Lush Green Leaves) */}
          <g fill="#22C55E" stroke="#15803D" strokeWidth="0.8">
            {/* Left Laurel Branch */}
            <path d="M 160,198 C 144,188 150,172 168,183 C 172,190 168,196 160,198 Z" />
            <path d="M 149,223 C 133,215 138,198 157,209 C 162,216 158,221 149,223 Z" />
            <path d="M 146,250 C 129,245 133,228 153,237 C 158,244 154,248 146,250 Z" />
            <path d="M 150,278 C 135,278 136,261 155,265 C 160,272 157,276 150,278 Z" />
            <path d="M 162,304 C 147,309 144,293 163,292 C 168,297 166,302 162,304 Z" />
            <path d="M 180,328 C 167,336 160,321 178,316 C 184,320 183,326 180,328 Z" />
            <path d="M 204,346 C 193,358 183,345 199,337 C 205,339 207,344 204,346 Z" />
            <path d="M 168,178 Q 138,260 216,352" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />

            {/* Right Laurel Branch */}
            <path d="M 340,198 C 356,188 350,172 332,183 C 328,190 332,196 340,198 Z" />
            <path d="M 351,223 C 367,215 362,198 343,209 C 338,216 342,221 351,223 Z" />
            <path d="M 354,250 C 371,245 367,228 347,237 C 342,244 346,248 354,250 Z" />
            <path d="M 350,278 C 365,278 364,261 345,265 C 340,272 343,276 350,278 Z" />
            <path d="M 338,304 C 353,309 356,293 337,292 C 332,297 334,302 338,304 Z" />
            <path d="M 320,328 C 333,336 340,321 322,316 C 316,320 317,326 320,328 Z" />
            <path d="M 296,346 C 307,358 317,345 301,337 C 295,339 293,344 296,346 Z" />
            <path d="M 332,178 Q 362,260 284,352" fill="none" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* 8. Center Symbol: 3 Navy Pillars/Students + Sky Blue Pencil */}
          <g id="pencilYouthSymbol">
            {/* 3 Student Head Circles (Dark Navy) */}
            <circle cx="221" cy="172" r="11.5" fill="#1C2E4A" />
            <circle cx="250" cy="168" r="12" fill="#1C2E4A" />
            <circle cx="279" cy="172" r="11.5" fill="#1C2E4A" />

            {/* 3 Vertical Pillar Bodies (Dark Navy) */}
            {/* Left Pillar */}
            <rect x="207" y="186" width="28" height="78" rx="8" fill="#1C2E4A" />
            {/* Center Pillar */}
            <rect x="236" y="182" width="28" height="82" rx="8" fill="#1C2E4A" />
            {/* Right Pillar */}
            <rect x="265" y="186" width="28" height="78" rx="8" fill="#1C2E4A" />

            {/* Pencil Triangular Downward Body (Sky Blue) */}
            <polygon
              points="206,264 294,264 250,322"
              fill="#40B5F8"
              stroke="#1C2E4A"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            {/* Pencil Graphite Tip Point (Dark Navy) */}
            <polygon
              points="239,308 261,308 250,322"
              fill="#1C2E4A"
            />
          </g>

          {/* 9. Year: 2025 */}
          <text
            x="250"
            y="375"
            textAnchor="middle"
            fill="#40B5F8"
            fontSize="24"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="4"
          >
            2025
          </text>

          {/* Small Decorative White Accent Dot under 2025 */}
          <circle cx="182" cy="374" r="4.5" fill="#FFFFFF" stroke="#1C2E4A" strokeWidth="1" />
          <circle cx="318" cy="374" r="4.5" fill="#FFFFFF" stroke="#1C2E4A" strokeWidth="1" />

          {/* 10. Bottom White Curved Banner for GUIMBA, NUEVA ECIJA */}
          <g id="bottomRibbonGroup">
            {/* Banner Background Shape with Rolled Ribbon Ends */}
            <path
              d="M 52,274 
                 C 86,252 116,270 116,298 
                 C 116,400 190,446 250,446 
                 C 310,446 384,400 384,298 
                 C 384,270 414,252 448,274 
                 C 476,292 474,332 442,364 
                 C 392,416 326,486 250,486 
                 C 174,486 108,416 58,364 
                 C 26,332 24,292 52,274 Z"
              fill="#FFFFFF"
              stroke="#1C2E4A"
              strokeWidth="5.5"
              strokeLinejoin="round"
            />

            {/* Banner Inner Contrast Fill */}
            <path
              d="M 58,278 
                 C 89,258 113,274 113,298 
                 C 113,396 188,441 250,441 
                 C 312,441 387,396 387,298 
                 C 387,274 411,258 442,278 
                 C 469,295 466,328 437,358 
                 C 388,410 323,480 250,480 
                 C 177,480 112,410 63,358 
                 C 34,328 31,295 58,278 Z"
              fill="#FFFFFF"
            />

            {/* Ribbon Arched Typography: GUIMBA, NUEVA ECIJA */}
            <text
              fill="#1C2E4A"
              fontSize="37"
              fontWeight="900"
              fontFamily="'Arial Black', 'Impact', sans-serif"
              letterSpacing="5"
            >
              <textPath href="#arc-guimba-ribbon" startOffset="50%" textAnchor="middle">
                GUIMBA, NUEVA ECIJA
              </textPath>
            </text>
          </g>
        </g>
      </svg>

      {/* Optional Brand Text Layout */}
      {showText && (
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className={`font-display font-black text-base sm:text-lg tracking-tight ${textColor} whitespace-nowrap`}>
              PAGASA GUIMBA
            </span>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-200 rounded-full hidden sm:inline-block flex-shrink-0">
              MIS
            </span>
          </div>
          <p className={`text-[11px] ${subtitleColor} font-medium hidden sm:block truncate`}>
            Youth Organization • Inspire. Learn. Lead.
          </p>
        </div>
      )}
    </div>
  );
};
