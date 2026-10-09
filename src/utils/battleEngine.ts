import { ShinobiCharacter, RANK_ORDER, RankCode } from '../data/shinobiRoster';

export interface DuelOutcome {
  roundNumber: number;
  playerFighter: ShinobiCharacter;
  cpuFighter: ShinobiCharacter;
  winner: 'PLAYER' | 'CPU';
  reasonAr: string;
  reasonEn: string;
  dominantFactorAr: string;
  dominantFactorEn: string;
}

export interface SynergyBonus {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  impactGradeAr: string;
  internalBonusValue: number;
}

export interface DeterministicBattleCalculationResult {
  teamABaseTeamPower: number;
  teamASynergyBonus: number;
  teamAFinalTeamPower: number;
  teamBBaseTeamPower: number;
  teamBSynergyBonus: number;
  teamBFinalTeamPower: number;
  powerDifference: number;
  strongerTeamWinProbability: number;
  weakerTeamWinProbability: number;
  winningTeam: 'PLAYER' | 'CPU';
  losingTeam: 'PLAYER' | 'CPU';
}

export interface BattleReport {
  duels: DuelOutcome[];
  playerSynergies: SynergyBonus[];
  cpuSynergies: SynergyBonus[];
  playerOverallClassificationAr: string;
  playerOverallClassificationEn: string;
  cpuOverallClassificationAr: string;
  cpuOverallClassificationEn: string;
  overallWinner: 'PLAYER' | 'CPU';
  decisiveNarrativeAr: string;
  decisiveNarrativeEn: string;
  playerDuelsWon: number;
  cpuDuelsWon: number;
  mvpFighter: ShinobiCharacter;
  // Battle calculation fields returned to interface:
  teamABaseTeamPower: number;
  teamASynergyBonus: number;
  teamAFinalTeamPower: number;
  teamBBaseTeamPower: number;
  teamBSynergyBonus: number;
  teamBFinalTeamPower: number;
  powerDifference: number;
  strongerTeamWinProbability: number;
  weakerTeamWinProbability: number;
  winningTeam: 'PLAYER' | 'CPU';
  losingTeam: 'PLAYER' | 'CPU';
}

export const RIVAL_NAME_AR = 'الشينوبي المقنّع';
export const RIVAL_NAME_EN = 'The Masked Shinobi';

/**
 * Arranges any squad (3, 5, or 10 fighters) so the strongest/highest-classified fighter
 * is always in the exact center, with progressively lower-ranked fighters radiating outward!
 */
export function arrangeSquadCenterPeak(team: ShinobiCharacter[]): ShinobiCharacter[] {
  const n = team.length;
  if (n <= 1) return team;

  const sortedDesc = [...team].sort((a, b) => {
    const rankDiff = RANK_ORDER[b.rankCode] - RANK_ORDER[a.rankCode];
    if (rankDiff !== 0) return rankDiff;
    return b.hiddenCombatProfile.hiddenRate - a.hiddenCombatProfile.hiddenRate;
  });

  const result: ShinobiCharacter[] = new Array(n);
  const centerIdx = Math.floor((n - 1) / 2);
  result[centerIdx] = sortedDesc[0];

  let left = centerIdx - 1;
  let right = centerIdx + 1;
  let pickIdx = 1;

  while (pickIdx < n) {
    if (right < n) {
      result[right++] = sortedDesc[pickIdx++];
    }
    if (pickIdx < n && left >= 0) {
      result[left--] = sortedDesc[pickIdx++];
    }
  }

  return result;
}

export function getSquadCenterIndex(teamLength: number): number {
  return Math.floor((teamLength - 1) / 2);
}

