//        _                                   _      _
//       (_)                                 | |    | |
// __   ___  _____      ___ __ ___   ___   __| | ___| |
// \ \ / / |/ _ \ \ /\ / / '_ ` _ \ / _ \ / _` |/ _ \ |
//  \ V /| |  __/\ V  V /| | | | | | (_) | (_| |  __/ |
//   \_/ |_|\___| \_/\_/ |_| |_| |_|\___/ \__,_|\___|_|
//
//

var viewModel = {
  // Nav open and close via knockoutjs
  // TODO: Enable swipe support down the line

  // Define self for clarity down the line
  self: this,

  markers: ko.observableArray([{
      title: 'White Spruce Inn',
      location: {
        lat: 45.920036,
        lng: -89.253894,
        address: '419 N. Railroad St, Eagle River, WI'
      },
      placeID: 'ChIJvyJyzMk3VE0RyBj7sxv6nuI',
      content: 'Whether you just want to stop by for a few appetizers amongst friends, grab a quick lunch with a co-worker, or enjoy a full meal with family, Eddie B’s White Spruce Restaurant & Tavern will deliver excellent food and drink to you every time.',
      zomatoID: '17690788'
    },
    {
      title: 'Alexander\'s Family Pizza',
      location: {
        lat: 45.914910,
        lng: -89.251605,
        address: '211 S Railroad St, Eagle River, WI'
      },
      placeID: 'ChIJmyJp8sg3VE0RsckvMA8qkho',
      content: 'The classic family-oriented arcade and pizza joint. Come on by for arcade games, shooting some pool, or just hanging out!',
      zomatoID: '17686025'
    },
    {
      title: 'Riverstone Restaurant and Tavern',
      location: {
        lat: 45.918378,
        lng: -89.252927,
        address: '219 N Railroad St, Eagle River, WI'
      },
      placeID: 'ChIJfcY38sg3VE0RWKNqVFR5EuQ',
      content: 'Welcome to Riverstone Restaurant & Tavern! Come as you are and enjoy anything from fresh made artisan hearth breads to from-scratch pizza to wild alaskan salmon! Ron and Cindy Meinholz, Owners South of the bridge, in historic downtown Eagle River, and... Home of Riverstone Catering!',
      zomatoID: '17686059'
    },
    {
      title: 'Butch\'s Pizza',
      location: {
        lat: 45.915167,
        lng: -89.249773,
        address: '220 E Wall St, Eagle River, WI'
      },
      placeID: 'ChIJ225_Uc83VE0R7b8Bb1g4o1U',
      content: 'Butch\'s is the finest pizzeria in the Northwoods of Wisconsin. We are proud to offer our famous thin crust and hand tossed pizza, entirely homemade, prepared in small batches from the finest ingredients. Our dough and sauce are secret recipes, developed over 40 years ago and mixed from scratch daily with only the finest ingredients. So you choose yur favorite toppings and we will prepare your pie to order, never skimping on toppings and finishing it off with 100% mozzarella cheese. Butch\'s pizza never uses fillers in the cheese, sauce or dough, so enjoy a truly homemade pizza and taste the difference.',
      zomatoID: '17686031'
    },
    {
      title: 'Soda Pops Restaurant',
      location: {
        lat: 45.915735,
        lng: -89.251947,
        address: '125 S Railroad St, Eagle River, WI'
      },
      placeID: 'ChIJTV1AVM83VE0RAPYSiLK2AD4',
      content: 'Welcome to Riverstone Restaurant & Tavern! Come as you are and enjoy anything from fresh made artisan hearth breads to from-scratch pizza to wild alaskan salmon! Ron and Cindy Meinholz, Owners South of the bridge, in historic downtown Eagle River, and... Home of Riverstone Catering!',
      zomatoID: '17686062'
    }
  ]),

  // Define whether the menu is open as an observable, as we'll use this to track state in some circumstances down the line.
  menuIsOpen: ko.observable(false),

  // Call to open up the navigation window.
  openNavigation: function() {
    $('#sideNav').css('marginLeft', '0');
    // This line below shifts the map as well. Poor performance on mobile....
    // $('#main').css('marginLeft','16em');
    $('#tapControls').css('marginLeft', '16em');
    viewModel.menuIsOpen(true);
  },

  closeNavigation: function() {
    $('#sideNav').css('marginLeft', '-16em');
    // This line below shifts the map as well. Poor performance on mobile....
    // $('#main').css('marginLeft','0');
    $('#tapControls').css('marginLeft', '0');
    viewModel.menuIsOpen(false);
  },

  // Shifts our nav controls over just a skosh to avoid mouseover with any other menus open.
  hideNavControls: function() {
    $('#tapControls').css('left', '-2em');
    $('#navControlsLink').css('left', '-1em');
  },

  // Shifts our nav controls back when we want to make them available again.
  showNavControls: function() {
    $('#tapControls').css('left', '0');
    $('#navControlsLink').css('left', '0');
  },

  // Define our object array that the map's going to use for markers.


  // Defines the array we're going to store google maps markers in.
  gMarkers: ko.observableArray([]),

  // Creates an observable that we watch to run our sorting system.
  userQuery: ko.observable(''),

  // Creates an object based on what's clicked on our search menu.
  toClicked: ko.observable({}),

  // Logs what we click on and defines it @ toClicked(), also centers map and animates on this particular item.
  logClick: function(clicked) {
    // set what we clicked on to our observable
    viewModel.toClicked(clicked);
    console.log(clicked);
    // center the map at clicked location
    map.setCenter(clicked.getPosition());
    // zoom in for address clarity
    map.setZoom(16);
    // open up our info window relative to what we clicked
    google.maps.event.trigger(clicked, 'click');
    // animation drop
    viewModel.toClicked().setAnimation(google.maps.Animation.DROP);
    return viewModel.toClicked();
  },

  // Watches our search bar, and sorts results and markers based on input.
  searchResults: ko.pureComputed(function() {
    var q = viewModel.userQuery();
    // Filters our gMarkers array and returns only what matches the query
    var search = viewModel.gMarkers().filter(function(i) {
      var x = i.title.toLowerCase().indexOf(q) >= 0;
      return x;
    });
    // Sets all markers to null before we repop with the right stuff
    setMapOnAll(null);
    // If we don't see anything in our user query, make sure all markers are displayed
    if (!viewModel.userQuery()) {
      setMapOnAll(map);
    } else {
      for (i = 0; i < search.length; i++) {
        // if we do have a query result, set that map marker visible.
        search[i].setMap(map);
      }
    }

    return search;
  })
};

