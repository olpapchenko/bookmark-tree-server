angular.module("app").controller("profileController", ["$scope", "userService", "toaster", "Upload", "$q", function($scope, userService, toaster, upload, $q){
    var DEFAULT_AVATAR = "/images/user-moderate.png",
        UPLOAD_PATH = "/files/avatar";

    $scope.avatar = $scope.user.avatar || DEFAULT_AVATAR;
    
    $scope.save = function () {

        if($scope.avatarFile) {
            var fileUpload = upload.upload({
                url: UPLOAD_PATH,
                data: {id:$scope.user.id, avatar: $scope.avatarFile}
            }).then(function (avatar) {
                $scope.user.avatar = avatar.name;
            });
        } else {
            var deffer = $q.defer();
            deffer.resolve();
            var success = deffer.promise;
        }

        (fileUpload ? fileUpload : success)
        .then(function () {
            return userService.save($scope.user);
        }).then(function () {
            toaster.pop('success', "User updated", "User successfully updated");
        }, function () {
            toaster.pop('error', 'Error', 'Some error occurred');
        });
    }



}]);