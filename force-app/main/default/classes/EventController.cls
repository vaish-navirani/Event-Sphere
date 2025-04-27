public with sharing class EventController {
    
    // Fetch upcoming events
    @AuraEnabled(cacheable=true)
    public static List<Event_Detail__c> getUpcomingEvents() {
        return [SELECT Id, Name, Price__c, Start_Date__c, Venue__c, Available_Seats__c ,Event_Type__c
                FROM Event_Detail__c 
                WHERE Start_Date__c >= TODAY];
    }

    // Fetch the logged-in user's Contact Id
    @AuraEnabled(cacheable=true)
    public static Id getUserContact() {
        User currentUser = [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId() LIMIT 1];
        return currentUser.ContactId;
    }
}
