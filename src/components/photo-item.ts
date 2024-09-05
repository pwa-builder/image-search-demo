import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import { router } from '../router';

@customElement('photo-item')
export class PhotoItem extends LitElement {
    @property() photoItem: any = null;

    @state() thumbSrc: any | undefined;
    @state() ani: Animation | undefined;
    @state() hover: boolean = false;
    @state() selected: boolean = false

    static styles = [
        css`
            :host {
                display: block;
            }

            img {
                object-fit: cover;
                width: 100%;
                height: 26em;
                border-radius: 6px;

                opacity: 0;
                animation: fadein 1s;
                animation-fill-mode: forwards;
            }

            a {
                cursor: pointer;
                text-decoration: none;
                color: inherit;
                display: flex;
                align-items: center;
                justify-content: center;

                background: #8080803b;
                border-radius: 6px;

                transition: scale 0.3s;
            }

            a:hover {
                scale: 0.98;
            }

            a.selected {
               scale: 0.95;
               border: inset 2px #0078d4;
           }

            #test {
                z-index: 9999;
                position: absolute;
                opacity: 0;
                box-shadow: 0 0 14px 1px #00000075;
                border-radius: 6px;
                padding: 4px;
                display: flex;
                flex-direction: column;

                background: #1a2030ad;
                backdrop-filter: blur(40px);
                padding: 8px;

                width: 6em;
                height: 5em;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            #test button {
                border: none;
                margin-bottom: 6px;
                color: white;

                background: rgba(26, 32, 48, 0.68);
                /* backdrop-filter: blur(40px); */
                border: none;
                margin-bottom: 6px;
                color: white;
                align-items: center;
                background: transparent;
                padding-left: 0;
                display: flex;
                justify-content: flex-start;
                cursor: pointer;

                padding-bottom: 6px;
                border-bottom: 1px solid #4e4e4e;
            }

            #photoActions {
                background: rgb(255 255 255 / 10%);
                backdrop-filter: blur(40px);
                padding: 6px;
                margin-top: 0;
                border-radius: 6px;

                position: relative;
                top: -34px;
            }

            .folder {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }

            @keyframes fadein {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        `
    ];

    async firstUpdated() {
        // get thumbnail when in view with IntersectionObserver
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    window.requestIdleCallback(async () => {
                        await this.getThumbnail();
                        this.setupEvents();


                        observer.unobserve(entry.target);
                    }, { timeout: 300 });
                }
            });
        });

        observer.observe(this);
    }

    // if this.photoItem is updated, get thumbnail
    updated(changedProperties: any) {
        if (changedProperties.has('photoItem')) {
            this.getThumbnail();
        }
    }

    setupEvents() {
        // this.oncontextmenu = async (event: any) => {
        //     event.preventDefault();

        //     const rightClickEl: any = this.shadowRoot?.querySelector('#test');

        //     if (rightClickEl) {
        //         rightClickEl.style.top = `${event.clientY}px`;
        //         rightClickEl.style.left = `${event.clientX}px`;

        //         this.ani = rightClickEl.animate([
        //             { transform: 'translateY(0)', opacity: 0 },
        //             { transform: 'translateY(20px)', opacity: 1 }
        //         ], {
        //             duration: 100,
        //             fill: 'both'
        //         })
        //     }

        //     let that = this;
        //     this.shadowRoot?.querySelector('div')?.addEventListener('click', async function close($event) {
        //         $event.preventDefault();
        //         rightClickEl.animate([
        //             { transform: 'translateY(20px)', opacity: 1 },
        //             { transform: 'translateY(0)', opacity: 0 }
        //         ], {
        //             duration: 100,
        //             fill: 'both'
        //         });

        //         that.shadowRoot?.querySelector('div')?.removeEventListener('click', close);
        //         $event.preventDefault();
        //     });

        // }

        // on user hover on this custom element
        this.addEventListener("mouseenter", () => {
            console.log("here");
            this.hover = true;
        });

        this.addEventListener("mouseleave", () => {
            this.hover = false;
        });
    }

    private async getThumbnail() {
        console.log(this.photoItem);

        let file;
        try {
            file = await this.photoItem.getFile();
            this.thumbSrc = URL.createObjectURL(file);

        }
        catch (err) {
            this.thumbSrc = URL.createObjectURL(this.photoItem.blob);


        }
    }

    async share() {
        // share file
        console.log(this.photoItem)
        if (this.photoItem["@microsoft.graph.downloadUrl"] && this.photoItem.name) {
            const response = await fetch(this.photoItem.downloadUrl);
            const blob = await response.blob();
            console.log(blob);

            // turn blob to file
            const file = new File([blob], this.photoItem.name, {
                type: blob.type
            });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: this.photoItem.name,
                    text: 'Shared from Photos',
                })
            }
        }
        else {
            if (navigator.canShare && navigator.canShare({ files: [this.photoItem] })) {
                await navigator.share({
                    files: [this.photoItem],
                    title: this.photoItem.name,
                    text: 'Shared from Photos',
                })
            }
        }

        await this.ani?.reverse();
    }

    async download() {
        // download file from download url
        if (this.photoItem["@microsoft.graph.downloadUrl"] && this.photoItem.name) {
            const response = await fetch(this.photoItem["@microsoft.graph.downloadUrl"]);
            const blob = await response.blob();
            console.log(blob);

            const { fileSave } = await import("browser-fs-access");
            await fileSave(blob, {
                fileName: this.photoItem.name
            });
        }
        else {
            const file = await this.photoItem;
            const { fileSave } = await import("browser-fs-access");
            await fileSave(file, {
                fileName: file.name
            });
        }

        await this.ani?.reverse();
    }

    // make image element fullscreen
    async fullscreen() {
        const img = this.shadowRoot?.querySelector('img');
        if (img) {
            img.requestFullscreen();
        }
    }

    async openPhoto() {
        // @ts-ignore
        const imageEl = this.shadowRoot?.querySelector("img");

        if (imageEl) {
            // @ts-ignore
            imageEl.style.viewTransitionName = "photo-item";
            console.log(imageEl);
        }

        // this.shadowRoot?.querySelector("img").style.viewTransitionName = "photo-item";
        // @ts-ignore
        await document.startViewTransition();
        router.navigate(`/photo/${this.photoItem.id}?id=${this.photoItem.id}&name=${this.photoItem.name}`)
    }

    async selectPhoto() {
        if (!this.selected) {
            this.selected = true;

            this.dispatchEvent(new CustomEvent('select', {
                detail: {
                    photo: this.photoItem
                }
            }));
        }
        else {
            this.selected = false;

            this.dispatchEvent(new CustomEvent('deselect', {
                detail: {
                    photo: this.photoItem
                }
            }));
        }
    }

    render() {
        return html`
        <div class="main">
            ${this.thumbSrc ? html`<a class=${classMap({ selected: this.selected })} @click="${() => this.selectPhoto()}">
                <img src=${this.thumbSrc} alt=${this.photoItem.name} />
            </a>
            ` : html`<sl-skeleton height="11em"></sl-skeleton>`}
        </div>
        `;
    }
}
