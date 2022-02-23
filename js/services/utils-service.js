'use strict';
export const utils = {
  makeId,
  getTime,
};

function makeId(length) {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function getTime(timeStamp) {
  var date = new Date(timeStamp);
  date = `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${
    date.getMinutes() < 10 ? `0` + date.getMinutes() : date.getMinutes()
  }`;
  return date;
}
