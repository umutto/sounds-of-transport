# sounds-of-transport

## TODO

- 🗹 Info button (show readme in a modal)
- 🗹 Github button (link to repository)
- 🗹 Clean unused libraries
- ☐ Clean unused, commented code.
- ☐ Dynamic fps detection and filtering for performance?
- ☐ Combine live data with timetables (just update the timetable for that train and continue using that data)
- ☐ Add more sound loops
- 🗹 Add a way to save and recover creations
- ☐ Add a way to upload (or at least link) custom audio

- 🗹 Also clean the shapes and audios when reset. (currently breaking all)
- 🗹 Volume is not working when the audio element is not initialized yet.

- 🗹 Add corner cases for audios also the base functionality (when audio is changed from dropdow, when it's deleted, stop etc..)
- 🗹 Clear audio elements when a shape is deleted
- 🗹 Add a mute button.
- 🗹 Create a settings menu (modal) with options to filter trains (initially by the amount of stations, maybe later by location etc..), set time and date to a specific value, set the general volume, adjustable stuff you can find, probably also a good place to put the save/recover functionality.

- ☐ Fix Line offsetting, it seems like it fails after 2 intersections. For reference check Kanda station for Keihin tohoku and Chuo rapid line.
- ☐ Put all stations to the map (don't filter out the repetitions) and instead combine their circles with polygons and lines (just make a thick round line from one to another? or combine them into a polygon?)

**Ok, how about this for pretty stations:**

```bash
After the stations are created and added to the map, loop through all of them grouping by name (or using trains property):
  1. Find a central node (first biggest station, can use the radius, or add a meta option during initialization)
  2. Draw polygons to all connecting nodes from there.
  3. Set the station radius to static.

Or, actually easierish:
  1. Loop through all stations in groups
  2. Find the closest station to that station and draw a path.
  3. Do it for all stations,
  4. (Optional) For completeness sake, if a station path is already drawn (keep an array for duplicates), skip.
```

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
