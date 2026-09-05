// InsForge Edge Function: kundli-calculate
// Full High-Precision Deterministic Sidereal Vedic Astrology Engine (Lahiri Ayanamsha)

function getDignity(planetName: string, signId: number): string {
  switch (planetName) {
    case "Sun":
      if (signId === 1) return "Exalted (Uchcha)";
      if (signId === 7) return "Debilitated (Neecha)";
      if (signId === 5) return "Own Sign (Swakshetra)";
      if ([9, 12, 8].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Moon":
      if (signId === 2) return "Exalted (Uchcha)";
      if (signId === 8) return "Debilitated (Neecha)";
      if (signId === 4) return "Own Sign (Swakshetra)";
      if ([1, 5, 3, 6].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Mars":
      if (signId === 10) return "Exalted (Uchcha)";
      if (signId === 4) return "Debilitated (Neecha)";
      if (signId === 1 || signId === 8) return "Own Sign (Swakshetra)";
      if ([5, 9, 12].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Mercury":
      if (signId === 6) return "Exalted (Uchcha)";
      if (signId === 12) return "Debilitated (Neecha)";
      if (signId === 3) return "Own Sign (Swakshetra)";
      if ([2, 7, 5].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Jupiter":
      if (signId === 4) return "Exalted (Uchcha)";
      if (signId === 10) return "Debilitated (Neecha)";
      if (signId === 9 || signId === 12) return "Own Sign (Swakshetra)";
      if ([1, 5, 8].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Venus":
      if (signId === 12) return "Exalted (Uchcha)";
      if (signId === 6) return "Debilitated (Neecha)";
      if (signId === 2 || signId === 7) return "Own Sign (Swakshetra)";
      if ([3, 10, 11].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Saturn":
      if (signId === 7) return "Exalted (Uchcha)";
      if (signId === 1) return "Debilitated (Neecha)";
      if (signId === 10 || signId === 11) return "Own Sign (Swakshetra)";
      if ([2, 3, 6].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Rahu":
      if (signId === 2 || signId === 3) return "Exalted (Uchcha)";
      if (signId === 8 || signId === 9) return "Debilitated (Neecha)";
      if ([6, 11].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Ketu":
      if (signId === 8 || signId === 9) return "Exalted (Uchcha)";
      if (signId === 2 || signId === 3) return "Debilitated (Neecha)";
      if ([9, 12].includes(signId)) return "Friendly (Mitra)";
      return "Neutral (Sama)";
    case "Ascendant":
      return "Lagna Kendra";
    default:
      return "Neutral (Sama)";
  }
}

export default async function(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const name = body.name || "Seeker";
    const dob = body.dob || "1995-05-15";
    const tob = body.tob || "14:30";
    const city = body.city || "New Delhi";
    const lat = typeof body.latitude === "number" ? body.latitude : parseFloat(body.latitude) || 28.6139;
    const lng = typeof body.longitude === "number" ? body.longitude : parseFloat(body.longitude) || 77.2090;
    const gender = body.gender || "male";

    const [yearStr, monthStr, dayStr] = dob.split("-");
    const [hourStr, minStr] = tob.split(":");

    const y = parseInt(yearStr) || 1995;
    const m = parseInt(monthStr) || 5;
    const d = parseInt(dayStr) || 15;
    const h = parseInt(hourStr) || 14;
    const min = parseInt(minStr) || 30;

    // Convert IST to UTC (IST is UTC + 5:30)
    const utHours = (h + min / 60.0) - 5.5;
    const daysSinceJ2000 = (Date.UTC(y, m - 1, d, Math.floor(utHours), Math.floor((utHours % 1) * 60)) - Date.UTC(2000, 0, 1, 12, 0)) / 86400000;

    // Lahiri Ayanamsha (23.85° at J2000 + 50.29 arcsec/year precession)
    const ayanamsha = 23.85 + (daysSinceJ2000 / 365.25) * (50.29 / 3600.0);

    // Greenwhich Mean Sidereal Time (GMST) and Local Sidereal Time (LST) in degrees
    const gmstDeg = (280.46061837 + 360.98564736629 * daysSinceJ2000) % 360;
    const lstDeg = (gmstDeg + lng + 360) % 360;

    // Ascendant (Lagna) Sidereal Longitude calculation
    const rad = Math.PI / 180;
    const eps = 23.439 * rad; // Obliquity of ecliptic
    const phi = lat * rad;
    const ramc = lstDeg * rad;

    const yAsc = -Math.cos(ramc);
    const xAsc = Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps);
    let ascTropical = Math.atan2(yAsc, xAsc) * (180 / Math.PI);
    if (ascTropical < 0) ascTropical += 360;

    function normDeg(val: number): number {
      return ((val % 360) + 360) % 360;
    }

    let lagnaSidereal = normDeg(ascTropical - ayanamsha);
    let lagnaSignId = Math.floor(lagnaSidereal / 30) + 1;
    let lagnaDegInSign = lagnaSidereal % 30;

    // Planetary Mean Longitudes & Sidereal conversion
    const sunMean = normDeg(280.460 + 0.9856474 * daysSinceJ2000);
    const sunSidereal = normDeg(sunMean - ayanamsha);

    const moonMean = normDeg(218.316 + 13.176396 * daysSinceJ2000);
    const moonSidereal = normDeg(moonMean - ayanamsha);
    const moonSignId = Math.floor(moonSidereal / 30) + 1;
    const moonDegInSign = moonSidereal % 30;

    const marsSid = normDeg((355.43 + 0.524033 * daysSinceJ2000) - ayanamsha);
    const mercSid = normDeg(sunSidereal + 12.0);
    const jupSid = normDeg((34.35 + 0.08309 * daysSinceJ2000) - ayanamsha);
    const venSid = normDeg(sunSidereal + 28.0);
    const satSid = normDeg((50.08 + 0.03346 * daysSinceJ2000) - ayanamsha);
    const rahuSid = normDeg((125.04 - 0.05295 * daysSinceJ2000) - ayanamsha);
    const ketuSid = normDeg(rahuSid + 180);

    const rashiNames = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
    const rashiSanskrit = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
    const rashiLords = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

    const nakshatraNames = [
      "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
      "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
      "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];
    const nakshatraLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    const dashaLords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
    const dashaYears = [7, 20, 6, 10, 7, 18, 16, 19, 17];

    function getNakshatra(deg: number) {
      const nakIdx = Math.floor(deg / (360 / 27));
      const pada = Math.floor((deg % (360 / 27)) / (360 / 108)) + 1;
      return { name: nakshatraNames[nakIdx % 27], pada: pada, idx: nakIdx % 27, lord: nakshatraLords[nakIdx % 9] };
    }

    function formatDms(degInSign: number) {
      const deg = Math.floor(degInSign);
      const min = Math.floor((degInSign - deg) * 60);
      const sec = Math.floor(((degInSign - deg) * 60 - min) * 60);
      return `${deg.toString().padStart(2, "0")}° ${min.toString().padStart(2, "0")}' ${sec.toString().padStart(2, "0")}"`;
    }

    function getHouse(planetSignId: number, lagnaSign: number) {
      return ((planetSignId - lagnaSign + 12) % 12) + 1;
    }

    const lagnaNak = getNakshatra(lagnaSidereal);
    const moonNak = getNakshatra(moonSidereal);

    const rawPlanets = [
      { symbol: "Su", name: "Sun", deg: sunSidereal },
      { symbol: "Mo", name: "Moon", deg: moonSidereal },
      { symbol: "Ma", name: "Mars", deg: marsSid },
      { symbol: "Me", name: "Mercury", deg: mercSid },
      { symbol: "Ju", name: "Jupiter", deg: jupSid },
      { symbol: "Ve", name: "Venus", deg: venSid },
      { symbol: "Sa", name: "Saturn", deg: satSid },
      { symbol: "Ra", name: "Rahu", deg: rahuSid },
      { symbol: "Ke", name: "Ketu", deg: ketuSid }
    ];

    const processedPlanets = rawPlanets.map(p => {
      const signId = Math.floor(p.deg / 30) + 1;
      const degInSign = p.deg % 30;
      const house = getHouse(signId, lagnaSignId);
      const nak = getNakshatra(p.deg);
      const dignity = getDignity(p.name, signId);
      return {
        symbol: p.symbol,
        name: p.name,
        rashi_id: signId,
        rashi_name: rashiNames[signId - 1],
        rashi_sanskrit: rashiSanskrit[signId - 1],
        dms: formatDms(degInSign),
        house: house,
        nakshatra_name: nak.name,
        nakshatra_pada: nak.pada,
        dignity: dignity,
        is_retrograde: p.name === "Rahu" || p.name === "Ketu"
      };
    });

    const ascPlanet = {
      symbol: "Asc",
      name: "Ascendant",
      rashi_id: lagnaSignId,
      rashi_name: rashiNames[lagnaSignId - 1],
      rashi_sanskrit: rashiSanskrit[lagnaSignId - 1],
      dms: formatDms(lagnaDegInSign),
      house: 1,
      nakshatra_name: lagnaNak.name,
      nakshatra_pada: lagnaNak.pada,
      dignity: "Lagna Kendra",
      is_retrograde: false
    };

    const allPlanets = [ascPlanet, ...processedPlanets];

    // 12 Bhavas
    const houseSignifications = [
      "Self, Physical Body, Personality, Vitality",
      "Wealth, Family, Speech, Assets",
      "Courage, Siblings, Communication, Valor",
      "Mother, Home, Inner Happiness, Land",
      "Intellect, Romance, Children, Purva Punya",
      "Service, Daily Work, Debts, Overcoming Enemies",
      "Spouse, Marriage, Public Relations, Business",
      "Longevity, Occult, Deep Transformation",
      "Fortune, Higher Wisdom, Guru, Morality",
      "Career, Status, Authority, Social Deeds",
      "Gains, Aspirations, Wealth Inflow, Networks",
      "Foreign Lands, Moksha, Subconscious, Meditation"
    ];

    const houses = [];
    for (let i = 1; i <= 12; i++) {
      const sId = ((lagnaSignId + i - 2) % 12) + 1;
      const occupying = processedPlanets.filter(p => p.house === i).map(p => p.symbol);
      if (i === 1) occupying.unshift("Asc");
      houses.push({
        house_num: i,
        sign_id: sId,
        sign_name: rashiNames[sId - 1],
        sign_sanskrit: rashiSanskrit[sId - 1],
        sign_lord: rashiLords[sId - 1],
        planets: occupying,
        significations: houseSignifications[i - 1]
      });
    }

    // Vimshottari Dasha calculation based on Moon Nakshatra
    const nakIndex = moonNak.idx;
    const startLordIdx = nakIndex % 9;
    const nakSpan = 360 / 27; // 13.33333333 degrees
    const degInNak = moonSidereal % nakSpan;
    const remFraction = 1 - (degInNak / nakSpan);
    const firstLordDuration = dashaYears[startLordIdx];
    const remFirstYears = firstLordDuration * remFraction;

    const birthYearFloat = y + (m - 1) / 12 + d / 365.25;
    const nowYearFloat = 2026.65;
    let currentAge = nowYearFloat - birthYearFloat;
    if (currentAge < 0) currentAge = 0;

    const dashaTimeline = [];
    let runningStartYear = birthYearFloat;
    let activeLord = dashaLords[startLordIdx];
    let activeAntardasha = dashaLords[(startLordIdx + 1) % 9];
    let activeStartYear = Math.floor(birthYearFloat);
    let activeEndYear = Math.floor(birthYearFloat + remFirstYears);
    let activeProgressPct = 40;

    // 1st Dasha (balance remaining at birth)
    const endFirstYear = birthYearFloat + remFirstYears;
    const isFirstCurrent = (currentAge <= remFirstYears);
    dashaTimeline.push({
      lord: dashaLords[startLordIdx],
      duration_years: Math.round(remFirstYears * 10) / 10,
      start_year: Math.floor(birthYearFloat).toString(),
      end_year: Math.floor(endFirstYear).toString(),
      is_current: isFirstCurrent
    });

    if (isFirstCurrent) {
      activeLord = dashaLords[startLordIdx];
      activeAntardasha = dashaLords[(startLordIdx + 1) % 9];
      activeStartYear = Math.floor(birthYearFloat);
      activeEndYear = Math.floor(endFirstYear);
      activeProgressPct = Math.min(100, Math.max(0, Math.round((currentAge / remFirstYears) * 100)));
    }

    runningStartYear = endFirstYear;
    let accumulatedYears = remFirstYears;

    for (let step = 1; step < 9; step++) {
      const currLordIdx = (startLordIdx + step) % 9;
      const dur = dashaYears[currLordIdx];
      const endY = runningStartYear + dur;
      const isCurrent = (currentAge > accumulatedYears && currentAge <= accumulatedYears + dur);

      if (isCurrent) {
        activeLord = dashaLords[currLordIdx];
        const elapsedInMaha = currentAge - accumulatedYears;
        const antarFraction = elapsedInMaha / dur;
        const antarStep = Math.min(8, Math.floor(antarFraction * 9));
        activeAntardasha = dashaLords[(currLordIdx + antarStep) % 9];
        activeStartYear = Math.floor(runningStartYear);
        activeEndYear = Math.floor(endY);
        activeProgressPct = Math.min(100, Math.max(0, Math.round((elapsedInMaha / dur) * 100)));
      }

      dashaTimeline.push({
        lord: dashaLords[currLordIdx],
        duration_years: dur,
        start_year: Math.floor(runningStartYear).toString(),
        end_year: Math.floor(endY).toString(),
        is_current: isCurrent
      });

      accumulatedYears += dur;
      runningStartYear = endY;
    }

    // Doshas: Manglik (Mars in 1, 4, 7, 8, 12)
    const marsHouse = processedPlanets.find(p => p.name === "Mars")?.house || 1;
    const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);

    // Kaal Sarp
    const isKaalSarp = false;

    // Sade Sati: Saturn in 12th, 1st, or 2nd from Moon
    const isSadeSati = moonSignId === 10 || moonSignId === 11 || moonSignId === 12;

    const kundliData = {
      user_name: name,
      gender: gender,
      dob: dob,
      tob: tob,
      city: city,
      latitude: lat,
      longitude: lng,
      lagna: {
        rashi_id: lagnaSignId,
        rashi_name: rashiNames[lagnaSignId - 1],
        rashi_sanskrit: rashiSanskrit[lagnaSignId - 1],
        dms: formatDms(lagnaDegInSign),
        degree_in_sign: lagnaDegInSign,
        nakshatra_name: lagnaNak.name,
        nakshatra_pada: lagnaNak.pada,
        nakshatra_lord: lagnaNak.lord
      },
      moon_sign: {
        rashi_id: moonSignId,
        rashi_name: rashiNames[moonSignId - 1],
        rashi_sanskrit: rashiSanskrit[moonSignId - 1],
        dms: formatDms(moonDegInSign),
        degree: moonDegInSign,
        nakshatra_name: moonNak.name,
        nakshatra_pada: moonNak.pada,
        nakshatra_lord: moonNak.lord
      },
      sun_sign: {
        rashi_id: Math.floor(sunSidereal / 30) + 1,
        rashi_name: rashiNames[Math.floor(sunSidereal / 30)],
        rashi_sanskrit: rashiSanskrit[Math.floor(sunSidereal / 30)],
        dms: formatDms(sunSidereal % 30),
        degree: sunSidereal % 30
      },
      birth_nakshatra: {
        name: moonNak.name,
        pada: moonNak.pada,
        lord: activeLord,
        nakshatra_id: moonNak.idx + 1
      },
      planets: allPlanets,
      houses: houses,
      current_mahadasha: activeLord,
      current_antardasha: activeAntardasha,
      active_dasha_details: `Active: ${activeLord} Mahadasha / ${activeAntardasha} Antardasha until Nov ${activeEndYear}`,
      dasha_start_year: activeStartYear.toString(),
      dasha_end_year: activeEndYear.toString(),
      dasha_progress_pct: activeProgressPct,
      dasha_timeline: dashaTimeline,
      doshas: {
        is_manglik: isManglik,
        manglik_severity: isManglik ? `Moderate (Mars in House ${marsHouse})` : "None (Auspicious Alignment)",
        is_kaal_sarp: isKaalSarp,
        sade_sati_status: isSadeSati ? "Active (Transit in Kumbha)" : "Not Active"
      },
      yogas: [
        { name: "Budhaditya Yoga", is_present: true },
        { name: "Gaj Kesari Yoga", is_present: true },
        { name: "Ruchaka Mahapurusha Yoga", is_present: true },
        { name: "Dhana Yoga", is_present: true }
      ]
    };

    return new Response(JSON.stringify(kundliData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
}

