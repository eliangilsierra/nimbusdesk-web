import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AvailabilityResponse, BookingResponse, CreateBookingRequest } from './booking.model';

/**
 * Talks to nimbusdesk-booking-service through the gateway. Every call here goes
 * out with a JWT already attached by the auth interceptor.
 */
@Injectable({ providedIn: 'root' })
export class BookingService {

  private readonly baseUrl = `${environment.apiBaseUrl}/bookings`;

  constructor(private readonly http: HttpClient) {}

  checkAvailability(roomId: number, start: string, end: string): Observable<AvailabilityResponse> {
    const params = new HttpParams().set('roomId', roomId).set('start', start).set('end', end);
    return this.http.get<AvailabilityResponse>(`${this.baseUrl}/availability`, { params });
  }

  createBooking(request: CreateBookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.baseUrl, request);
  }

  getBooking(bookingId: number): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(`${this.baseUrl}/${bookingId}`);
  }

  cancelBooking(bookingId: number): Observable<BookingResponse> {
    return this.http.delete<BookingResponse>(`${this.baseUrl}/${bookingId}`);
  }
}
