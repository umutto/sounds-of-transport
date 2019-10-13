# Data Overview

Succint overview for api data endpoints. For more information, check [https://developer-tokyochallenge.odpt.org/ja/documents#_odpt_train_api](https://developer-tokyochallenge.odpt.org/ja/documents#_odpt_train_api)(Japanese only).

Endpoint structure is as follows:

> https://api-tokyochallenge.odpt.org/api/v4/datapoints/<ENDPOINT_URI>?acl:consumerKey=<API_TOKEN>

## Common

Data common to all types of transportation. For more information, check [https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9](https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9)(Japanese only).

### odpt:Calendar

Representation of weekday/weekends and holidays by company. Holds a list of target dates.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:Calendar",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.Calendar:Weekday",
  "dc:title" : "平日",
  "odpt:calendarTitle" : {
    "ja" : "平日",
    "en" : "Weekday"
  }
} ]
```

### odpt:Operator

Transportation operator representation key value pairs.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:Operator",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.Operator:JR-East",
  "dc:title" : "JR東日本",
  "odpt:calendarTitle" : {
    "ja" : "JR東日本",
    "en" : "JR East"
  }
} ]
```

## Train

Data related to railways. For more information, check [https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9_2](https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9_2)(Japanese only).

### odpt:PassengerSurvey

Passenger volume statistics, number of people getting on and off the stations or the number of people on board.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:PassengerSurvey",
  "dc:date" : "2017-01-13T06:10:00+0000",
  "owl:sameAs" : "odpt.PassengerSurvey:JR-East.Tokyo",
  "odpt:operator" : "odpt.Operator:JR-East",
  "odpt:railway" : [ "odpt.Railway:JR-East.Yamanote", "odpt.Railway:JR-East.ChuoRapid" ],
  "odpt:station" : [ "odpt.Station:JR-East.Yamanote.Tokyo", "odpt.Station:JR-East.ChuoRapid.Tokyo" ],
  "odpt:includeAlighting" : false,
  "odpt:passengerSurveyObject" : [ {
    "odpt:surveyYear" : 2016,
    "odpt:passengerJourneys" : 12340
  }, {
    "odpt:surveyYear" : 2017,
    "odpt:passengerJourneys" : 12345
  } ]
} ]
```

### odpt:RailDirection

Travel direction definition for trains. Defines the direction of train (inbound or outbound).

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:RailDirection",
  "dc:date" : "2017-01-13T06:10:00+0000",
  "owl:sameAs" : "odpt.RailDirection:Inbound",
  "dc:title" : "上り",
  "odpt:railDirectionTitle" : {
    "ja" : "上り",
    "en" : "Inbound"
  }
} ]
```

### odpt:Railway

Route (station) information for railways.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:Railway",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.Railway:JR-East.ChuoRapid",
  "dc:title" : "中央線快速",
  "odpt:railwayTitle" : {
    "ja" : "中央線快速",
    "en" : "Chuo Rapid Line"
  },
  "odpt:operator" : "odpt.Operator:JR-East",
  "odpt:ascendingRailDirection" : "odpt.RailDirection:Outbound",
  "odpt:descendingRailDirection" : "odpt.RailDirection:Inbound",
  "odpt:stationOrder" : [ {
    "odpt:index" : 1,
    "odpt:station" : "odpt.Station:JR-East.ChuoRapid.Tokyo",
    "odpt:stationTitle" : {
      "ja" : "東京",
      "en" : "Tokyo"
    }
  }, {
    "odpt:index" : 2,
    "odpt:station" : "odpt.Station:JR-East.ChuoRapid.Kanda",
    "odpt:stationTitle" : {
      "ja" : "神田",
      "en" : "Kanda"
    }
  }, {
    "odpt:index" : 3,
    "odpt:station" : "odpt.Station:JR-East.ChuoRapid.Ochanomizu",
    "odpt:stationTitle" : {
      "ja" : "御茶ノ水",
      "en" : "Ochanomizu"
    }
  } ]
} ]
```

### odpt:RailwayFare

Price definition between stations as pairs of 2.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:RailwayFare",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.RailwayFare:TokyoMetro.Marunouchi.Tokyo.TokyoMetro.Tozai.Nakano",
  "odpt:operator" : "odpt.Operator:TokyoMetro",
  "odpt:fromStation" : "odpt.Station:TokyoMetro.Marunouchi.Tokyo",
  "odpt:toStation" : "odpt.Station:TokyoMetro.Tozai.Nakano",
  "odpt:ticketFare" : 240,
  "odpt:icCardFare" : 237,
  "odpt:childTicketFare" : 120,
  "odpt:childIcCardFare" : 118
} ]
```

