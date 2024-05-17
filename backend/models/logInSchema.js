const db = require('../config/loginConfig');

const User = function(user) {
  this.Firstname = user.Firstname;
  this.Lastname = user.Lastname;
  this.Username = user.Username;
  this.Email = user.Email;
  this.Passwords = user.Passwords;
};

User.create = (newUser, result) => {
  const query = 'INSERT INTO Users SET ?';
  db.query(query, newUser, (err, res) => {
    if (err) {
      console.error('error: ', err);
      result(err, null);
      return;
    }
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findByEmail = (email, result) => {
  const query = 'SELECT * FROM Users WHERE Email = ?';
  db.query(query, [email], (err, res) => {
    if (err) {
      console.error('error: ', err);
      result(err, null);
      return;
    }
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: 'not_found' }, null);
  });
};

module.exports = User;
