// MREN 303 Pico W Wifi Gamepad Read
// Written For MREN 303 

#include <WiFi.h>
#include <WiFiUdp.h>
#include <Servo.h>
#include <Arduino.h>

Servo myservo; 
Servo myservo2; 
Servo myservo3; 



#ifndef STASSID
#define STASSID "MREN303_wifi"
#define STAPSK "MREN@303p1"
#endif

unsigned int localPort = 8888;  // local port to listen on

// buffers for receiving and sending data
char packetBuffer[UDP_TX_PACKET_MAX_SIZE + 1];  // buffer to hold incoming packet,
char ReplyBuffer[22] = "acknowledged\r\n";        // a string to send back
// char Arrays to match commands from gamepad 
char stringA[17] =    "A Button Press";
char stringB[17] =    "B Button Press";
char stringY[17] =    "Y Button Press";
char stringX[17] =    "X Button Press";
char stringLB[17] =   "LB Button Press";
char stringRB[17] =   "RB Button Press";
char stringLS[17] =   "L Stick Press";
char stringRS[17] =   "R Stick Press";
char stringBack[17]=  "Back Press";
char stringStart[17]= "Start Press";
char stringUp[17] =   "Up Dpad Press";
char stringDown[17] = "Down Dpad Press";
char stringLeft[17] = "Left Dpad Press";
char stringRight[17]= "Right Dpad Press";
char stringLX[17] =   "L Stick X Value ";
char stringLY[17] =   "L Stick Y Value ";
char stringRX[17] =   "R Stick X Value ";
char stringRY[17] =   "R Stick Y Value ";
char stringLT[17] =   "L Trigger Value ";
char stringRT[17] =   "R Trigger Value ";

int valueLx = 0;
int valueLy = 0;
int valueRx = 0;
int valueRy = 0;
int valueLt = 0;
int valueRt = 0; 
int batteryLevel = 0;
int threshold = 100;
int threshold2 = -100;


bool ledOn = false;
bool pollBattery = false;
bool LeftMotorOn = false;
bool RightMotorOn = false;
bool LeftMotorOff = false;
bool RightMotorOff = false;
bool LeftMotorBack = false;
bool RightMotorBack = false;

//game modes
const int IDLE_MODE = 0;
const int AUTO_MODE = 1;
const int MANUAL_MODE = 2;
int current_mode = IDLE_MODE; // Variable to store the current mode. Starts in idle mode

unsigned long startTime = 0;  // Variable to store the start time
unsigned long currentTime = 0; // Variable to store the current time

WiFiUDP Udp;

// Define motor driver pins according to your hookup
const int PWMA = 19; // PWM control for motor speed, connect to PWM-enabled pin on Pico
const int AIN1 = 17; // Direction pin 1 for motor A, connect to a GPIO on Pico
const int AIN2 = 18; // Direction pin 2 for motor A, connect to a GPIO on Pico
const int STBY = 16; // Standby pin, connect to a GPIO on Pico
const int PWMA2 = 22; // PWM control for motor speed, connect to PWM-enabled pin on Pico
const int AIN12 = 20; // Direction pin 1 for motor A, connect to a GPIO on Pico
const int AIN22 = 21; // Direction pin 2 for motor A, connect to a GPIO on Pico
int counter = 0;

// defines pins numbers
const int trigPin = 3;
const int echoPin = 2;
const int trigPin1 = 1;
const int echoPin1 = 0;
const int trigPin2 = 5;
const int echoPin2 = 4;

// defines variables
long duration;
int distance;
long duration1;
int distance1;
long duration2;
int distance2;



void setup() { //This handles network function and runs on core 1
  Serial.begin(115200);
  WiFi.begin(STASSID, STAPSK);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(500);
  }
  Serial.print("Connected! IP address: ");
  Serial.println(WiFi.localIP());
  Serial.printf("UDP server on port %d\n", localPort);
  Udp.begin(localPort);

}
void setup1(){ //This handles all inputs and outputs and runs on core 2
  
  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN,0);
  myservo.attach(15);
  myservo2.attach(14);
  myservo3.attach(13);
  analogReadResolution(12); // 12 bit resolution = 0 - 4096 (2^12)

    // Set motor driver pins as outputs
  pinMode(PWMA, OUTPUT);
  pinMode(AIN1, OUTPUT);
  pinMode(AIN2, OUTPUT);
  pinMode(STBY, OUTPUT);
  pinMode(PWMA2, OUTPUT);
  pinMode(AIN12, OUTPUT);
  pinMode(AIN22, OUTPUT);

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  pinMode(trigPin1, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin1, INPUT); // Sets the echoPin as an Input
  pinMode(trigPin2, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin2, INPUT); // Sets the echoPin as an Input
  
  // Pull standby pin high to enable the motor driver
  digitalWrite(STBY, HIGH);

}

