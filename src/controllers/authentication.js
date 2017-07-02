import express from 'express';

import User from '../models/user';

/**
 * controller for user login
 * POST /user/login
 */
export const userLogin = (req, res) => {
  let user = null;

  User.findUserByCredentials(req.body.email, req.body.password)
    .then(data => {
      if(!data) {
        return Promise.reject({'status': 404});
      }

      user = data;
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      res.status(err.status || 404).send(err);
    });
};

/**
 * controller for create user
 * POST /user/create (default role: normal)
 */
export const createUser = (req, res) => {
  var user = new User({
    'name': req.body.name,
    'email': req.body.email,
    'number': req.body.number,
    'password': req.body.password,
    'role': req.body.role === 'admin' ? 'admin' : 'normal'
  });

  user.save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(err => {
      res.status(err.status || 400).send(err);
    });
};

/**
 * controller to logout user
 * required x-auth in header
 * passed from isAuthorizedUser middleware hence user object is available
 * DELETE /user/logout
 */
export const logoutUser = (req, res) => {
  req.user.removeToken(req.header('x-auth'))
    .then(() => {
      res.send();
    })
    .catch(err => {
      res.status(err.status || 401).send(err);
    });
};