function evaluateTeamSynergies(team: ShinobiCharacter[]): SynergyBonus[] {
  const bonuses: SynergyBonus[] = [];
  const tagsCount: Record<string, number> = {};

  team.forEach((member) => {
    member.hiddenCombatProfile.synergyTags.forEach((tag) => {
      tagsCount[tag] = (tagsCount[tag] || 0) + 1;
    });
  });

  if ((tagsCount['UCHIHA'] || 0) >= 2) {
    bonuses.push({
      titleAr: 'تآزر عشيرة الأوتشيها',
      titleEn: 'Uchiha Clan Visual Synergy',
      descriptionAr: 'تكامل بصري مزدوج بالشارينغان يرفع دقة الهجمات المضادة.',
      descriptionEn: 'Dual Sharingan visual link boosts counter-attack precision.',
      impactGradeAr: 'تأثير تكتيكي: S',
      internalBonusValue: 18,
    });
  }

  if ((tagsCount['AKATSUKI'] || 0) >= 2) {
    bonuses.push({
      titleAr: 'ثنائي الأكاتسوكي المرعب',
      titleEn: 'Akatsuki Dread Duo',
      descriptionAr: 'تنسيق هجومي غير تقليدي يضغط على دفاعات الخصم.',
      descriptionEn: 'Relentless offensive coordination overwhelms enemy defenses.',
      impactGradeAr: 'تأثير تكتيكي: S',
      internalBonusValue: 16,
    });
  }

  if ((tagsCount['KAGE'] || 0) >= 2) {
    bonuses.push({
      titleAr: 'مجلس الكاجي الأعلى',
      titleEn: 'Supreme Kage Council',
      descriptionAr: 'قيادة ميدانية أسطورية تمنح الفريق ثباتاً استراتيجياً.',
      descriptionEn: 'Legendary battlefield command grants unmatched strategic poise.',
      impactGradeAr: 'تأثير تكتيكي: S+',
      internalBonusValue: 22,
    });
  }

  if ((tagsCount['TEAM7'] || 0) >= 2) {
    bonuses.push({
      titleAr: 'رابطة الفريق السابع',
      titleEn: 'Team 7 Unbreakable Bond',
      descriptionAr: 'تناغم فطري في الخطوط الأمامية وتغطية متبادلة.',
      descriptionEn: 'Instinctive frontline teamwork and mutual cover.',
      impactGradeAr: 'تأثير تكتيكي: A+',
      internalBonusValue: 15,
    });
  }

  if ((tagsCount['SAGE'] || 0) >= 2) {
    bonuses.push({
      titleAr: 'تناغم طاقة الطبيعة (الحكيم)',
      titleEn: 'Senjutsu Nature Harmony',
      descriptionAr: 'استشعار ميداني شامل ومضاعفة قوة الضربات الحاسمة.',
      descriptionEn: 'Omnidirectional sensory awareness and amplified finisher strikes.',
      impactGradeAr: 'تأثير تكتيكي: S',
      internalBonusValue: 17,
    });
  }

  if ((tagsCount['KONOHA'] || 0) >= 4) {
    bonuses.push({
      titleAr: 'إرادة النار المتقدة (كونوها)',
      titleEn: 'Will of Fire (Konoha)',
      descriptionAr: 'تكاتف شينوبي الورقة المخفية في اللحظات الحاسمة.',
      descriptionEn: 'Hidden Leaf comrades stand united in critical moments.',
      impactGradeAr: 'تأثير تكتيكي: A',
      internalBonusValue: 14,
    });
  }

  return bonuses;
}

function getTeamOverallRankClassificationAr(avgHiddenScore: number): string {
  if (avgHiddenScore >= 164) return 'تصنيف القوة الإجمالي: SSS · جيش أسطوري لا يُقهر';
  if (avgHiddenScore >= 138) return 'تصنيف القوة الإجمالي: SS · نخبة مستوى الكاجي';
  if (avgHiddenScore >= 112) return 'تصنيف القوة الإجمالي: S · فرقة شينوبي ضاربة';
  if (avgHiddenScore >= 88) return 'تصنيف القوة الإجمالي: A · تشكيلة جونين متمرسة';
  return 'تصنيف القوة الإجمالي: B · تشكيلة قتالية متوسطة';
}

