// (c) Timothy Morton, www.BibleAnalyzer.com
// Credits: Refilizer (Firefox))



 var oneTwoPatt = '(?:1|2|II?|First|Second|1st|2nd)\\s*';
 var threePatt = '(?:3|III|Third|3rd)\\s*';

 var bookPatts = [

     oneTwoPatt + 'Samuel', oneTwoPatt + 'Sam?\\.?',
     oneTwoPatt + 'Kings', oneTwoPatt + 'Ki\\.?', oneTwoPatt + 'Kgs\\.?',
     oneTwoPatt + 'Chronicles', oneTwoPatt + 'Chron\\.?', oneTwoPatt + 'Chr?\\.?',
     oneTwoPatt + 'Thessalonians', oneTwoPatt + 'Thess?\\.?', oneTwoPatt + 'Ths?\\.?',
     oneTwoPatt + 'Timothy', oneTwoPatt + 'Tim?\\.?',
     oneTwoPatt + 'Corinthians', oneTwoPatt + 'Cor?\\.?',
     oneTwoPatt + 'Peter', oneTwoPatt + 'Pet?\\.?',
     oneTwoPatt + 'John?', oneTwoPatt + 'Jn\\.?', oneTwoPatt + 'Jo\\.?',
     threePatt + 'John?', threePatt + 'Jn\\.?', threePatt + 'Jo\\.?',

     'Genesis', 'Gen?\\.?', 'Gn\\.?',
     'Exodus', 'Exo?d?\\.?',
     'Leviticus', 'Lev?\\.?',
     'Numbers', 'Num?\\.?',
     'Deuteronomy', 'Deu?t?\\.?', 'Dt\\.?',
     'Joshua', 'Josh?\\.?',
     'Judges', 'Ju?d?g\\.?', 'Jgs\\.?',
     'Ruth', 'Rut?\\.?', 'Rth\\.?',
     'Ezra', 'Ezr\\.?',
     'Nehemiah', 'Neh?\\.?',
     'Esther', 'Est?\\.?',
     'Job',
     'Psalms?', 'Psa?s?\\.?',
     'Proverbs', 'Pro?v?\\.?',
     'Ecclesiastes', 'Ecc?l?\\.?',
     'Song of Solomon', 'Song of Songs', 'Song?\\.?',
     'Isaiah', 'Isa?\\.?',
     'Jeremiah', 'Jer?\\.?',
     'Lamentations', 'Lam?\\.?',
     'Ezekiel', 'Eze?k?\\.?',
     'Daniel', 'Dan?\\.?', 'Dn\\.?',
     'Hosea', 'Hos?\\.?',
     'Joel', 'Joe\\.?',
     'Amos', 'Amo?\\.?',
     'Obadiah', 'Oba?\\.?',
     'Jonah', 'Jon\\.?',
     'Micah', 'Mic?\\.?',
     'Nahum', 'Nah?\\.?',
     'Habakkuk', 'Hab\\.?',
     'Zephaniah', 'Zeph?\\.?',
     'Haggai', 'Hagg?\\.?',
     'Zechariah', 'Zech?\\.?',
     'Malachi', 'Mal\\.?',
     'Matthew', 'Matt?\\.?', 'Mt\\.?',
     'Mark?\\.?', 'Mk\\.?', 'Mr\\.?',
     'Luke', 'Lu?k?\\.?',
     'John?\\.?', 'Jh?n\\.?',
     'Acts?', 'Ac\\.?',
     'Romans', 'Rom?\\.?', 'Rm\\.?',
     'Galatians', 'Gal?\\.?',
     'Ephesians', 'Eph?e?s?\\.?',
     'Philippians', 'Phil?\\.?', 'Philip\\.?', 'Php\\.?',
     'Colossians', 'Col?\\.?',
     'Titus', 'Tit\\.?',
     'Philemon', 'Philem\\.?', 'Phm\\.?',
     'Hebrews', 'He?b\\.?',
     'James', 'Jam?s?\\.?',
     'Jude?',
     'Revelation', 'Rev?\\.?'
 ];


 var dashPatt = '(?:\u00AD|\u002D|\u2010|\u2011\u2012|\u2013|\u2212)';
 //var verseOnlyPatt = '(?:,\\s*(?:(?:[Cc][h]?\\s*)?\\d{1,3}([:.v]|(\\s*v))\\s*)?\\d{1,3}(?:' + dashPatt + '(?:(?:[Cc][h]?\\s*)?\\d{1,3}([:.v]|(\\s*v))\\s*)?\\d{1,3}|ff|f)?)*';


 // Create regular expression to match references
 // Improved hyphen matching Aug 2008
 var fullRefPatt =
     '(' + bookPatts.join('|') + ')\\s*' +
     '(?:(?:[Cc][h]?\\s*)?\\d{1,3}([:.v]|(\\s*v))\\s*)\\d{1,3}' +
     '(?:' + dashPatt + '\\d{1,3})?' +
     '((?:,\\s*\\d+)?(?:' + dashPatt + '\\d+)?)*(?!:?\\d|\\s?(Sa|Ki|Ch|Co|Th|Ti|Pe|Jo))';

 var partRefPatt =
     '\\b(?:[Cc][h]?\\s*)?\\d{1,3}([:.v]|(\\s*v))\\s*\\d{1,3}' +
     '(?:' + dashPatt + '\\d{1,3})?' +
     '((?:,\\s*\\d+)?(?:' + dashPatt + '\\d+)?)*(?!:?\\d|\\s?(Sa|Ki|Ch|Co|Th|Ti|Pe|Jo))';

 var regExp = new RegExp('(?:' + fullRefPatt + ')|(?:' + partRefPatt + ')');

 //console.log(regExp)


 var showTimer = 0;
 var hideTimer = 0;
 var delay = 300;
 var container;
 var popup;
 var count = 0;


 // Handles page loading
 //
 function onPageLoad(evt) {
	chrome.storage.local.get({enableState: true}, function(items) {
		if (items.enableState === false) {
			background.console.log('Not enabled, return') 
			return;
		}

	/*
	// Checks for existing hard popverse links and adds listeners
	var anchr = document.getElementsByTagName("a");
	for (var i=0; i < anchr.length; i++) {
		if (anchr[i].href.match(/popverse:/)) {
			anchr[i].addEventListener("mouseover", linkMouseover, false);
			anchr[i].addEventListener("mouseout", linkMouseout, false);
			anchr[i].addEventListener("click", onClick, false);
		} 
	}
	*/
	
	// Checks for existing image map links and adds listeners
	var map = document.getElementsByName("popverse");
	for (var i=0; i < map.length; i++) {
		map[i].addEventListener("click", onClick, false);
		map[i].addEventListener("mouseover", linkMouseover, false);
		map[i].addEventListener("mouseout", linkMouseout, false);
	}
	
	//removeLinks();
	refLinker(document);

	createContainer();
	document.addEventListener("mousedown", hideAllTooltips, false);
	
	
	});
 }

