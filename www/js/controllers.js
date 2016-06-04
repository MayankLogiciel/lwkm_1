angular.module('lwkm.controllers', [])

// APP - RIGHT MENU
.controller('AppCtrl', function($scope, AuthService) {

    $scope.isUserAlreadyLoggedIn = AuthService.isUserAlreadyLoggedIn();

	  if(typeof analytics !== "undefined") {analytics.trackView("Menu");}

    $scope.$on("login:logout:changed", function(){
      //Re-evaluate value
      $scope.isUserAlreadyLoggedIn = AuthService.isUserAlreadyLoggedIn();
    });

})

// CATEGORIES MENUs
.controller('PushMenuCtrl', function($scope, Categories) {
if(typeof analytics !== "undefined") {analytics.trackView("Search Panes");}
 if(typeof Appsee !== "undefined") {Appsee.startScreen("Search Panes");}
  var getItems = function(parents, categories){

    if(parents.length > 0){

      _.each(parents, function(parent){
        parent.name = parent.title;
        parent.link = parent.slug;

        var items = _.filter(categories, function(category){ return category.parent===parent.id; });

        if(items.length > 0){
          parent.menu = {
            title: parent.title,
            id: parent.id,
            items:items
          };
          getItems(parent.menu.items, categories);
        }
      });
    }
    return parents;
  };

  Categories.getCategories()
  .then(function(data){
    var sorted_categories = _.sortBy(data.categories, function(category){ return category.title; });
    var parents = _.filter(sorted_categories, function(category){ return category.parent===0; });
    var result = getItems(parents, sorted_categories);

    $scope.menu = {
      title: 'All Categories',
      id: '0',
      items: result
    };
  });
})

//SOCIAL SHARING
.controller("SocialController", function($scope, $cordovaSocialSharing) {
   if(typeof analytics !== "undefined") {analytics.trackView("Social Share");}
	  if(typeof Appsee !== "undefined") {Appsee.startScreen("Social Share");}
    $scope.shareViaTwitter = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("twitter", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaTwitter(message, image, link);
        }, function(error) {
            alert("Cannot share on Twitter");
        });
        if(typeof analytics !== "undefined") { analytics.trackEvent("Social", "click", "Twitter", 25); }
    };
	$scope.shareViaFacebook = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("facebook", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaFacebook(message, image, link);
        }, function(error) {
            alert("Cannot share on Facebook");
        });
          if(typeof analytics !== "undefined") { analytics.trackEvent("Social", "click", "Facebook", 25); }
    };
	$scope.shareViaWhatsapp = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("whatsapp", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaWhatsapp(message, image, link);
        }, function(error) {
            alert("Cannot share on Whatsapp");
        });
          if(typeof analytics !== "undefined") { analytics.trackEvent("Social", "click", "Whatsapp", 25); }
    };
	$scope.shareViaSMS = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("sms", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaSMS(message, image, link);
        }, function(error) {
            alert("Cannot share on SMS");
        });
          if(typeof analytics !== "undefined") { analytics.trackEvent("Social", "click", "SMS", 25); }
    };
	$scope.shareViaEmail = function(message, image, link) {
        $cordovaSocialSharing.canShareVia("email", message, image, link).then(function(result) {
            $cordovaSocialSharing.shareViaEmail(message, image, link);
        }, function(error) {
            alert("Cannot share on Email");
        });
          if(typeof analytics !== "undefined") { analytics.trackEvent("Social", "click", "Email", 25); }
    };

})


// BOOKMARKS
.controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService) {
if(typeof analytics !== "undefined") { analytics.trackView("BookMark Library"); }
 if(typeof Appsee !== "undefined") {Appsee.startScreen("BookMark Library");}
  $scope.bookmarks = BookMarkService.getBookmarks();

  // When a new post is bookmarked, we should update bookmarks list
  $rootScope.$on("new-bookmark", function(event, post_id){
    $scope.bookmarks = BookMarkService.getBookmarks();
  });
	$scope.loadBookMarks = function(post){
    $state.go('app.post', {postId : bookmark.id});
  };

  $scope.remove = function(bookmarkId) {
    BookMarkService.remove(bookmarkId);
    $scope.bookmarks = BookMarkService.getBookmarks();
	 if(typeof analytics !== "undefined") { analytics.trackEvent("BookMark", "click", "Remove", 25); }
  };
})


