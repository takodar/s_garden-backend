"use strict";
var User = class User {
    constructor(type) {
        this._id = undefined;
        this._token = undefined;
        this._email = undefined;
        this._displayName = undefined;
        this._type = type;
    }

    get type() {
        return this._type;
    }

    get id() {
        return this._id;
    }

    get token() {
        return this._token;
    }

    get email() {
        return this._email;
    }

    get displayName() {
        return this._displayName;
    }
    set type(value) {
        this._type = value;
    }

    set id(value) {
        this._id = value;
    }

    set token(value) {
        this._token = value;
    }

    set email(value) {
        this._email = value;
    }

    set displayName(value) {
        this._displayName = value;
    }
};



module.exports = User;