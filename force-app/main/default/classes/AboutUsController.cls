public with sharing class AboutUsController {
    @AuraEnabled(cacheable=true)
    public static CompanyInfo getCompanyInfo() {
        CompanyInfo info = new CompanyInfo();
        info.description = 'EventSphere Productions is a premier event management company specializing in concerts, conferences, and workshops.';
        info.mission = 'Our mission is to create unforgettable experiences by blending creativity, technology, and flawless execution.';
        info.features = new List<String>{'Seamless ticketing', 'Top-notch attendee support', 'Real-time event tracking', 'Comprehensive analytics'};
        return info;
    }

    public class CompanyInfo {
        @AuraEnabled public String description;
        @AuraEnabled public String mission;
        @AuraEnabled public List<String> features;
    }
}