// CONTACT
.controller('ContactCtrl', function($scope) {
if(typeof analytics !== "undefined") { analytics.trackView("Contact Page"); }
 if(typeof Appsee !== "undefined") {Appsee.startScreen("Contact Page");}
})

// SETTINGS
.controller('SettingCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, $ionicPopover, $ionicPopup, $cordovaEmailComposer, AuthService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Settings Page"); }
  if(typeof Appsee !== "undefined") {Appsee.startScreen("Settings Page");}
  
  $scope.notifications = getInitialPushSettingValue();
  $scope.sendLocation = false;

  /**
   * get user preference value for push notification
   * @return {Boolean}
   */
  function getInitialPushSettingValue(){
    if( angular.isUndefined(window.localStorage['Pushwoosh']) ) {
      return true;
    }else{
      return window.localStorage['Pushwoosh'] === "true" ? true : false;
    }
  }

  $ionicModal.fromTemplateUrl('views/common/faqs.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.faqs_modal = modal;
  });

 $ionicModal.fromTemplateUrl('views/common/rates.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.rates_modal = modal;
  });

  $ionicPopover.fromTemplateUrl('views/app/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.demo = 'ios';
  $scope.setPlatform = function(p) {
    document.body.classList.remove('platform-ios');
    document.body.classList.remove('platform-android');
    document.body.classList.add('platform-' + p);
    $scope.demo = p;
  };
  //Ratings Prompt Popover
  $scope.popAsk2 = function() {
	//Popup One

		$scope.data = {};
  // An elaborate, custom popup
  var myPopupA = $ionicPopup.show({
    title: 'Rate Us',
	cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    subTitle: 'We are happy that you like us. Please, support us by giving us a rating from 1 to 5. 5 stars is the highest rating',
    scope: $scope,
    buttons: [

      {
        text: '<b>Rate LWKM</b>',
        type: 'button-assertive',
        onTap: function() {

    window.open('market://details?id=com.wec.lwkm', '_system', 'location=yes'); return false;

        }
      },
	  { text: 'Close' }
    ]
  });
  myPopupA.then(function(res) {
    console.log('Tapped!', res);
  });

	//End popup one

  };

  $scope.popAsk1 = function() {
	  //Popup Two

		$scope.data = {};

  // An elaborate, custom popup
  var myPopupB = $ionicPopup.show({
    title: 'Feed Back',
	cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    subTitle: 'We are sorry you dont enjoy using LWKM. Please let us know how to improve. We appreciate your feed back',
    scope: $scope,
    buttons: [

      {
        text: '<b>Send Feedback</b>',
        type: 'button-assertive',
        onTap: function() {
			if(typeof analytics !== "undefined") { analytics.trackEvent("Ratings", "click", "No", 25); }
	cordova.plugins.email.open({
         to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending Feedback',
          body:    'I am contacting you to give you feedback'
        });

        }
      },
	  { text: 'Close' }
    ]
  });
  myPopupB.then(function(res) {
    console.log('Tapped!', res);
  });

	//End popup Two

  };
  // An alert dialog
 $scope.popInfo = function() {
	 if(typeof analytics !== "undefined") { analytics.trackEvent("Info", "click", "About", 25); }
	 $scope.popover.hide();
   var alertPopup = $ionicPopup.alert({
     title: 'LWKM v 1.4.4',
	 cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
	 subTitle: 'Comedy App: Jokes, Videos, Cartoons, Memes, and Comics', // String (optional). The sub-title of the popup.
     template: 'APP FEATURES: Pull to refresh, Categorized Comedy, Submit funny, Share, Bookmark jokes, Comment, Notifications, Invite friends',
	 okType: 'button-assertive'
   });
   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };


  $scope.popNotify = function() {
	   $scope.popover.hide();
	        // A confirm dialog
   //block of code
    $scope.data = {};

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    title: 'Notifications',
	cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    subTitle: 'Turn on/off notifications. You wont receive notifications if you click the off button',
    scope: $scope,
    buttons: [

      {
        text: '<b>On</b>',
        type: 'button-assertive',
        onTap: function() {

        registerPushwoosh();
		if(typeof analytics !== "undefined") { analytics.trackEvent("Notifications", "click", "Yes", 25); }
        }
      },
	  {
        text: '<b>Off</b>',
        type: 'button-assertive',
        onTap: function() {

        unregisterPushwoosh();
		if(typeof analytics !== "undefined") { analytics.trackEvent("Notifications", "click", "NO", 25); }
        }
      },
	  { text: 'Close' }
    ]
  });
  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });


  };

  /**
   * toggle user preference for push notificaitons
   * @param  {Boolean} newState  user's new preference
   */
  $scope.togglePushwooshNotifications = function( newState ){
    if( newState ){
      registerPushwoosh();
    }else{
      unregisterPushwoosh();
    }

  };

  $scope.popLogin = function() {
  $state.go('login');
   $scope.popover.hide();
  };

  $scope.popLogout = function() {
    AuthService.logOut();
        $state.go('login');
		 $scope.popover.hide();

  };


  $scope.showFAQS = function() {
    $scope.faqs_modal.show();
  };


   $scope.showRates = function() {
    $scope.rates_modal.show();
  };
  // Triggered on a the logOut button click
  $scope.showLogOutMenu = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      // buttons: [
      // { text: '<b>Share</b> This' },
      // { text: 'Move' }
      // ],
      destructiveText: '<i class="icon ion-android-plane red"></i> Leave App',
      titleText: 'Are you sure you want to logout? LWKM is awsome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },
      destructiveButtonClicked: function(){
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened.
        AuthService.logOut();
        $state.go('login');
		 if(typeof analytics !== "undefined") { analytics.trackEvent("Auth", "click", "Logout", 25); }
      }
    });
  };
})
// SUBMIT
.controller('SubmitCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService) {
  if(typeof analytics !== "undefined") { analytics.trackView("Submission Page"); }
 if(typeof Appsee !== "undefined") {Appsee.startScreen("Submission Page");}
  $scope.sendLocation = false;

  $ionicModal.fromTemplateUrl('views/common/pictures.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.pictures_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/common/video.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.videos_modal = modal;
  });

  $ionicModal.fromTemplateUrl('views/common/jokes.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.jokes_modal = modal;
  });

 $ionicModal.fromTemplateUrl('views/common/event.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.events_modal = modal;
  });


  $scope.showPictures = function() {
    $scope.pictures_modal.show();
      if(typeof analytics !== "undefined") { analytics.trackEvent("Submit", "click", "Pictures", 25); }
  };

  $scope.showVideos = function() {
    $scope.videos_modal.show();
    if(typeof analytics !== "undefined") { analytics.trackEvent("Submit", "click", "Videos", 25); }
  };

  $scope.showJokes = function() {
    $scope.jokes_modal.show();
    if(typeof analytics !== "undefined") { analytics.trackEvent("Submit", "click", "Jokes", 25); }
  };

   $scope.showEvents = function() {
    $scope.events_modal.show();
    if(typeof analytics !== "undefined") { analytics.trackEvent("Submit", "click", "Events", 25); }
  };

  // Triggered on a the logOut button click
  $scope.showLogOutMenu = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      // buttons: [
      // { text: '<b>Share</b> This' },
      // { text: 'Move' }
      // ],
      destructiveText: 'Logout',
      titleText: 'Are you sure you want to logout? This app is awsome so I recommend you to stay.',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      buttonClicked: function(index) {
        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },
      destructiveButtonClicked: function(){
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened.
        AuthService.logOut();
        $state.go('login');
		 if(typeof analytics !== "undefined") { analytics.trackEvent("Auth", "click", "Logout", 25); }
      }
    });
  };
})

