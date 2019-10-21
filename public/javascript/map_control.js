import config from '../../data/config/config.js';

$(function () {
    var mb_token = config.mapbox.value;
    var interactive_map = L.map('interactiveMap').setView([35.6762, 139.7203], 13);

    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${mb_token}`, {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.light',
        accessToken: mb_token
    }).addTo(interactive_map);

    draw_lines(interactive_map);

});

const draw_lines = async map => {
    const lines = await load_data("data/Train/line_station_coords.json");
    // const stations = await load_data("data/Train/odpt_Station.json");
    // const lines = await load_data("data/Train/odpt_Railway.json");
    lines.forEach(l => {
        let latlngs = l.station.map(s => {
            return [s.geo.lat, s.geo.long]
        })
        var polyline = L.polyline(latlngs, {
            color: l.repr_color,
            opacity: 0.6,
            className: l.code.replace(/[.:]/g, "-")
        });
        polyline.on(
            'click',
            function () {
                console.log(l.title_en, l.title_ja)
            });
        polyline.addTo(map);
    })
}

const load_data = async path => {
    let result;

    try {
        result = await $.getJSON(path)
        return result;
    } catch (error) {
        console.error(error);
    }
    return
};