function getTeamOverallRankClassificationEn(avgHiddenScore: number): string {
  if (avgHiddenScore >= 164) return 'Team Rank: SSS · Invincible Mythic Squad';
  if (avgHiddenScore >= 138) return 'Team Rank: SS · Supreme Kage Elite';
  if (avgHiddenScore >= 112) return 'Team Rank: S · Legendary Strike Force';
  if (avgHiddenScore >= 88) return 'Team Rank: A · Veteran Jonin Lineup';
  return 'Team Rank: B · Balanced Tactical Squad';
}

function buildCreativeAnimeSummary(
  overallWinner: 'PLAYER' | 'CPU',
  playerTeam: ShinobiCharacter[],
  cpuTeam: ShinobiCharacter[],
  playerDuelsWon: number,
  cpuDuelsWon: number
): { ar: string; en: string } {
  const totalDuels = Math.max(1, playerTeam.length);
  const dominantThreshold = Math.ceil(totalDuels * 0.75);

  const playerSorted = [...playerTeam].sort(
    (a, b) => b.hiddenCombatProfile.hiddenRate - a.hiddenCombatProfile.hiddenRate
  );
  const cpuSorted = [...cpuTeam].sort(
    (a, b) => b.hiddenCombatProfile.hiddenRate - a.hiddenCombatProfile.hiddenRate
  );

  const pAce = playerSorted[0];
  const pSecond = playerSorted[1] || playerSorted[0];
  const cAce = cpuSorted[0];
  const cSecond = cpuSorted[1] || cpuSorted[0];

  if (overallWinner === 'PLAYER') {
    if (playerDuelsWon >= dominantThreshold) {
      return {
        ar: `في ملحمة شينوبي خاطفة، قاد ${pAce.nameAr} و${pSecond.nameAr} هجوماً كاسحاً اخترق دفاعات ${RIVAL_NAME_AR} منذ اللحظة الأولى، وأطلق ${pAce.nameAr} تقنية (${pAce.signatureJutsuAr.split('·')[0].trim()}) ليحسم المعركة بانتصار ساحق لفريقك رغم محاولات ${cAce.nameAr} الصمود!`,
        en: `In a lightning-fast shinobi blitz, ${pAce.nameEn} and ${pSecond.nameEn} shattered ${RIVAL_NAME_EN}'s defenses from the opening clash! ${pAce.nameEn} unleashed (${pAce.signatureJutsuEn}) to seal a dominant victory despite ${cAce.nameEn}'s fierce resistance!`,
      };
    }
    return {
      ar: `بعد اشتباك عنيف اهتزت له ساحة النينجا بين ${pAce.nameAr} و${cAce.nameAr}، نجح تكتيك ${pSecond.nameAr} في كسر توازن فرقة ${RIVAL_NAME_AR} في اللحظة الحاسمة، ليوجه ${pAce.nameAr} الضربة القاضية بتقنية (${pAce.signatureJutsuAr.split('·')[0].trim()}) ويمنح فريقك فوزاً أسطورياً!`,
      en: `After an earth-shaking clash between ${pAce.nameEn} and ${cAce.nameEn}, ${pSecond.nameEn}'s tactical opening broke ${RIVAL_NAME_EN}'s formation—allowing ${pAce.nameEn} to land the decisive blow with (${pAce.signatureJutsuEn}) for a legendary win!`,
    };
  } else {
    if (cpuDuelsWon >= dominantThreshold) {
      return {
        ar: `فرضت فرقة ${RIVAL_NAME_AR} سيطرتها المبكرة بقيادة ${cAce.nameAr} و${cSecond.nameAr}؛ ورغم قتال ${pAce.nameAr} الشجاع لرد الهجوم، حسم ${cAce.nameAr} المواجهة بتقنية (${cAce.signatureJutsuAr.split('·')[0].trim()}) التي قلبت موازين الميدان بالكامل!`,
        en: `${RIVAL_NAME_EN}'s squad seized early control led by ${cAce.nameEn} and ${cSecond.nameEn}. Despite ${pAce.nameEn}'s heroic stand, ${cAce.nameEn} overwhelmed the arena with (${cAce.signatureJutsuEn}) to claim victory!`,
      };
    }
    return {
      ar: `دارت معركة متقاربة الأنفاس تألق فيها ${pAce.nameAr} و${pSecond.nameAr} من فريقك، لكن ${RIVAL_NAME_AR} استغل تناغم ${cAce.nameAr} و${cSecond.nameAr} في اللحظات الأخيرة ليخطف الفوز بعد صدام ناري بتقنية (${cAce.signatureJutsuAr.split('·')[0].trim()})!`,
      en: `In a razor-close shinobi war where ${pAce.nameEn} and ${pSecond.nameEn} fought brilliantly, ${RIVAL_NAME_EN} capitalized on the deadly synergy of ${cAce.nameEn} and ${cSecond.nameEn}—sealing the final clash with (${cAce.signatureJutsuEn})!`,
    };
  }
}