void loop() { //This loop executes on Core 1 of the Pico, handles networking and recieves commands
  // if there's data available, read a packet
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Serial.printf("Received packet of size %d from %s:%d\n    (to %s:%d)\n", packetSize, Udp.remoteIP().toString().c_str(), Udp.remotePort(), Udp.destinationIP().toString().c_str(), Udp.localPort());

    // read the packet into packetBufffer
    int n = Udp.read(packetBuffer, UDP_TX_PACKET_MAX_SIZE);
    packetBuffer[n] = 0;

    char comparisonString[17] = "";
    char valueString[5] = "";

    for (int i=0; i<16 ; i++){
      comparisonString[i]=packetBuffer[i];
    }
    comparisonString[16] = 0;
    
    Serial.println("Comp String:");
    Serial.println(comparisonString);

    if (strcmp(comparisonString,stringA) == 0){
      Serial.println("Setting mode to idle");//this line may be removed for final version
      current_mode = IDLE_MODE; // Change to idle mode
    }   
    if (strcmp(comparisonString,stringB) == 0){
      Serial.println("Turning Off LED");
      ledOn = false;
    }
    if (strcmp(comparisonString,stringY) == 0){
      if (current_mode == IDLE_MODE){ // You can only go to auto mode from idle mode
        Serial.println("Setting mode to auto");//this line may be removed for final version
        current_mode = AUTO_MODE; // Change to auto mode
        startTime = millis();  // Start recording the time

      }           
    }
    if (strcmp(comparisonString,stringX) == 0){
      Serial.println("Setting mode to manual");//this line may be removed for final version
      current_mode = MANUAL_MODE; // Change to manual mode
    }
    if (strcmp(comparisonString,stringStart) == 0){
      Serial.println("Polling Battery Level");
      pollBattery = true;
      char pollBatteryMessage[] = "Polling Battery Level"; 
      memcpy(ReplyBuffer,pollBatteryMessage,22);
    }
    if (strcmp(comparisonString,stringLX) == 0){
      for(int i=16; i<=packetSize ; i++){
        valueString[(i-16)] = packetBuffer[i];}
      valueString[5] = 0;
      valueLx = atoi(valueString);
      Serial.println("LX Value is:");
      Serial.println(valueLx);
      if (valueLx > threshold){
      LeftMotorOn = true;
      RightMotorOn = true;
    }
      else if (valueLx <threshold2){
      LeftMotorBack = true;
      RightMotorBack = true;
    }
      else if (threshold2<valueLx<threshold){
      LeftMotorOff = true;
      RightMotorOff = true;
    }
    }
    if (strcmp(comparisonString,stringLY) == 0){
      for(int i=16; i<=packetSize ; i++){
        valueString[(i-16)] = packetBuffer[i];}
      valueString[5] = 0;
      valueLy = atoi(valueString);
      Serial.println("LY Value is:");
      Serial.println(valueLy);
      if (valueLy > threshold){
      LeftMotorOn = true;
      RightMotorBack = true;
    }
      else if (valueLy <threshold2){
      LeftMotorBack = true;
      RightMotorOn = true;
    }
      else if (threshold2<valueLy<threshold){
      LeftMotorOff = true;
      RightMotorOff = true;
    }
    }
    if (strcmp(comparisonString,stringRX) == 0){
      for(int i=16; i<=packetSize ; i++){
        valueString[(i-16)] = packetBuffer[i];}
      valueString[5] = 0;
      valueRx = atoi(valueString);
      Serial.println("RX Value is:");
      Serial.println(valueRx);
    }
    if (strcmp(comparisonString,stringRY) == 0){
      for(int i=16; i<=packetSize ; i++){
        valueString[(i-16)] = packetBuffer[i];}
      valueString[5] = 0;
      valueRy = atoi(valueString);
      Serial.println("RY Value is:");
      Serial.println(valueRy);
    }
    if (strcmp(comparisonString,stringRT) == 0){
      for(int i=16; i<=packetSize ; i++){
        valueString[(i-16)] = packetBuffer[i];}
      valueString[5] = 0;
      valueRt = atoi(valueString);
      Serial.println("RT Value is:");
      Serial.println(valueRt);
    }
    if (strcmp(comparisonString,stringLT) == 0){
      for(int i=16; i<=packetSize ; i++){
        valueString[(i-16)] = packetBuffer[i];}
      valueString[5] = 0;
      valueLt = atoi(valueString);
      Serial.println("LT Value is:");
      Serial.println(valueLt);
    }
    

    // send a reply, to the IP address and port that sent us the packet we received
    if(pollBattery){ //Wait for battery read to reply 
      delay(20);
    }
    Udp.beginPacket(Udp.remoteIP(), Udp.remotePort());
    Udp.write(ReplyBuffer);
    Udp.endPacket();
  }
}

