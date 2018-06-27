var app = angular.module('myapp', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        template: `
            <h1> WELCOME TO JOB PORTAL </h1>
            <h3>To continue, go to Registeration</h3>
        `
    })
        .when('/register', {
            templateUrl: '/register.html',
            controller: 'register_controller'
        })
        .when('/login', {
            templateUrl: '/login.html',
            controller: 'login_controller'
        })
        .when('/home', {
            templateUrl: '/home.html',
            controller: 'home_controller'
        })
        .when('/postJob', {
            templateUrl: '/postJob.html',
            controller: 'postJob_controller'
        })
        .when('/searchJob', {
            templateUrl: '/searchJob.html',
            controller: 'searchJob_controller'
        })
        .when('/jobList', {
            templateUrl: 'jobList.html',
            controller: 'jobList_controller'
        })
        .when('/appliedJobs', {
            templateUrl: 'appliedJobs.html',
            controller: 'appliedJobs_controller'
        })
        .when('/saveJob', {
            templateUrl: 'saveJob.html',
            controller: 'saveJob_controller'
        })
        .when('/mySearchedJobs' ,{
            templateUrl : 'mySearchedJobs.html',
            controller: 'mySearchedJobs_controller'
        });

});

///////////////////////REGISTERATION CONTROLLER///////////////////////////////////////////
app.controller('register_controller', function ($scope, $http, $location) {
    $scope.regUser = function (regData) {
        $http.post('http://localhost:3000/register', $scope.regData)
            .then(function (data) {
                if (data.data.isRegister) {
                    alert("registered successfully");
                    $location.path('/login');
                }
                else {
                    alert("Please try again");
                }
            })
    }
});

///////////////////////LOGIN CONTROLLER/////////////////////////////////////////
app.controller('login_controller', function ($scope, $rootScope, $http, $location) {
    $scope.login = function (authform) {
        $http.post('http://localhost:3000/login', $scope.authform)
            .then(function (data) {
                if (data.data.isLoggedIn) {
                    $rootScope.userInfo = {
                        "username": data.data.loginInfo.username,
                    }
                    if (data.data.loginInfo.userType == "company") {
                        $location.path('/home');
                    }
                    else {
                        $location.path('/searchJob');
                    }
                }
                else {
                    alert("Please login again");
                }
            });
    }
});
/////////////////////////LIST OF JOBS////////////////////////////////////////
app.controller('jobList_controller', function ($scope, $rootScope, $http, $location) {
    $http.get('http://localhost:3000/jobList')
        .then(function (resp) {
            $scope.jobListData = resp.data;
        });
    // $scope.saveJob = function (jobdata) {
    //     jobdata.username = $rootScope.userInfo.username;
    //     $http.post('http://localhost:3000/saveJob', jobdata)
    //         .then(function (data) {
    //             $rootScope.saveJobData = data.data.savedInfo;
    //         });
    // }
    // $scope.applyJob = function (jobData) {
    //     jobData.username = $rootScope.userInfo.username;
    //     $http.post('http://localhost:3000/appliedJobs', jobData)
    //         .then(function (data) {
    //             $rootScope.appliedJobData = data.data.appliedInfo;
    //         });
    // }
    // $scope.view_savedJobs = function(){
    //     $location.path('/saveJob');
    // }
    // $scope.view_appliedJobs = function(){
    //     $location.path('/appliedJobs');
    // }
    $scope.logout = function(){
        $location.path('/login');
    }
});
////////////////////////////////MY SEARCHED JOBS//////////////////////////////////////////////////
app.controller('mySearchedJobs_controller' , function($scope, $rootScope, $location, $http){
    console.log("Hello");
     $scope.searchedData =  $rootScope.searchJobData;
    console.log( $scope.searchedData );
    $scope.saveJob = function (jobdata) {
        jobdata.username = $rootScope.userInfo.username;
        $http.post('http://localhost:3000/saveJob', jobdata)
            .then(function (data) {
                $rootScope.saveJobData = data.data.savedInfo;
            });
    }
    $scope.applyJob = function (jobData) {
        jobData.username = $rootScope.userInfo.username;
        $http.post('http://localhost:3000/appliedJobs', jobData)
            .then(function (data) {
                $rootScope.appliedJobData = data.data.appliedInfo;
            });
    }
    $scope.view_savedJobs = function(){
        $location.path('/saveJob');
    }
    $scope.view_appliedJobs = function(){
        $location.path('/appliedJobs');
    }
});
//////////////////////////////////SAVED JOBS CONTROLLER////////////////////////////////////////
app.controller('saveJob_controller', function ($scope, $rootScope, $location, $http) {
    
    $scope.loggedInUser = { "username": $rootScope.userInfo.username };
    $http.post('http://localhost:3000/saveJobList', $scope.loggedInUser)
        .then(function (resp) {
            $rootScope.saveJobData = resp.data;
        });
        $scope.reset = function(){
            $rootScope.saveJobData = {};
            $http.post('http://localhost:3000/reset', $scope.loggedInUser)
            .then(function(resp){
                console.log(resp);
            });
        }
});

/////////////////////APPLIED JOBS CONTROLLER/////////////////////////////////////////
app.controller('appliedJobs_controller', function ($scope, $rootScope, $http) {
    $scope.loggedInUser = { "username": $rootScope.userInfo.username }
    $http.post('http://localhost:3000/appliedJobList', $scope.loggedInUser)
        .then(function (resp) {
            $rootScope.appliedJobData = resp.data;
        });
        $scope.reset = function(){
            $rootScope.appliedJobData = {};
            $http.post('http://localhost:3000/resetAppliedJobs', $scope.loggedInUser)
            .then(function(resp){
                console.log(resp);
            });
        }
});

///////////////////////////POST JOB CONTROLLER/////////////////////////////////
app.controller('postJob_controller', function ($scope, $location, $http) {
    $scope.postJob = function (jobData) {
        $http.post('http://localhost:3000/postJob', $scope.jobData)
            .then(function (data) {
                if (data.data.isPosted) {
                    alert("Successfully posted the job")
                }
                else {
                    alert("Please try again");
                }
            })
    }
    $scope.goToHome = function () {
        $location.path('/home');
    }
});

//////////////////////////SEARCH JOBS CONTROLLER/////////////////////////////////////////////
app.controller('searchJob_controller', function ($scope,$rootScope ,$http, $location) {
    $scope.search = function (searchData) {
    
        console.log(searchData);
        console.log("kjhkj");
        $http.post('http://localhost:3000/searchJobs', {search_params:$scope.searchData})
            .then(function (data) {
                console.log("resp is" ,data.data.searchInfo);
                $rootScope.searchJobData = data.data.searchInfo;
                console.log(  $rootScope.searchJobData)
                // if (data.data.isSearched) {
                //     alert("Searched the job....")
                // }
                // else {
                //     alert("Please try again");
                // }
            })
    }
    $scope.goToHome = function () {
        $location.path('/home');
    }
    $scope.savedJobs = function () {
        $location.path('/jobList');
    }
    $scope.appliedJobs = function () {
        $location.path('/appliedJobs');
    }
    $scope.reset = function () {
        $scope.searchData = {};
    }
    $scope.mySearchedJobs = function(){
        $location.path('/mySearchedJobs')
    }
});

/////////////////////////////////////HOME CONTROLLER////////////////////////////////////////
app.controller('home_controller', function ($scope, $http, $location) {
    $scope.postJob = function () {
        $location.path('/postJob');
    }
    $scope.logout = function () {
        alert("User Logged Out!!")
        $location.path('/login');
    }
});



