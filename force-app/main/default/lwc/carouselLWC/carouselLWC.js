import { LightningElement, track } from 'lwc';
import event1 from '@salesforce/resourceUrl/event1';
import event2 from '@salesforce/resourceUrl/event2';
import event3 from '@salesforce/resourceUrl/event3';

export default class CarouselLWC extends LightningElement {
    @track currentIndex = 0;

    // Images list
    images = [
        { id: 1, src: event1, altText: 'Event 1' },
        { id: 2, src: event2, altText: 'Event 2' },
        { id: 3, src: event3, altText: 'Event 3' }
    ];

    interval;

    connectedCallback() {
        this.startAutoSlide();
    }

    disconnectedCallback() {
        clearInterval(this.interval);
    }

    startAutoSlide() {
        this.interval = setInterval(() => {
            this.nextSlide();
        }, 4000); // Change slide every 4 seconds
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }

    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    }

    // Getter to dynamically add active class
    get imagesWithClass() {
        return this.images.map((img, index) => ({
            ...img,
            className: index === this.currentIndex ? 'carousel-item active' : 'carousel-item'
        }));
    }
}
