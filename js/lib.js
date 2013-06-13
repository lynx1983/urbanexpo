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

function showOverlay() {
  $('body').css('overflow', 'hidden');
  $('#overlay').show();
}

function hideOverlay() {
  $('#overlay').hide();
  $('body').css('overflow', '');
}

$(window).load(function() {
  $('#contacts').height($('#contacts .inner').outerHeight(true));

  var map = new ymaps.Map ("map", {
    center: [55.76, 37.64], 
    zoom: 7
  });

  map.controls
    .add('zoomControl')
    .add('typeSelector')
    .add('mapTools')
    .add('trafficControl');

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
      $(this).closest('.menu').find('li').removeClass('active');
      $(this).closest('li').addClass('active');

      setTimeout(function() {
        $('body').scrollspy('refresh');
      }, 1000);

      return false;
    }
  );

  $('a.page').click(
    function() {
      var page = $(this).data('page');
      if(page) {
        var $submenu = $('ul.sub-menu.' + page, 'div.sub-menu');
        var topOffset = $('#' + page).position().top;
        $('body').scrollspy('disable');
        $('html, body').animate({'scrollTop': topOffset - ($submenu.length ? 86 : 45)}, 
          {
            duration: 500, 
            complete: function() {
              $('body').scrollspy('enable');
              $('body').scrollspy('process');
            }
          }
        );
      }
      return true;
    }
  );

  $('.main-menu li').on('activate', function() {
    var $a = $(this).find('a');
    var page = $a.data('page');
    if(page) {
      var $submenu = $('ul.sub-menu.' + page, 'div.sub-menu');
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
      $('#about .tabs-wrapper').removeClass('active');
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
        $('#about section').removeClass('active').find('.content').hide();
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
      $('#show-map').hide();
      $('#show-contacts').show();
      return false;
    }
  );

  $('#show-contacts').click(
    function() {
      $('#contacts .wrapper').animate({'left': '0'}, 500);
      $('#map').animate({'left': '80%'}, 500);
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

  $('.sub-menu.service a').click(
    function() {
      if($(this).data('orderTitle')) {
        $('#order-link').text($(this).data('orderTitle'));
      }
      $(this).closest('.menu').find('li').removeClass('active');
      $(this).closest('li').addClass('active');
      return false;
    }
  );

  $('#news .item .more').click(
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
})