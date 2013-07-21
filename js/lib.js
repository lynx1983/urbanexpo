$.Isotope.prototype._getCenteredMasonryColumns = function() {
    this.width = this.element.width();
    
    var parentWidth = this.element.parent().width();
    
                  // i.e. options.masonry && options.masonry.columnWidth
    var colW = this.options.masonry && this.options.masonry.columnWidth ||
                  // or use the size of the first item
                  this.$filteredAtoms.outerWidth(true) ||
                  // if there's no items, use size of container
                  parentWidth;
    
    var cols = Math.floor( parentWidth / colW );
    cols = Math.max( cols, 1 );

    // i.e. this.masonry.cols = ....
    this.masonry.cols = cols;
    // i.e. this.masonry.columnWidth = ...
    this.masonry.columnWidth = colW;
};
  
  $.Isotope.prototype._masonryReset = function() {
    // layout-specific props
    this.masonry = {};
    // FIXME shouldn't have to call this again
    this._getCenteredMasonryColumns();
    var i = this.masonry.cols;
    this.masonry.colYs = [];
    while (i--) {
      this.masonry.colYs.push( 0 );
    }
  };

  $.Isotope.prototype._masonryResizeChanged = function() {
    var prevColCount = this.masonry.cols;
    // get updated colCount
    this._getCenteredMasonryColumns();
    return ( this.masonry.cols !== prevColCount );
  };
  
  $.Isotope.prototype._masonryGetContainerSize = function() {
    var unusedCols = 0,
        i = this.masonry.cols;
    // count unused columns
    while ( --i ) {
      if ( this.masonry.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    
    return {
          height : Math.max.apply( Math, this.masonry.colYs ),
          // fit container to columns that have been used;
          width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
        };
  };

var $portfolio;
var $news;
var $equipment;
var documentHeight;
var map;
var scrollingComplite;

function showOverlay() {
  $('body').css('overflow', 'hidden');
  $('#overlay').show();
}

function hideOverlay() {
  $('#overlay').hide();
  $('body').css('overflow', '');
}

$(window).load(function() {
  $('#contacts').height(Math.max($('#contacts .inner').outerHeight(true), $(window).height()));

  if(typeof ymaps != "undefined" && ymaps.Map) {
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
  }

  $portfolio = $('#portfolio .isotope-wrapper');
  $news = $('#news .isotope-wrapper');
  $equipment = $('div.equipment');
	
  $portfolio.isotope({
		itemSelector : '.item',
	});

  $news.isotope({
    itemSelector : '.item',
  });

  $equipment.isotope({
    itemSelector : '.item',
  });

  $('a.filter').click(
    function() {
      $('#' + $(this).data("filterPage") + ' .isotope-wrapper').isotope({
        filter: $(this).data("filterValue")
      });
      $('ul.' + $(this).data("filterPage") + ' li').removeClass('active');
      $('ul.' + $(this).data("filterPage") + ' li a[data-filter-value="' + $(this).data("filterValue") + '"]').parent().addClass('active');

      setTimeout(function() {
        $('body').scrollspy('refresh');
      }, 1000);

      return false;
    }
  );

  $('a[data-page]').click(
    function(event) {
      var page = $(this).data('page');
      if(page) {
        var $submenu = $('ul.sub-menu.' + page, 'div.sub-menu');
        var topOffset = $('#' + page).position().top;
        $('body').scrollspy('disable');
        scrollingComplite = false;     
        $('html, body').animate({'scrollTop': topOffset - ($submenu.length ? 86 : 45)}, 
          {
            duration: 500, 
            complete: $.proxy(function() {
              if(scrollingComplite) return;
              scrollingComplite = true;
              $('body').scrollspy('enable');
              $('body').scrollspy('process');
              if(history.pushState) {
                history.pushState(null, null, $(this).attr('href'));
              } else {
                location.hash = $(this).attr('href');
              }
            }, this),
          }
        );
      }
      return false;
    }
  );

  $('.main-menu li').on('activate', function() {
    var $a = $(this).find('a');
    var page = $a.data('page');
    if(page) {
      var $submenu = $('ul.sub-menu.' + page, 'div.sub-menu');
      $('div.page').removeClass('active');
      $('#' + page).addClass('active');   
      if($submenu.length) {
        $('div.sub-menu').slideDown();
        if(!$submenu.is(':visible')) {
          $('ul.sub-menu:visible').hide();
          $submenu.fadeIn();
        }
        if($submenu.find('.active').length == 0) {
          $submenu.find('li').eq(0).addClass('active');
        }
      } else {
        $('div.sub-menu').fadeOut();
      }
    }
    
    if($a.data('order')) {
      $('#order-link').show();
    } else {
      $('#order-link').hide(); 
    }
  })

  $('#about section .header a').click(
    function() {
      if($(this).closest('section').hasClass('active')) return false;
      $(this).closest('.sections').find('section').removeClass('active').find('.content').slideUp();
      $(this).closest('section').addClass('active').find('.content').slideDown();
      $('#about .tabs-wrapper')
        .removeClass('active')
        .find('.tab:visible').slideUp();
      return false;
    }
  );

  $('#about .video-wrapper').data('height', $('#about .video-wrapper').height());

  $('#about .video-wrapper .close').click(
    function() {
      var $wrapper = $(this).closest('.video-wrapper');
      if($wrapper.hasClass('closed')) {
        $wrapper.animate({'height': $wrapper.data('height')}, 500, $.proxy(
          function() {
            this.css('height', 'auto');
            this.removeClass('closed');
            this.find('video').get(0).play();
            $('body').scrollspy('refresh');
          }, $wrapper)
        );
      } else {
        $wrapper.find('video').get(0).pause();
        $wrapper.animate({'height': 100}, 500, $.proxy(
          function() {
            this.addClass('closed');
            $('body').scrollspy('refresh'); 
          }, $wrapper)
        );
      }
    }
  );

  $('.tabs-wrapper .tabs a').click(
    function() {
      if($(this).parent().hasClass('active') && $(this).closest('.tabs-wrapper').hasClass('active')) return false;
      if($(this).parents('#about').length > 0) {
        $('#about section').removeClass('active').find('.content').slideUp();
      } 
      var $wrapper = $(this).closest('.tabs-wrapper');
      var $marker = $wrapper.find('.marker');
      $wrapper.addClass('active');
      $wrapper.find('.tabs li').removeClass('active');
      var tab = $(this).data('tab');
      var $activeItem = $(this).closest('li').addClass('active');
      $marker.css('width', $activeItem.width());
      $marker.css('left', $activeItem.position().left);
      if($wrapper.find('.tab:visible').length) {
        $wrapper.find('.tab:visible').stop().fadeOut('fast', $.proxy(
          function(tab) {
            this.find('.tab[data-tab=' + tab +']').stop().fadeIn();    
          }, $wrapper, tab)
        );
      } else {
        $wrapper.find('.tab[data-tab=' + tab +']').stop().fadeIn();
      }
      
      return false;
    }
  );

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

  $('#logo').click(
    function() {
      $('.main-menu li').removeClass('active');
      $('div.sub-menu ul').hide();
      $('html, body').animate({'scrollTop': 0}, 500);
    }
  );

  $('#overlay').click(
    function() {
      hideOverlay();
    }
  );
  $(document).keyup(
    function(event) {
      if (event.which == 27) {
        hideOverlay();
        event.preventDefault();
      }
    }
  )

  $('#overlay .wrapper').click(
    function() {
      return false;
    }
  );

  $('#overlay .close').click(
    function() {
      hideOverlay();
      return false;
    }
  );

  documentHeight = $(document).height();

  $('body').scrollspy({
    target: 'div.main-menu',
    offset: 95
  });

  $('.sub-menu a[data-order-title]').click(
    function() {
      $('#order-link').text($(this).data('orderTitle'));
      $(this).closest('.menu').find('li').removeClass('active');
      $(this).closest('li').addClass('active');
      return false;
    }
  );

  $('#news .item .more, #news .item-image-wrapper a, #news .heading a, #service .more').click(
    function() {
      $('#overlay .wrapper > .content').html($('#news-detail').children().clone());
      showOverlay();
      return false;
    }
  );

  $('#portfolio .item .more').click(
    function() {
      $('#overlay .wrapper > .content').html($('#portfolio-detail').children().clone(true));
      showOverlay();
      return false;
    }
  );

  $('#order-link').click(
    function() {
      $('#overlay .wrapper > .content').html($('#order-form').children().clone(true));
      showOverlay();
      return false; 
    }
  );

  $('form button').click(
    function() {
      $(this).addClass('submited');
    }
  );

  $('#about .tabs-wrapper')
    .addClass('active')
    .find('li a').eq(0).click();

  $('.page-header a').click(
    function() {
      return false;
    }
  );

  $(document).bind('DOMSubtreeModified', function() {
    if($(this).height() != documentHeight) {
      setTimeout(function() {
        $('body').scrollspy('refresh');
      }, 500);
      documentHeight = $(this).height();
    }
  }); 

  $(window).scroll(
    function() {
      var offset = $('#tech').offset().top - $(window).scrollTop() - 45;
      if(offset < 0) {
        $('#tech-bg').css('top', -432);
      } else if(offset > 864) {
        $('#tech-bg').css('top', 432);
      } else {
        $('#tech-bg').css('top', -(432-offset));
      }
    }
  )

  $(window).resize(function() {
    $('#contacts').height(Math.max($('#contacts .inner').outerHeight(true), $(window).height()));
    map.container.fitToViewport();
  }); 
})