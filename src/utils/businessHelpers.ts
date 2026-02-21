import { OpeningHours } from "../types/store";

const daysOfWeek = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const getBusinessStatus = (hoursConfig: OpeningHours[]) => {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Get configs for today by finding the object with matching day
  const dayConfig = hoursConfig.find(
    (config: OpeningHours) => config.day === currentDay,
  );
  const todayRanges = dayConfig ? dayConfig.ranges : [];

  if (!todayRanges || todayRanges.length === 0) {
    return { isOpen: false, message: "Fechado agora" };
  }

  const currentTimeValue = currentHour * 60 + currentMinute;
  let isOpenNow = false;

  // Check all shifts for today
  for (const range of todayRanges) {
    const [openHour, openMinute] = range.open.split(":").map(Number);
    const [closeHour, closeMinute] = range.close.split(":").map(Number);

    const openTimeValue = openHour * 60 + openMinute;
    const closeTimeValue = closeHour * 60 + closeMinute;

    if (
      currentTimeValue >= openTimeValue &&
      currentTimeValue < closeTimeValue
    ) {
      isOpenNow = true;
      break;
    }
  }

  if (isOpenNow) {
    return { isOpen: true, message: "Aberto agora" };
  }

  return { isOpen: false, message: "Fechado agora" };
};

export const getFormattedHours = (hoursConfig: OpeningHours[]) => {
  // Generate a flat list for all 7 days
  const schedule = daysOfWeek.map((dayName: string, index: number) => {
    // Find time ranges for this day
    const dayConfig = hoursConfig.find(
      (config: OpeningHours) => config.day === index,
    );
    const dayRanges = dayConfig ? dayConfig.ranges : [];

    // Sort ranges by opening time
    const sortedRanges = [...dayRanges].sort((a, b) => {
      return (
        parseInt(a.open.replace(":", "")) - parseInt(b.open.replace(":", ""))
      );
    });

    return {
      day: dayName,
      dayIndex: index,
      ranges: sortedRanges,
    };
  });

  // Output ordered schedule: Mon-Sat, then Sun
  const orderedSchedule = [
    ...schedule.slice(1), // Mon-Sat
    schedule[0], // Sun
  ];

  return orderedSchedule;
};

export const formatPhone = (phone: string) => {
  if (!phone) return "";
  const phoneStr = String(phone);
  const cleaned = phoneStr.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 13) {
    return `+${cleaned.slice(0, 2)} (${cleaned.slice(2, 4)}) ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`;
  }
  return phoneStr;
};

export const getWhatsappLink = (phone: string) => {
  if (!phone) return "";
  const phoneStr = String(phone);
  const protocolRemoved = phoneStr.replace(/^whatsapp:/, "");
  const cleaned = protocolRemoved.replace(/\D/g, "");
  return `https://wa.me/${cleaned}`;
};
