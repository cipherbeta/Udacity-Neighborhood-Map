var viewModel = {
  // Nav open and close via knockoutjs
  // TODO: Enable swipe support down the line
  self : this,
  openNavigation : function() {
    document.getElementById("sideNav").style.marginLeft = "0";
    document.getElementById("main").style.marginLeft = "16em";
  },

  closeNavigation : function() {
    document.getElementById("sideNav").style.marginLeft = "-16em";
    document.getElementById("main").style.marginLeft = "0";
  },

  markers : ko.observableArray([
    { title: 'Eye On Entrepreneurs', lat: 45.913750, lng: -89.257755, placeID: 'ChIJ9SwINsw3VE0RTDLel7J7Z-U', content: 'This is the Eye on Entrepreneurs building.' },
    { title: 'Trigs of Eagle River', lat: 45.915717, lng: -89.240019, placeID: 'ChIJ-ZZXnek3VE0RBbpY67WJV1Y', content: 'This is Trigs of Eagle River. Great food.' },
    { title: 'Eagle River Airport', lat: 45.934099, lng: -89.261834, placeID: 'ChIJdSZITVA2VE0RDqqRxn-Kjgw', content: 'This is the Eagle River Airport. Visit us for fly-ins!' }
  ]),

  userQuery : ko.observable(''),

  toClicked : ko.observable({}),

  logClick : function(clicked){
    toClicked = ko.observable({});
    toClicked().title = clicked.title;
    toClicked().lat = clicked.lat;
    toClicked().lng = clicked.lng;
    toClicked().placeID = clicked.placeID;
    toClicked().address = clicked.address;
    toClicked().content = clicked.content;
    console.log(toClicked());
    return toClicked();
  }
};

var map;


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
    viewModel.closeNavigation();
  });
  $('#longHelp_goBack').on('click', function() {
    $('#longHelpWindow').css('left','100%');
    $('#helpButton').css('opacity','100');
  });

  // Bind animation functions for the information window that pops up on arrow click
  $('.resultOPEN').on('click', function(){
    $('#longInfoWindow').css('right','0');
    viewModel.closeNavigation();
  });
  $('#longInfo_goBack').on('click', function() {
    $('#longInfoWindow').css('right','100%');
  });
});

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

viewModel.searchResults = ko.computed(function() {
  var q = viewModel.userQuery();
  var search = viewModel.markers().filter(function(i) {
    return i.title.toLowerCase().indexOf(q) >= 0;
  });
  return search;
});

// Defines our map style for map generation, courtesy of Snazzy Maps
// var mapStyle = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"17"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"landscape.man_made","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"landscape.natural","elementType":"labels","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#ff4700"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"invert_lightness":true},{"visibility":"off"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry.fill","stylers":[{"color":"#3b3b3b"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#ff4700"},{"lightness":"39"},{"gamma":"0.43"},{"saturation":"-47"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#555555"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}];

var bouncingBall = anime({
  targets: '#helpButton',
  rotate: '1turn',
  loop: false,
  direction: 'alternate',
  autoplay: true
});

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.917034, lng: -89.248168},
    zoom: 15,
    // styles: mapStyle,
    disableDefaultUI: true
  });



  initData(map, viewModel.markers());

  function initData(map, markers){
    var markerData = markers;
    for (i = 0; i < markerData.length; i++){
      var position = new google.maps.LatLng(markerData[i].lat, markerData[i].lng);
      var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: markerData[i].title
      });
      var content = markerData[i].content;
      var infoWindow = new google.maps.InfoWindow();
      google.maps.event.addListener(marker, 'click', (function(marker, content, infoWindow){
        return function() {
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        };
      })(marker, content, infoWindow));
    }
  }



  // for (i = 0; i < viewModel.markers().length; i++){
  //   var position = new google.maps.LatLng(viewModel.markers()[i].lat, viewModel.markers()[i].lng);
  //   marker = new google.maps.Marker({
  //     position: position,
  //     map: map,
  //     animation: google.maps.Animation.DROP,
  //     title: viewModel.markers()[i].title
  //   });
  // }
}



initMap();
ko.applyBindings(viewModel);
