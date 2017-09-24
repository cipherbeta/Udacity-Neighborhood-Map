# Udacity Neighborhood Map
<hr>
This application is designed to easily allow the user to search for available locations in a specific area. Uses and abuses KnockoutJS, jQuery, AnimeJS and the Google Maps API to cleanly and efficiently deliver info to the user.

#### // HOW TO USE
Clone the repository or download the .zip file provided above. Extract the files to the directory of your choice and open index.html in your web browser. You can also upload all necessary files (index.html, css/js/img folders) to a web server and access it at that location.

To view/sort locations on the map, click the 'search' button on the left hand side or swipe your mouse to the left side of the map. From here, you can click on a particular location to move the map to that location, or you can type into the search box to narrow down the locations.

#### // HOW TO EDIT
Map markers are defined via a knockoutJS observableArray, defined at the top of the file inside the viewmodel. Each entry in viewModel.markers() should include the following information:
* Title (title)
* Location object (location.lat, location.long, location.address)
* Google Maps placeID (placeid)
* Long content (content)
* Yelp business identification (yelpID)

Markers defined in viewModel.markers() be pushed to a new observableArray called gMarkers() that includes Google Maps Marker information, making it sortable.
