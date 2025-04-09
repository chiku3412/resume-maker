import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html'
})
export class HeaderComponent implements AfterViewInit {
    constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
    
    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.setupNavbarToggle();
        }
    }

    private setupNavbarToggle(): void {
        const burgers: NodeListOf<Element> = document.querySelectorAll('.navbar-burger');
        const menus: NodeListOf<Element> = document.querySelectorAll('.navbar-menu');
        const closes: NodeListOf<Element> = document.querySelectorAll('.navbar-close');
        const backdrops: NodeListOf<Element> = document.querySelectorAll('.navbar-backdrop');

        if (burgers.length && menus.length) {
            burgers.forEach((burger) => {
                burger.addEventListener('click', () => {
                    menus.forEach((menu) => {
                        menu.classList.toggle('hidden');
                    });
                });
            });
        }

        if (closes.length) {
            closes.forEach((close) => {
                close.addEventListener('click', () => {
                    menus.forEach((menu) => {
                        menu.classList.toggle('hidden');
                    });
                });
            });
        }

        if (backdrops.length) {
            backdrops.forEach((backdrop) => {
                backdrop.addEventListener('click', () => {
                    menus.forEach((menu) => {
                        menu.classList.toggle('hidden');
                    });
                });
            });
        }
    }
}