//      _                                 _
//     | |                               | |
//   __| | ___   ___   _ __ ___  __ _  __| |_   _
//  / _` |/ _ \ / __| | '__/ _ \/ _` |/ _` | | | |
// | (_| | (_) | (__  | | |  __/ (_| | (_| | |_| |
//  \__,_|\___/ \___| |_|  \___|\__,_|\__,_|\__, |
//                                           __/ |
//                                          |___/
//

$(document).ready(function() {
  console.log("Ready!");

  $('#loaderDiv').css('opacity', '0');
  $('#loaderDiv').remove();

  // Bind hover function after document's ready to roll
  $('.locationList').hover(function() {
    $(this).addClass('active');
  }, function() {
    $(this).removeClass('active');
  });

  // Bind animation functions for the help window that pops up on question click
  $('#helpButton').on('click', function() {
    $('#longHelpWindow').css('left', '0');
    $('#helpButton').css('opacity', '0');
    viewModel.hideNavControls();
    viewModel.closeNavigation();
  });
  // Bind animation functions for the close help button
  $('#longHelp_goBack').on('click', function() {
    $('#longHelpWindow').css('left', '100%');
    $('#helpButton').css('opacity', '100');
    viewModel.showNavControls();
  });

  // Bind animation functions for the information window that pops up on arrow click
  $('.resultOPEN').on('click', function() {
    $('#longInfoWindow').css('right', '0');
    $('#helpButton').css('opacity', '0');
    viewModel.hideNavControls();
    viewModel.closeNavigation();
  });
  $('#longInfo_goBack').on('click', function() {
    $('#longInfoWindow').css('right', '100%');
    $('#helpButton').css('opacity', '100');
    viewModel.showNavControls();
  });
});