### odpt:Station

General station information.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:Station",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.Station:JR-East.Yamanote.Tokyo",
  "dc:title" : "東京",
  "odpt:stationTitle" : {
    "ja" : "東京",
    "en" : "Tokyo"
  },
  "odpt:operator" : "odpt.Operator:JR-East",
  "odpt:railway" : "odpt.Railway:JR-East.Yamanote",
  "geo:long" : 139.1234,
  "geo:lat" : 35.1234
} ]
```

### odpt:StationTimetable

Timetable for trains departing at a station.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:StationTimetable",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "dct:issued" : "2017-01-01",
  "owl:sameAs" : "odpt.StationTimetable:JR-East.ChuoRapid.Tokyo.Outbound.Weekday",
  "odpt:operator" : "odpt.Operator:JR-East",
  "odpt:railway" : "odpt.Railway:JR-East.ChuoRapid",
  "odpt:station" : "odpt.Station:JR-East.ChuoRapid.Tokyo",
  "odpt:railDirection" : "odpt.RailDirection:JR-East.Outbound",
  "odpt:calendar" : "odpt.Calendar:Weekday",
  "odpt:stationTimetableObject" : [ {
    "odpt:departureTime" : "06:00",
    "odpt:destinationStation" : [ "odpt.Station:JR-East.ChuoRapid.Takao" ],
    "odpt:trainType" : "odpt.TrainType:JR-East.Rapid"
  }, {
    "odpt:departureTime" : "06:10",
    "odpt:destinationStation" : [ "odpt.Station:JR-East.ChuoRapid.Takao" ],
    "odpt:trainType" : "odpt.TrainType:JR-East.Rapid"
  }, {
    "odpt:departureTime" : "06:20",
    "odpt:destinationStation" : [ "odpt.Station:JR-East.ChuoRapid.Takao" ],
    "odpt:trainType" : "odpt.TrainType:JR-East.Rapid"
  } ]
} ]
```

### odpt:Train (LIVE)

Live train position and information. Live position is defined as relative position between two stations.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:uuid:5d7dd592-ef17-4b69-b955-5b4fe5f7e350",
  "@type" : "odpt:Train",
  "dc:date" : "2017-12-07T01:24:33+09:00",
  "owl:sameAs" : "odpt.Train:JR-East.Utsunomiya.565M",
  "odpt:operator" : "odpt.Operator:JR-East",
  "odpt:railway" : "odpt.Railway:JR-East.Utsunomiya",
  "odpt:railDirection" : "odpt.RailwayDirection:Outbound",
  "odpt:trainNumber" : "565M",
  "odpt:fromStation" : "odpt.Station:JR-East.Utsunomiya.Suzumenomiya",
  "odpt:toStation" : "odpt.Station:JR-East.Utsunomiya.Utsunomiya",
  "odpt:destinationStation" : [ "odpt.Station:JR-East.Utsunomiya.Utsunomiya" ],
  "odpt:index" : 1,
  "odpt:delay" : 0,
  "odpt:carComposition" : 15
} ]
```

### odpt:TrainInformation (LIVE)

Live train operation information.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.json",
  "@id" : "urn:ucode:_00001C000000000000010000030C3BE4",
  "@type" : "odpt:TrainInformation",
  "dc:date" : "2017-12-07T01:25:03+09:00",
  "owl:sameAs" : "odpt.TrainInformation:TokyoMetro.Ginza",
  "dct:valid" : "2017-12-07T01:30:03+09:00",
  "odpt:timeOfOrigin" : "2017-11-21T11:31:00+09:00",
  "odpt:operator" : "odpt.Operator:TokyoMetro",
  "odpt:railway" : "odpt.Railway:TokyoMetro.Ginza",
  "odpt:trainInformationText" : {
    "ja" : "現在、平常どおり運転しています。",
    "en" : "Running on schedule."
  }
} ]
```

