# Udacity Neighborhood (Restaurant) Map
<hr>
This application is designed to easily allow the user to search for available locations in a specific area. Uses and abuses KnockoutJS, jQuery, AnimeJS, the Google Maps API, and Zomato API to cleanly and efficiently deliver restaurant info to the user.

#### // HOW TO USE
Clone the repository or download the .zip file provided via the link above. Extract the files to the directory of your choice and open index.html in your web browser. You can also upload all necessary files (index.html, css/js/img folders) to a web server and access it at that location.

To view/sort locations on the map, click the 'search' button on the left hand side or swipe your mouse to the left side of the map. From here, you can click on a particular location to move the map to that location, or you can type into the search box to narrow down the locations. Clicking on a particular location will move to that location on the map and open up a Google Maps infoWindow with the address and directions link.

Clicking on the arrow next to a particular location in the list on the side will open slide in an infowindow that shows some basic review/food information provided by Zomato.

#### // HOW TO EDIT
Map markers are defined via a knockoutJS observableArray, defined at the top of the file inside the viewmodel. Each entry in viewModel.markers() should include the following information:
* Title (title)
* Location object (location.lat, location.long, location.address)
* Google Maps placeID (placeid)
* Long content (content)
* Yelp business identification (yelpID)
* Zomato res_id (found via checking source on Zomato page)

Markers defined in viewModel.markers() be pushed to a new ko.observableArray called gMarkers() that includes Google Maps Marker information, making it sortable.

The map and lists will automatically center and update with the appropriate information as long as the viewModel.maarkers() is updated with your contact information appropriately.

##### // What's coming soon
The main goal is to establish an all-in-one solution for local restaurants - organizing by food ethnicity, styles - locally owned or chains, sorting via ratings, etc. For the sake of the Udacity course, however, we have the required functionality with expansion coming down the line for a Vilas County website.
