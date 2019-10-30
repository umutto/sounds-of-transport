import config from "../../data/config/config.js";
import { get_push_point } from "./utils.js";

$(function() {
  var mb_token = config.mapbox.value;
  var interactive_map = L.map("interactiveMap").setView(
    [35.6762, 139.7503],
    13
  );
  var l_renderer = L.canvas({
    padding: 0.5,
    tolerance: 5
  });
  $("#interactiveMap").data("map", interactive_map);

  L.tileLayer(
    `https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mb_token}`,
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: mb_token
    }
  ).addTo(interactive_map);

  draw_lines(interactive_map, l_renderer).then(function() {
    $(".loading-overlay").hide();
  });
});

const draw_lines = async (map, l_renderer) => {
  const lines = await load_data("data/Train/line_station_coords.json");
  // const stations = await load_data("data/Train/odpt_Station.json");
  // const lines = await load_data("data/Train/odpt_Railway.json");

  let _o = 0;
  var offset_pattern = [...Array(10)].map(() => {
    _o = _o > 0 ? _o * -1 : _o * -1 + 1;
    return _o;
  });
  let offset_lines = {};
  let offset_stations = [];

  let lineLayer = L.featureGroup();
  let stationLayer = L.featureGroup();

  lines.forEach(l => {
    let latlngs = [];
    l.station.forEach(s => {
      latlngs.push([s.geo.lat, s.geo.long]);
      let ns = l.station.find(x => x.idx === s.idx + 1);
      if (s.trains.length > 1) {
        if (ns && ns.trains.length > 1) {
          lines.some(l2 => {
            if (l.title_en != l2.title_en) {
              let _intercept = null;
              l2.station.some(s2 => {
                let ns2 = l2.station.find(x2 => x2.idx === s2.idx + 1);
                if (ns2 && ns2.trains.length > 1) {
                  if (
                    [s.title_en, ns.title_en].sort().join(".") ==
                    [s2.title_en, ns2.title_en].sort().join(".")
                  ) {
                    _intercept = [s.title_en, ns.title_en].sort().join("->");
                    return true;
                  }
                }
              });

              if (_intercept) {
                offset_lines[_intercept] = (offset_lines[_intercept] || 1) + 1;
                return true;
              }
            }
          });
          let _offset =
            offset_lines[[s.title_en, ns.title_en].sort().join("->")] || 0;
          if (_offset != 0) {
            latlngs.push(get_push_point(s, ns, offset_pattern[_offset]));
            latlngs.push(get_push_point(ns, s, offset_pattern[_offset] * -1));
          }
        }
      }

      if (!offset_stations.includes(s.title_en)) {
        let c_radius = s.trains.length * 10 + 5;

        let station = L.circle([s.geo.lat, s.geo.long], {
          weight: 2,
          fillColor: "#fdfdfd",
          color: "#000",
          fillOpacity: 1,
          radius: c_radius
        }).addTo(stationLayer);

        station.on("click", function() {
          console.log(s.title_en + " Station");
        });
        station.on("mouseover", function(e) {
          e.target.setStyle({
            weight: 5
          });
        });
        station.on("mouseout", function(e) {
          e.target.setStyle({
            weight: 2
          });
        });

        offset_stations.push(s.title_en);
      }
    });

    var polyline = L.polyline(latlngs, {
      weight: 3,
      color: l.repr_color,
      opacity: 0.7,
      className: l.code.replace(/[.:]/g, "-"),
      renderer: l_renderer
    }).addTo(lineLayer);

    polyline.on("click", function() {
      console.log(l.title_en, l.title_ja, l.repr_color);
    });
    polyline.on("mouseover", function(e) {
      e.target.setStyle({
        weight: 5,
        opacity: 1,
        color: "#000"
      });
    });
    polyline.on("mouseout", function(e) {
      e.target.setStyle({
        weight: 3,
        opacity: 0.7,
        color: l.repr_color
      });
    });
  });
  lineLayer.addTo(map);
  lineLayer.bringToBack();

  stationLayer.addTo(map);
  stationLayer.bringToFront();
};

const load_data = async path => {
  let result;

  try {
    result = await $.getJSON(path);
    return result;
  } catch (error) {
    console.error(error);
  }
  return;
};
