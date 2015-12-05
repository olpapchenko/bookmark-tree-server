angular.module("app").service("avatarService", function () {

    this.getPath = function (avatar) {
        var DEFAULT_AVATAR = "/images/user-moderate.png",
            AVATAR_PATH = "/avatars/";
        return avatar ? AVATAR_PATH + avatar : DEFAULT_AVATAR;
    }
});