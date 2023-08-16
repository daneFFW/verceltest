
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

function analyticsTrackCall(){ 
  
if(OptanonActiveGroups.includes("C0004,C0003")){  
      if (trackCall.dataset.value ==="newsletter_signed_up"){
        analytics.track(trackCall.dataset.value,{
          "newsletterStatus": "subscribed",
          "deviceType": "desktop",
          "location":"TX",
          "pagePath": location.pathname,
          "consentStatus": OptanonActiveGroups
        });
        analytics.identify({
          "email":user.email,
          "name":user.name,
          "newsletterStatus":"subscribed",
          "consentStatus": OptanonActiveGroups
        })
      }else if (trackCall.dataset.value === "signed_up"|trackCall.dataset.value === "signed_in"|trackCall.dataset.value === "signed_out"){
        analytics.track(trackCall.dataset.value,{
          "loggedIn": trackCall.dataset.value,
          "newUser": (trackCall.value === "Signed Up")? "true": "false",
          "deviceType": "desktop",
          "location":"TX",
          "pagePath": location.pathname,
          "consentStatus": OptanonActiveGroups
        });
        analytics.identify(uuid,{
          "email":user.email,
          "name":user.name,
          "username":user.username,
          "consentStatus": OptanonActiveGroups
        })
      } else{
        analytics.track(trackCall.dataset.value,{
          "pagePath": location.pathname,
          "deviceType": "desktop",
          "consentStatus": OptanonActiveGroups
        });
        analytics.identify(uuid,{
          "email":user.email,
          "name":user.name,
          "consentStatus": OptanonActiveGroups
        })
      }
        alert("Event: " + trackCall.dataset.value + "\n" + "User: " + JSON.stringify(user.name) + "\n" + "UUID: " + uuid)
}else{
  va(trackCall.dataset.value);
};

};

var trackCalls = document.querySelectorAll('.trackCall');
trackCalls.forEach((trackCall) => {
  trackCall.addEventListener('click', analyticsTrackCall(trackCall))})