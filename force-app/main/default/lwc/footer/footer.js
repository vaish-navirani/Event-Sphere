import { LightningElement } from 'lwc';

export default class Footer extends LightningElement {
    // Static contact information
    email = 'EventSphere123@gmail.com';
    phone = '9876543210';
    address = 'EventSphere, 123 Concert Street, Plymouth, 560066';

    // Social Media Icons list
    socialMediaIcons = [
        { icon: 'utility:photo', alt: 'Instagram' },
        { icon: 'utility:share', alt: 'Facebook' },
        { icon: 'utility:photo', alt: 'Pinterest' }
    ];

    // ✅ Getters for href values to avoid inline concatenation in HTML
    get mailtoLink() {
        return `mailto:${this.email}`;
    }

    get telLink() {
        return `tel:${this.phone}`;
    }
    
}
