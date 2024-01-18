import BasePrechat from 'lightningsnapin/basePrechat';
import { api, track } from 'lwc';
import BackgroundImg from '@salesforce/resourceUrl/BackgroundImagePrechat';
import getContactDetails from '@salesforce/apex/PreChatController.getContactDetails';

export default class Prechatform extends BasePrechat {

    //@api prechatFields;
    @api backgroundImgURL;
    @track fields;
    @track namelist;
    showForm = false;
    imageUrl = BackgroundImg;

    get getBackgroundImage(){
        return `background-image:url("${this.imageUrl}")`;
    }

    connectedCallback() {
        this.fields =[
            {
                "name":"FirstName",
                 "label":"First Name",
                 "required":true,
                 "value":""

            },
            {
                "name":"LastName",
                 "label":"Last Name",
                 "required":true,
                 "value":""
            },
            {
                "name":"MobilePhone",
                 "label":"Mobile Phone",
                 "required":true,
                 "value":""
            }
        ];

        getContactDetails().then(
            (result)=>{
                console.log('Response::::'+JSON.stringify(result));
                if(result && result!=null && result.FirstName!=null && result.LastName!=null && result.MobilePhone!=null)
                {
                    console.log('Inside if');
                    this.fields[0].value = result.FirstName;
                    this.fields[1].value = result.LastName;
                    this.fields[2].value = result.MobilePhone;

                    if (this.validateFields(this.fields).valid) {
                        this.showForm = false;
                        this.startChat(this.fields);
                       // this.showForm = true;
                    } 
                }else{
                    this.showForm = true;
                }
            }
        ).catch((error)=>{
            console.log('Error::::'+JSON.stringify(error));
        });
        // this.fields = this.prechatFields.map(field => {
        //     const { label, name, value, required, maxLength } = field;
        //     console.log('Test:::::'+JSON.stringify(field));
        //     return { label, value, name, required, maxLength };
        // });
        this.namelist = this.fields.map(field => field.name);
    }

    renderedCallback() {
       // this.template.querySelector("lightning-input").focus();
    }

    handleStartChat() {

        let isValid = true;

        let inputFields = this.template.querySelectorAll('lightning-input');
        inputFields.forEach(inputField => {
            if(!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });

        if(isValid == false){
            return ;
        }
        this.template.querySelectorAll("lightning-input").forEach(input => {
            this.fields[this.namelist.indexOf(input.name)].value = input.value;
        });
        console.log('Is Valid::::'+this.validateFields(this.fields).valid);
        if (this.validateFields(this.fields).valid) {
            this.startChat(this.fields);
        } else {
            // Error handling if fields do not pass validation.
        }
     }
}