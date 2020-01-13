import { get_push_point, interpolatePosition, get_now } from "./utils.js";
import { audio_lib, inject_dom, play_sound, mute_all } from "./sound_controller.js";

const trigger_func = (layer, type) => {
  if (!layer.getPopup().options.meta_element)
    inject_dom(
      `audio_${layer._leaflet_id}`,
      audio_lib[layer.getPopup().options.meta_audio],
      type !== "polyline",
      layer.getPopup().options.meta_volume / 100
    );
  else play_sound($(`#${layer.getPopup().options.meta_element}`).get(0));

  layer.getPopup().options.meta_element = `audio_${layer._leaflet_id}`;
};

const draw_options = (map, layer, type, volume = null, audio = null, interval = null, user_trigger = true) => {
  editableLayers.addLayer(layer);

  layer.options.meta_type = type;

  switch (type) {
    case "circle":
      var popup = L.popup({
        meta_volume: volume || 75,
        meta_audio: audio || "groovy_1",
        meta_type: type
      }).setContent($("#circle-popup").html());
      layer.bindPopup(popup);

      layer.getPopup().options.meta_trigger = false;
      layer.options.meta_fun = function() {
        var radius = layer.getRadius();
        var circleCenterPoint = layer.getLatLng();

        let _intersect = Object.entries(window.trainref).some(([k, v]) => {
          return v && Math.abs(circleCenterPoint.distanceTo(v.getMarker().getLatLng())) <= radius;
        });
        let _triggered = layer.getPopup().options.meta_trigger;

        if (_intersect && !_triggered) {
          $(layer.getElement()).addClass("pulse");
          layer.getPopup().options.meta_trigger = true;

          trigger_func(layer, type);
        } else if (!_intersect && _triggered) {
          if (layer.getPopup().options.meta_element) {
            let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
            audio_elem.pause();
            // audio_elem.currentTime = 0;
          }

          $(layer.getElement()).removeClass("pulse");
          layer.getPopup().options.meta_trigger = false;
        }
      };

      if (user_trigger && L.Browser.mobile) {
        layer.setRadius(Math.pow(2, 19 - window.lf_map.getZoom()) * 10);
        draw_toolbar._toolbars.edit._modes.edit.button.click();
      }
      break;
    case "rectangle":
      var popup = L.popup({
        meta_volume: volume || 50,
        meta_audio: audio || "jazz_1",
        meta_interval: interval || 1000,
        meta_timestamp: get_now().getTime()
      }).setContent($("#rectangle-popup").html());
      layer.bindPopup(popup);

      layer.getPopup().options.meta_trigger = false;
      layer.options.meta_fun = function() {
        let _intersect = Object.entries(window.trainref).some(([k, v]) => {
          return v && layer.getBounds().contains(v.getMarker().getLatLng());
        });
        let _triggered = layer.getPopup().options.meta_trigger;

        if (_intersect && !_triggered) {
          $(layer.getElement())
            .addClass("pulse")
            .addClass("sleeper");
          layer.getPopup().options.meta_trigger = true;
          layer.getPopup().options.meta_timestamp = get_now().getTime();

          trigger_func(layer, type);
        } else if (_intersect && _triggered) {
          let _int = layer.getPopup().options.meta_interval;
          let _ts = layer.getPopup().options.meta_timestamp;
          if ((get_now().getTime() - _ts) % (_int * 2) <= _int) {
            $(layer.getElement()).css("fill", "#1f6650");
            let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
            play_sound(audio_elem);
          } else {
            $(layer.getElement()).css("fill", "#e9e9e9");
            let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
            audio_elem.pause();
            audio_elem.currentTime = 0;
          }
        } else if (!_intersect && _triggered) {
          if (layer.getPopup().options.meta_element) {
            let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
            audio_elem.pause();
            audio_elem.currentTime = 0;
          }

          $(layer.getElement()).removeClass("pulse");
          layer.getPopup().options.meta_trigger = false;
        }
      };

      if (user_trigger && L.Browser.mobile) {
        let map_bounds = Object.values(window.lf_map.getBounds()).map(b => Object.values(b));
        let _n = map_bounds[0][0] - (map_bounds[0][0] - map_bounds[1][0]) / 3,
          _s = map_bounds[1][0] + (map_bounds[0][0] - map_bounds[1][0]) / 3,
          _w = map_bounds[0][1] - (map_bounds[0][1] - map_bounds[1][1]) / 4,
          _e = map_bounds[1][1] + (map_bounds[0][1] - map_bounds[1][1]) / 4;

        layer.setBounds([
          [_n, _e],
          [_s, _w]
        ]);
        draw_toolbar._toolbars.edit._modes.edit.button.click();
      }
      break;
    case "polyline":
      var popup = L.popup({
        meta_volume: volume || 50,
        meta_audio: audio || "kick_1",
        meta_intersects: 0
      }).setContent($("#polyline-popup").html());
      layer.bindPopup(popup);

      layer.getPopup().options.meta_trigger = false;
      layer.options.meta_fun = function() {
        let _intersect = Object.entries(window.trainref).filter(
          ([k, v]) =>
            v &&
            L.GeometryUtil.closest(map, layer, v.getMarker().getLatLng()).distance <
              18 - window.lf_map.getZoom() + window.speed_offset / 10 / Math.max(1, 13 - window.lf_map.getZoom())
        ).length;
        let _triggered = layer.getPopup().options.meta_trigger;

        if (_intersect > 0 && !_triggered) {
          $(layer.getElement()).css("stroke", "#ffdc34");
          layer.getPopup().options.meta_trigger = true;

          trigger_func(layer, type);
        } else if (_intersect > 0 && _intersect != layer.getPopup().options.meta_intersects && _triggered) {
          $(layer.getElement()).css("stroke", "#ffdc34");
          let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
          audio_elem.currentTime = 0;
          play_sound(audio_elem);
        } else if (_intersect > 0 && _intersect == layer.getPopup().options.meta_intersects && _triggered) {
          $(layer.getElement()).css("stroke", "#110133");
        } else if (_intersect == 0 && _triggered) {
          $(layer.getElement()).css("stroke", "#110133");
          let audio_elem = $(`#${layer.getPopup().options.meta_element}`).get(0);
          audio_elem.pause();
          audio_elem.currentTime = 0;
          layer.getPopup().options.meta_trigger = false;
        }

        layer.getPopup().options.meta_intersects = _intersect;
      };
      break;
    default:
      break;
  }
};