// About
.controller('AboutCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService) {
if(typeof analytics !== "undefined") { analytics.trackView("About Page"); }
 if(typeof Appsee !== "undefined") {Appsee.startScreen("About Page");}

})
// Team
.controller('TeamCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService) {
if(typeof analytics !== "undefined") { analytics.trackView("Team Page"); }
 if(typeof Appsee !== "undefined") {Appsee.startScreen("Team Page");}
})

// Legal
.controller('LegalCtrl', function($scope, $ionicActionSheet, $ionicModal, $state, AuthService) {
if(typeof analytics !== "undefined") { analytics.trackView("Legal Page"); }
 if(typeof Appsee !== "undefined") {Appsee.startScreen("Legal Page");}
})

//EMAIL SENDER
.controller('EmailSenderCtrl', function($scope, $cordovaEmailComposer) {

  $scope.sendFeedback = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'LWKM:Feedback',
          body:    'I am contacting you because'
        });
      }
    );
  };

  $scope.sendContactMail = function(){
 //Plugin documentation here: http://ngcordova.com/docs/plugins/emailComposer/

    $cordovaEmailComposer.isAvailable().then(function() {



      // is available
        $cordovaEmailComposer.open({
           to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'LWKM:Contact',
          body:    'I am contacting you because'
            })
        .then(null, function () {
          // user cancelled email
        });
    }, function () {
      // not available
    });
  };