const TEAM_POWER_COEFFICIENTS = [
  1.0, // P1
  0.8, // P2
  0.7, // P3
  0.6, // P4
  0.5, // P5
  0.4, // P6
  0.3, // P7
  0.2, // P8
  0.15, // P9
  0.1, // P10
];

function getSafeCharacterPower(ch: ShinobiCharacter | undefined | null): number {
  if (!ch) return 0;
  if (typeof ch.power === 'number' && Number.isFinite(ch.power) && ch.power >= 0) {
    return ch.power;
  }
  const fallbackRate = ch.hiddenCombatProfile?.hiddenRate;
  if (typeof fallbackRate === 'number' && Number.isFinite(fallbackRate) && fallbackRate >= 0) {
    return Number((30 + (fallbackRate / 214) * 70).toFixed(2));
  }
  return 0;
}

/**
 * 3. BASE TEAM POWER
 * Sort each team's character Power values in descending order:
 * P1 >= P2 >= P3 >= ... >= P10
 * BaseTeamPower = P1*1.00 + P2*0.80 + P3*0.70 + P4*0.60 + P5*0.50 + P6*0.40 + P7*0.30 + P8*0.20 + P9*0.15 + P10*0.10
 * Only include the coefficients corresponding to the actual number of characters on the team.
 */
export function calculateBaseTeamPower(team: ShinobiCharacter[]): number {
  if (!Array.isArray(team) || team.length === 0) return 0;

  // Never modify the original character database values
  const sortedPowersDesc = team
    .map((ch) => getSafeCharacterPower(ch))
    .sort((a, b) => b - a);

  let basePower = 0;
  for (let i = 0; i < sortedPowersDesc.length; i++) {
    const coeff =
      i < TEAM_POWER_COEFFICIENTS.length
        ? TEAM_POWER_COEFFICIENTS[i]
        : TEAM_POWER_COEFFICIENTS[TEAM_POWER_COEFFICIENTS.length - 1];
    basePower += sortedPowersDesc[i] * coeff;
  }

  return Number(basePower.toFixed(2));
}

/**
 * 4. TEAM SYNERGY
 * AlignmentRatio = highest count of the same alignment / team size
 * VillageRatio = highest count of the same village / team size
 * GroupRatio = highest count of the same group / team size
 * SynergyScore = (AlignmentRatio * 0.30) + (VillageRatio * 0.30) + (GroupRatio * 0.40)
 * SynergyBonus = SynergyScore * 0.10 (max 10% = 0.10)
 */
