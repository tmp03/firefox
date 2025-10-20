/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* global PanelMultiView */

const { require } = ChromeUtils.importESModule(
  "resource://devtools/shared/loader/Loader.sys.mjs"
);
const QR = require("devtools/shared/qrcode/index");

/**
 * Manages the QR code panel that displays a QR code for the current page URL.
 */
var gQRCodePanel = {
  _panel: null,

  /**
   * Get or create the QR code panel.
   */
  get panel() {
    if (!this._panel) {
      let template = document.getElementById("qrCodePanelTemplate");
      if (template) {
        template.replaceWith(template.content);
      }
      this._panel = document.getElementById("qrCodePanel");
    }
    return this._panel;
  },

  /**
   * Show the QR code panel for the current page URL.
   * @param {Element} anchorElement - The element to anchor the panel to.
   * @param {string} url - The URL to encode in the QR code.
   * @param {Event} triggerEvent - The event that triggered the panel.
   */
  async show(anchorElement, url, triggerEvent) {
    if (!url) {
      console.error("No URL provided for QR code generation");
      return;
    }

    try {
      // Generate QR code
      const imgData = QR.encodeToDataURI(url, "L");

      // Get the QR code image container
      const qrImageElement = document.getElementById("qrCodeImage");
      if (qrImageElement) {
        qrImageElement.style.backgroundImage = `url("${imgData.src}")`;
      }

      // Show the panel
      PanelMultiView.openPopup(this.panel, anchorElement, {
        position: "bottomright topright",
        triggerEvent,
      }).catch(console.error);
    } catch (error) {
      console.error("Failed to generate QR code:", error);
    }
  },

  /**
   * Hide the QR code panel.
   */
  hide() {
    if (this._panel) {
      PanelMultiView.hidePopup(this._panel);
    }
  },
};
