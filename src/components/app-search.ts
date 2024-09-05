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
                top: 10px;
                left: 0;
                right: 0;
                display: flex;
                align-items: center;
                justify-content: center;
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
            <fluent-search type="text" @change="${($event: any) => this.search($event)}" placeholder="Search for photos"></fluent-search>
        `;
    }
}
