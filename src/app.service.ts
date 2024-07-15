import { Injectable } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  ClientProxy,
} from '@nestjs/microservices';
import { RegisterClientDto } from './dto/register-client.dto';

@Injectable()
export class AppService {
  private flightsClient: ClientProxy;
  private clientsClient: ClientProxy;
  private paymentsClient: ClientProxy;

  constructor() {
    this.flightsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3001 },
    });
    this.clientsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3002 },
    });
    this.paymentsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3003 },
    });
  }

  async cancelBooking(flightId: number, seatNumber: number) {
    return await this.flightsClient
      .send({ cmd: 'cancelReservation' }, { flightId, seatNumber })
      .toPromise();
  }

  async revertPayment(paymentId: number) {
    return await this.paymentsClient
      .send({ cmd: 'revertPayment' }, { paymentId })
      .toPromise();
  }

  async reserveFlight(clientId: number, flightId: number, seatNumber: number) {
    // Step 1: Verify Client
    const client = await this.clientsClient
      .send({ cmd: 'verifyClient' }, { clientId })
      .toPromise();
    if (!client) {
      throw new Error('Client not found');
    }

    // Step 2: Create Flight Reservation
    try {
      const reservation = await this.flightsClient
        .send({ cmd: 'createReservation' }, { clientId, flightId, seatNumber })
        .toPromise();
      return reservation;
    } catch (error) {
      throw new Error('Failed to reserve flight: ' + error.message);
    }
  }

  async processPayment(
    clientId: number,
    reservationId: number,
    amount: number,
  ) {
    try {
      // Step 3: Process Payment
      const payment = await this.paymentsClient
        .send({ cmd: 'processPayment' }, { clientId, reservationId, amount })
        .toPromise();
      return payment;
    } catch (error) {
      // Compensate by canceling the reservation
      const reservation = await this.flightsClient
        .send(
          { cmd: 'cancelReservation' },
          { flightId: reservationId, seatNumber: reservationId },
        )
        .toPromise();
      throw new Error(
        'Payment failed: ' + error.message + '. Reservation canceled.',
      );
    }
  }

  async getClient() {
    return await this.clientsClient
      .send({ cmd: 'getAllClient' }, {})
      .toPromise();
  }

  async registerClient(registerClientDto: RegisterClientDto) {
    return await this.clientsClient
      .send({ cmd: 'registerClient' }, registerClientDto)
      .toPromise();
  }

  async getAllFlights() {
    return await this.flightsClient
      .send({ cmd: 'getAllFlights' }, {})
      .toPromise();
  }

  async getAllSeats(flightId: number) {
    return await this.flightsClient
      .send({ cmd: 'getAllSeats' }, flightId)
      .toPromise();
  }
}