$scope.sendJokes = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending a Joke',
          body:    'I am contacting you because'
        });
      }
    );
  };

$scope.sendPictures = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
              to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending a Picture',
          body:    'I am contacting you because'
        });
      }
    );
  };

$scope.sendVideos = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
               to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending a Video',
          body:    'I am contacting you because'
        });
      }
    );
  };

  $scope.sendEvents = function(){
    cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
          to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending an Event',
          body:    'I am contacting you because'
        });
      }
    );
  };

})


// RATE THIS APP
.controller('RateAppCtrl', function($scope) {

  $scope.rateApp = function(){
    if(ionic.Platform.isIOS()){
      AppRate.preferences.storeAppURL.ios = 'A9L8RH4N8A.com.wec.lwkm';
		AppRate.promptForRating();
		App.promptAgainForEachNewVersion(true);
    }else if(ionic.Platform.isAndroid()){
      AppRate.preferences.storeAppURL.android = 'market://details?id=com.wec.lwkm';
      AppRate.preferences.usesUntilPrompt = 2;
		AppRate.promptForRating();
		App.promptAgainForEachNewVersion(true);
    }
  };
})


//ADMOB
.controller('AdmobCtrl', function($scope, $ionicActionSheet, AdMob) {

  $scope.manageAdMob = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
      { text: 'Show AdMob Banner' },
      { text: 'Show AdMob Interstitial' }
      ],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        AdMob.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if(button.text == 'Show AdMob Banner')
        {
          console.log("show AdMob banner");
          AdMob.showBanner();
        }
        if(button.text == 'Show AdMob Interstitial')
        {
          console.log("show AdMob interstitial");
          AdMob.showInterstitial();
        }
        return true;
      }
    });
  };
})


// WALKTHROUGH
.controller('WalkthroughCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
 // Called to navigate to the main app

  $scope.startApp = function () {
    $state.go('app.home');
    // At the same time, lets write to local storage.
    // This will just let us know that we have completed
    // the tutorial
    window.localStorage.didTutorial = 'true';
  };
	$scope.next = function() {
	$ionicSlideBoxDelegate.next();
};
$scope.previous = function() {
	$ionicSlideBoxDelegate.previous();
};

// Called each time the slide changes
$scope.slideChanged = function(index) {
	$scope.slideIndex = index;
};
})

