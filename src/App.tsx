import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  Play,
  Globe,
  Eye,
  ArrowRight,
  Home,
  Crown,
} from 'lucide-react';
import {
  drawWeightedUniqueShinobi,
  ShinobiCharacter,
  Language,
  splitCharacterDisplayName,
  RANK_ORDER,
  ShinobiPackTheme,
  pickWeightedPackThemes,
  drawCardsFromPackTheme,
} from './data/shinobiRoster';
import { ShinobiCard, getRankMetallicTheme } from './components/ShinobiCard';
import {
  PlayStyleMode,
  PLAY_STYLE_MODES_INFO,
  SecondChanceStage,
  ShinobiAuctionStage,
  ShinobiPacksStage,
} from './components/GameModesStages';
import {
  resolveShinobiBattle,
  decideCpuChoice,
  decideCpuAuctionAction,
  arrangeSquadCenterPeak,
  getSquadCenterIndex,
  BattleReport,
  RIVAL_NAME_AR,
  RIVAL_NAME_EN,
} from './utils/battleEngine';
import { soundEngine } from './utils/sound';
import arenaBgImg from './assets/images/shinobi_arena_bg_1791064745085.jpg';
import appIconImg from './assets/images/shinobi_draft_app_icon_1791493178947.jpg';
import modeHiddenShinobiImg from './assets/images/mode_hidden_shinobi_1791461244407.jpg';
import modeSecondChanceImg from './assets/images/mode_second_chance_1791461258680.jpg';
import modeShinobiAuctionImg from './assets/images/mode_shinobi_auction_1791461270055.jpg';
import modeShinobiPacksImg from './assets/images/mode_shinobi_packs_1791461280110.jpg';

const MODE_THUMBNAIL_IMAGES: Record<PlayStyleMode, string> = {
  HIDDEN_SHINOBI: modeHiddenShinobiImg,
  SECOND_CHANCE: modeSecondChanceImg,
  SHINOBI_AUCTION: modeShinobiAuctionImg,
  SHINOBI_PACKS: modeShinobiPacksImg,
};

type GameState =
  | 'SPLASH_HOME'
  | 'SHINOBI_TOSS'
  | 'ROUND_PLAY'
  | 'SQUAD_SHOWCASE'
  | 'PRE_BATTLE_COUNTDOWN'
  | 'FINAL_RESULT';

type BattleMode = 3 | 5 | 10;

