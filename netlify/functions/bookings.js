// Simple demo booking API for HCF
// NOTE: Netlify Functions are stateless; this demo uses in-memory storage.
// In production we would use Supabase or another database.

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const RUN_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// Demo schedule (seeded)
const SCHEDULE = [
  {
    id: "mt-20260330-1900",
    title: "Muay Thai",
    level: "Beginner",
    date: "2026-03-30",
    start: "19:00",
    end: "20:30",
    capacity: 20,
    location: "新竹館",
  },
  {
    id: "boxing-20260331-1900",
    title: "Boxing",
    level: "All levels",
    date: "2026-03-31",
    start: "19:00",
    end: "20:30",
    capacity: 16,
    location: "新竹館",
  },
  {
    id: "conditioning-20260401-1930",
    title: "Conditioning",
    level: "All levels",
    date: "2026-04-01",
    start: "19:30",
    end: "21:00",
    capacity: 16,
    location: "新竹館",
  },
];

const bookingStore = new Map();
const bookedCounts = new Map();

function slotsForDate(date) {
  if (!date) return SCHEDULE;
  return SCHEDULE.filter((slot) => slot.date === date);
}

function seatsUsed(slotId) {
  return bookedCounts.get(slotId) || 0;
}

function seatsAvailable(slot) {
  const available = slot.capacity - seatsUsed(slot.id);
  return available < 0 ? 0 : available;
}

function slotsWithAvailability(date) {
  return slotsForDate(date).map((slot) => ({
    ...slot,
    available: seatsAvailable(slot),
  }));
}

function createBooking(payload) {
  const slotId = payload?.slotId;
  const customerName = (payload?.name || "匿名").toString().slice(0, 50);

  if (!slotId) {
    const err = new Error("slotId is required");
    err.statusCode = 400;
    throw err;
  }

  const slot = SCHEDULE.find((s) => s.id === slotId);
  if (!slot) {
    const err = new Error("Slot not found");
    err.statusCode = 404;
    throw err;
  }

  const available = seatsAvailable(slot);
  if (available <= 0) {
    const err = new Error("No seats available");
    err.statusCode = 409;
    throw err;
  }

  const bookingId = `${slotId}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  bookedCounts.set(slotId, seatsUsed(slotId) + 1);

  const booking = {
    id: bookingId,
    slotId,
    slotTitle: slot.title,
    name: customerName,
    createdAt: new Date().toISOString(),
    runId: RUN_ID,
  };

  bookingStore.set(bookingId, booking);

  return booking;
}

exports.handler = async function handler(event) {
  const headers = {
    ...CORS_HEADERS,
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: "",
    };
  }

  try {
    if (event.httpMethod === "GET") {
      const date = event.queryStringParameters?.date;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          data: slotsWithAvailability(date),
          meta: {
            date: date || null,
            timezone: "Asia/Taipei",
            runId: RUN_ID,
            note: "Demo API: storage resets on cold start",
          },
        }),
      };
    }

    if (event.httpMethod === "POST") {
      let payload;
      try {
        payload = JSON.parse(event.body || "{}");
      } catch (parseErr) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: "Invalid JSON",
            message: parseErr.message,
          }),
        };
      }

      const booking = createBooking(payload);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ booking }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method Not Allowed",
        allowed: "GET, POST, OPTIONS",
      }),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      headers,
      body: JSON.stringify({
        error: err.message || "Server error",
      }),
    };
  }
};
