angular.module("sn.controls").directive("snCalendar", [function () {
	return {
		restrict: "E",
		scope: {},
		controller: function ($scope) {
			$scope.viewMode = 0;

			$scope.years = [];
			$scope.months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

			$scope.calendar = [];
			$scope.weekdays = ["日", "一", "二", "三", "四", "五", "六"];

			function init() {
				var now = new Date();
				$scope.currentYear = $scope.currentYear || now.getFullYear();
				$scope.currentMonth = $scope.currentMonth || now.getMonth();
				$scope.currentDate = $scope.currentDate || now.getDate();
			}

			init();

			$scope.$watch("currentYear", function (newYear, oldYear) {
				if (newYear != oldYear) {
					$scope.$emit("sn.controls.calendar:yearChanged", newYear);
				}

				generateYears(newYear);
				generateCalendar(newYear, $scope.currentMonth);
			});

			$scope.$watch("currentMonth", function (newMonth, oldMonth) {
				if (newMonth != oldMonth) {
					$scope.$emit("sn.controls.calendar:monthChanged", newMonth);
				}

				generateCalendar($scope.currentYear, newMonth);
			});

			$scope.$watch("currentDate", function (newDate, oldDate) {
				if (newDate != oldDate) {
					$scope.$emit("sn.controls.calendar:dateChanged", newDate);
				}
			});

			function generateCalendar(year, month) {
				$scope.calendar = [
					[]
				];

				var offset = new Date(new Date(year, month, 1)).getDay();
				var lastDay = new Date(new Date(year, month + 1, 1) - 1);

				for (var day = offset; day < lastDay.getDate() + offset; day++) {
					if (!$scope.calendar[Math.floor(day / 7)]) {
						$scope.calendar[Math.floor(day / 7)] = [];
					}
					$scope.calendar[Math.floor(day / 7)][day % 7] = day - offset + 1;
				}
			}

			function generateYears(newYear) {
				$scope.years = [];
				var startIndex = Math.floor(newYear / 10) * 10 + 1;

				for (var year = 0; year < 10; year++) {
					$scope.years.push(startIndex + year);
				}
			}

			$scope.dateClass = function (date) {
				if ($scope.currentDate == date) {
					return "active today";
				}
				else {
					return "day";
				}
			};

			$scope.monthClass = function (month) {
				if ($scope.currentMonth == month) {
					return "active month";
				}
				else {
					return "month";
				}
			};

			$scope.yearClass = function (year) {
				if ($scope.currentYear == year) {
					return "active year";
				}
				else {
					return "year";
				}
			};

			$scope.selectDate = function (date) {
				if (date) {
					if (date == $scope.currentDate) {
						$scope.$emit("sn.controls.calendar:dateChanged", date);
					}
					else {
						$scope.currentDate = date;
					}
				}
			};

			$scope.selectMonth = function (month) {
				$scope.currentMonth = month;
				$scope.switchView(0);
			};

			$scope.selectYear = function (year) {
				$scope.currentYear = year;
				$scope.switchView(1);
			};

			$scope.currentMonthStr = function () {
				return $scope.currentYear + "年 " + $scope.months[$scope.currentMonth];
			};

			$scope.currentAgeStr = function () {
				var startIndex = Math.floor($scope.currentYear / 10) * 10 + 1;
				return startIndex + " - " + (startIndex + 9);
			};

			$scope.previousMonth = function () {
				$scope.currentMonth--;
				resetDate();
			};

			$scope.nextMonth = function () {
				$scope.currentMonth++;
				resetDate();
			};

			$scope.previousYear = function () {
				$scope.currentYear--;
				resetDate();
			};

			$scope.nextYear = function () {
				$scope.currentYear++;
				resetDate();
			};

			$scope.previousAge = function () {
				$scope.currentYear -= 10;
			};

			$scope.nextAge = function () {
				$scope.currentYear += 10;
			};

			function resetDate() {
				var current = new Date($scope.currentYear, $scope.currentMonth, $scope.currentDate);

				$scope.currentYear = current.getFullYear();
				$scope.currentMonth = current.getMonth();
				$scope.currentDate = current.getDate();
			}

			$scope.switchView = function (view) {
				//0：日期；1：月；2：年
				$scope.viewMode = view;
			};
		},
		link: function (scope, element, attrs) {
			if (attrs["initYear"]) {
				scope.currentYear = scope.$parent.$eval(attrs["initYear"]);
			}

			if (attrs["initMonth"]) {
				scope.currentMonth = scope.$parent.$eval(attrs["initMonth"]);
			}

			if (attrs["initDate"]) {
				scope.currentDate = scope.$parent.$eval(attrs["initDate"]);
			}
		},
		templateUrl: "templates/calendar/calendar.html"
	}
}]);