interface RoundPair {
  roundNumber: number;
  revealedChar: ShinobiCharacter;
  hiddenChar: ShinobiCharacter;
  turnOwner: 'PLAYER' | 'CPU';
}

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [gameState, setGameState] = useState<GameState>('SPLASH_HOME');
  const [playStyleMode, setPlayStyleMode] = useState<PlayStyleMode>('HIDDEN_SHINOBI');
  const [battleMode, setBattleMode] = useState<BattleMode>(5);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [musicEnabled, setMusicEnabled] = useState<boolean>(true);

  const effectiveTeamSize: BattleMode = battleMode;

  // Screen Shake for Legendary SSS/SS Reveals & Clashes
  const [isScreenShaking, setIsScreenShaking] = useState<boolean>(false);

  // Shinobi Toss (Lottery for Round 1 starter)
  const [isTossSpinning, setIsTossSpinning] = useState<boolean>(false);
  const [firstTurnWinner, setFirstTurnWinner] = useState<'PLAYER' | 'CPU'>('PLAYER');

  // Drafting State
  const [rounds, setRounds] = useState<RoundPair[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [playerTeam, setPlayerTeam] = useState<ShinobiCharacter[]>([]);
  const [cpuTeam, setCpuTeam] = useState<ShinobiCharacter[]>([]);

  // Mode 2: Second Chance (4 Face-Down Cards)
  const [scRounds, setScRounds] = useState<
    { roundNumber: number; turnOwner: 'PLAYER' | 'CPU'; cards: ShinobiCharacter[] }[]
  >([]);
  const [scFirstPickIdx, setScFirstPickIdx] = useState<number | null>(null);
  const [scSecondPickIdx, setScSecondPickIdx] = useState<number | null>(null);
  const [scChosenFinalIdx, setScChosenFinalIdx] = useState<number | null>(null);
  const [scRevealedMissedIndices, setScRevealedMissedIndices] = useState<number[]>([]);
  const [scAwaitingDecision, setScAwaitingDecision] = useState<boolean>(false);

  // Mode 3: Shinobi Auction (100 Coins)
  const [auctionRounds, setAuctionRounds] = useState<
    {
      roundNumber: number;
      starter: 'PLAYER' | 'CPU';
      auctionCard: ShinobiCharacter;
      compensationCard: ShinobiCharacter;
    }[]
  >([]);
  const [playerCoins, setPlayerCoins] = useState<number>(100);
  const [cpuCoins, setCpuCoins] = useState<number>(100);
  const [currentBid, setCurrentBid] = useState<number>(0);
  const [highestBidder, setHighestBidder] = useState<'PLAYER' | 'CPU' | null>(null);
  const [activeBidderTurn, setActiveBidderTurn] = useState<'PLAYER' | 'CPU'>('PLAYER');
  const [isAuctionCardFlipped, setIsAuctionCardFlipped] = useState<boolean>(false);
  const [isCompensationRevealed, setIsCompensationRevealed] = useState<boolean>(false);
  const [auctionWinner, setAuctionWinner] = useState<'PLAYER' | 'CPU' | null>(null);

  // Mode 4: Shinobi Packs (10-Card Sealed Pack -> 3 Revealed Cards)
  const [packTurns, setPackTurns] = useState<
    {
      turnIndex: number;
      turnOwner: 'PLAYER' | 'CPU';
      packTheme: ShinobiPackTheme;
      cards: ShinobiCharacter[];
    }[]
  >([]);
  const [isPackOpened, setIsPackOpened] = useState<boolean>(false);
  const [isPackBursting, setIsPackBursting] = useState<boolean>(false);
  const [pickedPackCardIdx, setPickedPackCardIdx] = useState<number | null>(null);

  // Step-by-Step Card Selection & Flip States
  const [revealedOwnerTag, setRevealedOwnerTag] = useState<'PLAYER' | 'CPU' | null>(null);
  const [hiddenOwnerTag, setHiddenOwnerTag] = useState<'PLAYER' | 'CPU' | null>(null);
  const [isHiddenCardFlipped, setIsHiddenCardFlipped] = useState<boolean>(false);
  const [isRevealedCardShining, setIsRevealedCardShining] = useState<boolean>(false);
  const [isHiddenCardShining, setIsHiddenCardShining] = useState<boolean>(false);
  const [isHiddenCardFlaming, setIsHiddenCardFlaming] = useState<boolean>(false);
  const [statusMessageAr, setStatusMessageAr] = useState<string>('');
  const [statusMessageEn, setStatusMessageEn] = useState<string>('');
  const [isAnimatingPick, setIsAnimatingPick] = useState<boolean>(false);
  const [isRoundReadyNext, setIsRoundReadyNext] = useState<boolean>(false);
  const [isCpuThinking, setIsCpuThinking] = useState<boolean>(false);

  // Squad Showcase + Battle Countdown (20s) & Result State
  const [showcaseRevealCount, setShowcaseRevealCount] = useState<number>(0);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(20);
  const [battleReport, setBattleReport] = useState<BattleReport | null>(null);
  const [isViewingBattleSquads, setIsViewingBattleSquads] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);
  const countdownIntervalRef = useRef<number | null>(null);

  const rivalName = lang === 'ar' ? RIVAL_NAME_AR : RIVAL_NAME_EN;

  // Keep HTML dir & lang synced with current language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync procedural Shinobi background music with game phase
  useEffect(() => {
    if (gameState === 'SPLASH_HOME' || gameState === 'FINAL_RESULT') {
      soundEngine.setMusicMode('OFF');
    } else if (gameState === 'SHINOBI_TOSS' || gameState === 'ROUND_PLAY') {
      // [Phase 1 — Card Selection]: Mysterious Ninja Strategy Background Music
      soundEngine.setMusicMode('DRAFT');
    } else if (gameState === 'PRE_BATTLE_COUNTDOWN') {
      // [Phase 2 Continues]: Epic Anime Battle Background Music continues through the battle
      soundEngine.setMusicMode('BATTLE');
    }
  }, [gameState]);

  const triggerScreenShake = useCallback(() => {
    setIsScreenShaking(true);
    const id = window.setTimeout(() => setIsScreenShaking(false), 450);
    timersRef.current.push(id);
  }, []);

  const registerTimeout = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
    if (countdownIntervalRef.current) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearAllTimers();
      soundEngine.setMusicMode('OFF');
    };
  }, [clearAllTimers]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
  };

  const handleToggleMusic = () => {
    const next = soundEngine.toggleMusic();
    setMusicEnabled(next);
  };

  const toggleLanguage = () => {
    soundEngine.playSelect();
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const resetRoundVisualStates = useCallback(() => {
    setRevealedOwnerTag(null);
    setHiddenOwnerTag(null);
    setIsHiddenCardFlipped(false);
    setIsRevealedCardShining(false);
    setIsHiddenCardShining(false);
    setIsHiddenCardFlaming(false);
    setStatusMessageAr('');
    setStatusMessageEn('');
    setIsAnimatingPick(false);
    setIsRoundReadyNext(false);
    setIsCpuThinking(false);

    // Mode 2 reset
    setScFirstPickIdx(null);
    setScSecondPickIdx(null);
    setScChosenFinalIdx(null);
    setScRevealedMissedIndices([]);
    setScAwaitingDecision(false);

    // Mode 3 reset
    setCurrentBid(0);
    setHighestBidder(null);
    setIsAuctionCardFlipped(false);
    setIsCompensationRevealed(false);
    setAuctionWinner(null);

    // Mode 4 reset
    setIsPackOpened(false);
    setIsPackBursting(false);
    setPickedPackCardIdx(null);
  }, []);

  /**
   * Launch Phase 2 (Squad Showcase & 20s Battle)
   */
  const launchGrandBattlePhase2 = useCallback(
    (finalPlayerTeam: ShinobiCharacter[], finalCpuTeam: ShinobiCharacter[]) => {
      soundEngine.stopMusic();
      soundEngine.playPhaseTransitionImpact();
      triggerScreenShake();

      const report = resolveShinobiBattle(finalPlayerTeam, finalCpuTeam);
      setBattleReport(report);

      setIsViewingBattleSquads(false);
      setShowcaseRevealCount(0);
      setCountdownSeconds(20);
      setGameState('SQUAD_SHOWCASE');
    },
    [triggerScreenShake]
  );

  /**
   * Start New Game -> Initializes the chosen PlayStyleMode (1 of 4 modes)
   */
  const startNewGame = useCallback(() => {
    clearAllTimers();
    soundEngine.playHandSeal();
    soundEngine.playShurikenSpin();

    const teamSize: BattleMode = battleMode;
    const starter: 'PLAYER' | 'CPU' = Math.random() < 0.5 ? 'PLAYER' : 'CPU';
    setFirstTurnWinner(starter);

    setCurrentRoundIndex(0);
    setPlayerTeam([]);
    setCpuTeam([]);
    resetRoundVisualStates();
    setBattleReport(null);
    setIsViewingBattleSquads(false);
    setShowcaseRevealCount(0);
    setCountdownSeconds(20);

    if (playStyleMode === 'HIDDEN_SHINOBI') {
      const selectedPool = drawWeightedUniqueShinobi(teamSize * 2);
      const generatedRounds: RoundPair[] = [];
      for (let i = 0; i < teamSize; i++) {
        const isStarterTurn = i % 2 === 0;
        const turnOwner: 'PLAYER' | 'CPU' = isStarterTurn
          ? starter
          : starter === 'PLAYER'
          ? 'CPU'
          : 'PLAYER';
        generatedRounds.push({
          roundNumber: i + 1,
          revealedChar: selectedPool[i * 2],
          hiddenChar: selectedPool[i * 2 + 1],
          turnOwner,
        });
      }
      setRounds(generatedRounds);
    } else if (playStyleMode === 'SECOND_CHANCE') {
      const totalTurns = teamSize * 2;
      const selectedPool = drawWeightedUniqueShinobi(totalTurns * 4);
      const generatedSc: {
        roundNumber: number;
        turnOwner: 'PLAYER' | 'CPU';
        cards: ShinobiCharacter[];
      }[] = [];
      for (let i = 0; i < totalTurns; i++) {
        const isStarterTurn = i % 2 === 0;
        const turnOwner: 'PLAYER' | 'CPU' = isStarterTurn
          ? starter
          : starter === 'PLAYER'
          ? 'CPU'
          : 'PLAYER';
        generatedSc.push({
          roundNumber: i + 1,
          turnOwner,
          cards: selectedPool.slice(i * 4, i * 4 + 4),
        });
      }
      setScRounds(generatedSc);
    } else if (playStyleMode === 'SHINOBI_AUCTION') {
      const selectedPool = drawWeightedUniqueShinobi(teamSize * 2);
      const generatedAuction: {
        roundNumber: number;
        starter: 'PLAYER' | 'CPU';
        auctionCard: ShinobiCharacter;
        compensationCard: ShinobiCharacter;
      }[] = [];
      for (let i = 0; i < teamSize; i++) {
        const isStarterTurn = i % 2 === 0;
        const roundStarter: 'PLAYER' | 'CPU' = isStarterTurn
          ? starter
          : starter === 'PLAYER'
          ? 'CPU'
          : 'PLAYER';
        generatedAuction.push({
          roundNumber: i + 1,
          starter: roundStarter,
          auctionCard: selectedPool[i * 2],
          compensationCard: selectedPool[i * 2 + 1],
        });
      }
      setAuctionRounds(generatedAuction);
      setPlayerCoins(100);
      setCpuCoins(100);
      setActiveBidderTurn(starter);
    } else if (playStyleMode === 'SHINOBI_PACKS') {
      // Pick pack themes weighted heavily toward Medium packs, with rare Mythic packs!
      const chosenThemes = pickWeightedPackThemes(teamSize);
      const usedCharIds: string[] = [];
      const generatedPackTurns: {
        turnIndex: number;
        turnOwner: 'PLAYER' | 'CPU';
        packTheme: ShinobiPackTheme;
        cards: ShinobiCharacter[];
      }[] = [];

      for (let roundIdx = 0; roundIdx < teamSize; roundIdx++) {
        const theme = chosenThemes[roundIdx];
        const firstOwner = starter;
        const secondOwner = starter === 'PLAYER' ? 'CPU' : 'PLAYER';

        const cards1 = drawCardsFromPackTheme(theme, 3, usedCharIds);
        cards1.forEach((c) => usedCharIds.push(c.id));
        generatedPackTurns.push({
          turnIndex: roundIdx * 2 + 1,
          turnOwner: firstOwner,
          packTheme: theme,
          cards: cards1,
        });

        const cards2 = drawCardsFromPackTheme(theme, 3, usedCharIds);
        cards2.forEach((c) => usedCharIds.push(c.id));
        generatedPackTurns.push({
          turnIndex: roundIdx * 2 + 2,
          turnOwner: secondOwner,
          packTheme: theme,
          cards: cards2,
        });
      }
      setPackTurns(generatedPackTurns);
    }

    // Enter Shinobi Toss Screen
    setIsTossSpinning(true);
    setGameState('SHINOBI_TOSS');

    registerTimeout(() => {
      soundEngine.playSelect();
      setIsTossSpinning(false);
    }, 1200);

    registerTimeout(() => {
      soundEngine.playHandSeal();
      setGameState('ROUND_PLAY');
    }, 2600);
  }, [
    playStyleMode,
    battleMode,
    clearAllTimers,
    resetRoundVisualStates,
    registerTimeout,
  ]);

  const executeCardPickSequence = useCallback(
    (picker: 'PLAYER' | 'CPU', choiceType: 'REVEALED' | 'HIDDEN', pair: RoundPair) => {
      setIsAnimatingPick(true);
      const otherOwner: 'PLAYER' | 'CPU' = picker === 'PLAYER' ? 'CPU' : 'PLAYER';

      const playerGot =
        picker === 'PLAYER'
          ? choiceType === 'REVEALED'
            ? pair.revealedChar
            : pair.hiddenChar
          : choiceType === 'REVEALED'
          ? pair.hiddenChar
          : pair.revealedChar;

      const cpuGot =
        picker === 'PLAYER'
          ? choiceType === 'REVEALED'
            ? pair.hiddenChar
            : pair.revealedChar
          : choiceType === 'REVEALED'
          ? pair.revealedChar
          : pair.hiddenChar;

      if (choiceType === 'HIDDEN') {
        // STEP 1: Picker chose to flip the Face-Down Mystery Card!
        const isHighRank = ['SSS', 'SS', 'S'].includes(pair.hiddenChar.rankCode);
        const isMythicRank = ['SSS', 'SS'].includes(pair.hiddenChar.rankCode);
        soundEngine.playFlameFlip(isHighRank);
        setIsHiddenCardShining(true);
        setIsHiddenCardFlaming(true);
        setStatusMessageAr(
          picker === 'PLAYER'
            ? 'اخترت قلب الورقة المقلوبة! تشتعل التشاكرا وتنقلب البطاقة الآن...'
            : `${RIVAL_NAME_AR} قرر المغامرة وقلب الورقة المقلوبة! تشتعل البطاقة وتنقلب الآن...`
        );
        setStatusMessageEn(
          picker === 'PLAYER'
            ? 'You chose the Face-Down Card! Chakra flames ignite as it flips...'
            : `${RIVAL_NAME_EN} gambled on the Face-Down Card! Flames ignite as it flips...`
        );

        registerTimeout(() => {
          setIsHiddenCardFlipped(true);
          setHiddenOwnerTag(picker);
          if (isMythicRank) {
            soundEngine.playLegendaryLightning();
            triggerScreenShake();
          }
          setStatusMessageAr(
            picker === 'PLAYER'
              ? `ظهرت لك بطاقة ${pair.hiddenChar.nameAr} (رتبة ${pair.hiddenChar.rankCode})!`
              : `ظهرت لـ ${RIVAL_NAME_AR} بطاقة ${pair.hiddenChar.nameAr} (رتبة ${pair.hiddenChar.rankCode})!`
          );
          setStatusMessageEn(
            picker === 'PLAYER'
              ? `Revealed for your squad: ${pair.hiddenChar.nameEn} (Rank ${pair.hiddenChar.rankCode})!`
              : `Revealed for ${RIVAL_NAME_EN}: ${pair.hiddenChar.nameEn} (Rank ${pair.hiddenChar.rankCode})!`
          );
        }, 450);

        // STEP 2 (1.65s later): Show that the OTHER (Revealed) card goes to the other person!
        registerTimeout(() => {
          soundEngine.playSelect();
          setIsRevealedCardShining(true);
          setRevealedOwnerTag(otherOwner);
          setStatusMessageAr(
            otherOwner === 'PLAYER'
              ? `وتذهب البطاقة الأخرى (${pair.revealedChar.nameAr} · ${pair.revealedChar.rankCode}) تلقائياً لفريقك!`
              : `وتذهب البطاقة الأخرى (${pair.revealedChar.nameAr} · ${pair.revealedChar.rankCode}) تلقائياً لفريق ${RIVAL_NAME_AR}!`
          );
          setStatusMessageEn(
            otherOwner === 'PLAYER'
              ? `The other card (${pair.revealedChar.nameEn} · ${pair.revealedChar.rankCode}) automatically joins your squad!`
              : `The other card (${pair.revealedChar.nameEn} · ${pair.revealedChar.rankCode}) automatically joins ${RIVAL_NAME_EN}!`
          );
        }, 2100);

        // STEP 3 (1.6s later): Both cards move into the Top & Bottom Miniature Team Docks!
        registerTimeout(() => {
          soundEngine.playCardDockTransfer();
          setPlayerTeam((prev) => [...prev, playerGot]);
          setCpuTeam((prev) => [...prev, cpuGot]);
          setIsHiddenCardFlaming(false);
          setIsAnimatingPick(false);
          setIsRoundReadyNext(true);
          setStatusMessageAr(
            `نهاية الجولة ${pair.roundNumber}: انضم ${playerGot.nameAr} (${playerGot.rankCode}) لفريقك، وانضم ${cpuGot.nameAr} (${cpuGot.rankCode}) لـ ${RIVAL_NAME_AR}.`
          );
          setStatusMessageEn(
            `Round ${pair.roundNumber} Complete: ${playerGot.nameEn} (${playerGot.rankCode}) joined you, and ${cpuGot.nameEn} (${cpuGot.rankCode}) joined ${RIVAL_NAME_EN}.`
          );
        }, 3700);
      } else {
        // STEP 1: Picker chose the Revealed Card!
        soundEngine.playSelect();
        if (['SSS', 'SS'].includes(pair.revealedChar.rankCode)) {
          soundEngine.playLegendaryLightning();
          triggerScreenShake();
        }
        setIsRevealedCardShining(true);
        setRevealedOwnerTag(picker);
        setStatusMessageAr(
          picker === 'PLAYER'
            ? `اخترت البطاقة الظاهرة: ${pair.revealedChar.nameAr} (رتبة ${pair.revealedChar.rankCode}) لفريقك!`
            : `${RIVAL_NAME_AR} اختار البطاقة الظاهرة: ${pair.revealedChar.nameAr} (رتبة ${pair.revealedChar.rankCode}) لفريقه!`
        );
        setStatusMessageEn(
          picker === 'PLAYER'
            ? `You picked the revealed card: ${pair.revealedChar.nameEn} (Rank ${pair.revealedChar.rankCode})!`
            : `${RIVAL_NAME_EN} picked the revealed card: ${pair.revealedChar.nameEn} (Rank ${pair.revealedChar.rankCode})!`
        );

        // STEP 2 (1.6s later): Show that the Face-Down Mystery Card goes to the other person and flips open with flames!
        registerTimeout(() => {
          const isHighRank = ['SSS', 'SS', 'S'].includes(pair.hiddenChar.rankCode);
          soundEngine.playFlameFlip(isHighRank);
          setIsHiddenCardShining(true);
          setIsHiddenCardFlaming(true);
          setHiddenOwnerTag(otherOwner);
          setStatusMessageAr(
            otherOwner === 'PLAYER'
              ? 'الورقة المقلوبة تذهب تلقائياً لفريقك وتنقلب الآن...'
              : `الورقة المقلوبة تذهب تلقائياً لفريق ${RIVAL_NAME_AR} وتنقلب الآن...`
          );
          setStatusMessageEn(
            otherOwner === 'PLAYER'
              ? 'The Face-Down Card goes to your squad and flips open now...'
              : `The Face-Down Card goes to ${RIVAL_NAME_EN} and flips open now...`
          );
        }, 1600);

        registerTimeout(() => {
          setIsHiddenCardFlipped(true);
          if (['SSS', 'SS'].includes(pair.hiddenChar.rankCode)) {
            soundEngine.playLegendaryLightning();
            triggerScreenShake();
          }
          setStatusMessageAr(
            otherOwner === 'PLAYER'
              ? `انقلبت الورقة المقلوبة وحصلت أنت على ${pair.hiddenChar.nameAr} (رتبة ${pair.hiddenChar.rankCode})!`
              : `انقلبت الورقة المقلوبة وحصل ${RIVAL_NAME_AR} على ${pair.hiddenChar.nameAr} (رتبة ${pair.hiddenChar.rankCode})!`
          );
          setStatusMessageEn(
            otherOwner === 'PLAYER'
              ? `The Mystery Card flipped: You received ${pair.hiddenChar.nameEn} (Rank ${pair.hiddenChar.rankCode})!`
              : `The Mystery Card flipped: ${RIVAL_NAME_EN} received ${pair.hiddenChar.nameEn} (Rank ${pair.hiddenChar.rankCode})!`
          );
        }, 2050);

        // STEP 3 (1.6s later): Both cards move into the Top & Bottom Miniature Team Docks!
        registerTimeout(() => {
          soundEngine.playCardDockTransfer();
          setPlayerTeam((prev) => [...prev, playerGot]);
          setCpuTeam((prev) => [...prev, cpuGot]);
          setIsHiddenCardFlaming(false);
          setIsAnimatingPick(false);
          setIsRoundReadyNext(true);
          setStatusMessageAr(
            `نهاية الجولة ${pair.roundNumber}: انضم ${playerGot.nameAr} (${playerGot.rankCode}) لفريقك، وانضم ${cpuGot.nameAr} (${cpuGot.rankCode}) لـ ${RIVAL_NAME_AR}.`
          );
          setStatusMessageEn(
            `Round ${pair.roundNumber} Complete: ${playerGot.nameEn} (${playerGot.rankCode}) joined you, and ${cpuGot.nameEn} (${cpuGot.rankCode}) joined ${RIVAL_NAME_EN}.`
          );
        }, 3700);
      }
    },
    [playStyleMode, registerTimeout, triggerScreenShake]
  );

  // =========================================================================
  // MODE 2: SECOND CHANCE (الفرصة الثانية) — Sequential Grayscale Reveal Logic & Relaxed Timings
  // =========================================================================
  const finalizeSecondChanceChoice = useCallback(
    (
      owner: 'PLAYER' | 'CPU',
      finalIdx: number,
      firstIdx: number,
      secondIdx: number | null,
      roundCards: ShinobiCharacter[]
    ) => {
      setScAwaitingDecision(false);
      setScChosenFinalIdx(finalIdx);
      setIsAnimatingPick(true);

      const chosenCard = roundCards[finalIdx];
      const unrevealedIndices = [0, 1, 2, 3].filter(
        (i) => i !== firstIdx && i !== secondIdx
      );

      setStatusMessageAr(
        owner === 'PLAYER'
          ? `تثبّت اختيارك على (${chosenCard.nameAr} · ${chosenCard.rankCode})! بعد لحظات نكشف ما فاتك في الأوراق المتبقية...`
          : `اختار ${RIVAL_NAME_AR} بطاقة (${chosenCard.nameAr} · ${chosenCard.rankCode})! لنكشف الآن الأوراق المتبقية...`
      );
      setStatusMessageEn(
        owner === 'PLAYER'
          ? `Locked in (${chosenCard.nameEn} · ${chosenCard.rankCode})! Revealing the missed cards shortly...`
          : `${RIVAL_NAME_EN} locked in (${chosenCard.nameEn} · ${chosenCard.rankCode})! Revealing remaining cards...`
      );

      // Pause 1.4s after final choice before revealing the remaining face-down cards one by one (every 1.15s)
      const pauseBeforeMissedMs = 1400;
      const stepRevealMs = 1150;

      unrevealedIndices.forEach((missedIdx, stepOrder) => {
        registerTimeout(() => {
          soundEngine.playFlameFlip(false);
          setScRevealedMissedIndices((prev) => [...prev, missedIdx]);
        }, pauseBeforeMissedMs + stepOrder * stepRevealMs);
      });

      // Give an extra 2.6 seconds after ALL 4 cards are revealed so the player can clearly compare all 4!
      const totalDelay =
        pauseBeforeMissedMs + unrevealedIndices.length * stepRevealMs + 2600;

      registerTimeout(() => {
        soundEngine.playCardDockTransfer();
        if (owner === 'PLAYER') {
          setPlayerTeam((prev) => [...prev, chosenCard]);
        } else {
          setCpuTeam((prev) => [...prev, chosenCard]);
        }
        setIsAnimatingPick(false);
        setIsRoundReadyNext(true);
        setStatusMessageAr(
          owner === 'PLAYER'
            ? `انضم ${chosenCard.nameAr} (رتبة ${chosenCard.rankCode}) رسمياً إلى فريقك! يمكنك مراجعة الأوراق الأربع ثم المتابعة.`
            : `انضم ${chosenCard.nameAr} (رتبة ${chosenCard.rankCode}) إلى فريق ${RIVAL_NAME_AR}!`
        );
        setStatusMessageEn(
          owner === 'PLAYER'
            ? `${chosenCard.nameEn} (Rank ${chosenCard.rankCode}) officially joined your squad!`
            : `${chosenCard.nameEn} (Rank ${chosenCard.rankCode}) joined ${RIVAL_NAME_EN}'s squad!`
        );
      }, totalDelay);
    },
    [registerTimeout]
  );

  const handleSecondChanceCardClick = (idx: number) => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SECOND_CHANCE' ||
      isAnimatingPick ||
      isRoundReadyNext
    )
      return;
    const currentSc = scRounds[currentRoundIndex];
    if (!currentSc || currentSc.turnOwner !== 'PLAYER') return;

    if (scFirstPickIdx === null) {
      // First card flip
      const picked = currentSc.cards[idx];
      soundEngine.playFlameFlip(['SSS', 'SS', 'S'].includes(picked.rankCode));
      if (['SSS', 'SS'].includes(picked.rankCode)) {
        soundEngine.playLegendaryLightning();
        triggerScreenShake();
      }
      setScFirstPickIdx(idx);
      setScAwaitingDecision(true);
    } else if (scAwaitingDecision && idx !== scFirstPickIdx && scSecondPickIdx === null) {
      // Player gambled on a second face-down card -> mandatory final card!
      const picked2 = currentSc.cards[idx];
      soundEngine.playFlameFlip(['SSS', 'SS', 'S'].includes(picked2.rankCode));
      if (['SSS', 'SS'].includes(picked2.rankCode)) {
        soundEngine.playLegendaryLightning();
        triggerScreenShake();
      }
      setScSecondPickIdx(idx);
      finalizeSecondChanceChoice('PLAYER', idx, scFirstPickIdx, idx, currentSc.cards);
    }
  };

  const handleConfirmFirstSecondChance = () => {
    const currentSc = scRounds[currentRoundIndex];
    if (!currentSc || scFirstPickIdx === null || !scAwaitingDecision) return;
    soundEngine.playSelect();
    finalizeSecondChanceChoice('PLAYER', scFirstPickIdx, scFirstPickIdx, null, currentSc.cards);
  };

  // Automatic CPU Turn in Mode 2 (Second Chance) — Slower, natural thinking timing
  useEffect(() => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SECOND_CHANCE' ||
      isRoundReadyNext ||
      isAnimatingPick ||
      scFirstPickIdx !== null
    )
      return;
    const currentSc = scRounds[currentRoundIndex];
    if (!currentSc || currentSc.turnOwner !== 'CPU') return;

    setIsCpuThinking(true);
    setStatusMessageAr(`${RIVAL_NAME_AR} يتأمل الأوراق الأربع المقلوبة لاختيار ورقته الأولى...`);
    setStatusMessageEn(`${RIVAL_NAME_EN} is studying the 4 face-down cards...`);

    const id1 = window.setTimeout(() => {
      const firstIdx = Math.floor(Math.random() * 4);
      const firstCard = currentSc.cards[firstIdx];
      soundEngine.playFlameFlip(['SSS', 'SS', 'S'].includes(firstCard.rankCode));
      setScFirstPickIdx(firstIdx);
      setStatusMessageAr(
        `كشف ${RIVAL_NAME_AR} البطاقة الأولى فظهرت (${firstCard.nameAr} · ${firstCard.rankCode})... يفكر بعمق هل يحتفظ بها أم يغامر!`
      );
      setStatusMessageEn(
        `${RIVAL_NAME_EN} flipped (${firstCard.nameEn} · ${firstCard.rankCode})... thinking carefully whether to keep or gamble!`
      );

      const id2 = window.setTimeout(() => {
        setIsCpuThinking(false);
        const keepFirst =
          ['SSS', 'SS', 'S'].includes(firstCard.rankCode) ||
          (firstCard.rankCode === 'A' && Math.random() < 0.65);

        if (keepFirst) {
          soundEngine.playSelect();
          finalizeSecondChanceChoice('CPU', firstIdx, firstIdx, null, currentSc.cards);
        } else {
          const remaining = [0, 1, 2, 3].filter((i) => i !== firstIdx);
          const secondIdx = remaining[Math.floor(Math.random() * remaining.length)];
          const secondCard = currentSc.cards[secondIdx];
          soundEngine.playFlameFlip(['SSS', 'SS', 'S'].includes(secondCard.rankCode));
          setScSecondPickIdx(secondIdx);
          finalizeSecondChanceChoice('CPU', secondIdx, firstIdx, secondIdx, currentSc.cards);
        }
      }, 2400);
      timersRef.current.push(id2);
    }, 1900);
    timersRef.current.push(id1);
  }, [
    gameState,
    playStyleMode,
    currentRoundIndex,
    scRounds,
    isRoundReadyNext,
    isAnimatingPick,
    scFirstPickIdx,
    finalizeSecondChanceChoice,
  ]);

  // =========================================================================
  // MODE 3: SHINOBI AUCTION (مزاد الشينوبي) — Live Bidding & Critical Moment Thinking
  // =========================================================================
  useEffect(() => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SHINOBI_AUCTION' ||
      isAuctionCardFlipped
    )
      return;
    const currentAuc = auctionRounds[currentRoundIndex];
    if (!currentAuc) return;

    const id = window.setTimeout(() => {
      soundEngine.playFlameFlip(['SSS', 'SS', 'S'].includes(currentAuc.auctionCard.rankCode));
      setIsAuctionCardFlipped(true);
      setActiveBidderTurn(currentAuc.starter);
      setStatusMessageAr(
        `ظهرت في المزاد بطاقة (${currentAuc.auctionCard.nameAr} · رتبة ${currentAuc.auctionCard.rankCode})! يفتتح المزاد: ${
          currentAuc.starter === 'PLAYER' ? 'أنت (ممنوع الانسحاب قبل أول مزايدة)' : RIVAL_NAME_AR
        }.`
      );
      setStatusMessageEn(
        `Auction Card Revealed: (${currentAuc.auctionCard.nameEn} · Rank ${currentAuc.auctionCard.rankCode})! Opening bidder: ${
          currentAuc.starter === 'PLAYER' ? 'You (Opening bid required)' : RIVAL_NAME_EN
        }.`
      );
    }, 650);
    timersRef.current.push(id);
  }, [gameState, playStyleMode, currentRoundIndex, auctionRounds, isAuctionCardFlipped]);

  const resolveAuctionPass = useCallback(
    (passer: 'PLAYER' | 'CPU', finalPrice: number) => {
      const currentAuc = auctionRounds[currentRoundIndex];
      if (!currentAuc) return;
      setIsAnimatingPick(true);

      const winner: 'PLAYER' | 'CPU' = passer === 'PLAYER' ? 'CPU' : 'PLAYER';
      setAuctionWinner(winner);

      if (winner === 'PLAYER') {
        setPlayerCoins((c) => Math.max(0, c - finalPrice));
      } else {
        setCpuCoins((c) => Math.max(0, c - finalPrice));
      }

      soundEngine.playSelect();
      setStatusMessageAr(
        passer === 'PLAYER'
          ? `انسحبت من المزاد! فاز ${RIVAL_NAME_AR} ببطاقة (${currentAuc.auctionCard.nameAr}) مقابل ${finalPrice} عملة، وتظهر لك الآن بطاقتك التعويضية المجانية...`
          : `انسحب ${RIVAL_NAME_AR}! فزت أنت ببطاقة (${currentAuc.auctionCard.nameAr}) مقابل ${finalPrice} عملة، وتظهر لخصمك بطاقته التعويضية...`
      );
      setStatusMessageEn(
        passer === 'PLAYER'
          ? `You passed! ${RIVAL_NAME_EN} won (${currentAuc.auctionCard.nameEn}) for ${finalPrice} coins, and your free compensation card reveals now...`
          : `${RIVAL_NAME_EN} passed! You won (${currentAuc.auctionCard.nameEn}) for ${finalPrice} coins, and the rival's compensation card reveals now...`
      );

      registerTimeout(() => {
        soundEngine.playFlameFlip(['SSS', 'SS', 'S'].includes(currentAuc.compensationCard.rankCode));
        setIsCompensationRevealed(true);
      }, 1200);

      registerTimeout(() => {
        soundEngine.playCardDockTransfer();
        if (winner === 'PLAYER') {
          setPlayerTeam((prev) => [...prev, currentAuc.auctionCard]);
          setCpuTeam((prev) => [...prev, currentAuc.compensationCard]);
        } else {
          setCpuTeam((prev) => [...prev, currentAuc.auctionCard]);
          setPlayerTeam((prev) => [...prev, currentAuc.compensationCard]);
        }
        setIsAnimatingPick(false);
        setIsRoundReadyNext(true);
        setStatusMessageAr(
          `اكتمل المزاد: حصل ${winner === 'PLAYER' ? 'فريقك' : RIVAL_NAME_AR} على (${currentAuc.auctionCard.nameAr} · ${currentAuc.auctionCard.rankCode})، وحصل المنسحب على (${currentAuc.compensationCard.nameAr} · ${currentAuc.compensationCard.rankCode})!`
        );
        setStatusMessageEn(
          `Auction settled: ${winner === 'PLAYER' ? 'You' : RIVAL_NAME_EN} got (${currentAuc.auctionCard.nameEn} · ${currentAuc.auctionCard.rankCode}), and the passer got (${currentAuc.compensationCard.nameEn} · ${currentAuc.compensationCard.rankCode})!`
        );
      }, 2800);
    },
    [auctionRounds, currentRoundIndex, registerTimeout]
  );

  const handlePlayerAuctionBid = (increment: 1 | 5 | 10) => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SHINOBI_AUCTION' ||
      activeBidderTurn !== 'PLAYER' ||
      auctionWinner !== null ||
      isAnimatingPick
    )
      return;
    const nextBid = currentBid + increment;
    if (nextBid > playerCoins) return;

    soundEngine.playSelect();
    setCurrentBid(nextBid);
    setHighestBidder('PLAYER');
    setStatusMessageAr(
      nextBid >= 25
        ? `مزايدة قوية! رفعت السعر إلى ${nextBid} عملة... ${RIVAL_NAME_AR} يفكر بعمق في هذه اللحظة الحاسمة!`
        : `رفعت السعر إلى ${nextBid} عملة! يفكر ${RIVAL_NAME_AR} في الرد...`
    );
    setStatusMessageEn(
      nextBid >= 25
        ? `High-stakes bid of ${nextBid} coins! ${RIVAL_NAME_EN} is thinking deeply at this critical moment...`
        : `You raised the bid to ${nextBid} coins! ${RIVAL_NAME_EN} is thinking...`
    );

    if (cpuCoins <= nextBid) {
      // CPU cannot afford to outbid -> automatic pass
      registerTimeout(() => {
        resolveAuctionPass('CPU', nextBid);
      }, 1200);
    } else {
      setActiveBidderTurn('CPU');
    }
  };

  const handlePlayerAuctionPass = () => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SHINOBI_AUCTION' ||
      activeBidderTurn !== 'PLAYER' ||
      auctionWinner !== null ||
      isAnimatingPick ||
      (currentBid === 0 && playerCoins > 0)
    )
      return;
    resolveAuctionPass('PLAYER', currentBid);
  };

  // Automatic CPU Bidding Turn in Mode 3 — Longer thinking in critical moments!
  useEffect(() => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SHINOBI_AUCTION' ||
      !isAuctionCardFlipped ||
      activeBidderTurn !== 'CPU' ||
      auctionWinner !== null ||
      isAnimatingPick ||
      isRoundReadyNext
    )
      return;
    const currentAuc = auctionRounds[currentRoundIndex];
    if (!currentAuc) return;

    setIsCpuThinking(true);
    const isCriticalMoment =
      currentBid >= 20 ||
      ['SSS', 'SS', 'S'].includes(currentAuc.auctionCard.rankCode) ||
      cpuCoins - currentBid <= 15;

    if (isCriticalMoment && currentBid > 0) {
      setStatusMessageAr(
        `لحظة حاسمة! ${RIVAL_NAME_AR} يدرس رصيده المتبقي (${cpuCoins} عملة) وقيمة (${currentAuc.auctionCard.nameAr}) بتأنٍ...`
      );
      setStatusMessageEn(
        `Critical moment! ${RIVAL_NAME_EN} carefully weighs its ${cpuCoins} coins against (${currentAuc.auctionCard.nameEn})...`
      );
    }

    const thinkDelayMs = isCriticalMoment ? 2350 : 1550;

    const id = window.setTimeout(() => {
      setIsCpuThinking(false);
      const roundsLeft = effectiveTeamSize - currentRoundIndex;
      const decision = decideCpuAuctionAction(
        currentAuc.auctionCard,
        currentBid,
        cpuCoins,
        roundsLeft
      );

      if (decision.action === 'PASS') {
        resolveAuctionPass('CPU', currentBid);
      } else {
        const nextBid = currentBid + decision.increment;
        soundEngine.playSelect();
        setCurrentBid(nextBid);
        setHighestBidder('CPU');
        setStatusMessageAr(
          `زايد ${RIVAL_NAME_AR} بـ (+${decision.increment}) ليصبح السعر ${nextBid} عملة! القرار عندك الآن.`
        );
        setStatusMessageEn(
          `${RIVAL_NAME_EN} bid +${decision.increment} (Total: ${nextBid} coins)! Your move.`
        );

        if (playerCoins <= nextBid) {
          registerTimeout(() => {
            resolveAuctionPass('PLAYER', nextBid);
          }, 1200);
        } else {
          setActiveBidderTurn('PLAYER');
        }
      }
    }, thinkDelayMs);
    timersRef.current.push(id);
  }, [
    gameState,
    playStyleMode,
    isAuctionCardFlipped,
    activeBidderTurn,
    auctionWinner,
    isAnimatingPick,
    isRoundReadyNext,
    auctionRounds,
    currentRoundIndex,
    currentBid,
    cpuCoins,
    playerCoins,
    effectiveTeamSize,
    resolveAuctionPass,
    registerTimeout,
  ]);

  // =========================================================================
  // MODE 4: SHINOBI PACKS (بكجات الشينوبي) — Visual Burst & 3 Revealed Cards
  // =========================================================================
  const triggerPackOpenSequence = useCallback(
    (owner: 'PLAYER' | 'CPU') => {
      if (isPackOpened || isPackBursting || isAnimatingPick) return;
      soundEngine.playFlameFlip(true);
      setIsPackBursting(true);
      setStatusMessageAr(
        owner === 'PLAYER'
          ? 'ينفجر ختم الباك بتوهج التشاكرا! تنكشف البطاقات الثلاث الآن...'
          : `${RIVAL_NAME_AR} يفضّ ختم الباك! تنكشف البطاقات الثلاث الآن...`
      );
      setStatusMessageEn(
        owner === 'PLAYER'
          ? 'Pack seal bursts with chakra! Revealing the 3 cards now...'
          : `${RIVAL_NAME_EN} breaks the pack seal! Revealing the 3 cards now...`
      );

      registerTimeout(() => {
        setIsPackBursting(false);
        setIsPackOpened(true);
        soundEngine.playFlameFlip(true);
        if (owner === 'PLAYER') {
          setStatusMessageAr('ظهرت البطاقات الثلاث مكشوفة! اختر بطاقة واحدة لضمها إلى فريقك.');
          setStatusMessageEn('All 3 cards revealed face-up! Tap 1 card to recruit into your squad.');
        } else {
          setStatusMessageAr(
            `ظهرت البطاقات الثلاث... ${RIVAL_NAME_AR} يفاضل بينها لاختيار الأقوى!`
          );
          setStatusMessageEn(
            `All 3 cards revealed... ${RIVAL_NAME_EN} is comparing them to pick the strongest!`
          );
        }
      }, 650);
    },
    [isPackOpened, isPackBursting, isAnimatingPick, registerTimeout]
  );

  const handleOpenPack = useCallback(() => {
    triggerPackOpenSequence('PLAYER');
  }, [triggerPackOpenSequence]);

  const handleSelectPackCard = useCallback(
    (idx: number, owner: 'PLAYER' | 'CPU') => {
      const currentPackTurn = packTurns[currentRoundIndex];
      if (!currentPackTurn || pickedPackCardIdx !== null || isAnimatingPick) return;

      const chosen = currentPackTurn.cards[idx];
      setIsAnimatingPick(true);
      setPickedPackCardIdx(idx);
      soundEngine.playSelect();
      if (['SSS', 'SS'].includes(chosen.rankCode)) {
        soundEngine.playLegendaryLightning();
        triggerScreenShake();
      }

      setStatusMessageAr(
        owner === 'PLAYER'
          ? `اخترت (${chosen.nameAr} · رتبة ${chosen.rankCode}) من ${currentPackTurn.packTheme.nameAr}!`
          : `اختار ${RIVAL_NAME_AR} بطاقة (${chosen.nameAr} · رتبة ${chosen.rankCode}) من ${currentPackTurn.packTheme.nameAr}!`
      );
      setStatusMessageEn(
        owner === 'PLAYER'
          ? `You picked (${chosen.nameEn} · Rank ${chosen.rankCode}) from ${currentPackTurn.packTheme.nameEn}!`
          : `${RIVAL_NAME_EN} picked (${chosen.nameEn} · Rank ${chosen.rankCode}) from ${currentPackTurn.packTheme.nameEn}!`
      );

      registerTimeout(() => {
        soundEngine.playCardDockTransfer();
        if (owner === 'PLAYER') {
          setPlayerTeam((prev) => [...prev, chosen]);
        } else {
          setCpuTeam((prev) => [...prev, chosen]);
        }
        setIsAnimatingPick(false);
        setIsRoundReadyNext(true);
      }, 1850);
    },
    [
      packTurns,
      currentRoundIndex,
      pickedPackCardIdx,
      isAnimatingPick,
      registerTimeout,
      triggerScreenShake,
    ]
  );

  // Automatic CPU Turn in Mode 4 (Shinobi Packs)
  useEffect(() => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'SHINOBI_PACKS' ||
      isRoundReadyNext ||
      isAnimatingPick ||
      pickedPackCardIdx !== null
    )
      return;
    const currentPackTurn = packTurns[currentRoundIndex];
    if (!currentPackTurn || currentPackTurn.turnOwner !== 'CPU') return;

    setIsCpuThinking(true);
    if (!isPackOpened && !isPackBursting) {
      const idOpen = window.setTimeout(() => {
        triggerPackOpenSequence('CPU');
      }, 1250);
      timersRef.current.push(idOpen);
      return;
    }

    if (isPackOpened) {
      const idPick = window.setTimeout(() => {
        setIsCpuThinking(false);
        let bestIdx = 0;
        currentPackTurn.cards.forEach((c, idx) => {
          const bestCard = currentPackTurn.cards[bestIdx];
          if (
            RANK_ORDER[c.rankCode] > RANK_ORDER[bestCard.rankCode] ||
            (RANK_ORDER[c.rankCode] === RANK_ORDER[bestCard.rankCode] &&
              c.hiddenCombatProfile.hiddenRate > bestCard.hiddenCombatProfile.hiddenRate)
          ) {
            bestIdx = idx;
          }
        });
        handleSelectPackCard(bestIdx, 'CPU');
      }, 1850);
      timersRef.current.push(idPick);
    }
  }, [
    gameState,
    playStyleMode,
    currentRoundIndex,
    packTurns,
    isPackOpened,
    isPackBursting,
    pickedPackCardIdx,
    isRoundReadyNext,
    isAnimatingPick,
    triggerPackOpenSequence,
    handleSelectPackCard,
  ]);

  // Player taps a card
  const handlePlayerPick = (choiceType: 'REVEALED' | 'HIDDEN') => {
    if (
      gameState !== 'ROUND_PLAY' ||
      isRoundReadyNext ||
      isCpuThinking ||
      isAnimatingPick
    )
      return;
    const currentPair = rounds[currentRoundIndex];
    if (!currentPair || currentPair.turnOwner !== 'PLAYER') return;

    executeCardPickSequence('PLAYER', choiceType, currentPair);
  };

  // Automatic Rival Turn when turnOwner === 'CPU' (Mode 1: Hidden Shinobi)
  useEffect(() => {
    if (
      gameState !== 'ROUND_PLAY' ||
      playStyleMode !== 'HIDDEN_SHINOBI' ||
      isRoundReadyNext ||
      isAnimatingPick
    )
      return;
    const currentPair = rounds[currentRoundIndex];
    if (!currentPair || currentPair.turnOwner !== 'CPU') return;

    setIsCpuThinking(true);
    const id = window.setTimeout(() => {
      setIsCpuThinking(false);
      const decision = decideCpuChoice(currentPair.revealedChar);
      executeCardPickSequence('CPU', decision.choice, currentPair);
    }, 1300);
    timersRef.current.push(id);

    return () => {
      window.clearTimeout(id);
    };
  }, [
    gameState,
    playStyleMode,
    currentRoundIndex,
    isRoundReadyNext,
    rounds,
    isAnimatingPick,
    executeCardPickSequence,
  ]);

  const totalDraftSteps =
    playStyleMode === 'SECOND_CHANCE' || playStyleMode === 'SHINOBI_PACKS'
      ? effectiveTeamSize * 2
      : effectiveTeamSize;

  // Proceed to next round/turn OR transition from Phase 1 to Phase 2 (Squad Showcase & Battle)
  const handleNextStep = () => {
    if (currentRoundIndex < totalDraftSteps - 1) {
      soundEngine.playHandSeal();
      resetRoundVisualStates();
      setCurrentRoundIndex((prev) => prev + 1);
    } else {
      launchGrandBattlePhase2(playerTeam, cpuTeam);
    }
  };

  // Step 1 of Arena (Phase 2): Start Phase 2 Battle Music after transition impact peak, and reveal each fighter with Character Reveal SFX!
  useEffect(() => {
    if (gameState !== 'SQUAD_SHOWCASE' || !battleReport) return;

    const totalFightersToShowcase = effectiveTeamSize * 2;
    const stepMs = effectiveTeamSize === 10 ? 520 : 720;
    let intervalId: number | null = null;

    // Start Phase 2 Epic Anime Battle Music right as the transition impact lands (950ms)
    const startPhase2TimeoutId = window.setTimeout(() => {
      soundEngine.setMusicMode('BATTLE');

      // Reveal first fighter immediately when Phase 2 music begins
      soundEngine.playCharacterReveal();
      setShowcaseRevealCount(1);

      intervalId = window.setInterval(() => {
        setShowcaseRevealCount((prev) => {
          if (prev < totalFightersToShowcase) {
            // Play 1-second Character Reveal SFX once for each newly revealed fighter over Phase 2 music
            soundEngine.playCharacterReveal();
            return prev + 1;
          }
          if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = null;
          }
          triggerScreenShake();
          // Phase 2 music continues seamlessly into the 20s Battle Countdown!
          setGameState('PRE_BATTLE_COUNTDOWN');
          return totalFightersToShowcase;
        });
      }, stepMs);
    }, 950);

    return () => {
      window.clearTimeout(startPhase2TimeoutId);
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [gameState, battleReport, effectiveTeamSize, triggerScreenShake]);

  // Step 2 of Arena: Run the 20s Grand Team Clash Countdown while Phase 2 Battle Music continues seamlessly!
  useEffect(() => {
    if (gameState !== 'PRE_BATTLE_COUNTDOWN' || !battleReport) return;

    countdownIntervalRef.current = window.setInterval(() => {
      setCountdownSeconds((prev) => {
        const nextSec = prev - 1;

        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            window.clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          soundEngine.playVictory(battleReport.overallWinner === 'PLAYER');
          triggerScreenShake();
          setGameState('FINAL_RESULT');
          return 0;
        }
        return nextSec;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        window.clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
      }
    };
  }, [gameState, battleReport, triggerScreenShake]);

  const currentPair = rounds[currentRoundIndex];
  const currentScRound = scRounds[currentRoundIndex];
  const currentAuctionRound = auctionRounds[currentRoundIndex];
  const currentPackTurn = packTurns[currentRoundIndex];
  const activeStatusMessage = lang === 'ar' ? statusMessageAr : statusMessageEn;
  const activeModeInfo =
    PLAY_STYLE_MODES_INFO.find((m) => m.id === playStyleMode) || PLAY_STYLE_MODES_INFO[0];

  // Arrange squads so the highest-ranked fighter is always in the center
  const orderedPlayerSquad = arrangeSquadCenterPeak(playerTeam);
  const orderedCpuSquad = arrangeSquadCenterPeak(cpuTeam);

  return (
    <div
      className={`min-h-[100dvh] w-full flex flex-col justify-between bg-[#070B14] text-white relative overflow-x-hidden ${
        isScreenShaking ? 'animate-arena-shake' : ''
      }`}
    >
      {/* Arena Stadium Spotlight Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={arenaBgImg}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 15%, rgba(239,68,68,0.22) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(59,130,246,0.25) 0%, transparent 45%), linear-gradient(to bottom, rgba(7,11,20,0.5), rgba(7,11,20,0.95))',
          }}
        />
      </div>

      {/* Compact Mobile-First Top Bar */}
      <header className="relative z-20 shrink-0 flex items-center justify-between px-3 sm:px-4 py-2 border-b border-purple-900/50 bg-slate-950/85 backdrop-blur-md">
        <button
          type="button"
          onClick={() => {
            clearAllTimers();
            soundEngine.setMusicMode('OFF');
            setGameState('SPLASH_HOME');
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src={appIconImg}
            alt="Shinobi Draft Icon"
            referrerPolicy="no-referrer"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-amber-400/60 shadow-[0_0_12px_rgba(249,115,22,0.45)] group-hover:scale-105 transition-transform"
          />
          <span className="font-display text-sm sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-fuchsia-400 bg-clip-text text-transparent whitespace-nowrap">
            Shinobi Draft
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-slate-900/90 border border-amber-400/40 text-[9px] sm:text-[10px] font-mono font-bold text-amber-300">
            v1.0.0
          </span>
        </button>

        {gameState === 'ROUND_PLAY' && (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-purple-300 font-display font-bold hidden sm:inline">
              {lang === 'ar' ? activeModeInfo.nameAr : activeModeInfo.nameEn} ·
            </span>
            <span className="text-slate-400">
              {lang === 'ar' ? 'المرحلة' : 'Step'}
            </span>
            <span className="text-amber-400 font-bold tabular-nums">
              {currentRoundIndex + 1}/{totalDraftSteps}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {/* Language Switcher Button (AR / EN) */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="min-h-[36px] px-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/50 text-xs font-display font-bold text-slate-200 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Shinobi Music Toggle */}
          <button
            type="button"
            onClick={handleToggleMusic}
            aria-label={musicEnabled ? 'Mute Music' : 'Unmute Music'}
            title={lang === 'ar' ? 'موسيقى الشينوبي' : 'Shinobi Music'}
            className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border cursor-pointer transition-colors ${
              musicEnabled
                ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Music className="w-4 h-4" />
          </button>

          {/* Sound Effects Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
            title={lang === 'ar' ? 'المؤثرات الصوتية' : 'Sound Effects'}
            className={`min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border cursor-pointer transition-colors ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-slate-200 hover:text-white'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {gameState !== 'SPLASH_HOME' && (
            <button
              type="button"
              onClick={startNewGame}
              className="min-h-[36px] px-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-display font-bold text-amber-400 hover:bg-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'إعادة' : 'Reset'}</span>
            </button>
          )}
        </div>
      </header>

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="relative z-10 flex-1 flex flex-col justify-between w-full max-w-2xl mx-auto px-2.5 sm:px-5 py-1.5 pb-3">
        {/* =====================================================================
            SCREEN 1: SPLASH HOME (4 Play Style Modes + 3v3 / 5v5 / 10v10 Selector)
           ===================================================================== */}
        {gameState === 'SPLASH_HOME' && (
          <div className="flex-1 flex flex-col items-center justify-between py-1.5 sm:py-3 text-center">
            <div className="my-auto flex flex-col items-center w-full max-w-xl py-1">
              <div className="relative mb-2 animate-card-float">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-orange-500/45 via-fuchsia-600/35 to-indigo-500/45 blur-xl pointer-events-none" />
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-[22px] p-[2.5px] bg-gradient-to-r from-orange-400 via-amber-300 to-indigo-500 shadow-[0_0_40px_rgba(249,115,22,0.55),0_0_40px_rgba(99,102,241,0.45)] ring-1 ring-amber-300/60 overflow-hidden">
                  <div className="relative w-full h-full rounded-[19px] bg-slate-950 overflow-hidden">
                    <img
                      src={appIconImg}
                      alt="Shinobi Draft App Icon"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-card-shine" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1">
                <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(249,115,22,0.45)]">
                  Shinobi Draft
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900/95 border border-amber-400/50 text-[10px] sm:text-xs font-mono font-extrabold text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                  <span>VERSION 1.0.0</span>
                </span>
              </div>

              {/* 4 PLAY STYLE MODES SELECTOR — Uniform Professional Image Cards */}
              <div className="w-full mt-2.5 space-y-2">
                <div className="text-[11px] sm:text-xs font-display font-bold text-amber-300">
                  {lang === 'ar'
                    ? 'اختر طور اللعب (4 أطوار احترافية):'
                    : 'Select Game Mode (4 Pro Modes):'}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full">
                  {PLAY_STYLE_MODES_INFO.map((m, idx) => {
                    const isSelected = playStyleMode === m.id;
                    const modeImg = MODE_THUMBNAIL_IMAGES[m.id];
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          soundEngine.playSelect();
                          setPlayStyleMode(m.id);
                        }}
                        className={`group relative h-24 sm:h-28 w-full rounded-2xl p-[2px] transition-all cursor-pointer active:scale-95 overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-300 via-orange-500 to-purple-700 shadow-[0_0_24px_rgba(245,158,11,0.65)] scale-[1.02] ring-2 ring-amber-300/80'
                            : 'bg-gradient-to-b from-slate-600 via-slate-800 to-slate-950 hover:from-purple-400/70 hover:via-purple-700/70 hover:to-slate-900 opacity-90 hover:opacity-100'
                        }`}
                      >
                        <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-950 flex flex-col justify-between">
                          {/* Mode Artwork Background */}
                          <img
                            src={modeImg}
                            alt={lang === 'ar' ? m.nameAr : m.nameEn}
                            referrerPolicy="no-referrer"
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                              isSelected ? 'scale-110 brightness-110' : 'group-hover:scale-105 brightness-90'
                            }`}
                          />

                          {/* Unified Frame Vignette & Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />
                          <div
                            className={`absolute inset-0 rounded-[14px] border pointer-events-none ${
                              isSelected ? 'border-amber-300/60' : 'border-white/15'
                            }`}
                          />

                          {/* Top Corner Badge */}
                          <div className="relative z-10 flex items-center justify-between px-2 pt-1.5">
                            <span
                              className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black border backdrop-blur-sm ${
                                isSelected
                                  ? 'bg-amber-400 text-slate-950 border-amber-200 shadow-sm'
                                  : 'bg-slate-950/80 text-purple-200 border-slate-700'
                              }`}
                            >
                              #{idx + 1}
                            </span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_8px_#fcd34d] animate-pulse" />
                            )}
                          </div>

                          {/* Bottom Title Banner Inside Frame */}
                          <div className="relative z-10 w-full px-2 pb-1.5 pt-3 text-center bg-gradient-to-t from-slate-950/95 via-slate-950/75 to-transparent">
                            <div
                              className={`font-display font-extrabold text-xs sm:text-sm leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] truncate ${
                                isSelected ? 'text-amber-300' : 'text-white'
                              }`}
                            >
                              {lang === 'ar' ? m.nameAr : m.nameEn}
                            </div>
                            <div
                              className={`font-display font-bold text-[9px] sm:text-[10px] truncate ${
                                isSelected ? 'text-orange-200' : 'text-slate-300'
                              }`}
                            >
                              {lang === 'ar' ? m.subAr : m.subEn}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Mode Description Box */}
                <div className="rounded-xl bg-slate-900/90 border border-purple-500/40 px-3 py-1.5 text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                  {lang === 'ar' ? activeModeInfo.descAr : activeModeInfo.descEn}
                </div>
              </div>

              {/* 3 BATTLE MODES SELECTOR: 3vs3 | 5vs5 | 10vs10 */}
              <div className="w-full mt-2 space-y-1">
                <div className="text-[11px] font-display font-bold text-amber-300/90">
                  {lang === 'ar' ? 'حجم الفريق:' : 'Squad Size:'}
                </div>
                <div className="grid grid-cols-3 gap-2 w-full" dir="ltr">
                  {([3, 5, 10] as BattleMode[]).map((mode) => {
                    const isSelected = battleMode === mode;
                    const modeSubAr =
                      mode === 3
                        ? 'مواجهة سريعة'
                        : mode === 5
                        ? 'الطور القياسي'
                        : 'حرب النينجا';
                    const modeSubEn =
                      mode === 3 ? 'Quick Clash' : mode === 5 ? 'Standard' : 'Shinobi War';

                    return (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => {
                          soundEngine.playSelect();
                          setBattleMode(mode);
                        }}
                        className={`py-1.5 px-2 rounded-xl border-2 transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-b from-orange-500/30 via-purple-600/35 to-slate-950 border-amber-400 shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-[1.02]'
                            : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50 text-slate-400'
                        }`}
                      >
                        <span
                          className={`font-mono font-black text-xs sm:text-sm tracking-tight ${
                            isSelected
                              ? 'bg-gradient-to-r from-amber-200 via-orange-400 to-fuchsia-400 bg-clip-text text-transparent'
                              : 'text-slate-300'
                          }`}
                        >
                          {mode} VS {mode}
                        </span>
                        <span
                          className={`font-display font-bold text-[9px] sm:text-[10px] ${
                            isSelected ? 'text-purple-200' : 'text-slate-500'
                          }`}
                        >
                          {lang === 'ar' ? modeSubAr : modeSubEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs pt-2 pb-1">
              <button
                type="button"
                onClick={startNewGame}
                className="group relative w-full h-13 sm:h-15 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-400 hover:via-orange-500 hover:to-red-500 active:scale-[0.98] border-4 border-[#091526] shadow-[0_6px_0_#091526,0_12px_30px_rgba(239,68,68,0.5)] transition-all flex items-center justify-between px-4 cursor-pointer"
              >
                <span className="font-display text-base sm:text-xl font-extrabold text-white drop-shadow mx-auto">
                  {lang === 'ar'
                    ? `ابدأ (${activeModeInfo.nameAr})`
                    : `START (${activeModeInfo.nameEn})`}
                </span>
                <span className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-b from-orange-400 to-red-700 border-4 border-[#091526] flex items-center justify-center shadow-inner shrink-0">
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            SCREEN 1.5: SHINOBI TOSS (Shuriken Lottery for Round 1 First Turn!)
           ===================================================================== */}
        {gameState === 'SHINOBI_TOSS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
            <div className="w-full max-w-md rounded-3xl bg-slate-900/95 border-2 border-amber-400/60 p-6 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.25)]">
              <div className="text-xs font-display font-bold text-amber-300 tracking-wide">
                {lang === 'ar'
                  ? `${activeModeInfo.nameAr} · ${effectiveTeamSize} ضد ${effectiveTeamSize}`
                  : `${activeModeInfo.nameEn} · ${effectiveTeamSize} VS ${effectiveTeamSize}`}
              </div>

              {/* Spinning Shuriken Seal Wheel */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div
                  className={`w-28 h-28 rounded-full border-4 ${
                    isTossSpinning
                      ? 'border-amber-400 animate-spin'
                      : firstTurnWinner === 'PLAYER'
                      ? 'border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                      : 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.5)]'
                  } bg-slate-950 flex items-center justify-center transition-all duration-300`}
                >
                  <svg
                    viewBox="0 0 100 100"
                    className={`w-20 h-20 ${isTossSpinning ? 'animate-spin' : ''}`}
                    fill="none"
                  >
                    <path
                      d="M50 5 L62 38 L95 50 L62 62 L50 95 L38 62 L5 50 L38 38 Z"
                      fill={
                        isTossSpinning
                          ? '#FBBF24'
                          : firstTurnWinner === 'PLAYER'
                          ? '#10B981'
                          : '#F43F5E'
                      }
                      stroke="#F8FAFC"
                      strokeWidth="3"
                    />
                    <circle cx="50" cy="50" r="10" fill="#090D16" stroke="#F8FAFC" strokeWidth="3" />
                  </svg>
                </div>
              </div>

              {isTossSpinning ? (
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white animate-pulse">
                  {lang === 'ar'
                    ? 'يدور شوريكن القدر بينك وبين الشينوبي المقنّع...'
                    : 'Spinning the Shuriken of Destiny...'}
                </h2>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-slate-400">
                    {lang === 'ar' ? 'نتيجة قرعة البداية:' : 'Toss Result:'}
                  </div>
                  <h2
                    className={`font-display text-2xl sm:text-3xl font-extrabold ${
                      firstTurnWinner === 'PLAYER' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {firstTurnWinner === 'PLAYER'
                      ? lang === 'ar'
                        ? 'أنت تبدأ الاختيار في الجولة الأولى!'
                        : 'You Pick First in Round 1!'
                      : lang === 'ar'
                      ? `${RIVAL_NAME_AR} يبدأ الاختيار في الجولة الأولى!`
                      : `${RIVAL_NAME_EN} Picks First in Round 1!`}
                  </h2>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =====================================================================
            SCREEN 2: ROUND PLAY (Supports All 4 PlayStyleModes & 3v3 / 5v5 / 10v10!)
           ===================================================================== */}
        {gameState === 'ROUND_PLAY' && (
          <div className="flex-1 flex flex-col justify-between gap-1.5 py-0.5">
            {/* TOP DOCK: Rival Team */}
            <section className="bg-slate-900/80 border border-purple-500/35 rounded-2xl p-1.5 sm:p-2">
              <div className="flex items-center justify-between mb-1 px-1 text-[11px] sm:text-xs">
                <span className="font-display font-extrabold text-purple-300">
                  {lang === 'ar'
                    ? `فريق ${RIVAL_NAME_AR} (${cpuTeam.length}/${effectiveTeamSize})`
                    : `${RIVAL_NAME_EN}'s Squad (${cpuTeam.length}/${effectiveTeamSize})`}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">
                  {lang === 'ar' ? activeModeInfo.nameAr : activeModeInfo.nameEn}
                </span>
              </div>
              <div
                className={`grid ${
                  effectiveTeamSize === 3
                    ? 'grid-cols-3 gap-2 sm:gap-3'
                    : 'grid-cols-5 gap-1.5 sm:gap-2'
                }`}
              >
                {Array.from({ length: effectiveTeamSize }, (_, idx) => {
                  const member = cpuTeam[idx];
                  return member ? (
                    <ShinobiCard
                      key={`cpu-${idx}-${member.id}`}
                      character={member}
                      lang={lang}
                      mini
                      miniCompact={effectiveTeamSize === 10}
                    />
                  ) : (
                    <div
                      key={idx}
                      className={`${
                        effectiveTeamSize === 10
                          ? 'h-12 sm:h-16 rounded-lg'
                          : 'h-20 sm:h-32 rounded-xl'
                      } border border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-slate-600 font-mono text-xs`}
                    >
                      <span>{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* CENTER STAGE: Mode-Specific Interactive Stage */}
            {playStyleMode === 'HIDDEN_SHINOBI' &&
              currentPair && (
                <section className="my-auto space-y-1.5">
                  {/* Turn Banner */}
                  <div
                    className={`rounded-xl px-2.5 py-1 text-center border transition-colors ${
                      currentPair.turnOwner === 'PLAYER'
                        ? 'bg-orange-950/45 border-orange-500/50 text-amber-200'
                        : 'bg-purple-950/50 border-purple-500/50 text-purple-200'
                    }`}
                  >
                    <div className="font-display font-extrabold text-[11px] sm:text-sm">
                      {activeStatusMessage ||
                        (currentPair.turnOwner === 'PLAYER'
                          ? lang === 'ar'
                            ? `الجولة ${currentPair.roundNumber}: دورك! اضغط مباشرة على البطاقة التي تريد ضمها`
                            : `Round ${currentPair.roundNumber}: Your Turn! Tap directly on the card you want`
                          : lang === 'ar'
                          ? `الجولة ${currentPair.roundNumber}: دور ${RIVAL_NAME_AR} في الاختيار...`
                          : `Round ${currentPair.roundNumber}: ${RIVAL_NAME_EN}'s Turn to Pick...`)}
                    </div>
                  </div>

                  {/* TWO SIDE-BY-SIDE CARDS */}
                  <div
                    key={`round-pair-${currentPair.roundNumber}`}
                    className="grid grid-cols-2 gap-2.5 sm:gap-6 items-start py-0.5"
                  >
                    <ShinobiCard
                      key={`revealed-${currentPair.roundNumber}`}
                      character={currentPair.revealedChar}
                      lang={lang}
                      isShining={isRevealedCardShining}
                      disabled={
                        currentPair.turnOwner !== 'PLAYER' ||
                        isRoundReadyNext ||
                        isCpuThinking ||
                        isAnimatingPick
                      }
                      onSelect={() => handlePlayerPick('REVEALED')}
                      ownerTag={revealedOwnerTag}
                    />

                    <ShinobiCard
                      key={`hidden-${currentPair.roundNumber}`}
                      character={currentPair.hiddenChar}
                      lang={lang}
                      isHiddenMystery
                      isFlippedReveal={isHiddenCardFlipped}
                      isShining={isHiddenCardShining}
                      isFlaming={isHiddenCardFlaming}
                      disabled={
                        currentPair.turnOwner !== 'PLAYER' ||
                        isRoundReadyNext ||
                        isCpuThinking ||
                        isAnimatingPick
                      }
                      onSelect={() => handlePlayerPick('HIDDEN')}
                      ownerTag={hiddenOwnerTag}
                    />
                  </div>

                  {(isCpuThinking || isRoundReadyNext) && (
                    <div className="pt-0.5 flex flex-col justify-center">
                      {isCpuThinking && (
                        <div className="rounded-xl bg-slate-900/95 border border-purple-500/40 p-1.5 text-center animate-pulse">
                          <span className="font-display font-bold text-[11px] sm:text-sm text-purple-300">
                            {lang === 'ar'
                              ? `${RIVAL_NAME_AR} يفكر بين ${currentPair.revealedChar.nameAr} (${currentPair.revealedChar.rankCode}) وبين البطاقة الخفية...`
                              : `${RIVAL_NAME_EN} is deciding between ${currentPair.revealedChar.nameEn} (${currentPair.revealedChar.rankCode}) and the Hidden Card...`}
                          </span>
                        </div>
                      )}

                      {isRoundReadyNext && (
                        <div className="rounded-xl bg-slate-950/95 border border-red-800/60 p-1.5 sm:p-2 flex flex-col sm:flex-row items-center justify-between gap-1.5 shadow-[0_0_25px_rgba(153,27,27,0.35)]">
                          <p className="text-[11px] sm:text-xs text-slate-100 font-medium text-center sm:text-start leading-snug line-clamp-2">
                            {activeStatusMessage}
                          </p>
                          <button
                            type="button"
                            onClick={handleNextStep}
                            className="w-full sm:w-auto min-h-[40px] px-5 rounded-xl bg-gradient-to-r from-red-900 via-rose-700 to-purple-900 hover:from-red-800 hover:via-rose-600 hover:to-purple-800 border border-red-400/60 text-amber-100 font-display font-extrabold text-xs sm:text-sm whitespace-nowrap shadow-[0_0_20px_rgba(225,29,72,0.55)] active:scale-[0.98] transition-all cursor-pointer"
                          >
                            {currentRoundIndex < totalDraftSteps - 1
                              ? lang === 'ar'
                                ? `الجولة التالية (${currentRoundIndex + 2}/${totalDraftSteps})`
                                : `Next Round (${currentRoundIndex + 2}/${totalDraftSteps})`
                              : lang === 'ar'
                              ? 'بدء المعركة الكبرى!'
                              : 'Start Grand Battle!'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              )}

            {playStyleMode === 'SECOND_CHANCE' && currentScRound && (
              <SecondChanceStage
                lang={lang}
                roundNumber={currentScRound.roundNumber}
                totalRounds={totalDraftSteps}
                turnOwner={currentScRound.turnOwner}
                cards={currentScRound.cards}
                firstPickIdx={scFirstPickIdx}
                secondPickIdx={scSecondPickIdx}
                chosenFinalIdx={scChosenFinalIdx}
                revealedMissedIndices={scRevealedMissedIndices}
                awaitingDecision={scAwaitingDecision}
                statusMessage={activeStatusMessage}
                isRoundReadyNext={isRoundReadyNext}
                isCpuThinking={isCpuThinking}
                onCardClick={handleSecondChanceCardClick}
                onConfirmFirstCard={handleConfirmFirstSecondChance}
                onNextStep={handleNextStep}
              />
            )}

            {playStyleMode === 'SHINOBI_AUCTION' && currentAuctionRound && (
              <ShinobiAuctionStage
                lang={lang}
                roundNumber={currentAuctionRound.roundNumber}
                totalRounds={totalDraftSteps}
                auctionCard={currentAuctionRound.auctionCard}
                compensationCard={currentAuctionRound.compensationCard}
                isAuctionCardFlipped={isAuctionCardFlipped}
                isCompensationRevealed={isCompensationRevealed}
                playerCoins={playerCoins}
                cpuCoins={cpuCoins}
                currentBid={currentBid}
                highestBidder={highestBidder}
                activeBidderTurn={activeBidderTurn}
                auctionWinner={auctionWinner}
                statusMessage={activeStatusMessage}
                isRoundReadyNext={isRoundReadyNext}
                isCpuThinking={isCpuThinking}
                onPlayerBid={handlePlayerAuctionBid}
                onPlayerPass={handlePlayerAuctionPass}
                onNextStep={handleNextStep}
              />
            )}

            {playStyleMode === 'SHINOBI_PACKS' && currentPackTurn && (
              <ShinobiPacksStage
                lang={lang}
                roundNumber={currentPackTurn.turnIndex}
                totalRounds={totalDraftSteps}
                turnOwner={currentPackTurn.turnOwner}
                packTheme={currentPackTurn.packTheme}
                isPackOpened={isPackOpened}
                isPackBursting={isPackBursting}
                packCards={currentPackTurn.cards}
                pickedCardIdx={pickedPackCardIdx}
                statusMessage={activeStatusMessage}
                isRoundReadyNext={isRoundReadyNext}
                isCpuThinking={isCpuThinking}
                onOpenPack={handleOpenPack}
                onSelectPackCard={(idx) => handleSelectPackCard(idx, 'PLAYER')}
                onNextStep={handleNextStep}
              />
            )}

            {/* BOTTOM DOCK: Player Team */}
            <section className="bg-slate-900/80 border border-orange-500/35 rounded-2xl p-1.5 sm:p-2">
              <div className="flex items-center justify-between mb-1 px-1 text-[11px] sm:text-xs">
                <span className="font-display font-extrabold text-orange-400">
                  {lang === 'ar'
                    ? `فريقك أنت (${playerTeam.length}/${effectiveTeamSize})`
                    : `Your Squad (${playerTeam.length}/${effectiveTeamSize})`}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400">
                  {lang === 'ar' ? 'تشكيلتك المختارة' : 'Your Selected Squad'}
                </span>
              </div>
              <div
                className={`grid ${
                  effectiveTeamSize === 3
                    ? 'grid-cols-3 gap-2 sm:gap-3'
                    : 'grid-cols-5 gap-1.5 sm:gap-2'
                }`}
              >
                {Array.from({ length: effectiveTeamSize }, (_, idx) => {
                  const member = playerTeam[idx];

                  return member ? (
                    <div
                      key={`player-${idx}-${member.id}`}
                      className="relative rounded-xl transition-all"
                    >
                      <ShinobiCard
                        character={member}
                        lang={lang}
                        mini
                        miniCompact={effectiveTeamSize === 10}
                      />
                    </div>
                  ) : (
                    <div
                      key={idx}
                      className={`${
                        effectiveTeamSize === 10
                          ? 'h-12 sm:h-16 rounded-lg'
                          : 'h-20 sm:h-32 rounded-xl'
                      } border border-dashed border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-slate-600 font-mono text-xs`}
                    >
                      <span>{idx + 1}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* =====================================================================
            SCREEN 3, 4 & 5: SEAMLESS SPLIT-SCREEN ANIME BATTLE & DUAL CHAKRA BAR
           ===================================================================== */}
        {(gameState === 'SQUAD_SHOWCASE' ||
          gameState === 'PRE_BATTLE_COUNTDOWN' ||
          gameState === 'FINAL_RESULT') &&
          battleReport && (
            <div className="w-full h-[calc(100dvh-64px)] min-h-[460px] flex flex-col justify-between py-0.5 overflow-hidden">
              {/* FULL-BLEED SEAMLESS SPLIT-SCREEN ARENA (Strictly fits phone viewport height!) */}
              <div className="relative flex-1 min-h-0 w-full h-full rounded-2xl overflow-hidden border-2 border-slate-800 shadow-[0_0_70px_rgba(0,0,0,0.98)] flex flex-col justify-between select-none bg-slate-950">
                {/* MAIN SEAMLESS N-ROW x 2-COLUMN GRID (NO GAPS BETWEEN PORTRAITS!) */}
                <div className="relative flex-1 min-h-0 grid grid-cols-2 gap-0 w-full h-full overflow-hidden">
                  {/* ===============================================================
                      SIDE 1: TEAM A (Edge-to-Edge Horizontal Strips - Kyuubi Orange/Gold Frame)
                     =============================================================== */}
                  <div
                    className="grid gap-0 h-full w-full min-h-0"
                    style={{ gridTemplateRows: `repeat(${orderedPlayerSquad.length}, minmax(0, 1fr))` }}
                  >
                    {orderedPlayerSquad.map((char, idx) => {
                      const rawName = lang === 'ar' ? char.nameAr : char.nameEn;
                      const { primary, form } = splitCharacterDisplayName(rawName);
                      const isCenterLeader = idx === getSquadCenterIndex(orderedPlayerSquad.length);
                      const isRevealedYet =
                        gameState !== 'SQUAD_SHOWCASE' || showcaseRevealCount >= idx + 1;
                      const rankTheme = getRankMetallicTheme(char.rankCode);
                      const is10v10 = orderedPlayerSquad.length === 10;

                      return (
                        <div
                          key={char.id}
                          className={`relative w-full h-full min-h-0 overflow-hidden border-b-[1.5px] sm:border-b-[2px] border-orange-500/90 last:border-b-0 bg-slate-950 transition-all duration-500 ${
                            isRevealedYet ? 'opacity-100' : 'opacity-15 blur-[2px]'
                          }`}
                          style={{
                            boxShadow: 'inset 0 0 22px rgba(249,115,22,0.5)',
                          }}
                        >
                          {isRevealedYet ? (
                            <>
                              <img
                                src={char.portraitUrl}
                                alt={rawName}
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover object-[50%_18%] transition-transform duration-700 ${
                                  isCenterLeader ? 'scale-110' : 'scale-105'
                                }`}
                              />
                              {/* Kyuubi Warm Golden-Orange Edge Vignette & Glow */}
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  background:
                                    'linear-gradient(90deg, rgba(249,115,22,0.34) 0%, transparent 45%, rgba(9,13,22,0.75) 100%), linear-gradient(to top, rgba(9,13,22,0.88) 0%, transparent 45%)',
                                }}
                              />

                              {/* Glowing Kyuubi Horizontal Divider Line Highlight */}
                              <div className="absolute inset-x-0 bottom-0 h-[1.5px] sm:h-[2px] bg-gradient-to-r from-amber-300 via-orange-500 to-amber-200 shadow-[0_0_12px_#f97316]" />

                              {/* Small Rank Badge in Corner */}
                              <span
                                className={`absolute top-0.5 right-1 px-1 py-0.1 rounded ${
                                  is10v10 ? 'text-[6px] sm:text-[7.5px]' : 'text-[7px] sm:text-[8.5px]'
                                } font-mono font-extrabold border z-10 ${rankTheme.badgeBg}`}
                              >
                                {char.rankCode}
                              </span>

                              {/* Fighter Name Overlaid on Strip */}
                              <div className="absolute bottom-0.5 right-1.5 left-5 z-10 flex items-center gap-1">
                                <span
                                  className={`font-display font-black ${
                                    is10v10 ? 'text-[8px] sm:text-[10px]' : 'text-[9.5px] sm:text-xs'
                                  } text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-1`}
                                >
                                  {primary}
                                </span>
                                {form && !is10v10 && (
                                  <span className="font-display font-bold text-[8px] sm:text-[9.5px] text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-1">
                                    ({form})
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-950 text-orange-400/40 font-mono text-xs font-black">
                              ?
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* ===============================================================
                      SIDE 2: TEAM B (Edge-to-Edge Horizontal Strips - Susanoo Violet Frame)
                     =============================================================== */}
                  <div
                    className="grid gap-0 h-full w-full min-h-0"
                    style={{
                      gridTemplateRows: `repeat(${orderedCpuSquad.length}, minmax(0, 1fr))`,
                    }}
                  >
                      {orderedCpuSquad.map((char, idx) => {
                        const rawName = lang === 'ar' ? char.nameAr : char.nameEn;
                        const { primary, form } = splitCharacterDisplayName(rawName);
                        const isCenterLeader = idx === getSquadCenterIndex(orderedCpuSquad.length);
                        const isRevealedYet =
                          gameState !== 'SQUAD_SHOWCASE' ||
                          showcaseRevealCount >= idx + orderedPlayerSquad.length + 1;
                        const rankTheme = getRankMetallicTheme(char.rankCode);
                        const is10v10 = orderedCpuSquad.length === 10;

                        return (
                          <div
                            key={char.id}
                            className={`relative w-full h-full min-h-0 overflow-hidden border-b-[1.5px] sm:border-b-[2px] border-purple-500/90 last:border-b-0 bg-slate-950 transition-all duration-500 ${
                              isRevealedYet ? 'opacity-100' : 'opacity-15 blur-[2px]'
                            }`}
                            style={{
                              boxShadow: 'inset 0 0 22px rgba(168,85,247,0.5)',
                            }}
                          >
                            {isRevealedYet ? (
                              <>
                                <img
                                  src={char.portraitUrl}
                                  alt={rawName}
                                  referrerPolicy="no-referrer"
                                  className={`w-full h-full object-cover object-[50%_18%] transition-transform duration-700 ${
                                    isCenterLeader ? 'scale-110' : 'scale-105'
                                  }`}
                                />
                                {/* Susanoo Violet-Crimson Edge Vignette & Glow */}
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    background:
                                      'linear-gradient(270deg, rgba(168,85,247,0.36) 0%, transparent 45%, rgba(9,13,22,0.75) 100%), linear-gradient(to top, rgba(9,13,22,0.88) 0%, transparent 45%)',
                                  }}
                                />

                                {/* Glowing Susanoo Horizontal Divider Line Highlight */}
                                <div className="absolute inset-x-0 bottom-0 h-[1.5px] sm:h-[2px] bg-gradient-to-r from-fuchsia-300 via-purple-500 to-indigo-400 shadow-[0_0_12px_#a855f7]" />

                                {/* Small Rank Badge in Corner */}
                                <span
                                  className={`absolute top-0.5 left-1 px-1 py-0.1 rounded ${
                                    is10v10
                                      ? 'text-[6px] sm:text-[7.5px]'
                                      : 'text-[7px] sm:text-[8.5px]'
                                  } font-mono font-extrabold border z-10 ${rankTheme.badgeBg}`}
                                >
                                  {char.rankCode}
                                </span>

                                {/* Fighter Name Overlaid on Strip */}
                                <div className="absolute bottom-0.5 left-1.5 right-5 z-10 flex items-center justify-end gap-1">
                                  {form && !is10v10 && (
                                    <span className="font-display font-bold text-[8px] sm:text-[9.5px] text-purple-300 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-1">
                                      ({form})
                                    </span>
                                  )}
                                  <span
                                    className={`font-display font-black ${
                                      is10v10
                                        ? 'text-[8px] sm:text-[10px]'
                                        : 'text-[9.5px] sm:text-xs'
                                    } text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] line-clamp-1`}
                                  >
                                    {primary}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-950 text-purple-400/40 font-mono text-xs font-black">
                                ?
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  {/* ===============================================================
                      JAGGED DIAGONAL CHAKRA RIFT + MASTERPIECE ANIME "VS" EMBLEM
                     =============================================================== */}
                  <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
                    {/* Full-Height Jagged Diagonal Clash Rift SVG */}
                    <svg
                      viewBox="0 0 400 700"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full"
                      fill="none"
                    >
                      {/* Dark Obsidian Core Slash */}
                      <path
                        d="M218 0 L195 220 L212 350 L184 490 L196 700 L176 700 L166 490 L194 350 L177 220 L200 0 Z"
                        fill="#04060C"
                      />
                      {/* Kyuubi Fiery Orange/Gold Slash Edge (Right Side) */}
                      <path
                        d="M220 0 L197 220 L214 350 L186 490 L198 700"
                        stroke="#F97316"
                        strokeWidth="6"
                        className="drop-shadow-[0_0_18px_rgba(249,115,22,1)]"
                      />
                      {/* Susanoo Electric Violet/Blue Slash Edge (Left Side) */}
                      <path
                        d="M198 0 L175 220 L192 350 L164 490 L176 700"
                        stroke="#A855F7"
                        strokeWidth="6"
                        className="drop-shadow-[0_0_18px_rgba(168,85,247,1)]"
                      />
                      {/* White-Hot Lightning Core Line */}
                      <path
                        d="M209 0 L186 220 L203 350 L175 490 L187 700"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeOpacity="0.95"
                      />
                    </svg>

                    {/* Oversized Custom-Crafted Anime "VS" Crest (Strictly LTR so V is Left & S is Right) */}
                    <div
                      dir="ltr"
                      className={`relative flex items-center justify-center transition-transform duration-500 ${
                        gameState === 'PRE_BATTLE_COUNTDOWN' ? 'scale-110' : 'scale-100'
                      }`}
                    >
                      {/* Dual Chakra Shockwave Halo */}
                      <div className="absolute -inset-10 sm:-inset-14 rounded-full bg-gradient-to-r from-purple-600/75 via-white/40 to-orange-500/75 blur-2xl animate-pulse" />

                      <svg
                        viewBox="0 0 260 220"
                        className="w-40 h-36 sm:w-56 sm:h-48 overflow-visible drop-shadow-[0_8px_28px_rgba(0,0,0,0.95)]"
                        fill="none"
                      >
                        <defs>
                          {/* Susanoo Violet-Cyan Electric Gradient for "V" */}
                          <linearGradient id="vSusanooGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" />
                            <stop offset="30%" stopColor="#E879F9" />
                            <stop offset="70%" stopColor="#9333EA" />
                            <stop offset="100%" stopColor="#3B0764" />
                          </linearGradient>

                          {/* Kyuubi Gold-Crimson Flame Gradient for "S" */}
                          <linearGradient id="sKyuubiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FEF08A" />
                            <stop offset="35%" stopColor="#FB923C" />
                            <stop offset="75%" stopColor="#EA580C" />
                            <stop offset="100%" stopColor="#991B1B" />
                          </linearGradient>

                          <filter id="vsGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Diagonal Clash Slash Beam Behind VS */}
                        <path
                          d="M195 12 L120 112 L145 112 L65 208 L138 104 L112 104 Z"
                          fill="#FFFFFF"
                          fillOpacity="0.92"
                          filter="url(#vsGlowFilter)"
                        />

                        {/* Left Susanoo Chakra Wing Flare */}
                        <path
                          d="M25 48 C5 78 12 128 45 168 C26 132 28 92 48 62 Z"
                          fill="url(#vSusanooGrad)"
                          opacity="0.85"
                        />

                        {/* Right Kyuubi Flame Wing Flare */}
                        <path
                          d="M235 48 C255 78 248 128 215 168 C234 132 232 92 212 62 Z"
                          fill="url(#sKyuubiGrad)"
                          opacity="0.85"
                        />

                        {/* Stylized Bladed "V" (Left Side - Susanoo Electric Violet) */}
                        <path
                          d="M34 42 L68 42 L94 128 L124 32 L148 32 L96 184 L74 184 Z"
                          fill="url(#vSusanooGrad)"
                          stroke="#FFFFFF"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                          filter="url(#vsGlowFilter)"
                        />

                        {/* Stylized Bladed "S" (Right Side - Kyuubi Fiery Orange-Red) */}
                        <path
                          d="M222 52 C202 34 162 36 148 62 C136 84 156 102 184 112 C204 120 202 140 180 148 C160 154 142 144 130 132 L118 158 C138 176 178 182 206 164 C232 146 232 110 198 94 C176 84 172 70 188 62 C200 56 212 62 220 70 Z"
                          fill="url(#sKyuubiGrad)"
                          stroke="#FFFFFF"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                          filter="url(#vsGlowFilter)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* ===============================================================
                    BOTTOM BAR: 20-SECOND CONVERGING KYUUBI (RIGHT) & SUSANOO (LEFT) CHAKRA BAR
                    OR SCREENSHOT MODE BOTTOM CONTROL BAR
                   =============================================================== */}
                {gameState !== 'FINAL_RESULT' && (
                  <div className="relative z-30 bg-slate-950 border-t-2 border-slate-800 px-3 py-2 shrink-0">
                    <div className="relative w-full h-4 sm:h-5 rounded-full bg-slate-900/95 border border-slate-700/90 overflow-hidden shadow-inner">
                      {/* Subtle Center Target Line Where the Two Chakras Meet */}
                      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-white/45 z-20" />

                      {gameState === 'SQUAD_SHOWCASE' ? (
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 via-fuchsia-500 to-purple-600 transition-all duration-300"
                          style={{
                            width: `${(showcaseRevealCount / (battleMode * 2)) * 100}%`,
                          }}
                        />
                      ) : (
                        <>
                          {/* RIGHT BAR: Kyuubi Nine-Tails Fiery Orange-Red Chakra */}
                          <div
                            key="kyuubi-right-bar"
                            className="absolute top-0 bottom-0 right-0 bg-gradient-to-l from-red-600 via-orange-500 to-amber-300 shadow-[0_0_20px_rgba(249,115,22,0.95)] animate-chakra-20s"
                          >
                            <div className="absolute inset-y-0 left-0 w-3 bg-white/95 blur-[2px] animate-pulse" />
                          </div>

                          {/* LEFT BAR: Susanoo Spectral Violet-Purple Chakra */}
                          <div
                            key="susanoo-left-bar"
                            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-indigo-800 via-purple-600 to-fuchsia-400 shadow-[0_0_20px_rgba(168,85,247,0.95)] animate-chakra-20s"
                          >
                            <div className="absolute inset-y-0 right-0 w-3 bg-white/95 blur-[2px] animate-pulse" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* When inspecting the Battle Squads for a Screenshot after the battle */}
                {gameState === 'FINAL_RESULT' && isViewingBattleSquads && (
                  <div className="relative z-30 bg-slate-950/95 border-t-2 border-slate-800 px-2.5 py-2 shrink-0 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        soundEngine.playSelect();
                        setIsViewingBattleSquads(false);
                      }}
                      className="flex-1 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-purple-400/60 text-purple-200 font-display font-extrabold text-xs sm:text-sm inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>
                        {lang === 'ar' ? 'العودة للنتيجة النهائية' : 'Back to Final Result'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={startNewGame}
                      className="flex-1 h-10 rounded-xl bg-gradient-to-r from-orange-500 via-red-600 to-purple-700 text-white font-display font-extrabold text-xs sm:text-sm border border-amber-300/70 inline-flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'العب مرة أخرى' : 'Play Again'}</span>
                    </button>
                  </div>
                )}

                {/* ===============================================================
                    FINAL RESULT FULL-SCREEN DRAMATIC OVERLAY + SCROLLABLE COMPLETE SUMMARY
                   =============================================================== */}
                {gameState === 'FINAL_RESULT' && !isViewingBattleSquads && (
                  <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-start p-3 sm:p-5 text-center animate-card-deal overflow-y-auto space-y-3.5">
                    <div
                      className="fixed inset-0 pointer-events-none opacity-50"
                      style={{
                        background:
                          battleReport.overallWinner === 'PLAYER'
                            ? 'radial-gradient(circle at 50% 18%, rgba(249,115,22,0.55) 0%, rgba(168,85,247,0.25) 55%, transparent 80%)'
                            : 'radial-gradient(circle at 50% 18%, rgba(168,85,247,0.55) 0%, rgba(225,29,72,0.3) 55%, transparent 80%)',
                      }}
                    />

                    {/* 1. Huge Animated Verdict Headline: لقد ربحت المعركة / لقد خسرت المعركة */}
                    <div className="relative z-10 pt-1 animate-verdict-slam space-y-1 shrink-0 w-full">
                      <h2
                        className={`font-display text-2xl sm:text-5xl font-black tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)] ${
                          battleReport.overallWinner === 'PLAYER'
                            ? 'bg-gradient-to-r from-amber-200 via-orange-400 to-red-500 bg-clip-text text-transparent'
                            : 'bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent'
                        }`}
                      >
                        {battleReport.overallWinner === 'PLAYER'
                          ? lang === 'ar'
                            ? 'لقد ربحت المعركة!'
                            : 'YOU WON THE BATTLE!'
                          : lang === 'ar'
                          ? 'لقد خسرت المعركة!'
                          : 'YOU LOST THE BATTLE!'}
                      </h2>
                      <p className="font-display font-extrabold text-xs sm:text-sm text-white/95">
                        {battleReport.overallWinner === 'PLAYER'
                          ? lang === 'ar'
                            ? `الفريق الفائز: تشكيلتك الأسطورية (${battleMode} ضد ${battleMode})`
                            : `Winning Squad: Your Legendary Team (${battleMode}v${battleMode})`
                          : lang === 'ar'
                          ? `الفريق الفائز: تشكيلة ${RIVAL_NAME_AR} (${battleMode} ضد ${battleMode})`
                          : `Winning Squad: ${RIVAL_NAME_EN}'s Team (${battleMode}v${battleMode})`}
                      </p>
                    </div>

                    {/* 2. WINNING SQUAD PANORAMA (FULL COLOR) */}
                    <div
                      className={`relative z-10 w-full h-[165px] sm:h-[215px] rounded-2xl overflow-hidden border-2 grid gap-0 shrink-0 ${
                        battleMode === 3
                          ? 'grid-cols-3'
                          : battleMode === 5
                          ? 'grid-cols-5'
                          : 'grid-cols-5 grid-rows-2 h-[220px] sm:h-[270px]'
                      } ${
                        battleReport.overallWinner === 'PLAYER'
                          ? 'border-orange-400 shadow-[0_0_35px_rgba(249,115,22,0.6)]'
                          : 'border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.6)]'
                      }`}
                    >
                      {(battleReport.overallWinner === 'PLAYER'
                        ? orderedPlayerSquad
                        : orderedCpuSquad
                      ).map((winnerChar, idx, arr) => {
                        const rawName =
                          lang === 'ar' ? winnerChar.nameAr : winnerChar.nameEn;
                        const { primary, form } = splitCharacterDisplayName(rawName);
                        const isLeader = idx === getSquadCenterIndex(arr.length);
                        const rankTheme = getRankMetallicTheme(winnerChar.rankCode);
                        const dividerBorder =
                          battleReport.overallWinner === 'PLAYER'
                            ? 'border-e-[1.5px] border-b-[1.5px] border-orange-400/80'
                            : 'border-e-[1.5px] border-b-[1.5px] border-purple-400/80';

                        return (
                          <div
                            key={winnerChar.id}
                            className={`relative h-full w-full overflow-hidden bg-slate-950 ${dividerBorder}`}
                          >
                            <img
                              src={winnerChar.portraitUrl}
                              alt={rawName}
                              referrerPolicy="no-referrer"
                              className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                                isLeader ? 'scale-110 brightness-110' : 'scale-105'
                              }`}
                            />
                            {/* Top & Bottom Dramatic Gradient Vignette */}
                            <div
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background:
                                  battleReport.overallWinner === 'PLAYER'
                                    ? 'linear-gradient(to top, rgba(9,13,22,0.95) 0%, rgba(249,115,22,0.18) 45%, rgba(9,13,22,0.5) 100%)'
                                    : 'linear-gradient(to top, rgba(9,13,22,0.95) 0%, rgba(168,85,247,0.18) 45%, rgba(9,13,22,0.5) 100%)',
                              }}
                            />

                            {/* Small Rank Badge at Top */}
                            <span
                              className={`absolute top-1 right-1 px-1 py-0.2 rounded text-[6.5px] sm:text-[9px] font-mono font-extrabold border z-10 ${rankTheme.badgeBg}`}
                            >
                              {winnerChar.rankCode}
                            </span>

                            {isLeader && (
                              <span
                                className={`absolute top-1 left-1 px-1 py-0.2 rounded font-display font-black text-[6px] sm:text-[8.5px] z-10 shadow ${
                                  battleReport.overallWinner === 'PLAYER'
                                    ? 'bg-amber-400 text-slate-950'
                                    : 'bg-fuchsia-400 text-slate-950'
                                }`}
                              >
                                {lang === 'ar' ? 'القائد' : 'ACE'}
                              </span>
                            )}

                            {/* Fighter Name & Form at Bottom of Each Seamless Strip */}
                            <div className="absolute inset-x-0.5 bottom-1 z-10 flex flex-col items-center text-center">
                              <span className="font-display font-black text-[8.5px] sm:text-xs text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)] leading-tight line-clamp-1">
                                {primary}
                              </span>
                              {form && battleMode !== 10 && (
                                <span
                                  className={`font-display font-bold text-[7.5px] sm:text-[9.5px] leading-tight line-clamp-1 ${
                                    battleReport.overallWinner === 'PLAYER'
                                      ? 'text-amber-300'
                                      : 'text-purple-300'
                                  }`}
                                >
                                  {form}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 3. LOSING SQUAD PANORAMA (BLACK & WHITE / GRAYSCALE) */}
                    <div className="relative z-10 w-full space-y-1 shrink-0">
                      <p className="font-display font-bold text-[11px] sm:text-xs text-slate-400">
                        {battleReport.overallWinner === 'PLAYER'
                          ? lang === 'ar'
                            ? `الفريق الخاسر: تشكيلة ${RIVAL_NAME_AR}`
                            : `Defeated Squad: ${RIVAL_NAME_EN}'s Team`
                          : lang === 'ar'
                          ? 'الفريق الخاسر: تشكيلتك'
                          : 'Defeated Squad: Your Team'}
                      </p>
                      <div
                        className={`w-full h-[125px] sm:h-[160px] rounded-2xl overflow-hidden border border-slate-600/80 shadow-[0_0_20px_rgba(0,0,0,0.85)] grid gap-0 ${
                          battleMode === 3
                            ? 'grid-cols-3'
                            : battleMode === 5
                            ? 'grid-cols-5'
                            : 'grid-cols-5 grid-rows-2 h-[175px] sm:h-[210px]'
                        }`}
                      >
                        {(battleReport.overallWinner === 'PLAYER'
                          ? orderedCpuSquad
                          : orderedPlayerSquad
                        ).map((loserChar, idx, arr) => {
                          const rawName =
                            lang === 'ar' ? loserChar.nameAr : loserChar.nameEn;
                          const { primary, form } = splitCharacterDisplayName(rawName);
                          const isLeader = idx === getSquadCenterIndex(arr.length);

                          return (
                            <div
                              key={loserChar.id}
                              className="relative h-full w-full overflow-hidden bg-slate-950 border-e border-b border-slate-700/80 grayscale contrast-125 brightness-75"
                            >
                              <img
                                src={loserChar.portraitUrl}
                                alt={rawName}
                                referrerPolicy="no-referrer"
                                className={`w-full h-full object-cover object-top ${
                                  isLeader ? 'scale-105' : 'scale-100'
                                }`}
                              />
                              <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                  background:
                                    'linear-gradient(to top, rgba(9,13,22,0.95) 0%, rgba(15,23,42,0.35) 50%, rgba(9,13,22,0.65) 100%)',
                                }}
                              />

                              {/* Monochrome Rank Badge */}
                              <span className="absolute top-1 right-1 px-1 py-0.2 rounded text-[6px] sm:text-[8px] font-mono font-extrabold border border-slate-400/60 bg-slate-900/90 text-slate-200 z-10">
                                {loserChar.rankCode}
                              </span>

                              {/* Fighter Name at Bottom */}
                              <div className="absolute inset-x-0.5 bottom-1 z-10 flex flex-col items-center text-center">
                                <span className="font-display font-bold text-[8px] sm:text-[11px] text-slate-200 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] leading-tight line-clamp-1">
                                  {primary}
                                </span>
                                {form && battleMode !== 10 && (
                                  <span className="font-display text-[7px] sm:text-[8.5px] text-slate-400 leading-tight line-clamp-1">
                                    {form}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 4. SINGLE DUAL-SEGMENT POWER & SYNERGY TUG-OF-WAR BAR (NO NUMBERS) */}
                    {(() => {
                      const pBase = Math.max(1, battleReport.teamABaseTeamPower);
                      const pSyn = Math.max(0, battleReport.teamASynergyBonus);
                      const cBase = Math.max(1, battleReport.teamBBaseTeamPower);
                      const cSyn = Math.max(0, battleReport.teamBSynergyBonus);
                      const totalCombined = Math.max(1, pBase + pSyn + cBase + cSyn);

                      const pBasePct = (pBase / totalCombined) * 100;
                      const pSynPct = (pSyn / totalCombined) * 100;
                      const cSynPct = (cSyn / totalCombined) * 100;
                      const cBasePct = (cBase / totalCombined) * 100;
                      const playerTotalPct = pBasePct + pSynPct;

                      return (
                        <div className="relative z-10 w-full max-w-lg mx-auto bg-slate-900/90 rounded-2xl p-3 border border-slate-700/80 shadow-lg space-y-2 shrink-0">
                          <div className="flex items-center justify-between text-[10px] sm:text-xs font-display font-black px-0.5">
                            <span className="text-orange-400 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_8px_#f97316]" />
                              {lang === 'ar' ? 'كفة فريقك (باريون)' : 'Your Scale (Baryon)'}
                            </span>
                            <span className="text-slate-300 text-[9.5px] sm:text-[11px] font-bold">
                              {lang === 'ar' ? 'مقياس القوة والتناغم' : 'Power & Synergy Balance'}
                            </span>
                            <span className="text-purple-400 flex items-center gap-1.5">
                              {lang === 'ar'
                                ? `كفة ${RIVAL_NAME_AR} (سوسانو)`
                                : `${RIVAL_NAME_EN} (Susanoo)`}
                              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_#a855f7]" />
                            </span>
                          </div>

                          {/* The Single Segmented Bar (Strictly without numbers) */}
                          <div className="relative w-full h-5 sm:h-6 rounded-full bg-slate-950 p-0.5 border border-slate-700 overflow-hidden shadow-inner flex">
                            {/* Center Equilibrium Reference Tick */}
                            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-white/30 z-20 pointer-events-none" />

                            <div className="w-full h-full rounded-full overflow-hidden flex relative">
                              {/* Segment 1: Player Base Power (Naruto Baryon Deep Crimson -> Fiery Orange) */}
                              <div
                                style={{ width: `${pBasePct}%` }}
                                className="h-full bg-gradient-to-r from-red-700 via-orange-600 to-orange-500 transition-all duration-700"
                                title={lang === 'ar' ? 'القوة العامة لفريقك' : 'Your Base Power'}
                              />

                              {/* Segment 2: Player Synergy (Naruto Baryon Golden-Amber Radiant Gradient) */}
                              {pSynPct > 0 && (
                                <div
                                  style={{ width: `${pSynPct}%` }}
                                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-200 border-s border-white/40 shadow-[0_0_12px_rgba(251,191,36,0.9)] transition-all duration-700"
                                  title={lang === 'ar' ? 'تناغم فريقك' : 'Your Synergy'}
                                />
                              )}

                              {/* Clash Spark Divider Where Both Scales Meet */}
                              <div
                                style={{
                                  insetInlineStart: `calc(${playerTotalPct}% - 2px)`,
                                }}
                                className="absolute inset-y-0 w-1 bg-white shadow-[0_0_12px_#ffffff,0_0_20px_#f97316,0_0_20px_#a855f7] z-30 animate-pulse"
                              />

                              {/* Segment 3: CPU Synergy (Sasuke Susanoo Electric Magenta-Lavender Gradient) */}
                              {cSynPct > 0 && (
                                <div
                                  style={{ width: `${cSynPct}%` }}
                                  className="h-full bg-gradient-to-r from-fuchsia-300 via-fuchsia-500 to-purple-500 border-e border-white/40 shadow-[0_0_12px_rgba(217,70,239,0.9)] transition-all duration-700"
                                  title={lang === 'ar' ? 'تناغم الخصم' : 'Rival Synergy'}
                                />
                              )}

                              {/* Segment 4: CPU Base Power (Sasuke Susanoo Deep Violet -> Dark Indigo) */}
                              <div
                                style={{ width: `${cBasePct}%` }}
                                className="h-full bg-gradient-to-r from-purple-600 via-indigo-700 to-violet-950 transition-all duration-700"
                                title={lang === 'ar' ? 'القوة العامة للخصم' : 'Rival Base Power'}
                              />
                            </div>
                          </div>

                          {/* Legend for the 2 sections on each side (No Numbers) */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[9px] sm:text-[10px] font-display font-bold text-slate-300">
                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-red-600 to-orange-500 border border-orange-300/50" />
                                <span>{lang === 'ar' ? 'القوة العامة' : 'Base Power'}</span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-amber-400 to-yellow-200 border border-yellow-100/70" />
                                <span className="text-amber-300">
                                  {lang === 'ar' ? 'قسم التناغم' : 'Synergy'}
                                </span>
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-fuchsia-300 to-purple-500 border border-fuchsia-200/70" />
                                <span className="text-fuchsia-300">
                                  {lang === 'ar' ? 'قسم التناغم' : 'Synergy'}
                                </span>
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-purple-600 to-indigo-900 border border-purple-400/50" />
                                <span>{lang === 'ar' ? 'القوة العامة' : 'Base Power'}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 5. Battle Narrative Summary + Action Buttons (Play Again -> Home Page -> View Battle Squads) */}
                    <div className="relative z-10 w-full space-y-2.5 shrink-0">
                      <div className="w-full max-w-lg mx-auto bg-slate-900/90 rounded-xl px-3 py-2 border border-purple-400/35 shadow-md">
                        <p className="text-[11px] sm:text-xs text-slate-100 leading-relaxed font-medium break-words">
                          {lang === 'ar'
                            ? battleReport.decisiveNarrativeAr
                            : battleReport.decisiveNarrativeEn}
                        </p>
                      </div>

                      <div className="w-full max-w-xs mx-auto flex flex-col gap-2">
                        {/* Play Again Button */}
                        <button
                          type="button"
                          onClick={startNewGame}
                          className="w-full h-11 rounded-2xl bg-gradient-to-r from-orange-500 via-red-600 to-purple-700 hover:from-orange-400 hover:via-red-500 hover:to-purple-600 text-white font-display font-extrabold text-sm sm:text-base border-2 border-amber-300/70 shadow-[0_0_25px_rgba(239,68,68,0.5)] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" />
                          <span>{lang === 'ar' ? 'العب مرة أخرى' : 'Play Again'}</span>
                        </button>

                        {/* Home Page Button (Directly under Play Again) */}
                        <button
                          type="button"
                          onClick={() => {
                            clearAllTimers();
                            soundEngine.playSelect();
                            setIsViewingBattleSquads(false);
                            setGameState('SPLASH_HOME');
                          }}
                          className="w-full h-10 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-amber-300 hover:text-amber-200 font-display font-extrabold text-xs sm:text-sm border border-amber-400/50 shadow-[0_0_18px_rgba(245,158,11,0.25)] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <Home className="w-4 h-4 text-amber-400" />
                          <span>{lang === 'ar' ? 'الصفحة الرئيسية' : 'Home Page'}</span>
                        </button>

                        {/* View Battle Squads Button */}
                        <button
                          type="button"
                          onClick={() => {
                            soundEngine.playSelect();
                            setIsViewingBattleSquads(true);
                          }}
                          className="w-full h-10 rounded-2xl bg-slate-900/95 hover:bg-slate-800 text-purple-200 hover:text-white font-display font-extrabold text-xs sm:text-sm border border-purple-400/50 shadow-[0_0_18px_rgba(168,85,247,0.3)] inline-flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-purple-300" />
                          <span>
                            {lang === 'ar'
                              ? 'رؤية تشكيلات المعركة'
                              : 'View Battle Squads'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* 6. MVP (MOST VALUABLE SHINOBI) SHOWCASE CARD BELOW THE BUTTONS */}
                    {battleReport.mvpFighter && (() => {
                      const mvp = battleReport.mvpFighter;
                      const mvpRawName = lang === 'ar' ? mvp.nameAr : mvp.nameEn;
                      const mvpRankTheme = getRankMetallicTheme(mvp.rankCode);
                      const isPlayerMvp = battleReport.overallWinner === 'PLAYER';

                      return (
                        <div className="relative z-10 w-full max-w-lg mx-auto pt-1 pb-3 shrink-0">
                          <div
                            className={`relative rounded-2xl overflow-hidden border-2 p-3 sm:p-4 flex items-center gap-3.5 text-start shadow-2xl ${
                              isPlayerMvp
                                ? 'bg-gradient-to-r from-slate-950 via-orange-950/60 to-amber-950/40 border-amber-400/80 shadow-[0_0_30px_rgba(249,115,22,0.4)]'
                                : 'bg-gradient-to-r from-slate-950 via-purple-950/60 to-fuchsia-950/40 border-purple-400/80 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                            }`}
                          >
                            {/* MVP Portrait */}
                            <div
                              className={`relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden border-2 shrink-0 ${
                                isPlayerMvp ? 'border-amber-300' : 'border-purple-300'
                              }`}
                            >
                              <img
                                src={mvp.portraitUrl}
                                alt={mvpRawName}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover object-top scale-105"
                              />
                              <span
                                className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono font-extrabold border z-10 ${mvpRankTheme.badgeBg}`}
                              >
                                {mvp.rankCode}
                              </span>
                            </div>

                            {/* MVP Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 text-slate-950 font-display font-black text-[10px] sm:text-xs shadow-[0_0_12px_rgba(251,191,36,0.7)]">
                                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                                <span>
                                  {lang === 'ar'
                                    ? 'نجم المعركة الأول · MVP'
                                    : 'BATTLE MVP · MOST VALUABLE SHINOBI'}
                                </span>
                              </div>

                              <h3 className="font-display font-black text-base sm:text-xl text-white truncate drop-shadow">
                                {mvpRawName}
                              </h3>

                              <p
                                className={`font-display font-bold text-[11px] sm:text-xs truncate ${
                                  isPlayerMvp ? 'text-amber-300' : 'text-purple-300'
                                }`}
                              >
                                {lang === 'ar' ? mvp.titleAr : mvp.specialtyEn}
                              </p>

                              <p className="text-[10px] sm:text-xs text-slate-300 line-clamp-1 font-medium">
                                <span className="text-slate-400">
                                  {lang === 'ar' ? 'التقنية الحاسمة: ' : 'Signature Jutsu: '}
                                </span>
                                <span className="text-white font-semibold">
                                  {lang === 'ar'
                                    ? mvp.signatureJutsuAr.split('·')[0].trim()
                                    : mvp.signatureJutsuEn}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
