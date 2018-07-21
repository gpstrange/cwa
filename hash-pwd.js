// import bcrypt from 'bcrypt';
var bcrypt = require('bcrypt');

const pwd = '111111';

bcrypt.hash(pwd, 10).then((string) => {
    console.log(string);
})