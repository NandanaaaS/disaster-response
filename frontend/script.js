let latitude = null;
let longitude = null;
let trackingInterval = null;
let statusInterval = null;
let currentRequestId = null;

/* =========================
   LIVE GPS TRACKING
   ========================= */

navigator.geolocation.watchPosition(
(pos)=>{
latitude = pos.coords.latitude;
longitude = pos.coords.longitude;

const status = document.getElementById("status");
if(status){
status.innerText =
"Location: "+latitude.toFixed(4)+", "+longitude.toFixed(4);
}
},
()=>{
document.getElementById("status").innerText =
"Location access denied ❌";
},
{
enableHighAccuracy:true,
maximumAge:0,
timeout:5000
}
);

/* =========================
   SAVE LOCATION BUTTON
   ========================= */

function saveLocation(){
if(latitude && longitude){
localStorage.setItem("savedLat",latitude);
localStorage.setItem("savedLng",longitude);
document.getElementById("status").innerText=
"Location saved to map ✔";
}else{
document.getElementById("status").innerText=
"Waiting for GPS signal...";
}
}

/* =========================
   FORM SUBMIT
   ========================= */

const form=document.getElementById("helpForm");

if(form){
form.addEventListener("submit", async(e)=>{
e.preventDefault();

if(!latitude || !longitude){
alert("Waiting for GPS location...");
return;
}

const requestId=Date.now().toString();
currentRequestId=requestId;

const data={
id:requestId,
type:document.getElementById("type").value,
description:document.getElementById("desc").value || "No description",
gender:document.getElementById("gender").value,
age:document.getElementById("age").value,
pregnant:document.getElementById("pregnant")?.value || "No",
lat:latitude,
lng:longitude,
status:"Pending"
};

document.getElementById("status").innerText="Sending request...";

try{
await fetch("http://localhost:5000/requests",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify(data)
});
}catch{}

document.getElementById("status").innerText=
"Request Sent! ID: "+requestId;

startLiveTracking();
checkStatusLoop();
});
}

/* =========================
   LIVE TRACKING LOOP
   ========================= */

function startLiveTracking(){

if(trackingInterval) clearInterval(trackingInterval);

trackingInterval=setInterval(async()=>{

if(!latitude || !longitude || !currentRequestId) return;

try{
await fetch("http://localhost:5000/location",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({
id:currentRequestId,
lat:latitude,
lng:longitude
})
});
}catch{}

},5000);
}

/* =========================
   STATUS CHECK LOOP
   ========================= */

function checkStatusLoop(){

if(statusInterval) clearInterval(statusInterval);

statusInterval=setInterval(async()=>{

if(!currentRequestId) return;

try{
const res=await fetch(
`http://localhost:5000/status/${currentRequestId}`
);

const data=await res.json();
const el=document.getElementById("requestStatus");

el.innerText="Status: "+data.status;

if(data.status==="Pending") el.style.color="orange";
if(data.status==="In Progress") el.style.color="blue";
if(data.status==="Resolved"){
el.style.color="green";
clearInterval(trackingInterval);
clearInterval(statusInterval);
}

}catch{}

},3000);
}

/* =========================
   SAFETY CHECK EVERY 5 MIN
   ========================= */

setInterval(async()=>{

if(!currentRequestId) return;

const result=confirm(
"Are you still in danger?\nOK = YES\nCancel = NO"
);

if(result===false){

clearInterval(trackingInterval);
clearInterval(statusInterval);

document.getElementById("status").innerText=
"Marked safe. Tracking stopped.";

try{
await fetch("http://localhost:5000/resolve",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({ id:currentRequestId })
});
}catch{}

currentRequestId=null;
}

},300000);