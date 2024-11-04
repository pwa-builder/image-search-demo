import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

import { fluentSearch, provideFluentDesignSystem } from '@fluentui/web-components';
provideFluentDesignSystem().register(fluentSearch());


@customElement('app-search')
export class AppSearch extends LitElement {
    static styles = [
        css`
            :host {
                position: fixed;
                top: 6px;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media(prefers-color-scheme: dark) {
              fluent-search {
                --neutral-fill-input-rest: #2d2d2d;
                --neutral-fill-input-hover: #2d2d2d;
                --neutral-fill-input-active: #2d2d2d;
                --neutral-fill-input-focus: #2d2d2d;
                background: rgba(255, 255, 255, 0.06);
                border-radius: 6px;

                fill: white;
                color: white;

                box-shadow: rgba(0, 0, 0, 0.07) 0px 0px 6px 0px;
              }

              fluent-search::part(root) {
                --neutral-fill-input-rest: #2d2d2d;
                --neutral-fill-input-hover: #2d2d2d;
                --neutral-fill-input-active: #2d2d2d;
                --neutral-fill-input-focus: #2d2d2d;
                background: rgba(255, 255, 255, 0.06);
                border: none;
                border-radius: 6px;
              }
            }
        `
    ];

    async search(queryEvent: any) {
        console.log(queryEvent.target.value);
        const query = queryEvent.target.value;
        const { searchDB, getSingleFile } = await import('../services/files');
        const results = await searchDB(query);
        console.log(results);

        const fileResults = [];

        for await (const result of results) {
            console.log(result);
            const file = await getSingleFile(result.id);
            fileResults.push(file);
        }

        console.log(fileResults);

        // emit event
        this.dispatchEvent(new CustomEvent('search-results', {
            detail: {
                results: fileResults
            }
        }));

    }

    render() {
        return html`
            <fluent-search type="text" @change="${($event: any) => this.search($event)}" placeholder="Search in Gallery"></fluent-search>
        `;
    }
}
