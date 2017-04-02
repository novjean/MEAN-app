var app = angular.module('quzAnsApp', []);

app.controller('AppCtrl', ['$scope', '$http',
	function ($scope, $http) {
		//Booleans for SPA
		$scope.loginMode = true;
		$scope.adminMode = false;
		$scope.trainerMode = false;
		$scope.employeeMode = false;
		$scope.signedInMode = false;

		$scope.addEmployeeMode = false;
		$scope.accesstypes = ['Admin', 'Employee', 'Trainer'];				//List for useraccess 

		//UI constants
		$scope.globaluserID = '';
		$scope.accessName = '';
		$scope.trainerType = '';
		$scope.today = new Date();

		//Lists for UI
		$scope.trainerclasses = ['Java', 'Dot Net', 'Spring', 'Hibernate', 'Bootstrap', 'AngularJS', 'AWS'];
		$scope.employeeTypes = ['Java', 'Dot Net'];

		$scope.login = function () {
			console.log($scope.useraccess + " " + $scope.username + " " + $scope.password);
			$http.get('/employeelist').then(doneCallbacks, failCallbacks);

			function doneCallbacks(response) {
				console.log("Users data received.");
				empdata = response.data;
				//console.log(empdata.length);
				for (index = 0; index < empdata.length; index++) {
					//console.log(empdata[index].username);
					if (empdata[index].useraccess == $scope.useraccess &&
						empdata[index].username == $scope.username &&
						empdata[index].password == $scope.password) {
						console.log("Success Login.");
						$scope.accessName = empdata[index].firstname + " " + empdata[index].lastname;
						$scope.globaluserID = empdata[index]._id;
						console.log($scope.globaluserID);
						$scope.signedInMode = true;
						$scope.loginMode = false;
						if ($scope.useraccess == 'Admin') $scope.adminMode = true;
						else if ($scope.useraccess == 'Trainer') {
							$scope.trainerMode = true;
							$scope.trainerType = empdata[index].class;   		//Got to implement this later for trainer studetns only
						}
						else {
							console.log("employee logged in.");
							$scope.employeeMode = true;
						}
					}
				}
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.logout = function () {
			$scope.adminMode = false;
			$scope.trainerMode = false;
			$scope.employeeMode = false;
			$scope.addEmployeeMode = false;
			$scope.signedInMode = false;
			$scope.accessName = '';
			$scope.loginMode = true;
		};

	}]);

app.controller('AdminCtrl', ['$scope', '$http',
	function ($scope, $http) {

		$scope.adminemployeemode = false;
		$scope.admintrainermode = false;
		$scope.admintestmode = false;
		$scope.searchMode = false;

		$scope.showEmployees = function () {
			$scope.adminemployeemode = true;
			$scope.admintrainermode = false;
			$scope.admintestmode = false;
			$scope.searchMode = true;
		};

		$scope.showTrainers = function () {
			$scope.adminemployeemode = false;
			$scope.admintrainermode = true;
			$scope.admintestmode = false;
			$scope.searchMode = true;
		};

		$scope.showTests = function () {
			$scope.adminemployeemode = false;
			$scope.admintrainermode = false;
			$scope.admintestmode = true;
			$scope.searchMode = false;
		};

	}]);

app.controller('EmployeeCtrl', ['$scope', '$http',
	function ($scope, $http) {

		$scope.clearEmployee = function () {
			console.log("Employee cleared.");
			$scope.employee._id = '';
			$scope.employee.useraccess = '';
			$scope.employee.username = '';
			$scope.employee.password = '';
			$scope.employee.firstname = '';
			$scope.employee.lastname = '';
			$scope.employee.class = '';
			$scope.employee.email = '';
			$scope.employee.number = '';
		};

		var refreshEmployee = function () {
			$http.get('/employeelist/' + 'Employee').then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Employee data received.");
				//console.log(response.data[0]);
				$scope.employeelist = response.data;
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		refreshEmployee();

		$scope.addEmployee = function () {
			$scope.employee.useraccess = 'Employee';
			$scope.employee.username = ($scope.employee.firstname.charAt(0) + '' + $scope.employee.lastname.trim()); //trim not working
			$scope.employee.password = 'welcomePassword';
			//console.log($scope.employee);

			$http.post('/employeelist', $scope.employee).then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Success Added" + response);
				$scope.clearEmployee();
				refreshEmployee();
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.removeEmployee = function (id) {
			//console.log(id);
			$http.delete('/employeelist/' + id).then(doneCallbacks, failCallbacks);

			function doneCallbacks(response) {
				refreshEmployee();
			}

			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.editEmployee = function (id) {
			//console.log(id);
			$http.get('/employeelist/' + id).then(doneCallbacks, failCallbacks);

			function doneCallbacks(response) {
				//console.log("Response received: " + response.data);
				$scope.employee = response.data;
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.updateEmployee = function () {
			console.log($scope.employee._id);
			$http.put('/employeelist/' + $scope.employee._id, $scope.employee).then(doneCallbacks, failCallbacks);

			function doneCallbacks(response) {
				console.log("Successfully updated.");
				refreshEmployee();
				$scope.clearEmployee();
			}

			function failCallbacks(err) {
				console.log(err.message);
			}
		};


	}]);

app.controller('TrainerCtrl', ['$scope', '$http',
	function ($scope, $http) {

		$scope.clearTrainer = function () {
			$scope.trainer._id = '';
			$scope.trainer.useraccess = '';
			$scope.trainer.username = '';
			$scope.trainer.password = '';
			$scope.trainer.firstname = '';
			$scope.trainer.lastname = '';
			$scope.trainer.email = '';
			$scope.trainer.number = '';
			$scope.trainer.class = '';
		};

		var refreshTrainer = function () {
			$http.get('/employeelist/' + 'Trainer').then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Trainer data received.");
				// console.log(response.data[0].name);
				$scope.trainerlist = response.data;
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		refreshTrainer();

		$scope.removeTrainer = function (id) {
			//console.log(id);
			$http.delete('/employeelist/' + id).then(doneCallbacks, failCallbacks);

			function doneCallbacks(response) {
				refreshTrainer();
			}

			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.addTrainer = function () {
			$scope.trainer.useraccess = 'Trainer';
			$scope.trainer.username = ($scope.trainer.firstname.charAt(0) + '' + $scope.trainer.lastname.trim()); //trim not working
			$scope.trainer.password = 'trainerPassword';
			//console.log($scope.trainer);

			$http.post('/employeelist', $scope.trainer).then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				//console.log("Success Added" + response);
				refreshTrainer();
				$scope.clearTrainer();
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.editTrainer = function (id) {
			console.log(id);
			$http.get('/employeelist/' + id).then(doneCallbacks, failCallbacks);

			function doneCallbacks(response) {
				//console.log(response.data);
				$scope.trainer = response.data;
			}

			function failCallbacks(err) {
				console.log(err.message);
			}
		};

	}]);

app.controller('TrainerAccessCtrl', ['$scope', '$http',
	function ($scope, $http) {

		$scope.trainerEmployeeMode = false;
		$scope.trainerViewTestMode = false;
		$scope.searchMode = false;

		$scope.trainerAddTestMode = false;
		$scope.addTestDetailsMode = false;
		$scope.addQuestionMode = false;
		$scope.successAddTestMode = false;

		$scope.questionNumber = 1;
		var testid = '';

		$scope.showEmployees = function () {
			$scope.trainerEmployeeMode = true;
			$scope.trainerViewTestMode = false;
			$scope.trainerAddTestMode = false;

			$scope.addTestDetailsMode = false;
			$scope.addQuestionMode = false;
			$scope.searchMode = true;
			$scope.successAddTestMode = false;
		};

		$scope.showTests = function () {
			$scope.trainerEmployeeMode = false;
			$scope.trainerViewTestMode = true;
			$scope.trainerAddTestMode = false;

			$scope.addTestDetailsMode = false;
			$scope.addQuestionMode = false;

			$scope.searchMode = true;
			$scope.successAddTestMode = false;
			refreshTests();
			$scope.clearQuestionFields();
		};

		$scope.addTest = function () {
			$scope.trainerAddTestMode = true;
			$scope.addTestDetailsMode = true;
			$scope.addQuestionMode = false;

			$scope.trainerEmployeeMode = false;
			$scope.trainerViewTestMode = false;
			$scope.setTestFields = false;
			$scope.searchMode = false;
			$scope.successAddTestMode = false;
		};

		$scope.submitTest = function () {
			$scope.successAddTestMode = true;
			$scope.trainerAddTestMode = true;

			$scope.addTestDetailsMode = false;
			$scope.addQuestionMode = false;

			$scope.trainerEmployeeMode = false;
			$scope.trainerViewTestMode = false;
			$scope.setTestFields = false;
			$scope.searchMode = false;
		};

		var refreshTests = function () {
			$http.get('/testsdb/').then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Test data received.");
				$scope.testlist = response.data;
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		$scope.addTestDetails = function () {
			$scope.test.type = 'Test';
			$scope.test.author = $scope.accessName;
			$scope.test.createDate = $scope.today;
			$scope.trainerAddTestQuestionForm = false;
			console.log($scope.test);

			$http.post('/testsdb', $scope.test).then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Success Added Test ID: " + response.data._id);
				testid = response.data._id;
				$scope.addTestDetailsMode = false;
				$scope.addQuestionMode = true;
			}
			function failCallbacks(err) {
				console.log(err.message);
				$scope.errorMessage = 'ERROR: test details not added.';
			}
		};

		$scope.addQuestion = function () {
			$scope.question.testid = testid;
			$scope.questionNumber += 1;
			console.log($scope.question);

			$http.post('/qandadb', $scope.question).then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Success Added Question");
				$scope.clearQuestionFields();
			}
			function failCallbacks(err) {
				console.log(err.message);
				$scope.errorMessage = 'ERROR: Question not added.';
			}
		};

		$scope.cancelAddTest = function () {
			$scope.test.domain = '';
			$scope.test.title = '';
			$scope.test.description = '';
		};

		$scope.clearQuestionFields = function () {
			$scope.question.text = '';
			$scope.question.option1 = '';
			$scope.question.option2 = '';
			$scope.question.option3 = '';
			$scope.question.option4 = '';
			$scope.question.correctAnswer = '';
		};

	}]);


app.controller('EmployeeAccessCtrl', ['$scope', '$http',
	function ($scope, $http) {

		$scope.searchMode = false;
		$scope.employeeViewTestMode = false;
		$scope.employeeReportMode = false;
		$scope.employeeResourcesMode = false;
		$scope.employeeTestListMode = true;
		$scope.takeTestSection = false;

		$scope.result = {};
		$scope.result.values = [];

		$scope.showEmployeeTests = function () {
			$scope.searchMode = true;
			$scope.employeeViewTestMode = true;
			$scope.employeeReportMode = false;
			$scope.employeeResourcesMode = false;
			$scope.takeTestSection = false;
			$scope.employeeTestListMode = true;
			refreshTests();
		};

		$scope.progressReport = function () {
			$scope.searchMode = true;
			$scope.employeeViewTestMode = false;
			$scope.employeeReportMode = true;
			$scope.employeeResourcesMode = false;
			$scope.takeTestSection = false;
			refreshReports();
		};

		$scope.viewResources = function () {
			$scope.searchMode = true;
			$scope.employeeViewTestMode = false;
			$scope.employeeReportMode = false;
			$scope.employeeResourcesMode = true;
			$scope.takeTestSection = false;
		};

		var refreshTests = function () {
			$http.get('/testsdb/').then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Test data received.");
				$scope.testlist = response.data;
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};

		var refreshReports = function () {
			$scope.resultlist = [];
			$http.get('/empresdb/').then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Results data received.");
				resdata = response.data;
				for (index = 0; index < resdata.length; index++) {
					if (resdata[index].empid == $scope.globaluserID) {
						$scope.resultlist.push(resdata[index]);
					}
				}
			}
			function failCallbacks(err) {
				console.log(err.message);
			}
		};


		$scope.takeTest = function (testId) {
			questions = [];
			$http.get('/testsdb/' + testId).then(doneCallbacks1, failCallbacks1);
			function doneCallbacks1(response) {
				$scope.test = response.data;
				console.log("Received test info: " + $scope.test);
				$scope.result.testdomain = $scope.test.domain;
				$scope.result.testTitle = $scope.test.title;
			}
			function failCallbacks1(err) {
				console.log("testdb ERROR: " + err.message);
			}

			$http.get('/qandadb').then(doneCallbacks2, failCallbacks2);
			function doneCallbacks2(response) {
				// console.log(response.data);
				qandadata = response.data;
				for (index = 0; index < qandadata.length; index++) {
					if (qandadata[index].testid == testId) {
						questions.push(qandadata[index]);
					}
				}
				$scope.questions = questions;
				$scope.employeeTestListMode = false;
				$scope.takeTestSection = true;
			}
			function failCallbacks2(err) {
				console.log("qandadb ERROR: " + err.message);
			}
		};

		$scope.submitTest = function () {
			$scope.result.empid = $scope.globaluserID;
			$scope.result.empname = $scope.accessName;
			$scope.result.takenDate = $scope.today;
			$scope.result.mark = 0;
			$scope.result.percentage = 0;

			for (index = 0; index < questions.length; index++) {
				if ($scope.result.values[index] == questions[index].correctAnswer) {
					$scope.result.mark++;
				}
			}
			$scope.result.percentage = ($scope.result.mark / $scope.questions.length) * 100;
			// console.log($scope.result);

			$http.post('/empresdb', $scope.result).then(doneCallbacks, failCallbacks);
			function doneCallbacks(response) {
				console.log("Success Added Result");
				$scope.progressReport();
				$scope.clearAll();
			}
			function failCallbacks(err) {
				console.log(err.message);
				console.log('ERROR: Result not added.');
			}
		};

		$scope.clearAll = function () {
			$scope.result.empid = '';
			$scope.result.empname = '';
			$scope.result.takenDate = '';
			$scope.result.mark = 0;
			$scope.result.percentage = 0;
			$scope.questions = [];
			$scope.result = {};
			$scope.result.values = [];
		};
	}
]);

app.controller('HeaderCtrl', ['$scope', '$http',
	function ($scope, $http) {

	}]);

app.controller('FooterCtrl', ['$scope', '$http',
	function ($scope, $http) {

	}]);