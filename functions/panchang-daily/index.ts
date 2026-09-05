// InsForge Edge Function: panchang-daily
export default async function(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const today = new Date();
  const tithis = ["Shukla Pratipada", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami", "Shukla Shashthi", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami", "Shukla Ekadashi", "Shukla Dwadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Purnima", "Krishna Pratipada", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami", "Krishna Shashthi", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami", "Krishna Ekadashi", "Krishna Dwadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"];
  const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
  const yogas = ["Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"];
  const karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Garija", "Vanija", "Vishti (Bhadra)", "Shakuni", "Chatushpada", "Naga", "Kintughna"];

  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const tithi = tithis[dayOfYear % 30];
  const nakshatra = nakshatras[dayOfYear % 27];
  const yoga = yogas[dayOfYear % 27];
  const karana = karanas[dayOfYear % 11];

  const panchang = {
    date: today.toISOString().split("T")[0],
    day: today.toLocaleDateString("en-US", { weekday: "long" }),
    sunrise: "06:02 AM",
    sunset: "06:48 PM",
    tithi: { name: tithi, paksha: dayOfYear % 30 < 15 ? "Shukla Paksha" : "Krishna Paksha", end_time: "07:42 PM" },
    nakshatra: { name: nakshatra, lord: "Jupiter", end_time: "09:15 PM" },
    yoga: { name: yoga, end_time: "05:30 PM" },
    karana: { name: karana, end_time: "08:12 AM" },
    rahu_kaal: "04:30 PM - 06:00 PM",
    abhijit_muhurat: "11:54 AM - 12:45 PM",
    brahma_muhurat: "04:26 AM - 05:14 AM",
    auspicious_recommendation: "Auspicious day for spiritual practices, chanting Vishnu Sahasranama, and initiating creative ventures."
  };

  return new Response(JSON.stringify(panchang), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

