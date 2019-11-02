if (location.hostname == "localhost") import config from "../../data/config/config.js";
else import config from "../../data/Public/config.js";
import { draw_map } from "./map_control.js";

$(function() {
  init_map(config.mapbox.value, "interactiveMap");

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

function init_map(mb_token, map_id) {
  var interactive_map = L.map(map_id).setView([35.6762, 139.7503], 13);
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

  draw_map(interactive_map, l_renderer).then(function() {
    $(".loading-overlay").hide();
  });
}
