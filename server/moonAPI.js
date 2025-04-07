var e = ((e) => ((e.NORTHERN = "Northern"), (e.SOUTHERN = "Southern"), e))(
    e || {}
  ),
  t = ((e) => (
    (e.NEW = "🌑"),
    (e.WAXING_CRESCENT = "🌒"),
    (e.FIRST_QUARTER = "🌓"),
    (e.WAXING_GIBBOUS = "🌔"),
    (e.FULL = "🌕"),
    (e.WANING_GIBBOUS = "🌖"),
    (e.LAST_QUARTER = "🌗"),
    (e.WANING_CRESCENT = "🌘"),
    e
  ))(t || {}),
  a = ((e) => (
    (e.NEW = "🌑"),
    (e.WAXING_CRESCENT = "🌘"),
    (e.FIRST_QUARTER = "🌗"),
    (e.WAXING_GIBBOUS = "🌖"),
    (e.FULL = "🌕"),
    (e.WANING_GIBBOUS = "🌔"),
    (e.LAST_QUARTER = "🌓"),
    (e.WANING_CRESCENT = "🌒"),
    e
  ))(a || {}),
  r = ((e) => (
    (e.ANOMALISTIC = "Anomalistic"),
    (e.DRACONIC = "Draconic"),
    (e.SIDEREAL = "Sidereal"),
    (e.SYNODIC = "Synodic"),
    (e.TROPICAL = "Tropical"),
    e
  ))(r || {}),
  n = ((e) => (
    (e.NEW = "New"),
    (e.WAXING_CRESCENT = "Waxing Crescent"),
    (e.FIRST_QUARTER = "First Quarter"),
    (e.WAXING_GIBBOUS = "Waxing Gibbous"),
    (e.FULL = "Full"),
    (e.WANING_GIBBOUS = "Waning Gibbous"),
    (e.LAST_QUARTER = "Last Quarter"),
    (e.WANING_CRESCENT = "Waning Crescent"),
    e
  ))(n || {});
const N = 2440587.5,
  s = 29.53058770576;
class A {
  static fromDate(e = new Date()) {
    return e.getTime() / 864e5 - e.getTimezoneOffset() / 1440 + N;
  }
  static toDate(e) {
    const t = new Date();
    return t.setTime(864e5 * (e - N + t.getTimezoneOffset() / 1440)), t;
  }
}
const E = { hemisphere: e.NORTHERN },
  R = (e) => ((e -= Math.floor(e)) < 0 && (e += 1), e);
class I {
  static lunarAge(e = new Date()) {
    return I.lunarAgePercent(e) * s;
  }
  static lunarAgePercent(e = new Date()) {
    return R((A.fromDate(e) - 2451550.1) / s);
  }
  static lunationNumber(e = new Date()) {
    return Math.round((A.fromDate(e) - 2423436.6115277777) / s) + 1;
  }
  static lunarDistance(e = new Date()) {
    const t = A.fromDate(e),
      a = 2 * I.lunarAgePercent(e) * Math.PI,
      r = 2 * Math.PI * R((t - 2451562.2) / 27.55454988);
    return (
      60.4 -
      3.3 * Math.cos(r) -
      0.6 * Math.cos(2 * a - r) -
      0.5 * Math.cos(2 * a)
    );
  }
  static lunarPhase(e = new Date(), t) {
    t = { ...E, ...t };
    const a = I.lunarAge(e);
    return a < 1.84566173161
      ? n.NEW
      : a < 5.53698519483
      ? n.WAXING_CRESCENT
      : a < 9.22830865805
      ? n.FIRST_QUARTER
      : a < 12.91963212127
      ? n.WAXING_GIBBOUS
      : a < 16.61095558449
      ? n.FULL
      : a < 20.30227904771
      ? n.WANING_GIBBOUS
      : a < 23.99360251093
      ? n.LAST_QUARTER
      : a < 27.68492597415
      ? n.WANING_CRESCENT
      : n.NEW;
  }
  static lunarPhaseEmoji(e = new Date(), t) {
    t = { ...E, ...t };
    const a = I.lunarPhase(e);
    return I.emojiForLunarPhase(a, t);
  }
  static emojiForLunarPhase(r, N) {
    const { hemisphere: s } = { ...E, ...N };
    let A;
    switch (((A = s === e.SOUTHERN ? a : t), r)) {
      case n.WANING_CRESCENT:
        return A.WANING_CRESCENT;
      case n.LAST_QUARTER:
        return A.LAST_QUARTER;
      case n.WANING_GIBBOUS:
        return A.WANING_GIBBOUS;
      case n.FULL:
        return A.FULL;
      case n.WAXING_GIBBOUS:
        return A.WAXING_GIBBOUS;
      case n.FIRST_QUARTER:
        return A.FIRST_QUARTER;
      case n.WAXING_CRESCENT:
        return A.WAXING_CRESCENT;
      default:
      case n.NEW:
        return A.NEW;
    }
  }
  static isWaxing(e = new Date()) {
    return I.lunarAge(e) <= 14.765;
  }
  static isWaning(e = new Date()) {
    return I.lunarAge(e) > 14.765;
  }
}
var i = ((e) => (
  (e.EARTH_RADII = "Earth Radii"), (e.KILOMETERS = "km"), (e.MILES = "m"), e
))(i || {});
export {
  e as Hemisphere,
  A as Julian,
  r as LunarMonth,
  n as LunarPhase,
  I as Moon,
  t as NorthernHemisphereLunarEmoji,
  a as SouthernHemisphereLunarEmoji,
  i as Unit,
};
export default null;
