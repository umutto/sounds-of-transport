import { get_push_point, interpolatePosition } from "./utils.js";
import { audio_lib, inject_dom } from "./sound_controller.js";

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

  L.easyBar(info_buttons, { id: "info-bar", position: "topright" }).addTo(map);

  // TODO: only enabled when it's not live mode, when it's live mode don't care about window.speed_offset, use 1
  var btn_play = L.easyButton({
    id: "btn-play",
    states: [
      {
        stateName: "enabled",
        onClick: function(btn, map) {
          window.speed_offset = 1;
          Object.values(window.trainref).forEach(t => {
            if (t) t.motionDuration(t.motionOptions.duration / window.speed_offset);
          });
          window.buttonref.btn_faster.enable();
        },
        title: "Play normal speed",
        icon: "fas fa-play easy-button-large"
      }
    ]
  });
  var btn_faster = L.easyButton({
    id: "btn-faster",
    states: [
      {
        stateName: "enabled",
        onClick: function(btn, map) {
          window.speed_offset = Math.min(1000, window.speed_offset * 10);
          Object.values(window.trainref).forEach(t => {
            if (t) t.motionDuration(t.motionOptions.duration / window.speed_offset);
          });
          if (window.speed_offset == 1000) btn.disable();
        },
        title: "10x Faster",
        icon: "fas fa-forward easy-button-large"
      }
    ]
  });

  L.easyBar([btn_play, btn_faster], { id: "playback-bar", position: "bottomright" }).addTo(map);
  $("#playback-bar").addClass("row");

  window.buttonref = { btn_play, btn_faster };
  register_map_events(map);
};

const register_map_events = map => {
  window.receiverref = [];
  var editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);

  L.drawLocal.draw.toolbar.buttons.circle = "Draw a continuous receiver circle.";
  L.drawLocal.draw.toolbar.buttons.rectangle = "Draw a periodic receiver rectangle.";
  L.drawLocal.draw.toolbar.buttons.polyline = "Draw a single activation receiver polyline.";

  $("body").on("input", ".form-control", function() {
    window.popupTarget.options[$(this).data("handle")] = $(this).val();
    $(this)
      .siblings("label")
      .find("span span")
      .text($(this).val());
  });

  map.on("popupopen", function(e) {
    var popup = e.popup;
    var content = popup.getContent();
    var $div = $("<div>").html(content);

    Object.entries(popup.options).forEach(([k, v]) => {
      let _elem = $div.find(`.form-control[data-handle=${k}]`);
      if (_elem.is("input")) {
        _elem.attr("value", v);
        _elem
          .siblings("label")
          .find("span span")
          .text(v);
      } else if (_elem.is("select")) {
        _elem.find(`option`).attr("selected", false);
        _elem.find(`option[value='${v}']`).attr("selected", true);
      }
    });

    popup.setContent($div.html());
    window.popupTarget = popup;
  });
  map.on("popupclose", function(e) {
    window.popupTarget = null;
  });

  new L.Control.Draw({
    draw: {
      circle: {
        shapeOptions: {
          color: "#bc4873"
        }
      },
      rectangle: {
        shapeOptions: {
          color: "#1f6650"
        }
      },
      polyline: {
        shapeOptions: {
          color: "#110133",
          weight: 10
        }
      },
      polygon: false,
      marker: false
    },
    undo: {
      title: "Delete last point drawn",
      text: "Delete last point"
    },
    edit: {
      featureGroup: editableLayers,
      remove: true
    }
  }).addTo(map);

  map.on(L.Draw.Event.CREATED, function(e) {
    var type = e.layerType,
      layer = e.layer;
    window.receiverref.push(layer);
    editableLayers.addLayer(layer);

    switch (type) {
      case "circle":
        var popup = L.popup({
          meta_volume: 100,
          meta_audio: "jazz_1"
        }).setContent($("#circle-popup").html());
        layer.bindPopup(popup);

        layer.options.meta_trigger = false;
        layer.options.meta_fun = function() {
          var radius = layer.getRadius();
          var circleCenterPoint = layer.getLatLng();

          let _intersect = Object.entries(window.trainref).some(([k, v]) => {
            return v && Math.abs(circleCenterPoint.distanceTo(v.getMarker().getLatLng())) <= radius;
          });
          let _triggered = layer.options.meta_trigger;

          if (_intersect && !_triggered) {
            if (!layer.getPopup().options.meta_element)
              inject_dom(
                `audio_${layer._leaflet_id}`,
                audio_lib[layer.getPopup().options.meta_audio],
                true,
                layer.getPopup().options.meta_volume
              );
            else
              $(`#${layer.getPopup().options.meta_element}`)
                .get(0)
                .play();

            $(layer.getElement()).addClass("pulse");
            layer.options.meta_trigger = true;
            layer.getPopup().options.meta_element = `audio_${layer._leaflet_id}`;
          } else if (!_intersect && _triggered) {
            if (layer.getPopup().options.meta_element) {
              let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
              audio_elem.pause();
              // audio_elem.currentTime = 0;
            }

            $(layer.getElement()).removeClass("pulse");
            layer.options.meta_trigger = false;
          }
        };
        break;
      case "rectangle":
        var popup = L.popup({
          meta_volume: 100,
          meta_audio: "kick_drum_1",
          meta_interval: 1
        }).setContent($("#rectangle-popup").html());
        layer.bindPopup(popup);

        // $(layer.getElement()).addClass("sleeper");
        layer.options.meta_trigger = false;
        layer.options.meta_fun = function() {
          let _intersect = Object.entries(window.trainref).some(([k, v]) => {
            return v && layer.getBounds().contains(v.getMarker().getLatLng());
          });
          let _triggered = layer.options.meta_trigger;

          if (_intersect && !_triggered) {
            $(layer.getElement()).addClass("drawing");
            layer.options.meta_trigger = true;
          } else if (!_intersect && _triggered) {
            $(layer.getElement()).removeClass("drawing");
            layer.options.meta_trigger = false;
          }
        };
        break;
      case "polyline":
        var popup = L.popup({
          meta_volume: 100,
          meta_audio: "snare_1"
        }).setContent($("#polyline-popup").html());
        layer.bindPopup(popup);

        layer.options.meta_trigger = false;
        layer.options.meta_fun = function() {
          let _intersect = Object.entries(window.trainref).some(([k, v]) => {
            return v && true;
          });
          let _triggered = layer.options.meta_trigger;

          if (_intersect && !_triggered) {
            $(layer.getElement()).addClass("stress");
            layer.options.meta_trigger = true;
          } else if (!_intersect && _triggered) {
            $(layer.getElement()).removeClass("stress");
            layer.options.meta_trigger = false;
          }
        };
        break;
      default:
        break;
    }
  });

  window.setInterval(function() {
    Object.values(window.receiverref).forEach(rec => rec.options.meta_fun());
  }, 25);
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
        meta_name: s.code,
        meta_duration: s.dur
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
      meta_name: l.code,
      meta_stations: line_stations
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
  //       meta_name: k
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

