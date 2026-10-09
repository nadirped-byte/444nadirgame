import React from 'react';
import {
  ShinobiCharacter,
  RankCode,
  Language,
  splitCharacterDisplayName,
} from '../data/shinobiRoster';
import { RIVAL_NAME_AR, RIVAL_NAME_EN } from '../utils/battleEngine';
import susanooMysteryCardImg from '../assets/images/pro_susanoo_card_back_1791105459294.jpg';
import crestEmblemImg from '../assets/images/shinobi_crest_emblem_1791064767736.jpg';

interface ShinobiCardProps {
  character?: ShinobiCharacter;
  lang?: Language;
  isHiddenMystery?: boolean;
  isFlippedReveal?: boolean;
  isShining?: boolean;
  isFlaming?: boolean;
  isClashingActive?: boolean;
  isGrayscaleMissed?: boolean;
  customBannerText?: string;
  isSwappedBadge?: boolean;
  compactSize?: boolean;
  secondChanceSize?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  mini?: boolean;
  miniCompact?: boolean;
  ownerTag?: 'PLAYER' | 'CPU' | null;
}

export function getRankMetallicTheme(rank: RankCode): {
  outerGradient: string;
  innerBg: string;
  badgeBg: string;
  badgeText: string;
  glow: string;
} {
  switch (rank) {
    case 'SSS':
      return {
        outerGradient: 'from-fuchsia-400 via-purple-500 to-orange-500',
        innerBg: 'from-purple-950/95 via-slate-950 to-slate-950',
        badgeBg:
          'bg-gradient-to-r from-purple-700/90 via-fuchsia-600/90 to-orange-500/90 text-white border-amber-300/80 shadow-[0_0_12px_rgba(217,70,239,0.8)]',
        badgeText: 'text-amber-300',
        glow: 'shadow-[0_0_28px_rgba(192,132,252,0.55)]',
      };
    case 'SS':
      return {
        outerGradient: 'from-red-500 via-rose-600 to-purple-800',
        innerBg: 'from-rose-950/90 via-slate-950 to-slate-950',
        badgeBg:
          'bg-gradient-to-r from-red-700/90 via-rose-600/90 to-orange-500/90 text-amber-100 border-rose-300/80 shadow-[0_0_10px_rgba(244,63,94,0.75)]',
        badgeText: 'text-rose-300',
        glow: 'shadow-[0_0_24px_rgba(244,63,94,0.48)]',
      };
    case 'S':
      return {
        outerGradient: 'from-purple-400 via-violet-600 to-indigo-900',
        innerBg: 'from-purple-950/85 via-slate-950 to-slate-950',
        badgeBg:
          'bg-gradient-to-r from-purple-800/90 via-violet-600/90 to-fuchsia-600/90 text-purple-100 border-purple-300/80 shadow-[0_0_10px_rgba(168,85,247,0.7)]',
        badgeText: 'text-purple-300',
        glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      };
    case 'A':
      return {
        outerGradient: 'from-cyan-300 via-blue-500 to-indigo-800',
        innerBg: 'from-sky-950/80 via-slate-950 to-slate-950',
        badgeBg:
          'bg-gradient-to-r from-blue-800/90 via-cyan-600/90 to-sky-500/90 text-cyan-100 border-cyan-300/75 shadow-[0_0_8px_rgba(34,211,238,0.6)]',
        badgeText: 'text-cyan-300',
        glow: 'shadow-[0_0_16px_rgba(56,189,248,0.3)]',
      };
    case 'B':
      return {
        outerGradient: 'from-emerald-400 via-teal-600 to-cyan-900',
        innerBg: 'from-emerald-950/75 via-slate-950 to-slate-950',
        badgeBg:
          'bg-gradient-to-r from-emerald-800/90 via-teal-600/90 to-emerald-500/90 text-emerald-100 border-emerald-300/70',
        badgeText: 'text-emerald-300',
        glow: 'shadow-none',
      };
    case 'C':
    default:
      return {
        outerGradient: 'from-amber-600/80 via-stone-600 to-slate-800',
        innerBg: 'from-stone-900 via-slate-950 to-slate-950',
        badgeBg:
          'bg-gradient-to-r from-stone-800/90 via-amber-900/85 to-stone-700/90 text-amber-200/90 border-amber-500/50',
        badgeText: 'text-amber-300/80',
        glow: 'shadow-none',
      };
  }
}