//var ctrlOpt;
var titleInsert;
chrome.storage.local.get({ctrlOpt: 0, titleInsert: 1}, function(items) {
	//ctrlOpt = items.ctrlOpt;
	titleInsert = items.titleInsert;
	console.log(items); 
});


 function fixBook(bk) {

     var bookDict = {
         "[1I] ?Jo": "1Jo",
         "(2|II) ?Jo": "2Jo",
         "(3|III) ?Jo": "3Jo",
         "[1I] ?Jn": "1Jo",
         "(2|II) ?Jn": "2Jo",
         "(3|III) ?Jn": "3Jo",
         "Ge": "Gen",
         "Ex": "Exo",
         "Le": "Lev",
         "Nu": "Num",
         "De": "Deu",
         "Jos": "Jos",
         "Judg": "Jdg",
		 "Jg": "Jdg",
         "Ru": "Rth",
         "[1I] ?Sa": "1Sa",
         "(2|II) ?Sa": "2Sa",
         "[1I] ?Ki": "1Ki",
         "(2|II) ?Ki": "2Ki",
         "[1I] ?Ch": "1Ch",
         "(2|II) ?Ch": "2Ch",
         "Ezr": "Ezr",
         "Ne": "Neh",
         "Es": "Est",
         "Job": "Job",
         "Ps": "Psa",
         "Pr": "Pro",
         "Ec": "Ecc",
         "So": "Son",
         "Is": "Isa",
         "Je": "Jer",
         "La": "Lam",
         "Eze": "Eze",
         "Da": "Dan",
		 "Dn": "Dan",
         "Ho": "Hos",
         "Joe": "Joe",
         "Am": "Amo",
         "Ob": "Oba",
         "Jon": "Jon",
         "Mi": "Mic",
         "Na": "Nah",
         "Hab": "Hab",
         "Zep": "Zep",
         "Hag": "Hag",
         "Zec": "Zec",
         "Mal": "Mal",
         "Jgs": "Jdg",
         "Rth": "Rth",
         "Mat": "Mat",
         "Mar": "Mar",
		 "Mr": "Mar",
         "Lu": "Luk",
         "Joh": "Joh",
         "Ac": "Act",
         "Ro": "Rom",
         "[1I] ?Co": "1Co",
         "(2|II) ?Co": "2Co",
         "Ga": "Gal",
         "Ep": "Eph",
         "Phi": "Phi",
         "Php": "Phi",
         "Col": "Col",
         "[1I] ?Th": "1Th",
         "(2|II) ?Th": "2Th",
         "[1I] ?Ti": "1Ti",
         "(2|II) ?Ti": "2Ti",
         "Tit": "Tit",
         "He": "Heb",
         "Ja": "Jam",
         "[1I] ?Pe": "1Pe",
         "(2|II) ?Pe": "2Pe",
         "Jud": "Jud",
         "Re": "Rev",
         "Mt": "Mat",
         "Mk": "Mar",
         "Lk": "Luk",
         "Jn": "Joh",
         "Jas": "Jam",
         "[1I] ?Kgs": "1Ki",
         "2|II ?Kgs": "2Ki",
         "Phm": "Phm",
         "Phile": "Phm",
         "Jdg": "Jdg",
         "1S": "1Sa",
         "2S": "2Sa",
         "1K": "1Ki",
         "2K": "2Ki",
         "1P": "1Pe",
         "2P": "2Pe",
         "1J": "1Jo",
         "2J": "2Jo",
         "3J": "3Jo",
         "Jde": "Jud",
         "Tts": "Tit",
         "Jhn": "Joh",
     };

     var b;
     for (b in bookDict) {
         var patt = new RegExp(b + "\\w*");
         if (patt.test(bk)) {
             return bookDict[b];
         }
     }
     return bk;
 }


 function parseRef(ref) {
     //console.log( ref + ' r2');

     var patt = /((?:1|2|3|II?I?|First|Second|Third|1st|2nd|3rd)?\s?\w+)\.?\s?(?:[Cc]h)?(\d+)[:.v] ?(.+)/;
     var result = patt.exec(ref);
     var ch = result[2].replace(' ', '_');
     var bk = result[1].replace(' ', '');
     var vs = result[3];

     bk = bk.replace(/Third|III|3rd/, '3');
     bk = bk.replace(/Second|II|2nd/, '2');
     bk = bk.replace(/First|I\b|1st/, '1');
	 
	 //console.log(bk)


     bk = fixBook(bk)
     vs = vs.replace(new RegExp(dashPatt, 'g'), '-');

     //console.log(ch + ' r4');

     return [bk, ch, vs];
 }

 function parsePartRef(ref) {
     //console.log(ref);
     var patt = /(\d+)[:.v] ?(.+)/;
     var result = patt.exec(ref);
     var ch = result[1];
     var vs = result[2];
     vs = vs.replace(new RegExp(dashPatt, 'g'), '-');

     return [ch, vs];
 }

 //var linkType = 0

