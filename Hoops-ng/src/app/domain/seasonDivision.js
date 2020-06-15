var app;
(function (app) {
    var domain;
    (function (domain) {
        var SeasonDivision = (function () {
            function SeasonDivision(seasonId, divisionName, startDate, endDate, teams, players) {
                this.seasonId = seasonId;
                this.divisionName = divisionName;
                this.startDate = startDate;
                this.endDate = endDate;
                this.teams = teams;
                this.players = players;
            }
            return SeasonDivision;
        }());
        domain.SeasonDivision = SeasonDivision;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=seasonDivision.js.map