const draw_trains = async (map, data) => {
  var time_now = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  time_now = time_now < "03:00" ? parseInt(time_now.split(":")[0]) + 24 + ":" + time_now.split(":")[1] : time_now;

  // ///////////////////////////////////////
  // ///////////////////////////////////////

  // var d = new Date();
  // d.setHours(d.getHours() - 6);
  // time_now = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  // ///////////////////////////////////////
  // ///////////////////////////////////////

  var train_layer = window.train_layer || L.featureGroup();
  var trainref = window.trainref || {};

  Object.entries(data)
    .filter(([k, _]) => k in window.lineref)
    .forEach(([k, v]) => {
      var train = window.lineref[k];
      v.filter(t => t.int[0] < time_now && time_now < t.int[1]).forEach(vt => {
        if (!(vt.n in trainref)) {
          let s_index = vt.tt.findIndex(
            tt => time_now < (tt.t < "03:00" ? parseInt(tt.t.split(":")[0]) + 24 + ":" + tt.t.split(":")[1] : tt.t)
          );
          let from_index = vt.tt[s_index - 1],
            to_index = vt.tt[s_index];

          if (from_index && to_index) {
            let from_station = window.stationref[train.options.meta_stations[from_index.i - 1]];
            let to_station = window.stationref[train.options.meta_stations[to_index.i - 1]];

            let ft = new Date();
            ft.setHours(parseInt(from_index.t.split(":")[0]) % 24);
            ft.setMinutes(parseInt(from_index.t.split(":")[1]));
            ft.setSeconds(0);

            let elapsed_time = new Date(new Date() - ft);
            elapsed_time = elapsed_time.getMinutes() * 60 + elapsed_time.getSeconds();

            var animatedMarker = L.motion.polyline(
              [
                interpolatePosition(
                  from_station.getLatLng(),
                  to_station.getLatLng(),
                  elapsed_time / from_station.options.meta_duration
                ),
                to_station.getLatLng()
              ],
              {
                meta_idx: s_index - 1,
                meta_timetable: vt.tt,
                meta_name: vt.n,
                weight: 0
              },
              {
                auto: true,
                duration: (Math.max(0, from_station.options.meta_duration - elapsed_time) * 1000) / window.speed_offset,
                easing: L.Motion.Ease.easeInOutSine
              },
              {
                showMarker: true,
                riseOnHover: true,
                title: k + " - " + vt.n,
                alt: k + " - " + vt.n,
                icon: L.divIcon({
                  className: "train-icon",
                  html: `<div style="background: ${train.options.color}"></div>`
                })
              }
            );

            animatedMarker.addTo(train_layer);
            animatedMarker.on(L.Motion.Event.Ended, function(e) {
              this.options.meta_idx += 1;

              if (this.options.meta_idx < this.options.meta_timetable.length) {
                let n_from_station =
                    window.stationref[
                      train.options.meta_stations[this.options.meta_timetable[this.options.meta_idx - 1].i - 1]
                    ],
                  n_to_station =
                    window.stationref[
                      train.options.meta_stations[this.options.meta_timetable[this.options.meta_idx].i - 1]
                    ];

                this.motionDuration((n_from_station.options.meta_duration * 1000) / window.speed_offset);
                this._linePoints.shift();
                this.addLatLng(n_to_station.getLatLng());
                this.motionStart();
              } else {
                this.getMarker().remove();
                this._renderer._removePath(this);
                delete this.getMarker();
                delete this;
                // delete trainref[this.options.meta_name];
                trainref[this.options.meta_name] = null;
              }
            });

            trainref[vt.n] = animatedMarker;
            train_layer.addLayer(animatedMarker);
          }
        }
      });
    });

  train_layer.addTo(map);
  train_layer.bringToFront();

  window.trainref = trainref;
  window.train_layer = train_layer;
};

export { draw_lines, draw_controls, draw_trains };