export const ShinobiPortraitArtwork: React.FC<{
  character: ShinobiCharacter;
  mini?: boolean;
}> = ({ character, mini = false }) => {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col items-center justify-end"
      style={{
        background: `radial-gradient(circle at 50% 35%, ${character.motifColor}65 0%, #090D16 82%)`,
      }}
    >
      {character.portraitUrl ? (
        <img
          src={character.portraitUrl}
          alt={character.nameAr}
          referrerPolicy="no-referrer"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <>
          <img
            src={crestEmblemImg}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
          />
          <svg
            viewBox="0 0 120 120"
            className={`${
              mini ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-32 h-32 sm:w-40 sm:h-40'
            } relative z-10 drop-shadow-[0_6px_12px_rgba(0,0,0,0.85)]`}
            fill="none"
          >
            <circle cx="60" cy="48" r="36" fill={`${character.motifColor}28`} />
            <path
              d="M36 46L22 28L42 30L46 14L60 26L74 14L78 30L98 28L84 46C86 58 76 72 60 72C44 72 34 58 36 46Z"
              fill="#1E293B"
              stroke={character.motifColor}
              strokeWidth="2.5"
            />
            <rect
              x="37"
              y="36"
              width="46"
              height="10"
              rx="3"
              fill="#0F172A"
              stroke="#94A3B8"
              strokeWidth="1.5"
            />
            <rect x="48" y="38" width="24" height="6" rx="1.5" fill="#CBD5E1" />
            <path
              d="M44 52L54 54"
              stroke={character.motifColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M76 52L66 54"
              stroke={character.motifColor}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M20 116C22 86 38 74 60 74C82 74 98 86 100 116H20Z"
              fill="#0F172A"
              stroke={character.motifColor}
              strokeWidth="2.5"
            />
            <path d="M45 75L60 98L75 75" stroke={character.motifColor} strokeWidth="2" />
          </svg>
        </>
      )}
      <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-950/55 to-transparent pointer-events-none" />
    </div>
  );
};

const SurroundingFlameOverlay: React.FC = () => (
  <div className="absolute -inset-3 z-40 pointer-events-none">
    <div className="absolute inset-0 rounded-3xl border-2 border-purple-400/95 flame-aura-active" />
    <div className="absolute inset-0 rounded-3xl border-2 border-fuchsia-400/80 animate-summon-ring" />
    <svg
      viewBox="0 0 200 280"
      className="w-full h-full animate-pulse drop-shadow-[0_0_24px_rgba(168,85,247,1)]"
      fill="none"
    >
      {/* Susanoo Ribcage & Spectral Lightning Arcs */}
      <path
        d="M8 14 Q28 -6 48 14 T88 10 T128 14 T168 10 T192 15"
        stroke="#E879F9"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M8 266 Q35 282 60 266 T110 270 T155 266 T192 265"
        stroke="#A855F7"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M10 20 Q-6 65 12 105 T10 185 T12 260"
        stroke="#C084FC"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M190 20 Q206 65 188 105 T190 185 T188 260"
        stroke="#C084FC"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M24 65 Q60 52 95 65 M176 65 Q140 52 105 65 M20 135 Q60 120 95 135 M180 135 Q140 120 105 135 M24 205 Q60 190 95 205 M176 205 Q140 190 105 205"
        stroke="#D946EF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  </div>
);

