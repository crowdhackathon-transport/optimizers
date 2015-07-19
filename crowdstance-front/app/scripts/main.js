// jshint devel:true

// Parse all points received from the API and create markers

var urlNames = "http://172.16.177.201:5000/api/v1.0/route/names";
var urlId = "http://172.16.177.201:5000/api/v1.0/route/";

$.getJSON(urlNames, function(data){
  var stances = data;
  var stancesCount = stances.length;

  var stanceNames = [];
  var stanceIds = [];

  for(var i = 0; i < stancesCount; i++) {
    var stanceName = stances[i].route_long_name;
    var stanceId = stances[i].route_short_name;
    // console.log(stances[i]);
    stanceNames.push(stanceName);
    stanceIds.push(stanceId);

    $('.js-start').append('<option value=' + stanceId + '>' + stanceId + ': ' + stanceName + '</option>');
    // $('.js-end').append('<option value=' + stanceId + '>' + stanceId + ': '+ stanceName + '</option>');
  }

  // console.log(stanceNames, stanceIds);
});






var allStops = [];
var latLong = $('.latLong > ul > li').each(function(index, el) {
  allStops.push(el.innerHTML);
});

var pointsCount = allStops.length;
var markers = [];




var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function initialize() {

// for(var i = 0; i <= pointsCount; i++) {
//   console.log(pointsCount[i]);
// }

  var stance1 = new google.maps.LatLng(-25.363882,131.044922);
  // var stance2 = new google.maps.LatLng(-25.363882,131.044922);
  // var stance3 = new google.maps.LatLng(-25.363882,131.044922);

  directionsDisplay = new google.maps.DirectionsRenderer();

  var mapOptions = {
    center: new google.maps.LatLng(37.980, 23.712),
    zoom: 12,
    mapType: 'roadmap'
  };

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);





  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input-1'));


  // var origin = (document.getElementById('origin'));
  // var destination = (document.getElementById('destination'));;

  // var types = document.getElementById('type-selector');
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

  // var autocomplete = new google.maps.places.Autocomplete(input);
  // autocomplete.bindTo('bounds', map);

  // var infowindow = new google.maps.InfoWindow();





  // google.maps.event.addListener(autocomplete, 'place_changed', function() {
  //   infowindow.close();
  //   marker.setVisible(false);
  //   var place = autocomplete.getPlace();
  //   if (!place.geometry) {
  //     window.alert("Autocomplete's returned place contains no geometry");
  //     return;
  //   }

  //   // If the place has a geometry, then present it on a map.
  //   if (place.geometry.viewport) {
  //     map.fitBounds(place.geometry.viewport);
  //   } else {
  //     map.setCenter(place.geometry.location);
  //     map.setZoom(17);  // Why 17? Because it looks good.
  //   }
  //   marker.setIcon(/** @type {google.maps.Icon} */({
  //     url: place.icon,
  //     size: new google.maps.Size(71, 71),
  //     origin: new google.maps.Point(0, 0),
  //     anchor: new google.maps.Point(17, 34),
  //     scaledSize: new google.maps.Size(35, 35)
  //   }));
  //   marker.setPosition(place.geometry.location);
  //   marker.setVisible(true);

  //   var address = '';
  //   if (place.address_components) {
  //     address = [
  //       (place.address_components[0] && place.address_components[0].short_name || ''),
  //       (place.address_components[1] && place.address_components[1].short_name || ''),
  //       (place.address_components[2] && place.address_components[2].short_name || '')
  //     ].join(' ');
  //   }

  //   infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
  //   infowindow.open(map, marker);
  // });

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  // function setupClickListener(id, types) {
  //   var radioButton = document.getElementById(id);
  //   google.maps.event.addDomListener(radioButton, 'click', function() {
  //     autocomplete();
  //   });
  // }


  // function setupClickListener() {
  //   var showMarkers = document.getElementById('showMarkers');
  //   google.maps.event.addDomListener(showMarkers, 'click', function() {
  //     addNewMarkers();
  //   });
  // }

}

// function calcRoute(e) {
//   // e.preventDefault();
//   console.log(e);

//   var start = document.getElementById("start").value;
//   var end = document.getElementById("end").value;
//   var request = {
//     origin:start,
//     destination:end,
//     travelMode: google.maps.TravelMode.TRANSIT
//   };
//   directionsService.route(request, function(result, status) {
//     if (status == google.maps.DirectionsStatus.OK) {
//       directionsDisplay.setDirections(result);
//     }
//   });
// }

google.maps.event.addDomListener(window, 'load', initialize);



// $(document).ready(function() {
//   $.ajax({
//     url: "http://172.16.177.201:5000/api/v1.0/route/names"
//   }).then(function(data) {
//    $('.name').append(data.id);
//    $('.name').append(data.route_short_name);
//        // $('.greeting-content').append(data.content);
//      });
// });



// GET CROWDED
    /* attach a submit handler to the form */
    $("#getCrowded").submit(function(event) {

      /* stop form from submitting normally */
      event.preventDefault();

      /* get some values from elements on the page: */
      var $form = $( this ),
          url = $form.attr( 'action' );

      /* Send the data using post */
      var getting = $.getJSON( urlId + $('#start').val(), function() {});

      /* Alerts the results */
      getting.done(function(data) {

          var crowded = data;
          var crowdedCount = crowded.length;
          var crowdedLatLongs = [];
          var crowdedLats = [];
          var crowdedLongs = [];
          var crowdedLoads = [];

          for(var i = 0; i < crowdedCount; i++) {
            console.log(i);
            crowdedLats.push(crowded[i].stop_lat);

            console.log(crowded[i].stop_lon);
            crowdedLongs.push(crowded[i].stop_lon);

            console.log(crowded[i].crowdLoad);
            crowdedLoads.push(crowded[i].crowdLoad);

            console.log(crowdedLoads);
          }



          for(var k = 0; k < crowdedCount; k++) {
            console.log(crowdedLoads);
          var color;
          if(crowdedLoads[k] > 0.8 ) {
            color = "red";
            console.log(color);
          } else if (crowdedLoads[k] < 0.2 ) {
            color = "green";
            console.log(color);
          } else {
             color = "blue";
             console.log(color);
          }


            var latlng = new google.maps.LatLng(crowdedLats[k], crowdedLongs[k]);
            var marker = new google.maps.Marker({
              position: latlng,
              map: map,
            });

            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/'+ color +'-dot.png');
            marker.setVisible(true);
            marker.setMap(map);
          }
        });
    });




