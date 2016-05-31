angular.module('lwkm.services', [])
// WP POSTS RELATED FUNCTIONS
.service('PostService', function ($rootScope, $http, $q, WORDPRESS_API_URL, AuthService, $state, $ionicLoading, $ionicPopup, BookMarkService, ConnectivityMonitor, ConnectivityMonitor){

  this.postDetails = undefined; //store post details before going to post detail page

  /**
   * store post details
   * @param {Object} post data to store
   */
  this.setPostDetailsToShow = function(post){
    this.postDetails = post;
  };

  /**
   * get post details to show on post detail page
   * @return {Object} post details
   */
  this.getPostDetailsToShow = function(){
    return this.postDetails;
  };

  this.getRecentPosts = function(page) {
    var deferred = $q.defer();

	  $http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_recent_posts/' +
      '?page='+ page +
      '&callback=JSON_CALLBACK',
        timeout : 20000
        })
    .success(function(data) {
      deferred.resolve(data);
      $ionicLoading.hide();
    })
    .error(function(data) {
      deferred.reject(data);
      $ionicLoading.hide();
      if(ConnectivityMonitor.isOffline()){
        ConnectivityMonitor.showErrorBanner(ConnectivityMonitor.MESSAGES.SOMETHING_WRONG);
      }else{
        $ionicPopup.alert({
            title: 'Network issues? ',
            template: 'Its taking too long. You are probably having network issues.Please pull down to refresh and try again',
         cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
         okType: 'button-assertive'
          });
      }
    });
    return deferred.promise;
  };

  this.getUserGravatar = function(userId){
    var deferred = $q.defer();

    $http.jsonp(WORDPRESS_API_URL + 'user/get_avatar/' +
    '?user_id='+ userId +
    '&type=full' +
    '&callback=JSON_CALLBACK')
    .success(function(data) {

      var avatar_aux = data.avatar.replace("http:", "");
      var avatar = 'http:' + avatar_aux;

      deferred.resolve(avatar);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getPost = function(postId) {
    var deferred = $q.defer();

	  $http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_post/' +
      '?post_id='+ postId +
      '&callback=JSON_CALLBACK',
        timeout : 20000
        })
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data, status) {
      deferred.reject(data);
      if(ConnectivityMonitor.isOffline()){
        ConnectivityMonitor.showErrorBanner(ConnectivityMonitor.MESSAGES.SOMETHING_WRONG);
      }else{
    	 // An alert dialog
       $ionicPopup.alert({
         title: 'Network issues? ',
         template: 'Its taking too long. You are probably having network issues.Please try again',
    	 cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    	 okType: 'button-assertive'
       });
      }

    });

    return deferred.promise;
  };

  this.submitComment = function(postId, content) {
    var deferred = $q.defer(),
        user = AuthService.getUser();

	  $http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'user/post_comment/' +
    '?post_id='+ postId +
    '&cookie='+ user.cookie +
    '&comment_status=1' +
    '&insecure=cool' + //Mayank
    '&content='+ content +
    '&callback=JSON_CALLBACK',
        timeout : 15000
        })

    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  this.getPostsFromCategory = function(categoryId, page) {
    var deferred = $q.defer();

	  $http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_category_posts/' +
    '?id='+ categoryId +
    '&page='+ page +
    '&callback=JSON_CALLBACK',
        timeout : 20000
        })
    .success(function(data) {
      deferred.resolve(data);
        $ionicLoading.hide();
    })
    .error(function(data) {
      deferred.reject(data);
        $ionicLoading.hide();
      if(ConnectivityMonitor.isOffline()){
        ConnectivityMonitor.showErrorBanner(ConnectivityMonitor.MESSAGES.SOMETHING_WRONG);
      }else{        
    	 // An alert dialog
       $ionicPopup.alert({
         title: 'Network issues? ',
         template: 'Its taking too long. You are probably having network issues.Please try again',
    	  cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    	 okType: 'button-assertive' // String, The custom CSS class name
       });
     }

    });

    return deferred.promise;
  };

  this.shortenPosts = function(posts) {
    //we will shorten the post
    //define the max length (characters) of your post content
    var maxLength = 300;
    return _.map(posts, function(post){
      if(post.content.length > maxLength){
        //trim the string to the maximum length
        var trimmedString = post.content.substr(0, maxLength);
        //re-trim if we are in the middle of a word
        trimmedString = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("</p>")));
        post.short_content = trimmedString;
      }
      return post;
    });
  };

  this.sharePost = function(link){
    window.plugins.socialsharing.share('Check this post here: ', null, null, link);
  };

  this.bookmarkPost = function(post){
    BookMarkService.bookmarkPost(post);
    $rootScope.$broadcast("new-bookmark", post);
  };

  this.getWordpressPage = function(page_slug) {
    var deferred = $q.defer();

	  $http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_page/' +
    '?slug='+ page_slug +
    '&callback=JSON_CALLBACK',
        timeout : 20000
        })
    .success(function(data) {
      deferred.resolve(data);
        $ionicLoading.hide();
    })
    .error(function(data) {
      deferred.reject(data);
        $ionicLoading.hide();

      if(ConnectivityMonitor.isOffline()){
        ConnectivityMonitor.showErrorBanner(ConnectivityMonitor.MESSAGES.SOMETHING_WRONG);
      }else{          
    	 // An alert dialog
       $ionicPopup.alert({
         title: 'Network issues? ',
         template: 'Its taking too long. You are probably having network issues.Please try again',
         cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
         okType: 'button-assertive'
       });
     }

    });
    return deferred.promise;
  };

})