//IAD
.controller('iAdCtrl', function($scope, $ionicActionSheet, iAd) {

  $scope.manageiAd = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
      { text: 'Show iAd Banner' },
      { text: 'Show iAd Interstitial' }
      ],
      destructiveText: 'Remove Ads',
      titleText: 'Choose the ad to show - Interstitial only works in iPad',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
      },
      destructiveButtonClicked: function() {
        console.log("removing ads");
        iAd.removeAds();
        return true;
      },
      buttonClicked: function(index, button) {
        if(button.text == 'Show iAd Banner')
        {
          console.log("show iAd banner");
          iAd.showBanner();
        }
        if(button.text == 'Show iAd Interstitial')
        {
          console.log("show iAd interstitial");
          iAd.showInterstitial();
        }
        return true;
      }
    });
  };
})

//LOGIN
.controller('LoginCtrl', function($rootScope, $scope, $timeout, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.doLogin = function(){

    $ionicLoading.show({
      template: 'Loging in...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password
    };

    AuthService.doLogin(user)
    .then(function(user){
      //success
      $state.go('app.home');

      $timeout(function(){
        $rootScope.$broadcast("login:logout:changed");
      },1000);
      
      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
})


// FORGOT PASSWORD
.controller('ForgotPasswordCtrl', function($scope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.recoverPassword = function(){

    $ionicLoading.show({
      template: 'Recovering password...'
    });

    AuthService.doForgotPassword($scope.user.userName)
    .then(function(data){
      if(data.status == "error"){
        $scope.error = data.error;
      }else{
        $scope.message ="Link for password reset has been emailed to you. Please check your email.";
      }
      $ionicLoading.hide();
    });
  };
})


// REGISTER
.controller('RegisterCtrl', function($scope, $state, $ionicLoading, AuthService) {
  $scope.user = {};

  $scope.doRegister = function(){

    $ionicLoading.show({
      template: 'Registering user...'
    });

    var user = {
      userName: $scope.user.userName,
      password: $scope.user.password,
      email: $scope.user.email,
      displayName: $scope.user.displayName
    };

    AuthService.doRegister(user)
    .then(function(user){
      //success
      $state.go('app.home');
      $ionicLoading.hide();
    },function(err){
      //err
      $scope.error = err;
      $ionicLoading.hide();
    });
  };
})

//HOME - GET RECENT POSTS
.controller('HomeCtrl', function($scope, $cordovaNetwork, $rootScope,$state, $stateParams, $ionicLoading, $ionicPopup, $ionicScrollDelegate, $ionicPopover, $ionicHistory, PostService, PostsDAO, ConnectivityMonitor) {
	// show the interstitial later, e.g. at end of game level
    $scope.posts = [];
    $scope.page = 1;
    $scope.totalPages = 1;
    $scope.morePostsCanBeLoadedFromDB = true;

		$scope.doRefresh = function() {
      if($state.current.name.indexOf('app.home') !== -1 ) { //refresh only when on home page

    		$ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>'
        });

        $scope.page = 1; //Always bring me the latest posts => page=1
        PostService.getRecentPosts($scope.page).then( function(data){
            $scope.totalPages = data.pages;
            $scope.posts = PostService.shortenPosts(data.posts);
            PostsDAO.addNewPosts($scope.posts);

            //$scope.$broadcast('scroll.refreshComplete');
          },function(error){
            //show recent post from pouch db
            PostsDAO.getRecentPosts($scope.page).then(function(data){
              console.log('posts shown from local db');
              $scope.posts = data.posts;
              console.log(data);
              $scope.morePostsCanBeLoadedFromDB = data.isMorePostsPresent;
            });
          }
        ).finally(function(){
          $scope.$broadcast('scroll.refreshComplete');
        });
      }

	 };

  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getRecentPosts($scope.page).then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;
      var new_posts = PostService.shortenPosts(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);
      PostsDAO.addNewPosts(new_posts);

      //$scope.$broadcast('scroll.infiniteScrollComplete');
    },function(error){
        //show recent post from pouch db
        PostsDAO.getRecentPosts($scope.page).then(function(data){
          console.log('posts shown from local db');
          console.log(data);
          $scope.posts = $scope.posts.concat(data.posts);
          $scope.morePostsCanBeLoadedFromDB = data.isMorePostsPresent;
        });      
    }).finally(function(){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.moreDataCanBeLoaded = function(){
    if(ConnectivityMonitor.isOnline()){
      return ($scope.totalPages === 1) || ($scope.totalPages > $scope.page);
    }else{
      if(!$scope.morePostsCanBeLoadedFromDB){

      }
      return $scope.morePostsCanBeLoadedFromDB;
    }
  };

  /**
   * load post details page
   * 1. store clicked post details in service
   * 2. navigate to post detail screen
   * @param  {Object} post clicked post details
   */
  $scope.loadPostDetails = function(post){
    PostService.setPostDetailsToShow(post); // save post details in service
    $state.go('app.post', {postId : post.id});
  };

  $scope.sharePost = function(link){
    PostService.sharePost(link);
      if(typeof analytics !== "undefined") { analytics.trackEvent("Viral", "click", "Share Post 1", 25); }
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Laugh Bookmarked!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
      if(typeof analytics !== "undefined") { analytics.trackEvent("Viral", "click", "Bookmark Post 1", 25); }
  };

$scope.sttButton=false;
  $scope.scrollTop = function() { //ng-click for back to top button
  $ionicScrollDelegate.scrollTop([true]);
  $scope.sttButton=false; //hide the button when reached top
};

$scope.getScrollPosition = function() {
 //monitor the scroll
  var moveData = $ionicScrollDelegate.getScrollPosition().top;
  // console.log(moveData);
    $scope.$apply(function(){
      if(moveData>150){
        $scope.sttButton=true;
      }else{
        $scope.sttButton=false;
      }
    }); //apply
  };  //getScrollPosition

$scope.doRefresh();
if(typeof analytics !== "undefined") { analytics.trackView("Home Page"); }

document.addEventListener("resume", function() {


	if($state.current.name.indexOf('app.home') !== -1 ) {

						$scope.doRefresh();
			 }
}, false);
$scope.$on('$ionicView.enter', function(e) {
  if(AdMob) AdMob.showBanner(8);
});

    })

// POST
.controller('PostCtrl', function($scope, post_data, $ionicLoading, PostService, $state, $ionicScrollDelegate, $ionicPopup, $ionicPopover, $timeout, $ionicActionSheet, $cordovaEmailComposer) {

  $scope.post = post_data.post;
  $scope.comments = _.map(post_data.post.comments, function(comment){
    if(comment.author){
      PostService.getUserGravatar(comment.author.id)
      .then(function(avatar){
        comment.user_gravatar = avatar;
      });
      return comment;
    }else{
      return comment;
    }

  });
      if(typeof analytics !== "undefined") { analytics.trackView("Post Details"); }
			 if(typeof Appsee !== "undefined") {Appsee.startScreen("Post Details");}
//Comment
$scope.flag = false;
  $scope.showMe = function(){
		// An elaborate, custom popup
		var myPopup1 = $ionicPopup.show({
			title: 'You need to login to comment',
		cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
			subTitle: 'Please log in or register',
			scope: $scope,
			buttons: [

				{
					text: '<b>Register</b>',
					type: 'button-assertive',
					onTap: function() {

					$state.go('register');
					}
				},
			{
					text: '<b>Login</b>',
					type: 'button-assertive',
					onTap: function() {

					$state.go('login');
					}
				},
			{ text: 'Cancel' }
			]
		});
		myPopup1.then(function(res) {
			console.log('Tapped!', res);
		});

      };


			$scope.addComment = function(){

		    $ionicLoading.show({
		      template: 'Submiting comment...'
		    });

		    PostService.submitComment($scope.post.id, $scope.new_comment)
		    .then(function(data){
		      if(data.status=="ok"){
		        var user = AuthService.getUser();

		        var comment = {
		          author: {name: user.data.username},
		          content:$scope.new_comment,
		          date: Date.now(),
		          user_gravatar : user.avatar,
		          id: data.comment_id
		        };
		        $scope.comments.push(comment);
		        $scope.new_comment = "";
		        $scope.new_comment_id = data.comment_id;
		        $ionicLoading.hide();
		        // Scroll to new post
		        $ionicScrollDelegate.scrollBottom(true);
		      }
		    });
		  };
  $scope.sharePost = function(link){
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
      if(typeof analytics !== "undefined") { analytics.trackEvent("Viral", "click", "Share Post 2", 25); }
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Laugh Bookmarked!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
      if(typeof analytics !== "undefined") { analytics.trackEvent("Viral", "click", "Bookmark Post 2", 25); }
  };


  // Triggered on a the logOut button click
  $scope.showSubmitMenu = function() {

    // Show the action sheet
    var hideSheet = $ionicActionSheet.show({
      //Here you can add some more buttons
      buttons: [
            { text: '<i class="icon ion-happy red"></i>Submit Joke' },
      { text: '<i class="icon ion-ios-camera red"></i>Submit Picture' },
	   { text: '<i class="icon ion-ios-videocam red"></i>Submit Video' },
	    { text: '<i class="icon ion-android-calendar red"></i>Submit Event' }
      ],

      destructiveText: 'Close',
      titleText: 'Submit something funny and get recognized',
      cancelText: 'Cancel',
      cancel: function() {
        // add cancel code..
		console.log('CANCELLED');
      },
            buttonClicked: function(index) {
		  switch (index){
			case 0 :
				//Handle Share Button
				cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
         to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending a Joke',
          body:    'I am contacting you because'
        });
      }
    );

				return true;

					case 1 :
				//Handle Share Button
				cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
         to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending a Picture',
          body:    'I am contacting you because'
        });
      }
    );

				return true;

					case 2 :
				//Handle Share Button
				cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
         to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending a Video',
          body:    'I am contacting you because'
        });
      }
    );

				return true;

			case 3 :
						//Handle Share Button
				cordova.plugins.email.isAvailable(
      function (isAvailable) {
        // alert('Service is not available') unless isAvailable;
        cordova.plugins.email.open({
         to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending an Event',
          body:    'I am contacting you because'
        });
      }
	   );
				return true;
		}

        //Called when one of the non-destructive buttons is clicked,
        //with the index of the button that was clicked and the button object.
        //Return true to close the action sheet, or false to keep it opened.
        return true;
      },

      destructiveButtonClicked: function(){
        //Called when the destructive button is clicked.
        //Return true to close the action sheet, or false to keep it opened
         console.log('DESTRUCT');
        return true;
      }
    });
  };
	//App Rate


