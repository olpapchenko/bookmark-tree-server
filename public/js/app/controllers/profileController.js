angular.module("app").controller("profileController", ["$scope", "userService", "toaster", "Upload", "$q", "$state", "avatarService", "ngProgressFactory",
    function($scope, userService, toaster, upload, $q, $state, avatarService, ngProgressFactory){

    var UPLOAD_PATH = "/uploads/avatar";
    var progress = ngProgressFactory.createInstance();

    $scope.avatar = avatarService.getPath($scope.currentUser.avatar);

    $scope.avatarPreview = { height: "200px", width:  document.getElementById("avatar-container").offsetWidth};

    $scope.save = function () {
        progress.start();
        if($scope.nameForm.$invalid || $scope.avatars.$invalid) {
            return;
        }

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
            location.reload();
        }, function () {
            toaster.pop('error', 'Error', 'Some error occurred');
        });
    }



}]);