// SEARCH MENU RELATED FUNCTIONS
.service('SearchService', function ($rootScope, $http, $q, $ionicLoading, $ionicPopup, WORDPRESS_API_URL, ConnectivityMonitor){

  this.search = function(query) {

    var search_results = [],
        search_results_response = $q.defer(),
         promises = [
          this.searchPosts(query),
          this.searchTags(query),
          this.searchAuthors(query)
        ];

    $q.all(promises).then(function(promises_values){
      _.map(promises_values, function(promise_value){
        search_results.push({
          _id: promise_value.id,
          results:_.map(promise_value.posts, function(post){
            return {
              title: post.title,
              id:post.id,
              date: post.date,
              excerpt: post.excerpt
            };
          })
        });
      });
      search_results_response.resolve(search_results);
    });

    return search_results_response.promise;
  };

  this.searchPosts = function(query) {
    var deferred = $q.defer();

	$http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_search_results/' +
    '?search='+ query +
    '&callback=JSON_CALLBACK',
        timeout : 12000
        })
    .success(function(data) {
      var promise_value = {
        id : "posts",
        posts : data.posts
      };
      deferred.resolve(promise_value);
        $ionicLoading.hide();
    })
    .error(function(data) {
        $ionicLoading.hide();
      deferred.reject(data);

      if(ConnectivityMonitor.isOffline()){
        ConnectivityMonitor.showErrorBanner(ConnectivityMonitor.MESSAGES.SOMETHING_WRONG);
      }else{       
    	 // An alert dialog
       $ionicPopup.alert({
         title: 'Network issues? ',
         template: 'Its taking too long. You are probably having network issues.Please try again',
    	 cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    	 okType: 'button-assertive' // String, The custom CSS class name
       });
     }

    });
    return deferred.promise;
  };

  this.searchTags = function(query) {
    var tags_deferred = $q.defer(),
        results_deferred = $q.defer();

    //get all tags and filter the ones with the query in the title
	$http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_tag_index/' +
    '?callback=JSON_CALLBACK',
        timeout : 13000
        })
    .success(function(data) {
      var tags = _.filter(data.tags, function(tag){
        return ((tag.title.indexOf(query) > -1));
                // || (tag.description.indexOf(query) > -1));
      });
        $ionicLoading.hide();
      tags_deferred.resolve(tags);

    })
    .error(function(data) {
        $ionicLoading.hide();
      tags_deferred.reject(data);
    });

    tags_deferred.promise.then(function(tags){
      //for each of the tags matching the query, bring the related posts
      var tag_promises = _.map(tags, function(tag){
        return $http.jsonp(WORDPRESS_API_URL + 'get_tag_posts/' +
          '?id='+ tag.id +
          '&callback=JSON_CALLBACK');
      });

      //prepare the response
      $q.all(tag_promises).then(function(results){
        var posts = [];
        _.map(results, function(result){
          _.each(result.data.posts, function(post){
            posts.push(post);
          });
        });
        var promise_value = {
          id : "tags",
          posts : posts
        };
        results_deferred.resolve(promise_value);
      });
    });

    return results_deferred.promise;
  };

  this.searchAuthors = function(query) {
    var authors_deferred = $q.defer(),
        results_deferred = $q.defer();

    //get all the authors and filter the ones with the query
	$http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'get_author_index/' +
    '?callback=JSON_CALLBACK',
        timeout : 20000
        })
    .success(function(data) {
      var authors = _.filter(data.authors, function(author){
        return ((author.name.indexOf(query) > -1) || (author.nickname.indexOf(query) > -1) || (author.first_name.indexOf(query) > -1));
      });
      authors_deferred.resolve(authors);
        $ionicLoading.hide();
    })
    .error(function(data) {
        $ionicLoading.hide();
      authors_deferred.reject(data);
    });

    authors_deferred.promise.then(function(authors){
      //for each of the tags matching the query, bring the related posts
      var author_promises = _.map(authors, function(author){
        return $http.jsonp(WORDPRESS_API_URL + 'get_author_posts/' +
        '?id='+ author.id +
        '&callback=JSON_CALLBACK');
      });

      //prepare the response
      $q.all(author_promises).then(function(results){
        var posts = [];
        _.map(results, function(result){
          _.each(result.data.posts, function(post){
            posts.push(post);
          });
        });

        var promise_value = {
          id : "authors",
          posts : posts
        };
        results_deferred.resolve(promise_value);
      });
    });

    return results_deferred.promise;
  };
})


