angular.module('lwkm.factories', [])

// Factory for wordpress-pushserver http://codecanyon.net/item/send-mobile-push-notification-messages/6548533, if you are using other push notifications server you need to change this
.factory('WpPushServer', function ($http, WORDPRESS_PUSH_URL){

  // Configure push notifications server address in  www/js/config.js

  return {
    // Stores the device token in a db
    // type:  Platform type (ios, android)
    storeDeviceToken: function(type, regId) {

      console.log("Stored token for registered device with data "+ 'device_token=' + regId + '&device_type='+ type);

      $http.post(WORDPRESS_PUSH_URL + 'savetoken/' +
        '?device_token=' + regId +
        '&device_type='+ type)
      .success(function (data, status) {
        console.log("Token stored, device is successfully subscribed to receive push notifications.");
      })
      .error(function (data, status) {
        console.log("Error storing device token." + data + " " + status);
      });
    }
  };
})


.factory('AdMob', function ($window){
  var admob = $window.AdMob;

  if(admob)
  {
    // Register AdMob events
    // new events, with variable to differentiate: adNetwork, adType, adEvent
    document.addEventListener('onAdFailLoad', function(data){
      console.log('error: ' + data.error +
      ', reason: ' + data.reason +
      ', adNetwork:' + data.adNetwork +
      ', adType:' + data.adType +
      ', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
    });
    document.addEventListener('onAdLoaded', function(data){
      console.log('onAdLoaded: ' + data);
    });
    document.addEventListener('onAdPresent', function(data){
      console.log('onAdPresent: ' + data);
    });
    document.addEventListener('onAdLeaveApp', function(data){
      console.log('onAdLeaveApp: ' + data);
    });
    document.addEventListener('onAdDismiss', function(data){
      console.log('onAdDismiss: ' + data);
    });

    var defaultOptions = {
      // bannerId: admobid.banner,
      // interstitialId: admobid.interstitial,
      // adSize: 'SMART_BANNER',
      // width: integer, // valid when set adSize 'CUSTOM'
      // height: integer, // valid when set adSize 'CUSTOM'
      position: admob.AD_POSITION.BOTTOM_CENTER,
      // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
      bgColor: 'black', // color name, or '#RRGGBB'
      // x: integer,		// valid when set position to 0 / POS_XY
      // y: integer,		// valid when set position to 0 / POS_XY
      isTesting: true, // set to true, to receiving test ad for testing purpose
      // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
    };
    var admobid = {};

    if(ionic.Platform.isAndroid())
    {
      admobid = { // for Android
        banner: 'ca-app-pub-6869992474017983/9375997553',
        interstitial: 'ca-app-pub-6869992474017983/1657046752'
      };
    }

    if(ionic.Platform.isIOS())
    {
      admobid = { // for iOS
        banner: 'ca-app-pub-6869992474017983/4806197152',
        interstitial: 'ca-app-pub-6869992474017983/7563979554'
      };
    }

    admob.setOptions(defaultOptions);

    // Prepare the ad before showing it
    // 		- (for example at the beginning of a game level)
    admob.prepareInterstitial({
      adId: admobid.interstitial,
      autoShow: false,
      success: function(){
        console.log('interstitial prepared');
      },
      error: function(){
        console.log('failed to prepare interstitial');
      }
    });
  }
  else
  {
    console.log("No AdMob?");
  }

  return {
    showBanner: function() {
      if(admob)
      {
        admob.createBanner({
          adId:admobid.banner,
          position:admob.AD_POSITION.BOTTOM_CENTER,
          autoShow:true,
          success: function(){
            console.log('banner created');
          },
          error: function(){
            console.log('failed to create banner');
          }
        });
      }
    },
    showInterstitial: function() {
      if(admob)
      {
        // If you didn't prepare it before, you can show it like this
        // admob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});

        // If you did prepare it before, then show it like this
        // 		- (for example: check and show it at end of a game level)
        admob.showInterstitial();
      }
    },
    removeAds: function() {
      if(admob)
      {
        admob.removeBanner();
      }
    }
  };
})

.factory('iAd', function ($window){
  var iAd = $window.iAd;

  // preppare and load ad resource in background, e.g. at begining of game level
  if(iAd) {
    iAd.prepareInterstitial( { autoShow:false } );
  }
  else
  {
    console.log("No iAd?");
  }

  return {
    showBanner: function() {
      if(iAd)
      {
        // show a default banner at bottom
        iAd.createBanner({
          position:iAd.AD_POSITION.BOTTOM_CENTER,
          autoShow:true
        });
      }
    },
    showInterstitial: function() {
      // ** Notice: iAd interstitial Ad only supports iPad.
      if(iAd)
      {
        // If you did prepare it before, then show it like this
        // 		- (for example: check and show it at end of a game level)
        iAd.showInterstitial();
      }
    },
    removeAds: function() {
      if(iAd)
      {
        iAd.removeBanner();
      }
    }
  };
})

	//OFFLINE POPUPS
   .factory('SecuredPopups',function ($ionicPopup, $q) {

            var firstDeferred = $q.defer();
            firstDeferred.resolve();

            var lastPopupPromise = firstDeferred.promise;

            return {
                'show': function (method, object) {
                    var deferred = $q.defer();

                    lastPopupPromise.then(function () {
                        $ionicPopup[method](object).then(function (res) {
                            deferred.resolve(res);
                        });
                    });

                    lastPopupPromise = deferred.promise;

                    return deferred.promise;
                }
            };
        }
    )





// WP CATEGORIES
.factory('Categories', function ($http, $q, WORDPRESS_API_URL){

  return {
    getCategories: function() {
      var deferred = $q.defer();

      $http.jsonp(WORDPRESS_API_URL + 'get_category_index/' +
      '?callback=JSON_CALLBACK')
      .success(function(data) {
        deferred.resolve(data);
      })
      .error(function(data) {
        deferred.reject(data);
      });

      return deferred.promise;
    },
    saveCategoriesInLocalStorage: function(categories){
      window.localStorage.ionWordpress_categories = JSON.stringify(categories);
    },
    getCategoriesFromLocalStorage: function(){
      return !_.isUndefined(window.localStorage.ionWordpress_categories) ? JSON.parse(window.localStorage.ionWordpress_categories) : [];
    }

  };
})

.factory('ConnectivityMonitor', function($rootScope, $cordovaNetwork, $ionicContentBanner, $timeout){
    var contentBannerInstance = null;
    var MESSAGES = {
      'SOMETHING_WRONG' : 'Something went wrong. Please try again.',
      'GOES_ONLINE' : 'You are now connected.',
      'GOES_OFFLINE' : 'Network unavailable.'
    };

    var closeOfflineBannerAfter = 60*60*1000;
    var closeOnlineBannerAfter = 2*1000;
    var closeOtherBannerAfter = 10*1000;

    //read - https://forum.ionicframework.com/t/online-and-offline-event-are-firing-2-times-in-a-row/15839
    //http://www.yourtechchick.com/angularjs/ionic/cordovanetwork-online-and-offline-events-fired-twice/
    var isInternetConnected = true; // used to solve firing twice offline event on android devices
    

    /**
     * show content banner
     * @param  {String} text       text to show on banner
     * @param  {String} type       type of banner(error|info)
     * @param  {String} transition banner show/hide transition(vertical|fade)
     * @param  {Integer} autoClose close banner after these milliseconds
     */
    var showContentBanner = function(text, type, transition, autoClose){

        $timeout(function(){
            //close first if already open
            if (contentBannerInstance) {
                contentBannerInstance();
                contentBannerInstance = null;
            }

            contentBannerInstance = $ionicContentBanner.show({
              text: [text],
              autoClose: autoClose || closeOnlineBannerAfter,
              type: type || 'error',
              transition: transition || 'fade'
            });                
        }, 200);

    };

    return {
        MESSAGES: MESSAGES,
        isOnline: function(){
            if(ionic.Platform.isWebView()){
                return $cordovaNetwork.isOnline();    
            } else {
                return navigator.onLine;
            }
        },
        isOffline: function(){
            if(ionic.Platform.isWebView()){
                return !$cordovaNetwork.isOnline();    
            } else {
                return !navigator.onLine;
            }
        },
        showErrorBanner: function(msg){
            showContentBanner(msg, 'error', 'fade', closeOtherBannerAfter);          
        },
        startWatching: function(){
            if(ionic.Platform.isWebView()){
     
                $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
                  if(isInternetConnected) return;
                  isInternetConnected= true;
                  console.log("went online");
                  showContentBanner(MESSAGES.GOES_ONLINE, 'error', 'fade', closeOnlineBannerAfter);         
                });

                $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
                  if(!isInternetConnected) return;
                  isInternetConnected= false;
                  console.log("went offline");
                  showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);
                });
     
            }
            else {

                window.addEventListener("online", function(e) {
                    console.log("went online");
                    showContentBanner(MESSAGES.GOES_ONLINE, 'error', 'fade', closeOnlineBannerAfter);
                }, false);    

                window.addEventListener("offline", function(e) {
                    console.log("went offline");
                    showContentBanner(MESSAGES.GOES_OFFLINE, 'error', 'fade', closeOfflineBannerAfter);
                }, false); 

            }
        }
    }
});