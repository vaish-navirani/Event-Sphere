import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FaqFlowLWC extends LightningElement {
    @api flowApiName = 'Knowledge_articles'; // Ensure this API name matches your flow
    @track showModal = false;

    handleStartFaq() {
        this.showModal = true;
    }

    handleCloseModal() {
        this.showModal = false;
    }

    handleFlowFinish(event) {
        console.log('Flow Finished:', event.detail);

        if (event.detail.status === 'ERROR') {
            console.error('Flow Error:', event.detail.error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Flow Execution Failed',
                    message: event.detail.error || 'An unknown error occurred',
                    variant: 'error'
                })
            );
        } else if (event.detail.status === 'FINISHED') {
            console.log('Flow finished successfully');
            this.handleCloseModal();
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Flow executed successfully!',
                    variant: 'success'
                })
            );
        } else {
            console.log('Flow Status:', event.detail.status);
        }
    }
}