// BOOKMARKS FUNCTIONS
.service('BookMarkService', function (_){
  this.bookmarkPost = function(bookmark_post){
    var user_bookmarks = !_.isUndefined(window.localStorage.ionWordpress_bookmarks) ? JSON.parse(window.localStorage.ionWordpress_bookmarks) : [];

    //check if this post is already saved
    var existing_post = _.find(user_bookmarks, function(post){ return post.id == bookmark_post.id; });

    if(!existing_post){
      user_bookmarks.push({
        id: bookmark_post.id,
        title : bookmark_post.title,
        date: bookmark_post.date,
        excerpt: bookmark_post.excerpt
      });
    }

    window.localStorage.ionWordpress_bookmarks = JSON.stringify(user_bookmarks);
  };

  this.getBookmarks = function(){
    return JSON.parse(window.localStorage.ionWordpress_bookmarks || '[]');
  };

  this.remove = function(id){
    var user_bookmarks = !_.isUndefined(window.localStorage.ionWordpress_bookmarks) ? JSON.parse(window.localStorage.ionWordpress_bookmarks) : [];

    //check if this post is already saved
    var remaining_posts = _.filter(user_bookmarks, function(bookmark){ return bookmark.id != id; });

    window.localStorage.ionWordpress_bookmarks = JSON.stringify(remaining_posts);
  };
})




