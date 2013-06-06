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

$(window).load(function() {
  $portfolio = $('#portfolio');
  $news = $('#news');
	
  $portfolio.isotope({
		itemSelector : '.item',
	});

  $news.isotope({
    itemSelector : '.item',
  });

  $('a.filter').click(
    function() {
      $('#' + $(this).data("filterPage")).isotope({
        filter: $(this).data("filterValue")
      });
      $(this).closest('.menu').find('li').removeClass('active');
      $(this).closest('li').addClass('active');
      return false;
    }
  );

  $('a.page').click(
    function() {
      var page = $(this).data('page');
      $('ul.sub-menu', 'div.sub-menu').hide();
      if(page) {
        var $submenu = $('ul.sub-menu.' + page, 'div.sub-menu');
        if($submenu.length) {
          $submenu.slideDown();
          $submenu.find('li').first().find('a').click();
        }
        var topOffset = $('#' + page).position().top;
        $('body').animate({'scrollTop': topOffset - 90}, 500);
      }
      $(this).closest('.menu').find('li').removeClass('active');
      $(this).closest('li').addClass('active');
      return false;
    }
  );

  $('#logo').click(
    function() {
      $('.main-menu li').removeClass('active');
      $('div.sub-menu ul').hide();
      $('body').animate({'scrollTop': 0}, 500);
    })
})