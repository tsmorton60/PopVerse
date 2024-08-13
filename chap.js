var timeoutId = 0;
//var background = chrome.extension.getBackgroundPage();

var ph = '<font color="gray" size="-1"><i>Select text on any web page and with Ctrl down release mouse button to insert here.<br><br>Pasted text will retrain formatting.</i></font>'




var fullBooks = {
        'Gen':'Genesis', 'Exo':'Exodus', 'Lev':'Leviticus', 'Num':'Numbers', 'Deu':'Deuteronomy', 'Jos':'Joshua', 'Jdg':'Judges',
        'Rth':'Ruth', '1Sa':'1 Samuel', '2Sa':'2 Samuel', '1Ki':'1 Kings', '2Ki':'2 Kings', '1Ch':'1 Chronicles',
        '2Ch':'2 Chronicles', 'Ezr':'Ezra', 'Neh':'Nehemiah', 'Est':'Esther', 'Job':'Job', 'Psa':'Psalms', 'Pro':'Proverbs',
        'Ecc':'Ecclesiastes', 'Son':'Song Of Solomon', 'Isa':'Isaiah', 'Jer':'Jeremiah', 'Lam':'Lamentations', 'Eze':'Ezekiel',
        'Dan':'Daniel', 'Hos':'Hosea', 'Joe':'Joel', 'Amo':'Amos', 'Oba':'Obadiah', 'Jon':'Jonah', 'Mic':'Micah', 'Nah':'Nahum',
        'Hab':'Habbakkuk', 'Zep':'Zephaniah', 'Hag':'Haggai', 'Zec':'Zechariah', 'Mal':'Malachi', 
        'Mat':'Matthew', 'Mar':'Mark',
        'Luk':'Luke', 'Joh':'John', 'Act':'Acts', 'Rom':'Romans', '1Co':'1 Corinthians', '2Co':'2 Corinthians', 'Gal':'Galatians',
        'Eph':'Ephesians', 'Phi':'Philippians', 'Col':'Colossians', '1Th':'1 Thessalonians', '2Th':'2 Thessalonians',
        '1Ti':'1 Timothy', '2Ti':'2 Timothy', 'Tit':'Titus', 'Phm':'Philemon', 'Heb':'Hebrews', 'Jam':'James', '1Pe':'1 Peter',
        '2Pe':'2 Peter', '1Jo':'1 John', '2Jo':'2 John', '3Jo':'3 John', 'Jud':'Jude', 'Rev':'Revelation',
		}

var bookList = Object.keys(fullBooks);



document.addEventListener('click', function (event) {
    if (event.target && event.target.matches("input[type='radio']") && event.target.id == 'vsList') {
		chrome.runtime.sendMessage({
			from: 'getVsList'
		});
    }
});


document.addEventListener('DOMContentLoaded', function() {
    
    // history
    document.getElementById('histBtn').addEventListener('click', onHistBtn);
	
	// Navigate chapters
	document.getElementById('nextBtn').addEventListener('click', onNextBtn);
    document.getElementById('prevBtn').addEventListener('click', onPrevBtn);
    document.getElementById('nextBtn2').addEventListener('click', onNextBtn);
    document.getElementById('prevBtn2').addEventListener('click', onPrevBtn);
		
	// Called from refEntry.js
	document.getElementById('doRef').addEventListener('click', onRefEntry);
	//document.getElementById('refEntry').addEventListener('focus', function() { this.select(); });
	
	// Snippet Buttons
	//document.getElementById('downloadSnips').addEventListener('click', downloadSnips);
	//document.getElementById('toClipboard').addEventListener('click', doClipboard);
	//document.getElementById('toBA').addEventListener('click', toBibleAnalyzer);
	//document.getElementById('clearBtn').addEventListener('click', onClear);
	
	// Search
	document.getElementById('doSearch').addEventListener('click', onSearch);
	document.getElementById('schEntry').addEventListener('focus', function() { this.select(); });
	
	// Crossrefs
	document.getElementById('xrefChk').addEventListener('change', onXref);
	chrome.storage.local.get({xrefState: true}, function(items) {
		document.getElementById('xrefChk').checked = items.xrefState;
		chrome.runtime.sendMessage({msg: "setXrefVar", state: items.xrefState});
	});
})


