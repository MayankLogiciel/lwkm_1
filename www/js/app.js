// LWKM Starter App

// Create the PouchDB database instance

var postsDBSettings = {
  'POSTS_DB_NAME' : 'lwkm-posts',
  'MAX_RECENT_POST_STORE' : 50,
  'PER_PAGE_POSTS' : 10,
  'AUTO_COMPACTION' : true
};

var bookmarksDBSettings = {
  'BOOKMARKS_DB_NAME' : 'lwkm-bookmarks',
  'AUTO_COMPACTION' : true
}

var postsDB = new PouchDB(postsDBSettings.POSTS_DB_NAME, { auto_compaction: postsDBSettings.AUTO_COMPACTION });
var bookmarksDB = new PouchDB(bookmarksDBSettings.BOOKMARKS_DB_NAME, { auto_compaction: bookmarksDBSettings.AUTO_COMPACTION });

angular.module('underscore', [])
.factory('_', function() {
  return window._; // assumes underscore has already been loaded on the page
});

// Create the PouchDB database instance

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('lwkm', [
  'ionic',
  'ngCordova',
  'lwkm.directives',
  'lwkm.controllers',
  'lwkm.views',
  'lwkm.services',
  'lwkm.config',
  'lwkm.factories',
  'lwkm.filters',
  'angularMoment',
  'underscore',
  'youtube-embed',
  'jett.ionic.content.banner'
  ])

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(false);
})

