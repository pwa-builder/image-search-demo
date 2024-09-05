import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js'

import './photo-item';

@customElement('photo-list')
export class PhotoList extends LitElement {

    @property({ type: Array }) files: any[] = [];

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

                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                grid-auto-rows: minmax(150px, auto);
                grid-gap: 12px
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

    render() {
        return html`
          <ul>
            ${this.files.map(file=> html`
              <li>
                <photo-item @select="${($event: CustomEvent) => this.handleSelect($event.detail.photo)}" @deselect="${($event: CustomEvent) => this.handleDeselect($event.detail.photo)}" .photoItem=${file}></photo-item>
              </li>
            `)}
          </ul>

        `;
    }
}
