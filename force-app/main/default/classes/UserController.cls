public with sharing class UserController {
    @AuraEnabled(cacheable=true)
    public static Id getCurrentUserContactId() {
        return [SELECT ContactId FROM User WHERE Id = :UserInfo.getUserId()].ContactId;
    }
}