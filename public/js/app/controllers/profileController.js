angular.module("app").controller("profileController", ["$scope", "userService", "toaster", "Upload", "$q", "$state", "avatarService",
    function($scope, userService, toaster, upload, $q, $state, avatarService){

    var UPLOAD_PATH = "/uploads/avatar";

    $scope.avatar = avatarService.getPath($scope.currentUser.avatar);
    $scope.avatarPreview = { height: "200px", width:  document.getElementById("avatar-container").offsetWidth};

    $scope.save = function () {

        if($scope.avatarFile) {
            var fileUpload = upload.upload({
                url: UPLOAD_PATH,
                data: {id:$scope.currentUser.id, avatar: $scope.avatarFile}
            }).then(function (avatar) {
                $scope.currentUser.avatar = avatar.data.name;
            });
        } else {
            var deffer = $q.defer();
            deffer.resolve();
            var success = deffer.promise;
        }

        (fileUpload ? fileUpload : success)
        .then(function () {
            return userService.save($scope.currentUser);
        }).then(function () {
            toaster.pop('success', "User updated", "User successfully updated");
                $state.reload();
        }, function () {
            toaster.pop('error', 'Error', 'Some error occurred');
        });
    }



}]);