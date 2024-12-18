export type AddressCreateData = {
    city: string;
    postal_code: string;
    street: string;
    house_number: string;
    // X_coordinate: Float32Array;
    // Y_coordinate: Float32Array;
};

export type OrderRegisterFormData = {
    pickup_address: AddressCreateData;
    delivery_address: AddressCreateData;
    pickup_date: string; // Date
};
