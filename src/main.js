import * as Scene from "./components/Scene.js"

function pageInIframe() {
    return (window.location !== window.parent.location);
}

if(!pageInIframe()) {
    console.log(1)
    document.querySelector('body').style.backgroundColor = "#000000"
}
Scene.Init(import.meta.env.MODE == "development");