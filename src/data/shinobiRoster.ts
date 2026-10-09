export type RankCode = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C';
export type StatGrade = 'S+' | 'S' | 'A' | 'B' | 'C';
export type Language = 'ar' | 'en';
export type AlignmentType = 'Good' | 'Evil';

export interface ShinobiCharacter {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  villageAr: string;
  villageEn: string;
  // Battle calculation fields:
  power: number;
  alignment: AlignmentType;
  village: string;
  group: string;
  groups: string[];
  rankCode: RankCode;
  rankLabelAr: string;
  rankLabelEn: string;
  specialtyAr: string;
  specialtyEn: string;
  signatureJutsuAr: string;
  signatureJutsuEn: string;
  chakraNatureAr: string;
  classifications: {
    ninjutsu: StatGrade;
    taijutsu: StatGrade;
    genjutsu: StatGrade;
    intelligence: StatGrade;
    chakra: StatGrade;
  };
  // Strictly unique hidden power rate (15 to 214) across all 200 Shinobi & forms — NEVER displayed in UI
  hiddenCombatProfile: {
    hiddenRate: number;
    tacticalMastery: number;
    synergyTags: string[];
  };
  motifColor: string;
  emblemType: 'konoha' | 'uchiha' | 'akatsuki' | 'suna' | 'sage' | 'lightning' | 'mist';
  portraitUrl: string;
}

export const RANK_ORDER: Record<RankCode, number> = {
  SSS: 6,
  SS: 5,
  S: 4,
  A: 3,
  B: 2,
  C: 1,
};

export const RANK_RARITY_WEIGHTS: Record<RankCode, number> = {
  SSS: 4,
  SS: 8,
  S: 14,
  A: 24,
  B: 28,
  C: 22,
};

type CompactEntry = [
  string, // id
  string, // nameAr
  string, // villageAr
  RankCode, // rankCode
  string, // signatureJutsuAr
  string, // specialtyAr
  [StatGrade, StatGrade, StatGrade, StatGrade, StatGrade],
  number, // unique hiddenRate (15..214)
  number, // tacticalMastery
  string[], // synergyTags
  string, // motifColor
  ShinobiCharacter['emblemType']
];

const RANK_LABELS_AR: Record<RankCode, string> = {
  SSS: 'رتبة SSS · أسطورة خالدة نادرة جداً',
  SS: 'رتبة SS · مستوى كاجي خارق',
  S: 'رتبة S · شينوبي أسطوري',
  A: 'رتبة A · نخبة الجونين',
  B: 'رتبة B · شينوبي متمرس',
  C: 'رتبة C · شينوبي مبتدئ',
};

const RANK_LABELS_EN: Record<RankCode, string> = {
  SSS: 'Rank SSS · Mythic Legend',
  SS: 'Rank SS · Supreme Kage Level',
  S: 'Rank S · Legendary Shinobi',
  A: 'Rank A · Elite Jonin',
  B: 'Rank B · Seasoned Shinobi',
  C: 'Rank C · Novice Ninja',
};

const VILLAGE_EN_MAP: Record<string, string> = {
  'قرية كونوها': 'Hidden Leaf Village',
  'مؤسس كونوها': 'Konoha Founder',
  'عشيرة الأوتسوتسوكي': 'Otsutsuki Clan',
  'الأكاتسوكي / كونوها': 'Akatsuki / Konoha',
  'الأكاتسوكي / المطر': 'Akatsuki / Hidden Rain',
  'الأكاتسوكي': 'Akatsuki Organization',
  'الأكاتسوكي / الضباب': 'Akatsuki / Hidden Mist',
  'الأكاتسوكي / الرمل': 'Akatsuki / Hidden Sand',
  'الأكاتسوكي / الصخر': 'Akatsuki / Hidden Stone',
  'الأكاتسوكي / الشلال': 'Akatsuki / Waterfall',
  'الأكاتسوكي / الينابيع': 'Akatsuki / Hot Water',
  'قرية الصوت': 'Hidden Sound Village',
  'قرية الصخر': 'Hidden Stone Village',
  'قرية الضباب': 'Hidden Mist Village',
  'قرية السحاب': 'Hidden Cloud Village',
  'قرية الرمل': 'Hidden Sand Village',
  'قرية المطر': 'Hidden Rain Village',
  'قرية الشلال': 'Hidden Waterfall',
  'فريق تاكا': 'Team Taka',
  'فريق تاكا / الضباب': 'Team Taka / Mist',
  'فريق هيبي': 'Team Hebi',
  'السانين': 'Legendary Sannin',
  'السانين / الصوت': 'Sannin / Sound',
  'جذور كونوها': 'Konoha Root ANBU',
  'أنبو الجذور': 'Root ANBU',
  'أنبو الجذور / كونوها': 'Root ANBU / Konoha',
  'أنبو كونوها': 'Konoha ANBU Black Ops',
  'حرس الهوكاجي': 'Hokage Guard Platoon',
  'استجواب كونوها': 'Konoha Interrogation Force',
  'بوابة كونوها': 'Konoha Gate Defense',
  'بلاد الحديد': 'Land of Iron Samurai',
  'بلاد النار': 'Land of Fire Temple',
  'بلاد الأمواج': 'Land of Waves',
  'تجارب أوروتشيمارو': 'Orochimaru Lab',
};

