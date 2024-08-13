// (c) Timothy Morton, www.BibleAnalyzer.com
var currentBib;
var currBibText;
var currBibTitle;

var chapWinId;
var chapTabId;

var schTerm;
var schTxts;
var schTCount;
var schVCount;
var schBookHits
var inSearch = false;

var popTxts;
var popBook;
var popChapInt;
var inChap = false;

var snipTxt;
var snipDoTitle;
var snipTitleTxt;
var snipUrl;
var inInsert = false;

var currentChap;
var currentVL = [];
var previousChap;
var previousVL = [];

var vlListCount;
var vlVsCount;
var vlUrl;
var pageUrl;
var refCount;
var showXrefs = true;

var clrFrom;
var clrTo;
var clrRow;

//var scnW = window.screen.width;
//var scnH = window.screen.height;

import {avBib} from '/kjv.js';
import {bsbBib} from '/bsb.js';
import {tska} from '/tska.js';



var chapIdx = {
    "Gen": 50,
    "Exo": 40,
    "Lev": 27,
    "Num": 36,
    "Deu": 34,
    "Jos": 24,
    "Jdg": 21,
    "Rth": 4,
    "1Sa": 31,
    "2Sa": 24,
    "1Ki": 22,
    "2Ki": 25,
    "1Ch": 29,
    "2Ch": 36,
    "Ezr": 10,
    "Neh": 13,
    "Est": 11,
    "Job": 42,
    "Psa": 150,
    "Pro": 31,
    "Ecc": 12,
    "Son": 8,
    "Isa": 66,
    "Jer": 52,
    "Lam": 5,
    "Eze": 49,
    "Dan": 12,
    "Hos": 14,
    "Joe": 3,
    "Amo": 9,
    "Oba": 1,
    "Jon": 4,
    "Mic": 7,
    "Nah": 4,
    "Hab": 3,
    "Zep": 3,
    "Hag": 2,
    "Zec": 14,
    "Mal": 4,
    "Mat": 28,
    "Mar": 16,
    "Luk": 24,
    "Joh": 22,
    "Act": 28,
    "Rom": 16,
    "1Co": 16,
    "2Co": 13,
    "Gal": 6,
    "Eph": 6,
    "Phi": 4,
    "Col": 4,
    "1Th": 6,
    "2Th": 3,
    "1Ti": 6,
    "2Ti": 4,
    "Tit": 3,
    "Phm": 1,
    "Heb": 13,
    "Jam": 5,
    "1Pe": 5,
    "2Pe": 4,
    "1Jo": 5,
    "2Jo": 1,
    "3Jo": 1,
    "Jud": 1,
    "Rev": 22,
};

var bibBooks = Object.keys(chapIdx);


function fullBook(bk) {
    var bookGrp = {
        'Gen': 'Genesis',
        'Exo': 'Exodus',
        'Lev': 'Leviticus',
        'Num': 'Numbers',
        'Deu': 'Deuteronomy',
        'Jos': 'Joshua',
        'Jdg': 'Judges',
        'Rth': 'Ruth',
        '1Sa': '1 Samuel',
        '2Sa': '2 Samuel',
        '1Ki': '1 Kings',
        '2Ki': '2 Kings',
        '1Ch': '1 Chronicles',
        '2Ch': '2 Chronicles',
        'Ezr': 'Ezra',
        'Neh': 'Nehemiah',
        'Est': 'Esther',
        'Job': 'Job',
        'Psa': 'Psalms',
        'Pro': 'Proverbs',
        'Ecc': 'Ecclesiastes',
        'Son': 'Song Of Solomon',
        'Isa': 'Isaiah',
        'Jer': 'Jeremiah',
        'Lam': 'Lamentations',
        'Eze': 'Ezekiel',
        'Dan': 'Daniel',
        'Hos': 'Hosea',
        'Joe': 'Joel',
        'Amo': 'Amos',
        'Oba': 'Obadiah',
        'Jon': 'Jonah',
        'Mic': 'Micah',
        'Nah': 'Nahum',
        'Hab': 'Habbakkuk',
        'Zep': 'Zephaniah',
        'Hag': 'Haggai',
        'Zec': 'Zechariah',
        'Mal': 'Malachi',
        'Mat': 'Matthew',
        'Mar': 'Mark',
        'Luk': 'Luke',
        'Joh': 'John',
        'Act': 'Acts',
        'Rom': 'Romans',
        '1Co': '1 Corinthians',
        '2Co': '2 Corinthians',
        'Gal': 'Galatians',
        'Eph': 'Ephesians',
        'Phi': 'Philippians',
        'Col': 'Colossians',
        '1Th': '1 Thessalonians',
        '2Th': '2 Thessalonians',
        '1Ti': '1 Timothy',
        '2Ti': '2 Timothy',
        'Tit': 'Titus',
        'Phm': 'Philemon',
        'Heb': 'Hebrews',
        'Jam': 'James',
        '1Pe': '1 Peter',
        '2Pe': '2 Peter',
        '1Jo': '1 John',
        '2Jo': '2 John',
        '3Jo': '3 John',
        'Jud': 'Jude',
        'Rev': 'Revelation',
    };

    return bookGrp[bk];
}

