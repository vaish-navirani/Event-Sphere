public with sharing class BookingController {
    
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getUserTickets() {
        List<Ticket__c> tickets = new List<Ticket__c>();
        
        try {
            // Get the logged-in user's ContactId
            User user = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];

            if (user.ContactId == null) {
                return tickets; // Return empty list if user has no Contact
            }

            // Fetch tickets related to the user
            tickets = [
                SELECT Id, Name, Ticket_Type__c, Price__c, Status__c, 
                       Check_in_Status__c, Purchase_Date__c, 
                       Event_Detail__c, Event_Detail__r.Name, Event_Detail__r.Start_Date__c
                FROM Ticket__c
                WHERE Contactmd__c = :user.ContactId
                ORDER BY Purchase_Date__c DESC
            ];

        } catch (Exception e) {
            System.debug('Error fetching tickets: ' + e.getMessage());
        }
        
        return tickets;
    }
}