const EN_NAME_JUTSU_MAP: Record<string, [string, string]> = {
  naruto_baryon_mode: ['Naruto (Baryon Mode)', 'Baryon Nuclear Chakra Fusion'],
  isshiki_otsutsuki: ['Isshiki Otsutsuki', 'Sukunahikona & Daikokuten'],
  hagoromo_otsutsuki: ['Sage of Six Paths (Hagoromo)', 'Creation of All Things'],
  kaguya_otsutsuki: ['Kaguya Otsutsuki', 'Expansive Truth-Seeking Ball'],
  madara_rikudo: ['Madara (Six Paths)', 'Infinite Tsukuyomi & Limbo Hengoku'],
  naruto_six_paths: ['Naruto (Six Paths Sage)', 'Six Paths Ultra-Big Ball Rasenshuriken'],
  sasuke_rinnegan: ['Sasuke (Rinnegan & Susanoo)', 'Indra’s Arrow & Amenotejikara'],
  kakashi_dms: ['Kakashi (Double Mangekyo)', 'Kamui Complete Susanoo & Raikiri'],
  momoshiki_fused: ['Fused Momoshiki', 'Takamimusubinokami Chakra Reflection'],
  hashirama_sage_mode: ['Hashirama (Sage Mode)', 'Sage Art: True Several Thousand Hands'],
  might_guy_eight_gates: ['Might Guy (8th Gate of Death)', 'Night Guy Crimson Dragon'],
  obito_juubi: ['Obito (Ten-Tails Jinchuriki)', 'Sword of Nunoboko & Truth-Seeking Orbs'],
  hamura_otsutsuki: ['Hamura Otsutsuki', 'Golden Tenseigan Moon Splitter'],
  indra_otsutsuki: ['Indra Otsutsuki', 'Origin Complete Susanoo & Hinokagutsuchi'],
  ashura_otsutsuki: ['Ashura Otsutsuki', 'Six Paths Kunitsukami Avatar'],
  madara_edo_tensei: ['Madara (Edo Tensei)', 'Tengai Shinsei Twin Meteor & Wood Style'],
  naruto_hokage_seventh: ['Naruto (Seventh Hokage)', 'Full Kurama Sage Mode & Rasenshuriken'],
  sasuke_adult_shadow: ['Sasuke (Shadow Hokage)', 'Space-Time Portal & Onyx Chidori'],
  minato_kcm: ['Minato (Kurama Chakra Mode)', 'Kurama Flying Raijin & Twin Rasengan'],
  hashirama_base: ['Hashirama Senju (1st Hokage)', 'Deep Forest Emergence & Wood Dragon'],
  madara_ems_valley: ['Madara (Final Valley EMS)', 'Majestic Attire: Susanoo Kurama'],
  naruto_kcm2_sage: ['Naruto (Bijuu Sage Mode)', 'Senjutsu Tailed Beast Bomb'],
  nagato_edo_prime: ['Nagato (Full Rinnegan)', 'Six Paths Unified & Chibaku Tensei'],
  itachi_edo_tensei: ['Itachi (Edo Tensei)', 'Izanami, Amaterasu & Totsuka Blade'],
  minato_hokage: ['Minato Namikaze (4th Hokage)', 'Flying Raijin Level 2 & Reaper Death Seal'],
  tobirama_senju: ['Tobirama Senju (2nd Hokage)', 'Flying Raijin Slash & Tandem Paper Bombs'],
  obito_white_mask: ['Obito (White Mask Rinnegan)', 'Gedo Mazo & Six Jinchuriki Paths'],
  pain_six_paths: ['Pain (Six Paths)', 'Chaotic Shinra Tensei & Chibaku Tensei'],
  kabuto_dragon_sage: ['Kabuto (Dragon Sage Mode)', 'Sage Art: White Extreme Attack & Edo Tensei'],
  sasuke_ems: ['Sasuke (Eternal Mangekyo)', 'Enton: Susanoo Kagutsuchi'],
  naruto_kcm1: ['Naruto (Nine-Tails Chakra Mode)', 'Planetary Rasengan Barrage'],
  itachi_uchiha: ['Itachi Uchiha (Akatsuki)', 'Tsukuyomi, Amaterasu & Yata Mirror'],
  toneri_tenseigan: ['Toneri (Tenseigan Chakra Mode)', 'Golden Wheel Reincarnation Explosion'],
  kinshiki_otsutsuki: ['Kinshiki Otsutsuki', 'Glowing Red Chakra Weapon Arsenal'],
  urashiki_otsutsuki: ['Urashiki Otsutsuki', 'Blue Rinnegan Temporal Rewind'],
  shisui_uchiha: ['Shisui Uchiha (Kotoamatsukami)', 'Kotoamatsukami & Emerald Susanoo'],
  third_raikage: ['Third Raikage (A)', 'One-Finger Hell Stab (Jigokuzuki)'],
  killer_bee_hachibi: ['Killer Bee (Full Gyuki Form)', 'Eight-Tails Bijuu Bomb & Twister'],
  mu_tsuchikage: ['Mu (Second Tsuchikage)', 'Particle Style: Atomic Dismantling'],
  onoki_tsuchikage: ['Onoki (Third Tsuchikage)', 'Particle Style: Detachment of the Primitive World'],
  gengetsu_mizukage: ['Gengetsu (Second Mizukage)', 'Steaming Danger Tyranny (Jokey Boy)'],
  hiruzen_prime: ['Hiruzen Sarutobi (The Professor)', 'Five Elemental Combo & Adamantine Staff Enma'],
  obito_orange_mask: ['Tobi / Obito (Orange Mask)', 'Kamui Phasing & Izanagi'],
  might_guy_seventh_gate: ['Might Guy (7th Gate of Wonder)', 'Daytime Tiger (Hirudora)'],
  jiraiya_sage_mode: ['Jiraiya (Hermit Sage Mode)', 'Demonic Illusion: Toad Confrontation Chant'],
  naruto_sage_mode: ['Naruto (Toad Sage Mode)', 'Sage Art: Wind Style Rasenshuriken'],
  sasuke_ms_taka: ['Sasuke (Mangekyo Sharingan)', 'Amaterasu, Susanoo Arrows & Kirin'],
  orochimaru_war_arc: ['Orochimaru (White Zetsu Body)', 'Summoning: Four Hokage & Eight Branches'],
  kakashi_war_arc: ['Kakashi Hatake (Great War)', 'Kamui Snipe & Lightning Cable'],
  tsunade_byakugo: ['Tsunade (100 Healings Mode)', 'Creation Rebirth: Strength of a Hundred'],
  kisame_fused_samehada: ['Kisame (Fused with Samehada)', 'Water Prison Shark Dance Dome'],
  fourth_raikage_v2: ['Fourth Raikage (Lightning V2)', 'Lightning Straight & Liger Bomb'],
  gaara_war_commander: ['Gaara (Allied Commander)', 'Grand Sand Mausoleum Seal'],
  sakura_byakugo_war: ['Sakura (Strength of a Hundred)', 'Cherry Blossom Impact & Katsuyu Summon'],
  hanzo_salamander: ['Hanzo the Salamander', 'Ibuse Venom Fog & Explosive Sickle'],
  danzo_izanagi: ['Danzo Shimura (Ten Sharingan)', 'Izanagi Loop & Reverse Tetragram Seal'],
  sasori_hundred_puppets: ['Sasori (100 Puppets Army)', 'Red Secret Technique: Performance of a Hundred'],
  kakuzu_five_hearts: ['Kakuzu (Earth Grudge Fear)', 'Five Elemental Masks Combined Blast'],
  deidara_c4_karura: ['Deidara (C4 Karura)', 'Microscopic C4 Nano-Explosion'],
  konan_paper_ocean: ['Konan (600 Billion Paper Bombs)', 'Sacred Paper Emissary Abyss'],
  jiraiya_base: ['Jiraiya (Toad Sannin)', 'Summoning: Gamabunta & Dark Swamp'],
  orochimaru_sannin: ['Orochimaru (Sannin)', 'Ten Thousand Snakes & Kusanagi Blade'],
  naruto_four_tails: ['Naruto (Four-Tails Cloak)', 'Miniature Tailed Beast Bomb'],
  sasuke_hebi_curse: ['Sasuke (Curse Mark Level 2)', 'Kirin True Thunder & Chidori Stream'],
  mei_terumi: ['Mei Terumi (Fifth Mizukage)', 'Lava Style & Vapor Acid Mist'],
  third_kazekage: ['Third Kazekage (Iron Sand)', 'Iron Sand World Order'],
  rasa_fourth_kazekage: ['Rasa (Fourth Kazekage)', 'Magnetic Gold Dust Imperial Wave'],
  yagura_three_tails: ['Yagura (Fourth Mizukage)', 'Aqua Mirror & Isobu Coral Palm'],
  darui_fifth_raikage: ['Darui (Fifth Raikage)', 'Black Panther & Gale Style Laser Circus'],
  kurotsuchi_tsuchikage: ['Kurotsuchi (Fourth Tsuchikage)', 'Lava Style: Quicklime Congealing'],
  chojuro_mizukage: ['Chojuro (Sixth Mizukage)', 'Hiramekarei Unbound Giant Hammer'],
  roshi_four_tails: ['Roshi (Four-Tails Jinchuriki)', 'Scorching Lava Armor Mode'],
  han_five_tails: ['Han (Five-Tails Jinchuriki)', 'Boil Style: Erupting Propulsion Kick'],
  utakata_six_tails: ['Utakata (Six-Tails Jinchuriki)', 'Acidic Soap Bubble Barrage'],
  fu_seven_tails: ['Fu (Seven-Tails Jinchuriki)', 'Chomei Flight & Blinding Scale Powder'],
  yugito_two_tails: ['Yugito Nii (Two-Tails Jinchuriki)', 'Matatabi Blue Fire Hairball'],
  kinkaku_nine_tails: ['Kinkaku (Nine-Tails Cloak)', 'Bashosen Fan & Six Paths Treasured Tools'],
  ginkaku_nine_tails: ['Ginkaku (Nine-Tails Cloak)', 'Benihisago Soul Gourd & Shichiseiken'],
  mifune_samurai: ['Mifune (Samurai General)', 'Iaido: Instant Flash Slash'],
  mitsuki_sage_mode: ['Mitsuki (Snake Sage Mode)', 'Sage Art: Great Snake Lightning'],
  shin_uchiha: ['Shin Uchiha (Mangekyo)', 'Telekinetic Blade Manipulation'],
  sakumo_hatake: ['Sakumo Hatake (White Fang)', 'White Light Chakra Sabre'],
  kakashi_anbu: ['Kakashi (ANBU Captain)', 'Silent Assassination Raikiri'],
  kushina_uzumaki: ['Kushina Uzumaki', 'Adamantine Sealing Chains'],
  rock_lee_sixth_gate: ['Rock Lee (Sixth Gate of Joy)', 'Morning Peacock & Hidden Lotus'],
  kimimaro_curse_mark: ['Kimimaro (Curse Mark Level 2)', 'Dance of the Seedling Fern'],
  shikamaru_war_strategist: ['Shikamaru Nara (Chief Strategist)', 'Shadow Sewing & 200+ IQ Master Plan'],
  neji_war_jonin: ['Neji Hyuga (Konoha Jonin)', 'Gentle Fist: Eight Trigrams 64 Palms'],
  chiyo_ten_puppets: ['Granny Chiyo (Ten Puppets)', 'White Secret Technique: Chikamatsu Collection'],
  choji_butterfly_war: ['Choji (Butterfly Mode)', 'Super Multi-Size Butterfly Bombing'],
  hiashi_hyuga: ['Hiashi Hyuga', 'Eight Trigrams Twin Air Palm & Rotation'],
  hizashi_hyuga: ['Hizashi Hyuga', 'Eight Trigrams Palm Rotation'],
  yamato_wood_style: ['Yamato (Tenzo)', 'Wood Style: All-Surroundings Enclosure'],
  hidan_jashin: ['Hidan', 'Curse Technique: Death Controlling Possessed Blood'],
  konohamaru_jonin: ['Konohamaru (Elite Jonin)', 'Wind Style Rasengan & Burning Ash'],
  asuma_sarutobi: ['Asuma Sarutobi', 'Flying Swallow Wind Blades & Ash Pile Burning'],
  chiriku_monk: ['Chiriku (Fire Temple Monk)', 'Welcoming Approach: Thousand-Armed Murder'],
  zabuza_momochi: ['Zabuza Momochi', 'Hidden Mist & Kubikiribocho Executioner'],
  mangetsu_hozuki: ['Mangetsu Hozuki', 'Master Scroll of All Seven Mist Blades'],
  suigetsu_hozuki: ['Suigetsu Hozuki', 'Hydrification Demon Wave'],
  jugo_curse_mark2: ['Jugo (Full Transformation)', 'Multiple Lotus Nonself Connected Cannons'],
  shino_war_arc: ['Shino Aburame', 'Parasitic Giant Insect Tornado'],
  sai_war_arc: ['Sai (Sealing Tiger)', 'Super Beast Scroll: Sealing Tiger Vision'],
  temari_war_arc: ['Temari', 'Wind Style: Cast Net & Great Sea'],
  kankuro_sasori_puppet: ['Kankuro (Sasori Puppet)', 'Red Secret Scorpion & Crow Combo'],
  haku_ice_mirrors: ['Haku', 'Crystal Ice Mirrors (Makyo Hyosho)'],
  pakura_scorch: ['Pakura (Scorch Style)', 'Scorch Style: Extremely Steaming Murder'],
  gari_explosion: ['Gari (Explosion Corps)', 'Explosion Style: Landmine Fist'],
  kushimaru_nuibari: ['Kushimaru Kuriarare', 'Longsword Nuibari Wire Crucifixion'],
  ameyuri_ringo: ['Ameyuri Ringo (Kiba Blades)', 'Lightning Fang Twin Swords: Thunder Gate'],
  jinpachi_munashi: ['Jinpachi Munashi', 'Blastsword Shibuki Explosive Scroll'],
  akatsuchi_stone: ['Akatsuchi', 'Earth Style: Stone Golem Jutsu'],
  kitsuchi_stone: ['Kitsuchi (2nd Division Commander)', 'Earth Style: Sandwich Technique'],
  dodai_rubber: ['Dodai (Rubber Style)', 'Lava Style: Rubber Defence Wall'],
  c_sensor_cloud: ['C (Raikage Bodyguard)', 'Lightning Flash Pillar Genjutsu'],
  shikaku_nara: ['Shikaku Nara', 'Black Shadow Possession & Supreme Strategy'],
  inoichi_yamanaka: ['Inoichi Yamanaka', 'Allied Shinobi Global Telepathy'],
  choza_akimichi: ['Choza Akimichi', 'Super Multi-Size Bo Staff Smash'],
  shibi_aburame: ['Shibi Aburame', 'Kikaichu Defensive Insect Sphere'],
  tsume_inuzuka: ['Tsume Inuzuka', 'Fang Passing Fang with Kuromaru'],
  fugaku_uchiha: ['Fugaku Uchiha (Wicked Eye)', 'Advanced Sharingan & Great Fireball'],
  dan_kato: ['Dan Kato', 'Spirit Transformation Technique (Reika no Jutsu)'],
  kurenai_yuhi: ['Kurenai Yuhi', 'Demonic Illusion: Tree Binding Death'],
  hinata_war_twin_lions: ['Hinata (Twin Lion Fists)', 'Gentle Step Twin Lion Fists'],
  naruto_rasenshuriken_arc: ['Naruto (Rasenshuriken Creator)', 'Wind Style: Rasenshuriken'],
  sasuke_early_shippuden: ['Sasuke (Early Shippuden)', 'Chidori Sharp Spear & Kusanagi'],
  kabuto_part1: ['Kabuto Yakushi (Chakra Scalpel)', 'Chakra Scalpel & Yin Healing Wound'],
  baki_wind_blade: ['Baki (Sand Elite)', 'Blade of Wind (Kaze no Yaiba)'],
  torune_aburame: ['Torune Aburame (Root)', 'Nano-Sized Venomous Rinkaichu'],
  fu_yamanaka: ['Fu Yamanaka (Root)', 'Mind Puppet Switch Cursed Seal'],
  ao_byakugan: ['Ao (Byakugan Hunter)', 'Water Bullet Trap & Barrier Detection'],
  genma_shiranui: ['Genma Shiranui', 'Chakra-Infused Senbon Spit'],
  raido_namiashi: ['Raido Namiashi', 'Kokuto Black Poison Blade'],
  naruto_valley_one_tail: ['Naruto (One-Tail Cloak)', 'Vermilion Rasengan'],
  sasuke_valley_curse2: ['Sasuke (Final Valley - Part 1)', 'Dark Lament Chidori (Curse Mark 2)'],
  gaara_chunin_shukaku: ['Gaara (Partial Shukaku)', 'Sand Coffin & Shukaku Claw'],
  rock_lee_chunin_weights: ['Rock Lee (Weights Off - Gate 5)', 'Primary & Hidden Lotus'],
  neji_chunin_exams: ['Neji Hyuga (Chunin Exams)', 'Eight Trigrams 64 Palms'],
  omoi_cloud: ['Omoi', 'Cloud Style Crescent Moon Slash'],
  kiba_shippuden: ['Kiba Inuzuka (Two-Headed Wolf)', 'Fang Wolf Fang (Garoga)'],
  sakon_ukon: ['Sakon & Ukon (Level 2)', 'Summoning: Rashomon & Parasite Demon'],
  kidomaru_curse2: ['Kidomaru (Level 2)', 'Spider War Bow: Terrible Split'],
  tayuya_curse2: ['Tayuya (Level 2)', 'Demonic Flute: Phantom Sound Chains'],
  jirobo_curse2: ['Jirobo (Level 2)', 'Earth Dome Prison & Arhat Fist'],
  shizune_medical: ['Shizune', 'Poison Mist & Prepared Needle Shot'],
  ank_mitarashi: ['Anko Mitarashi', 'Hidden Shadow Snake Hands & Twin Snake'],
  karin_uzumaki: ['Karin Uzumaki', 'Mind’s Eye of the Kagura & Heal Bite'],
  ibiki_morino: ['Ibiki Morino', 'Summoning: Iron Maiden Torture Chamber'],
  samui_cloud: ['Samui', 'Cloud Style Tanto Blitz'],
  atsui_cloud: ['Atsui (Flame Blade)', 'Cloud Style Flame Slice'],
  karui_cloud: ['Karui', 'Cloud Style Front Beheading'],
  yugao_uzuki: ['Yugao Uzuki', 'Moonlight Hazy Sword Dance'],
  hayate_gekko: ['Hayate Gekko', 'Dance of the Crescent Moon'],
  ino_war_arc: ['Ino Yamanaka', 'Mind Body Switch & Sensory Link'],
  tenten_bashosen: ['Tenten (Bashosen Fan)', 'Bashosen Elemental Coils'],
  suikazan_fuguki: ['Fuguki Suikazan', 'Needle Senbon Hair Barrage'],
  jinin_akebino: ['Jinin Akebino', 'Bluntsword Kabutowari Armor Breaker'],
  raiga_kurosuki: ['Raiga Kurosuki', 'Lightning Burial: Banquet of Lightning'],
  chiyo_brother_ebizo: ['Elder Ebizo', 'Sand Village Strategic Counsel'],
  kankuro_chunin: ['Kankuro (Chunin Exams)', 'Karasu Puppet Poison Trap'],
  temari_chunin: ['Temari (Chunin Exams)', 'Wind Scythe Jutsu'],
  shikamaru_chunin: ['Shikamaru (Newly Promoted Chunin)', 'Tactical Shadow Possession'],
  shino_chunin: ['Shino Aburame (Chunin Exams)', 'Kikaichu Chakra Drain Swarm'],
  sasuke_chunin_chidori: ['Sasuke (First Chidori)', 'Chidori: One Thousand Birds'],
  naruto_chunin_gamabunta: ['Naruto (Chunin Exams)', 'Multi Shadow Clone & Gamabunta'],
  sakura_early_shippuden: ['Sakura (Sasori Battle)', 'Antidote & Puppet-Shattering Punch'],
  sai_root_intro: ['Sai (Root Operative)', 'Super Beast Scroll Ink Lions'],
  aoba_yamashiro: ['Aoba Yamashiro', 'Scattering Thousand Crows Technique'],
  ensui_nara: ['Ensui Nara', 'Extended Shadow Bind'],
  santa_yamanaka: ['Santa Yamanaka', 'Mind Confusion Technique'],
  motoi_cloud: ['Motoi', 'Lightning Water Spider Net'],
  maki_cloth_seal: ['Maki (Sealing Corps)', 'Cloth Binding Technique'],
  ittan_earth_trench: ['Ittan (Earth Trench)', 'Earth Style: Mobile Core'],
  choji_part1_pills: ['Choji (Three Colored Pills)', 'Spiky Human Bullet Tank'],
  kiba_part1: ['Kiba Inuzuka (Part 1)', 'Fang Over Fang (Gatsuga)'],
  hinata_part1: ['Hinata Hyuga (Part 1)', 'Gentle Fist & Byakugan Vision'],
  tenten_part1: ['Tenten (Part 1)', 'Twin Rising Dragons Scroll'],
  dosu_kinuta: ['Dosu Kinuta', 'Melody Arm Sound Wave Strike'],
  konohamaru_pain_arc: ['Konohamaru (vs Pain Path)', 'Shadow Clone Feint Rasengan'],
  izumo_kamizuki: ['Izumo Kamizuki', 'Water Style: Starch Syrup Capturing Field'],
  kotetsu_hagane: ['Kotetsu Hagane', 'Giant Conch Mace Summon'],
  iruka_umino: ['Iruka Umino', 'Binding Barrier & Shuriken Formation'],
  meizu_demon_brother: ['Meizu (Demon Brothers)', 'Poisoned Iron Claw Chain'],
  gozu_demon_brother: ['Gozu (Demon Brothers)', 'Puddle Ambush & Shredding Chain'],
  zaku_abumi: ['Zaku Abumi', 'Supersonic Slicing Sound Waves'],
  yoroi_akado: ['Yoroi Akado', 'Chakra Absorbing Palm'],
  ebisu_tokubetsu: ['Ebisu', 'Fireball Basics & Elite Tutoring'],
  misumi_tsurugi: ['Misumi Tsurugi', 'Soft Physique Modification'],
  oboro_rain_genin: ['Oboro (Rain Genin)', 'Haze Clone Illusion'],
  shigure_rain_umbrella: ['Shigure (Senbon Umbrella)', 'Senbon Shower Hailstorm'],
  kin_tsuchi: ['Kin Tsuchi', 'Bell Ring Genjutsu Needles'],
  ino_part1: ['Ino Yamanaka (Part 1)', 'Mind Transfer & Hair Trap'],
  sakura_part1: ['Sakura Haruno (Part 1)', 'Chakra Control & Genjutsu Release'],
  naruto_academy: ['Naruto (Academy Student)', 'Forbidden Scroll Shadow Clones'],
  mizuki_traitor: ['Mizuki', 'Giant Fuma Shuriken Spin'],
  konohamaru_academy: ['Konohamaru (Blue Scarf Kid)', 'Cloak Camouflage gag'],
  moegi_genin: ['Moegi (Academy)', 'Konohamaru Squad Teamwork'],
  udon_genin: ['Udon (Academy)', 'Basic Shuriken Angles'],
  zori_bodyguard: ['Zori (Gato Bodyguard)', 'Mercenary Katana Draw'],
  waraji_bodyguard: ['Waraji (Gato Bodyguard)', 'Mercenary Quick Slash'],
};

