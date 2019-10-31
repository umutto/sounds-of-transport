export function get_push_point(s, ns, angle, fraction = 30) {
  let _oX = ns.geo.long - s.geo.long,
    _oY = ns.geo.lat - s.geo.lat;
  let _r = Math.sqrt(Math.pow(_oX, 2) + Math.pow(_oY, 2)),
    _t = Math.atan2(_oY, _oX);
  let _ot = (3.14 / fraction) * angle;

  let _r2 = _r / 5 / Math.cos(_ot),
    _t2 = _t + _ot;
  let pX = _r2 * Math.cos(_t2) + s.geo.long,
    pY = _r2 * Math.sin(_t2) + s.geo.lat;
  return [pY, pX];
}