function onSearch(e) {
	e.preventDefault();
	var entry = document.getElementById('schEntry').value;
	//background.console.log(entry);
    chrome.runtime.sendMessage({
		from: 'bibSearch',
		schTerm: entry
	}, function(msg) {
			var schMain = document.getElementById("search-hits");
			var schDetails = document.getElementById("search-details");
			
			var txts = msg.txts;
			if (txts == '') {
				txts = '<p align="center"><b>No results found for "' + msg.term + '."</b></p>';
			}
		
			document.getElementById("sch-head").style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";
			document.getElementById("search-details").style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";
			
			detailsTxt = '<font color="brown"><i>' + entry + '</i></font> found ' + msg.tCnt + ' times in ' + msg.vCnt + ' verse(s)'
			schDetails.innerHTML = detailsTxt;
			schMain.innerHTML = txts;
			renderResultsVisual(msg.bookHits);
            
            // So can link refs. In browser.js
            onPageLoad();
            
    });
}


function onHistBtn(evt) {
    chrome.runtime.sendMessage({
        from: 'histBtn'
    });
}


function onPrevBtn(e) {
    chrome.runtime.sendMessage({
        from: 'prevBtn'
    });
}

function onNextBtn(e) {
    chrome.runtime.sendMessage({
        from: 'nextBtn'
    });
}

function onXref() {
	var isEnabled = document.getElementById('xrefChk').checked;
	chrome.runtime.sendMessage({msg: "setXrefState", state: isEnabled});
}



var currChap;
function getCurrChap() {
	return currChap;
	}

var prevChap = '';

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	
    if (msg.from == 'forChap') {
        var main = document.getElementById("chap-main");
        main.innerHTML = msg.txt;
		
		//background.console.log(msg.txt)
		
		var currChap = msg.book + ' ' + msg.chap;

        document.title = 'PopVerse Chapter - ' + msg.book + ' ' + msg.chap + ': (' + msg.bibTitle + ')';

        var head = '<h1 class="bib">' + msg.book + '</h1><h2 class="bib">Chapter ' + msg.chap + '</h2><p class="chapHead2"><i>' + msg.bibTitle + '</i></p>';
        var headElem = document.getElementById("head");
        headElem.innerHTML = head;
		
		var head1 = document.getElementById("head1");
		head1.style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";

		var foot1 = document.getElementById("foot1");
		foot1.style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";
		
		document.getElementById("chap").checked = true;
		
		document.getElementById("refEntry").value = currChap;

        var elem = document.getElementsByClassName('vsHilite');
        if (elem.length > 0) {		
			elem[0].scrollIntoView({behavior: "smooth", block: "center"});
        } else {
            window.scrollTo(0, 0);
        }
		// So can link x-refs. In browser.js
		onPageLoad();
		
		
		
	} else if (msg.from == 'forVlist') {
		var main = document.getElementById("list-main");
		main.innerHTML = msg.txt; 
		
		//background.console.log(msg.txt)		
		//document.title = 'PopVerse Verse List (King James Bible)';

		var head = '<h2 class="bib">Verse List From Page</h2><h2 class="bib">' + msg.vcount + ' Verses</h2><p class="chapHead2">' + msg.title + '</p><p class="chapHead2"><i>' + msg.bibTitle + '</i></p>';
		
		var headElem = document.getElementById("vl-head");
		headElem.innerHTML = head;
		
		var head1 = document.getElementById("vl-head1");
		head1.style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";

		var foot1 = document.getElementById("vl-foot1");
		foot1.style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";
		
		window.scrollTo(0, 0);
		
        // So can link refs. In browser.js
		onPageLoad();	
        
		
	} else if (msg.from == 'contextBibSearch') {
			var schMain = document.getElementById("search-hits");
			var schDetails = document.getElementById("search-details");
			
			var txts = msg.txts;
			if (txts == '') {
				txts = '<p style="placeholder" align="center"><b>No results found for "' + msg.term + '."</b></p>';
			}
			detailsTxt = '<font color="brown"><i>' + msg.term + '</i></font> found ' + msg.tCnt + ' times in ' + msg.vCnt + ' verse(s)'
			
			schDetails.innerHTML = detailsTxt;
			schMain.innerHTML = txts; 
			
			document.getElementById("sch-head").style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";
			document.getElementById("search-details").style.background = "-webkit-gradient(linear, left top, left bottom, from("+msg.clrFrom+"), to("+msg.clrTo+"))";
			
			renderResultsVisual(msg.bookHits);
			document.getElementById('schEntry').value = msg.term;
			
			window.scrollTo(0, 0);
			document.getElementById("search").checked = true;
			
	}
});



