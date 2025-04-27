@AuraEnabled
public static void createTicketRecord(Id contactId, Id eventId) {
    Ticket__c ticket = new Ticket__c();
    ticket.Contact__c = contactId;
    ticket.Event__c = eventId;

    // Optional: Add capacity check logic here

    insert ticket;
}