const RAW_200_SHINOBI: CompactEntry[] = [
  // ================= SSS TIER (17 الأساطير الخالدة وأطوار القمة - الريت الخفي 198 إلى 214) =================
  ['naruto_baryon_mode', 'ناروتو (طور الباريون)', 'قرية كونوها', 'SSS', 'الاندماج النووي للتشاكرا وتقليص العمر', 'ذروة القوة المطلقة مع كوراما', ['S+', 'S+', 'A', 'S', 'S+'], 214, 98, ['KONOHA', 'KAGE', 'JINCHURIKI'], '#EF4444', 'konoha'],
  ['isshiki_otsutsuki', 'إيشيكي أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SSS', 'سوكوهيكونا · دايكوكوتين', 'تقليص الأجسام واستدعاء المكعبات الفورية', ['S+', 'S+', 'S', 'S+', 'S+'], 213, 98, ['OTSUTSUKI', 'DOJUTSU'], '#F43F5E', 'sage'],
  ['hagoromo_otsutsuki', 'حكيم المسارات الستة', 'عشيرة الأوتسوتسوكي', 'SSS', 'خلق كل الأشياء · نينشو', 'مؤسس عالم الشينوبي والينغان', ['S+', 'S+', 'S+', 'S+', 'S+'], 212, 99, ['OTSUTSUKI', 'SAGE', 'DOJUTSU'], '#FBBF24', 'sage'],
  ['kaguya_otsutsuki', 'كاغويا أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SSS', 'كرة البحث عن الحقيقة المتمددة', 'سلف التشاكرا وتبديل الأبعاد الستة', ['S+', 'S', 'S+', 'A', 'S+'], 211, 90, ['OTSUTSUKI', 'DOJUTSU'], '#E879F9', 'sage'],
  ['madara_rikudo', 'مادارا (حكيم المسارات)', 'مؤسس كونوها', 'SSS', 'تسوكويومي اللانهائية · ليمبو المسارات', 'قوة الجيوبي والرينغان المزدوجة', ['S+', 'S+', 'S+', 'S+', 'S+'], 210, 99, ['UCHIHA', 'FOUNDER', 'JINCHURIKI', 'DOJUTSU'], '#DC2626', 'uchiha'],
  ['naruto_six_paths', 'ناروتو (حكيم المسارات)', 'قرية كونوها', 'SSS', 'راسين شوريكن المسارات الستة', 'تشاكرا جميع البيجو وحكيم المسارات', ['S+', 'S+', 'B', 'A', 'S+'], 209, 95, ['KONOHA', 'JINCHURIKI', 'SAGE', 'TEAM7'], '#F59E0B', 'konoha'],
  ['sasuke_rinnegan', 'ساسكي (الرينغان والسوسانو)', 'قرية كونوها', 'SSS', 'سهم إندرا · أمينوتجيكارا', 'الشارينغان الأبدية والينغان السداسية', ['S+', 'S+', 'S+', 'S+', 'S+'], 208, 98, ['KONOHA', 'UCHIHA', 'TEAM7', 'DOJUTSU'], '#6366F1', 'uchiha'],
  ['kakashi_dms', 'كاكاشي (المانغيكيو المزدوجة)', 'قرية كونوها', 'SSS', 'سوسانو كاموي الكامل · رايكيري كاموي', 'اختراق الأبعاد بسرعة البرق', ['S+', 'S+', 'S+', 'S+', 'S+'], 207, 99, ['KONOHA', 'KAGE', 'TEAM7', 'DOJUTSU'], '#38BDF8', 'lightning'],
  ['momoshiki_fused', 'موموشيكي المندمج', 'عشيرة الأوتسوتسوكي', 'SSS', 'امتصاص ومضاعفة جميع النينجتسو', 'الرينغان الذهبية وتدمير الكواكب', ['S+', 'S+', 'S', 'S', 'S+'], 206, 94, ['OTSUTSUKI', 'DOJUTSU'], '#FACC15', 'sage'],
  ['hashirama_sage_mode', 'هاشيراما (طور الحكيم)', 'قرية كونوها', 'SSS', 'فن الحكيم: ألف يد خشبية حقيقية', 'إله الشينوبي وقاهر الكيوبي', ['S+', 'S+', 'A', 'S', 'S+'], 205, 96, ['KONOHA', 'KAGE', 'FOUNDER', 'SAGE'], '#10B981', 'sage'],
  ['might_guy_eight_gates', 'مايت غاي (البوابة الثامنة)', 'قرية كونوها', 'SSS', 'غاي الليلي · بوابة الموت القرمزية', 'تايجتسو خالص يحني الفضاء', ['C', 'S+', 'C', 'B', 'S+'], 204, 89, ['KONOHA', 'TAIJUTSU'], '#E11D48', 'konoha'],
  ['obito_juubi', 'أوبيتو (جينشوريكي الجيوبي)', 'الأكاتسوكي / كونوها', 'SSS', 'سيف النونوبوكو المقدس · كرات الحقيقة', 'قوة ذي العشرة ذيول', ['S+', 'S+', 'S', 'S', 'S+'], 203, 94, ['UCHIHA', 'AKATSUKI', 'JINCHURIKI', 'DOJUTSU'], '#EA580C', 'uchiha'],
  ['hamura_otsutsuki', 'هامورا أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SSS', 'التينسيغان الذهبية · شطر القمر', 'شقيق حكيم المسارات وحارس القمر', ['S+', 'S+', 'S', 'S', 'S+'], 202, 95, ['OTSUTSUKI', 'DOJUTSU'], '#38BDF8', 'sage'],
  ['indra_otsutsuki', 'إندرا أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SSS', 'السوسانو الأول · مبتكر أختام اليد', 'جد عشيرة الأوتشيها وعبقري القتال', ['S+', 'S+', 'S+', 'S+', 'S'], 201, 97, ['OTSUTSUKI', 'UCHIHA', 'DOJUTSU'], '#818CF8', 'uchiha'],
  ['ashura_otsutsuki', 'أشورا أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SSS', 'تجسيد تشاكرا المسارات الستة ثلاثي الرؤوس', 'جد السينجو والأوزوماكي وإرادة التعاون', ['S+', 'S+', 'A', 'A', 'S+'], 200, 93, ['OTSUTSUKI', 'SAGE'], '#F59E0B', 'sage'],
  ['madara_edo_tensei', 'مادارا (الإيدو تينسي)', 'مؤسس كونوها', 'SSS', 'نيزك تينغاي شينسي المزدوج · غابة الخشب', 'تشاكرا لا تنفد مع الرينغان والخشب', ['S+', 'S+', 'S+', 'S+', 'S+'], 199, 98, ['UCHIHA', 'FOUNDER', 'DOJUTSU'], '#EF4444', 'uchiha'],
  ['naruto_hokage_seventh', 'ناروتو (الهوكاجي السابع)', 'قرية كونوها', 'SSS', 'طور الكيوبي والحكيم الكامل · راسينغان الكوكب', 'أقوى هوكاجي في تاريخ الورقة المخفية', ['S+', 'S+', 'A', 'S', 'S+'], 198, 96, ['KONOHA', 'KAGE', 'JINCHURIKI', 'SAGE'], '#F97316', 'konoha'],

  // ================= SS TIER (28 كاجي خارق وأطوار أسطورية - الريت الخفي 170 إلى 197) =================
  ['sasuke_adult_shadow', 'ساسكي (الهوكاجي الظل)', 'قرية كونوها', 'SS', 'انتقال الأبعاد · تشيدوري البرق الأسود', 'حامي كونوها من الظلال', ['S+', 'S+', 'S+', 'S+', 'S'], 197, 99, ['KONOHA', 'UCHIHA', 'DOJUTSU'], '#6366F1', 'uchiha'],
  ['minato_kcm', 'ميناتو (طور تشاكرا الكيوبي)', 'قرية كونوها', 'SS', 'وميض الكيوبي الأصفر · راسينغان مزدوجة', 'السرعة القصوى مع نصف الكيوبي', ['S+', 'S+', 'B', 'S+', 'S+'], 196, 99, ['KONOHA', 'KAGE', 'JINCHURIKI', 'SAGE'], '#FBBF24', 'konoha'],
  ['hashirama_base', 'هاشيراما سينجو (الهوكاجي الأول)', 'قرية كونوها', 'SS', 'مولد غابة الأشجار العظمى · تنين الخشب', 'مؤسس كونوها وقائد السينجو', ['S+', 'S+', 'A', 'S', 'S+'], 195, 95, ['KONOHA', 'KAGE', 'FOUNDER'], '#10B981', 'konoha'],
  ['madara_ems_valley', 'مادارا (وادي النهاية)', 'مؤسس كونوها', 'SS', 'الكيوبي المدرع بالسوسانو المهيب', 'المانغيكيو شارينغان الأبدية', ['S+', 'S+', 'S+', 'S+', 'S+'], 194, 97, ['UCHIHA', 'FOUNDER', 'DOJUTSU'], '#DC2626', 'uchiha'],
  ['naruto_kcm2_sage', 'ناروتو (طور بيجو الحكيم)', 'قرية كونوها', 'SS', 'دمج تشاكرا كوراما مع طاقة الطبيعة', 'قنابل البيجو المشبعة بالسينجتسو', ['S+', 'S', 'B', 'A', 'S+'], 193, 93, ['KONOHA', 'JINCHURIKI', 'SAGE', 'TEAM7'], '#F59E0B', 'konoha'],
  ['nagato_edo_prime', 'ناغاتو (الرينغان الكاملة)', 'الأكاتسوكي / المطر', 'SS', 'المسارات الستة في جسد واحد · تشيباكو تينسي', 'السيطرة المطلقة على الجاذبية والأرواح', ['S+', 'S', 'A', 'S', 'S+'], 192, 95, ['AKATSUKI', 'DOJUTSU'], '#D97706', 'akatsuki'],
  ['itachi_edo_tensei', 'إيتاتشي (الإيدو تينسي)', 'قرية كونوها', 'SS', 'إيزانامي · أماتيراسو وسوسانو ياتا وتوتسوكا', 'عبقرية بلا حدود وجسد لا ينزف', ['S+', 'S', 'S+', 'S+', 'S'], 191, 99, ['UCHIHA', 'KONOHA', 'DOJUTSU'], '#EF4444', 'uchiha'],
  ['minato_hokage', 'ميناتو ناميكازي (الهوكاجي 4)', 'قرية كونوها', 'SS', 'إله الرعد الطائر المستوى الثاني · ختم الشينيغامي', 'وميض كونوها الأصفر', ['S+', 'S', 'B', 'S+', 'S'], 190, 99, ['KONOHA', 'KAGE', 'SAGE'], '#FACC15', 'konoha'],
  ['tobirama_senju', 'توبيراما سينجو (الهوكاجي 2)', 'قرية كونوها', 'SS', 'إله الرعد الطائر · الانفجار المتضاعف', 'مبتكر التقنيات المحرمة وسيد الماء', ['S+', 'S', 'A', 'S+', 'S'], 189, 98, ['KONOHA', 'KAGE'], '#0284C7', 'konoha'],
  ['obito_white_mask', 'أوبيتو (القناع الأبيض والينغان)', 'الأكاتسوكي', 'SS', 'استدعاء مازو والبيجو الستة · كاموي', 'جمع الشارينغان والينغان معاً', ['S+', 'S', 'S', 'S', 'S+'], 188, 95, ['UCHIHA', 'AKATSUKI', 'DOJUTSU'], '#F97316', 'uchiha'],
  ['pain_six_paths', 'باين (المسارات الستة)', 'الأكاتسوكي / المطر', 'SS', 'شينرا تينسي العظمى · بانشو تينين', 'زعيم الأكاتسوكي مدمر كونوها', ['S+', 'S', 'A', 'S', 'S+'], 187, 95, ['AKATSUKI', 'DOJUTSU'], '#EA580C', 'akatsuki'],
  ['kabuto_dragon_sage', 'كابوتو (طور حكيم التنين)', 'قرية الصوت', 'SS', 'فن الحكيم: غضب التنين الأبيض · إيدو تينسي', 'جمع قدرات الصوت الخمسة والأفاعي', ['S+', 'S', 'S+', 'S+', 'S'], 186, 96, ['SAGE', 'MEDICAL'], '#A855F7', 'sage'],
  ['sasuke_ems', 'ساسكي (المانغيكيو الأبدية)', 'قرية كونوها', 'SS', 'سوسانو كاغوتسوتشي اللهب الأسود', 'عيون إيتاتشي وساسكي المدمجة', ['S+', 'S', 'S', 'S', 'S'], 185, 94, ['UCHIHA', 'TEAM7', 'DOJUTSU'], '#818CF8', 'uchiha'],
  ['naruto_kcm1', 'ناروتو (طور تشاكرا الكيوبي 1)', 'قرية كونوها', 'SS', 'راسين شوريكن الكواكب المتعددة', 'سرعة تضاهي وميض الهوكاجي الرابع', ['S+', 'S', 'B', 'A', 'S+'], 184, 90, ['KONOHA', 'JINCHURIKI', 'TEAM7'], '#FBBF24', 'konoha'],
  ['itachi_uchiha', 'إيتاتشي أوتشيها (الأكاتسوكي)', 'الأكاتسوكي / كونوها', 'SS', 'تسوكويومي · أماتيراسو · سيف توتسوكا', 'سيد الوهم البصري الأول', ['S', 'S', 'S+', 'S+', 'A'], 183, 99, ['UCHIHA', 'AKATSUKI', 'DOJUTSU'], '#DC2626', 'akatsuki'],
  ['toneri_tenseigan', 'تونيري (طور التينسيغان)', 'عشيرة الأوتسوتسوكي', 'SS', 'الانفجار الذهبي للتينسيغان القاطع', 'سليل هامورا وقاطع القمر', ['S+', 'S', 'A', 'A', 'S+'], 182, 88, ['OTSUTSUKI', 'DOJUTSU'], '#2DD4BF', 'sage'],
  ['kinshiki_otsutsuki', 'كينشيكي أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SS', 'ترسانة أسلحة التشاكرا الحمراء العملاقة', 'قوة جسدية تحطم الجبال', ['S', 'S+', 'B', 'B', 'S+'], 181, 86, ['OTSUTSUKI', 'TAIJUTSU'], '#EF4444', 'sage'],
  ['urashiki_otsutsuki', 'أوراشيكي أوتسوتسوكي', 'عشيرة الأوتسوتسوكي', 'SS', 'صنارة سرقة التشاكرا · الرينغان الزرقاء', 'التلاعب بالزمن وسرقة التقنيات', ['S+', 'S', 'S', 'A', 'S+'], 180, 88, ['OTSUTSUKI', 'DOJUTSU'], '#38BDF8', 'sage'],
  ['shisui_uchiha', 'شيسوي أوتشيها (كوتوأماتسوكامي)', 'قرية كونوها', 'SS', 'كوتوأماتسوكامي · سوسانو الرمح الأخضر', 'الجسد الومضي وأقوى غينجتسو مطلق', ['S', 'S', 'S+', 'S', 'A'], 179, 95, ['KONOHA', 'UCHIHA', 'DOJUTSU'], '#10B981', 'uchiha'],
  ['third_raikage', 'الرايكاجي الثالث (آي)', 'قرية السحاب', 'SS', 'رمح الجحيم ذو الأصبع الواحد', 'أصلب درع برق واجه الهاتشيبي وحده', ['S', 'S+', 'C', 'A', 'S+'], 178, 88, ['KAGE', 'LIGHTNING'], '#EAB308', 'lightning'],
  ['killer_bee_hachibi', 'كيلر بي (طور الهاتشيبي الكامل)', 'قرية السحاب', 'SS', 'قنبلة البيجو العملاقة · إعصار الذيول الثمانية', 'الجينشوريكي المثالي لقرية السحاب', ['S', 'S+', 'B', 'B', 'S+'], 177, 89, ['JINCHURIKI', 'LIGHTNING'], '#FACC15', 'lightning'],
  ['mu_tsuchikage', 'مو (التسوتشيكاجي الثاني)', 'قرية الصخر', 'SS', 'عنصر الغبار الذري · الانقسام والاختفاء', 'الكاجي الخفي بلا تشاكرا محسوسة', ['S+', 'A', 'A', 'S', 'S'], 176, 94, ['KAGE'], '#94A3B8', 'suna'],
  ['onoki_tsuchikage', 'أونوكي (التسوتشيكاجي الثالث)', 'قرية الصخر', 'SS', 'عنصر الغبار: تفكيك العالم الذري', 'الطيران وتفتيت الخصوم لذرات', ['S+', 'B', 'B', 'S', 'S'], 175, 94, ['KAGE'], '#F59E0B', 'suna'],
  ['gengetsu_mizukage', 'غينغيتسو (الميزوكاجي الثاني)', 'قرية الضباب', 'SS', 'الفتى المتفجر اللانهائي · سراب المحار', 'سيد أوهام السراب المائي', ['S+', 'A', 'S+', 'S', 'S'], 174, 93, ['KAGE', 'MIST'], '#38BDF8', 'mist'],
  ['hiruzen_prime', 'هيروزين ساروتوبي (البروفيسور)', 'قرية كونوها', 'SS', 'عناصر الطبيعة الخمسة المجتمعة · إينما', 'الهوكاجي الثالث متقن كل تقنيات كونوها', ['S+', 'S', 'S', 'S+', 'A'], 173, 97, ['KONOHA', 'KAGE'], '#B45309', 'konoha'],
  ['obito_orange_mask', 'توبي / أوبيتو (القناع البرتقالي)', 'الأكاتسوكي', 'SS', 'اختراق كاموي الطيفي · إيزاناغي', 'التلاعب بالأبعاد من خلف الستار', ['S', 'S', 'S', 'S', 'S'], 172, 95, ['UCHIHA', 'AKATSUKI', 'DOJUTSU'], '#EA580C', 'akatsuki'],
  ['might_guy_seventh_gate', 'مايت غاي (البوابة السابعة)', 'قرية كونوها', 'SS', 'نمر الظهيرة (هيرودورا) الساحق', 'موجة ضغط جوي تدمر السوسانو', ['C', 'S+', 'C', 'B', 'S'], 171, 88, ['KONOHA', 'TAIJUTSU'], '#10B981', 'konoha'],
  ['jiraiya_sage_mode', 'جيرايا (طور حكيم الضفادع)', 'قرية كونوها', 'SS', 'وهم الضفادع الصوتي · تشو أوداما راسينغان', 'السانين الأسطوري مع فوكاساكو وشيما', ['S+', 'S', 'S', 'S', 'S+'], 170, 94, ['KONOHA', 'SANNIN', 'SAGE'], '#EF4444', 'sage'],

  // ================= S TIER (38 شينوبي أسطوري وأطوار خاصة - الريت الخفي 132 إلى 169) =================
  ['naruto_sage_mode', 'ناروتو (طور الناسك / الحكيم)', 'قرية كونوها', 'S', 'فن الحكيم: راسين شوريكن · كاتا الضفادع', 'بطل كونوها الذي هزم مسارات باين', ['S+', 'S', 'B', 'A', 'S'], 169, 92, ['KONOHA', 'JINCHURIKI', 'SAGE', 'TEAM7'], '#F97316', 'sage'],
  ['sasuke_ms_taka', 'ساسكي (مانغيكيو شارينغان)', 'فريق تاكا', 'S', 'أماتيراسو · سهام السوسانو · كيرين', 'الانتقام المظلم وعيون المانغيكيو', ['S', 'S', 'S', 'S', 'A'], 168, 92, ['UCHIHA', 'DOJUTSU'], '#6366F1', 'uchiha'],
  ['orochimaru_war_arc', 'أوروتشيمارو (جسد زيتسو الأبيض)', 'السانين', 'S', 'استدعاء الهوكاجي الأربعة · الهيدرا الثماني', 'الخلود الكامل وخلايا هاشيراما', ['S+', 'A', 'S', 'S+', 'S'], 167, 96, ['KONOHA', 'SANNIN'], '#A855F7', 'sage'],
  ['kakashi_war_arc', 'كاكاشي هاتاكي (حرب النينجا)', 'قرية كونوها', 'S', 'انتقال كاموي السريع · سلسلة البرق القاطع', 'قائد الفرقة الثالثة في الحرب العظمى', ['S', 'S', 'A', 'S+', 'A'], 166, 97, ['KONOHA', 'KAGE', 'TEAM7', 'DOJUTSU'], '#38BDF8', 'lightning'],
  ['tsunade_byakugo', 'تسونادي (طور التجديد المئوي)', 'قرية كونوها', 'S', 'ختم البياكوغو المفتوح · قبضة تحطيم السوسانو', 'تجدد فوري للخلايا وقوة خارقة', ['S', 'S+', 'B', 'S', 'S'], 165, 91, ['KONOHA', 'KAGE', 'SANNIN', 'MEDICAL'], '#10B981', 'konoha'],
  ['kisame_fused_samehada', 'كيسامي (المندمج مع ساميهادا)', 'الأكاتسوكي / الضباب', 'S', 'قبة المحيط المتحركة · امتصاص التشاكرا باللمس', 'وحش البحار والبيجو بلا ذيل', ['S', 'S', 'C', 'B', 'S+'], 164, 86, ['AKATSUKI', 'MIST'], '#0EA5E9', 'akatsuki'],
  ['fourth_raikage_v2', 'الرايكاجي الرابع (درع البرق 2)', 'قرية السحاب', 'S', 'انقضاض البرق المستقيم · لايغير بومب', 'أسرع شينوبي بعد ميناتو', ['S', 'S+', 'C', 'B', 'S+'], 163, 86, ['KAGE', 'LIGHTNING'], '#FACC15', 'lightning'],
  ['gaara_war_commander', 'غارا (قائد تحالف الشينوبي)', 'قرية الرمل', 'S', 'ضريح الهرم الرملي العظيم · درع الأم المطلق', 'الكازيكاجي الخامس وقائد جيش التحالف', ['S+', 'B', 'B', 'S', 'S'], 162, 93, ['SUNA', 'KAGE', 'JINCHURIKI'], '#D97706', 'suna'],
  ['sakura_byakugo_war', 'ساكورا (ختم القوة المئوية)', 'قرية كونوها', 'S', 'انفجار زهر الكرز المئوي · استدعاء كاتسويو', 'وريثة تسونادي في القوة والطب', ['A', 'S+', 'A', 'S', 'S'], 161, 90, ['KONOHA', 'TEAM7', 'MEDICAL'], '#F43F5E', 'konoha'],
  ['hanzo_salamander', 'هانزو السلمندر', 'قرية المطر', 'S', 'ضباب السم الأسود · منجل السلسلة المتفجرة', 'زعيم المطر الذي هزم السانين الثلاثة شباباً', ['S', 'S', 'B', 'S', 'A'], 160, 91, ['KAGE'], '#78716C', 'mist'],
  ['danzo_izanagi', 'دانزو (الشارينغان العشر)', 'جذور كونوها', 'S', 'إيزاناغي المتكرر · ختم التيتراغرام العكسي', 'تغيير الواقع وتحويل الموت إلى وهم', ['S', 'A', 'S', 'S', 'A'], 159, 91, ['KONOHA', 'DOJUTSU'], '#64748B', 'konoha'],
  ['sasori_hundred_puppets', 'ساسوري (جيش المئة دمية)', 'الأكاتسوكي / الرمل', 'S', 'الأداء السري الأحمر: مئة دمية · الكازيكاجي 3', 'مقبرة لبلد كامل بسمومه القاتلة', ['S', 'B', 'A', 'S', 'A'], 158, 91, ['AKATSUKI', 'SUNA'], '#E11D48', 'akatsuki'],
  ['kakuzu_five_hearts', 'كاكوزو (القلوب الخمسة)', 'الأكاتسوكي / الشلال', 'S', 'دمج النار والرياح والبرق · خيوط جيونغو', 'خمسة أرواح وخمس طبائع تشاكرا متزامنة', ['S', 'S', 'B', 'S', 'S'], 157, 90, ['AKATSUKI'], '#14B8A6', 'akatsuki'],
  ['deidara_c4_karura', 'ديدارا (طور C4 كارورا)', 'الأكاتسوكي / الصخر', 'S', 'قنبلة C4 المجهرية · الفن هو الانفجار النهائي', 'تدمير خلوي غير مرئي بالعين المجردة', ['S+', 'B', 'B', 'A', 'A'], 156, 86, ['AKATSUKI'], '#EAB308', 'akatsuki'],
  ['konan_paper_ocean', 'كونان (محيط الـ600 مليار ورقة)', 'الأكاتسوكي / المطر', 'S', 'الورق الإلهي: عشرة دقائق من الانفجار المستمر', 'الخطة التي كادت تقضي على أوبيتو', ['S+', 'B', 'B', 'S', 'A'], 155, 92, ['AKATSUKI'], '#818CF8', 'akatsuki'],
  ['jiraiya_base', 'جيرايا (حكيم الضفادع)', 'قرية كونوها', 'S', 'استدعاء غامابونتا · مستنقع العالم السفلي', 'أحد السانين الأسطوريين ومعلم الهوكاجي', ['S', 'A', 'B', 'S', 'S'], 154, 90, ['KONOHA', 'SANNIN', 'SAGE'], '#EF4444', 'sage'],
  ['orochimaru_sannin', 'أوروتشيمارو (السانين)', 'قرية الصوت', 'S', 'ماندالا الأفاعي العشرة آلاف · سيف كوساناغي', 'عبقري التجارب والتقنيات المحرمة', ['S', 'A', 'S', 'S+', 'S'], 153, 94, ['KONOHA', 'SANNIN'], '#9333EA', 'sage'],
  ['naruto_four_tails', 'ناروتو (غلاف الذيول الأربعة)', 'قرية كونوها', 'S', 'قنبلة البيجو المظلمة · أذرع تشاكرا الكيوبي', 'غضب الكيوبي المدمر فاقد السيطرة', ['S', 'S', 'C', 'C', 'S+'], 152, 72, ['KONOHA', 'JINCHURIKI'], '#DC2626', 'konoha'],
  ['sasuke_hebi_curse', 'ساسكي (الختم الملعون المستوى 2)', 'فريق هيبي', 'S', 'كيرين (صاعقة السماء الحقيقية) · تشيدوري ناغاشي', 'الذي هزم ديدارا وواجه إيتاتشي', ['S', 'S', 'A', 'S', 'A'], 151, 91, ['UCHIHA', 'DOJUTSU'], '#4F46E5', 'uchiha'],
  ['mei_terumi', 'ماي تيرومي (الميزوكاجي الخامس)', 'قرية الضباب', 'S', 'عنصر الذوبان وعنصر الغليان الحمضي', 'إذابة دروع السوسانو بالضباب الحمضي', ['S+', 'B', 'B', 'A', 'S'], 150, 88, ['KAGE', 'MIST'], '#06B6D4', 'mist'],
  ['third_kazekage', 'الكازيكاجي الثالث (رمل الحديد)', 'قرية الرمل', 'S', 'عالم رمل الحديد المغناطيسي القاطع', 'أقوى كازيكاجي في تاريخ قرية الرمل', ['S+', 'B', 'B', 'S', 'S'], 149, 89, ['SUNA', 'KAGE'], '#475569', 'suna'],
  ['rasa_fourth_kazekage', 'راسا (الكازيكاجي الرابع)', 'قرية الرمل', 'S', 'طوفان غبار الذهب المغناطيسي الثقيل', 'والد غارا وقامع شوكاكو بالذهب', ['S', 'B', 'B', 'A', 'S'], 148, 87, ['SUNA', 'KAGE'], '#EAB308', 'suna'],
  ['yagura_three_tails', 'ياغورا (الميزوكاجي الرابع)', 'قرية الضباب', 'S', 'مرآة الماء العاكسة · قنبلة الثلاثة ذيول', 'سيطرة كاملة على البيجو إيسوبو', ['S', 'A', 'B', 'A', 'S'], 147, 86, ['KAGE', 'MIST', 'JINCHURIKI'], '#0EA5E9', 'mist'],
  ['darui_fifth_raikage', 'داروي (الرايكاجي الخامس)', 'قرية السحاب', 'S', 'الفهد الأسود · عنصر العاصفة الليزري', 'وريث البرق الأسود للرايكاجي الثالث', ['S', 'S', 'B', 'A', 'A'], 146, 88, ['KAGE', 'LIGHTNING'], '#38BDF8', 'lightning'],
  ['kurotsuchi_tsuchikage', 'كوروتسوتشي (التسوتشيكاجي 4)', 'قرية الصخر', 'S', 'عنصر الحمم الجيرية · قبضة الصخر الساحقة', 'حفيدة أونوكي وقائدة قرية الصخر', ['S', 'S', 'B', 'A', 'A'], 145, 86, ['KAGE'], '#FB7185', 'suna'],
  ['chojuro_mizukage', 'تشوجورو (الميزوكاجي السادس)', 'قرية الضباب', 'S', 'تحرير هيراميكاري الكامل: سيف الماء العظيم', 'قائد سيافي الضباب والميزوكاجي', ['A', 'S+', 'C', 'A', 'A'], 144, 85, ['KAGE', 'MIST'], '#0284C7', 'mist'],
  ['roshi_four_tails', 'روشي (جينشوريكي الـ4 ذيول)', 'قرية الصخر', 'S', 'طور درع الحمم البركانية · جبل الفواكه والزهور', 'حمم سون غوكو المنصهرة', ['S', 'S', 'C', 'B', 'S'], 143, 82, ['JINCHURIKI'], '#EA580C', 'suna'],
  ['han_five_tails', 'هان (جينشوريكي الـ5 ذيول)', 'قرية الصخر', 'S', 'درع البخار المغلي · الركلة البخارية الخارقة', 'أسرع وأقوى ركلة مدعومة بالبخار', ['A', 'S+', 'C', 'B', 'S'], 142, 80, ['JINCHURIKI', 'TAIJUTSU'], '#EF4444', 'suna'],
  ['utakata_six_tails', 'أوتاكاتا (جينشوريكي الـ6 ذيول)', 'قرية الضباب', 'S', 'موجة فقاعات الصابون الحمضية المتفجرة', 'جينشوريكي سايكين الهادئ', ['S', 'B', 'B', 'A', 'S'], 141, 84, ['MIST', 'JINCHURIKI'], '#38BDF8', 'mist'],
  ['fu_seven_tails', 'فو (جينشوريكي الـ7 ذيول)', 'قرية الشلال', 'S', 'أجنحة تشومي المضيئة · غبار الحراشف المعمي', 'القتال الجوي السريع مع السبعة ذيول', ['A', 'A', 'B', 'B', 'S'], 140, 81, ['JINCHURIKI'], '#10B981', 'sage'],
  ['yugito_two_tails', 'يوغيتو ني (جينشوريكي الـ2 ذيول)', 'قرية السحاب', 'S', 'تحول ماتاتابي الكامل · كرات نار القطة الزرقاء', 'لهب الذيول الزرقاء الحارقة', ['S', 'S', 'C', 'A', 'S'], 139, 84, ['LIGHTNING', 'JINCHURIKI'], '#3B82F6', 'lightning'],
  ['kinkaku_nine_tails', 'كينكاكو (تشاكرا الكيوبي)', 'قرية السحاب', 'S', 'مروحة الباشوسين للعناصر الخمسة · غلاف الكيوبي', 'الأخ الذهبي حامل كنوز حكيم المسارات', ['S', 'S', 'C', 'B', 'S+'], 138, 80, ['LIGHTNING', 'JINCHURIKI'], '#F59E0B', 'lightning'],
  ['ginkaku_nine_tails', 'غينكاكو (تشاكرا الكيوبي)', 'قرية السحاب', 'S', 'قرعة البينيهيساغو الخاتمة للأرواح · سيف شيتشيساي', 'الأخ الفضي حامل كنوز حكيم المسارات', ['S', 'S', 'C', 'B', 'S+'], 137, 81, ['LIGHTNING', 'JINCHURIKI'], '#94A3B8', 'lightning'],
  ['mifune_samurai', 'ميفوني (قائد الساموراي)', 'بلاد الحديد', 'S', 'إيايدو: وميض السيف المانع لأختام اليد', 'سيد السيف الذي واجه هانزو', ['C', 'S+', 'B', 'S', 'A'], 136, 89, ['TAIJUTSU'], '#CBD5E1', 'konoha'],
  ['mitsuki_sage_mode', 'ميتسوكي (طور حكيم الأفاعي)', 'قرية كونوها', 'S', 'برق الأفاعي السماوي · سرعة الحكيم الفائقة', 'الإنسان الاصطناعي المتقن للسينجتسو', ['S', 'S', 'B', 'A', 'S'], 135, 87, ['KONOHA', 'SAGE'], '#2DD4BF', 'sage'],
  ['shin_uchiha', 'شين أوتشيها (المانغيكيو)', 'تجارب أوروتشيمارو', 'S', 'التحكم المغناطيسي بالأسلحة عن بعد عبر العين', 'جسد مزروع بعشرات عيون الشارينغان', ['A', 'A', 'A', 'B', 'A'], 134, 82, ['UCHIHA', 'DOJUTSU'], '#EF4444', 'uchiha'],
  ['sakumo_hatake', 'ساكومو هاتاكي (ناب كونوها الأبيض)', 'قرية كونوها', 'S', 'نصل تشاكرا الضوء الأبيض القاطع', 'والد كاكاشي الذي فاقت شهرته السانين', ['A', 'S+', 'B', 'S', 'A'], 133, 92, ['KONOHA', 'TAIJUTSU'], '#F8FAFC', 'konoha'],
  ['kakashi_anbu', 'كاكاشي (قائد الأنبو)', 'أنبو كونوها', 'S', 'رايكيري الاغتيال الصامت · الشارينغان', 'أخطر قادة الأنبو في شبابه', ['S', 'S', 'A', 'S', 'A'], 132, 93, ['KONOHA', 'DOJUTSU'], '#0284C7', 'lightning'],

  // ================= A TIER (45 نخبة الجونين ومقاتلو الصف الأول - الريت الخفي 87 إلى 131) =================
  ['kushina_uzumaki', 'كوشينا أوزوماكي', 'قرية كونوها', 'A', 'سلاسل التشاكرا الذهبية الحاجزة للبيجو', 'قوة حياة الأوزوماكي الاستثنائية', ['S', 'A', 'B', 'A', 'S+'], 131, 83, ['KONOHA', 'JINCHURIKI'], '#EF4444', 'konoha'],
  ['rock_lee_sixth_gate', 'روك لي (البوابة السادسة)', 'قرية كونوها', 'A', 'طاووس الصباح · اللوتس الخفي المدمر', 'عبقري العمل الجاد وسرعة التايجتسو', ['C', 'S+', 'C', 'B', 'A'], 130, 80, ['KONOHA', 'TAIJUTSU'], '#10B981', 'konoha'],
  ['kimimaro_curse_mark', 'كيميمارو (الختم الملعون 2)', 'قرية الصوت', 'A', 'رقصة السرخس العظمية الكبرى · رمح العظام', 'أقوى أفراد عشيرة كاغويا', ['A', 'S', 'C', 'B', 'A'], 129, 82, ['TAIJUTSU'], '#CBD5E1', 'sage'],
  ['shikamaru_war_strategist', 'شيكامارو نارا (مستشار الهوكاجي)', 'قرية كونوها', 'A', 'خياطة الظل الشاملة · خطط بذكاء 200+', 'العقل المدبر لجيش التحالف', ['A', 'B', 'A', 'S+', 'B'], 128, 100, ['KONOHA', 'STRATEGIST'], '#64748B', 'konoha'],
  ['neji_war_jonin', 'نيجي هيوغا (جونين كونوها)', 'قرية كونوها', 'A', 'القبضة الناعمة: 64 راحة يد · كايتن', 'عبقري الهيوغا والبياكوغان الثاقبة', ['B', 'S', 'B', 'A', 'A'], 127, 88, ['KONOHA', 'TAIJUTSU', 'DOJUTSU'], '#94A3B8', 'konoha'],
  ['chiyo_ten_puppets', 'الجدة تشيو (الدمى العشر)', 'قرية الرمل', 'A', 'دمى تيكاماتسو البيضاء العشر · درع الشاكرا', 'خبيرة دمى الرمل التي هزمت ساسوري', ['A', 'B', 'B', 'S', 'A'], 126, 92, ['SUNA', 'MEDICAL'], '#A855F7', 'suna'],
  ['choji_butterfly_war', 'تشوجي (طور أجنحة الفراشة)', 'قرية كونوها', 'A', 'تضخم الجسد العملاق · قنبلة الفراشة', 'أقوى ضربة جسدية في عشيرة أكيميتشي', ['A', 'S+', 'C', 'B', 'S'], 125, 79, ['KONOHA', 'TAIJUTSU'], '#F97316', 'konoha'],
  ['hiashi_hyuga', 'هياشي هيوغا', 'قرية كونوها', 'A', 'الجدار الهوائي المزدوج · كايتن عشيرة الهيوغا', 'زعيم عشيرة الهيوغا', ['B', 'S', 'B', 'A', 'A'], 124, 86, ['KONOHA', 'DOJUTSU', 'TAIJUTSU'], '#E2E8F0', 'konoha'],
  ['hizashi_hyuga', 'هيزاشي هيوغا', 'قرية كونوها', 'A', 'القبضة الناعمة والدفاع الدائري المطلق', 'والد نيجي ومقاتل العائلة الفرعية', ['B', 'S', 'B', 'A', 'A'], 123, 85, ['KONOHA', 'DOJUTSU', 'TAIJUTSU'], '#94A3B8', 'konoha'],
  ['yamato_wood_style', 'ياماتو (تينزو)', 'أنبو كونوها', 'A', 'عنصر الخشب: غابة الأشجار العظمى', 'وريث خلايا الهوكاجي الأول', ['A', 'A', 'B', 'A', 'A'], 122, 86, ['KONOHA', 'TEAM7'], '#10B981', 'konoha'],
  ['hidan_jashin', 'هيدان', 'الأكاتسوكي', 'A', 'طقوس لعنة الدم القاتلة (جاشين)', 'الخلود الجسدي وانعكاس الجروح', ['B', 'S', 'C', 'C', 'A'], 121, 74, ['AKATSUKI'], '#E11D48', 'akatsuki'],
  ['konohamaru_jonin', 'كونوهامارو (جونين كونوها)', 'قرية كونوها', 'A', 'راسينغان الرياح · رماد اللهب الحارق', 'قائد الفريق السابع الجديد وحفيد الثالث', ['A', 'A', 'B', 'A', 'A'], 120, 85, ['KONOHA'], '#FB923C', 'konoha'],
  ['asuma_sarutobi', 'أسوما ساروتوبي', 'قرية كونوها', 'A', 'شفرات تشاكرا الرياح · رماد الحرق المتفجر', 'أحد حراس النار الاثني عشر', ['A', 'S', 'B', 'A', 'A'], 119, 85, ['KONOHA'], '#D97706', 'konoha'],
  ['chiriku_monk', 'تشيريكو (راهب معبد النار)', 'بلاد النار', 'A', 'هبة رايجو: ألف يد بوذا المضيئة', 'أقوى رهبان معبد النار وحارس الاثني عشر', ['A', 'S', 'B', 'A', 'A'], 118, 84, ['KONOHA', 'TAIJUTSU'], '#F59E0B', 'konoha'],
  ['zabuza_momochi', 'زابوزا موموتشي', 'قرية الضباب', 'A', 'تقنية الضباب الخفي · سيف كوبينيكيري', 'شيطان الضباب المخفي', ['A', 'A', 'B', 'A', 'A'], 117, 83, ['MIST'], '#0284C7', 'mist'],
  ['mangetsu_hozuki', 'مانغيتسو هوزوكي', 'قرية الضباب', 'A', 'لفافة استدعاء السيوف السبعة جميعها', 'قائد جيل سيافي الضباب السبعة', ['A', 'S', 'C', 'A', 'A'], 116, 85, ['MIST'], '#38BDF8', 'mist'],
  ['suigetsu_hozuki', 'سويغيتسو هوزوكي', 'فريق تاكا / الضباب', 'A', 'التحول المائي العملاق · سيف قاطع الرؤوس', 'جسد سائل منيع ضد الضربات', ['A', 'A', 'C', 'B', 'A'], 115, 79, ['MIST'], '#0EA5E9', 'mist'],
  ['jugo_curse_mark2', 'جوغو (التحول الكامل)', 'فريق تاكا', 'A', 'مدافع تشاكرا الطبيعة المتعددة', 'الأصل الحي للختم الملعون', ['A', 'S', 'C', 'C', 'S'], 114, 73, ['SAGE'], '#F59E0B', 'sage'],
  ['shino_war_arc', 'شينو أبوراني', 'قرية كونوها', 'A', 'حشرات الكيكايشو العملاقة الآكلة للتشاكرا', 'لم يخسر نزالاً فردياً بفضل تكتيك الحشرات', ['A', 'B', 'B', 'S', 'A'], 113, 89, ['KONOHA'], '#475569', 'konoha'],
  ['sai_war_arc', 'ساي (ختم النمر)', 'أنبو كونوها', 'A', 'رسم الوحوش الخارقة: ختم النمر الجبار', 'القتال الجوي وتقييد الإيدو تينسي', ['A', 'B', 'B', 'A', 'A'], 112, 85, ['KONOHA', 'TEAM7'], '#64748B', 'konoha'],
  ['temari_war_arc', 'تيماري', 'قرية الرمل', 'A', 'رقصة منجل ابن عرس الكبرى · شبكة الرياح', 'أقوى مستخدمة لعنصر الرياح في الرمل', ['A', 'B', 'B', 'A', 'A'], 111, 86, ['SUNA'], '#14B8A6', 'suna'],
  ['kankuro_sasori_puppet', 'كانكورو (دمية ساسوري)', 'قرية الرمل', 'A', 'التحكم بدمية العقرب الأحمر والغراب', 'قائد فرقة الكمائن في الحرب', ['A', 'B', 'B', 'A', 'A'], 110, 85, ['SUNA'], '#9333EA', 'suna'],
  ['haku_ice_mirrors', 'هاكو', 'قرية الضباب', 'A', 'مرايا الجليد الكريستالية الشيطانية', 'الانتقال بسرعة الضوء بين المرايا', ['A', 'A', 'B', 'A', 'A'], 109, 84, ['MIST'], '#38BDF8', 'mist'],
  ['pakura_scorch', 'باكورا (عنصر الاحتراق)', 'قرية الرمل', 'A', 'عنصر الاحتراق: القتل التبخيري الفوري', 'بطلة قرية الرمل ذات الكيكي غينكاي الحارق', ['S', 'B', 'B', 'A', 'A'], 108, 82, ['SUNA'], '#F97316', 'suna'],
  ['gari_explosion', 'غاري (فيلق الانفجار)', 'قرية الصخر', 'A', 'عنصر الانفجار: قبضة اللغم المتفجر', 'تفجير الأجسام بلمسة واحدة', ['A', 'S', 'C', 'B', 'A'], 107, 78, ['TAIJUTSU'], '#EAB308', 'suna'],
  ['kushimaru_nuibari', 'كوشيمارو كوريأراري', 'قرية الضباب', 'A', 'سيف الخياطة الطويل (نويباري)', 'ثقب وخياطة الأعداء بأسلاك الفولاذ', ['B', 'S', 'C', 'B', 'A'], 106, 79, ['MIST'], '#64748B', 'mist'],
  ['ameyuri_ringo', 'أميوري رينغو (سيوف البرق)', 'قرية الضباب', 'A', 'سيوف كايبـا المزدوجة: بوابة الرعد', 'أقوى سيافة برق في الضباب', ['A', 'S', 'C', 'B', 'A'], 105, 80, ['MIST', 'LIGHTNING'], '#FACC15', 'lightning'],
  ['jinpachi_munashi', 'جينباتشي موناشي', 'قرية الضباب', 'A', 'سيف الانفجار (شيبوكي) ذو اللفافة المتفجرة', 'دمج المبارزة بالانفجارات المتتالية', ['A', 'S', 'C', 'B', 'A'], 104, 78, ['MIST'], '#EF4444', 'mist'],
  ['akatsuchi_stone', 'أكاتسوتشي', 'قرية الصخر', 'A', 'استدعاء غولم الصخر العملاق الآكل للتشاكرا', 'الحارس الشخصي للتسوتشيكاجي أونوكي', ['A', 'A', 'C', 'B', 'A'], 103, 79, ['KAGE'], '#D97706', 'suna'],
  ['kitsuchi_stone', 'كيتسوتشي (قائد الفرقة الثانية)', 'قرية الصخر', 'A', 'عنصر الأرض: شطيرة الجبلين العملاقين', 'قائد جيش الاشتباك القريب وأبو كوروتسوتشي', ['S', 'A', 'C', 'A', 'A'], 102, 85, ['KAGE'], '#B45309', 'suna'],
  ['dodai_rubber', 'دوداي (عنصر المطاط)', 'قرية السحاب', 'A', 'عنصر المطاط: الجدار والكرات الحامية', 'الذي أنقذ ناروتو من الرايكاجي الثالث', ['A', 'B', 'B', 'S', 'A'], 101, 88, ['LIGHTNING'], '#F59E0B', 'lightning'],
  ['c_sensor_cloud', 'شي (C - حارس الرايكاجي)', 'قرية السحاب', 'A', 'وهم عمود البرق الساطع المعمي + الاستشعار', 'عين واستشعار الرايكاجي الرابع الطبي', ['B', 'B', 'A', 'S', 'A'], 100, 87, ['LIGHTNING', 'MEDICAL'], '#38BDF8', 'lightning'],
  ['shikaku_nara', 'شيكاكو نارا', 'قرية كونوها', 'A', 'تقييد الظل الأسود · القائد الاستراتيجي الأعلى', 'والد شيكامارو والعقل العسكري للتحالف', ['A', 'B', 'A', 'S+', 'A'], 99, 100, ['KONOHA', 'STRATEGIST'], '#475569', 'konoha'],
  ['inoichi_yamanaka', 'إينويتشي ياماناكا', 'قرية كونوها', 'A', 'تخاطر جيش الشينوبي الكامل · تدمير عقل العدو', 'قائد قسم الاتصالات وقراءة العقول', ['A', 'B', 'A', 'S+', 'A'], 98, 95, ['KONOHA'], '#C084FC', 'konoha'],
  ['choza_akimichi', 'تشوزا أكيميتشي', 'قرية كونوها', 'A', 'التضخم العملاق الكامل · عصا القتال', 'زعيم عشيرة أكيميتشي ووالد تشوجي', ['A', 'S', 'C', 'B', 'A'], 97, 80, ['KONOHA', 'TAIJUTSU'], '#EA580C', 'konoha'],
  ['shibi_aburame', 'شيبي أبوراني', 'قرية كونوها', 'A', 'درع وسرب حشرات التدمير الصامت', 'والد شينو وزعيم عشيرة أبوراني', ['A', 'B', 'B', 'S', 'A'], 96, 88, ['KONOHA'], '#334155', 'konoha'],
  ['tsume_inuzuka', 'تسومي إينوزوكا', 'قرية كونوها', 'A', 'إعصار الناب القاطع مع كوروماو', 'والدة كيبا ومقاتلة كونوها الشرسة', ['B', 'S', 'C', 'B', 'A'], 95, 79, ['KONOHA', 'TAIJUTSU'], '#B45309', 'konoha'],
  ['fugaku_uchiha', 'فوغاكو أوتشيها (العين الشريرة)', 'قرية كونوها', 'A', 'الشارينغان المتقدمة · كرة النار العظمى', 'زعيم عشيرة الأوتشيها ووالد إيتاتشي وساسكي', ['S', 'A', 'S', 'S', 'A'], 94, 90, ['KONOHA', 'UCHIHA', 'DOJUTSU'], '#DC2626', 'uchiha'],
  ['dan_kato', 'دان كاتو', 'قرية كونوها', 'A', 'تقنية تحول الروح الطيفية (ريكي نو جتسو)', 'اختراق الأعداء كروح وتدميرهم من الداخل', ['S', 'A', 'B', 'A', 'A'], 93, 85, ['KONOHA'], '#818CF8', 'konoha'],
  ['kurenai_yuhi', 'كوريناي يوهي', 'قرية كونوها', 'A', 'الوهم الشجري المقيد: موت بتلات الكرز', 'سيدة الغينجتسو في كونوها', ['B', 'B', 'S', 'A', 'B'], 92, 84, ['KONOHA'], '#F43F5E', 'konoha'],
  ['hinata_war_twin_lions', 'هيناتا (قبضة الأسدين التوأمين)', 'قرية كونوها', 'A', 'قبضة الأسدين التوأمين · 64 راحة يد', 'تطوير القبضة الناعمة لاستنزاف التشاكرا', ['B', 'S', 'B', 'A', 'A'], 91, 82, ['KONOHA', 'DOJUTSU', 'TAIJUTSU'], '#818CF8', 'konoha'],
  ['naruto_rasenshuriken_arc', 'ناروتو (مبتكر الراسين شوريكن)', 'قرية كونوها', 'A', 'عنصر الرياح: راسين شوريكن الخلوية', 'النسخة التي دمرت قلوب كاكوزو', ['S', 'A', 'C', 'B', 'S+'], 90, 82, ['KONOHA', 'JINCHURIKI', 'TEAM7'], '#F59E0B', 'konoha'],
  ['sasuke_early_shippuden', 'ساسكي (بداية شيبودن)', 'قرية الصوت', 'A', 'رمح التشيدوري الممتد · سيف كوساناغي الكهربائي', 'سرعة خاطفة وتفوق تكتيكي', ['S', 'A', 'A', 'S', 'A'], 89, 88, ['UCHIHA', 'DOJUTSU'], '#6366F1', 'uchiha'],
  ['kabuto_part1', 'كابوتو ياكوشي (مشرط التشاكرا)', 'قرية الصوت', 'A', 'مشرط التشاكرا القاطع للعضلات · تجدد الخلايا', 'الذراع اليمنى لأوروتشيمارو بمستوى كاكاشي', ['A', 'A', 'A', 'S', 'A'], 88, 91, ['MEDICAL'], '#9333EA', 'sage'],
  ['baki_wind_blade', 'باكي (نخبة الرمل)', 'قرية الرمل', 'A', 'سيف الرياح غير المرئي القاطع للدروع', 'قائد قوات الرمل في غزو كونوها', ['A', 'A', 'B', 'A', 'A'], 87, 83, ['SUNA'], '#D97706', 'suna'],

  // ================= B TIER (45 شينوبي متمرس وأطوار الجزء الأول - الريت الخفي 42 إلى 86) =================
  ['torune_aburame', 'توروني أبوراني (الجذور)', 'أنبو الجذور', 'B', 'حشرات الرينكايتشو النانوية السامة', 'السم الخلوي الفوري عند اللمس', ['A', 'B', 'B', 'A', 'B'], 86, 80, ['KONOHA'], '#6366F1', 'konoha'],
  ['fu_yamanaka', 'فو ياماناكا (الجذور)', 'أنبو الجذور', 'B', 'فخ تحويل العقل عبر الدمية الملعونة', 'حارس دانزو وخبير فخاخ العقل', ['B', 'B', 'A', 'A', 'B'], 85, 81, ['KONOHA'], '#F97316', 'konoha'],
  ['ao_byakugan', 'آو (حامل البياكوغان)', 'قرية الضباب', 'B', 'تعويذة فخ قذيفة الماء · كشف الأوهام', 'صائد الأنبو وحارس الميزوكاجي', ['B', 'B', 'A', 'A', 'B'], 84, 82, ['MIST', 'DOJUTSU'], '#0284C7', 'mist'],
  ['genma_shiranui', 'غينما شيرانوي', 'حرس الهوكاجي', 'B', 'إبرة السينبون المشبعة بالتشاكرا', 'حارس الهوكاجي الرابع المتمرس', ['B', 'A', 'B', 'A', 'B'], 83, 78, ['KONOHA'], '#64748B', 'konoha'],
  ['raido_namiashi', 'رايدو نامياشي', 'حرس الهوكاجي', 'B', 'سيف كوكوتو الأسود المسموم', 'الاغتيال التعاوني مع غينما', ['B', 'A', 'C', 'B', 'B'], 82, 75, ['KONOHA'], '#475569', 'konoha'],
  ['naruto_valley_one_tail', 'ناروتو (رداء الذيل الواحد)', 'قرية كونوها', 'B', 'راسينغان الكيوبي القرمزية', 'مواجهة وادي النهاية الأولى', ['A', 'A', 'C', 'C', 'S'], 81, 70, ['KONOHA', 'JINCHURIKI', 'TEAM7'], '#EF4444', 'konoha'],
  ['sasuke_valley_curse2', 'ساسكي (وادي النهاية - الجزء 1)', 'قرية كونوها', 'B', 'تشيدوري الأجنحة السوداء (الختم الملعون 2)', 'تفتح الشارينغان ثلاثية الفواصل', ['A', 'A', 'B', 'A', 'A'], 80, 79, ['KONOHA', 'UCHIHA', 'TEAM7', 'DOJUTSU'], '#4F46E5', 'uchiha'],
  ['gaara_chunin_shukaku', 'غارا (تحول شوكاكو الجزئي)', 'قرية الرمل', 'B', 'تابوت الصحراء الرملي · مخلب شوكاكو', 'الرعب المطلق في امتحانات التشونين', ['A', 'B', 'C', 'B', 'S'], 79, 73, ['SUNA', 'JINCHURIKI'], '#D97706', 'suna'],
  ['rock_lee_chunin_weights', 'روك لي (خلع الأثقال - البوابة 5)', 'قرية كونوها', 'B', 'اللوتس الأمامي والخفي السريع', 'السرعة التي اخترقت رمال غارا', ['C', 'S', 'C', 'B', 'B'], 78, 74, ['KONOHA', 'TAIJUTSU'], '#10B981', 'konoha'],
  ['neji_chunin_exams', 'نيجي هيوغا (امتحان التشونين)', 'قرية كونوها', 'B', 'إغلاق 64 نقطة تشاكرا · كايتن', 'أقوى جينين في دفعة كونوها', ['B', 'A', 'C', 'A', 'B'], 77, 79, ['KONOHA', 'DOJUTSU', 'TAIJUTSU'], '#94A3B8', 'konoha'],
  ['omoi_cloud', 'أوموي', 'قرية السحاب', 'B', 'أسلوب سيف السحاب: الضربة الهلالية الخادعة', 'مبارز السحاب وتلميذ كيلر بي', ['B', 'A', 'B', 'B', 'B'], 76, 76, ['LIGHTNING'], '#FACC15', 'lightning'],
  ['kiba_shippuden', 'كيبا إينوزوكا (الذئب ذو الرأسين)', 'قرية كونوها', 'B', 'التحول للذئب العملاق · غاتسوغا', 'الهجوم الدوراني الخارق مع أكامارو', ['B', 'A', 'C', 'C', 'B'], 75, 68, ['KONOHA'], '#B45309', 'konoha'],
  ['sakon_ukon', 'ساكون وأوكون (المستوى 2)', 'قرية الصوت', 'B', 'بوابة راشومون · الاندماج الطفيلي', 'قائد رباعي الصوت المخلص لأوروتشيمارو', ['B', 'A', 'C', 'B', 'B'], 74, 72, ['SAGE'], '#A855F7', 'sage'],
  ['kidomaru_curse2', 'كيدومارو (المستوى 2)', 'قرية الصوت', 'B', 'قوس الحرب العنكبوتي الذهبي · درع الصمغ', 'قنص مميت بدقة 100% من الغابة', ['B', 'B', 'C', 'A', 'B'], 73, 78, ['SAGE'], '#F59E0B', 'sage'],
  ['tayuya_curse2', 'تايويا (المستوى 2)', 'قرية الصوت', 'B', 'مزمار الوهم الشيطاني: السلاسل الصوتية', 'غينجتسو سمعي يشل حركة الخصم', ['B', 'C', 'A', 'A', 'B'], 72, 76, ['SAGE'], '#F43F5E', 'sage'],
  ['jirobo_curse2', 'جيروبو (المستوى 2)', 'قرية الصوت', 'B', 'قوة الختم الملعون العشر أضعاف · رفع الصخور', 'القوة البدنية الغاشمة لرباعي الصوت', ['C', 'A', 'C', 'C', 'B'], 71, 60, ['SAGE', 'TAIJUTSU'], '#D97706', 'suna'],
  ['shizune_medical', 'شيزوني', 'قرية كونوها', 'B', 'ضباب السم القاتل · إبر السينبون المخدرة', 'قائدة الفريق الطبي في كونوها', ['B', 'B', 'B', 'A', 'B'], 70, 81, ['KONOHA', 'MEDICAL'], '#10B981', 'konoha'],
  ['ank_mitarashi', 'أنكو ميتاراشي', 'قرية كونوها', 'B', 'أيدي الظل الخفية للأفاعي · موت الأفعى المزدوج', 'تلميذة أوروتشيمارو السابقة', ['B', 'B', 'B', 'B', 'B'], 69, 73, ['KONOHA'], '#9333EA', 'konoha'],
  ['karin_uzumaki', 'كارين أوزوماكي', 'فريق تاكا', 'B', 'عين ميندان الاستشعارية · سلاسل الأوزوماكي', 'الاستشعار بعيد المدى والشفاء الفوري', ['B', 'C', 'B', 'A', 'S'], 68, 77, ['MEDICAL'], '#EF4444', 'sage'],
  ['ibiki_morino', 'إيبيكي مورينو', 'استجواب كونوها', 'B', 'غرفة التعذيب الحديدية واستجواب العقل', 'قائد فرقة التحقيق والتعذيب النفسي', ['B', 'B', 'A', 'A', 'B'], 67, 82, ['KONOHA'], '#475569', 'konoha'],
  ['samui_cloud', 'ساموي', 'قرية السحاب', 'B', 'القتال التكتيكي بالتانتو القصير', 'قائدة فريق السحاب الهادئة', ['B', 'B', 'B', 'A', 'B'], 66, 79, ['LIGHTNING'], '#38BDF8', 'lightning'],
  ['atsui_cloud', 'أتسوي (أسلوب اللهب)', 'قرية السحاب', 'B', 'أسلوب السحاب: ضربة اللهب الحارقة بالسيف', 'شقيق ساموي المندفع', ['B', 'A', 'C', 'C', 'B'], 65, 66, ['LIGHTNING'], '#F97316', 'lightning'],
  ['karui_cloud', 'كاروي', 'قرية السحاب', 'B', 'أسلوب السحاب: القاطع الأمامي العنيف', 'تلميذة كيلر بي القوية', ['B', 'A', 'C', 'C', 'B'], 64, 68, ['LIGHTNING'], '#EF4444', 'lightning'],
  ['yugao_uzuki', 'يوغاو أوزوكي', 'أنبو كونوها', 'B', 'ضوء القمر الضبابي بالسيف', 'مقاتلة الأنبو البارعة في الكينجتسو', ['B', 'A', 'B', 'B', 'B'], 63, 74, ['KONOHA'], '#818CF8', 'konoha'],
  ['hayate_gekko', 'هاياتي غيكو', 'قرية كونوها', 'B', 'رقصة الهلال القمري بالسيف', 'ممتحن التصفيات التمهيدية ومبارز السيف', ['B', 'A', 'B', 'B', 'C'], 62, 73, ['KONOHA'], '#38BDF8', 'konoha'],
  ['ino_war_arc', 'إينو ياماناكا', 'قرية كونوها', 'B', 'نقل العقل والتخاطر الميداني الشامل', 'ربط عقول جيش التحالف وتوجيه الضربات', ['B', 'C', 'A', 'A', 'B'], 61, 82, ['KONOHA', 'MEDICAL'], '#C084FC', 'konoha'],
  ['tenten_bashosen', 'تين تين (مروحة الباشوسين)', 'قرية كونوها', 'B', 'مروحة حكيم المسارات للعناصر الخمسة', 'تدمير أقنعة كاكوزو بعناصر الطبيعة', ['A', 'B', 'C', 'B', 'B'], 60, 73, ['KONOHA'], '#F43F5E', 'konoha'],
  ['suikazan_fuguki', 'فوغوكي سويكازان', 'قرية الضباب', 'B', 'إبر الشعر الفولاذية · المالك السابق لساميهادا', 'معلم كيسامي السابق وأحد سيافي الضباب', ['B', 'A', 'C', 'B', 'A'], 59, 71, ['MIST'], '#0284C7', 'mist'],
  ['jinin_akebino', 'جينين أكيبينو', 'قرية الضباب', 'B', 'سيف الخوذة (كابوتواري): المطرقة والفأس', 'السيف الذي يحطم أي دفاع أرضي', ['B', 'A', 'C', 'B', 'B'], 58, 70, ['MIST'], '#64748B', 'mist'],
  ['raiga_kurosuki', 'رايغا كوروسوكي', 'قرية الضباب', 'B', 'جنازة صواعق الرعد بالسيفين', 'استدعاء الصواعق الطبيعية من السماء', ['A', 'B', 'C', 'C', 'B'], 57, 67, ['MIST', 'LIGHTNING'], '#EAB308', 'lightning'],
  ['chiyo_brother_ebizo', 'المستشار إيبيزو', 'قرية الرمل', 'B', 'التخطيط الاستراتيجي وحكمة الرمل القديمة', 'شقيق الجدة تشيو ومستشار الكازيكاجي', ['B', 'C', 'B', 'S', 'B'], 56, 86, ['SUNA', 'STRATEGIST'], '#94A3B8', 'suna'],
  ['kankuro_chunin', 'كانكورو (امتحان التشونين)', 'قرية الرمل', 'B', 'فخ دمية كارسو (الغراب) الخانق', 'المتحكم بالدمى في غزو الرمل', ['B', 'C', 'C', 'B', 'B'], 55, 72, ['SUNA'], '#9333EA', 'suna'],
  ['temari_chunin', 'تيماري (امتحان التشونين)', 'قرية الرمل', 'B', 'أقمار المروحة الثلاثة: عاصفة الرياح القاطعة', 'تفوق جوي كاسح على الأسلحة', ['B', 'C', 'C', 'A', 'B'], 54, 76, ['SUNA'], '#14B8A6', 'suna'],
  ['shikamaru_chunin', 'شيكامارو (التشونين الوحيد)', 'قرية كونوها', 'B', 'محاكاة الظل التكتيكية عبر أنفاق الأرض', 'الوحيد الذي ترقى لتشونين بذكائه', ['B', 'C', 'B', 'S+', 'C'], 53, 94, ['KONOHA', 'STRATEGIST'], '#64748B', 'konoha'],
  ['shino_chunin', 'شينو أبوراني (امتحان التشونين)', 'قرية كونوها', 'B', 'سرب حشرات الكيكايشو وسد فوهات الهواء', 'الذي هزم زاكو وكانكورو تكتيكياً', ['B', 'C', 'C', 'A', 'B'], 52, 81, ['KONOHA'], '#475569', 'konoha'],
  ['sasuke_chunin_chidori', 'ساسكي (التشيدوري الأولى)', 'قرية كونوها', 'B', 'تشيدوري: ألف طائر · سرعة روك لي المنسوخة', 'النسخة التي اخترقت دفاع غارا الرملي', ['B', 'A', 'C', 'A', 'B'], 51, 77, ['KONOHA', 'UCHIHA', 'TEAM7', 'DOJUTSU'], '#3B82F6', 'uchiha'],
  ['naruto_chunin_gamabunta', 'ناروتو (امتحان التشونين)', 'قرية كونوها', 'B', 'استدعاء الزعيم غامابونتا · ألف نسخة ظل', 'الفتى الذي هزم نيجي وغارا في الامتحان', ['B', 'B', 'C', 'C', 'S'], 50, 68, ['KONOHA', 'JINCHURIKI', 'TEAM7'], '#F97316', 'konoha'],
  ['sakura_early_shippuden', 'ساكورا (معركة ساسوري)', 'قرية كونوها', 'B', 'ترياق سم ساسوري · قبضة تحطيم دمية الكازيكاجي', 'بداية تألقها كنينجا طبي مقاتل', ['B', 'A', 'B', 'A', 'B'], 49, 80, ['KONOHA', 'TEAM7', 'MEDICAL'], '#F43F5E', 'konoha'],
  ['sai_root_intro', 'ساي (عميل الجذور السري)', 'أنبو الجذور', 'B', 'حبر الوحوش المرسومة · الاغتيال بلا مشاعر', 'أقوى جيل شاب في منظمة الجذور', ['A', 'B', 'C', 'A', 'B'], 48, 79, ['KONOHA'], '#64748B', 'konoha'],
  ['aoba_yamashiro', 'أوبا ياماشيرو', 'قرية كونوها', 'B', 'تشتيت سرب الغربان السوداء · إبرة الحجر', 'جونين كونوها المتمرس في قراءة العقول', ['B', 'B', 'B', 'A', 'B'], 47, 78, ['KONOHA'], '#334155', 'konoha'],
  ['ensui_nara', 'إينسوي نارا', 'قرية كونوها', 'B', 'تقييد الظل المتقدم في فرقة الكاكاشي', 'نخبة عشيرة نارا في الحرب', ['B', 'C', 'B', 'A', 'B'], 46, 80, ['KONOHA'], '#475569', 'konoha'],
  ['santa_yamanaka', 'سانتا ياماناكا', 'قرية كونوها', 'B', 'تقنية تبديل مسار العقل المضللة', 'مقاتل عشيرة ياماناكا في الحرب', ['B', 'C', 'A', 'A', 'B'], 45, 77, ['KONOHA'], '#A855F7', 'konoha'],
  ['motoi_cloud', 'موتوي', 'قرية السحاب', 'B', 'شبكة العنكبوت البرقية المائية المقيدة', 'صديق كيلر بي وحارس جزيرة السلحفاة', ['B', 'B', 'C', 'A', 'B'], 44, 74, ['LIGHTNING'], '#0284C7', 'lightning'],
  ['maki_cloth_seal', 'ماكي (فرقة الختم)', 'قرية الرمل', 'B', 'تقنية ختم القماش المحنط المقيد للإيدو تينسي', 'تلميذة باكورا وخبيرة أختام الرمل', ['B', 'C', 'C', 'A', 'B'], 43, 76, ['SUNA'], '#D97706', 'suna'],
  ['ittan_earth_trench', 'إيتان (خنادق الأرض)', 'قرية الصخر', 'B', 'عنصر الأرض: تحريك القشرة الأرضية الميداني', 'خبير تغيير التضاريس لحماية الحلفاء', ['A', 'C', 'C', 'B', 'B'], 42, 72, [], '#B45309', 'suna'],

  // ================= C TIER (27 شينوبي مبتدئ / فخ اللاعب الخفي - الريت الخفي 15 إلى 41) =================
  ['choji_part1_pills', 'تشوجي (حبوب الفلفل الثلاث)', 'قرية كونوها', 'C', 'الحبة الحمراء: كرة اللحم البشرية الشائكة', 'الذي هزم جيروبو في مهمة استعادة ساسكي', ['C', 'B', 'C', 'C', 'B'], 41, 58, ['KONOHA'], '#F97316', 'konoha'],
  ['kiba_part1', 'كيبا إينوزوكا (الجزء الأول)', 'قرية كونوها', 'C', 'ناب فوق ناب (غاتسوغا) مع أكامارو الصغير', 'سرعة وحاسة شم في امتحان التشونين', ['C', 'B', 'C', 'C', 'C'], 40, 56, ['KONOHA'], '#B45309', 'konoha'],
  ['hinata_part1', 'هيناتا هيوغا (الجزء الأول)', 'قرية كونوها', 'C', 'القبضة الناعمة الأساسية والبياكوغان', 'عزيمة عدم الاستسلام أمام نيجي', ['C', 'B', 'C', 'B', 'C'], 39, 60, ['KONOHA', 'DOJUTSU'], '#818CF8', 'konoha'],
  ['tenten_part1', 'تين تين (الجزء الأول)', 'قرية كونوها', 'C', 'استدعاء الكوناي والشوريكن المزدوج', 'دقة إصابة الأهداف من اللفافات', ['C', 'B', 'C', 'B', 'C'], 38, 61, ['KONOHA'], '#F43F5E', 'konoha'],
  ['dosu_kinuta', 'دوسو كينوتا', 'قرية الصوت', 'C', 'مكبر الصوت الرنيني محطم التوازن الداخلي', 'قائد ثلاثي الصوت في امتحان التشونين', ['B', 'C', 'C', 'B', 'C'], 37, 65, [], '#64748B', 'sage'],
  ['konohamaru_pain_arc', 'كونوهامارو (ضد مسار باين)', 'قرية كونوها', 'C', 'الراسينغان المفاجئة بعد خدعة نسخ الظل', 'الفتى الذي أسقط مسار الجحيم لباين', ['B', 'C', 'C', 'B', 'B'], 36, 64, ['KONOHA'], '#FB923C', 'konoha'],
  ['izumo_kamizuki', 'إيزومو كاميزوكي', 'بوابة كونوها', 'C', 'حقل شراب الماء اللزج المقيد للحركة', 'حارس بوابة كونوها مع كوتيتسو', ['B', 'C', 'C', 'B', 'C'], 35, 63, ['KONOHA'], '#0284C7', 'konoha'],
  ['kotetsu_hagane', 'كوتيتسو هاغاني', 'بوابة كونوها', 'C', 'هراوة الصدفة العملاقة المستدعاة', 'حارس بوابة كونوها المخلص', ['C', 'B', 'C', 'B', 'C'], 34, 62, ['KONOHA'], '#64748B', 'konoha'],
  ['iruka_umino', 'إيروكا أومينو', 'قرية كونوها', 'C', 'حاجز التقييد الأساسي ورمي الشوريكن', 'معلم الأكاديمية وأول من اعترف بناروتو', ['C', 'C', 'C', 'A', 'C'], 33, 66, ['KONOHA'], '#64748B', 'konoha'],
  ['meizu_demon_brother', 'ميزو (الأخوان الشيطانيان)', 'قرية الضباب', 'C', 'سلسلة المخلب الحديدي السام المزدوجة', 'قاتل مأجور تحت إمرة زابوزا', ['C', 'B', 'C', 'C', 'C'], 32, 54, ['MIST'], '#0284C7', 'mist'],
  ['gozu_demon_brother', 'غوزو (الأخوان الشيطانيان)', 'قرية الضباب', 'C', 'كمين بركة الماء وتمزيق الأهداف بالسلسلة', 'شقيق ميزو في فرقة اغتيال الضباب', ['C', 'B', 'C', 'C', 'C'], 31, 54, ['MIST'], '#0284C7', 'mist'],
  ['zaku_abumi', 'زاكو أبومي', 'قرية الصوت', 'C', 'موجات الهواء القاطعة فوق الصوتية من الكفين', 'جينين قرية الصوت المندفع', ['B', 'C', 'C', 'C', 'C'], 30, 50, [], '#94A3B8', 'sage'],
  ['yoroi_akado', 'يوروي أكادو', 'قرية الصوت', 'C', 'امتصاص التشاكرا باللمس المباشر للكف', 'جاسوس كابوتو الذي واجه ساسكي', ['C', 'C', 'C', 'C', 'B'], 29, 52, [], '#475569', 'mist'],
  ['ebisu_tokubetsu', 'إيبيسو', 'قرية كونوها', 'C', 'كرات النار التعليمية والمشي على الماء', 'المدرب الخاص للأساسيات', ['C', 'C', 'C', 'B', 'C'], 28, 60, ['KONOHA'], '#475569', 'konoha'],
  ['misumi_tsurugi', 'ميسومي تسوروغي', 'قرية الصوت', 'C', 'التفاف المفاصل المرن الخانق حول الخصم', 'رفيق يوروي وكابوتو في الامتحان', ['C', 'C', 'C', 'C', 'C'], 27, 51, [], '#64748B', 'mist'],
  ['oboro_rain_genin', 'أوبورو (جينين المطر)', 'قرية المطر', 'C', 'وهم نسخ الضباب المائي تحت الأرض', 'منافس الفريق السابع في غابة الموت', ['C', 'C', 'B', 'C', 'C'], 26, 55, [], '#0284C7', 'mist'],
  ['shigure_rain_umbrella', 'شيغوري (مظلات الإبر)', 'قرية المطر', 'C', 'مطر إبر السينبون المعدنية المتساقطة', 'جينين المطر الذي واجه غارا', ['C', 'C', 'C', 'C', 'C'], 25, 52, [], '#38BDF8', 'mist'],
  ['kin_tsuchi', 'كين تسوتشي', 'قرية الصوت', 'C', 'وهم إبر الأجراس المخادعة بخيوط خفية', 'جينين قرية الصوت في غابة الموت', ['C', 'C', 'B', 'C', 'C'], 24, 54, [], '#A855F7', 'sage'],
  ['ino_part1', 'إينو ياماناكا (الجزء الأول)', 'قرية كونوها', 'C', 'نقل العقل الأساسي وفخ خصلات الشعر', 'منافسة ساكورا في امتحان التشونين', ['C', 'C', 'B', 'B', 'C'], 23, 58, ['KONOHA'], '#C084FC', 'konoha'],
  ['sakura_part1', 'ساكورا هارونو (الجزء الأول)', 'قرية كونوها', 'C', 'تحكم دقيق بالتشاكرا وفك الأوهام الأساسية', 'بداية رحلتها في الفريق السابع', ['C', 'C', 'B', 'A', 'C'], 22, 62, ['KONOHA', 'TEAM7'], '#F43F5E', 'konoha'],
  ['naruto_academy', 'ناروتو (طالب الأكاديمية)', 'قرية كونوها', 'C', 'نسخ الظل الأولى من المخطوطة المحرمة', 'الفتى المشاغب قبل حصوله على حامية الجبين', ['C', 'C', 'C', 'C', 'A'], 21, 45, ['KONOHA', 'JINCHURIKI'], '#F97316', 'konoha'],
  ['mizuki_traitor', 'ميزوكي', 'قرية كونوها', 'C', 'الشوريكن الدوار الكبير', 'لص المخطوطة المحرمة المهزوم في الحلقة الأولى', ['C', 'C', 'C', 'C', 'C'], 20, 48, [], '#475569', 'mist'],
  ['konohamaru_academy', 'كونوهامارو (طفل الوشاح الأزرق)', 'قرية كونوها', 'C', 'الاختباء المضحك خلف القماش المموه', 'الحفيد الصغير للهوكاجي الثالث', ['C', 'C', 'C', 'C', 'C'], 19, 42, ['KONOHA'], '#FB923C', 'konoha'],
  ['moegi_genin', 'مويغي (الأكاديمية)', 'قرية كونوها', 'C', 'فريق كونوهامارو المبتدئ', 'طالبة الأكاديمية الصغيرة', ['C', 'C', 'C', 'C', 'C'], 18, 50, ['KONOHA'], '#F43F5E', 'konoha'],
  ['udon_genin', 'أودون (الأكاديمية)', 'قرية كونوها', 'C', 'حسابات الزوايا المبتدئة', 'طالب الأكاديمية الصغير', ['C', 'C', 'C', 'B', 'C'], 17, 51, ['KONOHA'], '#38BDF8', 'konoha'],
  ['zori_bodyguard', 'زوري (حارس غاتو)', 'بلاد الأمواج', 'C', 'سيف الساموراي المأجور', 'حارس غاتو الذي هزمه ناروتو بسهولة', ['C', 'C', 'C', 'C', 'C'], 16, 40, [], '#64748B', 'mist'],
  ['waraji_bodyguard', 'واراجي (حارس غاتو)', 'بلاد الأمواج', 'C', 'ضربة السيف السريعة للمرتزقة', 'رفيق زوري في حراسة غاتو', ['C', 'C', 'C', 'C', 'C'], 15, 40, [], '#64748B', 'mist'],
];