var linkType;
chrome.storage.local.get({linkType: 0,}, function(items) {linkType = items.linkType;
});

var colorTheme;
chrome.storage.local.get({colorTheme: 0,}, function(items) {colorTheme = items.colorTheme;
	 // Brown
	 if (colorTheme == 0) {
		clrFrom = "#FFFCED";
		clrTo = "#F7F2BB";
		clrRow = "#FFFBE7";
	// Gray
	 } else if (colorTheme == 1) {
		clrFrom = "#FDFDFD";
		clrTo = "#EBEBEB";
		clrRow = "#F4F4F4";
	// Red
	 } else if (colorTheme == 2) {
		clrFrom = "#FFF5F5";
		clrTo = "#FFDEDE";
		clrRow = "#FFF1F1";
	// Green
	 } else if (colorTheme == 3) {
		clrFrom = "#F8FFF8";
		clrTo = "#DBFFDC";
		clrRow = "#EEFFEE";
	// Blue
	 } else if (colorTheme == 4) {
		clrFrom = "#F6F6FF";
		clrTo = "#D8D8FA";
		clrRow = "#EFEFFF";
	 }
	 
 	 chrome.runtime.sendMessage({msg: 'currColor', colorFrom: clrFrom, colorTo: clrTo, colorRow: clrRow});

});
 
 
 //var lastBook = null;

 