.run(function($ionicPlatform, $cordovaSplashscreen, $state, $timeout,  $rootScope, $ionicPopup, $ionicHistory, $cordovaNetwork, $ionicLoading, $cordovaToast, AuthService, ConnectivityMonitor, BookMarkService, BookmarksDAO) {
   

  $ionicPlatform.ready(function(){

    // At the start of this controller
    // Lets check local storage for didTutorial
    if (window.localStorage.didTutorial === 'true') {
      // If it we did do the tutorial, lets call
      // $scope.startApp
      // $timeout(function() {
      //   navigator.splashscreen.hide();
      // }, 1000);
      $state.go('app.home');

    } else {
      // If we didn't do the tutorial,
      $state.go('walkthrough');
      // $timeout(function() {
      //     navigator.splashscreen.hide();
      // }, 1000);

    }

    // Initialize Push Notifications
    // Uncomment the following initialization when you have made the appropriate configuration for iOS - http://goo.gl/YKQL8k and for Android - http://goo.gl/SPGWDJ
    initPushwoosh();
   
    //move localstorage saved bookmarks into pouch db
    if( BookMarkService.isBookmarksPresentInLocalStorage() ){
      BookmarksDAO.moveLocalstorageBookmarkIntoPouch();
    }

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    //Google Analytics
    if(typeof analytics !== undefined) {
      analytics.startTrackerWithId("UA-65294016-2");
    } else {
      console.log("Google Analytics Unavailable");
    }
    
    //Appsee Analytics
    if(typeof Appsee !== undefined) {
      Appsee.start("1af9e379a0464a8fbd60603bc9a99e2d");

    } else {
      console.log("Appsee Analytics Unavailable");
    }

    //admob ads
    var admobid = {};
    // select the right Ad Id according to platform
    if( /(android)/i.test(navigator.userAgent) ) {
      admobid = { // for Android
        banner: 'ca-app-pub-2007428953027611/5187867689',
        interstitial: 'ca-app-pub-2007428953027611/6664600882'
      };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      admobid = { // for iOS
        banner: '',
        interstitial: ''
      };
    } else {
      admobid = { // for Windows Phone
        banner: '',
        interstitial: ''
      };
    }

    if(window.AdMob) 
    AdMob.createBanner({
      adId:admobid.banner,
      position:AdMob.AD_POSITION.BOTTOM_CENTER,
      overlap: true,
      autoShow:false
    });
    // prepare and load ad resource in background, e.g. at begining of game level
    if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, overlap: true, autoShow:false} );


    // for form inputs)
    var AdLoaded = false;
    var BlackHidden = false;
    document.addEventListener('onAdLoaded', function (e) { AdLoaded = true; });
    window.addEventListener('native.keyboardhide', keyboardHideHandler);

    function keyboardHideHandler(e) {
      if (AdLoaded && !BlackHidden) {
        AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        BlackHidden = true;
      }
    }    
  
  });

  $ionicPlatform.on("resume", function(){
      //e.preventDefault();
  });

  // Disable BACK button on home
  $ionicPlatform.registerBackButtonAction(function (event) {
    if($state.current.name=="app.home"){
      event.preventDefault();
      ionic.Platform.exitApp();
    } else if ($state.current.name=="app.category"){
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('app.home');
          //go to home page
      } else{
          $ionicHistory.goBack();
      }
  }, 100);

  //general offline check
  // listen for Offline event
  // $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
  //     alert('offline');
  //     if($state.current.name=="app.post"){
  //         console.log("offlinemonitoring state not allowed");
  //     }else{
  //         $cordovaToast.show("You are Offline. You won't be able to watch videos or download",7000, "bottom");
  //     }
  // });

  //start watching online/offline event
  ConnectivityMonitor.startWatching();

  // UI Router Authentication Check
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.data.authenticate){
      AuthService.userIsLoggedIn().then(
        function(response){
          if(response === false){
           event.preventDefault();
           $state.go('app.home');
          }
        }
      );
    }
  });

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('walkthrough', {
    url: "/walkthrough",
    templateUrl: "views/auth/walkthrough.html",
    controller: 'WalkthroughCtrl',
    data: {
      authenticate: false
  }
})

  .state('register', {
    url: "/register",
    templateUrl: "views/auth/register.html",
    controller: 'RegisterCtrl',
    data: {
      authenticate: false
  }
})

  .state('login', {
    url: "/login",
    templateUrl: "views/auth/login.html",
    controller: 'LoginCtrl',
    data: {
      authenticate: false
  }
})

  .state('forgot_password', {
    url: "/forgot_password",
    templateUrl: "views/auth/forgot-password.html",
    controller: 'ForgotPasswordCtrl',
    data: {
      authenticate: false
  }
})


  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
})

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "views/app/home.html",
        controller: 'HomeCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.bookmarks', {
    cache: false,
    url: "/bookmarks",
    views: {
      'menuContent': {
        templateUrl: "views/app/bookmarks.html",
        controller: 'BookMarksCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.contact', {
    url: "/contact",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "views/app/contact.html",
        controller: 'ContactCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.post', {
     url: "/post/:postId",
     views: {
       'menuContent': {
         templateUrl: "views/app/wordpress/post.html",
         controller: 'PostCtrl'
     }
 },
 data: {
   authenticate: false
},
resolve: {
   post_data: function(PostService, $ionicLoading, $stateParams,$ionicPopup, $timeout) {
   		    /*
           $ionicLoading.show({
          		template: '<ion-spinner icon="android"></ion-spinner>',
             showBackdrop: false,
             duration: 15000
          	});
           var postId = $stateParams.postId;
           return PostService.getPost(postId);
           */
           $ionicLoading.show({ template: 'Loading..', noBackdrop: true, duration: 500 });
           var data = {};
           data.post = PostService.getPostDetailsToShow(); //get post details from already stored post in service
           return data;
       }
   }
})
  .state('app.settings', {
    url: "/settings",
    views: {
      'menuContent': {
        templateUrl: "views/app/settings.html",
        controller: 'SettingCtrl'
    }
},
data: {
  authenticate: false
}
})


  .state('app.tab', {
    url: "/tab",
    cache: false,
    views: {
      'menuContent' :{
        templateUrl: "views/app/tab.html"
    }
},
data: {
  authenticate: false
}
})

  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "views/app/tab.html",
        controller: 'AboutCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.team', {
    url: "/team",
    views: {
      'menuContent': {
        templateUrl: "views/app/tab-team.html",
        controller: 'TeamCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.legal', {
    url: "/team",
    views: {
      'menuContent': {
        templateUrl: "views/app/tab-legal.html",
        controller: 'LegalCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.submit', {
    url: "/submit",
    views: {
      'menuContent': {
        templateUrl: "views/app/submit.html",
        controller: 'SubmitCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.offline', {
    url: "/offline",
    views: {
      'menuContent': {
        templateUrl: "views/app/offline.html",
        controller: 'offlineCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.category', {
    url: "/category/:categoryTitle/:categoryId",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/category.html",
        controller: 'PostCategoryCtrl'
    }
},
data: {
  authenticate: false
}
})

  .state('app.page', {
    url: "/wordpress_page",
    views: {
      'menuContent': {
        templateUrl: "views/app/wordpress/wordpress-page.html",
        controller: 'PageCtrl'
    }
},
data: {
  authenticate: false
},
resolve: {
  page_data: function(PostService,$ionicLoading, $stateParams, $ionicPopup, $timeout, $cordovaNetwork) {
        //You should replace this with your page slug


        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>',
          showBackdrop: false,
          duration: 15000
      });
        var page_slug = 'advertise-with-us';
        return PostService.getWordpressPage(page_slug);

    }
}
})

  ;
  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/app/home'); //Mayank
})

;
