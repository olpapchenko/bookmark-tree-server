angular.module("app").service("avatarService", function () {

    this.getPath = function (avatar, origin) {
        var DEFAULT_AVATAR = "/images/user-moderate.png",
            AVATAR_PATH = "/avatars/";
        if(origin != 1 && avatar.indexOf("http") == 0) {
            return avatar;
        }
        return avatar ? AVATAR_PATH + avatar : DEFAULT_AVATAR;
    }
});