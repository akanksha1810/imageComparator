import Comparator from './pages/Comparator/index.js'

let component;

function getRouteBasedComponent() {
  const path = window.location.pathname;

  switch (path) {
    case "/":
      component = new Comparator(reRender);
      break;
    default:
      return `<div>Oops! this page doesn't exist (code: 404)</div>`;
  }
  return component.render();
}

function reRender() {
  document.getElementById("app").innerHTML = component.render();
}

function render() {
  document.getElementById("app").innerHTML = getRouteBasedComponent();
  component.attachListener && component.attachListener(); // attach listener only once
}

render();
