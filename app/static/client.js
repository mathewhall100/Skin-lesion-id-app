var loc = window.location;
const HOSTURL = `${loc.protocol}//${loc.hostname}:${loc.port}`
var el = x => document.getElementById(x);

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
  el("analyze").style.display = "block";
  el("result").style.display = "none";
}

function analyze() {
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a file to analyze!");

  el("analyze-button").innerHTML = "Analyzing...";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `${HOSTURL}/predict`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var result = '';
      el("analyze").style.display = 'none';
      el("result").style.display = 'block';
      var response = JSON.parse(e.target.responseText);
      if (response['result'] === '1') {
        result = "malignant melanoma"
        el("result-label").style.color = 'red';
      } else if (response['result'] === '0') {
        result = 'benign nevus'
        el("result-label").style.color = 'green';
      } else {
        result = "unknown"
        el("result-label").style.color = '#333';
      }
      el("result-label").innerHTML = `${result}`;
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

function termsChecked() {
  var vis = 0.5;
  var events = 'none'
  var chbox = el("termscheck"); 
  if(chbox.checked){
       vis = 1;
       events = 'auto'
      }
  el("start-btn").style.opacity = vis;
  el("btn-center").style.pointerEvents = events;
}



