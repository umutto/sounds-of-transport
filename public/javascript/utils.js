import { draw_options } from "./map_control.js";

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

function _index_of_option(type, val) {
  return $(`#${type}-popup #sample-select option`)
    .map((_, o) => o.value)
    .toArray()
    .indexOf(val);
}

function encode_vals() {
  var _filter_by_stat = window.station_filter
    .val()
    .split(",")
    .map(r => parseInt(r).toString(36));
  var _filter_by_op = parseInt(
    $(".form-check-input")
      .map((_, c) => (c.checked ? 1 : 0))
      .toArray()
      .join(""),
    2
  ).toString(36);
  var _sp = window.speed_offset.toString(36);
  var _offset_date = (window.offset_date || 0).toString(36);
  var _zoom = window.lf_map.getZoom().toString(36);
  var _center = window.lf_map.getCenter();
  var _editable_layers = window.editableLayers.getLayers().map(l =>
    l.options.meta_type == "polyline"
      ? {
          t: 0,
          ln: l.getLatLngs(),
          a: _index_of_option(l.options.meta_type, l.getPopup().options.meta_audio),
          v: l.getPopup().options.meta_volume.toString(36)
        }
      : l.options.meta_type == "rectangle"
      ? {
          t: 1,
          ln: Object.values(l.getBounds()).map(b => Object.values(b)),
          a: _index_of_option(l.options.meta_type, l.getPopup().options.meta_audio),
          v: l.getPopup().options.meta_volume.toString(36),
          i: l.getPopup().options.meta_interval.toString(36)
        }
      : {
          t: 2,
          ln: l.getLatLng(),
          r: l.getRadius(),
          a: _index_of_option(l.options.meta_type, l.getPopup().options.meta_audio),
          v: l.getPopup().options.meta_volume.toString(36)
        }
  );

  return [_filter_by_stat, _filter_by_op, _sp, _offset_date, _zoom, _center, _editable_layers];
}

// limit size to 2048 for just in case, if it is larger give it as a normal text to copy/paste
export function compress() {
  return LZString.compressToEncodedURIComponent(JSON.stringify(encode_vals()));
}

function _value_of_option(type, idx) {
  return $(`#${type}-popup #sample-select option`)[idx].value;
}

function decode_set_static(_filter_by_stat, _filter_by_op, _sp, _offset_date, _zoom, _center) {
  return () => {
    _filter_by_stat = _filter_by_stat.map(r => parseInt(r, 36));
    window.station_filter.slider("setValue", _filter_by_stat);

    _filter_by_op = parseInt(_filter_by_op, 36)
      .toString(2)
      .padStart(12, "0")
      .split("")
      .map(s => parseInt(s));

    $(".form-check-input").each((i, o) => {
      if (_filter_by_op[i]) o.checked = true;
      else o.checked = false;
    });

    _sp = parseInt(_sp, 36);
    window.speed_offset = _sp;

    _offset_date = parseInt(_offset_date, 36);
    window.offset_date = _offset_date;

    _zoom = parseInt(_zoom, 36);
    window.lf_map.setZoom(_zoom);

    window.lf_map.setView(_center);
  };
}

function decode_draw_layers(_editable_layers) {
  return () => {
    var types = ["polyline", "rectangle", "circle"];
    _editable_layers.forEach(elem => {
      var _type = types[elem.t];
      {
        if (_type === "polyline")
          draw_options(
            window.lf_map,
            L.polyline(elem.ln, { color: "#110133", weight: 10 }),
            _type,
            parseInt(elem.v, 36),
            _value_of_option(_type, elem.a)
          );
        else if (_type === "rectangle")
          draw_options(
            window.lf_map,
            L.rectangle(elem.ln, { color: "#1f6650" }),
            _type,
            parseInt(elem.v, 36),
            _value_of_option(_type, elem.a),
            parseInt(elem.i, 36)
          );
        else if (_type === "circle")
          draw_options(
            window.lf_map,
            L.circle(elem.ln, elem.r, { color: "#bc4873" }),
            _type,
            parseInt(elem.v, 36),
            _value_of_option(_type, elem.a)
          );
      }
    });
  };
}

function decode_vals(vals) {
  var [_filter_by_stat, _filter_by_op, _sp, _offset_date, _zoom, _center, _editable_layers] = vals;

  var f_static = decode_set_static(_filter_by_stat, _filter_by_op, _sp, _offset_date, _zoom, _center);
  var f_draw = decode_draw_layers(_editable_layers);

  return { f_static, f_draw };
}

export function decompress(comp_string) {
  var decomp = LZString.decompressFromEncodedURIComponent(comp_string);
  return decode_vals(JSON.parse(decomp));
}

(function($) {
  $.QueryString = (function(paramsArray) {
    let params = {};

    for (let i = 0; i < paramsArray.length; ++i) {
      let param = paramsArray[i].split("=", 2);

      if (param.length !== 2) continue;

      params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
    }

    return params;
  })(window.location.search.substr(1).split("&"));
})(jQuery);
