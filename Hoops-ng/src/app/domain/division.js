var app;
(function (app) {
    var domain;
    (function (domain) {
        var Division = (function () {
            function Division(seasonId, divisionName, minDate, maxDate) {
                this.seasonId = seasonId;
                this.divisionName = divisionName;
                this.minDate = minDate;
                this.maxDate = maxDate;
            }
            return Division;
        }());
        domain.Division = Division;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=division.js.map