export function calculateTeamSynergyBonus(team: ShinobiCharacter[]): {
  alignmentRatio: number;
  villageRatio: number;
  groupRatio: number;
  synergyScore: number;
  synergyBonus: number;
} {
  const n = Array.isArray(team) ? team.length : 0;
  if (n === 0) {
    return {
      alignmentRatio: 0,
      villageRatio: 0,
      groupRatio: 0,
      synergyScore: 0,
      synergyBonus: 0,
    };
  }

  const alignmentCounts: Record<string, number> = {};
  const villageCounts: Record<string, number> = {};
  const groupCounts: Record<string, number> = {};

  for (const ch of team) {
    if (!ch) continue;
    const align = ch.alignment || 'Good';
    alignmentCounts[align] = (alignmentCounts[align] || 0) + 1;

    const vil = ch.village || ch.villageAr || 'Unknown';
    villageCounts[vil] = (villageCounts[vil] || 0) + 1;

    // A character may belong to multiple groups; count each distinct group once per character
    const charGroups =
      Array.isArray(ch.groups) && ch.groups.length > 0
        ? Array.from(new Set(ch.groups))
        : ch.group
        ? [ch.group]
        : [];
    for (const g of charGroups) {
      if (g) {
        groupCounts[g] = (groupCounts[g] || 0) + 1;
      }
    }
  }

  const maxAlignmentCount = Math.max(0, ...Object.values(alignmentCounts));
  const maxVillageCount = Math.max(0, ...Object.values(villageCounts));
  const maxGroupCount = Math.max(0, ...Object.values(groupCounts));

  const alignmentRatio = Math.min(1, maxAlignmentCount / n);
  const villageRatio = Math.min(1, maxVillageCount / n);
  const groupRatio = Math.min(1, maxGroupCount / n);

  const synergyScore =
    alignmentRatio * 0.3 + villageRatio * 0.3 + groupRatio * 0.4;
  const synergyBonus = Math.min(0.1, Math.max(0, synergyScore * 0.1));

  return {
    alignmentRatio,
    villageRatio,
    groupRatio,
    synergyScore,
    synergyBonus,
  };
}

/**
 * 5, 6, 7. DETERMINISTIC BATTLE CALCULATION WITH CONTROLLED RANDOMNESS
 */
