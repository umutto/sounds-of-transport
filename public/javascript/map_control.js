import { get_push_point } from "./utils.js";

const draw_map = async (map, l_renderer) => {
  await draw_lines(map, l_renderer);
  await draw_controls(map);
};

const draw_controls = async map => {
  L.easyButton({
    id: "btn-shapes",
    position: "topright",
    states: [
      {
        stateName: "show-shape-bar",
        onClick: function(btn, map) {
          $("#btn-shapes").addClass("btn-active");
          $("#shape-bar").show();
          btn.state("hide-shape-bar");
        },
        title: "Display receivers",
        icon: "fas fa-shapes"
      },
      {
        stateName: "hide-shape-bar",
        onClick: function(btn, map) {
          $("#btn-shapes").removeClass("btn-active");
          $("#shape-bar").hide();
          btn.state("show-shape-bar");
        },
        title: "Hide receivers",
        icon: "fas fa-shapes"
      }
    ]
  }).addTo(map);

  var shape_buttons = [
    L.easyButton({
      id: "btn-shape-circle",
      states: [
        {
          stateName: "show-shape-bar",
          onClick: function(btn, map) {},
          title: "Add a circle receiver",
          icon: "fas fa-circle"
        }
      ]
    }),
    L.easyButton({
      id: "btn-shape-square",
      states: [
        {
          stateName: "show-shape-bar",
          onClick: function(btn, map) {},
          title: "Add a square receiver",
          icon: "fas fa-square"
        }
      ]
    }),
    L.easyButton({
      id: "btn-shape-triangle",
      states: [
        {
          stateName: "show-shape-bar",
          onClick: function(btn, map) {},
          title: "Add a triangle receiver",
          icon: "fas fa-play fa-rotate-30"
        }
      ]
    })
  ];

  L.easyBar(shape_buttons, { id: "shape-bar", position: "topright" }).addTo(map);
};

const draw_lines = async (map, l_renderer) => {
  const lines = await load_data("data/Train/line_station_coords.json");

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
                  if ([s.title_en, ns.title_en].sort().join(".") == [s2.title_en, ns2.title_en].sort().join(".")) {
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
          let _offset = offset_lines[[s.title_en, ns.title_en].sort().join("->")] || 0;
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

export { draw_map };
