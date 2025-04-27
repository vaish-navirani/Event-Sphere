import { LightningElement, wire, track } from 'lwc';
import getUpcomingEvents from '@salesforce/apex/EventController.getUpcomingEvents';
import getCurrentUserContactId from '@salesforce/apex/UserController.getCurrentUserContactId';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import TICKET_OBJECT from '@salesforce/schema/Ticket__c';
import EVENT_FIELD from '@salesforce/schema/Ticket__c.Event_Detail__c';
import CONTACT_FIELD from '@salesforce/schema/Ticket__c.Contactmd__c';
import PRICE_FIELD from '@salesforce/schema/Ticket__c.Price__c';
import QUANTITY_FIELD from '@salesforce/schema/Ticket__c.Quantity__c';
import TICKET_NAME_FIELD from '@salesforce/schema/Ticket__c.Name';
import STATUS_FIELD from '@salesforce/schema/Ticket__c.Status__c';
import PURCHASE_DATE_FIELD from '@salesforce/schema/Ticket__c.Purchase_Date__c';
import TICKET_TYPE_FIELD from '@salesforce/schema/Ticket__c.Ticket_Type__c';
import { getRecord } from 'lightning/uiRecordApi';
import CONTACT_NAME_FIELD from '@salesforce/schema/Contact.Name';

export default class EventBooking extends LightningElement {
    @track events = [];
    @track showModal = false;
    @track showDetailsModal = false;
    @track selectedEvent = {};
    @track contactId = '';
    @track contactName = '';
    ticketName = '';
    purchaseDate = '';
    ticketType = '';
    quantity = 1;

    ticketTypeOptions = [
        { label: 'General', value: 'General' },
        { label: 'VIP', value: 'VIP' },
        { label: 'Early Bird', value: 'Early Bird' }
    ];

    // Format all events data for display
    get formattedEvents() {
        return this.events.map(event => ({
            ...event,
            displayPrice: this.formatPrice(event.Price__c),
            formattedDate: this.formatDate(event.Start_Date__c)
        }));
    }

    // Format selected event data for details modal
    get formattedSelectedEvent() {
        return this.selectedEvent ? {
            ...this.selectedEvent,
            displayPrice: this.formatPrice(this.selectedEvent.Price__c),
            formattedDate: this.formatDate(this.selectedEvent.Start_Date__c)
        } : {};
    }

    // Price formatting helper
    formatPrice(amount) {
        return amount ? `₹${parseFloat(amount).toFixed(2)}` : '₹0.00';
    }
    

    // Date formatting helper
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        }).replace(',', '');
    }

    // Price calculations
    get computedPrice() {
        if (!this.selectedEvent?.Price__c) return 0;
        let price = parseFloat(this.selectedEvent.Price__c);
        if (this.ticketType === 'VIP') price += 500;
        else if (this.ticketType === 'Early Bird') price += 300;
        return price;
    }

    get displayComputedPrice() {
        return this.formatPrice(this.computedPrice);
    }

    get displayTotalPrice() {
        return this.formatPrice(this.computedPrice * this.quantity);
    }

    @wire(getUpcomingEvents)
    wiredEvents({ error, data }) {
        if (data) {
            this.events = data.map(event => ({
                ...event,
                Price__c: parseFloat(event.Price__c) || 0
            }));
        } else if (error) {
            this.showToast('Error', 'Error loading events', 'error');
        }
    }

    @wire(getCurrentUserContactId)
    wiredContact({ error, data }) {
        if (data) {
            this.contactId = data;
        } else if (error) {
            this.showToast('Error', 'Contact lookup failed', 'error');
        }
    }

    @wire(getRecord, { recordId: '$contactId', fields: [CONTACT_NAME_FIELD] })
    wiredContactRecord({ error, data }) {
        if (data) {
            this.contactName = data.fields.Name.value;
        } else if (error) {
            this.showToast('Error', 'Contact details error', 'error');
        }
    }

    handleBookNow(event) {
        this.selectedEvent = this.events.find(evt => evt.Id === event.target.dataset.id);
        this.showModal = true;
        const today = new Date();
        this.purchaseDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    }

    handleDetails(event) {
        this.selectedEvent = this.events.find(evt => evt.Id === event.target.dataset.id);
        this.showDetailsModal = true;
    }

    handleCloseModal() {
        this.showModal = false;
        this.showDetailsModal = false;
    }

    handleInputChange(event) {
        const field = event.target.name;
        const value = event.target.type === 'number' ? 
                     parseInt(event.target.value, 10) : 
                     event.target.value;
        
        if (field === 'quantity') {
            if (value < 1) return;
            this.quantity = value;
        } else {
            this[field] = value;
        }
    }

    handleSubmit() {
        if (!this.validateForm()) return;

        const fields = {
            [EVENT_FIELD.fieldApiName]: this.selectedEvent.Id,
            [CONTACT_FIELD.fieldApiName]: this.contactId,
            [PRICE_FIELD.fieldApiName]: this.computedPrice,
            [QUANTITY_FIELD.fieldApiName]: this.quantity,
            [TICKET_NAME_FIELD.fieldApiName]: this.ticketName,
            [PURCHASE_DATE_FIELD.fieldApiName]: `${this.purchaseDate}T00:00:00.000Z`,
            [TICKET_TYPE_FIELD.fieldApiName]: this.ticketType || 'General',
            [STATUS_FIELD.fieldApiName]: 'Purchased'
        };

        createRecord({ apiName: TICKET_OBJECT.objectApiName, fields })
            .then(() => {
                this.showToast('Success', `${this.quantity} tickets booked! Total: ${this.displayTotalPrice}`, 'success');
                this.showModal = false;
                this.resetForm();
            })
            .catch(error => {
                console.error('Error:', error);
                this.showToast('Error', error.body?.message || 'Ticket booking failed', 'error');
            });
    }

    validateForm() {
        if (!this.contactId) {
            this.showToast('Error', 'Contact information missing', 'error');
            return false;
        }
        if (!this.ticketName || !this.purchaseDate || this.quantity < 1) {
            this.showToast('Error', 'Please fill all required fields', 'error');
            return false;
        }
        return true;
    }

    resetForm() {
        this.ticketName = '';
        this.purchaseDate = '';
        this.ticketType = 'General';
        this.quantity = 1;
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant,
            mode: 'dismissable'
        }));
    }
}