//Checks if enabled and sets correct icon
chrome.storage.local.get({enableState: true}, function(items) {
	//console.log(items)
	if (items.enableState === false) {
		chrome.action.setIcon({path: "icon19dis.png"});
	}
});


chrome.storage.local.get({currentBib: 0}, function(items) {
	currentBib = items.currentBib;
	console.log(currentBib, 'currentBib')
});

 

chrome.storage.local.get({xrefState: true}, function(items) {
	showXrefs = items.xrefState;
});


//Sets enabled state from icon popup
chrome.runtime.onMessage.addListener(
function (request, sender, sendResponse) {
    if (request.msg == "setEnableState") {
		chrome.storage.local.set({enableState: request.state});
    } else if (request.msg == "setXrefState") {
		chrome.storage.local.set({xrefState: request.state});
		showXrefs = request.state;
		
		popTxts = getChapText(currentChap, '');
		sendToChap(popTxts, popBook, popChapInt);
		//chrome.windows.update(chapWinId, {
		//	"focused": true
		//});
    } else if (request.msg == "setXrefVar") {
		showXrefs = request.state;
    
	} else if (request.msg == "currColor") {
		clrFrom = request.colorFrom;
		clrTo = request.colorTo;
		clrRow = request.colorRow;
	}
	
});


chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
		//console.log(msg.from, 'message from'); 
		
		//Gets count from page and sets badge
		if (msg.from === 'count') {
			chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			refCount = msg.total;
			chrome.action.setBadgeText({text: refCount.toString(), tabId: tabs[0].id});
			});
        
		} else if (msg.from === 'currBib') {
			//console.log(msg.bib, 'msg.bib');
            currentBib = msg.bib;
			
			if (currentBib == 0) {
				currBibTitle = 'King James Bible'
			} else {
				currBibTitle = 'Berean Standard Bible'
			}
        
		} else if (msg.from === 'popLink') {
			console.log(msg.lnk);
            document.getElementById("ifrm").src = msg.lnk;
            
        // Get verse on mouseover
		} else if (msg.from === 'ref') {
            var txt = checkRef(msg.reference, 0);
            sendResponse({
                topage: txt,
				bibTitle: currBibTitle
            });
        
		// From Bible search
		} else if (msg.from === 'bibSearch') {
			var results = searchBib(msg.schTerm);
			var txtList = results[0];
			var hitCnt = results[1];
			var bookHits = results[2];
			var count = txtList.length;
			var hits = txtList.join('');
            sendResponse({
				txts: hits,
				tCnt: hitCnt,
				vCnt: count,
				bookHits: bookHits,
				clrTo: clrTo,
				clrFrom: clrFrom
            });
			
			
		// From icon panel search
		} else if (msg.from === 'panelSearch') {
			// To make new schTerm global
			schTerm = msg.term;
			doPanelSearch(msg.term);
			
		
		} else if (msg.from === 'getVsList') {
			chrome.tabs.query({ active: true }, function (tabs) {
				//console.log(tabs[0]); 
				if (tabs[0].url) {
					console.log(tabs[0]) ;
					exportRefs(tabs[0].url.split('/').slice(2,).join('/'), tabs[0])
				}
			});
			
		// Sends message to Bible Analyzer to paste editor text in clipboard 
		//} else if (msg.from === 'toBA') {
		//	pasteUrl = "bibleanalyzer://pvpaste/";
		//	document.getElementById("ifrm").src = pasteUrl;
			
		
		//Need to create popup window
		} else if ((msg.from === 'page') && (typeof chapWinId === "undefined")) {
            
            currentChap = msg.chapter;
            currentVL = getVsList(msg.verses);
			
			//console.log(msg.lnk)
            previousChap = currentChap;
            previousVL = currentVL;
            
			popTxts = getChapText(currentChap, currentVL);
            			
            popBook = fullBook(msg.book);
            popChapInt = msg.chapInt;
			
			inChap = true;
			createWin();
        }

        // There's currently a popup open
        else if (msg.from === 'page') {
            
            previousChap = currentChap;
            previousVL = currentVL;
            
            currentChap = msg.chapter;
            currentVL = getVsList(msg.verses);
            popTxts = getChapText(currentChap, currentVL);
            
            console.log(currentVL, 'cvl') 

            popBook = fullBook(msg.book);
            popChapInt = msg.chapInt;

            sendToChap(popTxts, popBook, popChapInt);
            chrome.windows.update(chapWinId, {
                "focused": true
            });
			
		} else if (msg.from === 'prevBtn') {
            var prs = /(\w\w\w) (\d+):/.exec(currentChap);
            var bk = prs[1];
            var chInt = Number(prs[2]);
            var chMaxInt = chapIdx[bk];
            if (chInt > 1) {
                var prevInt = chInt - 1;
                var prevChap = bk + " " + prevInt + ":";
            } else {
                bkIdx = bibBooks.indexOf(bk);
                if (bkIdx > 0) {
                    bk = bibBooks[bkIdx - 1];
                } else {
                    bk = 'Rev';
                }
                var prevInt = chapIdx[bk];
                var prevChap = bk + " " + prevInt + ":";
            }

            popTxts = getChapText(prevChap, '');
            currentChap = prevChap;
            popBook = fullBook(bk);
            popChapInt = prevInt;

            sendToChap(popTxts, popBook, popChapInt);

        } else if (msg.from === 'nextBtn') {
            var prs = /(\w\w\w) (\d+):/.exec(currentChap);
            var bk = prs[1];
            var chInt = Number(prs[2]);
            var chMaxInt = chapIdx[bk];
            if (chInt < chMaxInt) {
                var nextInt = chInt + 1;
                var nextChap = bk + " " + nextInt + ":";
            } else {
                bkIdx = bibBooks.indexOf(bk);
                if (bkIdx < 65) {
                    bk = bibBooks[bkIdx + 1];
                } else {
                    bk = 'Gen';
                }
                var nextInt = 1;
                var nextChap = bk + " " + nextInt + ":";
            }

            popTxts = getChapText(nextChap, '');
            currentChap = nextChap;
            popBook = fullBook(bk);
            popChapInt = nextInt;

            sendToChap(popTxts, popBook, popChapInt);
        
        } else if (msg.from === 'histBtn') {
            
            console.log(previousChap, currentChap, 'previousChap') 
            
            if (previousChap && previousChap != currentChap) {
                console.log(previousVL, 'pvl') 
                popTxts = getChapText(previousChap, previousVL);
                currentChap = previousChap;
                currentVL = previousVL;
                
                var prs = /(\w\w\w) (\d+):/.exec(previousChap);
                var bk = prs[1];
                var chInt = Number(prs[2]);                
                
                popBook = fullBook(bk);
                popChapInt = chInt;
                
                console.log(popBook, popChapInt, 'send') 

                sendToChap(popTxts, popBook, popChapInt);
            }
            
        } else if (msg.from === 'error') {
            if (msg.type === 'ref') {
                //alert('"' + msg.entry + '" is not a valid reference.');
                chrome.windows.create({
                    type: 'popup',
                    url: "abbr.html",
                    width: 600,
                    height: 500,
                    left: (screen.width / 2) - 300,
                    top: (screen.height / 2) - 250
                });
            }
		
		// When selection is made but window not open
		} else if (msg.from == 'forEditor') {
			snipTxt = msg.txt;
			snipDoTitle = msg.doTitle;
			snipTitleTxt = msg.titleTxt;
			snipUrl = msg.url;
			
			if (typeof chapWinId === "undefined") {
				inInsert = true;
				getInitialChap();
				inChap = true;
				createWin();
			} else {
				chrome.runtime.sendMessage({
				from: 'toEditor',
				txt: snipTxt,
				doTitle: snipDoTitle,
				titleTxt: snipTitleTxt,
				url: snipUrl,
				clrTo: clrTo,
				clrFrom: clrFrom
				});	

			}
		}
    });

