import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { fluentButton, fluentProgressRing, provideFluentDesignSystem } from '@fluentui/web-components';

provideFluentDesignSystem().register(fluentButton(), fluentProgressRing());

import './photo-item';

@customElement('photo-list')
export class PhotoList extends LitElement {

    @property({ type: Array }) files: any[] = [];

    @state() loading: boolean = false;

    selectedImages: any[] = [];

    static styles = [
        css`
            :host {
              display: block;

              overflow-y: scroll;
              height: 90vh;
            }

            :host::-webkit-scrollbar {
                display: none;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                margin-top: 10px;

                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-auto-rows: minmax(150px, auto);
                grid-gap: 12px
            }

            #welcome-block {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-top: 4em;
            }

            #welcome-block h2 {
              font-size: 38px;
              margin-bottom: 0px;
            }

            #welcome-block p {
              font-size: 14px;
              margin-bottom: 20px;
            }
        `
    ];

    async firstUpdated() {
        // const files = await getLocalFiles();
        // if (files) {
        //     this.files = files;
        //     console.log(files);

        //     // const { captionImage } = await import('../services/image-ai');
        //     // await captionImage(files[3]);
        //     const worker = new Worker(new URL('../services/image-ai.ts', import.meta.url), { type: 'module' });

        //     worker.onmessage = (e: any) => {
        //         if (e.data.type === 'caption') {
        //             console.log(e.data);
        //         }
        //     }

        //     worker.postMessage({ type: 'caption', blob: files[3] });
        // }
    }

    handleSelect(photoItem: any) {
        console.log(photoItem);
        this.selectedImages.push(photoItem);

        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                selectedImages: this.selectedImages
            }
        }));
    }

    handleDeselect(photoItem: any) {
        console.log(photoItem);
        this.selectedImages = this.selectedImages.filter((item) => item.id !== photoItem.id);

        this.dispatchEvent(new CustomEvent('select', {
            detail: {
                selectedImages: this.selectedImages
            }
        }));
    }

    handleImportClick() {
      this.loading = true;
      this.dispatchEvent(new CustomEvent('import'))
    }

    render() {
        return html`
          ${this.files.length > 0 ? html`<ul>
            ${this.files.map(file=> html`
              <li>
                <photo-item @select="${($event: CustomEvent) => this.handleSelect($event.detail.photo)}" @deselect="${($event: CustomEvent) => this.handleDeselect($event.detail.photo)}" .photoItem=${file}></photo-item>
              </li>
            `)}
          </ul>` : html`
            <div id="welcome-block">
              <h2>Local Image Search</h2>

              <p>Import your photos and search through them based on the content of the photos, all on your device!</p>

              <fluent-button ?disabled="${this.loading}" appearance="accent" @click="${() => this.handleImportClick()}">
                Import Photos
              </fluent-button>
            </div>
          `}

        `;
    }
}