//      _                   _
//     | |                 | |
//   __| | ___   ___    ___| |__   __ _ _ __   __ _  ___
//  / _` |/ _ \ / __|  / __| '_ \ / _` | '_ \ / _` |/ _ \
// | (_| | (_) | (__  | (__| | | | (_| | | | | (_| |  __/
//  \__,_|\___/ \___|  \___|_| |_|\__,_|_| |_|\__, |\___|
//                                             __/ |
//                                            |___/
//

// When document updates, some functionality breaks from init. Rebinding
// UI actions on document changes (i.e., search function) fixes this.
$(document).change(function() {
  $('.locationList').hover(function() {
    $(this).addClass('active');
  }, function() {
    $(this).removeClass('active');
  });

  $('#helpButton').on('click', function() {
    $('#longHelpWindow').css('left', '0');
    $('#helpButton').css('opacity', '0');
    viewModel.closeNavigation();
  });
  $('#longHelp_goBack').on('click', function() {
    $('#longHelpWindow').css('left', '100%');
    $('#helpButton').css('opacity', '100');
  });
});

//              _                 _   _
//             (_)               | | (_)
//   __ _ _ __  _ _ __ ___   __ _| |_ _  ___  _ __
//  / _` | '_ \| | '_ ` _ \ / _` | __| |/ _ \| '_ \
// | (_| | | | | | | | | | | (_| | |_| | (_) | | | |
//  \__,_|_| |_|_|_| |_| |_|\__,_|\__|_|\___/|_| |_|
//
//

// Animates our question button via animejs
var bouncingBall = anime({
  targets: '#helpButton',
  rotate: '1turn',
  loop: false,
  direction: 'alternate',
  autoplay: true
});

// TODO: In the future, have all anims played through animejs


// ______                     _
// |___  /                    | |
//   / / ___  _ __ ___   __ _| |_ ___
//  / / / _ \| '_ ` _ \ / _` | __/ _ \
// / /_| (_) | | | | | | (_| | || (_) |
// /_____\___/|_| |_| |_|\__,_|\__\___/
//

// zomatoID
var zomatoGetData = function(input){
  var zomID = input.zomatoID;
  var result = $.ajax({
    url: 'https://developers.zomato.com/api/v2.1/restaurant?res_id=' + zomID,
    headers: { 'user-key' : '69acf94ce65eed4a327ab2a853610996' },
    success: function(result) {
      return result;
    },
    error: function (thrownError){
      alert("Looks like we're having some trouble chatting with Zomato. If this persists, please let us know the error shown below and I'll see what I can do. Thanks!" + thrownError);
    }

  });
  console.log("Zomato Data Updated");
  return result;
};

var validateUndefined = function(input){
  if (input !== undefined) {
    return input;
  }
};

//                          _
//                         | |
//   __ _  ___   ___   __ _| | ___   _ __ ___   __ _ _ __  ___
//  / _` |/ _ \ / _ \ / _` | |/ _ \ | '_ ` _ \ / _` | '_ \/ __|
// | (_| | (_) | (_) | (_| | |  __/ | | | | | | (_| | |_) \__ \
//  \__, |\___/ \___/ \__, |_|\___| |_| |_| |_|\__,_| .__/|___/
//   __/ |             __/ |                        | |
//  |___/             |___/                         |_|
//

// Define our map to call it later
var map;

var mapsAPIkey = 'AIzaSyCs-Crx7hPswfS-5yRSMJfHLal7Kbm0aHM';

