import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { HandleBookingDto } from './dto/handle-booking.dto';
import { CancelBookingDto } from './dto/cancel-booking.dto';
import { RegisterClientDto } from './dto/register-client.dto';
import { ReserveFlightDto } from './dto/reserve-flight.dto';
import { ProcessPaymentDto } from './dto/process-payment.dto';
import { RevertPaymentDto } from './dto/revert-payment.dto';

@Controller('orchestrator')
export class AppController {
  constructor(private readonly orchestratorService: AppService) {}

  @Post('reserve')
  async reserveFlight(@Body() reserveFlightDto: ReserveFlightDto) {
    try {
      return await this.orchestratorService.reserveFlight(
        reserveFlightDto.clientId,
        reserveFlightDto.flightId,
        reserveFlightDto.seatNumber
      );
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('pay')
  async processPayment(@Body() processPaymentDto: ProcessPaymentDto) {
    try {
      return await this.orchestratorService.processPayment(
        processPaymentDto.clientId,
        processPaymentDto.reservationId,
        processPaymentDto.amount
      );
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('cancel')
  async cancelBooking(@Body() cancelBookingDto: CancelBookingDto) {
    try {
      return await this.orchestratorService.cancelBooking(
        cancelBookingDto.flightId,
        cancelBookingDto.seatNumber,
      );
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('revert')
  async revertPayment(@Body() revertPaymentDto: RevertPaymentDto) {
    try {
      return await this.orchestratorService.revertPayment(revertPaymentDto.paymentId);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get('client')
  async getClient() {
    return await this.orchestratorService.getClient();
  }

  @Post('register')
  async registerClient(@Body() registerClientDto: RegisterClientDto) {
    return await this.orchestratorService.registerClient(registerClientDto);
  }

  @Get('flights')
  async getAllFlights() {
    return await this.orchestratorService.getAllFlights();
  }

  @Get('seats')
  async getAllSeats(@Query('flightId') flightId: number) {
    return await this.orchestratorService.getAllSeats(flightId);
  }
}
