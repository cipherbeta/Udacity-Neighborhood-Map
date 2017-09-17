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
  self : this,

  // Define whether the menu is open as an observable, as we'll use this to track state in some circumstances down the line.
  menuIsOpen : ko.observable(false),

  // Call to open up the navigation window.
  openNavigation : function() {
    $('#sideNav').css('marginLeft','0');
    // This line below shifts the map as well. Poor performance on mobile....
    // $('#main').css('marginLeft','16em');
    $('#tapControls').css('marginLeft','16em');
    viewModel.menuIsOpen(true);
    console.log("Menu opened, menuIsOpen set to true.");
  },

  closeNavigation : function() {
    $('#sideNav').css('marginLeft','-16em');
    // This line below shifts the map as well. Poor performance on mobile....
    // $('#main').css('marginLeft','0');
    $('#tapControls').css('marginLeft','0');
    viewModel.menuIsOpen(false);
    console.log("Menu is closed, menuIsOpen set to false.");
  },

  // Shifts our nav controls over just a skosh to avoid mouseover with any other menus open.
  hideNavControls : function() {
    $('#tapControls').css('left','-2em');
    $('#navControlsLink').css('left','-1em');
  },

  // Shifts our nav controls back when we want to make them available again.
  showNavControls : function() {
    $('#tapControls').css('left','0');
    $('#navControlsLink').css('left','0');
  },

  // Define our object array that the map's going to use for markers.
  markers : ko.observableArray([
    {
      title: 'Eye On Entrepreneurs',
      location: { lat: 45.913750,
                  lng: -89.257755,
                  address: '348 West Pine St., Eagle River, WI' },
      placeID: 'ChIJ9SwINsw3VE0RTDLel7J7Z-U',
      content: 'This is the Eye on Entrepreneurs building - a space where many budding entrepreneurs have found their home! From the web developers at Goose Cap Media, the professional seamstress in StitchIt, the insane artistic work of Mugsy Depuyt, and the professional artist and signmaker at The Blank Canvas, this is a creative hub that is sure to pique your interest.'
    },
    {
      title: 'Trigs of Eagle River',
      location: { lat: 45.915717,
                  lng: -89.240019,
                  address: '925 E Wall St, Eagle River, WI' },
      placeID: 'ChIJ-ZZXnek3VE0RBbpY67WJV1Y',
      content: 'This is Trigs of Eagle River. The "grocery store" for Eagle River, one can find a multitude of local cooking, including the renowned "world\'s best brats"! (They actually won the competition!) Trig\'s is a fundraising hub, and charity hub, and all around just a decent grocery store in the heart of Eagle River. But damn, that\'s a good brat.'
    },
    {
      title: 'Eagle River Airport',
      location: { lat: 45.934099,
                  lng: -89.261834,
                  address: '1311 Airport Rd, Eagle River, WI' },
      placeID: 'ChIJdSZITVA2VE0RDqqRxn-Kjgw',
      content: 'This is the Eagle River Airport. Often a stopping point for the smaller recreational aircraft, it\'s also a stopping point for jumpers going to the larger Rhinelander airport. The yearly fly-in is a popular event, boasting several particularly awesome things such as professional model aircraft stunts, home-made aircraft, and occasionally the F-16C flyover from a nearby AFB.' }
  ]),

  // Defines the array we're going to store google maps markers in.
  gMarkers : ko.observableArray([]),

  // Creates an observable that we watch to run our sorting system.
  userQuery : ko.observable(''),

  // Creates an object based on what's clicked on our search menu.
  toClicked : ko.observable({}),

  // Logs what we click on and defines it @ toClicked(), also centers map and animates on this particular item.
  logClick : function(clicked){
    viewModel.toClicked(clicked);
    console.log(viewModel.toClicked());
    map.setCenter(clicked.getPosition());
    map.setZoom(16);
    viewModel.toClicked().setAnimation(google.maps.Animation.DROP);
    return viewModel.toClicked();
  },

  // Watches our search bar, and sorts results and markers based on input.
  searchResults : ko.pureComputed(function() {
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
        map.bounds.extend(search[i].getPosition());
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
  // Bind hover function after document's ready to roll
  $('.locationList').hover(function(){
    $(this).addClass('active');
  },function() {
    $(this).removeClass('active');
  });

  // Bind animation functions for the help window that pops up on question click
  $('#helpButton').on('click', function(){
    $('#longHelpWindow').css('left','0');
    $('#helpButton').css('opacity','0');
    viewModel.hideNavControls();
    viewModel.closeNavigation();
  });
  // Bind animation functions for the close help button
  $('#longHelp_goBack').on('click', function() {
    $('#longHelpWindow').css('left','100%');
    $('#helpButton').css('opacity','100');
    viewModel.showNavControls();
  });

  // Bind animation functions for the information window that pops up on arrow click
  $('.resultOPEN').on('click', function(){
    $('#longInfoWindow').css('right','0');
    $('#helpButton').css('opacity','0');
    viewModel.hideNavControls();
    viewModel.closeNavigation();
  });
  $('#longInfo_goBack').on('click', function() {
    $('#longInfoWindow').css('right','100%');
    $('#helpButton').css('opacity','100');
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
$(document).change(function(){
  $('.locationList').hover(function(){
    $(this).addClass('active');
  },function() {
    $(this).removeClass('active');
  });

  $('#helpButton').on('click', function(){
    $('#longHelpWindow').css('left','0');
    $('#helpButton').css('opacity','0');
    viewModel.closeNavigation();
  });
  $('#longHelp_goBack').on('click', function() {
    $('#longHelpWindow').css('left','100%');
    $('#helpButton').css('opacity','100');
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

 //                          _
 //                         | |
 //   __ _  ___   ___   __ _| | ___   _ __ ___   __ _ _ __  ___
 //  / _` |/ _ \ / _ \ / _` | |/ _ \ | '_ ` _ \ / _` | '_ \/ __|
 // | (_| | (_) | (_) | (_| | |  __/ | | | | | | (_| | |_) \__ \
 //  \__, |\___/ \___/ \__, |_|\___| |_| |_| |_|\__,_| .__/|___/
 //   __/ |             __/ |                        | |
 //  |___/             |___/                         |_|
 //

var map;

// Initialize our map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.917034, lng: -89.248168},
    zoom: 15,
    // styles: mapStyle,
    disableDefaultUI: true
  });

  initData(map, viewModel.markers());

  // initialize our infowindow as we only want one open on the map at any time
  var infoWindow = new google.maps.InfoWindow();





  function initData(map, markers){
    var markerData = markers;
    for (i = 0; i < markerData.length; i++){
      var m = markerData[i];
      var position = new google.maps.LatLng(m.location.lat, m.location.lng);
      var title = m.title;
      var lat = m.location.lat;
      var lng = m.location.lng;
      var address = m.location.address;
      var placeID = m.placeID;
      var content = m.content;
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        lat: lat,
        lng: lng,
        address: address,
        placeID: placeID,
        content: content
      });

      google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent('Marker position: ' + this.getPosition());
        infoWindow.open(map, this);
      });

      // Push our new marker to our google Markers array.
      viewModel.gMarkers().push(marker);
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

// Call our map to get things started with the appropriate markers.
initMap();

// Bind our viewmodel
ko.applyBindings(viewModel);
