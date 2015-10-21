angular.module("app").controller("profileController", ["$scope", "userService", "toaster", "Upload", "$q", "$state", "$timeout",
    function($scope, userService, toaster, upload, $q, $state, $timeout){
    var DEFAULT_AVATAR = "/images/user-moderate.png",
        AVATAR_PATH = "/avatars/",
        UPLOAD_PATH = "/uploads/avatar";

    $scope.avatar = (AVATAR_PATH + $scope.user.avatar) || DEFAULT_AVATAR;
    $scope.avatarPreview = { height: "200px", width:  document.getElementById("avatar-container").offsetWidth};

    $scope.save = function () {

        if($scope.avatarFile) {
            var fileUpload = upload.upload({
                url: UPLOAD_PATH,
                data: {id:$scope.user.id, avatar: $scope.avatarFile}
            }).then(function (avatar) {
                $scope.user.avatar = avatar.data.name;
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
                $state.reload();
        }, function () {
            toaster.pop('error', 'Error', 'Some error occurred');
        });
    }



}]);