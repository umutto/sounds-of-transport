const audio_lib = {
  hi_hat_1: { src: "/public/audio/hi_hat_1.mp3" },
  hi_hat_2: { src: "/public/audio/hi_hat_2.mp3" },
  kick_1: { src: "/public/audio/kick_1.wav" },
  snare_1: { src: "/public/audio/snare_1.mp3" },
  funk_1: { src: "/public/audio/funk_1.wav" },
  funk_2: { src: "/public/audio/funk_2.wav" },
  groovy_1: { src: "/public/audio/groovy_1.wav" },
  jazz_1: { src: "/public/audio/jazz_1.wav" },
  jazz_2: { src: "/public/audio/jazz_2.wav" },
  metal_1: { src: "/public/audio/metal_1.wav" },
  metal_2: { src: "/public/audio/metal_2.wav" }
};

const inject_dom = (id, audio, loop = false, volume = 1, autoplay = true) => {
  $(`#${id}`).remove();
  $("<audio></audio>")
    .attr({
      id: id,
      src: audio.src,
      volume: volume,
      loop: loop,
      preload: "auto",
      autoplay: autoplay
    })
    .appendTo("#audio-wrapper");
};

const play_sound = audio_elem => {
  var isPlaying = audio_elem.currentTime > 0 && !audio_elem.paused && !audio_elem.ended && audio_elem.readyState > 2;
  if (!isPlaying && !window.muted) audio_elem.play();
};

const mute_all = (mute = true) => {
  if (mute)
    $("audio").each(function() {
      this.volume = 0;
    });
  else
    $("audio").each(function() {
      this.volume =
        window.editableLayers
          .getLayer(
            $(this)
              .attr("id")
              .split("_")
              .pop()
          )
          .getPopup().options.meta_volume / 100;
    });
};

export { audio_lib, inject_dom, play_sound, mute_all };
