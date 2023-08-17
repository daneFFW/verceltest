
var trackCallList = document.getElementById("trackCallList");
var nl = document.getElementById("nl");
var gd = document.getElementById("gd");
var su = document.getElementById("su");
var si = document.getElementById("si");
var so = document.getElementById("so");
var ts = document.getElementById("ts");
var te = document.getElementById("te");
var pc = document.getElementById("pc");
var ec = document.getElementById("ec");
var cu = document.getElementById("cu");
var fnu = document.getElementById("fnu");
var user = {};
var uuid = '';
var ninjaKey = 'tmbx6CYG/0EjEAnFP1dy/g==vPJNXWA30fKaUHOG'
var cookieList = document.cookie
//reusable functions

function segmentTrack() {
    // Replace this with your own track call
    analytics.track("Newsletter Signup",{
      email: 'jon@doe.com',
      type: 'header'
    });
    alert("newsletter track call sent");
  };
  
  function segmentIdentify() {
    // Replace this with your own identify call
    analytics.identify('user123', {
      email: 'user@example.com',
      name: 'John Doe'
    });
  };
  
function segmentGroup() {
    // Replace this with your own group call
    analytics.group('account123', {
      name: 'Acme Co.'
    });
  };

function clearUser() {
   if(localStorage.getItem("user")){
    localStorage.removeItem("user");
    localStorage.removeItem("uuid");
    console.log("User: " + user.name + " has been cleared from localStorage");
  } else{
    console.log("No user to clear");
    }
  };

function fetchNewUser(){
    fetch('https://api.api-ninjas.com/v1/randomuser',{
      method: 'GET',
      headers: { 'X-Api-Key': ninjaKey},
      contentType: 'application/json',
    })
    .then(response => response.json())
    .then(data =>  user = data)
    .then(data =>  localStorage.setItem('user',JSON.stringify(data)))
    .catch((error)=>console.log(error));
    uuid = crypto.randomUUID();
    localStorage.setItem('uuid',uuid);
    alert("Event: Fetch New User "+  "\n" + "User: " + JSON.stringify(localStorage.getItem("user")) + "\n" + "UUID: " + uuid)

  }

cu.addEventListener("click",clearUser);
fnu.addEventListener("click",fetchNewUser);



// Set up the API endpoint and parameters
// const apiEndpoint = 'https://api.namefake.com/english-united-states/random/';

// checks to see if user is in local storage if so then returns the value and populates the var otherwisel fetches it from the api
if (localStorage.getItem('user')){
user = JSON.parse(localStorage.getItem('user'))
uuid = localStorage.getItem('uuid')
}else{
  fetchNewUser();
}

// checks for OptanonConsent cookie if it exists returns the groups otherwise looks for the OptanonActiveGroups object and uses those values to populate groups. The cookie returns all 4 groups with :1(active) or :0(not active) after the group number while the OptanonActiveGroups only returns the groups that are active and omits the :1 and :0

function checkConsent(){
  try {
  if(typeof document.cookie.split("; ").find((row) => row.startsWith("OptanonConsent=")) !== "undefined"){
      var groupCookie = document.cookie.split("; ").find((row) => row.startsWith("OptanonConsent="))
      console.log(typeof groupCookie)
      var decodeConsent = decodeURIComponent(groupCookie).split("&");
      console.log(decodeConsent);
      var consentGroups = decodeConsent.find((row)=> row.startsWith("groups")).split("=")
      console.log(consentGroups[1]);
      return consentGroups[1]
  }
  else if(typeof OptanonActiveGroups !== "undefined"){
      console.log("Optanon Cookie does not exist, looking for OptanonActiveGroups")
      return OptanonActiveGroups}
  else{
  return "OneTrust Not Active"
  }} 
  catch (error) {
      console.error(":" + error)
  }
}
// Eventhandler, checks consent, captures properties of the event.target, sends segment track and identify calls if consent is granted or sends a vercel hit if it is not. 
function trackHandler(event){
  var consent = checkConsent();
  console.log("Consent Status:" + consent);
  var properties = {
    "trackCall":{
          "newsletter_status": (event.target.dataset.value === "newsletter_signed_up")? "subscribed": "",
          "device_type": "desktop",
          "location":"TX",
          "page_path": location.pathname,
          "consent_status": consent,
          "logged_in": event.target.dataset.value,
          "new_user": (event.target.dataset.value === "signed_up")? "true": "false",
          "product_name":event.target.dataset.properties,
        },
    "identifyCall":{
      "email":user.email,
      "name":user.name,
      "newsletter_status":(event.target.dataset.value === "newsletter_signed_up")? "subscribed": "",
      "consent_status": consent
    }
  };
  var trackProperties = properties.trackCall;
  var identifyProperties = properties.identifyCall;
try {
  if(typeof consent !== "undefined" && consent.includes("C0004:1,C0003:1")|typeof consent !== "undefined" &&consent.includes("C0004,C0003")){
    analytics.track(event.target.dataset.value,{
     trackProperties
    })
    analytics.identify({
      identifyProperties
    })

    alert("Event: " + event.target.dataset.value + "\n" + "User: " + JSON.stringify(user.name) + "\n" + "ConsentStatus:" + consent + "\n" + "Segment Fired")

}else if(typeof va === "function"){
va('event',{
"name":event.target.dataset.value,
"data":{
  "new_user": (event.target.dataset.value === "signed_up")? "true": "false",
  "product_name":event.target.dataset.properties
}})

alert("Event: " + event.target.dataset.value + "\n" + "User: " + JSON.stringify(user.name) + "\n" + "ConsentStatus:" + consent + "\n" + "Vercel Fired")
}
} catch (error) {
  console.error("Error: " + error)
}

}

var trackCalls = document.querySelectorAll('.trackCall');
trackCalls.forEach((trackCall) => {
  trackCall.addEventListener('click', trackHandler)
})

analytics.page("home",{"consent_status":checkConsent()});