### odpt:TrainTimetable

Train timetable for station departure times.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:TrainTimetable",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "dct:issued" : "2017-01-01",
  "owl:sameAs" : "odpt.TrainTimetable:JR-East.ChuoRapid.123M.Weekday",
  "odpt:operator" : "odpt.Operator:JR-East",
  "odpt:railway" : "odpt.Railway:JR-East.ChuoRapid",
  "odpt:railDirection" : "odpt.RailDirection:Outbound",
  "odpt:calendar" : "odpt.Calendar:Weekday",
  "odpt:trainNumber" : "123M",
  "odpt:trainType" : "odpt.TrainType:JR-East.Rapid",
  "odpt:originStation" : [ "odpt.Station:JR-East.ChuoRapid.Tokyo" ],
  "odpt:destinationStation" : [ "odpt.Station:JR-East.ChuoRapid.Takao" ],
  "odpt:trainTimetableObject" : [ {
    "odpt:departureTime" : "06:00",
    "odpt:departureStation" : "odpt.Station:JR-East.ChuoRapid.Tokyo"
  }, {
    "odpt:departureTime" : "06:30",
    "odpt:departureStation" : "odpt.Station:JR-East.ChuoRapid.Tachikawa"
  }, {
    "odpt:arrivalTime" : "07:00",
    "odpt:arrivalStation" : "odpt.Station:JR-East.ChuoRapid.Takao"
  } ]
} ]
```

### odpt:TrainType

Train classification information. Such as normal and rapid.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:TrainType",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.TrainType:JR-East.Local",
  "odpt:operator" : "odpt.Operator:JR-East",
  "dc:title" : "普通",
  "odpt:trainTypeTitle" : {
    "ja" : "普通",
    "en" : "Local"
  }
} ]
```

## Bus

Data related to bus lines. For more information, check [https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9_3](https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9_3)(Japanese only).

### odpt:Bus (LIVE)

Real time bus operation information. Live position is defined as relative position between two stops (`fromBusstopPole`, `toBusstopPole`)

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt_Bus.jsonld",
  "@type" : "odpt:Bus",
  "owl:sameAs" : "odpt.Bus:Toei.Ou57.40301.1.V366",
  "odpt:busroute" : "odpt.Busroute:Toei.Ou57",
  "odpt:operator" : "odpt.Operator:Toei",
  "odpt:busNumber" : "V366",
  "odpt:frequency" : 15,
  "odpt:busroutePattern" : "odpt.BusroutePattern:Toei.Ou57.40301.1",
  "odpt:fromBusstopPole" : "odpt.BusstopPole:Toei.Shimoicchoume.663.1",
  "odpt:fromBusstopPoleTime" : "2017-11-22T14:54:42+09:00",
  "odpt:toBusstopPole" : "odpt.BusstopPole:Toei.Kitashakoiriguchi.2294.1",
  "odpt:startingBusstopPole" : "odpt.BusstopPole:Toei.Akabaneekihigashiguchi.21.1",
  "odpt:terminalBusstopPole" : "odpt.BusstopPole:Toei.Toshimagochoumedanchi.1004.4",
  "dc:date" : "2017-11-22T14:56:49+09:00",
  "dct:valid" : "2017-11-22T14:57:04+09:00"
} ]
```

### odpt:BusTimetable

Bus timetable for station departure times.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt_BusTimetable.jsonld",
  "@type" : "odpt:BusTimetable",
  "owl:sameAs" : "odpt.BusTimetable:SeibuBus.NeriDaka01.1001.1.1.Weekday",
  "dc:date" : "2017-11-15T09:57:34+09:00",
  "dc:title" : "練高０１",
  "odpt:operator" : "odpt.Operator:SeibuBus",
  "odpt:busroutePattern" : "odpt.BusroutePattern:SeibuBus.NeriDaka01.1001.1",
  "odpt:calendar" : "odpt.Calendar:Weekday",
  "odpt:busTimetableObject" : [ {
    "odpt:index" : 0,
    "odpt:busstopPole" : "odpt.BusstopPole:SeibuBus.Nerimatakanodaieki.20053.1",
    "odpt:departureTime" : "6:56",
    "odpt:destinationSign" : "成増駅南口",
    "odpt:isMidnight" : false,
    "odpt:canGetOn" : true,
    "odpt:canGetOff" : false
  }, {
    "odpt:index" : 1,
    "odpt:busstopPole" : "odpt.BusstopPole:SeibuBus.Takanodaiicchoume.20054.1",
    "odpt:arrivalTime" : "6:57",
    "odpt:departureTime" : "6:57",
    "odpt:destinationSign" : "成増駅南口",
    "odpt:isMidnight" : false,
    "odpt:canGetOn" : true,
    "odpt:canGetOff" : true
  }, {
    "odpt:index" : 2,
    "odpt:busstopPole" : "odpt.BusstopPole:SeibuBus.Yaharasanchoume.20069.5",
    "odpt:arrivalTime" : "6:59",
    "odpt:departureTime" : "6:59",
    "odpt:destinationSign" : "成増駅南口",
    "odpt:isMidnight" : false,
    "odpt:canGetOn" : true,
    "odpt:canGetOff" : true
  } ]
} ]
```

