// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIOvd62WRT3V_SimVEQCrEvctIHrhXdqU",
    authDomain: "garden-80ba6.firebaseapp.com",
    databaseURL: "https://garden-80ba6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "garden-80ba6",
    storageBucket: "garden-80ba6.appspot.com",
    messagingSenderId: "574844418847",
    appId: "1:574844418847:web:346ad396c04990d3934e2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
  // Lay du lieu tu firebase
const database = getDatabase(app);
const temperature = ref(database, "Temperature");
const moisture = ref(database, "Moisture");
const humidity = ref(database, "Humidity");
const hose = ref(database, "Hose");

// Kiểm tra độ ẩm để mở vòi
var Moisture = null;
var selectedMoisture = 0;
var compareMoisture = -1;
var c = true;

var temperature_value = [];
var temperature_time = [];

var moisture_value = [];
var moisture_time = [];

var humidity_value = [];
var humidity_time = [];

console.log(app);

onValue(temperature, (snapshot) => { // doc du lieu khi percent co su thay doi
    var time = new Date();
    var gio = time.getHours();
    var phut = time.getMinutes();
    var giay = time.getSeconds();
    if (gio < 10) 
        gio = "0" + gio;
    if (phut < 10) 
        phut = "0" + phut;
    if (giay < 10) 
        giay = "0" + giay;
    const data = snapshot.val();
    console.log(data);
    document.getElementById("nhietdo").innerHTML = data + " C";
    
    if(temperature_time.length == 12){
        temperature_value = temperature_value.slice(1);
        temperature_value.push(data);
        temperature_time = temperature_time.slice(1);
        temperature_time.push(gio + ":" + phut + ":" + giay);
    }
    else{
        temperature_value.push(data);
        temperature_time.push(gio + ":" + phut + ":" + giay);
    }
    
    console.log(temperature_value);
    console.log(temperature_time);
});

onValue(moisture, (snapshot) => { // doc du lieu khi percent co su thay doi
    var time = new Date();
    var gio = time.getHours();
    var phut = time.getMinutes();
    var giay = time.getSeconds();
    if (gio < 10) 
        gio = "0" + gio;
    if (phut < 10) 
        phut = "0" + phut;
    if (giay < 10) 
        giay = "0" + giay;

    const data = snapshot.val();
    console.log(data);
    document.getElementById("doamdat").innerHTML = "   " + data + " %";
    compareMoisture = Number(data);

    if(moisture_time.length == 12){
        moisture_value = moisture_value.slice(1);
        moisture_value.push(data);
        moisture_time = moisture_time.slice(1);
        moisture_time.push(gio + ":" + phut + ":" + giay);
    }
    else{
        moisture_value.push(data);
        moisture_time.push(gio + ":" + phut + ":" + giay);
    }

    console.log(moisture_value);
    console.log(moisture_time);
});

function check_Humidity(){
    if(compareMoisture <= Number(selectedMoisture)){
        set(hose, 1);
    }
    else{
        set(hose, 0);
    }
}

onValue(humidity, (snapshot) => { // doc du lieu khi percent co su thay doi
    var time = new Date();
    var gio = time.getHours();
    var phut = time.getMinutes();
    var giay = time.getSeconds();
    if (gio < 10) 
        gio = "0" + gio;
    if (phut < 10) 
        phut = "0" + phut;
    if (giay < 10) 
        giay = "0" + giay;

    const data = snapshot.val();
    console.log(data);
    document.getElementById("doamkk").innerHTML = data + " %";


    if(humidity_time.length == 12){
        humidity_value = humidity_value.slice(1);
        humidity_value.push(data);
        humidity_time = humidity_time.slice(1);
        humidity_time.push(gio + ":" + phut + ":" + giay);
    }
    else{
        humidity_value.push(data);
        humidity_time.push(gio + ":" + phut + ":" + giay);
    }

    console.log(humidity_value);
    console.log(humidity_time);
});

onValue(hose, (snapshot) => { // doc du lieu khi percent co su thay doi
    const data = snapshot.val();
    if(Number(data) == 1){
        img2.src = 'img/tuoi_true.png';
    }
    else{
        img2.src = 'img/tuoi_false.png';
    }

});

let btn3 = document.querySelector('#btn3');
let img2 = document.querySelector('#hose');
let btn4 = document.querySelector('#btn4');

btn3.addEventListener('click', ()=>{
    
    set(hose, 1);
})

btn4.addEventListener('click', ()=>{
    
    set(hose, 0);
})

let btn2 = document.querySelector('#btn2');

btn2.addEventListener('click', ()=>{
    Moisture = document.getElementById("txtMoisture");
    selectedMoisture = Moisture.value;
    console.log(selectedMoisture);
    check_Humidity();
});

function check_time(){
    if(Number(document.getElementById("hiddentext").innerText) == 1 && c == true){
        // console.log("Hello");
        set(hose, 1);
        c = false;
    }
    else if(Number(document.getElementById("hiddentext").innerText) == 0 && c == false){
        c = true;
        set(hose, 0);
    }
    
};
setInterval(function(){
    check_time();
}, 1000);