export function calculateDeterministicBattleOutcome(
  teamA: ShinobiCharacter[],
  teamB: ShinobiCharacter[]
): DeterministicBattleCalculationResult {
  const validTeamA = Array.isArray(teamA) ? teamA.filter(Boolean) : [];
  const validTeamB = Array.isArray(teamB) ? teamB.filter(Boolean) : [];

  const teamABaseTeamPower = calculateBaseTeamPower(validTeamA);
  const teamASynergy = calculateTeamSynergyBonus(validTeamA);
  const teamASynergyBonus = Number(teamASynergy.synergyBonus.toFixed(4));
  const teamAFinalTeamPower = Number(
    (teamABaseTeamPower * (1 + teamASynergyBonus)).toFixed(2)
  );

  const teamBBaseTeamPower = calculateBaseTeamPower(validTeamB);
  const teamBSynergy = calculateTeamSynergyBonus(validTeamB);
  const teamBSynergyBonus = Number(teamBSynergy.synergyBonus.toFixed(4));
  const teamBFinalTeamPower = Number(
    (teamBBaseTeamPower * (1 + teamBSynergyBonus)).toFixed(2)
  );

  const powerDifference = Number(
    Math.abs(teamAFinalTeamPower - teamBFinalTeamPower).toFixed(2)
  );

  // If both teams have exactly equal FinalTeamPower, randomly select the winner with a 50% probability
  if (teamAFinalTeamPower === teamBFinalTeamPower) {
    const roll = Math.random() * 100;
    const winningTeam: 'PLAYER' | 'CPU' = roll < 50 ? 'PLAYER' : 'CPU';
    const losingTeam: 'PLAYER' | 'CPU' = winningTeam === 'PLAYER' ? 'CPU' : 'PLAYER';
    return {
      teamABaseTeamPower,
      teamASynergyBonus,
      teamAFinalTeamPower,
      teamBBaseTeamPower,
      teamBSynergyBonus,
      teamBFinalTeamPower,
      powerDifference: 0,
      strongerTeamWinProbability: 50,
      weakerTeamWinProbability: 50,
      winningTeam,
      losingTeam,
    };
  }

  const strongerSide: 'PLAYER' | 'CPU' =
    teamAFinalTeamPower > teamBFinalTeamPower ? 'PLAYER' : 'CPU';
  const weakerSide: 'PLAYER' | 'CPU' = strongerSide === 'PLAYER' ? 'CPU' : 'PLAYER';

  let strongerTeamWinProbability = 60;
  let weakerTeamWinProbability = 40;

  if (powerDifference < 5) {
    strongerTeamWinProbability = 60;
    weakerTeamWinProbability = 40;
  } else if (powerDifference >= 5 && powerDifference < 10) {
    strongerTeamWinProbability = 75;
    weakerTeamWinProbability = 25;
  } else if (powerDifference >= 10 && powerDifference < 15) {
    strongerTeamWinProbability = 85;
    weakerTeamWinProbability = 15;
  } else if (powerDifference >= 15 && powerDifference < 20) {
    strongerTeamWinProbability = 95;
    weakerTeamWinProbability = 5;
  } else {
    // PowerDifference >= 20: Stronger team wins with 100% probability without randomness
    strongerTeamWinProbability = 100;
    weakerTeamWinProbability = 0;
  }

  let winningTeam: 'PLAYER' | 'CPU';
  if (powerDifference >= 20) {
    winningTeam = strongerSide;
  } else {
    const randomNum = Math.random() * 100;
    winningTeam = randomNum < strongerTeamWinProbability ? strongerSide : weakerSide;
  }

  const losingTeam: 'PLAYER' | 'CPU' = winningTeam === 'PLAYER' ? 'CPU' : 'PLAYER';

  return {
    teamABaseTeamPower,
    teamASynergyBonus,
    teamAFinalTeamPower,
    teamBBaseTeamPower,
    teamBSynergyBonus,
    teamBFinalTeamPower,
    powerDifference,
    strongerTeamWinProbability,
    weakerTeamWinProbability,
    winningTeam,
    losingTeam,
  };
}