const draw_controls = async map => {
  L.easyButton({
    id: "btn-mute",
    states: [
      {
        stateName: "mute",
        onClick: function(btn, map) {
          window.muted = true;
          mute_all();
          btn.state("un-mute");
        },
        title: "Mute",
        icon: "fas fa-volume-up easy-button-large"
      },
      {
        stateName: "un-mute",
        onClick: function(btn, map) {
          window.muted = false;
          mute_all(false);
          btn.state("mute");
        },
        title: "Unmute",
        icon: "fas fa-volume-mute easy-button-large"
      }
    ],
    position: "topright"
  }).addTo(map);

  var info_buttons = [
    L.easyButton({
      id: "btn-settings",
      states: [
        {
          stateName: "show-info",
          onClick: function(btn, map) {
            $("#modal-settings").modal("show");
          },
          title: "Settings",
          icon: "fas fa-cog easy-button-large"
        }
      ]
    }),
    L.easyButton({
      id: "btn-info",
      states: [
        {
          stateName: "show-info",
          onClick: async function(btn, map) {
            $(".loading-overlay").show();
            var intro = await $.ajax({
              url: "https://api.github.com/repos/umutto/sounds-of-transport/contents/INTRODUCTION.md",
              headers: { Accept: "application/vnd.github.html" }
            });
            $.ajax({
              type: "POST",
              url: "https://api.github.com/markdown",
              data: JSON.stringify({
                text: intro,
                mode: "markdown"
              }),
              contentType: "text/plain"
            })
              .done(function(data) {
                $("#modal-info .modal-body").html(data);
                $("#modal-info").modal("show");
              })
              .always(function() {
                $(".loading-overlay").hide();
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
  var editableLayers = new L.FeatureGroup();
  map.addLayer(editableLayers);

  L.drawLocal.draw.toolbar.buttons.circle = "Draw a continuous activation receiver circle.";
  L.drawLocal.draw.toolbar.buttons.rectangle = "Draw a periodic activation receiver rectangle.";
  L.drawLocal.draw.toolbar.buttons.polyline = "Draw a single activation receiver polyline.";

  $("body").on("input", ".popup-input", function() {
    window.popupTarget.options[$(this).data("handle")] = $(this).val();
    $(this)
      .siblings("label")
      .find("span span")
      .text($(this).val());

    if ($(this).data("handle") === "meta_volume") {
      if ($(`#${window.popupTarget.options.meta_element}`).get(0)) {
        $(`#${window.popupTarget.options.meta_element}`).get(0).volume = $(this).val() / 100;
      }
    } else if ($(this).data("handle") === "meta_audio") {
      $(`#${window.popupTarget.options.meta_element}`).remove();
      window.popupTarget.options.meta_element = null;
      window.popupTarget.options.meta_trigger = false;
    }
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

  window.draw_toolbar = new L.Control.Draw({
    draw: {
      circle: {
        shapeOptions: {
          color: "#bc4873"
        }
        //, repeatMode: true
      },
      rectangle: {
        shapeOptions: {
          color: "#1f6650"
        }
        //, repeatMode: true
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
    draw_options(map, layer, type);
  });

  map.on(L.Draw.Event.DELETESTART, function(e) {
    if (!window.muted) mute_all();
  });

  map.on(L.Draw.Event.DELETESTOP, function(e) {
    if (window.muted) mute_all(false);
  });

  map.on(L.Draw.Event.DELETED, function(e) {
    e.layers.getLayers().forEach(l => {
      $(`#${l.getPopup().options.meta_element}`).remove();
      l.getPopup().options.meta_element = null;
      l.getPopup().options.meta_trigger = false;
    });
  });

  window.setInterval(function() {
    Object.values(window.editableLayers.getLayers()).forEach(rec => rec.options.meta_fun());
  }, 25);

  window.editableLayers = editableLayers;
};

const draw_lines = async (map, l_renderer, data) => {
  var lines = data.lines;
  var line_color = data.line_colors;

  let _o = 0;
  var offset_pattern = [...Array(10)].map(() => {
    _o = _o > 0 ? _o * -1 : _o * -1 + 1;
    return _o;
  });
  let offset_lines = {};

  var lineref = {};
  var stationref = {};
  let lineLayer = L.featureGroup();
  let stationLayer = L.markerClusterGroup({
    animate: false,
    zoomToBoundsOnClick: false,
    polygonOptions: { weight: 1, color: "#000", opacity: 0.5 },
    spiderLegPolylineOptions: { weight: 2, color: "#000", opacity: 0.7 },
    // disableClusteringAtZoom: 16,
    iconCreateFunction: function(cluster) {
      var childCount = cluster.getChildCount();
      let c_names = cluster.getAllChildMarkers().map(c => c.options.meta_name);
      let stations = [...new Set(c_names.map(c => c.split(".").pop()))].join(", ");
      let trains = [...new Set(c_names.map(c => c.split(".")[2]))].join(", ");
      let repr_name = c_names
        .map(c => c.split(".").pop())
        .sort((a, b) => c_names.filter(v => v === a).length - c_names.filter(v => v === b).length)
        .pop();

      var c = " marker-cluster-";
      if (childCount < 10) {
        c += "small";
      } else if (childCount < 100) {
        c += "medium";
      } else {
        c += "large";
      }

      return new L.DivIcon({
        html: `<div><span data-name="<b>(${stations}) Stations</b><br>Trains passing: ${trains}">(${
          repr_name.split("")[0]
        })</span></div>`,
        className: "marker-cluster" + c,
        iconSize: new L.Point(40, 40)
      });
    }
  });

  stationLayer
    .on("clustermouseover", function(ev) {
      ev.propagatedFrom
        .bindTooltip(
          `${$(ev.propagatedFrom._icon)
            .find("span")
            .data("name")}`,
          { sticky: true }
        )
        .openTooltip();
    })
    .on("clustermouseout", function(ev) {
      ev.propagatedFrom.unbindTooltip();
    });

  // let offset_stations = [];
  let station_groups = {};
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
      // let c_radius = s.trains.length * 10 + 5;
      let c_radius = 10;

      let station = L.circleMarker([s.geo.lat, s.geo.long], {
        parts: 4,
        weight: 2,
        fillColor: "#fdfdfd",
        color: "#000",
        fillOpacity: 1,
        radius: c_radius,
        meta_name: s.code,
        meta_duration: s.dur
      }).addTo(stationLayer);
      station.bindTooltip(`(${s.code.split(".")[2]}) ${s.title} Station`).openTooltip();

      station_groups[s.title] = [...(station_groups[s.title] || []), s];
      stationref[s.code] = station;

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
    polyline.bindTooltip(l.title, { sticky: true }).openTooltip();

    lineref[l.code] = polyline;

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
  //   let latlngs = v.map(s => {
  //     return [s.geo.lat, s.geo.long];
  //   });
  //   let connection = L.polyline(
  //     latlngs.filter((p, i, s) => i === s.findIndex(_p => _p[0] == p[0] && _p[1] == p[1])),
  //     { weight: 5, color: "#cecece", opacity: 0.5 }
  //   ).addTo(stationLayer);
  //   connection.bindTooltip(k + " Station").openTooltip();
  // });

  // let station_connections = {};
  // lines
  //   .map(l => l.station)
  //   .flat()
  //   .filter(s => s.trains.length > 1)
  //   .forEach(s => {
  //     s.trains.forEach(t => {
  //       let ref = `${s.code}->${t}`;
  //       if (!(ref in station_connections)) {
  //         station_connections[ref] = "a";
  //       }
  //     });
  //     console.log(s);
  //   });

  stationLayer.addTo(map);
  stationLayer.bringToFront();

  window.lineref = lineref;
  window.stationref = stationref;
};

const draw_trains = async (map, data) => {
  var time_now = get_now().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  time_now = time_now < "03:00" ? parseInt(time_now.split(":")[0]) + 24 + ":" + time_now.split(":")[1] : time_now;

  // // ///////////////////////////////////////
  // // ///////////////////////////////////////

  // var d = get_now();
  // d.setHours(d.getHours() - 6);
  // time_now = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  // // ///////////////////////////////////////
  // // ///////////////////////////////////////

  var train_layer = L.featureGroup();
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

            let ft = get_now();
            ft.setHours(parseInt(from_index.t.split(":")[0]) % 24);
            ft.setMinutes(parseInt(from_index.t.split(":")[1]));
            ft.setSeconds(0);

            let elapsed_time = new Date(get_now() - ft);
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
                trainref[this.options.meta_name] = null;
              }
            });

            animatedMarker
              .bindTooltip(
                `${k.split(":").pop()} - (${vt.n})<br>Destination: ${train.options.meta_stations[
                  vt.tt[vt.tt.length - 1].i - 1
                ]
                  .split(":")[1]
                  .split(".")
                  .pop()} station at ${vt.tt[vt.tt.length - 1].t}`
              )
              .openTooltip();

            trainref[vt.n] = animatedMarker;
            train_layer.addLayer(animatedMarker);
          }
        }
      });
    });

  train_layer.addTo(map);
  train_layer.bringToFront();

  window.trainref = trainref;
};

export { draw_lines, draw_controls, draw_trains, draw_options };