$scope.$on('$ionicView.afterLeave', function(e) {

	// show the prompt for rating later, e.g. at end of game level
	AppRate.preferences.useLanguage = 'en';
	var popupInfo = {};
	popupInfo.title = "Rate LWKM";
	popupInfo.message = "You like LWKM? We would be glad if you share your experience with others. Thanks for your support!";
	popupInfo.cancelButtonLabel = "No";
	popupInfo.laterButtonLabel = "Remind Me Later";
	popupInfo.rateButtonLabel = "Rate";
	AppRate.preferences.customLocale = popupInfo;
	AppRate.preferences.openStoreInApp = true;
	AppRate.preferences.storeAppURL.ios = 'A9L8RH4N8A.com.wec.lwkm';
	AppRate.preferences.storeAppURL.android = 'market://details?id=com.wec.lwkm';
	AppRate.preferences.usesUntilPrompt = 10;
AppRate.promptForRating();
// show the interstitial later, e.g. at end of game level
if(AdMob) AdMob.showInterstitial();
  });

    //PROMOTION POPUP
  $scope.popPromo2 = function() {
	//Popup One

		$scope.data = {};
  // An elaborate, custom popup
  var myPopupA1 = $ionicPopup.show({
    title: 'Rate Us',
	cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    subTitle: 'We are happy that you like us. Please, support us by giving us a rating from 1 to 5. 5 stars is the highest rating',
    scope: $scope,
    buttons: [

      {
        text: '<b>Rate LWKM</b>',
        type: 'button-assertive',
        onTap: function() {

    window.open('market://details?id=com.wec.lwkm', '_system', 'location=yes'); return false;
        }
      },
	  { text: 'Close' }
    ]
  });
  myPopupA1.then(function(res) {
    console.log('Tapped!', res);
  });

	//End popup one

  };

  $scope.popPromo1 = function() {
	  //Popup Two

		$scope.data = {};

  // An elaborate, custom popup
  var myPopupB1 = $ionicPopup.show({
    title: 'Feed Back',
	cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    subTitle: 'We are sorry you dont enjoy using LWKM. Please let us know how to improve. We appreciate your feed back',
    scope: $scope,
    buttons: [

      {
        text: '<b>Send Feedback</b>',
        type: 'button-assertive',
        onTap: function() {
	cordova.plugins.email.open({
         to:      'webextremeconcept@gmail.com',
          cc:      'app@lwkm.ng',
          subject: 'Sending Feedback',
          body:    'I am contacting you to give you feedback'
        });

        }
      },
	  { text: 'Close' }
    ]
  });
  myPopupB1.then(function(res) {
    console.log('Tapped!', res);
  });

	//End popup Two

  };
