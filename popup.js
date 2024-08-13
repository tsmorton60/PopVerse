

function doIconEntry() {
	onIconEntry();
	window.close();
}

function checkEnable() {
	var isEnabled = document.getElementById('enableChk').checked;
	chrome.runtime.sendMessage({msg: "setEnableState", state: isEnabled});
	
	if (isEnabled === true) {
		chrome.action.setIcon({path: "icon19.png"});
	}
	else {
		chrome.action.setIcon({path: "icon19dis.png"});
	}
	
	chrome.tabs.query({active: true, currentWindow: true}, function (Tabs) {
	chrome.tabs.reload(Tabs[0].id);
	});	
}
	
	document.addEventListener('DOMContentLoaded', function() {
		document.getElementById('onIconGo').addEventListener('click', doIconEntry);
		document.getElementById('iconEntry').focus();
	
		chrome.storage.local.get({enableState: true}, function(items) {
				document.getElementById('enableChk').checked = items.enableState;
		});
	})



function saveBibOptions() {
	var radios = document.getElementsByName('bib1');
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			chrome.storage.local.set({currentBib: radios[i].value});
			chrome.runtime.sendMessage({from: 'currBib', bib: radios[i].value})
			break;
		}
	}
}

function restoreBib() {
  chrome.storage.local.get({
	currentBib: 0,
	}, function(items) {
		document.bibGrp.bib1[items.currentBib].checked = true;
  });
}


document.getElementsByName('bibGrp')[0].addEventListener('change', saveBibOptions);
document.addEventListener('DOMContentLoaded', restoreBib);

document.getElementById('enableChk').addEventListener('change', checkEnable);


