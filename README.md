# Kraken Unofficial Android App
This project tries to fill the gap between Kraken.com and Android.  
The app is built with the Ionic Framework (based itself on Cordova and AngularJS), allowing it to be ported easyly to other platforms (Windows Phone, Blackberry, iOS, etc.)

This is an early release. So far it has been tested on a LG Nexus 4 and Motorola Moto G (2nd 4G) and gives the following features :
 - API keys scanning through com.phonegap.plugins.barcodescanner
 - Balances for all currencies
 - History
 - Trading on all tradable pairs

About licencing : work in progress ! Right now, consider it as GPL v3.

Additional infos and an action video here : http://www.antoineviau.com/kraken/index.html    

## Installation and build

You will have to install yourself node/npm and the android SDK.

Then install Cordova and Ionic :

    npm install -g cordova ionic

Clone the repo :   

    git clone https://github.com/AntoineViau/kraken-unofficial-android-app.git
    cd Kraken

Add Android platform to Ionic/Cordova :

    ionic platform add android

Install dependencies : 

    cd Kraken
    npm install

Build : 
    
    npm run build

Test in browser :

    npm run serve

Build for Android :

    ionic build

Run on device : 

    ionic run
