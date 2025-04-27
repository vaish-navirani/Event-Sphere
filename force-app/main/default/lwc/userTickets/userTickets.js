import { LightningElement, wire, track } from 'lwc';
import getUserTickets from '@salesforce/apex/BookingController.getUserTickets';

export default class UserTickets extends LightningElement {
    @track tickets = [];
    @track isLoading = true;
    @track error;
    @track showCancelBooking = false;
    @track cancellationComplete = false;

    @wire(getUserTickets)
    wiredTickets({ error, data }) {
        if (data) {
            console.log('Fetched Tickets:', JSON.stringify(data)); // Debugging

            // Ensure data integrity and prevent undefined errors
            this.tickets = data.map(ticket => {
                // Format date to display AM/PM
                let formattedDate = 'N/A';
                if (ticket.Event_Detail__r?.Start_Date__c) {
                    const dateObj = new Date(ticket.Event_Detail__r.Start_Date__c);
                    formattedDate = dateObj.toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    });
                }
                
                return {
                    Id: ticket.Id,
                    Name: ticket.Name,
                    EventName: ticket.Event_Detail__r?.Name || 'N/A',
                    Date: formattedDate,
                    Status: ticket.Status__c || 'Unknown'
                };
            });
            this.error = undefined;
        } else if (error) {
            console.error('Error fetching tickets:', error);
            this.error = 'Error loading tickets. Please try again later.';
            this.tickets = [];
        }
        this.isLoading = false;
    }

    handleCancel(event) {
        this.showCancelBooking = true;
    }

    handleCloseModal() {
        this.showCancelBooking = false;
    }
    
    handleCancellationComplete() {
        this.cancellationComplete = true;
        this.showCancelBooking = false;
    }
}