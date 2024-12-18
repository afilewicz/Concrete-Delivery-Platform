export type RegisterData = {
  name: string;
  surname: string;
  phone_number: string;
  email_address: string;
  password: string;
};

export type AddressCreateData = {
    city: string;
    postal_code: string;
    street: string;
    house_number: string;
    apartment_number: string;
    // X_coordinate: Float32Array;
    // Y_coordinate: Float32Array;
};

export type OrderRegisterFormData = {
    pickup_address: AddressCreateData;
    delivery_address: AddressCreateData;
    order_date: string; // Date
};
