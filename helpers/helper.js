import http from 'k6/http'
import { check } from "k6";

export function getFormKey(response) {
  var formKey = response.body.match(/'formKey':..................'/gm).toString()
  var formKeyArray = formKey.split(': ')
  var formKeyValue = formKeyArray[1].toString()
  var formKeyValueClean = formKeyValue.replace("'", "").replace("'", "")
  return formKeyValueClean
}

export function getRandomNumber() {
  const min = 0.0
  const max = 100.0
  return Math.random() * (max - min) + min;
}

export function getRandomUserNumber() {
  const min = 0
  const max = 4
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getStartCurrentDateTime() {
  var date = new Date();
  var timeMil = date.getTime();

  return timeMil;
}

function createSingleAnnotation(dashboardUID, panelId, time, timeEnd, tags, text) {
  var url = 'http://localhost:3000/api/annotations';
  var payload = JSON.stringify({
    dashboardUID: dashboardUID,
    panelId: panelId,
    time: time,
    isRegion: true,
    tags: tags,
    text: text,
    timeEnd: timeEnd
  });
  var params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJrIjoiZEl3V2lERW03VDhlMG9mZ01kYzhheFBTcTM1V21BQ1QiLCJuIjoiQXBpLUtleSIsImlkIjoxfQ==`
    },
  };
  let createAnnotationResponse = http.post(url, payload, params);
  check(createAnnotationResponse, { 'Create annotation status was 200': (r) => r.status == 200 });
}

export function createAnnotations(dashboardId, time, timeEnd, tags, text) {
  createSingleAnnotation(dashboardId, 1, time, timeEnd, tags, text)
  createSingleAnnotation(dashboardId, 17, time, timeEnd, tags, text)
  createSingleAnnotation(dashboardId, 7, time, timeEnd, tags, text)
  createSingleAnnotation(dashboardId, 10, time, timeEnd, tags, text)
  createSingleAnnotation(dashboardId, 5, time, timeEnd, tags, text)
  createSingleAnnotation(dashboardId, 19, time, timeEnd, tags, text)
}