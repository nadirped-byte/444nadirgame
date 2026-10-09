import React from 'react';
import { Coins, PackageOpen, Sparkles, Check } from 'lucide-react';
import {
  ShinobiCharacter,
  Language,
  ShinobiPackTheme,
  SHINOBI_ROSTER,
} from '../data/shinobiRoster';
import { ShinobiCard } from './ShinobiCard';
import { RIVAL_NAME_AR, RIVAL_NAME_EN } from '../utils/battleEngine';

export type PlayStyleMode =
  | 'HIDDEN_SHINOBI'
  | 'SECOND_CHANCE'
  | 'SHINOBI_AUCTION'
  | 'SHINOBI_PACKS';

export const PLAY_STYLE_MODES_INFO: {
  id: PlayStyleMode;
  nameAr: string;
  nameEn: string;
  subAr: string;
  subEn: string;
  descAr: string;
  descEn: string;
  coverCharacterId: string;
}[] = [
  {
    id: 'HIDDEN_SHINOBI',
    nameAr: 'الشينوبي الخفي',
    nameEn: 'Hidden Shinobi',
    subAr: 'ظاهرة أم مقلوبة',
    subEn: 'Revealed vs Hidden',
    descAr: 'في كل جولة بطاقة ظاهرة وبطاقة مقلوبة: هل تضمن الظاهرة أم تغامر بقلب الخفية؟',
    descEn: 'Each round offers 1 revealed card and 1 mystery card: secure the known or gamble!',
    coverCharacterId: 'itachi_uchiha',
  },
  {
    id: 'SECOND_CHANCE',
    nameAr: 'الفرصة الثانية',
    nameEn: 'Second Chance',
    subAr: '4 بطاقات مقلوبة',
    subEn: '4 Mystery Cards',
    descAr: '4 أوراق مقلوبة: اكشف الأولى ثم أكدها أو غامر بورقة ثانية إجبارية، وشاهد ما فاتك بالأبيض والأسود!',
    descEn: '4 face-down cards: reveal one, confirm it or gamble on a second card, then see what you missed!',
    coverCharacterId: 'minato_hokage',
  },
  {
    id: 'SHINOBI_AUCTION',
    nameAr: 'مزاد الشينوبي',
    nameEn: 'Shinobi Auction',
    subAr: 'ميزانية 100 عملة',
    subEn: '100 Coins Budget',
    descAr: '100 عملة لكل فريق: افتتح المزاد وزايد (+1 أو +5 أو +10) أو انسحب بعد المزايدة ليحصل المنسحب على بطاقة تعويضية!',
    descEn: '100 coins each: bid (+1, +5, +10) or pass after opening bid to receive a free mystery compensation card!',
    coverCharacterId: 'kakuzu_five_hearts',
  },
  {
    id: 'SHINOBI_PACKS',
    nameAr: 'بكجات الشينوبي',
    nameEn: 'Shinobi Packs',
    subAr: 'حزم 10 بطاقات',
    subEn: '10-Card Packs',
    descAr: 'افتح الباك بتأثير بصري لتظهر البطاقات الـ 3 مكشوفة وتختار منها واحدة، مع باكات متوسطة وخرافية نادرة!',
    descEn: 'Open themed packs to reveal 3 face-up cards and pick 1, featuring Medium & rare Mythic packs!',
    coverCharacterId: 'naruto_kcm2_sage',
  },
];

