import './style.css'
import { initMap } from './components/Map.js'
import { initIdleTimer } from './components/IdleTimer.js'

document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app');
  if (app) {
    app.innerHTML = `
      <div class="kiosk-container">
        <div id="map-container"></div>
        <div id="modal-container"></div>
      </div>
    `;

    // Initialize components
    initMap(document.querySelector('#map-container'), document.querySelector('#modal-container'));
    initIdleTimer();
  }
});