//END OF PROMOTION POPUP

})

// CATEGORY
.controller('PostCategoryCtrl', function($scope, $cordovaNetwork, $rootScope, $state, $ionicLoading, $stateParams, $ionicScrollDelegate, PostService) {
 if(typeof analytics !== "undefined") { analytics.trackView("Post Category"); }
  $scope.category = {};
  $scope.category.id = $stateParams.categoryId;
  $scope.category.title = $stateParams.categoryTitle;

  $scope.posts = [];
  $scope.page = 1;
  $scope.totalPages = 1;

  $scope.doRefresh = function() {
    if($state.current.name.indexOf('app.category') !== -1 ) { //refresh only when on category post page
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner>',
    	showBackdrop: false
        });

        PostService.getPostsFromCategory($scope.category.id, 1)
        .then(function(data){
          $scope.totalPages = data.pages;
          $scope.posts = PostService.shortenPosts(data.posts);
          //$scope.$broadcast('scroll.refreshComplete');
        }).finally(function(){
          $scope.$broadcast('scroll.refreshComplete');
        });
      }
		};
  $scope.loadMoreData = function(){
    $scope.page += 1;

    PostService.getPostsFromCategory($scope.category.id, $scope.page)
    .then(function(data){
      //We will update this value in every request because new posts can be created
      $scope.totalPages = data.pages;
      var new_posts = PostService.shortenPosts(data.posts);
      $scope.posts = $scope.posts.concat(new_posts);

      //$scope.$broadcast('scroll.infiniteScrollComplete');
    }).finally(function(){
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  /**
   * load post details page
   * 1. store clicked post details in service
   * 2. navigate to post detail screen
   * @param  {Object} post clicked post details
   */
  $scope.loadPostDetails = function(post){
    PostService.setPostDetailsToShow(post); // save post details in service
    $state.go('app.post', {postId : post.id});
  };

  $scope.moreDataCanBeLoaded = function(){
    return $scope.totalPages > $scope.page;
  };

  $scope.sharePost = function(link){
    PostService.sharePost(link);
  };

  $scope.bookmarkPost = function(post){
    $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
    PostService.bookmarkPost(post);
  };
  $scope.sttButton=false;
  $scope.scrollTop = function() { //ng-click for back to top button
  $ionicScrollDelegate.scrollTop([true]);
  $scope.sttButton=false; //hide the button when reached top
};

$scope.getScrollPosition = function() {
 //monitor the scroll
  var moveData = $ionicScrollDelegate.getScrollPosition().top;
  // console.log(moveData);
    $scope.$apply(function(){
      if(moveData>150){
        $scope.sttButton=true;
      }else{
        $scope.sttButton=false;
      }
    }); //apply
  };  //getScrollPosition
  $scope.doRefresh();
})


// WP PAGE
.controller('PageCtrl', function($scope, page_data) {
  $scope.page = page_data.page;
});
