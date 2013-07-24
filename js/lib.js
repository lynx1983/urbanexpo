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
        var haveSubmenu = $(this).closest('li').find('ul.sub-menu').length > 0;
        var inSubmenu = $(this).closest('ul.menu').is('.sub-menu');
        var topOffset = $('#' + page).position().top;
        $('body').scrollspy('disable');
        scrollingComplite = false;     
        $('html, body').animate({'scrollTop': topOffset - (haveSubmenu || inSubmenu ? 85 : 45)}, 
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

  $('a[data-month]').click(
    function() {
      return false;
    }
  );

  $('.main-menu li').on('activate', function(event) {
    var $a = $(this).find('> a');
    var $menu = $(this).closest('ul.menu');
    var $menuContainer = $menu.closest('div');

    if($(this).is($(event.target))) {
      var page = $a.data('page');
      if(page) {
        console.log("Activate menu [" + $a.text() + "] with page [" + page + "]");
        $('div.page').removeClass('active');
        $('#' + page).addClass('active');
        if($menu.is('.sub-menu')) {
          console.log("Is sub menu item");
          if(!$menuContainer.is(':visible')) {
            $('div.sub-menu:visible').hide();
            $menuContainer.slideDown();  
          }
        } else {
          console.log("Is main menu item");
          $('div.sub-menu:visible').hide();
          var $submenu = $(this).find('div.sub-menu');
          if($submenu.length) {
            console.log("Have sub menu");
            $submenu.slideDown();
          }
        }
      }
    } else {
      console.log("Activate parent menu [" + $a.text() + "]");
      $menu.find('> li').removeClass('active')
      $(this).addClass('active')
    }
  })

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

  $('#logo').click(
    function() {
      $('.main-menu li').removeClass('active');
      $('div.sub-menu').hide();
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

  /*$(window).resize(function() {
    $('#contacts').height(Math.max($('#contacts .inner').outerHeight(true), $(window).height()));
    map.container.fitToViewport();
  }); */
})