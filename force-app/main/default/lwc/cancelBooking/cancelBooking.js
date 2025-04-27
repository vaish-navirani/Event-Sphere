import { LightningElement, wire, track } from 'lwc';
import getCancellableBookings from '@salesforce/apex/BookingController.getUserTickets';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CancelBooking extends LightningElement {
    @track bookings = [];
    selectedBookingId;
    showCancelButton = true; // Control visibility of Cancel Booking button
    
    @wire(getCancellableBookings)
    wiredBookings({ error, data }) {
        if (data) {
            this.bookings = data.map(booking => ({
                label: `${booking.Event_Detail__r.Name} - ${booking.Name}`,
                value: booking.Id
            }));
        } else if (error) {
            this.showToast('Error', 'Error loading bookings', 'error');
        }
    }

    handleBookingChange(event) {
        this.selectedBookingId = event.detail.value;
    }

    handleCancelClick() {
        if (this.selectedBookingId) {
            this.showCancelButton = false; // Hide Cancel Booking button during process
            this.template.querySelector("lightning-flow").startFlow("Cancel_Booking_Flow", [
                {
                    name: "recordId", 
                    type: "String",
                    value: this.selectedBookingId
                }
            ]);
        } else {
            this.showToast('Warning', 'Please select a booking to cancel.', 'warning');
        }
    }
    
    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.dispatchEvent(new CustomEvent('cancellationcomplete'));
            this.showCancelButton = true; // Show Cancel Booking button after process completion
            this.showToast('Success', 'Your booking has been successfully cancelled.', 'success');
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({
            title,
            message,
            variant
        }));
    }
}
