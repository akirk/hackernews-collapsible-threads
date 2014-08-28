/**
 * Hacker News Collapsible Threads Bookmarklet companion script
 * Copyright (c) 2010 Alexander Kirk, http://alexander.kirk.at/
 * http://alexander.kirk.at/2010/02/16/collapsible-threads-for-hacker-news/
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 * URL for using the bookmarklet in a web browser
 * javascript:(function()%7Bvar%20s=document.createElement('script');s.type='text/javascript';s.src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.1/jquery.min.js';document.documentElement.childNodes%5B0%5D.appendChild(s);s=document.createElement('script');s.type='text/javascript';s.src='https://alexander.kirk.at/js/hackernews-collapsible-threads.js';document.documentElement.childNodes%5B0%5D.appendChild(s);%7D)();
 */

jQuery(function($) {
	var hn = new RegExp("(news.ycombinator.com|hackerne\.ws)/item", "i");
	if (typeof domaincheck == "undefined") domaincheck = true;
	if ($("body").hasClass("collapsible-comments")) {
		// $("span.collapse").remove();
		return;
	} else if (domaincheck && !hn.test(location.href)) {
		alert("This bookmarklet only applies to the comments sections of Hacker News, at http://news.ycombinator.com/");
		return;
	}
	
	$("body").addClass("collapsible-comments");
	function collapse(e) {
		var $e = $(e.target);
		var el = $e.closest("table");
		var children = $("table.parent-" + el.data("comment")).closest("tr");
		var comment = el.find("span.comhead").parent().siblings();
		var visible = children.is(":visible");
		if (!children.length) visible = comment.is(":visible");
		var thread = children.add(comment).add(comment.closest("td").prev());
		if (visible) {
			$e.text("[+] (" + children.length + " child" + (children.length == 1 ? "" : "ren") + ")");
			thread.not(comment)
				.find("span.collapse").text("[-]").end()
				.find("span.comhead")
					.parent()
						.siblings().show().end()
						.closest("td").prev().show();
			thread.hide();
			comment.closest("table").css("padding-bottom", "20px");
		} else {
			$e.text("[-]");
			thread.show();
			comment.closest("table").css("padding-bottom", "auto");
		}
	}
	
	var comments = $("body table table").eq(2);
	var parents = [];
	$("table", comments).each(function() {
		var $this = $(this);
		var level = $("td img[src*=s.gif]", this)[0].width / 40;
		var comhead = $("span.comhead", this);
		comhead.append(" ", $("<span class='collapse'>[-]</span>").css({cursor: "pointer"}).click(collapse).hover(function() { this.style.textDecoration = "underline"; }, function() { this.style.textDecoration = "none"; }));
		var id = $("a[href*=item]", comhead);
		if (!id.length) return true;
		id = id[0].href;
		id = id.substr(id.indexOf("=") + 1);
		$this.addClass("comment-" + id).data("comment", id);
		parents[level] = id;
		if (level > 0) {
			for (var i = 0; i < level; i++) {
				$this.addClass("parent-" + parents[i]);
			}
		}
	});
});
