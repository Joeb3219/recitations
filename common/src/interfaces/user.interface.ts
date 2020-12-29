export interface UserInterface {
    id: string; // the id of the user
    firstName: string; // first name of the user
    lastName: string; // last name of the user
    username: string; // username
    email: string; // email address

    passwordHash?: string; // bcrypt hash of the user's password, if they have one
}