// WP AUTHENTICATION RELATED FUNCTIONS
.service('AuthService', function ($rootScope, $http, $q, $ionicPopup, WORDPRESS_API_URL, ConnectivityMonitor){

  this.validateAuth = function(user) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/validate_auth_cookie/' +
    '?cookie='+ user.cookie +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.doLogin = function(user) {
    var deferred = $q.defer(),
        nonce_dfd = $q.defer(),
        authService = this;

    authService.requestNonce("user", "generate_auth_cookie")
    .then(function(nonce){
      nonce_dfd.resolve(nonce);
    });

    nonce_dfd.promise.then(function(nonce){
      //now that we have the nonce, ask for the new cookie
      authService.generateAuthCookie(user.userName, user.password, nonce)
      .then(function(data){
        if(data.status == "error"){
          // return error message
          deferred.reject(data.error);
        }else{
          //recieve and store the user's cookie in the local storage
          var user = {
            cookie: data.cookie,
            data: data.user,
            user_id: data.user.id
          };

          authService.saveUser(user);

          //getavatar in full size
          authService.updateUserAvatar().then(function(){
            deferred.resolve(user);
          });

        }
      });
    });
    return deferred.promise;
  };

  this.doRegister = function(user) {
    var deferred = $q.defer(),
        nonce_dfd = $q.defer(),
        authService = this;

    authService.requestNonce("user", "register")
    .then(function(nonce){
      nonce_dfd.resolve(nonce);
    });

    nonce_dfd.promise.then(function(nonce){
      authService.registerUser(user.userName, user.email,
        user.displayName, user.password, nonce)
      .then(function(data){
        if(data.status == "error"){
          // return error message
          deferred.reject(data.error);
        }else{
          // in order to get all user data we need to call this function
          // because the register does not provide user data
          authService.doLogin(user).then(function(){
            deferred.resolve(user);
          });
        }
      });
    });

    return deferred.promise;
  };

  this.requestNonce = function(controller, method) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'get_nonce/' +
    '?controller=' + controller +
    '&method=' + method +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data.nonce);
    })
    .error(function(data) {
      deferred.reject(data.nonce);
    });
    return deferred.promise;
  };

  this.doForgotPassword = function(username) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/retrieve_password/' +
    '?user_login='+ username +
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.generateAuthCookie = function(username, password, nonce) {
    var deferred = $q.defer();
    $http.jsonp(WORDPRESS_API_URL + 'user/generate_auth_cookie/' +
    '?username='+ username +
    '&password=' + password +
    '&nonce='+ nonce +
    '&insecure=cool' + //Mayank
    '&callback=JSON_CALLBACK')
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
    });
    return deferred.promise;
  };

  this.saveUser = function(user){
    window.localStorage.ionWordpress_user = JSON.stringify(user);
  };

  this.getUser = function(){

    var data = (window.localStorage.ionWordpress_user) ? JSON.parse(window.localStorage.ionWordpress_user).data : null,
        cookie = (window.localStorage.ionWordpress_user) ? JSON.parse(window.localStorage.ionWordpress_user).cookie : null;

    return {
      avatar : JSON.parse(window.localStorage.ionWordpress_user_avatar || null),
      data: data,
      cookie: cookie
    };
  };

  this.registerUser = function(username, email, displayName, password, nonce) {
    var deferred = $q.defer();

	$http({
        method: 'JSONP',
        url: WORDPRESS_API_URL + 'user/register/' +
    '?username='+ username +
    '&email=' + email +
    '&display_name='+ displayName +
    '&user_pass=' + password +
    '&nonce='+ nonce +
    '&callback=JSON_CALLBACK',
        timeout : 15000
        })
    .success(function(data) {
      deferred.resolve(data);
    })
    .error(function(data) {
      deferred.reject(data);
	    $ionicLoading.hide();
      if(ConnectivityMonitor.isOffline()){
        ConnectivityMonitor.showErrorBanner(ConnectivityMonitor.MESSAGES.SOMETHING_WRONG);
      }else{        
    	 // An alert dialog
       $ionicPopup.alert({
         title: 'Network issues? ',
         template: 'Its taking too long(18 seconds). You are probably having network issues.Please try again',
    	 cssClass: 'popup-vertical-buttons', // String, The custom CSS class name
    	 okType: 'button-assertive' // String, The custom CSS class name

       });
     }

    });
    return deferred.promise;
  };

  this.userIsLoggedIn = function(){
    var deferred = $q.defer();

    var user = JSON.parse(window.localStorage.ionWordpress_user || null);
    if(user !== null && user.cookie !== null)
    {
      this.validateAuth(user).then(function(data){
        deferred.resolve(data.valid);
      });
    }
    else
    {
      deferred.resolve(false);
    }
    return deferred.promise;
  };

  /**
   * check user is already logged in or not from localStorage values
   * @return {Boolean}
   */
  this.isUserAlreadyLoggedIn = function(){
    
    if( angular.isDefined(window.localStorage.ionWordpress_user) 
        && window.localStorage.ionWordpress_user != null
        && window.localStorage.ionWordpress_user != "null" ){
      return true;
    }else{
      return false;
    }

  };

  this.logOut = function(){
    //empty user data

    window.localStorage.ionWordpress_user = null;
    window.localStorage.ionWordpress_user_avatar = null;
    // window.localStorage.ionWordpress_bookmarks = null;
    $rootScope.$broadcast("login:logout:changed");
  };

  //update user avatar from WP
  this.updateUserAvatar = function() {
    var avatar_dfd = $q.defer(),
        authService = this,
        user = JSON.parse(window.localStorage.ionWordpress_user || null);

    $http.jsonp(WORDPRESS_API_URL + 'user/get_avatar/' +
    '?user_id='+ user.user_id +
    '&type=full' +
    '&insecure=cool' + //Mayank
    '&callback=JSON_CALLBACK')
    .success(function(data) {

      var avatar_aux = data.avatar.replace("http:", "");
      var avatar = 'http:' + avatar_aux;
      window.localStorage.ionWordpress_user_avatar =  JSON.stringify(avatar);

      avatar_dfd.resolve(avatar);
    })
    .error(function(err) {
      avatar_dfd.reject(err);
    });

    return avatar_dfd.promise;
  };
})
;
