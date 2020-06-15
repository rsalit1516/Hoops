var app;
(function (app) {
    var domain;
    (function (domain) {
        var Sponsor = (function () {
            function Sponsor(sponsorId, active, name, website, phone) {
                this.sponsorId = sponsorId;
                this.active = active;
                this.name = name;
                this.website = website;
                this.phone = phone;
            }
            return Sponsor;
        }());
        domain.Sponsor = Sponsor;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=sponsor.js.map