### odpt:BusroutePattern

Bus route (list of stops) information.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt_BusroutePattern.jsonld",
  "@type" : "odpt:BusroutePattern",
  "ow:sameAs" : "odpt.BusroutePattern:Toei.Ou57.40301.1",
  "dc:date" : "2017-11-14T17:45:28+09:00",
  "dc:title" : "王５７",
  "odpt:kana" : "おう、ごじゅうなな",
  "odpt:operator" : "odpt.Operator:Toei",
  "odpt:busroute" : "odpt.Busroute:Toei.Ou57",
  "odpt:pattern" : "40301",
  "odpt:direction" : "1",
  "odpt:busstopPoleOrder" : [ {
    "odpt:busstopPole" : "odpt.BusstopPole:Toei.Akabaneekihigashiguchi.21.1",
    "odpt:index" : 1
  }, {
    "odpt:busstopPole" : "odpt.BusstopPole:Toei.Akabanenichoume.23.1",
    "odpt:index" : 2
  }, {
    "odpt:busstopPole" : "odpt.BusstopPole:Toei.Iwabuchimachi.126.1",
    "odpt:index" : 3
  } ]
} ]
```

### odpt:BusroutePatternFare

Price definition for routes as pairs of 2 stops.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt_BusroutePatternFare.jsonld",
  "@type" : "odpt:BusroutePatternFare",
  "owl:sameAs" : "odpt.BusroutePatternFare:Toei.Ou57.40301.1.1.Akabaneekihigashiguchi.Toei.Ou57.40301.1.2.Akabanenichoume",
  "dc:date" : "2017-11-14T17:45:31+09:00",
  "odpt:operator" : "odpt.Operator:Toei",
  "odpt:fromBusroutePattern" : "odpt.BusroutePattern:Toei.Ou57.40301.1",
  "odpt:fromBusstopPoleOrder" : 1,
  "odpt:fromBusstopPole" : "odpt.BusstopPole:Toei.Akabaneekihigashiguchi.21.1",
  "odpt:toBusroutePattern" : "odpt.BusroutePattern:Toei.Ou57.40301.1",
  "odpt:toBusstopPoleOrder" : 2,
  "odpt:toBusstopPole" : "odpt.BusstopPole:Toei.Akabanenichoume.23.1",
  "odpt:ticketFare" : 210,
  "odpt:childTicketFare" : 110,
  "odpt:icCardFare" : 206,
  "odpt:childIcCardFare" : 103
} ]
```

### odpt:BusstopPole