void loop1(){ //This Runs on Core 2 and performs all inputs and outputs

  if(ledOn){
    digitalWrite(LED_BUILTIN,1);
  }
  else{
    digitalWrite(LED_BUILTIN,0);
  }
  int servoPos = map(valueRx,-255,255,0,180);
  myservo.write(servoPos);
  int servoPos2 = map(valueRx,255,-255,0,180);
  myservo2.write(servoPos2);
  if(pollBattery){
    readBattery();
    pollBattery = false;
  }
studentCode(current_mode);

currentTime = millis();

// After spending more than 30 s in auto mode:
if ((current_mode == AUTO_MODE) && (currentTime - startTime) >= 30000) {
  Serial.println("TIME OUT: changing to manual mode");//this line may be removed for final version
  current_mode = MANUAL_MODE; // Change to manual mode
  }
}

void readBattery(){
  int voltage = analogRead(A0);
  Serial.println("Voltage reading is:");
  Serial.println(voltage);
  if (voltage < 200) {
    Serial.println("Battery Not Connected");
  }
  else{
    batteryLevel = map(voltage,2482,3475,0,100);
    char batteryMessage[] = "Battery Level is: %d %";
    sprintf(ReplyBuffer,batteryMessage,batteryLevel);
    Serial.println("Battery Level is :");
    Serial.print(batteryLevel); 
    Serial.print("% \n");  
  }
}

void LeftMotorForward(){
  digitalWrite(AIN1, HIGH);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 255); // 50% duty cycle for speed
}

void RightMotorForward(){
  digitalWrite(AIN12, HIGH);
  digitalWrite(AIN22, LOW);
  analogWrite(PWMA2, 255); // 50% duty cycle for speed
}

void LeftMotorStop(){
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, LOW);
  analogWrite(PWMA, 0); // Disabling PWM signal
}

void RightMotorStop(){
  digitalWrite(AIN12, LOW);
  digitalWrite(AIN22, LOW);
  analogWrite(PWMA2, 0); // Disabling PWM signal
}

void LeftMotorBackward(){
  digitalWrite(AIN1, LOW);
  digitalWrite(AIN2, HIGH);
  analogWrite(PWMA, 255); // 50% duty cycle for speed
}

void RightMotorBackward(){
  digitalWrite(AIN12, LOW);
  digitalWrite(AIN22, HIGH);
  analogWrite(PWMA2, 255); // 50% duty cycle for speed
}

