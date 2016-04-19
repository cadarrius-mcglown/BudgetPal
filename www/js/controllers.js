angular.module('SimpleRESTIonic.controllers', [])

    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
    })
    
    .controller('ExCtrl', function ($scope) {
         $scope.labels = ["Entertainment", "Bills", "Giving Back","Travel","Investment"];
        $scope.data = [300, 500, 100 ,240, 360];
    })

    .controller('ExpensesCtrl', function (ExpensesModel, $rootScope,$scope) {
        var vm = this;
        $scope.date = new Date();

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ExpensesModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
            ExpensesModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
            ExpensesModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ExpensesModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {type: '', amount: '', date: new Date(), memo: '', submitter: 'Cadarrius & Breya'};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    })

    .controller('ExpensespCtrl', function (ExpensesModel, $rootScope,$scope) {
        $scope.labels = ["Entertainment", "Bills", "Pets","Groceries","Gas","Savings","Charity","Debt","Cars","Health"];
        $scope.data = [0,0,0,0,0,0,0,0,0,0];

        $scope.pieData = [];

        $scope.categoryArray = [];
        $scope.subCategoryArray = [];

        var vm = this;
        var chartPoints =[];
        var chartNames =[];
        var Entertainment = 0;
        var Bills = 0;
        var Pets = 0;
        var Groceries = 0;
        var Gas = 0;
        var Savings = 0;
        var Charity = 0;
        var Debt = 0;
        var Cars = 0;
        var Health = 0;
        
var tempCategoryArr = [];
var tempSubCategoryArr = [];
var testRelation = [];

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ExpensesModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                   // console.log(vm.data);
                        angular.forEach(vm.data, function(value, key) {

                        //generate subcategories for dropdowns
                            tempCategoryArr.push(value.category);
                            tempSubCategoryArr.push(value.subcategory);

                            //generate simple array of objects to be used for diffrent parts of app ie-charts and category genration
                            testRelation.push({category:value.category, subcategory:value.subcategory, amount: value.amount});

                            


                            switch(value.category) {
                                case "Entertainment":
                                    $scope.data[0]+=value.amount;
                                    break;
                                case "Bills":
                                    $scope.data[1]+=value.amount;
                                    break;
                                case "Pets":
                                    $scope.data[2]+=value.amount;
                                    break;
                                case "Groceries":
                                    $scope.data[3]+=value.amount;
                                    break;
                                case "Gas":
                                    $scope.data[4]+=value.amount;
                                    break;
                                case "Savings":
                                    $scope.data[5]+=value.amount;
                                    break;
                                case "Charity":
                                    $scope.data[6]+=value.amount;
                                    break; 
                                case "Debt":
                                    $scope.data[7]+=value.amount;
                                    break; 
                                case "Cars":
                                    $scope.data[8]+=value.amount;
                                    break; 
                                case "Health":
                                    $scope.data[9]+=value.amount;
                                    break; 
                            }

                           // chartPoints.push(value.amount);
                            //chartNames.push(value.type);
                        });


                        $scope.categoryArray = eliminateDuplicates(tempCategoryArr);
                        $scope.subCategoryArray = eliminateDuplicates(tempSubCategoryArr);


                            $scope.categoryDiag = [];
                             $scope.subCategoryDiag = [];


                             $scope.categoryDiagLabels = [];
                             $scope.subCategoryDiagLabels = [];

                             $scope.categoryDiagData = [];
                             $scope.subCategoryDiagData = [];

                    //use category array and subcat array to create diagnostic 
                    //arrays since they already have duplicates removed
                        for (i = 0; i < $scope.categoryArray.length; i++) 
                        {
                            $scope.categoryDiag.push({category:$scope.categoryArray[i], amount:0});
                            
                        }
                        for (i = 0; i < $scope.subCategoryArray.length; i++) 
                        {
                            $scope.subCategoryDiag.push({category:$scope.subCategoryArray[i], amount:0});
                        }
                        
                        for(i = 0; i < vm.data.length; i++)
                        {

                             angular.forEach($scope.categoryDiag, function(value, key) {  
                                if(value.category == vm.data[i].category){
                                    value.amount += vm.data[i].amount;
                                    //console.log(value.amount);
                                }
                              });

                                 angular.forEach($scope.subCategoryDiag, function(value, key) {  
                                if(value.category == vm.data[i].subcategory){
                                    value.amount += vm.data[i].amount;
                                    //console.log(value.amount);
                                }
                              });
 
                        }

                        for(i = 0; i < $scope.categoryDiag.length; i++){

                            $scope.categoryDiagLabels.push($scope.categoryDiag[i].category);
                            $scope.categoryDiagData.push($scope.categoryDiag[i].amount);
                        }

                        for(i = 0; i < $scope.subCategoryDiag.length; i++){

                            $scope.subCategoryDiagLabels.push($scope.subCategoryDiag[i].category);
                            $scope.subCategoryDiagData.push($scope.subCategoryDiag[i].amount);
                        }

                       // console.log($scope.subCategoryDiag);

                           // console.log($scope.categoryArray);
                           // console.log($scope.subCategoryArray);
                            //console.log(testRelation);
                        



                });
        }



            function eliminateDuplicates(arr) {
            var i,
              len=arr.length,
              out=[],
              obj={};

             for (i=0;i<len;i++) {
             obj[arr[i]]=0;
             }
             for (i in obj) {
             out.push(i);
             }
             return out;
            }

        function unique(list) {
            var result = [];
             angular.forEach(list, function(i, e) {
                if ($.inArray(e, result) == -1) result.push(e);
            });
            return result;
        }


        function clearData(){
            vm.data = null;
        }

        function create(object) {
       
        //before creating object in database use subcategory selected to select 
        //the category for the input object
            for (i = 0; i < testRelation.length; i++) { 
                 if(testRelation[i].subcategory == vm.newObject.subcategory)
                {
                   object.category = testRelation[i].category;
                   // = value.category;
                }
            }


            console.log(object['category']);
            console.log(object);
            ExpensesModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();

                });
        }

        function update(object) {
            
            ExpensesModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ExpensesModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {

            vm.newObject = {category: '',subcategory: '', amount: '', date: new Date(), memo: '', submitter: 'Cadarrius & Breya'};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        function refresh(){
          $scope.data = [0,0,0,0,0,0,0,0,0,0];
        }

        
 
        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;
        vm.refresh =refresh;
        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();

        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    })

    .controller('DashboardCtrl', function (ItemsModel, $rootScope) {
        var vm = this;

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
            ItemsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();


        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    });

