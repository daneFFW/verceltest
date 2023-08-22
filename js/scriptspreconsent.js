
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
var data ={
  "device_type": "desktop",
  "location":"TX",
  "page_path": location.pathname,
  "consent_status":""
};
var uuid = '';
var ninjaKey = 'tmbx6CYG/0EjEAnFP1dy/g==vPJNXWA30fKaUHOG'
var cookieList = document.cookie;

// clears existing user, is called off the clear user button for testing or the signed_out button
function clearUser(event) {
   if(localStorage.getItem("user")){
    localStorage.removeItem("user");
    localStorage.removeItem("uuid");
    localStorage.removeItem("ajs_user_id");
    localStorage.removeItem("ajs_user_traits");
    console.log("User: " + user.name + " has been cleared from localStorage");
    user = '';
    uuid = '';
  } else{
    console.log("No user to clear");
    }
    event.preventDefault();
  };

cu.addEventListener("click",clearUser);
if(so){so.addEventListener("click", clearUser);}
// fetches new user using the apiNinja 

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
    user['user_new_user'] = "true";
    alert("Event: Fetch New User "+  "\n" + "User: " + JSON.stringify(localStorage.getItem("user")) + "\n" + "UUID: " + uuid)
  };

fnu.addEventListener("click",fetchNewUser);

// checks to see if user is in local storage if so then returns the event and populates the var otherwisel fetches it from the api
if (localStorage.getItem('user')){
user = JSON.parse(localStorage.getItem('user'))
uuid = localStorage.getItem('uuid')
}else{
  fetchNewUser();
}

function checkConsent(){
  try {
    // calls the cookie object and looks to make sure the OptanonConsent cookie is defined before proceeding 
  if(typeof document.cookie.split("; ").find((row) => row.startsWith("OptanonConsent=")) !== "undefined"){
      var groupCookie = document.cookie.split("; ").find((row) => row.startsWith("OptanonConsent="))
      console.log(typeof groupCookie)
      // converts the coded cookie into a regular string
      var decodeConsent = decodeURIComponent(groupCookie).split("&");
      console.log(decodeConsent);
      // looks for the group key and extracts its value
      var consentGroups = decodeConsent.find((row)=> row.startsWith("groups")).split("=")
      console.log(consentGroups[1]);
      // updates consent_status to the value of the group key
      consent_status = consentGroups[1];
      // updates both data and user objects
      data['consent_status'] = consent_status;
      user['consent_status'] = consent_status;
      // returns the value to whatever called the function
      return consentGroups[1]
  }
  // if the cookie doesn't exist, this looks to make sure the OptanonActiveGroups object exists
  else if(typeof OptanonActiveGroups !== "undefined"){
      console.log("Optanon Cookie does not exist, looking for OptanonActiveGroups")
      // passes the objects value to the consent_status, data and user objects
      consent_status = OptanonActiveGroups;
      data['consent_status'] = consent_status;
      user['consent_status'] = consent_status;
            // returns the value to whatever called the function

      return OptanonActiveGroups
  }
  else{
    console.log("OneTrust Not Active")
  return "OneTrust Not Active"
  }} 
  catch (error) {
      console.error(":" + error)
  }
};


// looks for all data attributes of the element clicked. Returns all data attributes except event name and copies them the both the data object and user object. 

function managerProperties(event, propObj1, propObj2){
  console.log("dateProperties read")
  // looks for the user object and if the event is not signed_out and populates a new user if they both are true
  if (!localStorage.getItem('user')&& event != "signed_out"){
    fetchNewUser();
  }
// this does the looping through the data attributes and setting the keyvalue pairs to the user data objects passed in the function call.
  for (const prop in event.dataset){
    if(event.dataset.hasOwnProperty(prop) && prop !== "event"){
     console.log("user and track:  " + prop)
     propObj1[prop]=event.dataset[prop];
    propObj2[prop]=event.dataset[prop];
    }
}
// makes sure that the consent parameter of the objects is current.
propObj1['consent_status'] = consent_status;
propObj2['consent_status'] = consent_status;
// updates local storage with the most current version of user object.
localStorage.setItem("user", JSON.stringify(user));
console.log("User Properties passed to User " +JSON.stringify(user));
};

// Eventhandler, checks consent, captures properties of the event.target, sends segment track and identify calls if consent is granted or sends a vercel hit if it is not. 
function trackHandler(event){
try { 
  // checks current consent state
  consent_status = checkConsent();
  console.log("Consent Status:" + consent_status);
  // checks for the data attributes of the element clicked and populates user and data object 
  managerProperties(event.target, data, user);
  // calls segment track and identify 
  analytics.track(event.target.dataset.event,data)
  // need to add check to make sure that uuid and user exists before sending the identify call
  analytics.identify(uuid,user)
  alert("Event: " + event.target.dataset.event + "\n" + "User: " + JSON.stringify(user.name) + "\n" + "ConsentStatus:" + consent_status + "\n" + "Segment Fired")
} catch (error) {
  console.error("Error: " + error)
}

}
// loops through and connects the trackHandler function to anything with .trackCall in the class list
var trackCalls = document.querySelectorAll('.trackCall');
trackCalls.forEach((trackCall) => {
  trackCall.addEventListener('click', trackHandler)
})

// looks for the document to be loaded and then sends the segment page hit
document.onreadystatechange = () => {
  if(document.readyState=== "complete"){
    analytics.page("home",{"consent_status":checkConsent()});
    console.log("DOM fully loaded and parsed Segment Pageview Called");
}};

