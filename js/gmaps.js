var viewModel = {
  toggleNavigation : function() {
    if (navToggle) {
      openNavigation();
      navToggle = 0;
      console.log("Nav value set from 1 to 0");
      return navToggle;
    } if (!navToggle) {
      closeNavigation();
      navToggle = 1;
      console.log("Nav value set from 0 to 1");
      return navToggle;
    }
  },
  openNavigation : function() {
    document.getElementById("sideNav").style.marginLeft = "0";
    document.getElementById("main").style.marginLeft = "16em";
  },

  closeNavigation : function() {
    document.getElementById("sideNav").style.marginLeft = "-16em";
    document.getElementById("main").style.marginLeft = "0";
  },
  searchForPlaces : function(searchInput) {
    console.log("Searching for " + userQuery);
  },
  markers : ko.observableArray([
    [{ name: 'Eye On Entrepreneurs' }, { lat: 45.913750 }, { lng: -89.257755 }],
    [{ name: 'Trigs of Eagle River' }, { lat: 45.915717 }, { lng: -89.240019 }],
    [{ name: 'Eagle River Airport' }, { lat: 45.934099}, { lng: -89.261834 }]
  ])
};

viewModel.userQuery = ko.observable("");


var map;
var navToggle = 1;




function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 45.917034, lng: -89.248168},
    zoom: 15,
    disableDefaultUI: true
  });

  for (i = 0; i < markers().length; i++){
    var position = new google.maps.LatLng(markers()[i].lat, markers()[i].lng);
    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers()[i].name
    });
  }
}



initMap();
ko.applyBindings(viewModel);