export function resolveShinobiBattle(
  playerTeam: ShinobiCharacter[],
  cpuTeam: ShinobiCharacter[]
): BattleReport {
  const duels: DuelOutcome[] = [];
  let playerDuelsWon = 0;
  let cpuDuelsWon = 0;
  const teamSize = Math.min(playerTeam.length, cpuTeam.length);

  for (let i = 0; i < teamSize; i++) {
    const pChar = playerTeam[i];
    const cChar = cpuTeam[i];

    const pPower = getSafeCharacterPower(pChar);
    const cPower = getSafeCharacterPower(cChar);

    let winner: 'PLAYER' | 'CPU' = 'PLAYER';
    let reasonAr = '';
    let reasonEn = '';
    let dominantFactorAr = '';
    let dominantFactorEn = '';

    if (pPower >= cPower) {
      winner = 'PLAYER';
      playerDuelsWon++;
      if (RANK_ORDER[pChar.rankCode] > RANK_ORDER[cChar.rankCode]) {
        dominantFactorAr = `تفوق الرتبة (${pChar.rankCode} مقابل ${cChar.rankCode})`;
        dominantFactorEn = `Rank Advantage (${pChar.rankCode} vs ${cChar.rankCode})`;
        reasonAr = `هيمن ${pChar.nameAr} (${pChar.rankCode}) على النزال وتفوق على ${cChar.nameAr} (${cChar.rankCode}) بتقنية (${pChar.signatureJutsuAr}).`;
        reasonEn = `${pChar.nameEn} (${pChar.rankCode}) dominated ${cChar.nameEn} (${cChar.rankCode}) using ${pChar.signatureJutsuEn}.`;
      } else {
        dominantFactorAr = `تفوق القوة الكامنة في رتبة ${pChar.rankCode}`;
        dominantFactorEn = `Superior Mastery in Rank ${pChar.rankCode}`;
        reasonAr = `حسم ${pChar.nameAr} المواجهة أمام ${cChar.nameAr} بفضل تفوقه القتالي في ${pChar.specialtyAr}.`;
        reasonEn = `${pChar.nameEn} prevailed over ${cChar.nameEn} through superior combat prowess.`;
      }
    } else {
      winner = 'CPU';
      cpuDuelsWon++;
      if (RANK_ORDER[cChar.rankCode] > RANK_ORDER[pChar.rankCode]) {
        dominantFactorAr = `تفوق الرتبة (${cChar.rankCode} مقابل ${pChar.rankCode})`;
        dominantFactorEn = `Rank Advantage (${cChar.rankCode} vs ${pChar.rankCode})`;
        reasonAr = `فرض ${cChar.nameAr} (${cChar.rankCode}) سيطرته أمام ${pChar.nameAr} (${pChar.rankCode}) مستخدماً (${cChar.signatureJutsuAr}).`;
        reasonEn = `${cChar.nameEn} (${cChar.rankCode}) overwhelmed ${pChar.nameEn} (${pChar.rankCode}) with ${cChar.signatureJutsuEn}.`;
      } else {
        dominantFactorAr = `تفوق القوة الكامنة في رتبة ${cChar.rankCode}`;
        dominantFactorEn = `Superior Mastery in Rank ${cChar.rankCode}`;
        reasonAr = `تفوق ${cChar.nameAr} في الاشتباك المباشر ضد ${pChar.nameAr} بفضل خبرته في ${cChar.specialtyAr}.`;
        reasonEn = `${cChar.nameEn} edged out ${pChar.nameEn} in direct combat.`;
      }
    }

    duels.push({
      roundNumber: i + 1,
      playerFighter: pChar,
      cpuFighter: cChar,
      winner,
      reasonAr,
      reasonEn,
      dominantFactorAr,
      dominantFactorEn,
    });
  }

  const playerSynergies = evaluateTeamSynergies(playerTeam);
  const cpuSynergies = evaluateTeamSynergies(cpuTeam);

  // Calculate winner using the deterministic battle calculation system with controlled randomness
  const calcResult = calculateDeterministicBattleOutcome(playerTeam, cpuTeam);
  const overallWinner: 'PLAYER' | 'CPU' = calcResult.winningTeam;

  const narrative = buildCreativeAnimeSummary(
    overallWinner,
    playerTeam,
    cpuTeam,
    playerDuelsWon,
    cpuDuelsWon
  );

  const playerHiddenSum = playerTeam.reduce(
    (sum, ch) => sum + ch.hiddenCombatProfile.hiddenRate,
    0
  );
  const cpuHiddenSum = cpuTeam.reduce(
    (sum, ch) => sum + ch.hiddenCombatProfile.hiddenRate,
    0
  );
  const avgPlayerScore = playerHiddenSum / Math.max(1, teamSize);
  const avgCpuScore = cpuHiddenSum / Math.max(1, teamSize);

  const winningTeamSquad = overallWinner === 'PLAYER' ? playerTeam : cpuTeam;
  const mvpFighter =
    [...winningTeamSquad].sort(
      (a, b) => getSafeCharacterPower(b) - getSafeCharacterPower(a)
    )[0] || playerTeam[0];

  return {
    duels,
    playerSynergies,
    cpuSynergies,
    playerOverallClassificationAr: getTeamOverallRankClassificationAr(avgPlayerScore),
    playerOverallClassificationEn: getTeamOverallRankClassificationEn(avgPlayerScore),
    cpuOverallClassificationAr: getTeamOverallRankClassificationAr(avgCpuScore),
    cpuOverallClassificationEn: getTeamOverallRankClassificationEn(avgCpuScore),
    overallWinner,
    decisiveNarrativeAr: narrative.ar,
    decisiveNarrativeEn: narrative.en,
    playerDuelsWon,
    cpuDuelsWon,
    mvpFighter,
    teamABaseTeamPower: calcResult.teamABaseTeamPower,
    teamASynergyBonus: calcResult.teamASynergyBonus,
    teamAFinalTeamPower: calcResult.teamAFinalTeamPower,
    teamBBaseTeamPower: calcResult.teamBBaseTeamPower,
    teamBSynergyBonus: calcResult.teamBSynergyBonus,
    teamBFinalTeamPower: calcResult.teamBFinalTeamPower,
    powerDifference: calcResult.powerDifference,
    strongerTeamWinProbability: calcResult.strongerTeamWinProbability,
    weakerTeamWinProbability: calcResult.weakerTeamWinProbability,
    winningTeam: calcResult.winningTeam,
    losingTeam: calcResult.losingTeam,
  };
}

