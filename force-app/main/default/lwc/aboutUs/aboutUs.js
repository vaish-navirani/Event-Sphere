import { LightningElement, wire, track } from 'lwc';
import getCompanyInfo from '@salesforce/apex/AboutUsController.getCompanyInfo';

export default class AboutUs extends LightningElement {
    @track companyInfo;

    @wire(getCompanyInfo)
    wiredCompany({ error, data }) {
        if (data) {
            this.companyInfo = data;
        } else if (error) {
            console.error('Error fetching company info:', error);
        }
    }
}