// Displays Gen 1 when a different action creates the window
function getInitialChap() {
	popTxts = getChapText('Gen 1', []);	
	currentChap = 'Gen 1:';
	popBook = 'Genesis';
	popChapInt = '1';
}



//Does Bible search
function searchBib(term) {
	getBible();
    var txts = [];
	var cnt = 0
	var term = term.replace(/\*/g, "\\w*").trim();	
	term = term.replace(/\s+/g, ' ')
	var bibTxt = currBibText;
	
	// Phrase search 
	if (term.indexOf('"') > -1) {
		term = term.replace(/ /g, '[\\s.,;:?!-]*(?:\\s?<[^>]+>)*\\s?')
		term = term.replace(/"/g, '')
	} else {
		term = term.split(' ').join('|');
	}
		
	// For single or ANY of multiple word and to mark hits
	var regex = new RegExp(`\\b(${term})\\b`, 'gi');
    var markRE = new RegExp(`\\b(${term})\\b`, 'gi');
	
	// For ALL words
	if (term.indexOf('&') > -1) {
		isAllSearch = true;

		bibTxt = {}
		allWords = term.replace(/\|/g, '').split('&');
		
		// Get verses with first word and use as data for next search
		for (const [key, value] of Object.entries(currBibText)) {
			if (value.search(new RegExp(`\\b${allWords[0]}\\b`, 'gi')) >= 0) {
				bibTxt[key] = value;
			}
		}

		// Joins all words into the regex string
		var regex = allWords.map(word => "(?=.*\\b" + word + "\\b)").join('');
		regex = new RegExp(regex, 'gi');
	}
	
	// Get hits per book
	var bookHits = {};
	for (var i=0, il=bibBooks.length; i<il; i++) {
		bookHits[ bibBooks[i] ] = 0;
	}

	for (const [key, value] of Object.entries(bibTxt)) {
		if (value.search(regex) >= 0) {
			bookHits[key.substr(0, 3)]++;
			var vsTxt = '<a name="' + key + '"></a><div class="alt-verse" id="vs' + key + '"><b>' + key + '</b> ' + value + '</div>';
			var vsTxt = vsTxt.replace(markRE, function(cap) {cnt += 1; return `<mark>${cap}</mark>`});
			txts.push(vsTxt);
		}
	}
	
	if (typeof chapWinId === "undefined") {
		getInitialChap();
		inChap = true;
		createWin();
	}
	return [txts, cnt, bookHits];	
}


// Sends text to chapter panel
function sendToChap(txts, fullBk, chapInt) {
	chrome.runtime.sendMessage({
		from: 'forChap',
		txt: txts,
		book: fullBk,
		chap: chapInt,
		bibTitle: currBibTitle,
		clrTo: clrTo,
		clrFrom: clrFrom
	});
}


function sendToVlist(vlUrl, txts, vsCount, grpCount, pageTitle) {
	chrome.runtime.sendMessage({
		from: 'forVlist',
		txt: txts,
		title: pageTitle,
		bibTitle: currBibTitle,
		vcount: vsCount,
		gcount: grpCount,
		clrTo: clrTo,
		clrFrom: clrFrom
	});
}


// Listens for chap popup to be completely loaded so data can be sent.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	//console.log(tabId); 
    if (changeInfo.status === "complete" && tabId == chapTabId) {
		
		// Gets and saved selection data in storage
		chrome.storage.local.get({snipData: false}, function(items) {
			var snipData = items.snipData;
			
			chrome.runtime.sendMessage({
				from: 'loadSnipData',
				data: snipData,
			});		
			
			// If a selection is the first action
			if (inInsert) {
				chrome.runtime.sendMessage({
					from: 'toEditor',
					txt: snipTxt,
					doTitle: snipDoTitle,
					titleTxt: snipTitleTxt,
					url: snipUrl,
				});	
				inInsert = false;
			}
		});
        
		if (inChap) {
			sendToChap(popTxts, popBook, popChapInt);
			inChap = false;
		}
		
		if (inSearch) {
			sendToSearch(schTerm, schTxts, schTCount, schVCount, schBookHits);
			inSearch = false;
		}
	}
});


