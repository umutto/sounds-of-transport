# sounds-of-transport

<p align="center">
  <b>This project has been selected for the INIAD Special Award!!!🎉</b>
  <br>
  You can take a look at the award ceromony and other projects that have received awards using the link below
  <br>
  <a href="https://tokyochallenge.odpt.org/2019/award/07.html#v">Tokyo ODPT Challenge 2019 Awards</a>
</p>

## TODO

- 🗹 Support touch events! (hacked to open the edit menu on leaflet draw for now)
- 🗹 Add explanations to settings menu
- 🗹 Add a clock to main page or details on train popups so the time travel makes sense? (did train popups instead of a clock, seemed cleaner, use a popover on time setting instead of a clock)
- 🗹 Info button (show readme in a modal)
- 🗹 Github button (link to repository)
- 🗹 Clean unused libraries
- ☐ Clean unused, commented code.
- ☐ Dynamic fps detection and filtering for performance?
- ☐ Combine live data with timetables (just update the timetable for that train and continue using that data)
- ☐ Add new receivers with different quirks
- ☐ Add more sound loops
- 🗹 Add a way to save and recover creations
- ☐ Add a way to upload (or at least link) custom audio

- ☐ Finalize periodic redraws (update trains in trainref instead of redrawing)

- 🗹 Also clean the shapes and audios when reset. (currently breaking all)
- 🗹 Volume is not working when the audio element is not initialized yet.

- 🗹 Add corner cases for audios also the base functionality (when audio is changed from dropdow, when it's deleted, stop etc..)
- 🗹 Clear audio elements when a shape is deleted
- 🗹 Add a mute button.
- 🗹 Create a settings menu (modal) with options to filter trains (initially by the amount of stations, maybe later by location etc..), set time and date to a specific value, set the general volume, adjustable stuff you can find, probably also a good place to put the save/recover functionality.

- ☐ Fix Line offsetting, it seems like it fails after 2 intersections. For reference check Kanda station for Keihin tohoku and Chuo rapid line.
- 🗹 Put all stations to the map (don't filter out the repetitions) and instead combine their circles with polygons and lines (just make a thick round line from one to another? or combine them into a polygon?)

## How to use

Check out the [introduction.md](INTRODUCTION.md) for more details on how it works, and how to use.

[![Watch the introduction on Youtube](https://youtu.be/PETzwgZVYRE)](https://youtu.be/PETzwgZVYRE "Watch the introduction on Youtube")

## Audio references

Audio used in this app is downloaded from following sources, thanks to all artists for sharing!

- [Funk loop 1](https://www.looperman.com/loops/detail/49460/west-coast-wah-funk-riff-by-mchn-free-90bpm-hip-hop-electric-guitar-loop)
- [Funk loop 2](https://www.looperman.com/loops/detail/189996/funky-floor-140-140bpm-trap-electric-guitar-loop)
- [Jazz loop 1](https://www.looperman.com/loops/detail/103595/jazz-sweep-guitar-lick-by-zacwilkins-free-90bpm-jazz-electric-guitar-loop)
- [Jazz loop 2](https://www.looperman.com/loops/detail/103705/common-swing-jazz-progression-86bpm-jazz-electric-guitar-loop)
- [Groovy loop 1](https://www.looperman.com/loops/detail/414/omar-phased-guitar-groove-1-by-omar_s-free-120bpm-funk-electric-guitar-loop)
- [Metal loop 1](https://www.looperman.com/loops/detail/1681/rei-hammer-03-d-140-by-rei4real-free-140bpm-heavy-metal-electric-guitar-loop)
- [Metal loop 2](https://www.looperman.com/loops/detail/80668/sinthetic-metal-guitar-riff-2-stereo-150-by-sintheticrecords-free-150bpm-heavy-metal-electric-guitar-loop)
- [Drum effects](http://free-loops.com/)
