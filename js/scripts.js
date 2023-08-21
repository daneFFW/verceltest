
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
var consent_status = "";
var user = {};
var identify_properties = {
};
var data ={
  "device_type": "desktop",
  "location":"TX",
  "page_path": location.pathname,
  "consent_status":""
};
var uuid = '';
var ninjaKey = 'tmbx6CYG/0EjEAnFP1dy/g==vPJNXWA30fKaUHOG'
var cookieList = document.cookie;

//reusable functions


function clearUser() {
   if(localStorage.getItem("user")){
    localStorage.removeItem("user");
    localStorage.removeItem("uuid");
    localStorage.removeItem("ajs_user_id");
    localStorage.removeItem("ajs_user_traits");
    console.log("User: " + user.name + " has been cleared from localStorage");
    user = '';
    uuid = '';
    identify_properties = "";
  } else{
    console.log("No user to clear");
    }
  };

function fetchNewUser(){
    user = '';
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
    user['user_new_user'] = "true";
    alert("Event: Fetch New User "+  "\n" + "User: " + JSON.stringify(localStorage.getItem("user")) + "\n" + "UUID: " + uuid)
  };

cu.addEventListener("click",clearUser);
fnu.addEventListener("click",fetchNewUser);



// Set up the API endpoint and parameters
// const apiEndpoint = 'https://api.namefake.com/english-united-states/random/';

// checks to see if user is in local storage if so then returns the value and populates the var otherwisel fetches it from the api


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
      consent_status = consentGroups[1];
      data['consent_status'] = consent_status;
      user['consent_status'] = consent_status;
      return consentGroups[1]
  }
  else if(typeof OptanonActiveGroups !== "undefined"){
      console.log("Optanon Cookie does not exist, looking for OptanonActiveGroups")
      consent_status = OptanonActiveGroups;
      data['consent_status'] = consent_status;
      user['consent_status'] = consent_status;
      return OptanonActiveGroups}
  else{
    console.log("OneTrust Not Active")
  return "OneTrust Not Active"
  }} 
  catch (error) {
      console.error(":" + error)
  }
};

function managerProperties(event){
  console.log("dateProperties read")
  for (const prop in event.dataset){
    if(event.dataset.hasOwnProperty(prop) && prop !== "event"){
     console.log("user and track:  " + prop)
     data[prop]=event.dataset[prop];
    user[prop]=event.dataset[prop];
    }
}
localStorage.setItem("user", JSON.stringify(user));
console.log("User Updated");
data['consent_status'] = consent_status;
user['consent_status'] = consent_status;
 
for (const prop in user){
 if(prop !== "address" | prop !== "birthday" | prop !== "sex")
 identify_properties[prop]=user[prop];
}
console.log("User Properties passed to identify_properties object: " +JSON.stringify(identify_properties));
};
// if (localStorage.getItem('user')){
//   user = JSON.parse(localStorage.getItem('user'))
//   uuid = localStorage.getItem('uuid')
//   }else{
//     fetchNewUser();
//   }
// Eventhandler, checks consent, captures properties of the event.target, sends segment track and identify calls if consent is granted or sends a vercel hit if it is not. 
function trackHandler(event){
  consent_status = checkConsent();
  console.log("Consent Status:" + consent_status);

try {
  if(consent_status.includes("C0004:1,C0003:1")|consent_status.includes("C0004,C0003")){
    managerProperties(event.target);
    analytics.track(event.target.dataset.event,data)
    analytics.identify(uuid,identify_properties)

    alert("Event: " + event.target.dataset.event + "\n" + "User: " + JSON.stringify(user.name) + "\n" + "ConsentStatus:" + consent_status + "\n" + "Segment Fired")

}else if(typeof va === "function"){
  managerProperties(event.target);
va('event',{
"name":event.target.dataset.event,
data})

alert("Event: " + event.target.dataset.event + "\n" + "User: " + JSON.stringify(user.name) + "\n" + "ConsentStatus:" + consent_status + "\n" + "Vercel Fired")
}
} catch (error) {
  console.error("Error: " + error)
}

}

var trackCalls = document.querySelectorAll('.trackCall');
trackCalls.forEach((trackCall) => {
  trackCall.addEventListener('click', trackHandler)
})



document.onreadystatechange = () => {
  if(document.readyState=== "complete"){
    consent_status = checkConsent();
  if(consent_status.includes("C0004:1,C0003:1")|consent_status.includes("C0004,C0003")){
  analytics.page("home",{"consent_status":checkConsent()});
  console.log("DOM fully loaded and parsed Segment Pageview Called");
}else{
  clearUser();
  console.log("DOM fully loaded and parsed Consent Not Given Segment Page Not Called");
}}};