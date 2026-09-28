import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  mode: 'login' | 'register' = 'login';
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);
  submitting = signal(false);

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.errorMessage.set(null);
  }

  submit(): void {
    this.errorMessage.set(null);
    this.submitting.set(true);

    const request = { email: this.email, password: this.password };
    const call = this.mode === 'login' ? this.authService.login(request) : this.authService.register(request);

    call.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigateByUrl('/bookings');
      },
      error: (error) => {
        this.submitting.set(false);
        this.errorMessage.set(error?.error?.message ?? 'Something went wrong. Please try again.');
      }
    });
  }
}
