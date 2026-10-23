export interface User {
    address: string | null;
    city: string | null;
    country: string | null;
    dateOfBirth: string | null;
    email: string;
    firstName: string;
    gender: string | null;
    id: string;
    isBlocked: boolean;
    lockoutEnd: string | null;
    maternalLastName: string | null;
    paternalLastName: string;
    phoneNumber: string | null;
    photoUrl: string | null;
    roles: string[];
    state: string | null;
    zipCode: string | null;
}