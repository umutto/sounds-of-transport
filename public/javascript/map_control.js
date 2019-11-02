import { get_push_point } from "./utils.js";

const draw_map = async (map, l_renderer) => {
  await draw_lines(map, l_renderer);
  await draw_controls(map);
};

const draw_controls = async map => {
  var info_buttons = [
    L.easyButton({
      id: "btn-info",
      states: [
        {
          stateName: "show-info",
          onClick: function(btn, map) {
            $.ajax({
              url: "https://api.github.com/repos/umutto/sounds-of-transport/readme",
              headers: { Accept: "application/vnd.github.html" }
            }).done(function(data) {
              $("#modal-info .modal-body").html(data);
              $("#modal-info").modal("show");
            });
          },
          title: "Learn more",
          icon: "fas fa-info-circle easy-button-large"
        }
      ]
    }),
    L.easyButton({
      id: "btn-source",
      states: [
        {
          stateName: "show-source",
          onClick: function(btn, map) {
            window.open("https://github.com/umutto/sounds-of-transport", "_blank");
          },
          title: "View source on github",
          icon: "fab fa-github easy-button-large"
        }
      ]
    })
  ];

  L.easyBar(info_buttons, { id: "info-bar", position: "bottomleft" }).addTo(map);

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
          stateName: "add-shape-circle",
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
          stateName: "add-shape-square",
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
          stateName: "add-shape-triangle",
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
  const lines = await load_data("data/Public/line_station_coords.json");
  const line_color = await load_data("data/Public/line_colors.json");

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
      if (s.n_trains > 1) {
        if (ns && ns.n_trains > 1) {
          lines.some(l2 => {
            if (l.title != l2.title) {
              let _intercept = null;
              l2.station.some(s2 => {
                let ns2 = l2.station.find(x2 => x2.idx === s2.idx + 1);
                if (ns2 && ns2.n_trains > 1) {
                  if ([s.title, ns.title].sort().join(".") == [s2.title, ns2.title].sort().join(".")) {
                    _intercept = [s.title, ns.title].sort().join("->");
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
          let _offset = offset_lines[[s.title, ns.title].sort().join("->")] || 0;
          if (_offset != 0) {
            latlngs.push(get_push_point(s, ns, offset_pattern[_offset]));
            latlngs.push(get_push_point(ns, s, offset_pattern[_offset] * -1));
          }
        }
      }

      if (!offset_stations.includes(s.title)) {
        let c_radius = s.n_trains * 10 + 5;

        let station = L.circle([s.geo.lat, s.geo.long], {
          weight: 2,
          fillColor: "#fdfdfd",
          color: "#000",
          fillOpacity: 1,
          radius: c_radius,
          layerName: s.code
        }).addTo(stationLayer);

        station.on("click", function() {
          console.log(s.title + " Station");
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

        offset_stations.push(s.title);
      }
    });

    let repr_color = line_color[l.code];
    var polyline = L.polyline(latlngs, {
      weight: 3,
      color: repr_color,
      opacity: 0.7,
      className: l.code.replace(/[.:]/g, "-"),
      renderer: l_renderer,
      layerName: l.code
    }).addTo(lineLayer);

    polyline.on("click", function() {
      console.log(l.title);
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
        color: repr_color
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
