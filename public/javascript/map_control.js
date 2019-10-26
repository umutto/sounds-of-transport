import config from '../../data/config/config.js';

$(function () {
    var mb_token = config.mapbox.value;
    var interactive_map = L.map('interactiveMap').setView([35.6762, 139.7203], 13);
    $("#interactiveMap").data("map", interactive_map)

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
    let offset_coords = [];
    let offset_val = 1;
    lines.forEach(l => {
        let latlngs = l.station.map(s => {
            return [s.geo.lat, s.geo.long]
        })

        if (latlngs.filter(value => -1 !== offset_coords.indexOf(value)))
            offset_val = offset_val > 0 ? offset_val * -1 : offset_val * -1 + 1;

        l.station.forEach(s => {
            let c_radius = offset_coords.filter(value => value[0] == s.geo.lat && value[1] == s.geo.long).length * 15 + 5;

            let station = L.circle([s.geo.lat, s.geo.long], {
                weight: 2,
                fillColor: '#fdfdfd',
                color: '#000',
                fillOpacity: 1,
                radius: c_radius
            }).addTo(map);

            station.bringToFront();

            station.on('click', function () {
                console.log(s.title_en + " Station")
            });
            station.on('mouseover', function (e) {
                e.target.setStyle({
                    weight: 5
                })
            });
            station.on('mouseout', function (e) {
                e.target.setStyle({
                    weight: 1
                })
            });
        })

        var polyline = L.polyline(latlngs, {
            weight: 3,
            color: l.repr_color,
            opacity: 0.7,
            className: l.code.replace(/[.:]/g, "-"),
            offset: offset_val
        }).addTo(map);

        polyline.on(
            'click',
            function () {
                console.log(l.title_en, l.title_ja)
            });
        polyline.on('mouseover', function (e) {
            e.target.setStyle({
                weight: 5,
                opacity: 1,
                color: '#000'
            })
        });
        polyline.on('mouseout', function (e) {
            e.target.setStyle({
                weight: 3,
                opacity: 0.8,
                color: l.repr_color
            })
        });

        polyline.bringToBack();

        offset_coords.push.apply(offset_coords, latlngs);
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
