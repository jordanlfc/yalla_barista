

$("#start_form").validate({
	rules: {
		 email: {
			required: true,
			email:true,
        },
        password: {
			required: true,
			minlength:7, 	
		},
        repassword: {
            equalTo:'#password1'
        }
	},
	messages: {
		email: {
		   required: 'Enter your email address',
		   email: 'Must be an Email address'
       },
       password1:{
           minlength: 'Please enter at least 7 characters'
       }, 
       repassword:{
           equalTo: 'Passwords do not match'
       },
	}
});

$("#contact").validate({
	rules: {
		 email: {
			required: true,
            email:true,
         },
	},
	messages: {
		email: {
		   required: 'Enter your email address',
		   email: 'Must be an Email address'
       },
    }
});

$("#business_signup").validate({
	rules: {
		 email: {
			required: true,
            email:true,
         },
         password: {
			required: true,
			minlength:7, 	
		},
        repassword: {
            required:true,
            equalTo:'#spassword'
        },
        phone: {
            required: true,
            number:true
        },
        country: {
            required:true, 
        },
        city: {
            required:true, 
        },
        numemp: {
            required:true, 
            
        },
        agreed: {
            required:true,
        },
	},
	messages: {
		email: {
		   required: 'Enter your email address',
		   email: 'Must be an Email address'
       },
       repassword: {
           equalTo:'Passwords do not match'
       }
    }
});

$("#business_edit").validate({
	rules: {
		 email: {
			required: true,
            email:true,
         },
         password: {
			required: true,
			minlength:7, 	
		},
        repassword: {
            required:true,
            equalTo:'#spassword'
        },
        phone: {
            required: true,
            number:true
        },
        country: {
            required:true, 
        },
        city: {
            required:true, 
        },
        numemp: {
            required:true, 
            
        }
	},
	messages: {
		email: {
		   required: 'Enter your email address',
		   email: 'Must be an Email address'
       },
       repassword: {
           equalTo:'Passwords do not match'
       }
    }
});





