var map;

$(function() {
  $('#contacts').height(Math.max($('#contacts .inner').outerHeight(true), $(window).height()));

  if(typeof ymaps != "undefined") {

    ymaps.ready(function() {
      map = new ymaps.Map ("map", {
        center: [55.771829, 37.629828], 
        zoom: 17
      });

      map.controls
        .add('zoomControl')
        .add('typeSelector')
        .add('mapTools')
        .add('trafficControl');

      map.geoObjects.add(
        new ymaps.Placemark([55.771829, 37.625828], {
          balloonContent: 'Искать здесь!'
      }));
    });
  }

  $('#show-map').click(
    function() {
      $('#contacts .wrapper').animate({'left': '-60%'}, 500);
      $('#map').animate({'left': '20%'}, 500);
      map.panTo([55.771829, 37.625828]);
      $('#show-map').hide();
      $('#show-contacts').show();
      return false;
    }
  );

  $('#show-contacts').click(
    function() {
      $('#contacts .wrapper').animate({'left': '0'}, 500);
      $('#map').animate({'left': '80%'}, 500);
      map.panTo([55.771829, 37.629828]);
      $('#show-contacts').hide();
      $('#show-map').show();
      return false;
    }
  );
});