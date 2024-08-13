function fixBook(bk) {

     var bookDict = {
         "1 ?Jo": "1Jo",
         "2 ?Jo": "2Jo",
         "3 ?Jo": "3Jo",
         "1 ?Jn": "1Jo",
         "2 ?Jn": "2Jo",
         "3 ?Jn": "3Jo",
         "Ge": "Gen",
         "Ex": "Exo",
         "Le": "Lev",
         "Nu": "Num",
         "De": "Deu",
         "Jos": "Jos",
         "Judg": "Jdg",
		 "Jg": "Jdg",
         "Ru": "Rth",
         "1 ?Sa": "1Sa",
         "2 ?Sa": "2Sa",
         "1 ?Ki": "1Ki",
         "2 ?Ki": "2Ki",
         "1 ?Ch": "1Ch",
         "2 ?Ch": "2Ch",
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
         "1 ?Co": "1Co",
         "2 ?Co": "2Co",
         "Ga": "Gal",
         "Ep": "Eph",
         "Phi": "Phi",
         "Php": "Phi",
         "Col": "Col",
         "1 ?Th": "1Th",
         "2 ?Th": "2Th",
         "1 ?Ti": "1Ti",
         "2 ?Ti": "2Ti",
         "Tit": "Tit",
         "He": "Heb",
         "Ja": "Jam",
         "1 ?Pe": "1Pe",
         "2 ?Pe": "2Pe",
         "Jud": "Jud",
         "Re": "Rev",
         "Mt": "Mat",
         "Mk": "Mar",
         "Lk": "Luk",
         "Jn": "Joh",
         "Jas": "Jam",
         "1I ?Kgs": "1Ki",
         "2 ?Kgs": "2Ki",
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
        var patt = new RegExp('^' + b + "\\w*", "i");
        if (patt.test(bk)) {
            return bookDict[b];
        }
    }
    return false;
}

//var background = chrome.extension.getBackgroundPage();


function onIconEntry(e) {
	
	e = e || window.event;
	e.preventDefault();
	
    var entry = document.getElementById('iconEntry').value.trim();
	if (!entry) {
		entry = 'Gen 1'
	}

	if (! /\d/.test(entry)) {
		chrome.runtime.sendMessage({
			from: 'panelSearch',
			term: entry,
		});
		return;
	} 
	
	doRefLookup(entry);
}


function onRefEntry(e) {
	
	e = e || window.event;
	e.preventDefault();
	
    var refEntry = document.getElementById('refEntry').value.trim();
	if (!refEntry) {
		console.log('No entry'); 
		return;
	}
	
	doRefLookup(refEntry);
}
	
	
function doRefLookup(refEntry) {

    refEntry = refEntry.replace(/([a-z])(\d)/, "$1 $2")

    if (/^\w+$/.exec(refEntry)) {
        refEntry = refEntry + ' 1';
    }

    //background.console.log(refEntry + 'refEntry');

    try {
        var patt = /((?:1|2|3|II?I?)?\s?\w+)\.?\s?(\d+)(?:[:.v] ?(.+))?/;
        var result = patt.exec(refEntry);
        var ch = result[2]
        var bk = result[1].replace(' ', '');
        var vs = result[3];
        //background.console.log(ch+vs);
    } catch (err) {
        chrome.runtime.sendMessage({
            from: 'error',
            type: 'ref',
            entry: refEntry
        });
        return
    }
    
	//background.console.log(bk + 'bk');
    
	bk = bk.replace(/III/, '3');
    bk = bk.replace(/II/, '2');
    bk = bk.replace(/I\b/, '1');
    bk = fixBook(bk);

    if (bk === false) {
        chrome.runtime.sendMessage({
            from: 'error',
            type: 'ref',
            entry: refEntry
        });
        return
    }

    var chap = bk + ' ' + ch + ':';
    var baRef = chap + vs;

    if (typeof vs === 'undefined') {
        vs = ''
    }

    chrome.runtime.sendMessage({
        from: 'page',
        chapter: chap,
        verses: vs,
        book: bk,
        chapInt: ch
    });
}
