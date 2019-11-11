import { draw_lines, draw_controls, draw_trains } from "./map_control.js";
import { load_local_data, load_live_data } from "./data_handler.js";

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

$(function() {
  let _date = new Date();
  window.isHoliday = JapaneseHolidays.isHoliday(new Date()) || _date.getDay() % 6 == 0;

  getConfig();
  if (window.history && window.history.pushState) {
    $(".modal").on("show.bs.modal", function(e) {
      if (window.location.hash != "#info") window.history.pushState("forward", null, "#info");
    });
    $(".modal").on("hide.bs.modal", function(e) {
      if (window.location.hash == "#info") window.history.back();
    });

    $(window).on("popstate", function() {
      if (window.location.hash != "#info") $(".modal").modal("hide");
    });
  }
});

async function init_map(mb_token, map_id) {
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
  await draw_lines(interactive_map, l_renderer, { lines, line_colors });
  await draw_controls(interactive_map);
  $(".loading-overlay").hide();

  load_local_data(
    window.isHoliday ? "data/Public/train_timetable_holiday.json" : "data/Public/train_timetable_weekday.json"
  ).then(function(data) {
    // var train_live = await load_live_data("odpt:Train", [`odpt:railway=odpt.Railway:JR-East.ChuoRapid`]);
    draw_trains(interactive_map, data);
    window.setInterval(function() {
      draw_trains(interactive_map, data);
    }, 30000);
  });
}
