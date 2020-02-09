export interface LocationInterface {

	building: {
		name: string; 		// the name of the building
		address: string; 	// street address
		address2: string;	// suite, etc.
		city: string;
		zipcode: string;
		campus: string;
	}	

	roomNumber: string;		// the identifier of the actual room

	// mongo specific
	_id: string;			// the document id
	createdAt: Date;		// when the document was created
	updatedAt: Date;		// when the document was last modified

}