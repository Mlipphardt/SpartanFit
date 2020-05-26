import axios from 'axios';
import {} from 'dotenv/config';
const key = process.env.REACT_APP_KEY;
const id = process.env.REACT_APP_ID;

export default {
  findUsers: function (query) {
    return axios.get('/api/users?search=' + query);
  },
  postTextSearch: function (query) {
    return axios.get('/api/posts?search=' + query);
  },
  followUser: function (id, data) {
    return axios.post('/api/follow/' + id, data);
  },
  unfollowUser: function (id) {
    return axios.delete('/api/follow/' + id);
  },
  deleteNotification: function (id) {
    return axios.delete('/api/notifications/' + id);
  },
  editNotification: function (id, data) {
    return axios.put('/api/notifications/' + id, data);
  },
  likePost: function (id) {
    return axios.post('/api/likes/' + id);
  },
  unlikePost: function (id) {
    return axios.delete('/api/likes/' + id);
  },
  getPosts: function () {
    return axios.get('/api/posts/');
  },
  getPost: function (route) {
    return axios.get('/api' + route);
  },
  deletePost: function (id) {
    return axios.delete('/api/posts/' + id);
  },
  makePost: function (id, postData) {
    return axios.post('/api/posts/' + id, postData);
  },
  editPost: function (id, postData) {
    return axios.put('/api/posts/' + id, postData);
  },
  getComments: function (id) {
    return axios.get('/api/comments/' + id);
  },
  getComment: function (route) {
    return axios.get('/api' + route);
  },
  deleteComment: function (id) {
    return axios.delete('/api/comments/' + id);
  },
  makeComment: function (id, commentData) {
    console.log(commentData);
    return axios.post('/api/comments/' + id, commentData);
  },
  editComment: function (id, commentData) {
    return axios.put('/api/comments/' + id, commentData);
  },
  getUsers: function () {
    return axios.get('/api/users/');
  },
  getUser: function (id) {
    return axios.get('/api/users/' + id);
  },
  getPublicProfile: function (route) {
    return axios.get('/slugs' + route);
  },
  putUser: function (id, putData) {
    return axios.put('/api/users/' + id, putData);
  },
  registerUser: function (postData) {
    return axios.post('/api/users/', postData);
  },
  login: function (postData) {
    return axios.post('/login', postData);
  },
  checkLogin: function () {
    return axios.get('/user');
  },
  logout: function () {
    return axios.post('/logout');
  },
  deleteUser: function (id) {
    return axios.delete('/api/users/' + id);
  },
  getMeals: function (query) {
    return axios.get(
      `https://api.edamam.com/search?q=${query}&app_id=${id}&app_key=${key}`
    );
  },
  getMealsByUser: function (userId) {
    return axios.get(`/api/users/${userId}/meals`);
  },
  postMeal: function (id, postData) {
    return axios.post('/api/meals/' + id, postData);
  },
  deleteMeal: function (id) {
    return axios.delete('/api/meals/' + id);
  },
  getWorkouts: function () {
    return axios.get('/api/workouts/');
  },
  getWorkoutsByUser: function (userId) {
    return axios.get(`/api/users/${userId}/workouts`);
  },
  getWorkoutByID: function (id) {
    return axios.get('/api/workouts/' + id);
  },
  postWorkout: function (id, postData) {
    return axios.post('/api/workouts/' + id, postData);
  },
  deleteWorkout: function (id) {
    return axios.delete('/api/workouts/' + id);
  },
  getData: function () {
    return axios.get('/api/data/');
  },
  postData: function (id, postData) {
    return axios.post('/api/data/' + id, postData);
  },
  deleteData: function (id) {
    return axios.delete('/api/data/' + id);
  },
  getUserImg: function (id) {
    return axios.get('/profileimg/' + id);
  },
  postUserImg: function (id, postData) {
    return axios.post('/image-upload/' + id, postData);
  },
};
