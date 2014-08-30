// ==UserScript==
// @name         ShockMansion Script
// @description  Some modifications on www.shockmansion.com
// @namespace    https://github.com/EliasGrande/
// @downloadURL  https://github.com/EliasGrande/ShockMansionScript/raw/master/dist/releases/latest.user.js
// @updateURL    https://github.com/EliasGrande/ShockMansionScript/raw/master/dist/releases/latest.meta.js
// @version      2.0.0
// @include      http://www.shockmansion.com/*
// ==/UserScript==
/*! ShockMansion Script (C) 2014 Elías Grande Cásedas | MIT | opensource.org/licenses/MIT */
(function(){
////////////

// variables
var win = window, doc, $;

// unsafe window & document & jQuery
try{if (unsafeWindow) win = unsafeWindow;}
catch(e){}
doc = win.document;

var onDOMContentLoaded = function() {
////////////////////////////////////
//                                //
//   START onDOMContentLoaded()   //
//                                //
////////////////////////////////////

$ = win.jQuery;

// header absolute, not fixed (for small screens)
try{$('.global-navigation-list').css('position','absolute');}
catch(e){return;}

// img links in post-in-feed go to the post, not to facebook
var i, j, a_img, a_title, post;
var posts = $('.post-in-feed').get();
var remove_fb = function(href)
{
	a_img = post.find('[href="'+href+'"]').children('img.size-full');
	a_img.attr('title',a_title.attr('title'));
	a_img.parent().attr('href',a_title.attr('href'));
}
for (i=0;i<posts.length;i++)
{
	try{
		post = $(posts[i]);
		a_title = post.children('.news-title:first').find('a:first');
		remove_fb('http://www.facebook.com/shocked1');
		remove_fb('https://www.facebook.com/shocked1');
	}catch(e){}
}

// img links in posts without facebook spamlink
posts = $('.post').get();
remove_fb = function(href)
{
	a_img = post.find('[href="'+href+'"]').children('img.size-full').get();
	for (j=0;j<a_img.length;j++)
	{
		var img = $(a_img[j]);
		img.attr({title:'',alt:''}).parent().after(img).remove();
	}
}
for (i=0;i<posts.length;i++)
{
	try{
		post = $(posts[i]);
		remove_fb('http://www.facebook.com/shocked1');
		remove_fb('https://www.facebook.com/shocked1');
	}
	catch(e){}
}

// no ads
var remove_ads = function (ads)
{
	var ad;
	for (i=0;i<ads.length;i++)
	{
		try{
			ad = $(ads[i]);
			if (/footer/.test(
					ad.parent().parent().attr('id'))) continue;
			if (/^div\-gpt\-ad/.test(
					ad.find('script:first').parent().attr('id'))) ad.remove();
		}catch(e){}
	}
}
remove_ads($('.textwidget').get());
remove_ads($('.new-sidebar').get());

// remove duplicate or unnecessary annoying stuff
$('body.single-post .pagination').remove();
$('body.single-post .single-post-footer').remove();
$('body.single-post #headers').remove();
$('body.paged #headers').remove();
$('#footer').remove();
$('#cmn_tb_wrapper').remove();

// fixes
$('.facebook_like_sidebar_box_title').css('clear','both');

// arrow navigation
var arrowNav = {
	enabled : true,
	// this is akward but true, next is prev and prev is next
	aPrev : $('#post-nav .post-next a:first'),
	aNext : $('#post-nav .post-previous a:first'),
	goPrev : function()
	{
		/*win.console.log('Prev');
		win.console.log(this.aPrev);
		win.console.log(this.aPrev.attr('href'));
		win.console.log(this.aPrev.parent());
		return;*/
		if (this.enabled && (this.aPrev.get().length>0)) {
			this.aPrev.click();
			win.location.href=this.aPrev.attr('href');
		}
	},
	goNext : function()
	{
		/*win.console.log('Next');
		win.console.log(this.aNext);
		win.console.log(this.aNext.attr('href'));
		win.console.log(this.aNext.parent());
		return;*/
		if (this.enabled && (this.aNext.get().length>0)) {
			this.aNext.click();
			win.location.href=this.aNext.attr('href');
		}
	}
}

// arrow navigation fix for post-in-feed
if (arrowNav.aNext.get().length==0)
{
	arrowNav.aPrev = $('li span.page-numbers.current')
		.parent().prev('li').children('a');
	arrowNav.aNext = $('a.next.page-numbers');
}

// enable/disable arrow navigation on inputs
$('input[type="text"]')
	.focus(function(){arrowNav.enabled=false;})
	.blur (function(){arrowNav.enabled=true;});

// add the arrow navigation listener
$('body')
	.keydown(function(e){
		var key = e.which+0;
		if      (key==39) arrowNav.goNext(); // →
		else if (key==37) arrowNav.goPrev(); // ←
	})
	.focus();

// move post-nav
var postNav = $('#post-nav'),
postNavParent = postNav.parent();
postNav.insertBefore(postNavParent.children('.share-and-comment:first'))
	.before(postNavParent.children('.arrows-yo:first'));

//////////////////////////////////
//                              //
//   END onDOMContentLoaded()   //
//                              //
//////////////////////////////////
}

/*! [onDOMContentLoaded] by Dean Edwards & Matthias Miller & John Resig */
var init, init_done, init_timer;
init_done = false;
init = function()
{
	if (init_done) return;
	init_done = true;
	if (init_timer) clearInterval(init_timer);
	onDOMContentLoaded();
};

/* for Mozilla/Opera9 */
if (doc.addEventListener)
	doc.addEventListener("DOMContentLoaded", init, false);

/* for Safari */
if (/WebKit/i.test(win.navigator.userAgent)) {
	init_timer = setInterval(
		function() {
			if (/loaded|complete/.test(doc.readyState)) init();
		},
		10
	);
}

/* for other browsers */
win.onload = init;

/////
})();
