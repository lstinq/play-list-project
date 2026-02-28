/**
 * Copyright 2026 Mandy Liu
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `play-list-project`
 * 
 * @demo index.html
 * @element play-list-project
 */
export class PlayListProject extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "play-list-project";
  }

  constructor() {
    super();
    this.title = "";
    this.index = 0;
    this.slides = [];
    this.slideCount = 0;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      index: { type: Number, reflect: true },
      slideCount: { type: Number },
    };
  }

  firstUpdated() {
    this.slides = Array.from(this.querySelectorAll("play-list-slide"));
    this.slideCount = this.slides.length;
    if (this.index >= this.slideCount) {
      this.index = Math.max(0, this.slideCount - 1);
    }
  }

  renderSlide(slide, i) {
    const top = slide.getAttribute("top-heading");
    const sub = slide.getAttribute("sub-heading");
    return html`
      <div class="slide-panel ${i === this.index ? "active" : ""}">
        ${top ? html`<p class="slide-top-heading">${top}</p>` : ""}
        ${sub ? html`<h2 class="slide-sub-heading">${sub}</h2>` : ""}
        <div class="slide-body" .innerHTML="${slide.innerHTML}"></div>
      </div>
      `;
  }

  prevSlide() {
    this.index = this.index > 0 ? this.index - 1 : this.slideCount - 1;
  }

  nextSlide() {
    this.index = this.index < this.slideCount - 1 ? this.index + 1 : 0;
  }

  handleKeyDown(e) {
    if (e.key === "ArrowLeft") {
      this.prevSlide();
    } else if (e.key === "ArrowRight") {
      this.nextSlide();
    }
  }

  goToSlide(i) {
    this.index = i;
    this.dispatchEvent(new CustomEvent("slide-changed", {
      composed: true,
      bubbles: true,
      detail: { index: i },
    }));
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        padding: var(--ddd-spacing-8);
      }
      .play-list-outer {
        display: flex;
        align-items: center;
        gap: var(--ddd-spacing-4);
        margin: 0;
      }
      .play-list-shell {
        flex: 1;
        display: flex;
        flex-direction: column;
        background-color: var(--ddd-theme-default-limestoneMaxLight);
        border-radius: var(--ddd-radius-md);
        box-shadow: 0 2px 16px rgba(0, 0, 0, 0.25);
        overflow: hidden;
      }
      .navigation-button {
        background: none;
        color: var(--ddd-theme-default-beaverBlue);
        border: 2px solid var(--ddd-theme-default-beaverBlue);
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        width: 48px;
        height: 48px;
        font-size: var(--ddd-font-size-l);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .navigation-button:hover {
        background-color: var(--ddd-theme-default-beaver80);
        color: white;
      }
      .play-list-body {
        flex: 1;
        display: flex;
        padding: var(--ddd-spacing-8) var(--ddd-spacing-8) 0;
        flex-direction: column;
      }
      .slide-viewport {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .slide-panel {
        display: none;
        flex-direction: column;
        flex: 1;
      }
      .slide-panel.active {
        display: flex;
      }
      .slide-top-heading {
        margin: 0;
        font-size: var(--ddd-font-size-xs);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-beaver80);
        text-transform: uppercase;
      }
      .slide-sub-heading {
        margin: 0;
        font-size: var(--ddd-font-size-xl);
        font-weight: var(--ddd-font-weight-bold);
        color: var(--ddd-theme-default-beaverBlue);
      }
      .slide-body {
        margin: 0;
        flex: 1;
        overflow-y: auto;
        width: 100%;
        max-width: 60ch;
        font-size: var(--ddd-font-size-xs);
        color: var(--ddd-theme-default-coalyGray);
      }
      .play-list-footer {
        padding: 0 var(--ddd-spacing-8) var(--ddd-spacing-8);
        display: flex;
        justify-content: left;
        gap: var(--ddd-spacing-2);
      }
      .slide-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: var(--ddd-theme-default-limestoneGray);
        opacity: 0.5;
        border: none;
        cursor: pointer;
      }
      .slide-indicator.active {
        background-color: var(--ddd-theme-default-beaverBlue);
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
    <div class="wrapper">
      <div class="play-list-outer">
        <button class="navigation-button" @click="${this.prevSlide}">&#8592;</button>
        <div class="play-list-shell" @keydown="${this.handleKeyDown}" tabindex="0">
          <div class="play-list-body">
            <div class="slide-viewport">
              ${this.slides.map((slide, i) => this.renderSlide(slide, i))}
            </div>
          </div>
          <div class="play-list-footer">
            ${this.slides.map((slide, i) => html`
              <button class="slide-indicator ${i === this.index ? "active" : ""}" @click="${() => this.goToSlide(i)}"></button>
            `)}
          </div>
      </div>
        <button class="navigation-button" @click="${this.nextSlide}">&#8594;</button>
      </div>
    </div>
    `;
  }
}

globalThis.customElements.define(PlayListProject.tag, PlayListProject);