// Map styling courtesy of Snazzy Maps
var mapStyle = [{
  "featureType": "all",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "all",
  "elementType": "labels.icon",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "administrative.locality",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "administrative.neighborhood",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "landscape",
  "elementType": "all",
  "stylers": [{
    "color": "#dcdcdc"
  }]
}, {
  "featureType": "landscape",
  "elementType": "geometry",
  "stylers": [{
    "color": "#e2e3e4"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "poi",
  "elementType": "all",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "poi",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }, {
    "saturation": "-65"
  }, {
    "lightness": "5"
  }]
}, {
  "featureType": "poi.attraction",
  "elementType": "all",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "poi.attraction",
  "elementType": "geometry",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "poi.attraction",
  "elementType": "geometry.fill",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "poi.attraction",
  "elementType": "geometry.stroke",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "poi.park",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#e2e3e4"
  }]
}, {
  "featureType": "poi.school",
  "elementType": "geometry.fill",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "road",
  "elementType": "all",
  "stylers": [{
    "saturation": -100
  }, {
    "lightness": 45
  }]
}, {
  "featureType": "road",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "road.highway",
  "elementType": "all",
  "stylers": [{
    "visibility": "on"
  }]
}, {
  "featureType": "road.highway",
  "elementType": "geometry.fill",
  "stylers": [{
    "color": "#fdbf6e"
  }, {
    "visibility": "on"
  }]
}, {
  "featureType": "road.highway",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "road.arterial",
  "elementType": "labels.icon",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "transit",
  "elementType": "all",
  "stylers": [{
    "visibility": "simplified"
  }, {
    "saturation": "-100"
  }, {
    "gamma": "1"
  }]
}, {
  "featureType": "transit",
  "elementType": "geometry",
  "stylers": [{
    "visibility": "simplified"
  }]
}, {
  "featureType": "transit",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "transit",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "simplified"
  }, {
    "color": "#909090"
  }]
}, {
  "featureType": "transit",
  "elementType": "labels.icon",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "transit.line",
  "elementType": "labels",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "transit.station.rail",
  "elementType": "labels.text",
  "stylers": [{
    "visibility": "off"
  }]
}, {
  "featureType": "water",
  "elementType": "all",
  "stylers": [{
    "color": "#c3e1ec"
  }, {
    "visibility": "on"
  }]
}];

// Initialize our map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 45.917034,
      lng: -89.248168
    },
    zoom: 15,
    styles: mapStyle,
    disableDefaultUI: true
  });

  // initialize our infowindow outside of marker generation
  // as we only want one open on the map at any time
  var infoWindow = new google.maps.InfoWindow();

  initData(map, viewModel.markers());

  function initData(map, markers) {
    var markerData = markers;
    for (i = 0; i < markerData.length; i++) {
      // Grab marker data so we only have to call it once
      var m = markerData[i];
      // Define everything
      var position = new google.maps.LatLng(m.location.lat, m.location.lng);
      var title = m.title;
      var lat = m.location.lat;
      var lng = m.location.lng;
      var address = m.location.address;
      var placeID = m.placeID;
      var directions = 'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(address) + '&destination_place_id=' + placeID;
      var content = m.content;
      var zomatoID = m.zomatoID;
      var zomatoInfo = zomatoGetData(m);
      // Push all this info to the google maps marker
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        lat: lat,
        lng: lng,
        address: address,
        directions: directions,
        placeID: placeID,
        zomatoID: zomatoID,
        zomatoInfo: zomatoInfo,
        content: content
      });
      // adds data for info window to marker
      makeInfoWindow(marker);
      // Push our new marker to our google Markers array.
      viewModel.gMarkers().push(marker);
    }

    // generates data for infoWindow based on marker data
    function makeInfoWindow(marker) {
      google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(this.title + '<br>' + this.address + '<br><a target="_blank" href="' + this.directions + '">Get Directions</a>');
      infoWindow.open(map, this);  // Not sure where map is coming from
      map.setCenter(this);
      });
    }


  }

  // Initialize bounds that we can redefine as markers are sorted.
  var bounds = new google.maps.LatLngBounds();

  // Initially scaling the bounds of our view to fit the markers.
  for (var i = 0; i < viewModel.gMarkers().length; i++) {
    bounds.extend(viewModel.gMarkers()[i].getPosition());
  }
  // Initially fit bounds for our viewsize.
  map.fitBounds(bounds);
}

var setMapOnAll = function(map) {
  for (var i = 0; i < viewModel.gMarkers().length; i++) {
    viewModel.gMarkers()[i].setMap(map);
  }
};

// Call our map to get things started.
initMap();

// Bind our viewmodel
ko.applyBindings(viewModel);
