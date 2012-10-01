function css (a) {
	var sheets = document.styleSheets, o = {};
		re_hover = /([a-zA-Z0-9_\.\#])+(:hover){1}/
		re_link = /([a-zA-Z0-9_\.\#])+(:link){1}/
		re_active = /([a-zA-Z0-9_\.\#])+(:active){1}/
		re_visited = /([a-zA-Z0-9_\.\#])+(:visited){1}/
		re_after = /([a-zA-Z0-9_\.\#])+(::after){1}/
				
	for(var i in sheets) {
		var rules = sheets[i].rules || sheets[i].cssRules;
		for (var r in rules) {
			if (re_hover.test(rules[r].selectorText) === true || re_link.test(rules[r].selectorText) === true ||
			    re_active.test(rules[r].selectorText) === true || re_visited.test(rules[r].selectorText) === true ||
				re_after.test(rules[r].selectorText) === true || typeof rules[r].selectorText == 'undefined')
				continue;
			
			if(a.is(rules[r].selectorText))
				o = $.extend(o, css2json(rules[r].style), css2json(a.attr('style')));
			
		}
	}
	
	return o;
}

function css2json (css) {
	var s = {};
	if(!css) return s;
	if(css instanceof CSSStyleDeclaration) {
		for(var i in css) {
			if((css[i]).toLowerCase) {
				s[(css[i]).toLowerCase()] = (css[css[i]]);
			}
		}
	}
	else if(typeof css == "string") {
		css = css.split("; ");          
		for (var i in css) {
			var l = css[i].split(": ");
			s[l[0].toLowerCase()] = (l[1]);
		};
	}
	return s;
}

$(function () {
	re_hover = /([a-zA-Z0-9_\.\#])+(:hover){1}/
	var sheets = document.styleSheets;
	for(var i in sheets) {
		var rules = sheets[i].rules || sheets[i].cssRules;
		for(var r in rules) {
			if (re_hover.test(rules[r].selectorText) === false)
				continue;
			
			m = rules[r].selectorText;
			m = m.split(',');
			for (x = 0, y = m.length; x < y; x++) {
				m[x] = $.trim(m[x]);
				
				if (re_hover.test(m[x]) === false)
					continue;
				
				pos = m[x].indexOf(":hover");
				if (pos == -1)
					continue;
				
				src = m[x].substr(0, pos)
				converted_css = css2json(rules[r].style);
				
				if (parseInt (pos) + 6 == m[x].length) {
					for (a = 0, b = $(src).length; a < b; a++) {
						$(src).eq(a).data({hoverStyle: converted_css, originalStyle: css ($(src).eq(a))})
							.bind('mouseenter', function () {
								$(this).css($(this).data('hoverStyle'));
							})
							.bind('mouseleave', function () {
								$(this).css($(this).data('originalStyle'));
							});
					}
					
				}
				else {
					for (a = 0, b = $(src).length; a < b; a++) {
						src2 = $.trim (m[x].substr(parseInt (pos)+6));
						
						$(src).eq(a).data({hoverStyle: converted_css, originalStyle: css ($(src2, $(src).eq(a))), continueSrc: src2})
							.bind('mouseenter', function () {
								$($(this).data('continueSrc'), this).css($(this).data('hoverStyle'));
							})
							.bind('mouseleave', function () {
								$($(this).data('continueSrc'), this).css($(this).data('originalStyle'));
							});
					}
				}
			}
		}
	}
});