const LegendaryChakraArcs: React.FC<{ rank: RankCode }> = ({ rank }) => {
  if (rank !== 'SSS' && rank !== 'SS') return null;
  const strokeColor = rank === 'SSS' ? '#E879F9' : '#FB7185';
  return (
    <svg
      viewBox="0 0 200 280"
      className="absolute inset-0 w-full h-full z-20 pointer-events-none opacity-80 animate-pulse"
      fill="none"
    >
      <path
        d="M18 35 L32 52 L22 68 L38 92"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M182 45 L166 64 L178 82 L160 108"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 185 L40 165 L28 148"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const OwnerAssignmentBanner: React.FC<{
  ownerTag: 'PLAYER' | 'CPU';
  lang: Language;
  smallLikeMissed?: boolean;
}> = ({ ownerTag, lang, smallLikeMissed = false }) => (
  <div
    className={`absolute ${
      smallLikeMissed ? 'inset-x-1.5 bottom-2' : 'inset-x-2 bottom-2.5'
    } z-30 pointer-events-none flex justify-center`}
  >
    <div
      className={`${
        smallLikeMissed
          ? 'px-2 py-0.5 rounded-lg border font-display font-bold text-[9px] shadow whitespace-nowrap'
          : 'px-3 py-1 rounded-xl border font-display font-extrabold text-[11px] sm:text-xs shadow-[0_6px_18px_rgba(0,0,0,0.75)]'
      } backdrop-blur-sm transition-transform duration-200 text-center ${
        ownerTag === 'PLAYER'
          ? 'bg-gradient-to-r from-orange-500/80 via-amber-500/80 to-orange-600/80 border-amber-300/85 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
          : 'bg-gradient-to-r from-purple-800/85 via-fuchsia-700/85 to-indigo-900/85 border-purple-300/85 text-purple-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
      }`}
    >
      {ownerTag === 'PLAYER'
        ? lang === 'ar'
          ? 'انضم لفريقك ✓'
          : 'Joined ✓'
        : lang === 'ar'
        ? `ذهب لـ ${RIVAL_NAME_AR}`
        : `Joined ${RIVAL_NAME_EN}`}
    </div>
  </div>
);

const FullCardNameplate: React.FC<{
  character: ShinobiCharacter;
  lang: Language;
  badgeTextClass: string;
  mini?: boolean;
  miniCompact?: boolean;
  compactSize?: boolean;
}> = ({
  character,
  lang,
  badgeTextClass,
  mini = false,
  miniCompact = false,
  compactSize = false,
}) => {
  const rawName = lang === 'ar' ? character.nameAr : character.nameEn;
  const village = lang === 'ar' ? character.villageAr : character.villageEn;
  const { primary, form } = splitCharacterDisplayName(rawName);

  if (mini) {
    return (
      <div className="w-full pt-0.5 px-0.5 text-center flex flex-col items-center justify-start">
        <div
          className={`font-display font-extrabold ${
            miniCompact ? 'text-[7.5px] sm:text-[9.5px]' : 'text-[8.5px] sm:text-[11px]'
          } text-white leading-tight line-clamp-1`}
        >
          {primary}
        </div>
        {form && !miniCompact && (
          <div
            className={`font-display font-bold text-[7.5px] sm:text-[9px] leading-tight ${badgeTextClass} line-clamp-1`}
          >
            {form}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`w-full mt-0.5 rounded-xl bg-slate-950/90 border border-slate-800/90 ${
        compactSize ? 'py-0.5 px-1' : 'py-1 px-1.5'
      } text-center flex flex-col items-center justify-center shadow-md`}
    >
      <h3
        className={`font-display font-extrabold ${
          compactSize ? 'text-[9.5px] sm:text-xs' : 'text-[11px] sm:text-base'
        } text-white leading-tight line-clamp-1`}
      >
        {primary}
      </h3>
      {form && (
        <div
          className={`font-display font-bold ${
            compactSize ? 'text-[8px] sm:text-[9.5px]' : 'text-[9.5px] sm:text-xs'
          } leading-tight ${badgeTextClass} line-clamp-1`}
        >
          ({form})
        </div>
      )}
      {!compactSize && (
        <p className="text-[8.5px] sm:text-[10.5px] text-slate-400 font-medium leading-tight line-clamp-1">
          {village}
        </p>
      )}
    </div>
  );
};

export const ShinobiCard: React.FC<ShinobiCardProps> = ({
  character,
  lang = 'ar',
  isHiddenMystery = false,
  isFlippedReveal = false,
  isShining = false,
  isFlaming = false,
  isClashingActive = false,
  isGrayscaleMissed = false,
  customBannerText,
  isSwappedBadge = false,
  compactSize = false,
  secondChanceSize = false,
  onSelect,
  disabled = false,
  mini = false,
  miniCompact = false,
  ownerTag = null,
}) => {
  if (mini && character) {
    const theme = getRankMetallicTheme(character.rankCode);
    return (
      <div className="flex flex-col items-center select-none animate-card-deal">
        <div
          className={`relative w-full ${
            miniCompact ? 'h-12 sm:h-16 rounded-lg' : 'h-20 sm:h-32 rounded-xl'
          } p-[2px] bg-gradient-to-b ${theme.outerGradient} ${
            isClashingActive
              ? 'ring-2 ring-purple-300 shadow-[0_0_24px_rgba(168,85,247,0.95)] animate-duelist-clash z-20'
              : theme.glow
          } transition-all duration-300`}
        >
          <div
            className={`relative w-full h-full ${
              miniCompact ? 'rounded-[6px]' : 'rounded-[10px]'
            } bg-gradient-to-b ${theme.innerBg} overflow-hidden`}
          >
            {isClashingActive && (
              <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-purple-200/80 to-transparent animate-card-shine" />
              </div>
            )}

            <div className="relative z-20 flex items-center justify-between p-0.5 sm:p-1">
              <span
                className={`px-1 py-0.2 ${
                  miniCompact ? 'text-[6px] sm:text-[7.5px]' : 'text-[7px] sm:text-[9px]'
                } font-mono font-extrabold rounded border backdrop-blur-sm ${theme.badgeBg}`}
              >
                {character.rankCode}
              </span>
              {isSwappedBadge && (
                <span className="px-1 py-0.2 rounded bg-amber-400 text-slate-950 font-display font-black text-[6px] sm:text-[7.5px] shadow border border-amber-200">
                  {lang === 'ar' ? 'خدعة الظل ✦' : 'Swapped ✦'}
                </span>
              )}
            </div>

            <div className="absolute inset-0 z-10">
              <ShinobiPortraitArtwork character={character} mini />
            </div>
          </div>
        </div>
        <FullCardNameplate
          character={character}
          lang={lang}
          badgeTextClass={theme.badgeText}
          mini
          miniCompact={miniCompact}
        />
      </div>
    );
  }

  const sizeWrapperClass = secondChanceSize
    ? 'max-w-[155px] sm:max-w-[175px]'
    : compactSize
    ? 'max-w-[96px] sm:max-w-[138px]'
    : 'max-w-[165px] sm:max-w-[260px]';

  const cardAspectClass = secondChanceSize
    ? 'aspect-[3/3.65] sm:aspect-[3/3.85]'
    : compactSize
    ? 'aspect-[3/3.6]'
    : 'aspect-[3/3.9] sm:aspect-[3/4.3]';

  if (isHiddenMystery) {
    const theme = character
      ? getRankMetallicTheme(character.rankCode)
      : getRankMetallicTheme('S');

    return (
      <div
        onClick={!disabled && onSelect ? onSelect : undefined}
        className={`relative w-full ${sizeWrapperClass} mx-auto flex flex-col items-center animate-card-deal ${
          !isFlippedReveal && !isFlaming ? 'animate-card-float' : ''
        } ${
          !disabled && onSelect
            ? 'cursor-pointer group hover:-translate-y-1 active:scale-[0.98]'
            : ''
        } transition-all duration-200 select-none`}
      >
        {!isFlippedReveal ? (
          <>
            <div
              className={`relative w-full ${cardAspectClass} rounded-2xl p-[2.5px] bg-gradient-to-b from-amber-200 via-purple-500 to-indigo-950 shadow-[0_0_24px_rgba(168,85,247,0.6)] group-hover:shadow-[0_0_38px_rgba(192,132,252,0.9)] overflow-visible`}
            >
              {isFlaming && <SurroundingFlameOverlay />}
              <div className="relative w-full h-full rounded-[13px] bg-slate-950 overflow-hidden flex flex-col justify-between">
                <img
                  src={susanooMysteryCardImg}
                  alt="Hidden Shinobi"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-slate-950/60 to-transparent pointer-events-none" />

                {isShining && (
                  <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-purple-200/90 to-transparent animate-card-shine" />
                  </div>
                )}

                {ownerTag && (
                  <OwnerAssignmentBanner
                    ownerTag={ownerTag}
                    lang={lang}
                    smallLikeMissed={secondChanceSize}
                  />
                )}

                <div className="relative z-10 p-1 flex justify-between items-center">
                  <span className="px-1.5 py-0.5 rounded-md bg-purple-950/85 border border-amber-300/70 text-amber-200 font-mono text-[9px] sm:text-xs font-extrabold shadow">
                    {lang === 'ar' ? '؟' : '?'}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`w-full ${
                secondChanceSize ? 'mt-1 rounded-full py-1 px-1.5' : compactSize ? 'mt-0.5 rounded-xl py-0.5 px-1' : 'mt-0.5 rounded-xl py-1 px-1.5'
              } bg-slate-950/90 border border-purple-500/40 text-center flex flex-col items-center justify-center shadow-md`}
            >
              <div
                className={`font-display font-extrabold ${
                  secondChanceSize
                    ? 'text-[10.5px] sm:text-xs'
                    : compactSize
                    ? 'text-[9.5px] sm:text-xs'
                    : 'text-[11px] sm:text-base'
                } bg-gradient-to-r from-amber-200 via-purple-200 to-fuchsia-200 bg-clip-text text-transparent leading-tight`}
              >
                {lang === 'ar' ? 'بطاقة خفية' : 'Mystery Card'}
              </div>
              {!compactSize && !secondChanceSize && (
                <div className="text-[8.5px] sm:text-[10.5px] text-purple-300/90 font-medium leading-tight mt-0.5">
                  {lang === 'ar'
                    ? 'اضغط لقلب البطاقة الخفية'
                    : 'Tap to Flip Hidden Card'}
                </div>
              )}
            </div>
          </>
        ) : (
          character && (
            <div
              className={`w-full flex flex-col items-center transition-all duration-500 ${
                isGrayscaleMissed ? 'grayscale opacity-65 contrast-125 scale-[0.96]' : ''
              }`}
            >
              <div
                className={`relative w-full ${cardAspectClass} rounded-2xl p-[2.5px] bg-gradient-to-b ${
                  isGrayscaleMissed
                    ? 'from-slate-500 via-slate-700 to-slate-900 shadow-none ring-1 ring-slate-600'
                    : `${theme.outerGradient} ${theme.glow} ring-2 ring-purple-400 shadow-[0_0_32px_rgba(168,85,247,0.85)]`
                } overflow-visible animate-flip-reveal`}
              >
                {isFlaming && !isGrayscaleMissed && <SurroundingFlameOverlay />}
                {!isGrayscaleMissed && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-fuchsia-300/90 z-30 pointer-events-none animate-summon-ring" />
                )}

                <div
                  className={`relative w-full h-full rounded-[13px] bg-gradient-to-b ${theme.innerBg} overflow-hidden flex flex-col justify-between`}
                >
                  {!isGrayscaleMissed && (
                    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                      <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-fuchsia-200/85 to-transparent animate-card-shine" />
                    </div>
                  )}

                  {!isGrayscaleMissed && <LegendaryChakraArcs rank={character.rankCode} />}

                  {ownerTag && (
                    <OwnerAssignmentBanner
                      ownerTag={ownerTag}
                      lang={lang}
                      smallLikeMissed={secondChanceSize}
                    />
                  )}
                  {customBannerText && !ownerTag && (
                    <div className="absolute inset-x-1.5 bottom-2 z-30 pointer-events-none flex justify-center">
                      <div className="px-2 py-0.5 rounded-lg border border-slate-400/70 bg-slate-950/90 text-slate-200 font-display font-bold text-[9px] shadow">
                        {customBannerText}
                      </div>
                    </div>
                  )}

                  <div className="relative z-20 p-1 flex items-center justify-between">
                    <div
                      className={`px-1.5 py-0.5 rounded-md border font-mono text-[9px] sm:text-xs font-extrabold backdrop-blur-sm ${theme.badgeBg}`}
                    >
                      {character.rankCode}
                    </div>
                    {isSwappedBadge && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-display font-black text-[8px] shadow">
                        {lang === 'ar' ? 'خدعة الظل ✦' : 'Swapped ✦'}
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 z-10">
                    <ShinobiPortraitArtwork character={character} />
                  </div>
                </div>
              </div>

              <FullCardNameplate
                character={character}
                lang={lang}
                badgeTextClass={theme.badgeText}
                compactSize={compactSize}
              />
            </div>
          )
        )}
      </div>
    );
  }

  if (!character) return null;
  const theme = getRankMetallicTheme(character.rankCode);

  return (
    <div
      onClick={!disabled && onSelect ? onSelect : undefined}
      className={`relative w-full ${sizeWrapperClass} mx-auto flex flex-col items-center animate-card-deal ${
        !isShining && !isGrayscaleMissed ? 'animate-card-float' : ''
      } ${
        !disabled && onSelect
          ? 'cursor-pointer group hover:-translate-y-1 active:scale-[0.98]'
          : ''
      } ${
        isGrayscaleMissed ? 'grayscale opacity-65 contrast-125 scale-[0.96]' : ''
      } transition-all duration-300 select-none`}
    >
      <div
        className={`relative w-full ${
          compactSize ? 'aspect-[3/3.6]' : 'aspect-[3/3.9] sm:aspect-[3/4.3]'
        } rounded-2xl p-[2.5px] bg-gradient-to-b ${
          isGrayscaleMissed
            ? 'from-slate-500 via-slate-700 to-slate-900 shadow-none ring-1 ring-slate-600'
            : `${theme.outerGradient} ${theme.glow}`
        } ${
          isShining
            ? 'ring-2 ring-orange-400 shadow-[0_0_32px_rgba(249,115,22,0.85)] scale-[1.02]'
            : ''
        } overflow-hidden`}
      >
        <div
          className={`relative w-full h-full rounded-[13px] bg-gradient-to-b ${theme.innerBg} overflow-hidden flex flex-col justify-between`}
        >
          {isShining && !isGrayscaleMissed && (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-amber-200/85 to-transparent animate-card-shine" />
            </div>
          )}

          {!isGrayscaleMissed && <LegendaryChakraArcs rank={character.rankCode} />}

          {ownerTag && <OwnerAssignmentBanner ownerTag={ownerTag} lang={lang} />}
          {customBannerText && !ownerTag && (
            <div className="absolute inset-x-1.5 bottom-2 z-30 pointer-events-none flex justify-center">
              <div className="px-2 py-0.5 rounded-lg border border-slate-400/70 bg-slate-950/90 text-slate-200 font-display font-bold text-[9px] shadow">
                {customBannerText}
              </div>
            </div>
          )}

          <div className="relative z-20 p-1 flex items-center justify-between">
            <div
              className={`px-1.5 py-0.5 rounded-md border font-mono text-[9px] sm:text-xs font-extrabold backdrop-blur-sm ${theme.badgeBg}`}
            >
              {character.rankCode}
            </div>
            {isSwappedBadge && (
              <span className="px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-display font-black text-[8px] shadow">
                {lang === 'ar' ? 'خدعة الظل ✦' : 'Swapped ✦'}
              </span>
            )}
          </div>

          <div className="absolute inset-0 z-10">
            <ShinobiPortraitArtwork character={character} />
          </div>
        </div>
      </div>

      <FullCardNameplate
        character={character}
        lang={lang}
        badgeTextClass={theme.badgeText}
        compactSize={compactSize}
      />
    </div>
  );
};
