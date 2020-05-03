function GPS(){

  //this parent variable is necessary to fix a flaw in Javascript that
  //doesn't allow callback functions to access the parent object.
  var parent = this;

  this.hasPermission=false;
  this.latitude=0;
  this.longitude=0;
  this.accuracy=0;
  this.timestamp;
  this.planetRadius=6378137; //meters
  this.options={
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  this.onChange=function(latitude, longitude, accuracy, timestamp){
    console.log("[GPS]","gps.onChange event. This method can be overriden using: gps.onChange=function(latitude, longitude, accuracy, timestamp){} ")
    console.log(latitude, longitude, accuracy, timestamp);
  };
  this.onError=function(type, message, error){
    console.log("[GPS]","gps.onError event. This method can be overriden using: gps.onError=function(type, message, error){} ");
    console.log(type, message, error);
  };
  this.setPosition=function(latitude,longitude,accuracy,timestamp){
    this.latitude = latitude;
    this.longitude = longitude;
    this.accuracy = accuracy;
    this.timestamp = timestamp;
    this.onChange(this.latitude, this.longitude, this.accuracy, this.timestamp);

  }
  this.init=function (){

    if(navigator.geolocation) {
      parent.hasPermission=true;
       // timeout at 60000 milliseconds (60 seconds)

       navigator.geolocation.getCurrentPosition(

           function (position) {
              parent.setPosition(position.coords.latitude, position.coords.longitude, position.coords.accuracy, new Date(position.timestamp));
           },
            function (err) {
             if(err.code == 1) {
               parent.onError("[GPS]","Error: Access is denied!",err);

             } else if( err.code == 2) {
                parent.onError("[GPS]","Error: Position is unavailable!",err);
             } else{
               parent.onError("[GPS]",err.code,err);
             }
          },
           this.options);
    } else {
       parent.onError("[GPS]", "Sorry, browser does not support geolocation!");
    }
  }

}
