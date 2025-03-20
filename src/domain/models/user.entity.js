"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(_id, firstName, lastName, email, password, firstLogin = true, temporaryPassword, temporaryPasswordExpiresAt, createdAt, updatedAt) {
        this._id = _id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.firstLogin = firstLogin;
        this.temporaryPassword = temporaryPassword;
        this.temporaryPasswordExpiresAt = temporaryPasswordExpiresAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
exports.User = User;
