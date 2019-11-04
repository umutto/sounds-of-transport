import { get_push_point, interpolatePosition } from "./utils.js";

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

const draw_lines = async (map, l_renderer, data) => {
  var lines = data.lines;
  var line_color = data.line_colors;

  // limit lines due to frequend api calls
  lines = lines.filter(l => l.station.length > 10);

  let _o = 0;
  var offset_pattern = [...Array(10)].map(() => {
    _o = _o > 0 ? _o * -1 : _o * -1 + 1;
    return _o;
  });
  let offset_lines = {};

  var lineref = {};
  var stationref = {};
  let lineLayer = L.featureGroup();
  let stationLayer = L.featureGroup();

  // let offset_stations = [];
  // let station_groups = {};
  // let combinedStationLayer = L.featureGroup();

  lines.forEach(l => {
    let latlngs = [];
    let line_stations = [];
    l.station.forEach(s => {
      latlngs.push([s.geo.lat, s.geo.long]);
      line_stations.push(s.code);
      let ns = l.station.find(x => x.idx === s.idx + 1);
      if (s.trains.length > 1) {
        if (ns && ns.trains.length > 1) {
          lines.some(l2 => {
            if (l.title != l2.title) {
              let _intercept = null;
              l2.station.some(s2 => {
                let ns2 = l2.station.find(x2 => x2.idx === s2.idx + 1);
                if (ns2 && ns2.trains.length > 1) {
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

      // if (!offset_stations.includes(s.title)) {
      let c_radius = s.trains.length * 10 + 5;

      let station = L.circle([s.geo.lat, s.geo.long], {
        parts: 4,
        weight: 2,
        fillColor: "#fdfdfd",
        color: "#000",
        fillOpacity: 1,
        radius: c_radius,
        layerName: s.code,
        duration: s.dur
      }).addTo(stationLayer);

      // station_groups[s.title] = [...(station_groups[s.title] || []), { s: station, ns: ns }];
      stationref[s.code] = station;

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

      //   offset_stations.push(s.title);
      // }
    });

    let repr_color = line_color[l.code];
    var polyline = L.polyline(latlngs, {
      weight: 3,
      color: repr_color,
      opacity: 0.7,
      className: l.code.replace(/[.:]/g, "-"),
      renderer: l_renderer,
      layerName: l.code,
      stations: line_stations
    }).addTo(lineLayer);

    lineref[l.code] = polyline;

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

  // Object.entries(station_groups).forEach(([k, v]) => {
  //   L.geoJSON(turf.envelope(...v.map(s => s.toGeoJSON())), {
  //     style: {
  //       fillColor: "#fdfdfd",
  //       color: "#000",
  //       opacity: 1,
  //       fillOpacity: 1,
  //       layerName: k
  //     }
  //   }).addTo(combinedStationLayer);
  // });
  // combinedStationLayer.addTo(map);
  // combinedStationLayer.bringToFront();

  stationLayer.addTo(map);
  stationLayer.bringToFront();

  window.lineref = lineref;
  window.stationref = stationref;
};

const draw_trains = async (map, l_renderer, data) => {
  var time_now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  time_now = time_now < "03:00" ? parseInt(time_now.split(":")[0]) + 24 + ":" + time_now.split(":")[1] : time_now;

  let train_layer = L.featureGroup();
  var trainRef = window.trainRef || {};

  Object.entries(data).forEach(([k, v]) => {
    var train = window.lineref[k];
    v.filter(t => t.int[0] < time_now && time_now < t.int[1]).forEach(vt => {
      let from_index = vt.tt
        .filter(tt => time_now > (tt.t < "03:00" ? parseInt(tt.t.split(":")[0]) + 24 + ":" + tt.t.split(":")[1] : tt.t))
        .slice(-1)
        .pop();

      if (from_index)
        if (from_index.i >= vt.tt.length - 1) {
          // remove train marker and trainRef
        } else {
          let from_station = window.stationref[train.options.stations[from_index.i]];
          let to_station = window.stationref[train.options.stations[from_index.i + 1]];

          let ft = new Date();
          ft.setHours(parseInt(from_index.t.split(":")[0]) % 24);
          ft.setMinutes(parseInt(from_index.t.split(":")[1]));
          ft.setSeconds(0);

          let elapsed_time = new Date(new Date() - ft);
          elapsed_time = elapsed_time.getMinutes() * 60 + elapsed_time.getSeconds();

          var line = L.polyline([
              interpolatePosition(
                from_station.getLatLng(),
                to_station.getLatLng(),
                elapsed_time / from_station.options.duration
              ),
              to_station.getLatLng()
            ]),
            animatedMarker = L.animatedMarker(line.getLatLngs(), {
              icon: L.divIcon({
                className: "train-icon",
                interval: Math.max(0, from_station.options.duration - elapsed_time) * 1000
              })
            });
          animatedMarker.on("add", function() {
            console.log("added");
          });

          setTimeout(function() {
            train_layer.addLayer(animatedMarker);
          }, 1000);
        }

      // console.log(train);
    });
  });

  window.trainRef = trainRef;

  train_layer.addTo(map);
  train_layer.bringToFront();
};

export { draw_lines, draw_controls, draw_trains };
