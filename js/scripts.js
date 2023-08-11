
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



function segmentTrack() {
    // Replace this with your own track call
    analytics.track("Newsletter Signup",{
      email: 'jon@doe.com',
      type: 'header'
    });
    alert("newsletter track call sent");
  }
  
  function segmentIdentify() {
    // Replace this with your own identify call
    analytics.identify('user123', {
      email: 'user@example.com',
      name: 'John Doe'
    });
  }
  
  function segmentGroup() {
    // Replace this with your own group call
    analytics.group('account123', {
      name: 'Acme Co.'
    });
  }

// nl.addEventListener("click",segmentTrack(), false);
// gd.addEventListener("click", function(){alert("click2 triggered")}, false);
// su.addEventListener("click", function(){alert("click2 triggered")}, false);
// si.addEventListener("click", function(){alert("click2 triggered")}, false);
// so.addEventListener("click", function(){alert("click2 triggered")}, false);
// ts.addEventListener("click", function(){alert("click2 triggered")}, false);
// te.addEventListener("click", function(){alert("click2 triggered")}, false);
// pc.addEventListener("click", function(){alert("click2 triggered")}, false);
// ec.addEventListener("click", function(){alert("click2 triggered")}, false);


// Set up the API endpoint and parameters
// const apiEndpoint = 'https://api.namefake.com/english-united-states/random/';

// Set up the event names
const eventNames = [
  'Newsletter Signed Up',
  'Guide Downloaded',
  'Signed Up',
  'Signed In',
  'Signed Out',
  'Trial Started',
  'Trial Ended',
  'Phone Contact',
  'Email Contact'
];

// Get the track call buttons and add event listeners to them
// var trackCalls = document.querySelectorAll('.trackCall');
// trackCalls.forEach(trackCall => 
//   trackCall.addEventListener('click', () =>{
//     // Hit the Fake Name Generator API and generate Segment calls for each fake person and event
//     fetch('./js/users.json',{
//     })
//       .then(response => response.json())
//       .then(json => {
//         console.log(json)
//       })
//           // Generate an identify call for the person
          
//           // var nameSplit = data.name.split(' ');

//                  // Generate a track call for the clicked event
//         analytics.track(trackCall.value);

//         alert("track call sent" + trackCall.value);

//         // analytics.identify ( person.uuid, {
//         //     first_name: nameSplit[0],
//         //     last_name: nameSplit[1],
//         //     email: data.email,
//         //     phone: data.phone,
//         //     username: data.username
//         //   })

//       })
//       );

// Get the track call buttons and add event listeners to them first iteration
// This kinda messes with the identify call since it is returning a new user for each button click. 
// while this in essense generates alot of unique identify calls and populates the user db in segment it does not adhere to their standard


// var trackCalls = document.querySelectorAll('.trackCall');
// trackCalls.forEach(trackCall => 
//   trackCall.addEventListener('click', () =>{
//     var uuid =crypto.randomUUID();
//     console.log("Begin Script: " +uuid);
//         // Generate a dataLayer push  for the clicked event
//         fetch('https://api.api-ninjas.com/v1/randomuser',{
//           method: 'GET',
//           headers: { 'X-Api-Key': 'kXmutCVMgRC2Sx9HlF6dFg==Doskfk1Pi10KRkRg'},
//           contentType: 'application/json',
//       })
//       .then(response => response.json())
//       .then(data =>{ dataLayer.push({
//         "event": trackCall.value,
//         "username":data.username,
//         "name":data.name,
//         "email":data.email,
//         "userID":uuid
//       })
//       if (trackCall.value ==="Newsletter Signed Up"){
//         console.log("Newsletter: "+ uuid);
//         analytics.track(trackCall.value,{
//           "newsletter status": "subscribed",
//           "device type": "desktop",
//           "location":"TX",
//           "page path": location.pathname
//         });
//         analytics.identify(uuid,{
//           "email":data.email,
//           "name":data.name,
//           "newsletter status":"subscribed",
//         })
//       }else{
//         console.log("Others: " + uuid);
//         analytics.track(trackCall.value);
//         analytics.identify(uuid,{
//           "email":data.email,
//           "name":data.name
//         })
//       }

//         console.log("End of Script: "+uuid);
//         console.log(data);
//         alert("dataLayer push for button: " + trackCall.value + "\n" + "response: " + JSON.stringify(data))
//        })
//       })
//       );

//I am attempting to call the fetch for randomuser once per page, store the output and use it in all subsequent calls.
var user = {}
//kXmutCVMgRC2Sx9HlF6dFg==Doskfk1Pi10KRkRg
var ninjaKey = 'tmbx6CYG/0EjEAnFP1dy/g==vPJNXWA30fKaUHOG'
fetch('https://api.api-ninjas.com/v1/randomuser',{
  method: 'GET',
  headers: { 'X-Api-Key': ninjaKey},
  contentType: 'application/json',
})
.then(response => response.json())
.then(data =>  user = data)
.catch((error)=>console.log(error));
var uuid = crypto.randomUUID();

var trackCalls = document.querySelectorAll('.trackCall');
trackCalls.forEach(trackCall => 
  trackCall.addEventListener('click', () =>{
        // Generate a dataLayer push  for the clicked event
        function consentGroups(){
          if(OptanonActiveGroups.includes('C0003')&&OptanonActiveGroups.includes('C0004') ){
                 return consentStatus= "granted"; 
          }else{
              return consentStatus = "denied";
          }    
          }
      dataLayer.push({
        "event": trackCall.value,
        "username":user.username,
        "name":user.name,
        "email":user.email,
        "userID":uuid,
        "consentstatus":consentGroups()
      })

      if (trackCall.value ==="Newsletter Signed Up"){
        analytics.track(trackCall.value,{
          "newsletterStatus": "subscribed",
          "deviceType": "desktop",
          "location":"TX",
          "pagePath": location.pathname,
          "consentStatus": consentGroups()
        });
        analytics.identify({
          "email":user.email,
          "name":user.name,
          "newsletterStatus":"subscribed",
        })
      }else if (trackCall.value === "Signed Up"|trackCall.value === "Signed In"|trackCall.value === "Signed Out"){
        analytics.track(trackCall.value,{
          "loggedIn": trackCall.value,
          "newUser": (trackCall.value === "Signed Up")? "true": "false",
          "deviceType": "desktop",
          "location":"TX",
          "pagePath": location.pathname,
          "consentStatus": consentGroups()
        });
        analytics.identify(uuid,{
          "email":user.email,
          "name":user.name,
          "username":user.username
        })
      } else{
        analytics.track(trackCall.value);
        analytics.identify(uuid,{
          "email":user.email,
          "name":user.name
        })
      }
        alert("dataLayer push for button: " + trackCall.value + "\n" + "response: " + JSON.stringify(user))
       })
      );

// var productList = document.querySelectorAll('.producList');
// products.forEach(product =>
//   fetch('https://api.api-ninjas.com/v1/randomimage?category='+product.value,+"&width=100&height=100"{
//     method: 'GET',
//     headers: { 'X-Api-Key': 'kXmutCVMgRC2Sx9HlF6dFg==Doskfk1Pi10KRkRg','Accept':'image/jpg'},
//     contentType: 'application/json',
// })
// .then(response =>{
//   console.log(response)
// } )
  
//   )