// YOUR CODING GOES HERE
void studentCode(int current_mode){ 
  if(current_mode == IDLE_MODE){
   //Serial.println("You are in idle mode");//this line may be removed for final version
    digitalWrite(LED_BUILTIN, LOW); // LED is off for idle mode
   // Initialize motors state as off
    digitalWrite(STBY, HIGH);
    digitalWrite(AIN1, LOW);
    digitalWrite(AIN2, LOW);
    digitalWrite(PWMA, HIGH);
    digitalWrite(AIN12, LOW);
    digitalWrite(AIN22, LOW);
    digitalWrite(PWMA2, HIGH);
  }
  else if (current_mode == AUTO_MODE){
    Serial.println("You are in auto mode");//this line may be removed for final version
      //forward
      digitalWrite(AIN1, HIGH);
      digitalWrite(AIN2, LOW);
      analogWrite(PWMA, 255); // 50% duty cycle for speed
      digitalWrite(AIN12, HIGH);
      digitalWrite(AIN22, LOW);
      analogWrite(PWMA2, 255); // No PWM signal needed, but keeping it for consistency
      delay(1000); // Run for 3 seconds
               // Initialize motors state as off
      digitalWrite(STBY, HIGH);
      digitalWrite(AIN1, LOW);
      digitalWrite(AIN2, LOW);
      digitalWrite(PWMA, HIGH);
      digitalWrite(AIN12, LOW);
      digitalWrite(AIN22, LOW);
      digitalWrite(PWMA2, HIGH);      
      delay(5000);
      //left
      digitalWrite(AIN1, LOW);
      digitalWrite(AIN2, HIGH);
      analogWrite(PWMA, 255); // 50% duty cycle for speed
      digitalWrite(AIN12, HIGH);
      digitalWrite(AIN22, LOW);
      analogWrite(PWMA2, 255); // 50% duty cycle for speed
      delay(500);
      //forward
      digitalWrite(AIN1, HIGH);
      digitalWrite(AIN2, LOW);
      analogWrite(PWMA, 255); // 50% duty cycle for speed
      digitalWrite(AIN12, HIGH);
      digitalWrite(AIN22, LOW);
      analogWrite(PWMA2, 255); // No PWM signal needed, but keeping it for consistency
      delay(1000);
         // Initialize motors state as off
      digitalWrite(STBY, HIGH);
      digitalWrite(AIN1, LOW);
      digitalWrite(AIN2, LOW);
      digitalWrite(PWMA, HIGH);
      digitalWrite(AIN12, LOW);
      digitalWrite(AIN22, LOW);
      digitalWrite(PWMA2, HIGH);      
      delay(5000);
  //     //left
  //     digitalWrite(AIN1, LOW);
  //     digitalWrite(AIN2, LOW);
  //     analogWrite(PWMA, 0); // Disabling PWM signal
  //     digitalWrite(AIN12, HIGH);
  //     digitalWrite(AIN22, LOW);
  //     analogWrite(PWMA2, 128); // 50% duty cycle for speed
  //     delay(1000);
  //     //right
  //     digitalWrite(AIN1, HIGH);
  //     digitalWrite(AIN2, LOW);
  //     analogWrite(PWMA, 128); // 50% duty cycle for speed
  //     digitalWrite(AIN12, LOW);
  //     digitalWrite(AIN22, HIGH);
  //     analogWrite(PWMA2, 128); // 50% duty cycle for speed
  //     delay(1000);
  //     //back
  //     digitalWrite(AIN12, HIGH);
  //     digitalWrite(AIN22, LOW);
  //     analogWrite(PWMA2, 128); // 50% duty cycle for speed
  //     digitalWrite(AIN1, LOW);
  //     digitalWrite(AIN2, HIGH);
  //     analogWrite(PWMA, 128); // 50% duty cycle for speed
  //     delay(1000);
  //     //reverse
  //     digitalWrite(AIN1, LOW);
  //     digitalWrite(AIN2, HIGH);
  //     analogWrite(PWMA, 128); // 50% duty cycle for speed
  //     digitalWrite(AIN12, LOW);
  //     digitalWrite(AIN22, HIGH);
  //     analogWrite(PWMA2, 128); // 50% duty cycle for speed
  //     //go
  //     digitalWrite(AIN1, HIGH);
  //     digitalWrite(AIN2, LOW);
  //     analogWrite(PWMA, 128); // 50% duty cycle for speed
  //     digitalWrite(AIN12, LOW);
  //     digitalWrite(AIN22, HIGH);
  //     analogWrite(PWMA2, 128); // 50% duty cycle for speed
  //     delay(1000);
  //     digitalWrite(AIN1, HIGH);
  //     digitalWrite(AIN2, LOW);
  //     analogWrite(PWMA, 128); // 50% duty cycle for speed
  //     digitalWrite(AIN12, HIGH);
  //     digitalWrite(AIN22, LOW);
  //     analogWrite(PWMA2, 128); // 50% duty cycle for speed
  //     delay(2000);
   }
  else if (current_mode == MANUAL_MODE){
    Serial.println("You are in manual mode");//this line may be removed for final version
    digitalWrite(LED_BUILTIN, HIGH); // LED is on for manual mode
      if(LeftMotorOn){
    LeftMotorForward();
    LeftMotorOn = false;
  }
  if(RightMotorOn){
    RightMotorForward();
    RightMotorOn = false;
  }
  if(LeftMotorBack){
    LeftMotorBackward();
    LeftMotorBack = false;
  }
  if(RightMotorBack){
    RightMotorBackward();
    RightMotorBack = false;
  }
  if(LeftMotorOff){
    LeftMotorStop();
    LeftMotorOff = false;
  }
  if(RightMotorOff){
    RightMotorStop();
    RightMotorOff = false;
  }
  }
  return;
}