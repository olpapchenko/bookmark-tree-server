angular.module("app").directive("mailAvailability", ["userService", function (userService) {
    return {
        require: 'ngModel',
        restrict: 'A',
        link: function (scope, iElement, attrs, cntrl) {
            cntrl.$asyncValidators.mailAvailability = function (modelValue, viewValue) {
                return userService.checkMailAvailability(modelValue);
            }
        }
    }
}])