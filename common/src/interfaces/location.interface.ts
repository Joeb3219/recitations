export interface LocationInterface {
    building: {
        name: string; // the name of the building
        address: string; // street address
        address2: string; // suite, etc.
        city: string;
        zipcode: string;
        campus: string;
    };

    roomNumber: string; // the identifier of the actual room
}