General information about bus stops.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt_BusstopPole.jsonld,",
  "@type" : "odpt:BusstopPole",
  "owl:sameAs" : "odpt.BusstopPole:Toei.Akabaneekihigashiguchi.21.1",
  "dc:date" : "2017-11-14T17:44:05+09:00",
  "dc:title" : "赤羽駅東口",
  "odpt:kana" : "あかばねえきひがしぐち",
  "geo:long" : 139.7214941,
  "geo:lat" : 35.7790549,
  "odpt:busroutePattern" : [ "odpt.BusroutePattern:Toei.Ou57.40301.1", "odpt.BusroutePattern:Toei.Ou57.40301.2", "odpt.BusroutePattern:Toei.Ou57.40302.2" ],
  "odpt:operator" : [ "odpt.Operator:Toei" ],
  "odpt:busstopPoleNumber" : "1",
  "odpt:busstopTimetable" : [ "odpt.BusstopPoleTimetable:Toei.Ou57.Akabaneekihigashiguchi.21.1.Toshimagochoumedanchi.Holiday", "odpt.BusstopPoleTimetable:Toei.Ou57.Akabaneekihigashiguchi.21.1.Toshimagochoumedanchi.Saturday", "odpt.BusstopPoleTimetable:Toei.Ou57.Akabaneekihigashiguchi.21.1.Toshimagochoumedanchi.Weekday" ]
} ]
```

### odpt:BusstopPoleTimetable

Timetable for busses departing from a stop. There may be separate data depending on the day of the week, destination, route, etc.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt_BusstopPoleTimetable.jsonld",
  "@type" : "odpt:BusstopPoleTimetable",
  "owl:sameAs" : "odpt.BusstopPoleTimetable:Toei.Ou57.Akabaneekihigashiguchi.21.1.Toshimagochoumedanchi.Weekday",
  "dc:date" : "2017-11-14T17:29:41+09:00",
  "dc:title" : "王５７:赤羽駅東口:豊島五丁目団地行:平日",
  "odpt:busstopPole" : "odpt.BusstopPole:Toei.Akabaneekihigashiguchi.21.1",
  "odpt:busDirection" : "odpt.BusDirection:Toei.Toshimagochoumedanchi",
  "odpt:busroute" : "odpt.Busroute:Toei.Ou57",
  "odpt:operator" : "odpt.Operator:Toei",
  "odpt:calendar" : "odpt.Calendar:Weekday",
  "odpt:busstopPoleTimetableObject" : [ {
    "odpt:departureTime" : "06:21",
    "odpt:destinationBusstopPole" : "odpt.BusstopPole:Toei.Toshimagochoumedanchi.1004.4",
    "odpt:destinationSign" : "豊島五丁目団地行",
    "odpt:isNonStepBus" : true,
    "odpt:isMidnight" : false
  }, {
    "odpt:departureTime" : "06:35",
    "odpt:destinationBusstopPole" : "odpt.BusstopPole:Toei.Toshimagochoumedanchi.1004.4",
    "odpt:destinationSign" : "豊島五丁目団地行",
    "odpt:isNonStepBus" : true,
    "odpt:isMidnight" : false
  }, {
    "odpt:departureTime" : "06:52",
    "odpt:destinationBusstopPole" : "odpt.BusstopPole:Toei.Toshimagochoumedanchi.1004.4",
    "odpt:destinationSign" : "豊島五丁目団地行",
    "odpt:isNonStepBus" : true,
    "odpt:isMidnight" : false
  }, {
    "odpt:departureTime" : "07:05",
    "odpt:destinationBusstopPole" : "odpt.BusstopPole:Toei.Toshimagochoumedanchi.1004.4",
    "odpt:destinationSign" : "豊島五丁目団地行",
    "odpt:isNonStepBus" : true,
    "odpt:isMidnight" : false
  } ]
} ]
```

## Aircraft

Data related to airlines. For more information, check [https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9_4](https://developer-tokyochallenge.odpt.org/ja/documents#_%E5%AE%9A%E7%BE%A9_4)(Japanese only).

### odpt:Airport

General airport information. (Name, terminals etc..)

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:Airport",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.Airport:HND",
  "dc:title" : "東京(羽田)",
  "odpt:airportTitle" : {
    "ja" : "東京(羽田)",
    "en" : "Tokyo (Haneda)"
  },
  "odpt:airportTerminal" : [ "odpt.AirportTerminal:HND.DomesticTerminal1", "odpt.AirportTerminal:HND.DomesticTerminal2", "odpt.AirportTerminal:HND.InternationalTerminal" ]
} ]
```

### odpt:AirportTerminal

General reference information for airport terminals.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:AirportTerminal",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.AirportTerminal:HND.DomesticTerminal1",
  "dc:title" : "国内線第１ターミナル",
  "odpt:airportTerminalTitle" : {
    "ja" : "国内線第１ターミナル",
    "en" : "Domestic Terminal 1"
  },
  "odpt.airport" : "odpt.Airport:HND"
} ]
```

### odpt:FlightInformationArrival (LIVE)

