public class PreChatController {

    @AuraEnabled
    public static Contact getContactDetails()
    {
        Contact c= new Contact();
        List<User> listOfUser =[select id,username,UserType, 
                                 Contact.FirstName,Contact.LastName,Contact.MobilePhone 
                                  from User where id=:Userinfo.getUserId() and UserType!='Guest'];
        
        if(!listOfUser.isEmpty())
        {
            User u = listOfUser[0];
            c.FirstName = u.Contact.FirstName;
            c.LastName = u.Contact.LastName;
            c.MobilePhone = u.Contact.MobilePhone;  
        }
        return c;
    }
}