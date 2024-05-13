#include <Arduino.h>
#include <DHT.h>
#include <WiFi.h> 
// #include <FirebaseESP32.h>
#include <Firebase_ESP_Client.h>
// Provide the token generation process info.
#include <addons/TokenHelper.h>
// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>
// #include <LiquidCrystal_I2C.h>


#define VOL_PIN 34
DHT dht(19, DHT11);


#define FIREBASE_HOST "smartcity-117a3-default-rtdb.firebaseio.com/" //2 cái này lấy trong FB nhé
#define API_KEY "AIzaSyBxvTOCfqyRbQsAwr2PjGYqCMemMRsBi5g"
// #define FIREBASE_HOST "garden-80ba6-default-rtdb.asia-southeast1.firebasedatabase.app" //2 cái này lấy trong FB nhé
// #define API_KEY "AIzaSyDIOvd62WRT3V_SimVEQCrEvctIHrhXdqU"

//#define FIREBASE_HOST "smartfarm-f1f7d-default-rtdb.firebaseio.com" //2 cái này lấy trong FB nhé
//#define API_KEY "AIzaSyDU_DaaczKPOcAegzPHFMAiTTrrugRwbEs"

#define USER_EMAIL "vietnhat1202@gmail.com" // email của mình
#define USER_PASSWORD "phamvietnhat12"
// #define USER_EMAIL "nhattruong05022003@gmail.com" // email của mình
// #define USER_PASSWORD "truong05022003"

//#define USER_EMAIL "trananhtrung2503@gmail.com" // email của mình
//#define USER_PASSWORD "2503tdat0928197291"

// const char* ssid = "Huu Tri"; 
// const char* password = "17100993@";

const char* ssid = "IoT Lab"; 
const char* password = "IoT@123456";

// const char* ssid = "Pixel 4"; 
// const char* password = "12345678";

FirebaseData stream;
FirebaseData firebaseData;
FirebaseData firebaseData1;
FirebaseData firebaseData2;
FirebaseAuth auth;
FirebaseConfig config;


unsigned long t1, t2= 0;
int sensorVal;
float humidity = 80;
float temperature = 25;
float moisture = 45;
int hose = 0;
String path = "/";


void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(18, OUTPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to : ");
  Serial.println(ssid);
  while (WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  config.host = FIREBASE_HOST;
  // config.database_url = FIREBASE_HOST;
  config.api_key = API_KEY;
  /* Assign the RTDB URL (required) */
  config.database_url = FIREBASE_HOST;
  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD; 

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);
  Firebase.setDoubleDigits(5);

  firebaseData.setResponseSize(1024); // minimum size is 1024 bytes
  firebaseData1.setResponseSize(1024); // minimum size is 1024 bytes
  firebaseData2.setResponseSize(1024); // minimum size is 1024 bytes
  stream.setResponseSize(1024); // minimum size is 1024 bytes

  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  dht.begin();
  delay(2000);
  Serial.print("DHT11 connected !");
  Serial.println();
}

void loop() {
  // put your main code here, to run repeatedly:
  if (Firebase.ready() && (millis() - t1 > 2500 || t1 == 0))
  {
    sensorVal = analogRead(34);
    sensorVal = sensorVal < 1930 ? 1930 : sensorVal;
    moisture = map(sensorVal, 1930, 4095, 100, 0);
    humidity = dht.readHumidity();
    temperature = (int)dht.readTemperature();
    Firebase.RTDB.setInt(&firebaseData, path + "Humidity", humidity);
    Firebase.RTDB.setInt(&firebaseData1, path + "Temperature", temperature);
    Firebase.RTDB.setInt(&firebaseData2, path + "Moisture", moisture);
    Serial.println(sensorVal);
    t1= millis();
  }

  if (Firebase.ready() && (millis() - t2 > 2500 || t2 == 0))
  {
    Firebase.RTDB.getInt(&stream, path + "Hose"); //lấy gtri từ Firebase về gán vào biến x (đường dẫn theo fb)
    hose = stream.to<int>(); //lay gtri tu fb ve esp (ép kiểu)
    Serial.print(hose);
    if(int(hose) == 1){
      digitalWrite(18, HIGH);
    }
    else{
      digitalWrite(18, LOW);
    }
    t2= millis();
  }
}
