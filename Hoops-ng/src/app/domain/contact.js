var app;
(function (app) {
    var domain;
    (function (domain) {
        var Contact = (function () {
            function Contact(contactId, firstName, lastName, title, cellPhone, email) {
                this.contactId = contactId;
                this.firstName = firstName;
                this.lastName = lastName;
                this.title = title;
                this.cellPhone = cellPhone;
                this.email = email;
            }
            return Contact;
        }());
        domain.Contact = Contact;
    })(domain = app.domain || (app.domain = {}));
})(app || (app = {}));
//# sourceMappingURL=contact.js.map