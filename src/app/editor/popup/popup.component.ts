import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'app-popup',
    template: `
        <span class="popup-icon" (click)="onClick()"></span>
        <span class="popup-callout"></span>
    `,
    styles: [
        `
            .popup-icon {
                background: #ff6358;
                color: white;
                padding: 8px;
                border-radius: 10%;
                display: block;
                width: 30px;
                height: 30px;
                cursor: pointer;
            }

            .popup-callout {
                border-top-color: #ff6358;
            }
        `,
    ],
})
export class PopupComponent {
    @HostBinding('style.position') public hostPosition = 'absolute';
    @HostBinding('style.zIndex') public zIndex = '2';
    @HostBinding('style.margin') public margin = '12px 0 0 -15px';
    @Input() public searchTerm: string = "";

    public onClick(): void {
        // window.open(`https://www.google.com/search?q=${this.searchTerm}`);
        console.log("do something")
    }
}