function getVsList(vss) {
    var vsList = [];
    var grp = vss.split(',');
    for (var vs in grp) {
        vs = grp[vs].replace(/^\s+/, '');

        if (vs.search('-') != -1) {
            var hits = /(\d+)-(\d+)/.exec(vs);
            var start = Number(hits[1]);
            var end = Number(hits[2]);

            for (var v = start; v <= end; v++) {
                vsList.push(v);
            };
        } else {
            vsList.push(parseInt(vs));
        }
    }
    return vsList;
}



function getChapText(chap, vsList) {
	getBible();
    var txts = [];
    var keys = Object.keys(currBibText);
    

    // Get keys that start with chap
    var hits = keys.filter(function(item) {
        return item.indexOf(chap) === 0;
    });
	
	if (showXrefs === true) {
		txts.push('<table cellspacing="2">');
	}
	
    for (var idx in hits) {
        var vs = parseInt(idx) + 1;
        var clss = 'alt-verse';
        if (vsList.indexOf(vs) > -1) {
            clss = 'vsHilite';
        } else if (showXrefs === true) {
			clss = 'verse';
		}
		
		
		var xStr = '';
		if (showXrefs === true) {
            
            var xLinks = [];
            var xrefs = tska[hits[idx]];
            
			if (typeof xrefs !== 'undefined') {
				var xrefList = xrefs.split(',');
				for (var i in xrefList) {
					//var lnk = '<a href="popverse://bible+av/' + xrefList[i].replace(' ', '_') + '">' + xrefList[i] + '</a>';
					xLinks.push(xrefList[i]);
					//xLinks.push(lnk);
				}
			}
			xStr = '<td width="25%" style="border-left: 2px solid #C6C6C6;"><div class="xref" style="color: #4B50B7;">No Cross-Refs</div></td></tr>';		
			if (xLinks.length > 0) {
				var xLnks = xLinks.join(', ');
				xStr = '<td width="25%" style="border-left: 2px solid #C6C6C6;"><div class="xref">' + xLnks + '</div></td></tr>'
			}
			
			if (vs % 2 === 0) {
				var vsTxt = '<tr><td width="75%"><a name="' + vs + '"></a><div class="' + clss + '" id="vs' + vs + '"><b>' + vs + '</b> ' + currBibText[hits[idx]] + '</div></td>' + xStr;
			} else {
				var vsTxt = '<tr style="background-color: #FCF8DB;"><td width="75%"><a name="' + vs + '"></a><div class="' + clss + '" id="vs' + vs + '"><b>' + vs + '</b> ' + currBibText[hits[idx]] + '</div></td>' + xStr;
			}
		
		} else {
			var vsTxt = '<a name="' + vs + '"></a><div class="' + clss + '" id="vs' + vs + '"><b>' + vs + '</b> ' + currBibText[hits[idx]] + '</div>';
		}

		//console.log(vsTxt); 
		txts.push(vsTxt);
    }
	
	if (showXrefs === true) {
		txts.push('</table>');
	}
	
    return txts.join('');

    // Gets value in object (list) at index (2)
    //(avBib[Object.keys(avBib)[2]])

    // Gets index in array
    //var pos = keys.indexOf(chap + '1');
}