// ============================================================================
// MODE 2: SECOND CHANCE (الفرصة الثانية) — 2x2 Semi-Transparent Overlay Stage
// ============================================================================
export const SecondChanceStage: React.FC<{
  lang: Language;
  roundNumber: number;
  totalRounds: number;
  turnOwner: 'PLAYER' | 'CPU';
  cards: ShinobiCharacter[];
  firstPickIdx: number | null;
  secondPickIdx: number | null;
  chosenFinalIdx: number | null;
  revealedMissedIndices: number[];
  awaitingDecision: boolean;
  statusMessage: string;
  isRoundReadyNext: boolean;
  isCpuThinking: boolean;
  onCardClick: (idx: number) => void;
  onConfirmFirstCard: () => void;
  onNextStep: () => void;
}> = ({
  lang,
  roundNumber,
  totalRounds,
  turnOwner,
  cards,
  firstPickIdx,
  secondPickIdx,
  chosenFinalIdx,
  revealedMissedIndices,
  awaitingDecision,
  statusMessage,
  isRoundReadyNext,
  isCpuThinking,
  onCardClick,
  onConfirmFirstCard,
  onNextStep,
}) => {
  const rivalName = lang === 'ar' ? RIVAL_NAME_AR : RIVAL_NAME_EN;

  return (
    <>
      {/* Subtle center placeholder so the background squads stay balanced underneath */}
      <div className="my-auto py-3 text-center opacity-50 pointer-events-none select-none">
        <span className="font-display font-bold text-xs text-slate-400">
          {lang === 'ar'
            ? `الفرصة الثانية · اختيار ${roundNumber} من ${totalRounds}`
            : `Second Chance · Pick ${roundNumber} of ${totalRounds}`}
        </span>
      </div>

      {/* Semi-transparent black overlay above the game screen */}
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
        <div className="w-full max-w-md my-auto rounded-2xl bg-slate-950/75 border border-purple-500/40 p-2.5 sm:p-3.5 shadow-[0_0_50px_rgba(0,0,0,0.85)] space-y-2">
          {/* Turn / Status Banner */}
          <div
            className={`rounded-xl px-3 py-1.5 text-center border transition-colors ${
              turnOwner === 'PLAYER'
                ? 'bg-orange-950/65 border-orange-500/60 text-amber-200'
                : 'bg-purple-950/65 border-purple-500/60 text-purple-200'
            }`}
          >
            <div className="font-display font-extrabold text-xs sm:text-sm">
              {statusMessage ||
                (turnOwner === 'PLAYER'
                  ? lang === 'ar'
                    ? `اختيار ${roundNumber}/${totalRounds}: دورك! اختر إحدى الأوراق الأربع المقلوبة`
                    : `Pick ${roundNumber}/${totalRounds}: Your Turn! Pick one of the 4 face-down cards`
                  : lang === 'ar'
                  ? `اختيار ${roundNumber}/${totalRounds}: دور ${rivalName} في التفكير والاختيار...`
                  : `Pick ${roundNumber}/${totalRounds}: ${rivalName} is thinking...`)}
            </div>
          </div>

          {/* Confirm First Pick OR Choose Another Card Prompt for Player */}
          {turnOwner === 'PLAYER' && awaitingDecision && firstPickIdx !== null && (
            <div className="rounded-xl bg-amber-950/80 border border-amber-400/80 p-2 flex flex-col sm:flex-row items-center justify-between gap-2 animate-pulse">
              <span className="font-display font-bold text-xs text-amber-100 text-center sm:text-start">
                {lang === 'ar'
                  ? `ظهرت لك (${cards[firstPickIdx]?.nameAr} · ${cards[firstPickIdx]?.rankCode}): هل تؤكد ضمها أم تغامر بورقة مقلوبة ثانية؟`
                  : `Revealed (${cards[firstPickIdx]?.nameEn} · ${cards[firstPickIdx]?.rankCode}): Confirm it or tap a 2nd mystery card!`}
              </span>
              <button
                type="button"
                onClick={onConfirmFirstCard}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-extrabold text-xs border border-emerald-300 shadow flex items-center justify-center gap-1 cursor-pointer shrink-0"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تأكيد هذه البطاقة ✓' : 'Confirm This Card ✓'}</span>
              </button>
            </div>
          )}

          {/* 4 Cards in a 2x2 Grid (2 beside each other on top, 2 beside each other on bottom) */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 items-start py-0.5 w-full max-w-[330px] sm:max-w-[370px] mx-auto">
            {cards.map((card, idx) => {
              const isFirstPicked = firstPickIdx === idx;
              const isSecondPicked = secondPickIdx === idx;
              const isMissedRevealed = revealedMissedIndices.includes(idx);
              const isFlipped = isFirstPicked || isSecondPicked || isMissedRevealed;
              const isChosenWinner = chosenFinalIdx === idx;
              const isAbandonedFirst =
                isFirstPicked && secondPickIdx !== null && chosenFinalIdx === secondPickIdx;
              const isGrayscale = isMissedRevealed || isAbandonedFirst;

              const canClick =
                turnOwner === 'PLAYER' &&
                !isCpuThinking &&
                !isRoundReadyNext &&
                ((firstPickIdx === null && !isFlipped) ||
                  (awaitingDecision && idx !== firstPickIdx && !isFlipped));

              return (
                <div key={`${roundNumber}-sc-${idx}`} className="w-full">
                  <ShinobiCard
                    character={card}
                    lang={lang}
                    compactSize
                    secondChanceSize
                    isHiddenMystery
                    isFlippedReveal={isFlipped}
                    isShining={isChosenWinner || (isFirstPicked && awaitingDecision)}
                    isFlaming={isChosenWinner}
                    isGrayscaleMissed={isGrayscale}
                    customBannerText={
                      isAbandonedFirst
                        ? lang === 'ar'
                          ? 'تركتها'
                          : 'Passed'
                        : isMissedRevealed
                        ? lang === 'ar'
                          ? 'فاتتك'
                          : 'Missed'
                        : undefined
                    }
                    ownerTag={isChosenWinner ? turnOwner : null}
                    disabled={!canClick}
                    onSelect={() => onCardClick(idx)}
                  />
                </div>
              );
            })}
          </div>

          {isRoundReadyNext && (
            <div className="rounded-xl bg-slate-950/95 border border-red-800/70 p-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-[0_0_25px_rgba(153,27,27,0.45)]">
              <p className="text-xs text-slate-100 font-medium text-center sm:text-start leading-snug">
                {statusMessage}
              </p>
              <button
                type="button"
                onClick={onNextStep}
                className="w-full sm:w-auto min-h-[38px] px-4 rounded-xl bg-gradient-to-r from-red-900 via-rose-700 to-purple-900 hover:from-red-800 hover:via-rose-600 hover:to-purple-800 border border-red-400/60 text-amber-100 font-display font-extrabold text-xs whitespace-nowrap cursor-pointer"
              >
                {roundNumber < totalRounds
                  ? lang === 'ar'
                    ? `الدور التالي (${roundNumber + 1}/${totalRounds})`
                    : `Next Turn (${roundNumber + 1}/${totalRounds})`
                  : lang === 'ar'
                  ? 'بدء المعركة الكبرى!'
                  : 'Start Grand Battle!'}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================================================
// MODE 3: SHINOBI AUCTION (مزاد الشينوبي) — Unified Persistent Control Panel
// ============================================================================
export const ShinobiAuctionStage: React.FC<{
  lang: Language;
  roundNumber: number;
  totalRounds: number;
  auctionCard: ShinobiCharacter;
  compensationCard: ShinobiCharacter;
  isAuctionCardFlipped: boolean;
  isCompensationRevealed: boolean;
  playerCoins: number;
  cpuCoins: number;
  currentBid: number;
  highestBidder: 'PLAYER' | 'CPU' | null;
  activeBidderTurn: 'PLAYER' | 'CPU';
  auctionWinner: 'PLAYER' | 'CPU' | null;
  statusMessage: string;
  isRoundReadyNext: boolean;
  isCpuThinking: boolean;
  onPlayerBid: (increment: 1 | 5 | 10) => void;
  onPlayerPass: () => void;
  onNextStep: () => void;
}> = ({
  lang,
  roundNumber,
  totalRounds,
  auctionCard,
  compensationCard,
  isAuctionCardFlipped,
  isCompensationRevealed,
  playerCoins,
  cpuCoins,
  currentBid,
  highestBidder,
  activeBidderTurn,
  auctionWinner,
  statusMessage,
  isRoundReadyNext,
  isCpuThinking,
  onPlayerBid,
  onPlayerPass,
  onNextStep,
}) => {
  const rivalName = lang === 'ar' ? RIVAL_NAME_AR : RIVAL_NAME_EN;
  const compensationOwner =
    auctionWinner === 'PLAYER' ? 'CPU' : auctionWinner === 'CPU' ? 'PLAYER' : null;

  const isPlayerInteractive =
    isAuctionCardFlipped &&
    !auctionWinner &&
    !isRoundReadyNext &&
    activeBidderTurn === 'PLAYER' &&
    !isCpuThinking;

  // Passing is forbidden on the very first bid (when currentBid === 0 and player has >= 1 coin)
  const canPlayerPass =
    isPlayerInteractive && (currentBid > 0 || playerCoins === 0);

  return (
    <section className="my-auto space-y-1.5">
      {/* Center Cards: Main Auction Card + Compensation Card (when someone passes) */}
      <div
        className={`grid ${
          isCompensationRevealed ? 'grid-cols-2' : 'grid-cols-1'
        } gap-2.5 items-start justify-items-center py-0.5 max-w-sm mx-auto`}
      >
        <div className="w-full flex flex-col items-center">
          <span className="mb-0.5 text-[10px] font-display font-extrabold text-amber-300">
            {lang === 'ar' ? 'بطاقة المزاد الرئيسية' : 'Main Auction Card'}
          </span>
          <ShinobiCard
            character={auctionCard}
            lang={lang}
            compactSize
            isHiddenMystery
            isFlippedReveal={isAuctionCardFlipped}
            isShining={auctionWinner !== null}
            isFlaming={auctionWinner !== null}
            ownerTag={auctionWinner}
            disabled
          />
        </div>

        {isCompensationRevealed && (
          <div className="w-full flex flex-col items-center animate-card-deal">
            <span className="mb-0.5 text-[10px] font-display font-extrabold text-cyan-300">
              {lang === 'ar' ? 'بطاقة المنسحب التعويضية (مجاناً)' : 'Passer Compensation Card'}
            </span>
            <ShinobiCard
              character={compensationCard}
              lang={lang}
              compactSize
              isHiddenMystery
              isFlippedReveal
              isShining
              ownerTag={compensationOwner}
              disabled
            />
          </div>
        )}
      </div>

      {/* UNIFIED PERSISTENT AUCTION CONTROL DASHBOARD (Never disappears on CPU turn!) */}
      <div className="rounded-2xl bg-slate-900/95 border-2 border-amber-500/50 p-2 shadow-[0_0_25px_rgba(245,158,11,0.2)] space-y-1.5">
        {/* Top Row inside Unified Panel: Player Coins | Current Bid & Highest Bidder | Rival Coins */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          <div className="rounded-xl bg-orange-950/60 border border-orange-500/40 py-1 px-1.5 flex flex-col items-center justify-center">
            <span className="text-[9.5px] text-orange-300 font-display font-bold">
              {lang === 'ar' ? 'رصيدك المتاح' : 'Your Balance'}
            </span>
            <span className="font-mono font-black text-xs sm:text-sm text-amber-300 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              {playerCoins}
            </span>
          </div>

          <div className="rounded-xl bg-amber-500/15 border border-amber-400/70 py-1 px-1.5 flex flex-col items-center justify-center">
            <span className="text-[9.5px] text-amber-200 font-display font-bold">
              {lang === 'ar' ? 'السعر الحالي' : 'Current Bid'}
            </span>
            <span className="font-mono font-black text-sm sm:text-base text-white leading-tight">
              {currentBid} {lang === 'ar' ? 'عملة' : 'Coins'}
            </span>
            <span className="text-[8.5px] font-display font-bold text-emerald-300 leading-tight">
              {highestBidder === 'PLAYER'
                ? lang === 'ar'
                  ? 'أعلى مزايدة: أنت'
                  : 'Highest: You'
                : highestBidder === 'CPU'
                ? lang === 'ar'
                  ? `أعلى مزايدة: ${rivalName}`
                  : `Highest: ${rivalName}`
                : lang === 'ar'
                ? 'بانتظار افتتاح المزاد'
                : 'Awaiting Opening Bid'}
            </span>
          </div>

          <div className="rounded-xl bg-purple-950/60 border border-purple-500/40 py-1 px-1.5 flex flex-col items-center justify-center">
            <span className="text-[9.5px] text-purple-300 font-display font-bold">
              {lang === 'ar' ? `رصيد ${rivalName}` : 'Rival Balance'}
            </span>
            <span className="font-mono font-black text-xs sm:text-sm text-purple-200 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-purple-400" />
              {cpuCoins}
            </span>
          </div>
        </div>

        {/* Live Status / Turn Indicator inside the same Unified Panel */}
        <div
          className={`rounded-lg px-2 py-1 text-center font-display font-extrabold text-[10.5px] sm:text-xs border transition-colors ${
            isCpuThinking || activeBidderTurn === 'CPU'
              ? 'bg-purple-950/70 border-purple-400/60 text-purple-200 animate-pulse'
              : 'bg-slate-950/90 border-amber-500/40 text-amber-100'
          }`}
        >
          {statusMessage}
        </div>

        {/* Bidding Buttons (+1, +5, +10, Pass) — ALWAYS VISIBLE inside Unified Panel so layout never jumps */}
        {!isRoundReadyNext ? (
          <div className="grid grid-cols-4 gap-1.5">
            {([1, 5, 10] as const).map((inc) => {
              const nextBid = currentBid + inc;
              const canAfford = playerCoins >= nextBid;
              const enabled = isPlayerInteractive && canAfford;
              return (
                <button
                  key={inc}
                  type="button"
                  disabled={!enabled}
                  onClick={() => onPlayerBid(inc)}
                  className={`min-h-[38px] rounded-xl font-mono font-black text-xs border transition-all flex flex-col items-center justify-center ${
                    enabled
                      ? 'bg-gradient-to-b from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.4)] cursor-pointer active:scale-95'
                      : 'bg-slate-950/80 border-slate-800 text-slate-500 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <span>+{inc}</span>
                  <span className="text-[8.5px] font-display font-bold">
                    ({nextBid} {lang === 'ar' ? 'عملة' : 'c'})
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              disabled={!canPlayerPass}
              onClick={onPlayerPass}
              title={
                currentBid === 0
                  ? lang === 'ar'
                    ? 'لا يمكن الانسحاب عند أول مزايدة'
                    : 'Cannot pass on opening bid'
                  : undefined
              }
              className={`min-h-[38px] rounded-xl font-display font-extrabold text-[11px] sm:text-xs border transition-all flex flex-col items-center justify-center ${
                canPlayerPass
                  ? 'bg-gradient-to-b from-slate-800 to-rose-950 hover:from-slate-700 hover:to-rose-900 border-rose-500/60 text-rose-200 cursor-pointer active:scale-95'
                  : 'bg-slate-950/80 border-slate-800 text-slate-600 opacity-55 cursor-not-allowed'
              }`}
            >
              <span>{lang === 'ar' ? 'انسحاب' : 'Pass'}</span>
              {currentBid === 0 && (
                <span className="text-[7.5px] text-slate-500">
                  {lang === 'ar' ? '(بعد الافتتاح)' : '(After 1st bid)'}
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex justify-center pt-0.5">
            <button
              type="button"
              onClick={onNextStep}
              className="w-full min-h-[38px] px-5 rounded-xl bg-gradient-to-r from-red-900 via-rose-700 to-purple-900 border border-red-400/60 text-amber-100 font-display font-extrabold text-xs sm:text-sm cursor-pointer"
            >
              {roundNumber < totalRounds
                ? lang === 'ar'
                  ? `المزاد التالي (${roundNumber + 1}/${totalRounds})`
                  : `Next Auction (${roundNumber + 1}/${totalRounds})`
                : lang === 'ar'
                ? 'بدء المعركة الكبرى!'
                : 'Start Grand Battle!'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ============================================================================
// MODE 4: SHINOBI PACKS (بكجات الشينوبي) — Smaller Pack + Burst FX + 3 Face-Up Cards
// ============================================================================
export const ShinobiPacksStage: React.FC<{
  lang: Language;
  roundNumber: number;
  totalRounds: number;
  turnOwner: 'PLAYER' | 'CPU';
  packTheme: ShinobiPackTheme;
  isPackOpened: boolean;
  isPackBursting: boolean;
  packCards: ShinobiCharacter[];
  pickedCardIdx: number | null;
  statusMessage: string;
  isRoundReadyNext: boolean;
  isCpuThinking: boolean;
  onOpenPack: () => void;
  onSelectPackCard: (idx: number) => void;
  onNextStep: () => void;
}> = ({
  lang,
  roundNumber,
  totalRounds,
  turnOwner,
  packTheme,
  isPackOpened,
  isPackBursting,
  packCards,
  pickedCardIdx,
  statusMessage,
  isRoundReadyNext,
  isCpuThinking,
  onOpenPack,
  onSelectPackCard,
  onNextStep,
}) => {
  const rivalName = lang === 'ar' ? RIVAL_NAME_AR : RIVAL_NAME_EN;
  const coverChar =
    SHINOBI_ROSTER.find((c) => c.id === packTheme.coverCharacterId) || SHINOBI_ROSTER[0];

  return (
    <section className="my-auto space-y-1.5">
      <div
        className={`rounded-xl px-2.5 py-1 text-center border transition-colors ${
          turnOwner === 'PLAYER'
            ? 'bg-orange-950/45 border-orange-500/50 text-amber-200'
            : 'bg-purple-950/50 border-purple-500/50 text-purple-200'
        }`}
      >
        <div className="font-display font-extrabold text-[11px] sm:text-xs">
          {statusMessage ||
            (turnOwner === 'PLAYER'
              ? lang === 'ar'
                ? `دورك! افتح (${packTheme.nameAr}) واختر بطاقة واحدة من الـ 3 الظاهرة`
                : `Your Turn! Open (${packTheme.nameEn}) and pick 1 of the 3 revealed cards`
              : lang === 'ar'
              ? `دور ${rivalName} لفتح (${packTheme.nameAr})...`
              : `${rivalName}'s turn to open (${packTheme.nameEn})...`)}
        </div>
      </div>

      {!isPackOpened ? (
        <div className="py-1 flex flex-col items-center justify-center">
          <div
            onClick={
              turnOwner === 'PLAYER' && !isCpuThinking && !isPackBursting ? onOpenPack : undefined
            }
            className={`relative w-32 h-44 sm:w-40 sm:h-52 rounded-2xl p-1 bg-gradient-to-b ${
              packTheme.accentGradient
            } border-2 ${
              packTheme.borderGlow
            } flex flex-col justify-between overflow-hidden select-none ${
              isPackBursting
                ? 'scale-110 ring-4 ring-amber-300 shadow-[0_0_55px_rgba(251,191,36,1)] animate-pulse'
                : 'animate-card-float'
            } ${
              turnOwner === 'PLAYER' && !isCpuThinking && !isPackBursting
                ? 'cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300'
                : 'transition-all duration-300'
            }`}
          >
            <img
              src={coverChar.portraitUrl}
              alt={packTheme.nameAr}
              referrerPolicy="no-referrer"
              className={`absolute inset-0 w-full h-full object-cover object-top transition-all duration-500 ${
                isPackBursting ? 'scale-125 brightness-150' : 'opacity-80'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent animate-card-shine" />
            </div>

            {isPackBursting && (
              <div className="absolute inset-0 z-30 bg-gradient-to-t from-amber-400/60 via-white/75 to-fuchsia-400/60 flex items-center justify-center animate-ping">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            )}

            <div className="relative z-10 p-1.5 flex items-center justify-between">
              <span
                className={`px-1.5 py-0.5 rounded-full border font-mono font-extrabold text-[8.5px] ${
                  packTheme.tier === 'MYTHIC'
                    ? 'bg-amber-400 text-slate-950 border-white shadow'
                    : 'bg-slate-950/85 border-emerald-300/60 text-emerald-300'
                }`}
              >
                {packTheme.tier === 'MYTHIC'
                  ? lang === 'ar'
                    ? 'خرافي ✦'
                    : 'MYTHIC ✦'
                  : lang === 'ar'
                  ? 'باك متوسط'
                  : 'STANDARD'}
              </span>
              <PackageOpen className="w-4 h-4 text-amber-300" />
            </div>

            <div className="relative z-10 p-2 text-center space-y-0.5">
              <div className="font-display font-black text-xs sm:text-sm text-white drop-shadow leading-tight">
                {lang === 'ar' ? packTheme.nameAr : packTheme.nameEn}
              </div>
              <div className="text-[9px] font-display font-bold text-amber-200 leading-tight line-clamp-1">
                {lang === 'ar' ? packTheme.subtitleAr : packTheme.subtitleEn}
              </div>
              {turnOwner === 'PLAYER' && !isPackBursting && (
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-display font-black text-[10px] shadow">
                    {lang === 'ar' ? 'اضغط لفتح الباك ✦' : 'TAP TO OPEN ✦'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="text-center text-[10px] sm:text-xs font-display font-bold text-amber-300 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? packTheme.nameAr : packTheme.nameEn}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-start py-0.5 max-w-md mx-auto">
            {packCards.map((card, idx) => {
              const isPicked = pickedCardIdx === idx;
              const isOtherUnpicked = pickedCardIdx !== null && pickedCardIdx !== idx;

              return (
                <div key={`pack-card-${idx}-${card.id}`} className="w-full animate-card-deal">
                  <ShinobiCard
                    character={card}
                    lang={lang}
                    compactSize
                    isShining={isPicked}
                    isFlaming={isPicked}
                    isGrayscaleMissed={isOtherUnpicked}
                    ownerTag={isPicked ? turnOwner : null}
                    disabled={
                      turnOwner !== 'PLAYER' ||
                      pickedCardIdx !== null ||
                      isRoundReadyNext ||
                      isCpuThinking
                    }
                    onSelect={() => onSelectPackCard(idx)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isRoundReadyNext && (
        <div className="rounded-xl bg-slate-950/95 border border-red-800/60 p-1.5 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="text-[11px] text-slate-100 font-medium text-center sm:text-start">
            {statusMessage}
          </p>
          <button
            type="button"
            onClick={onNextStep}
            className="w-full sm:w-auto min-h-[36px] px-4 rounded-xl bg-gradient-to-r from-red-900 via-rose-700 to-purple-900 border border-red-400/60 text-amber-100 font-display font-extrabold text-xs whitespace-nowrap cursor-pointer"
          >
            {roundNumber < totalRounds
              ? lang === 'ar'
                ? `الباك التالي (${roundNumber + 1}/${totalRounds})`
                : `Next Pack (${roundNumber + 1}/${totalRounds})`
              : lang === 'ar'
              ? 'بدء المعركة الكبرى!'
              : 'Start Grand Battle!'}
          </button>
        </div>
      )}
    </section>
  );
};

