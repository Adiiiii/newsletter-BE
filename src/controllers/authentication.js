import express from 'express';
import moment from 'moment';

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
    'phone': req.body.phone,
    'designation': req.body.designation,
    'password': req.body.credentials.password,
    'dob': req.body.dob ? moment(req.body.dob).toDate() : null,
    'doj': req.body.doj ? moment(req.body.doj).toDate() : moment().toDate(),
    'role': req.body.role || 'normal'
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