const CARD_IMAGE_MODULES = import.meta.glob('../assets/images/card_*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const CARD_IMAGES_BY_INDEX: Record<string, string> = {};
for (const [filePath, assetUrl] of Object.entries(CARD_IMAGE_MODULES)) {
  const match = filePath.match(/card_(\d{3})_/);
  if (match) {
    CARD_IMAGES_BY_INDEX[match[1]] = assetUrl;
  }
}

const CANONICAL_VILLAGE_MAP: Record<string, string> = {
  'قرية كونوها': 'Konoha',
  'مؤسس كونوها': 'Konoha',
  'عشيرة الأوتسوتسوكي': 'Otsutsuki',
  'الأكاتسوكي / كونوها': 'Konoha',
  'الأكاتسوكي / المطر': 'Rain',
  'الأكاتسوكي': 'Akatsuki',
  'الأكاتسوكي / الضباب': 'Mist',
  'الأكاتسوكي / الرمل': 'Sand',
  'الأكاتسوكي / الصخر': 'Stone',
  'الأكاتسوكي / الشلال': 'Waterfall',
  'الأكاتسوكي / الينابيع': 'Hot Water',
  'قرية الصوت': 'Sound',
  'قرية الصخر': 'Stone',
  'قرية الضباب': 'Mist',
  'قرية السحاب': 'Cloud',
  'قرية الرمل': 'Sand',
  'قرية المطر': 'Rain',
  'قرية الشلال': 'Waterfall',
  'فريق تاكا': 'Konoha',
  'فريق تاكا / الضباب': 'Mist',
  'فريق هيبي': 'Konoha',
  'السانين': 'Konoha',
  'السانين / الصوت': 'Sound',
  'جذور كونوها': 'Konoha',
  'أنبو الجذور': 'Konoha',
  'أنبو الجذور / كونوها': 'Konoha',
  'أنبو كونوها': 'Konoha',
  'حرس الهوكاجي': 'Konoha',
  'استجواب كونوها': 'Konoha',
  'بوابة كونوها': 'Konoha',
  'بلاد الحديد': 'Iron',
  'بلاد النار': 'Konoha',
  'بلاد الأمواج': 'Waves',
  'تجارب أوروتشيمارو': 'Sound',
};

const EVIL_CHARACTER_IDS = new Set<string>([
  'isshiki_otsutsuki',
  'kaguya_otsutsuki',
  'madara_rikudo',
  'momoshiki_fused',
  'obito_juubi',
  'indra_otsutsuki',
  'madara_edo_tensei',
  'madara_ems_valley',
  'obito_white_mask',
  'pain_six_paths',
  'kabuto_dragon_sage',
  'toneri_tenseigan',
  'kinshiki_otsutsuki',
  'urashiki_otsutsuki',
  'obito_orange_mask',
  'sasuke_ms_taka',
  'kisame_fused_samehada',
  'hanzo_salamander',
  'danzo_izanagi',
  'sasori_hundred_puppets',
  'kakuzu_five_hearts',
  'deidara_c4_karura',
  'konan_paper_ocean',
  'orochimaru_sannin',
  'kinkaku_nine_tails',
  'ginkaku_nine_tails',
  'shin_uchiha',
  'kimimaro_curse_mark',
  'hidan_jashin',
  'zabuza_momochi',
  'haku_ice_mirrors',
  'pakura_scorch',
  'gari_explosion',
  'kushimaru_nuibari',
  'ameyuri_ringo',
  'jinpachi_munashi',
  'kabuto_part1',
  'sakon_ukon',
  'kidomaru_curse2',
  'tayuya_curse2',
  'jirobo_curse2',
  'suikazan_fuguki',
  'jinin_akebino',
  'raiga_kurosuki',
  'dosu_kinuta',
  'meizu_demon_brother',
  'gozu_demon_brother',
  'zaku_abumi',
  'yoroi_akado',
  'misumi_tsurugi',
  'oboro_rain_genin',
  'shigure_rain_umbrella',
  'kin_tsuchi',
  'mizuki_traitor',
  'zori_bodyguard',
  'waraji_bodyguard',
]);

function deriveCharacterGroups(
  id: string,
  villageAr: string,
  synergyTags: string[]
): string[] {
  const groupSet = new Set<string>();

  if (synergyTags.includes('TEAM7') || id.startsWith('naruto_') || id.startsWith('sasuke_') || id.startsWith('sakura_') || id.startsWith('kakashi_') || id.startsWith('sai_') || id === 'yamato_wood_style') {
    groupSet.add('Team 7');
  }
  if (synergyTags.includes('AKATSUKI') || villageAr.includes('الأكاتسوكي') || ['pain_six_paths', 'nagato_edo_prime', 'konan_paper_ocean', 'itachi_uchiha', 'kisame_fused_samehada', 'sasori_hundred_puppets', 'deidara_c4_karura', 'kakuzu_five_hearts', 'hidan_jashin', 'obito_orange_mask', 'obito_white_mask', 'obito_juubi'].includes(id)) {
    groupSet.add('Akatsuki');
  }
  if (synergyTags.includes('UCHIHA') || id.includes('uchiha') || id.startsWith('sasuke_') || id.startsWith('itachi_') || id.startsWith('madara_') || id.startsWith('obito_')) {
    groupSet.add('Uchiha Clan');
  }
  if (synergyTags.includes('KAGE')) {
    groupSet.add('Kage');
  }
  if (synergyTags.includes('JINCHURIKI')) {
    groupSet.add('Jinchuriki');
  }
  if (synergyTags.includes('SANNIN') || id.startsWith('jiraiya_') || id.startsWith('tsunade_') || id.startsWith('orochimaru_')) {
    groupSet.add('Legendary Sannin');
  }
  if (synergyTags.includes('OTSUTSUKI') || id.includes('otsutsuki') || id === 'toneri_tenseigan') {
    groupSet.add('Otsutsuki Clan');
  }
  if (synergyTags.includes('SAGE')) {
    groupSet.add('Sage Arts');
  }
  if (villageAr.includes('تاكا') || villageAr.includes('هيبي') || ['sasuke_ms_taka', 'sasuke_hebi_curse', 'suigetsu_hozuki', 'jugo_curse_mark2', 'karin_uzumaki'].includes(id)) {
    groupSet.add('Team Taka');
  }
  if (['zabuza_momochi', 'kisame_fused_samehada', 'mangetsu_hozuki', 'suigetsu_hozuki', 'chojuro_mizukage', 'kushimaru_nuibari', 'ameyuri_ringo', 'jinpachi_munashi', 'suikazan_fuguki', 'jinin_akebino', 'raiga_kurosuki'].includes(id)) {
    groupSet.add('Seven Ninja Swordsmen');
  }
  if (['kimimaro_curse_mark', 'sakon_ukon', 'kidomaru_curse2', 'tayuya_curse2', 'jirobo_curse2', 'dosu_kinuta', 'zaku_abumi', 'kin_tsuchi', 'yoroi_akado', 'misumi_tsurugi', 'kabuto_part1', 'kabuto_dragon_sage'].includes(id)) {
    groupSet.add('Sound Ninja');
  }
  if (['shikamaru_war_strategist', 'shikamaru_chunin', 'choji_butterfly_war', 'choji_part1_pills', 'ino_war_arc', 'ino_part1', 'asuma_sarutobi', 'shikaku_nara', 'inoichi_yamanaka', 'choza_akimichi', 'ensui_nara', 'santa_yamanaka'].includes(id)) {
    groupSet.add('Ino-Shika-Cho');
  }
  if (['might_guy_eight_gates', 'might_guy_seventh_gate', 'rock_lee_sixth_gate', 'rock_lee_chunin_weights', 'neji_war_jonin', 'neji_chunin_exams', 'tenten_bashosen', 'tenten_part1'].includes(id)) {
    groupSet.add('Team Guy');
  }
  if (['kurenai_yuhi', 'hinata_war_twin_lions', 'hinata_part1', 'kiba_shippuden', 'kiba_part1', 'shino_war_arc', 'shino_chunin', 'hiashi_hyuga', 'hizashi_hyuga', 'shibi_aburame', 'tsume_inuzuka'].includes(id)) {
    groupSet.add('Team 8 & Konoha Clans');
  }
  if (['gaara_war_commander', 'gaara_chunin_shukaku', 'temari_war_arc', 'temari_chunin', 'kankuro_sasori_puppet', 'kankuro_chunin', 'baki_wind_blade', 'chiyo_ten_puppets', 'chiyo_brother_ebizo', 'maki_cloth_seal'].includes(id)) {
    groupSet.add('Sand Siblings & Suna');
  }
  if (villageAr.includes('أنبو') || villageAr.includes('جذور') || ['kakashi_anbu', 'yamato_wood_style', 'sai_war_arc', 'sai_root_intro', 'danzo_izanagi', 'torune_aburame', 'fu_yamanaka', 'yugao_uzuki', 'itachi_uchiha', 'shisui_uchiha'].includes(id)) {
    groupSet.add('ANBU');
  }

  if (groupSet.size === 0) {
    const fallbackVillage = CANONICAL_VILLAGE_MAP[villageAr] || 'Shinobi Alliance';
    groupSet.add(`${fallbackVillage} Forces`);
  }

  return Array.from(groupSet);
}

export const SHINOBI_ROSTER: ShinobiCharacter[] = RAW_200_SHINOBI.map((entry, idx) => {
  const [
    id,
    nameAr,
    villageAr,
    rankCode,
    signatureJutsuAr,
    specialtyAr,
    [ninjutsu, taijutsu, genjutsu, intelligence, chakra],
    hiddenRate,
    tacticalMastery,
    synergyTags,
    motifColor,
    emblemType,
  ] = entry;

  const [nameEn, signatureJutsuEn] = EN_NAME_JUTSU_MAP[id] || [id, signatureJutsuAr];
  const villageEn = VILLAGE_EN_MAP[villageAr] || 'Shinobi World';
  const cardKey = String(idx + 1).padStart(3, '0');
  const portraitUrl = CARD_IMAGES_BY_INDEX[cardKey] || '';

  // Map hiddenRate (15..214) to a clean 0..100 scale (approx 36.0 to 100.0) so PowerDifference thresholds (5, 10, 15, 20) work naturally across 3v3, 5v5, and 10v10
  const power = Number((30 + (hiddenRate / 214) * 70).toFixed(2));
  const alignment: AlignmentType = EVIL_CHARACTER_IDS.has(id) ? 'Evil' : 'Good';
  const village = CANONICAL_VILLAGE_MAP[villageAr] || villageEn;
  const groups = deriveCharacterGroups(id, villageAr, synergyTags);
  const group = groups[0] || village;

  return {
    id,
    nameAr,
    nameEn,
    titleAr: specialtyAr,
    villageAr,
    villageEn,
    power,
    alignment,
    village,
    group,
    groups,
    rankCode,
    rankLabelAr: RANK_LABELS_AR[rankCode],
    rankLabelEn: RANK_LABELS_EN[rankCode],
    specialtyAr,
    specialtyEn: signatureJutsuEn,
    signatureJutsuAr,
    signatureJutsuEn,
    chakraNatureAr: specialtyAr,
    classifications: {
      ninjutsu,
      taijutsu,
      genjutsu,
      intelligence,
      chakra,
    },
    hiddenCombatProfile: {
      hiddenRate,
      tacticalMastery,
      synergyTags,
    },
    motifColor,
    emblemType,
    portraitUrl,
  };
});

/**
 * Helper to split a character's name into Primary Name + Form/Subtitle in brackets
 * e.g. "ناروتو (طور الباريون)" -> { primary: "ناروتو", form: "طور الباريون" }
 */
export function splitCharacterDisplayName(fullName: string): {
  primary: string;
  form: string | null;
} {
  const openIdx = fullName.indexOf('(');
  const closeIdx = fullName.lastIndexOf(')');
  if (openIdx !== -1 && closeIdx > openIdx) {
    const primary = fullName.slice(0, openIdx).trim();
    const form = fullName.slice(openIdx + 1, closeIdx).trim();
    return { primary, form };
  }
  return { primary: fullName, form: null };
}

export function drawWeightedUniqueShinobi(
  count: number,
  options?: {
    customWeights?: Record<RankCode, number>;
    excludeIds?: string[];
  }
): ShinobiCharacter[] {
  const excludeSet = new Set(options?.excludeIds || []);
  const pool = SHINOBI_ROSTER.filter((ch) => !excludeSet.has(ch.id));
  const selected: ShinobiCharacter[] = [];
  const activeWeights = options?.customWeights || RANK_RARITY_WEIGHTS;

  const tierCounts: Record<RankCode, number> = {
    SSS: 0,
    SS: 0,
    S: 0,
    A: 0,
    B: 0,
    C: 0,
  };
  pool.forEach((ch) => {
    tierCounts[ch.rankCode] = (tierCounts[ch.rankCode] || 0) + 1;
  });

  for (let i = 0; i < count && pool.length > 0; i++) {
    const weights = pool.map(
      (ch) => activeWeights[ch.rankCode] / Math.max(1, tierCounts[ch.rankCode])
    );
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let rand = Math.random() * totalWeight;

    let chosenIndex = 0;
    for (let j = 0; j < pool.length; j++) {
      rand -= weights[j];
      if (rand <= 0) {
        chosenIndex = j;
        break;
      }
    }

    const [picked] = pool.splice(chosenIndex, 1);
    selected.push(picked);
  }

  return selected;
}

export interface ShinobiPackTheme {
  id: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  subtitleEn: string;
  tier: 'MEDIUM' | 'MYTHIC';
  spawnWeight: number;
  accentGradient: string;
  borderGlow: string;
  coverCharacterId: string;
  filterFn: (ch: ShinobiCharacter) => boolean;
}

export const SHINOBI_PACK_THEMES: ShinobiPackTheme[] = [
  // ================= MEDIUM PACKS (HIGH SPAWN PROBABILITY) =================
  {
    id: 'pack_konoha_jonin',
    nameAr: 'باك نخبة الجونين (كونوها)',
    nameEn: 'Konoha Elite Jonin Pack',
    subtitleAr: 'باك متوسط · قادة ومعلمو الورقة المخفية',
    subtitleEn: 'Medium Pack · Hidden Leaf Mentors & Jonin',
    tier: 'MEDIUM',
    spawnWeight: 18,
    accentGradient: 'from-emerald-700 via-teal-900 to-slate-950',
    borderGlow: 'border-emerald-400/80 shadow-[0_0_24px_rgba(16,185,129,0.45)]',
    coverCharacterId: 'asuma_sarutobi',
    filterFn: (ch) =>
      ch.hiddenCombatProfile.synergyTags.includes('KONOHA') &&
      (ch.rankCode === 'A' || ch.rankCode === 'B' || ch.rankCode === 'S'),
  },
  {
    id: 'pack_chunin_exams',
    nameAr: 'باك اختبارات التشونين',
    nameEn: 'Chunin Exams Arena Pack',
    subtitleAr: 'باك متوسط · مواهب الجيل الصاعد',
    subtitleEn: 'Medium Pack · Rising Rookie Shinobi',
    tier: 'MEDIUM',
    spawnWeight: 20,
    accentGradient: 'from-sky-700 via-slate-900 to-slate-950',
    borderGlow: 'border-sky-400/80 shadow-[0_0_24px_rgba(56,189,248,0.45)]',
    coverCharacterId: 'rock_lee_chunin_weights',
    filterFn: (ch) => ch.rankCode === 'A' || ch.rankCode === 'B' || ch.rankCode === 'C',
  },
  {
    id: 'pack_anbu_guards',
    nameAr: 'باك الأنبو وحرس القرى',
    nameEn: 'ANBU & Kage Guards Pack',
    subtitleAr: 'باك متوسط · فرق الاغتيال والحراسة الخاصة',
    subtitleEn: 'Medium Pack · Black Ops & Bodyguards',
    tier: 'MEDIUM',
    spawnWeight: 18,
    accentGradient: 'from-slate-700 via-indigo-950 to-slate-950',
    borderGlow: 'border-indigo-400/80 shadow-[0_0_24px_rgba(129,140,248,0.45)]',
    coverCharacterId: 'kakashi_anbu',
    filterFn: (ch) =>
      ch.rankCode === 'A' ||
      ch.rankCode === 'B' ||
      ch.villageAr.includes('أنبو') ||
      ch.villageAr.includes('حرس'),
  },
  {
    id: 'pack_sand_mist_corps',
    nameAr: 'باك سرايا الرمل والضباب',
    nameEn: 'Sand & Mist Platoon Pack',
    subtitleAr: 'باك متوسط · سيافو الضباب ومقاتلو الصحراء',
    subtitleEn: 'Medium Pack · Mist Swordsmen & Sand Ninjas',
    tier: 'MEDIUM',
    spawnWeight: 18,
    accentGradient: 'from-cyan-700 via-stone-900 to-slate-950',
    borderGlow: 'border-cyan-400/80 shadow-[0_0_24px_rgba(34,211,238,0.45)]',
    coverCharacterId: 'zabuza_momochi',
    filterFn: (ch) =>
      (ch.emblemType === 'mist' || ch.emblemType === 'suna') &&
      (ch.rankCode === 'A' || ch.rankCode === 'B' || ch.rankCode === 'S'),
  },
  {
    id: 'pack_sound_clans',
    nameAr: 'باك قرية الصوت والعشائر',
    nameEn: 'Sound Four & Clans Pack',
    subtitleAr: 'باك متوسط · الختم الملعون وتقنيات العشائر',
    subtitleEn: 'Medium Pack · Curse Mark & Secret Clans',
    tier: 'MEDIUM',
    spawnWeight: 18,
    accentGradient: 'from-violet-800 via-slate-900 to-slate-950',
    borderGlow: 'border-violet-400/80 shadow-[0_0_24px_rgba(167,139,250,0.45)]',
    coverCharacterId: 'kimimaro_curse_mark',
    filterFn: (ch) =>
      ch.villageAr.includes('الصوت') ||
      ch.rankCode === 'A' ||
      ch.rankCode === 'B',
  },
  {
    id: 'pack_allied_divisions',
    nameAr: 'باك كتائب التحالف الميدانية',
    nameEn: 'Allied Field Divisions Pack',
    subtitleAr: 'باك متوسط · مقاتلو السحاب والصخر والتحالف',
    subtitleEn: 'Medium Pack · Cloud & Stone Field Shinobi',
    tier: 'MEDIUM',
    spawnWeight: 18,
    accentGradient: 'from-amber-700 via-stone-900 to-slate-950',
    borderGlow: 'border-amber-400/75 shadow-[0_0_24px_rgba(251,191,36,0.4)]',
    coverCharacterId: 'darui_fifth_raikage',
    filterFn: (ch) =>
      (ch.emblemType === 'lightning' || ch.emblemType === 'suna' || ch.emblemType === 'konoha') &&
      (ch.rankCode === 'A' || ch.rankCode === 'B' || ch.rankCode === 'C'),
  },
  {
    id: 'pack_taijutsu_weapons',
    nameAr: 'باك أسياد التايجتسو والسيوف',
    nameEn: 'Taijutsu & Blade Masters Pack',
    subtitleAr: 'باك متوسط · البوابات والقتال القريب',
    subtitleEn: 'Medium Pack · Martial Arts & Swords',
    tier: 'MEDIUM',
    spawnWeight: 15,
    accentGradient: 'from-rose-700 via-amber-950 to-slate-950',
    borderGlow: 'border-rose-400/80 shadow-[0_0_24px_rgba(251,113,133,0.5)]',
    coverCharacterId: 'rock_lee_sixth_gate',
    filterFn: (ch) =>
      ch.hiddenCombatProfile.synergyTags.includes('TAIJUTSU') ||
      ch.classifications.taijutsu === 'S+' ||
      ch.classifications.taijutsu === 'S',
  },

  // ================= MYTHIC PACKS (RARE / LOWER SPAWN PROBABILITY) =================
  {
    id: 'pack_akatsuki',
    nameAr: 'باك منظمة الأكاتسوكي الخرافي',
    nameEn: 'Mythic Akatsuki Dread Pack',
    subtitleAr: 'باك خرافي نادر ✦ أساطير الغيوم الحمراء',
    subtitleEn: 'Mythic Pack ✦ Red Cloud Legends',
    tier: 'MYTHIC',
    spawnWeight: 5,
    accentGradient: 'from-red-700 via-rose-900 to-slate-950',
    borderGlow: 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.65)]',
    coverCharacterId: 'pain_six_paths',
    filterFn: (ch) =>
      ch.hiddenCombatProfile.synergyTags.includes('AKATSUKI') || ch.emblemType === 'akatsuki',
  },
  {
    id: 'pack_uchiha',
    nameAr: 'باك عشيرة الأوتشيها والشارينغان',
    nameEn: 'Mythic Uchiha Sharingan Pack',
    subtitleAr: 'باك خرافي نادر ✦ أسياد البصر والسوسانو',
    subtitleEn: 'Mythic Pack ✦ Visual Prowess Masters',
    tier: 'MYTHIC',
    spawnWeight: 5,
    accentGradient: 'from-indigo-700 via-purple-900 to-slate-950',
    borderGlow: 'border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.65)]',
    coverCharacterId: 'madara_ems_valley',
    filterFn: (ch) =>
      ch.hiddenCombatProfile.synergyTags.includes('UCHIHA') || ch.emblemType === 'uchiha',
  },
  {
    id: 'pack_kage',
    nameAr: 'باك قمة الكاجي والزعماء',
    nameEn: 'Mythic Kage Summit Pack',
    subtitleAr: 'باك خرافي نادر ✦ حكام القرى الخمس',
    subtitleEn: 'Mythic Pack ✦ Five Kage Rulers',
    tier: 'MYTHIC',
    spawnWeight: 5,
    accentGradient: 'from-amber-500 via-orange-800 to-slate-950',
    borderGlow: 'border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.65)]',
    coverCharacterId: 'minato_hokage',
    filterFn: (ch) => ch.hiddenCombatProfile.synergyTags.includes('KAGE'),
  },
  {
    id: 'pack_jinchuriki',
    nameAr: 'باك الجينشوريكي والبيجو',
    nameEn: 'Mythic Jinchuriki Pack',
    subtitleAr: 'باك خرافي نادر ✦ طاقة الوحوش المذيلة',
    subtitleEn: 'Mythic Pack ✦ Tailed Beast Hosts',
    tier: 'MYTHIC',
    spawnWeight: 4,
    accentGradient: 'from-orange-600 via-red-800 to-slate-950',
    borderGlow: 'border-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.65)]',
    coverCharacterId: 'naruto_kcm2_sage',
    filterFn: (ch) => ch.hiddenCombatProfile.synergyTags.includes('JINCHURIKI'),
  },
  {
    id: 'pack_sage_otsutsuki',
    nameAr: 'باك الحكماء والأوتسوتسوكي',
    nameEn: 'Mythic Six Paths & Sage Pack',
    subtitleAr: 'باك خرافي نادر ✦ المسارات الستة والسينجتسو',
    subtitleEn: 'Mythic Pack ✦ Senjutsu & Otsutsuki',
    tier: 'MYTHIC',
    spawnWeight: 3,
    accentGradient: 'from-fuchsia-600 via-purple-900 to-slate-950',
    borderGlow: 'border-fuchsia-400 shadow-[0_0_30px_rgba(232,121,249,0.65)]',
    coverCharacterId: 'jiraiya_sage_mode',
    filterFn: (ch) =>
      ch.hiddenCombatProfile.synergyTags.includes('SAGE') ||
      ch.hiddenCombatProfile.synergyTags.includes('OTSUTSUKI') ||
      ch.emblemType === 'sage',
  },
];

