import { draw_lines, draw_controls, draw_trains } from "./map_control.js";
import { load_local_data, load_live_data } from "./data_handler.js";
import { get_now, compress, decompress } from "./utils.js";

window.speed_offset = 1;
window.muted = false;

async function getConfig() {
  if (location.hostname == "localhost")
    import("../../data/config/config.js").then(async cf => {
      window.api_conf = cf.default;
      init_map(cf.default.mapbox.value, "interactiveMap");
    });
  else
    import("../../data/Public/config.js").then(async cf => {
      window.api_conf = cf.default;
      init_map(cf.default.mapbox.value, "interactiveMap");
    });
}

function date_updated(start, _, __) {
  window.offset_date = start.diff();
  console.log(get_now());
  reset_values();
}

function reset_values(p_load = null) {
  $(".loading-overlay").show();
  Object.values(window.trainref).forEach(l => {
    if (l) l.clearAllEventListeners();
  });
  window.trainref = {};
  Object.values(window.stationref).forEach(l => {
    if (l) l.clearAllEventListeners();
  });
  window.stationref = {};
  Object.values(window.lineref).forEach(l => {
    if (l) l.clearAllEventListeners();
  });
  window.editableLayers.clearAllEventListeners();
  window.editableLayers.clearLayers();
  $("audio").remove();
  window.lineref = {};
  $(".leaflet-bar").remove();
  window.buttonref = {};
  window.lf_map.clearAllEventListeners();
  window.lf_map.remove();

  init_map(window.api_conf.mapbox.value, "interactiveMap", true, p_load);
}

$(function() {
  $("#btn-share").on("click", function() {
    let _c = compress();
    $("#input-share").val(_c.length < 2000 ? `${window.location.origin}${window.location.pathname}?s=${_c}` : _c);
    $("#text-share-info").text(
      _c.length < 2000
        ? "You can copy and share the url below! Visitors will see your map!"
        : "Paste the code below using the Load Map button to recreate your map!"
    );
  });

  $("#input-share").popover({ content: "copied to clipboard!", trigger: "manual", placement: "top" });
  new ClipboardJS("#copy-share");
  $("#copy-share").on("click", function() {
    if ($("#input-share").val().length > 0) {
      $("#input-share").popover("show");
      setTimeout(function() {
        $("#input-share").popover("hide");
      }, 1000);
    }
  });

  $("#btn-load").on("click", function() {
    let load_s = $("#input-share").val();
    if (load_s.length > 0) reset_values(load_s);
  });

  window.station_filter = $("#stationFilter").slider({
    min: 0,
    max: 70,
    value: [20, 60]
  });

  init_date_picker(date_updated);
  $(`button[name="dateReset"]`).on("click", function() {
    window.offset_date = null;
    init_date_picker(date_updated);
  });

  $(".modal #btn-filter").on("click", function() {
    reset_values();
  });

  getConfig();

  // mobile friendly modals
  if (window.history && window.history.pushState) {
    $(".modal").on("show.bs.modal", function(e) {
      if (window.location.hash != "#modal") window.history.pushState("forward", null, "#modal");
    });
    $(".modal").on("hide.bs.modal", function(e) {
      if (window.location.hash == "#modal") window.history.back();
    });

    $(window).on("popstate", function() {
      if (window.location.hash != "#modal") $(".modal").modal("hide");
    });
  }
});

async function init_map(mb_token, map_id, is_reset = false, comp_str = null) {
  $(`#${map_id}`).remove();
  $(".main-wrapper").append(`<div id="${map_id}" class="h-100"></div>`);
  let _date = get_now();
  var isHoliday = JapaneseHolidays.isHoliday(get_now()) || _date.getDay() % 6 == 0;

  var interactive_map = L.map(map_id, {
    center: [35.6762, 139.7503],
    zoom: 13,
    markerZoomAnimation: false,
    zoomAnimation: false
  });
  var l_renderer = L.canvas({
    padding: 0.5,
    tolerance: 5
  });
  window.lf_map = interactive_map;

  L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mb_token}`, {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: mb_token
  }).addTo(interactive_map);

  var lines = await load_local_data("data/Public/line_station_coords.json");
  var line_colors = await load_local_data("data/Public/line_colors.json");

  var pre_load;
  var q_saved = $.QueryString.s;
  if (q_saved && !is_reset)
    try {
      pre_load = decompress(q_saved);
    } catch (error) {
      console.log("Failed to decode the url string,", error);
    }
  else if (comp_str && is_reset)
    try {
      pre_load = decompress(comp_str);
    } catch (error) {
      console.log("Failed to decode the url string,", error);
    }

  if (pre_load) pre_load.f_static();

  // limit lines due to limiting frequent api calls
  let [min_station, max_station] = window.station_filter.slider("getValue");
  let valid_operators = $("#operator-form .form-check-input:checked")
    .map((_, c) => c.value)
    .toArray();

  lines = lines.filter(
    l =>
      l.station.length >= min_station &&
      l.station.length <= max_station &&
      valid_operators.includes(
        l.code
          .split(":")
          .pop()
          .split(".")[0]
      )
  );

  await draw_lines(interactive_map, l_renderer, { lines, line_colors });
  await draw_controls(interactive_map);

  var time_tables = await load_local_data(
    isHoliday ? "data/Public/train_timetable_holiday.json" : "data/Public/train_timetable_weekday.json"
  );
  // var train_live = await load_live_data("odpt:Train", [`odpt:railway=odpt.Railway:JR-East.ChuoRapid`]);
  await draw_trains(interactive_map, time_tables);

  if (pre_load) pre_load.f_draw();
  $(".loading-overlay").hide();

  window.setInterval(function() {
    draw_trains(interactive_map, time_tables);
  }, 30000);
}

function init_date_picker(cb) {
  $('input[name="dateOverride"]').daterangepicker(
    {
      singleDatePicker: true,
      showDropdowns: true,
      timePicker: true,
      timePicker24Hour: true,
      drops: "up",
      locale: {
        format: "DD/MM/YY HH:mm"
      },
      opens: "center",
      startDate: moment().format("DD/MM/YY HH:mm")
    },
    cb
  );
}

// Train name generation for filtering on settings menu:

// result = {};
// [...new Set(lines.map(l => l.code.split(":")[1].split(".")[0]))].forEach(
//   ln =>
//     (result[ln] = lines
//       .filter(l => l.code.split(":")[1].split(".")[0] == ln)
//       .map(l => ({ code: l.code, name: l.title.split(" ")[0], stations: l.station.length })))
// );

// html_result = "";
// Object.entries(result).forEach(([k, v]) => {
//   html_result += `<span class="ml-3"><input class="form-check-input" type="checkbox" id="cb_all_${k}" value=${k}>
//   <label class="form-check-label" for="cb_all_${k}">${k}</label>
//   </span>
// <div class="form-row border p-1">`;
//   v.forEach(
//     ll =>
//       (html_result += `<div class="form-check form-check-inline">
//   <input class="form-check-input" type="checkbox" id="cb_${ll.code}" value="${ll.code}">
//   <label class="form-check-label border-bottom" style="border-bottom-color: ${
//     line_color[ll.code]
//   } !important;" !important;" for="cb_${ll.code}">${ll.name}</label>
// </div>`)
//   );
//   html_result += "</div>";
// });
// html_result;
