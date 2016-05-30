// JavaScript Document
// device APIs are available 
function onDeviceReady() { 
document.addEventListener("pause", onPause, false); 
document.addEventListener("resume", onResume, false); 
} 

// Handle the pause event 
function onPause() { 
$('#videoSrc').attr('src', ''); //STOP YouTube Playing 
document.addEventListener("resume", onResume, false); 
} 

// Handle the Resume event 
function onResume() { 
onDeviceReady(); 
} 