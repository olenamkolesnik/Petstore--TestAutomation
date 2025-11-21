export const userSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "User",
  "type": "object",
  "required": [
    "id",
    "username",
    "firstName",
    "lastName",
    "email",
    "password",
    "phone",
    "userStatus"
  ],
  "properties": {
    "id": {
      "type": "number"
    },
    "username": {
      "type": "string",
      "minLength": 1
    },
    "firstName": {
      "type": "string",
      "minLength": 1
    },
    "lastName": {
      "type": "string",
      "minLength": 1
    },
    "email": {
      "type": "string"
    },
    "password": {
      "type": "string",
      "minLength": 1
    },
    "phone": {
      "type": "string"
    },
    "userStatus": {
      "type": "number"
    }
  },
  "additionalProperties": false
}
