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
        
        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ExpensesModel.all()
                .then(function (result) {
                    vm.data = result.data.data;

                        angular.forEach(vm.data, function(value, key) {

                            switch(value.type) {
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

                        
               // $scope.labels = chartNames;
                //$scope.data = chartPoints;


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

