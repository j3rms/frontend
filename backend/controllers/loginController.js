const User = require('../models/logInSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({ message: 'Content can not be empty!' });
    return;
  }

  const { Firstname, Lastname, Username, Email, Passwords } = req.body;

  if (!Firstname || !Lastname || !Username || !Email || !Passwords) {
    res.status(400).send({ message: 'All fields are required!' });
    return;
  }

  // Generate a salt to use for hashing the password
  const saltRounds = 10; // Adjust this value as needed
  const salt = bcrypt.genSaltSync(saltRounds);

  // Hash the password using the generated salt
  const hashedPassword = bcrypt.hashSync(Passwords, salt);

  // Create a new user object with the hashed password
  const user = new User({
    Firstname: Firstname,
    Lastname: Lastname,
    Username: Username,
    Email: Email,
    Passwords: hashedPassword // Use the hashed password
  });

  // Call the create method from the User model to insert the new user into the database
  User.create(user, (err, data) => {
    if (err) {
      res.status(500).send({ message: err.message || 'Some error occurred while creating the User.' });
    } else {
      res.send(data);
    }
  });
};

module.exports.login = (req, res) => {
  const { Email, Passwords } = req.body;

  if (!Email || !Passwords) {
    res.status(400).send({ message: 'Email and password are required!' });
    return;
  }

  // Step 1: Check if the email and password are received correctly
  console.log('Email:', Email);
  console.log('Passwords:', Passwords);

  User.findByEmail(Email, (err, user) => {
    if (err) {
      // Step 2: Check if there's an error while finding the user
      console.error('Error finding user:', err);
      if (err.kind === 'not_found') {
        res.status(404).send({ message: 'User not found.' });
      } else {
        res.status(500).send({ message: 'Error retrieving user.' });
      }
      return;
    }

    // Step 3: Check if the user is found
    console.log('Found user:', user);

    const passwordIsValid = bcrypt.compareSync(Passwords, user.Passwords);

    // Step 4: Check if password is valid
    console.log('Password is valid:', passwordIsValid);

    if (!passwordIsValid) {
      res.status(401).send({ accessToken: null, message: 'Invalid Password!' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: 86400 // 24 hours
    });

    // Step 5: Check if token is generated
    console.log('Generated token:', token);

    res.status(200).send({
      id: user.id,
      Email: user.Email,
      accessToken: token
    });
  });
};