function getBible() {
	if (currentBib == 0) {
		currBibText = avBib;
		currBibTitle = 'King James Bible';
	} else {
		currBibText = bsbBib; 
		currBibTitle = 'Berean Standard Bible';
	}
	console.log(currentBib, 'currentBib2') 
}

var checkRef = function(ref, type) {
	
	getBible()
	console.log(currentBib, 'currentBib3')
   
   //console.log(ref + ' cr')
    var grp = ref.split(',');
    var chap = ref.slice(0, ref.search(/:/) + 1);

    var txts = [];
    var txt = "";
    var g;
    for (g in grp) {
        //console.log(grp[g])
        g = grp[g].replace(/^\s+/, '');

        if (g.indexOf(':') > -1) {
            txt = getRefText(g, type);
        } else {
            txt = getRefText(chap + g, type);
        }
        txts.push(txt);
    }
    return txts.join('<br>');
};


var getRefText = function(ref, type) {
    var vs = ref.slice(ref.search(/:/) + 1);

    if (ref.search('-') != -1) {
        var all = [];
        var hits = /(\d+)-(\d+)/.exec(ref);
        var chap = ref.slice(0, ref.search(/:/) + 1);
        var start = Number(hits[1]);
        var end = Number(hits[2]);
        var shorten = false;
        if (end - start > 5) {
            //console.log(start + ', ' + end)
            shorten = true;
            end = start + 4;
        }

		// Type 0 is mouseover; 1 is verse list.
		if (type === 1) {
            for (var i = start; i <= end; i++) {
                all.push('<div><b>' + chap + i + '</b>' + ' ' + currBibText[chap + i] + '</div>');
            }
        } else {
            for (var i = start; i <= end; i++) {
                all.push('<div style="text-indent: 1em";><b>' + i + '</b>' + ' ' + currBibText[chap + i] + '</div>');
            }
        }
        if (shorten === true) {
            all.push('<i>continued...click for all verses</i>');
        }

        return all.join('');
    }

    if (type === 1) {
        return '<b>' + ref + '</b>' + ' ' + currBibText[ref];
    } else {
        return '<div style="text-indent: 1em";><b>' + vs + '</b>' + ' ' + currBibText[ref] + '</div>';
    }
};

// Create window
function createWin() {
	//alert('creating window');
    chrome.windows.getCurrent(function(displayInfo) { 
        console.log(displayInfo.width); 
        chrome.storage.local.get({
            chapWinW: 500,
            chapWinH: 700,
            chapPosX: (displayInfo.width / 2) - (500 / 2) + 100,
            chapPosY: (displayInfo.height / 2) - (700 / 2)
        }, function(items) {
            var popW = items.chapWinW;
            var popH = items.chapWinH;

            var popleft = items.chapPosX;
            var poptop = items.chapPosY;

            //console.log(items)

            chrome.windows.create({
                type: 'popup',
                url: "chap.html",
                width: popW,
                height: popH,
                left: popleft,
                top: poptop

            }, function(win) {
                chapWinId = win.id;
                chapTabId = win.tabs[0].id;
            });
        });
    });
}


// When a window is closed
chrome.windows.onRemoved.addListener(function(windowId) {
    // If the window getting closed is the popup we created
    if (windowId === chapWinId) {
        // Set popupId to undefined so we know the popup is not open
        chapWinId = undefined;
        chapTabId = undefined;
    } 
});


// Normalize refs
var normRef = function(ref) {
    ref = ref.replace("/bible+av/", '');
    var grp = ref.split(',');
    var chap = ref.slice(0, ref.search(/:/) + 1);

    var refs = [];
    var g;
    for (g in grp) {
        //console.log(grp[g] + ' g');
        g = grp[g].replace(/^\s+/, '');

        if (g !== grp[0]) {
            g = chap + g;
        }
        refs.push(g);
    }
    return refs.join(',');
};


