/*
 * jQuery.ajaxSearchSuggest
 * By Shunsuke Kusakabe
 * Copyright (c) 2014 Shunsuke Kusakabe
 * Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

;(function($){

$.fn.ajaxSearchSuggest = function(){

	$(this).each(function(){

		if( $.inArray($(this).attr('type'), ['text','search','url']) === -1 ) return;

  	var text = '';
    if((navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2) === 'ja') {
    	text = 'Tab &darr;&uarr; キーで選択';
    } else {
    	text = 'Select by Tab or &darr;&uarr; key';
    }

		var div = '<div class="ajaxSearchSuggestWrapper"><ul class="ajaxSearchSuggest"></ul>';
		div += ( ! isMobile() )? '<div class="selectionKey">'+ text +'</div></div>' : '</div>';

		$(this).parents('form').after(div);

		var $self = $(this);
		var $wrapper = $(this).parents('form').next('.ajaxSearchSuggestWrapper');
		var $suggest = $wrapper.children('.ajaxSearchSuggest');

		setPos($self);

		$(window).resize(function() {
			setPos($self);
		});

		$self.keydown(function(e){
			if( e.which === 9 ){
				// Pressing Tab key,do nothing.
				return false;
			} else if( e.which === 13 ){
				//  Pressing Enter key,input the selected words in the text field.
				if($('li', $suggest).hasClass('selected')){
					$self.val($('.selected', $suggest).text());
				}
			} else if( e.which === 27 ){
				// Pressing Esc key,hide suggest words.
				$wrapper.hide();
				$suggest.html('');
			}
		});

		$self.keyup(function(e){
			if($.inArray(e.which,[9,40,38]) !== -1){
				// 9:tab, 40:down arrow 38:up arrow
				var index = $('li', $suggest).index($('.selected', $suggest));

				if( index === -1 ){
					if( (e.which === 9 && e.shiftKey === false) || e.which === 40 ){
						$('li:first-child', $suggest).addClass('selected');
					} else if( e.which === 38 || (e.which === 9 && e.shiftKey === true )){
						$('li:last-child', $suggest).addClass('selected');
					}
				} else {
					var $li = $('li', $suggest).eq(index);
					if( (e.which === 9 && e.shiftKey === false) || e.which === 40 ){
						$li.removeClass('selected');
						if( ! $li.is(':last-child')){
							$li.next().addClass('selected');
						} else {
							$('li:first-child', $suggest).addClass('selected');
						}
					} else if( (e.which === 9 && e.shiftKey === true ) || e.which === 38 ){
						$li.removeClass('selected');
						if( ! $li.is(':first-child')){
							$li.prev().addClass('selected');
						} else {
							$('li:last-child', $suggest).addClass('selected');
						}
					}
				}
			} else if( e.which === 27 ){
				$wrapper.hide();
				$suggest.html('');
			}
		});

		$self.focus(function(){
			var t =  $(this);
			var v,cl,pl = 0;

			setInterval(function(){
				v = t.val();
				cl = v.length;

				if( cl === 0 ){
					$wrapper.hide();
					$suggest.html('');
				}

				if( cl !== pl ){
					pl = cl;

					$.ajax( {
						url : 'https://www.google.com/complete/search',
						dataType : 'jsonp',
						data : {
							q : v,
							client : 'hp',
							nolabels : 't'
						},
						success : function(data) {

							var len =  data[1].length;
							if(len === 0){
								$wrapper.hide();
								$suggest.html('');
								return;
							}

							var html = '';
							for(var i = 0; i<len; i++){
								html += '<li class="ajaxSearchSuggestListItem">' + data[1][i][0] + '</li>';
							}
							$suggest.html(html);

							$wrapper
								.show()
								.css('min-width',$self.outerWidth());

							$('li', $suggest).click(function(){
								$self.val($(this).text());
								$wrapper.hide();
								$suggest.html('');
								$self.parent('form').submit();
							});

							$('body').not($wrapper).click(function(){
								$wrapper.hide();
								$suggest.html('');
							});

							var ary = [];
							$('li', $suggest).mousemove(function(){
									$('li', $suggest).removeClass('selected');
									if( ! $(this).hasClass('selected')){
										$(this).addClass('selected');
										ary.push($('li', $suggest).index($(this)));
										if(ary.length > 2){
											ary.shift();
										}
										if(ary[0] != ary[1]){
											$('li', $suggest).eq(ary[0]).removeClass('selected');
										}
									}
							});
						}
					});
				}
			}, 100);
		});
	});

	return this;

};

function setPos($elm){

	var has_none = false;
	var $parents = $elm.parents(), $parent, styles;

	$parents.each(function(){
		if($(this).css('display') == 'none'){
			has_none = true;
			$parent = $(this);
			styles = $parent.attr('style');
			return false;
		}
	});

	$parents.each(function(){
		if( $(this).get(0).tagName === 'FORM' ){
			if( $(this).parent().css('position') === 'static' ){
				$(this).parent().css({'position' : 'relative','z-index' : '10'});
			} else {
				$(this).parent().css({'z-index' : '10'});
			}
			return false;
		}
	});

	if( has_none === false ){
		_setPos($elm);
	} else {
		$parent.show();
		_setPos($elm);
		if(styles === undefined){
			$parent.removeAttr('style');
		} else {
			$parent.attr('style', styles);
		}
	}

	function _setPos($elm){
		var pos = $elm.position();
		var h = $elm.outerHeight();
		var top = (pos.top + h + $elm.css('margin-top').replace('px', '')*1) + 'px';
		var left = (pos.left + $elm.css('margin-left').replace('px', '')*1) + 'px';
		$elm.parents('form').next().css({
			'position' : 'absolute',
			'top'  : top,
			'left' : left
		});
	}

}

function isMobile(){
	return /iphone|ip[ao]d|android/i.test(navigator.userAgent);
};

function isUA( arg ){
  return new RegExp(arg, 'i').test(navigator.userAgent);
};

})(jQuery);