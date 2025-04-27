public with sharing class TicketController {
    @AuraEnabled
    public static Id createTicket(
        String ticketName,
        String ticketType,
        Decimal price,
        String status,
        String checkinStatus,
        Id contactmdId,
        Id eventDetailId
    ) {
        Ticket__c ticket = new Ticket__c();
        ticket.Name = ticketName;
        ticket.Ticket_Type__c = ticketType;
        ticket.Price__c = price;
        ticket.Status__c = status;
        ticket.Check_in_Status__c = checkinStatus;
        ticket.Contactmd__c = contactmdId;
        ticket.Event_Detail__c = eventDetailId;

        insert ticket;
        return ticket.Id;
    }
    
    // New method to get tickets for the current user's contact
    @AuraEnabled(cacheable=true)
    public static List<Ticket__c> getTicketsForContact() {
        // Get the current user's Contact ID
        Id contactId = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()].ContactId;
        
        // Query tickets related to this contact
        return [
            SELECT Id, Name, Ticket_Type__c, Price__c, Status__c, 
                   Check_in_Status__c, Purchase_Date__c,
                   Event_Detail__c, Event_Detail__r.Name
            FROM Ticket__c
            WHERE Contactmd__c = :contactId
            ORDER BY Purchase_Date__c DESC
        ];
    }
}