// The onClicked callback function for context menu.
function exportRefs(url, tab) {

	 var linkType;
	 chrome.storage.local.get({linkType: 0,}, function(items) {linkType = items.linkType;
	 });

    chrome.tabs.sendMessage(tab.id, {
        action: "getLinks"
    }, function(response) {
		
			if (typeof response == 'undefined') {
				console.log('No list data'); 
				return
			}
			
			//console.log(response); 
		
			var refList = response.links;
			var pageTitle = response.title;
		
		
		if (refList.length == 0) {
			return
		}

        //var p = document.createElement('a');

        //pageUrl = url;

        var refTxtList = [];
        var fixed = '';
        var i;
        var fix;
        for (i in refList) {
            fix = normRef(refList[i]);
            fixed += (fix + ',');
            var refTxt = checkRef(fix.replace(/_/g, ' '), 1);
			refTxt = refTxt.replace('&nbsp;&nbsp;', '')
			refTxt = `<div class="alt-verse">${refTxt}</div>`
            refTxtList.push(refTxt);
        }
        var vlUrl = "bibleanalyzer://vlist+av/" + fixed;

        var vlListCount = refTxtList.length;
        var vlTxts = refTxtList.join('');
        var vlVsCount = refTxtList.length;
		
		//linkType = 1
		
		if (linkType == 1) {
			console.log(vlUrl)
			//document.getElementById("ifrm").src = vlUrl;
			chrome.tabs.create({ url: vlUrl });
			}

        sendToVlist(vlUrl, vlTxts, vlVsCount, vlListCount, pageTitle);
    });
}


// The onClicked callback function for context menu.
// Sends URL to iframe on background.html page
function doBASearch(info, tab) {
    var sText = info.selectionText;
    var url = "bibleanalyzer://search+av/" + sText;
	chrome.tabs.create({ url: url });	}	


function doContextSearch(info, tab) {
    schTerm = info.selectionText;
	var results = searchBib(schTerm);
	var txtList = results[0];
	schTCount = results[1]; 
	schBookHits = results[2];
	schVCount = txtList.length;
	schTxts = txtList.join('');
	
	if (typeof chapWinId === "undefined") {
		inSearch = true;
		//createWin();
	} else {
		sendToSearch(schTerm, schTxts, schTCount, schVCount, schBookHits);
	}
	
}	


function doPanelSearch(schTerm) {
	var results = searchBib(schTerm);
	var txtList = results[0];
	schTCount = results[1]; 
	schBookHits = results[2];
	schVCount = txtList.length;
	schTxts = txtList.join('');
	
	if (typeof chapWinId === "undefined") {
		inSearch = true;
		//createWin();
	} else {
		sendToSearch(schTerm, schTxts, schTCount, schVCount, schBookHits);
	}
}	


function sendToSearch(schTerm, schTxts, schTCount, schVCount, schBookHits) {	
	chrome.tabs.query({
		windowType: 'popup',
		windowId: chapWinId
	}, function(tabs) {
	
		if (tabs.length > 0) {
			chrome.tabs.sendMessage(tabs[tabs.length -1].id, {
				from: 'contextBibSearch',
				term: schTerm,
				txts: schTxts,
				bookHits: schBookHits,
				tCnt: schTCount,
				vCnt: schVCount,
				clrTo: clrTo,
				clrFrom: clrFrom
			});
		}
	});
	
	chrome.windows.update(chapWinId, {
		"focused": true
    });
}



/*
chrome.webRequest.onBeforeRequest.addListener(function(items) { 
	//alert(items.url + ' has been disabled.'); 
	return {cancel: true}; }, {
	
		urls: [
		"*://api.reftagger.com/*", 
		"*://bible.logos.com/jsapi/*",
		"*://biblia.com/bible/*",
		"*://www.blueletterbible.org/assets/scripts/*", 
		"*://www.biblegateway.com/public/link-to-us/tooltips/*", 
		"*://labs.bible.org/api/NETBibleTagger/*",
		"*://www.esvapi.org/crossref/*",
		"*://pv/*",
		], 
		types: ["script"]
  },
		["blocking"]
);
*/

/*

//Context menu entries
chrome.contextMenus.create({
    title: "Search for \"%s\" in Bible", 
    contexts:["selection"], 
	id: "bibSearch",
    //onclick: doContextSearch,
});

function contextClick(info, tab) {
  const { menuItemId } = info

  if (menuItemId === "bibSearch") {
    doContextSearch(info);
  }
}

chrome.contextMenus.onClicked.addListener(contextClick)

*/

