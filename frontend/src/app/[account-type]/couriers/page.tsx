"use client";
import React, { useEffect, useState, useCallback } from "react";
import UserCard from "@/components/userCard"; // Upewnij się, że ścieżka jest poprawna
import { jwtDecode } from "jwt-decode"; // Poprawny import jwtDecode
import { Heading, Stack, Spinner, Text, VStack } from "@chakra-ui/react";

interface Courier {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  status: string;
  homeAddress: {
    city: string;
    street: string;
    postalCode: string;
    houseNumber: string;
    apartmentNumber?: string;
  };
}

interface JwtPayload {
  exp: number;
  sub: string;
  account_type: string;
}

const AllCouriers = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCouriers = useCallback(async () => {
    try {
      setIsLoading(true); // Rozpoczęcie ładowania
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Brak tokena uwierzytelniającego.");
      }

      const decoded = jwtDecode<JwtPayload>(token);
      const { sub } = decoded;

      const response = await fetch(`http://localhost:8000/courier/complex_all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
      }

      const data: Courier[] = await response.json();
      console.log(data);

      setCouriers(data);
      setError(null);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCouriers();
  }, [fetchCouriers]);

  const handleDeleteSuccess = (id: string) => {
    setCouriers((prevCouriers) => prevCouriers.filter((courier) => courier.id !== id));
  };

  const handleUpdateSuccess = (updatedCourier: Courier) => {
    fetchCouriers();
  };

  if (isLoading) {
    return (
      <VStack spacing={4} align="center" justify="center" height="100vh">
        <Spinner size="xl" />
        <Text>Ładowanie kurierów...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <VStack spacing={4} align="center" justify="center" height="100vh">
        <Text color="red.500">{error}</Text>
      </VStack>
    );
  }

  return (
    <Stack direction="column" align="center" spacing={4} p={10}>
      <Heading size="lg">All Couriers</Heading>
      {couriers.length === 0 ? (
        <Text>Brak kurierów do wyświetlenia.</Text>
      ) : (
        couriers.map((courier) => (
          <UserCard
            key={courier.id} // Użycie unikalnego klucza
            id={courier.id}
            show_id={courier.id.slice(0, 16).replace(/-/g, "")}
            name={courier.name}
            surname={courier.surname}
            phoneNumber={courier.phoneNumber}
            status={courier.status}
            homeAddress={courier.homeAddress}
            onDeleteSuccess={handleDeleteSuccess} // Przekazanie callbacku do usuwania
            onUpdateSuccess={handleUpdateSuccess} // Przekazanie callbacku do aktualizacji
          />
        ))
      )}
    </Stack>
  );
};

export default AllCouriers;