export function pickWeightedPackThemes(count: number): ShinobiPackTheme[] {
  const result: ShinobiPackTheme[] = [];
  let lastPickedId = '';
  for (let i = 0; i < count; i++) {
    const candidates = SHINOBI_PACK_THEMES.filter((p) => p.id !== lastPickedId);
    const totalWeight = candidates.reduce((acc, p) => acc + p.spawnWeight, 0);
    let rand = Math.random() * totalWeight;
    let chosen = candidates[0];
    for (const p of candidates) {
      rand -= p.spawnWeight;
      if (rand <= 0) {
        chosen = p;
        break;
      }
    }
    lastPickedId = chosen.id;
    result.push(chosen);
  }
  return result;
}

export function drawCardsFromPackTheme(
  pack: ShinobiPackTheme,
  count: number,
  excludeIds: string[]
): ShinobiCharacter[] {
  const excludeSet = new Set(excludeIds);
  let matchingPool = SHINOBI_ROSTER.filter((ch) => !excludeSet.has(ch.id) && pack.filterFn(ch));
  if (matchingPool.length < 10) {
    const extra = SHINOBI_ROSTER.filter((ch) => !excludeSet.has(ch.id) && !pack.filterFn(ch));
    matchingPool = [...matchingPool, ...extra];
  }

  // Medium packs favor A/B/C/S ranks, while Mythic packs have higher S/SS/SSS weights
  const packRankWeights: Record<RankCode, number> =
    pack.tier === 'MEDIUM'
      ? { SSS: 1, SS: 4, S: 14, A: 34, B: 30, C: 17 }
      : { SSS: 8, SS: 18, S: 28, A: 26, B: 14, C: 6 };

  const poolCopy = [...matchingPool];
  const selected: ShinobiCharacter[] = [];

  for (let i = 0; i < count && poolCopy.length > 0; i++) {
    const weights = poolCopy.map((ch) => packRankWeights[ch.rankCode] || 10);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    let idx = 0;
    for (let j = 0; j < poolCopy.length; j++) {
      r -= weights[j];
      if (r <= 0) {
        idx = j;
        break;
      }
    }
    const [picked] = poolCopy.splice(idx, 1);
    selected.push(picked);
  }
  return selected;
}

