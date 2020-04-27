function GPS(){

  //this parent variable is necessary to fix a flaw in Javascript that
  //doesn't allow callback functions to access the parent object.
  var parent = this;

  this.hasGPSPermission=false;
  this.latitude=0;
  this.longitude=0;
  this.accuracy=0;
  this.timestamp;
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
  this.init=function (){

    if(navigator.geolocation) {
      parent.hasGPSPermission=true;
       // timeout at 60000 milliseconds (60 seconds)

       navigator.geolocation.getCurrentPosition(

           function (position) {
              parent.latitude = position.coords.latitude;
              parent.longitude = position.coords.longitude;
              parent.accuracy = position.coords.accuracy;
              parent.timestamp = new Date(position.timestamp);
              parent.onChange(parent.latitude, parent.longitude, parent.accuracy, parent.timestamp);
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
