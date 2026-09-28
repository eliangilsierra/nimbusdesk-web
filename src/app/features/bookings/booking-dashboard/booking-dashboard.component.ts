import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { BookingService } from '../booking.service';
import { BookingResponse, SEEDED_ROOMS } from '../booking.model';

@Component({
  selector: 'app-booking-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-dashboard.component.html',
  styleUrl: './booking-dashboard.component.css'
})
export class BookingDashboardComponent {

  readonly rooms = SEEDED_ROOMS;

  roomId = SEEDED_ROOMS[0].id;
  startTime = '';
  endTime = '';

  availability = signal<boolean | null>(null);
  booking = signal<BookingResponse | null>(null);
  lookupId: number | null = null;
  errorMessage = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private readonly bookingService: BookingService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  get currentEmail() {
    return this.authService.currentEmail();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  checkAvailability(): void {
    if (!this.startTime || !this.endTime) {
      return;
    }
    this.reset();
    this.loading.set(true);
    this.bookingService.checkAvailability(this.roomId, this.startTime, this.endTime).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.availability.set(response.available);
      },
      error: (error) => this.handleError(error)
    });
  }

  createBooking(): void {
    if (!this.startTime || !this.endTime) {
      return;
    }
    this.reset();
    this.loading.set(true);
    this.bookingService
      .createBooking({
        roomId: this.roomId,
        requestedBy: this.currentEmail ?? 'unknown',
        startTime: this.startTime,
        endTime: this.endTime
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.booking.set(response);
        },
        error: (error) => this.handleError(error)
      });
  }

  lookupBooking(): void {
    if (!this.lookupId) {
      return;
    }
    this.reset();
    this.loading.set(true);
    this.bookingService.getBooking(this.lookupId).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.booking.set(response);
      },
      error: (error) => this.handleError(error)
    });
  }

  cancelCurrentBooking(): void {
    const current = this.booking();
    if (!current) {
      return;
    }
    this.loading.set(true);
    this.bookingService.cancelBooking(current.id).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.booking.set(response);
      },
      error: (error) => this.handleError(error)
    });
  }

  roomName(roomId: number): string {
    return this.rooms.find((room) => room.id === roomId)?.name ?? `Room ${roomId}`;
  }

  private reset(): void {
    this.availability.set(null);
    this.booking.set(null);
    this.errorMessage.set(null);
  }

  private handleError(error: any): void {
    this.loading.set(false);
    this.errorMessage.set(error?.error?.message ?? 'Something went wrong. Please try again.');
  }
}