// Removes hard links from sites with links to blacklist so PV can work. 
function removeLinks () {
	var blackList = /biblehub.com|biblegateway.com/;
	var link, links = document.links;
	var i = links.length;
	
	console.log(links) 

	while (i--) {
		link = links[i];
		if (blackList.test(link.href)) {
			var s = document.createElement("span");
			s.innerHTML = link.innerHTML;
			link.parentNode.replaceChild(s, link);
		}
	}
}
 
// Saves last tagged book for a partial reference.
// Placed here so it will be saved beyond current element (paragraph). Can cause false ref.
var doPartial;
chrome.storage.local.get({partialState: false,}, function(items) {console.log(items); doPartial = items.partialState;
var lastBook = null;
});
 
 // Based on Firefox Refilizer add-on
 function refLinker(doc) {
     var target = true ? "_blank" : "_self";

     // Get all text nodes in document
     var textNodes = doc.evaluate(
         "//text()",
         doc,
         null,
         XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
         null);

     // Get regular expression for matching references
     var refRegExp = regExp

     var refSearchURL = "bibleanalyzer://bible+av/%B%C:%V";
     if (linkType == 0) {
         var refSearchURL = "popverse://bible+av/%B%C:%V";
     }

     for (var i = 0; i < textNodes.snapshotLength; i++) {
         var textNode = textNodes.snapshotItem(i);
         var textNode2 = null;
         var parNode = textNode.parentNode;
		 
		 //console.log(doPartial)
		 
		 if (doPartial === false) {
			var lastBook = null;
		 }
		
         var matches = null;
         
		//console.log(textNode.data);
		//console.log(textNode)
		//console.log(parNode);
				 
         if (/^(a|script|style|button|title|form|head)$/.test(parNode.nodeName.toLowerCase()) != true) {
             // Search for references in text

             while (matches = refRegExp.exec(textNode.data)) {

                 //console.log(textNode.data);
                 //console.log(matches);

                 // Get text of reference
                 var ref = matches[0];
                 // Get text before and after reference
                 var textBeforeRef = matches.input.substring(0, matches.index);
                 var textAfterRef = matches.input.substring(matches.index + ref.length);
                 // Compress whitespace in text of reference
                 ref = ref.replace(/\s+/g, " ");

                 //console.log(ref + ' r1');
                 //console.log(textAfterRef);

                 if (matches[1]) {
                     // Get text of book (for subsequent partial references)
                     lastBook = matches[1];
                     // Remove extra whitespace from text of book
                     //lastBook = lastBook.replace(/\s+/g, " ");

                     var result = parseRef(ref);
                     //console.log(result + ' res');

                     var bk = result[0];
                     var ch = result[1];
                     var vs = result[2];

                     lastBook = bk

                     // Update text node to contain text before reference
                     textNode.data = textBeforeRef;
                     // Add hyperlink element containing reference
                     var elemNode = doc.createElement("a");
                     var href = refSearchURL
                         .replace("%B", bk + '_')
                         .replace("%C", ch)
                         .replace("%V", vs);
                     var baRef = bk + '_' + ch + ':' + vs;

                     //console.log(matches);

                     elemNode.setAttribute("href", href);
                     elemNode.setAttribute("id", baRef);
                     elemNode.innerHTML = ref;
                     parNode.insertBefore(elemNode, textNode.nextSibling);
                     
					 // Add second text node containing text after reference
                     textNode2 = doc.createTextNode(textAfterRef);
                     parNode.insertBefore(textNode2, elemNode.nextSibling);

                     elemNode.addEventListener("mouseover", linkMouseover, false);
                     elemNode.addEventListener("mouseout", linkMouseout, false);
                     elemNode.addEventListener("click", onClick, false);
					 count +=1;

                 } else if (lastBook != null) {
                     // Update text node to contain text before reference
                     textNode.data = textBeforeRef;
                     
					 // Add hyperlink element containing reference
                     var elemNode = doc.createElement("a");

                     var result = parsePartRef(ref);
                     var ch = result[0];
                     var vs = result[1];

                     var href = refSearchURL
                         .replace("%B", '')
                         .replace("%C", lastBook + '_' + ch)
                         .replace("%V", vs);

                     elemNode.setAttribute("href", href);
                     elemNode.setAttribute("id", ref);
                     elemNode.innerHTML = ref;
                     parNode.insertBefore(elemNode, textNode.nextSibling);
                     
					 // Add second text node containing text after reference
                     textNode2 = doc.createTextNode(textAfterRef);
                     parNode.insertBefore(textNode2, elemNode.nextSibling);

                     elemNode.addEventListener("mouseover", linkMouseover, false);
                     elemNode.addEventListener("mouseout", linkMouseout, false);
                     elemNode.addEventListener("click", onClick, false);
					 count +=1;

                 } else {
                     // Update text node to contain text up to end of reference
                     textNode.data = textBeforeRef + ref;
                     // Add second text node containing text after reference
                     textNode2 = doc.createTextNode(textAfterRef);
                     parNode.insertBefore(textNode2, textNode.nextSibling);
                 }
                 // Continue to search for references in text after reference
                 textNode = textNode2;
             }
         }
     }
	 chrome.runtime.sendMessage({from: 'count', total: count})
 }


 var linkMouseout = function(evt) {
     if (!evt) {
         evt = window.event;
     }
     if (evt.target.nodeName.toLowerCase() == 'a' || evt.target.nodeName.toLowerCase() == 'area' && showTimer) {
         window.clearTimeout(showTimer);
         window.clearTimeout(hideTimer);
         hideTimer = window.setTimeout(function() {
             hideAllTooltips(evt)
         }, delay);
     }
 }


 var linkMouseover = function(e) {
     if (!e) {
         e = window.event;
     }
     if (e.target.nodeName.toLowerCase() == 'a' || e.target.nodeName.toLowerCase() == 'area') {
         window.clearTimeout(showTimer);
         showTimer = window.setTimeout(function() {
             onHover(e)
         }, delay);
     }
 }

 function onClick(evt) {
     if (!evt) {
         var evt = window.event;
     }
     if (!evt.target.href) {
         return
     }

	 
     if (linkType == 1) {
         console.log('Linktype set for Bible Analyzer');
         return
     }
	 
	 evt.stopPropagation()
     evt.preventDefault()

     var lnk = evt.target || evt.srcElement;
	 
     var origref = lnk.href.match(/\/(\w\w\w_.*?)$/)[1];
     var ref = origref.replace("_", " ");
     var chap = ref.slice(0, ref.search(/:/) + 1);
     var vss = ref.slice(ref.search(/:/) + 1);
     //var fullBk = fullBook(ref.slice(0, 3));
     var bk = (ref.slice(0, 3));
     var chInt = chap.match(/\w\w\w (\d+):/)[1];

     chrome.runtime.sendMessage({
         from: 'page',
         chapter: chap,
         verses: vss,
         book: bk,
         chapInt: chInt,
		 lnk: lnk.href
     })

 }

 function onHover(evt) {
     if (!evt) {
         var evt = window.event;
     }
     if (!evt.target.href) {
         return
     }
	  
     hideAllTooltips(evt);
	 
	 var link = evt.target || evt.srcElement;
	 
     var origref = link.href.match(/\/(\w\w\w_.*?)$/)[1];
     var ref = origref.replace("_", " ");
     //console.log(link.href)

     var vsTxt;

     chrome.runtime.sendMessage({
         from: 'ref',
         reference: ref
     }, function(response) {
         vsTxt = response.topage;
		 currBibTitle = response.bibTitle;

         //var pos = getElementPosition(link);
		 var posX = evt.clientX;
		 var posY = evt.clientY;
         var chap = ref.slice(0, ref.search(/:/) + 1);

         var vsData = '<span class="body"><span class="capt">' + chap + ' - ' + currBibTitle + '</span>' + vsTxt + '<span class="foot">PopVerse Reference System</span></span>'

         popup = document.createElement("div");
         popup.id = "popverse-" + origref;
         popup.style.display = "block";
         popup.style.position = "absolute";
		 popup.style.textAlign = "left";
         popup.style.width = "320px";
         popup.style.zIndex = "999";
         popup.style.left = "2em";
         popup.style.fontFamily = "Verdana, Calibri, Tahoma, Geneva, sans-serif";
         popup.style.fontSize = "10pt";
         popup.style.color = "#000000";
         popup.style.lineHeight = "normal";
         popup.style.top = "2em";
         popup.style.padding = "0.4em .4em 0.6em .8em";
         popup.style.WebkitBorderRadius = "5px";
         popup.style.backgroundColor = "#FCFCFC";
         popup.style.WebkitBoxShadow = '0px 0px 7px #555';
		 popup.style.background = "-webkit-gradient(linear, left top, left bottom, from("+clrFrom+"), to("+clrTo+"))";
         popup.innerHTML = vsData;
         popup.style.visibility = "hidden"
         container.appendChild(popup);

         var winW = window.innerWidth || document.documentElement.offsetWidth;
         var winH = window.innerHeight || document.documentElement.offsetHeight;
         var vScroll = window.pageYOffset || document.documentElement.scrollTop; // - 20
         var hScroll = window.pageXOffset || document.documentElement.scrollLeft;
		 
         var popW = popup.offsetWidth;
         var popH = popup.offsetHeight;

         var west = posX + hScroll + 15;
         var north = posY + vScroll + 25;

         if (posX + popW + 15 > winW) {
             west = posX - popW + hScroll - 20;
         }

         if (posY + popH + 0 > winH) {
             north = posY - popH + vScroll - 20;
         }

         popup.style.top = north + 'px';
         popup.style.left = west + 'px';
         popup.style.visibility = "visible"

     });
 }


 function elemNodes(elem) {
     nodes = [];
     for (var i = 0; i < elem.childNodes.length; i++) {
         if (elem.childNodes[i].nodeType == 1)
             nodes.push(elem.childNodes[i]);
     }
     return nodes;
 }


 function getElementPosition(elem) {
     var posX = 0;
     var posY = 0;

     while (elem != null) {
         posX += elem.offsetLeft;
         posY += elem.offsetTop;
         elem = elem.offsetParent;
     }
     return {
         x: posX,
         y: posY
     };
 }


 var createContainer = function() {
     container = document.createElement('div');
     container.id = 'popup-container';
     document.body.appendChild(container);
 }


 var hideAllTooltips = function(e) {
     var divs = container.children;
     var len = divs.length;
     for (var i = 0; i < divs.length; i++) {
         divs[i].style.display = 'none';
     }
     for (var i = 0; i < divs.length; i++) {
         divs[i].remove();
     }
 }


 chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
     if (request.action == "getLinks") {
         var lnks = [];
         l = document.links;
         for (var i = 0; i < l.length; i++) {
             if (/bibleanalyzer|popverse/.test(l[i].href)) {
                 ref = /bible.+?\/(.+?)$/.exec(l[i].href);
                 lnks.push(ref[1]);
             }
         }
         sendResponse({
             links: lnks,
			 //url: window.location.href
			 title: document.title
         });
     }
 });
 
// window.onerror = function (errorMsg, url, lineNumber) {
//    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
//}


window.addEventListener("DOMContentLoaded", onPageLoad, false);
 
 
