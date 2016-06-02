
    /*
     * Licensed to the Apache Software Foundation (ASF) under one
     * or more contributor license agreements.  See the NOTICE file
     * distributed with this work for additional information
     * regarding copyright ownership.  The ASF licenses this file
     * to you under the Apache License, Version 2.0 (the
     * "License"); you may not use this file except in compliance
     * with the License.  You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing,
     * software distributed under the License is distributed on an
     * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     * KIND, either express or implied.  See the License for the
     * specific language governing permissions and limitations
     * under the License.
     */
    var pushNotification;

    function initPushwoosh() {

        //var pushNotification = window.plugins.pushNotification;
        pushNotification = cordova.require("pushwoosh-cordova-plugin.PushNotification");
        //set push notifications handler
        document.addEventListener('push-notification', function(event) {

            var title = event.notification.title;
            var userData = event.notification.userdata;

            if(typeof(userData) != "undefined") {
                console.warn('user data: ' + JSON.stringify(userData));
            }
        });

        if(typeof window.localStorage['Pushwoosh'] === null || angular.isUndefined(window.localStorage['Pushwoosh']) || window.localStorage['Pushwoosh'] === 'true' ){
            //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
            pushNotification.onDeviceReady({projectid: "34217462939", appid : "DF794-D3556" });
            //register for pushes
            console.warn('Pushwoosh registering');
            pushNotification.registerDevice(
                function(status) {
                    var pushToken = status;
                    console.warn('push token: ' + pushToken);
                    window.localStorage['Pushwoosh'] = 'true';
                },
                function(status) {
                    console.warn(JSON.stringify(['failed to register ', status]));
                }
             );
        }

    }

    function registerPushwoosh() {
       window.localStorage['Pushwoosh'] = 'true';
       alert('Congratulations! You just enabled notifications');
    }

    function unregisterPushwoosh() {
        alert('Congratulations! You just disabled notifications');
        window.localStorage['Pushwoosh'] = 'false';
        //Unregisters device from push notifications
        pushNotification.unregisterDevice(
            function(token) {
                console.warn(token);
            },
            function(status) {
                console.warn(JSON.stringify(['failed to unregister ', status]));
            }
        );

    }
