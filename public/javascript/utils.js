export function get_push_point(s, ns, angle, fraction = 100) {
  let _oX = ns.geo.long - s.geo.long,
    _oY = ns.geo.lat - s.geo.lat;
  let _r = Math.sqrt(Math.pow(_oX, 2) + Math.pow(_oY, 2)),
    _t = Math.atan2(_oY, _oX);
  let _ot = (3.14 / fraction) * angle;

  let _r2 = 0.001 / Math.cos(_ot),
    _t2 = _t + _ot;
  let pX = _r2 * Math.cos(_t2) + s.geo.long,
    pY = _r2 * Math.sin(_t2) + s.geo.lat;
  return [pY, pX];
}

export function get_closest(r, map) {
  L.GeometryUtil.closest(map, polygon1, e.latlng, p_vertices);
}

export function interpolatePosition(p1, p2, e) {
  e = e > 0 ? (e > 1 ? 1 : e) : 0;
  return L.latLng(p1.lat + e * (p2.lat - p1.lat), p1.lng + e * (p2.lng - p1.lng));
}

export function get_now() {
  if (window.offset_date) return new Date(new Date().getTime() + window.offset_date);
  else return new Date();
}
