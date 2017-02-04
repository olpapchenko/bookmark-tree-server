var summarize = require("../utils/summarizeUtils");
var actionComposer = require("./actionComposer");
var mandatoryParamFilter = require("../filters/mandatoryParamFilter");


module.exports.post = actionComposer({
    beforeFilters: [mandatoryParamFilter(["text", "percentage"])],
    action: function (req, resp) {
        summarize.summarize(req.body.text, req.body.percentage / 100, function (status, linesMetaData) {
            var lines = linesMetaData.map(function (line) {
                return line.text;
            });
            resp.json({lines: lines});
        });
}});