Real time information for aircraft arrivals, terminal details and statuses on that day.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:uuid:ff91feee-2d2c-4365-902e-26375fdf9d8b",
  "@type" : "odpt:FlightInformationArrival",
  "dc:date" : "2017-12-06T23:15:01+09:00",
  "owl:sameAs" : "odpt.FlightInformationArrival:NAA.NRT.NH832",
  "odpt:operator" : "odpt.Operator:NAA",
  "odpt:airline" : "odpt.Operator:ANA",
  "odpt:flightNumber" : [ "NH832" ],
  "odpt:flightStatus" : "odpt.FlightStatus:Arrived",
  "odpt:scheduledArrivalTime" : "06:45",
  "odpt:actualArrivalTime" : "06:48",
  "odpt:arrivalAirport" : "odpt.Airport:NRT",
  "odpt:arrivalAirportTerminal" : "odpt.AirportTerminal:NRT.Terminal1",
  "odpt:arrivalGate" : "27",
  "odpt:baggageClaim" : "27",
  "odpt:originAirport" : "odpt.Airport:SGN",
  "odpt:aircraftType" : "788"
} ]
```

### odpt:FlightInformationDeparture (LIVE)

Real time information for aircraft departures, terminal details and statuses on that day.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:uuid:f476346b-ae6d-4102-99d8-2bf80d7c4dd8",
  "@type" : "odpt:FlightInformationDeparture",
  "dc:date" : "2017-12-06T23:20:02+09:00",
  "owl:sameAs" : "odpt.FlightInformationDeparture:NAA.NRT.9W4807",
  "odpt:operator" : "odpt.Operator:NAA",
  "odpt:airline" : "odpt.Operator:JAI",
  "odpt:flightNumber" : [ "9W4807" ],
  "odpt:flightStatus" : "odpt.FlightStatus:Takeoff",
  "odpt:scheduledDepartureTime" : "08:30",
  "odpt:actualDepartureTime" : "08:32",
  "odpt:departureAirport" : "odpt.Airport:NRT",
  "odpt:departureAirportTerminal" : "odpt.AirportTerminal:NRT.Terminal2",
  "odpt:departureGate" : "85",
  "odpt:checkInCounter" : [ "B", "C" ],
  "odpt:destinationAirport" : "odpt.Airport:HKG",
  "odpt:aircraftType" : "788"
} ]
```

### odpt:FlightSchedule

Get the scheduled flight timetables for aircrafts that arrive and depart on the airport.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:FlightSchedule",
  "dc:date" : "2017-10-31T23:06:38+09:00",
  "owl:sameAs" : "odpt.FlightSchedule:HND-TIAT.HND.IWJ.Wednesday",
  "odpt:operator" : "odpt.Operator:HND-TIAT",
  "odpt:calendar" : "odpt.Calendar:Wednesday",
  "odpt:originAirport" : "odpt.Airport:HND",
  "odpt:destinationAirport" : "odpt.Airport:IWJ",
  "odpt:flightScheduleObject" : [ {
    "odpt:airline" : "odpt.Operator:ANA",
    "odpt:flightNumber" : [ "NH575" ],
    "odpt:originTime" : "10:35",
    "odpt:destinationTime" : "12:15",
    "odpt:isValidFrom" : "2017-10-01T00:00:00+09:00",
    "odpt:isValidTo" : "2017-10-31T23:59:59+09:00"
  } ]
} ]
```

### odpt:FlightStatus

Definition of flight statuses.

Sample response:

```json
[ {
  "@context" : "http://vocab.odpt.org/context_odpt.jsonld",
  "@id" : "urn:ucode:_00001C000000000000010000030FD7E5",
  "@type" : "odpt:FlightStatus",
  "dc:date" : "2017-01-13T15:10:00+09:00",
  "owl:sameAs" : "odpt.FlightStatus:CheckIn",
  "dc:title" : "搭乗手続中",
  "odpt:flightStatusTitle" : {
    "ja" : "搭乗手続中",
    "en" : "Check in"
  }
} ]
```

## File API

For more information, check [https://developer-tokyochallenge.odpt.org/ja/documents#_odpt_file_api](https://developer-tokyochallenge.odpt.org/ja/documents#_odpt_file_api)(Japanese only).
