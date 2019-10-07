export interface UserInterface {

	firstName: string;		// first name of the user
	lastName: string;		// last name of the user
	username: string;		// username
	email: string;			// email address
	
	// the credentials of a user are variable depending on the auth type
	// each auth mechanism has its own branch of authorization protocols
	credentials?: {
		manual: {
			hash: string;
		}
	}

	// mongo specific
	_id: string;			// the document id
	createdAt: Date;		// when the document was created
	updatedAt: Date;		// when the document was last modified

}