const test = require('ava');
const http = require('http');
const fetch = require('node-fetch');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      res.on('data', (buffer) => {
        resolve(buffer.toString('utf8'));
      });
    }).on('error', (e) => {
      reject(e);
    });
  });
}

function httpPost(url, body) {
  return fetch(url, {
          method: 'post',
          body:    JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.text());
}

test('home page should contain a form', async t => {
  // condition de passage: la page contient un formulaire HTML
  // plus concretement: la reponse à HTTP `GET /` doit contenir `<form`
  const html = await httpGet('http://localhost:3000/');
  t.regex(html, /<form/);
});

test('city page should contain the name of the city', async t => {
  const html = await httpPost('http://localhost:3000/ville', { ville: 'paris' });
  t.regex(html, /paris/);
});

test('city name with accentuated character should be supported', async t => {
  const html = await httpPost('http://localhost:3000/ville', { ville: 'nîmes' });
  t.regex(html, /nîmes/);
});
