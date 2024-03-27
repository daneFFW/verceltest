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
var tab = document.querySelector(".tracking-alert-box");
var consent_status = "";
var user = {};
var user_properties={};
var data = {
    "device_type": "desktop",
    "page_path": location.pathname,
    "consent_status": ""
};
var uuid = '';
var ninjaKey = 'tmbx6CYG/0EjEAnFP1dy/g==vPJNXWA30fKaUHOG'
var cookieList = document.cookie;

// clears existing user, is called off the clear user button for testing or the signed_out button
function clearUser(event) {
    if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
        localStorage.removeItem("uuid");
        localStorage.removeItem("ajs_user_id");
        localStorage.removeItem("ajs_user_traits");
        console.log("User: " + user.name + " has been cleared from localStorage");
        user = '';
        uuid = '';
    } else {
        console.log("No user to clear");
    }
    event.preventDefault();
}
;cu.addEventListener("click", clearUser);
so?.addEventListener("click", clearUser);
// fetches new user using the apiNinja 
// this is not needed past the demo
function fetchNewUser() {
    fetch('https://api.api-ninjas.com/v1/randomuser', {
        method: 'GET',
        headers: {
            'X-Api-Key': ninjaKey
        },
        contentType: 'application/json',
    }).then(response=>response.json()).then(data=>user = data).then(data=>localStorage.setItem('user', JSON.stringify(data))).catch((error)=>console.log(error));
    uuid = crypto.randomUUID();
    localStorage.setItem('uuid', uuid);
    user['user_new_user'] = "true";
    tab.insertAdjacentHTML("beforeend", `<div class="alertText"><p>Event: Fetch New User </p>
       <div>`)
    tab.lastChild.scrollIntoView(false);
    // <p>User:  ${JSON.stringify(localStorage.getItem("user"))}</p>
    // <p>UUID: ${uuid}</p>
}
;fnu.addEventListener("click", fetchNewUser);

// checks for OptanonConsent cookie if it exists returns the groups otherwise looks for the OptanonActiveGroups object and uses those values to populate groups. The cookie returns all 4 groups with :1(active) or :0(not active) after the group number while the OptanonActiveGroups only returns the groups that are active and omits the :1 and :0
// proof of concept

function checkConsent() {
    try {
        if (typeof document.cookie.split("; ").find((row)=>row.startsWith("OptanonConsent=")) !== "undefined") {
            var groupCookie = document.cookie.split("; ").find((row)=>row.startsWith("OptanonConsent="))
            console.log(typeof groupCookie)
            var decodeConsent = decodeURIComponent(groupCookie).split("&");
            console.log(decodeConsent);
            var consentGroups = decodeConsent.find((row)=>row.startsWith("groups")).split("=")
            console.log(consentGroups[1]);
            consent_status = consentGroups[1];
            data['consent_status'] = consent_status;
            user_properties['consent_status'] = consent_status;
            return consentGroups[1]
        } else if (typeof OptanonActiveGroups !== "undefined") {
            console.log("Optanon Cookie does not exist, looking for OptanonActiveGroups")
            consent_status = OptanonActiveGroups;
            data['consent_status'] = consent_status;
            user_properties['consent_status'] = consent_status;
            return OptanonActiveGroups
        } else {
            console.log("OneTrust Not Active")
            return "OneTrust Not Active"
        }
    } catch (error) {
        console.error(":" + error)
    }
}
;// looks for all data attributes of the element clicked. Returns all data attributes except event name and copies them the both the data object and user object. 
// proof of concept
function managerProperties(event, propObj1, propObj2) {
    console.log("dateProperties read")
    console.log(event)
    if (!localStorage.getItem('user') && event.dataset.event == "signed_up"|| !localStorage.getItem('user') && event.dataset.event == "signed_in") {
        fetchNewUser();
    }
    for (const prop in event.dataset) {
        if (event.dataset.hasOwnProperty(prop) && prop !== "event") {
            console.log("user_properties and track:  " + prop)
            propObj1[prop] = event.dataset[prop];
            propObj2[prop] = event.dataset[prop];
        }
    }

    propObj1['consent_status'] = consent_status;
    propObj2['consent_status'] = consent_status;
    localStorage.setItem("user_properties", JSON.stringify(user_properties));
    console.log("User Properties Passed :" + JSON.stringify(user_properties));
}
;// Eventhandler, checks consent, captures properties of the event.target, sends segment track and identify calls if consent is granted or sends a vercel hit if it is not. 
// proof of concept 
function trackHandler(event) {
    try {
        consent_status = checkConsent();
        console.log("Consent Status:" + consent_status);
        managerProperties(event.target, data, user_properties);

        if (consent_status.indexOf("C0003:1") > 0 && consent_status.indexOf("C0004:1") > 0 || consent_status.indexOf("C0003") > 0 && consent_status.indexOf("C0004") > 0 && consent_status.indexOf("C0003:0") < 0 && consent_status.indexOf("C0004:0") < 0) {
            analytics.track(event.target.dataset.event, data);
            if(localStorage.getItem("user")){
                var userInfo = JSON.parse(localStorage.getItem("user"));
                var combined_user_properties = Object.assign({},user,user_properties);
                analytics.identify(uuid, combined_user_properties);
                tab.insertAdjacentHTML("beforeend",
                `<div class="alertText"><p>Event: ${event.target.dataset.event}</p>
                 <p>User:  ${userInfo.name}; Consent Given</p>
                 <p>ConsentStatus: ${consent_status}</p>
                 <p>Segment Fired</p><div>`)
            tab.lastChild.scrollIntoView(false);
            }else{
                analytics.identify(uuid,user_properties);
                 tab.insertAdjacentHTML("beforeend",
                `<div class="alertText"><p>Event: ${event.target.dataset.event}</p>
                 <p>User: "User Not Signed In; Consent Given"</p>
                 <p>ConsentStatus: ${consent_status}</p>
                 <p>Segment Fired</p><div>`)
            tab.lastChild.scrollIntoView(false);
            }
            
           
        } else {
            !va('event', {
                "name": event.target.dataset.event,
                data
            })

            tab.insertAdjacentHTML("beforeend", `<div class="alertText"><p>Event: ${event.target.dataset.event}</p>
       <p>User: is signed out with Consent Denied</p>
       <p>ConsentStatus: ${consent_status}</p>
       <p>Vercel Fired</p><div>`)
            tab.lastChild.scrollIntoView(false);
        }
    } catch (error) {
        console.error("Error: " + error)
    }
}

var trackCalls = document.querySelectorAll('.trackCall');
trackCalls.forEach((trackCall)=>{
    trackCall.addEventListener('click', trackHandler)
}
)

document.onreadystatechange = ()=>{
    if (document.readyState === "complete") {
        consent_status = checkConsent();
        if (consent_status.indexOf("C0003:1") > 0 && consent_status.indexOf("C0004:1") > 0 || consent_status.indexOf("C0003") > 0 && consent_status.indexOf("C0004") > 0 && consent_status.indexOf("C0003:0") < 0 && consent_status.indexOf("C0004:0") < 0) {
            analytics.page(document.title, {
                "consent_status": checkConsent()
            });
            console.log("DOM fully loaded and parsed Segment Pageview Called");
        } else {
            console.log("DOM fully loaded and parsed Consent Not Given Segment Page Not Called");
        }
    }
}
;