// Visual search chart

function renderResultsVisual(bookHits) {
	var topVisual = document.getElementById('search-visual');
	console.log(topVisual); 
	var totalWidth = topVisual.offsetWidth,
		totalBooks = bookList.length,
		width = 1/totalBooks*100,
		html = '',
		maxCount = 0,
		baseHeight = 2;
		maxHeight = 38;

	for (var i=0, il=bookList.length; i<il; i++) {
		var count = bookHits[ bookList[i] ];
		if (count > maxCount) {
			maxCount = count;
		}
	}

	for (var i=0, il=bookList.length; i<il; i++) {
		var bookCode = bookList[i],
			count = bookHits[bookCode],
			height = maxHeight * count / maxCount + baseHeight,
			top = maxHeight + baseHeight - height;

		html += '<span class="search-result-book-bar ' + bookCode + '" data-count="' + count + '" data-id="' + bookCode + '" style="width:' + width + '%;"><span class="divisionid-' + bookCode + '" data-count="' + count + '" data-id="' + bookCode + '" style="height:' + height + 'px; margin-top: ' + top + 'px;"></span></span>';
	}

	//topVisual.html(html).show();
	topVisual.innerHTML = html;
}

// Listens to parent element but only acts on spans.
document.getElementById("search-visual").addEventListener('mouseover', function(e) {
	
	//console.log(e.target); 
	
	if(e.target && e.target.className.startsWith("search-result-book-bar") || e.target.className.startsWith("divisionid")) {
    
		var bookBar = e.target,
			count = bookBar.getAttribute('data-count'),
			bookCode = bookBar.getAttribute('data-id'),
			win = bookBar.closest('body'),
			winPos = getOffset(win),
			winWidth = win.offsetWidth,
			bookBarPos = getOffset(bookBar),
			top = bookBarPos.top, // + bookBar.height - winPos.top,
			left = bookBarPos.left - winPos.left;
			
		var topVisualLabel = document.getElementById("search-visual-label");
		topVisualLabel.innerHTML = fullBooks[bookCode] + ': ' + count;
		//topVisualLabel.style.top = top  + 'px';
		topVisualLabel.style.left = left + 'px';
		topVisualLabel.style.display = 'block';

		if (left + topVisualLabel.offsetWidth > winWidth) {
			left = winWidth - topVisualLabel.offsetWidth - 20;

			topVisualLabel.style.left = left + 'px';
		}
	}
})

document.getElementById("search-visual").addEventListener('mouseout', function(e) {
	
	if(e.target && e.target.className.startsWith("search-result-book-bar") || e.target.className.startsWith("divisionid")) {
		document.getElementById("search-visual-label").style.display = 'none';
	}
})

// Scrolls to first anchor that starts with book
document.getElementById("search-visual").addEventListener('click', function(e) {

		var bookBar = e.target,
			count = bookBar.getAttribute('data-count'),
			bookCode = bookBar.getAttribute('data-id');

		var anchorList = document.getElementsByTagName('a');
		for (var i=0, il=anchorList.length; i<il; i++) {
			if (anchorList[i].name.startsWith(bookCode)) {
				anchorList[i].scrollIntoView({behavior: "smooth", block: "center"});
				break
			}
		}
});



function getOffset(element)
{
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });   
}


