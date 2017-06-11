var appConfig = require("./app_config");

module.exports.mailVerificationTemplate = function (context) {
    'use strict';

    return `
        <table style="margin:0px auto;width:100%;" border="0" cellspacing="0" cellpadding="10" width="100%">
<tbody>
  <tr>
    <td style="width:100%" width="100%" align="center" valign="top">
      <table border="0" cellspacing="0" cellpadding="0" width="648">
        <tbody>
          <tr>
             <div id="container" style="width: 790px; position: relative; font-family: sans-serif;">
            <header style="background-color: #96bfd4;">
              <img style="margin-left: 10px; vertical-align: middle;" width="47" height="57" title="" alt="" src="${appConfig.baseUrl}images/mailIcon.png" />
              <h2 style="display: inline-block; font-family: sans-serif; font-weight: 100; color: white; vertical-align: middle;">BookmarkTree Chrome extension</h2>
            </header>
            <div id="content" style=" height: 400px;  background-image: url(${appConfig.baseUrl}images/workplace.jpg); text-align: center;">
              <h2 style="margin-top: 0px; padding-top: 30px; font-weight: 100; text-align: center; color: #1a3a1b; opacity: 1;">${context.name} Welcome to BookmarkTree extension!</h2>
              <h3 style="text-align: center; padding-top: 200px; font-weight: 100; text-align: center; color: #1a3a1b; opacity: 1;">
                 Bookmark tree will make you <span style="color: #e24242;">love</span> your bookmarks
              </h3>
                  <a class="button" style = "text-decoration: none; font-family: sans-serif; font-weight: 200; padding: 10px; text-align: center; background-color: #17bb9c; border-radius: 10px; display: inline-block;
                  color: white"href="${context.link}">Click to verify your mail
                  </a>
            </div>
        </div>
          </tr>
        </tbody>
      </table>
    </td>
  </tr>
</tbody>
</table>`
}