export function decideCpuChoice(revealed: ShinobiCharacter): {
  choice: 'REVEALED' | 'HIDDEN';
} {
  const rank: RankCode = revealed.rankCode;

  if (rank === 'SSS' || rank === 'SS') {
    return { choice: 'REVEALED' };
  }

  if (rank === 'S') {
    return { choice: Math.random() < 0.82 ? 'REVEALED' : 'HIDDEN' };
  }

  if (rank === 'A') {
    return { choice: Math.random() < 0.52 ? 'REVEALED' : 'HIDDEN' };
  }

  return { choice: 'HIDDEN' };
}

/**
 * Mode 3 (Shinobi Auction) CPU Bidding AI
 * Note: Passing is forbidden on the very first bid (when currentBid === 0)!
 */
export function decideCpuAuctionAction(
  card: ShinobiCharacter,
  currentBid: number,
  cpuCoins: number,
  roundsLeft: number
): { action: 'BID'; increment: 1 | 5 | 10 } | { action: 'PASS' } {
  // Cannot pass on opening bid (currentBid === 0) if CPU has at least 1 coin
  if (currentBid === 0 && cpuCoins >= 1) {
    if ((card.rankCode === 'SSS' || card.rankCode === 'SS') && cpuCoins >= 5) {
      return { action: 'BID', increment: 5 };
    }
    return { action: 'BID', increment: 1 };
  }

  if (cpuCoins <= currentBid) {
    return { action: 'PASS' };
  }

  // Max value CPU is willing to pay for this card
  const baseValuation: Record<RankCode, number> = {
    SSS: 55,
    SS: 42,
    S: 30,
    A: 19,
    B: 10,
    C: 4,
  };

  // Reserve a bit of coins for remaining rounds unless it's SSS/SS
  const reserveNeeded = Math.max(0, (roundsLeft - 1) * 5);
  const maxAffordable = Math.max(0, cpuCoins - (card.rankCode === 'SSS' ? 0 : reserveNeeded));
  const maxWilling = Math.min(cpuCoins, Math.round(baseValuation[card.rankCode] * (0.85 + Math.random() * 0.3)));

  if (currentBid >= maxWilling || currentBid >= maxAffordable) {
    return { action: 'PASS' };
  }

  const gap = Math.min(maxWilling, maxAffordable) - currentBid;
  if (gap >= 12 && currentBid + 10 <= cpuCoins && (card.rankCode === 'SSS' || card.rankCode === 'SS')) {
    return { action: 'BID', increment: 10 };
  }
  if (gap >= 5 && currentBid + 5 <= cpuCoins) {
    return { action: 'BID', increment: 5 };
  }
  if (currentBid + 1 <= cpuCoins) {
    return { action: 'BID', increment: 1 };
  }
  return { action: 'PASS' };
}
